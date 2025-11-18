import { Workflow } from "@/types/workflow";

const API_BASE = "https://flowmind-ai-flowmind-core-api.hf.space/api";

// Debug mode - console'da tüm API çağrılarını göster (sadece development'ta)
const DEBUG = process.env.NODE_ENV !== 'production';

export interface ApiError {
  message: string;
  status?: number;
}

// API Response wrapper
interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Token'ı localStorage'dan al (client-side için)
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (e) {
    console.error("Error reading auth token:", e);
  }
  return null;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  requireAuth: boolean = true
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`;
    if (DEBUG) {
      console.log(`🌐 API Request: ${options?.method || "GET"} ${url}`);
      if (options?.body && typeof options.body === "string") {
        try {
          const bodyObj = JSON.parse(options.body);
          console.log("📤 Request Body:", { ...bodyObj, password: bodyObj.password ? "***" : undefined });
        } catch {
          console.log("📤 Request Body:", options.body);
        }
      }
    }
    
    // Token'ı header'a ekle (auth gerektiren endpoint'ler için)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> || {}),
    };
    
    if (requireAuth) {
      const token = getAuthToken();
      if (DEBUG) {
        console.log("🔑 Auth Token:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No auth token found for protected endpoint:", endpoint);
      }
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // 401 Unauthorized - Token geçersiz veya süresi dolmuş
      if (response.status === 401 && requireAuth) {
        console.error("❌ 401 Unauthorized - Token geçersiz veya eksik");
        // Token'ı temizle ve logout yap
        if (typeof window !== "undefined") {
          // Auth store'u da temizle
          try {
            const { useAuthStore } = require("@/store/authStore");
            useAuthStore.getState().logout();
          } catch (e) {
            console.error("Error clearing auth store:", e);
          }
          localStorage.removeItem("auth-storage");
          // Sayfayı login'e yönlendir
          window.location.href = "/login";
        }
      }
      
      let errorText = "";
      let errorJson: any = null;
      let rawErrorText = ""; // Raw error text'i sakla
      
      try {
        rawErrorText = await response.text();
        errorText = rawErrorText;
        console.error(`❌ API Error (${response.status}):`, rawErrorText);
        console.error(`❌ API Error URL:`, url);
        console.error(`❌ API Error Headers:`, Object.fromEntries(response.headers.entries()));
        
        // JSON ise parse et (string içinde JSON olabilir)
        try {
          // Önce direkt parse et
          errorJson = JSON.parse(errorText);
          console.error("❌ API Error JSON:", errorJson);
          
          // Farklı hata formatlarını kontrol et
          errorText = 
            errorJson.message || 
            errorJson.detail || 
            errorJson.error || 
            errorJson.msg ||
            errorJson.description ||
            (typeof errorJson === "string" ? errorJson : errorText);
        } catch (parseError) {
          // JSON string içinde JSON olabilir (örn: "{\"detail\":\"...\"}")
          try {
            // Eğer errorText bir JSON string ise (çift tırnak içinde)
            if (errorText.trim().startsWith('"') && errorText.trim().endsWith('"')) {
              const unquoted = JSON.parse(errorText);
              errorJson = JSON.parse(unquoted);
              console.error("❌ API Error JSON (nested):", errorJson);
              
              errorText = 
                errorJson.message || 
                errorJson.detail || 
                errorJson.error || 
                errorJson.msg ||
                errorJson.description ||
                unquoted;
            } else {
              // JSON değilse olduğu gibi kullan
              console.error("❌ API Error (not JSON):", errorText);
              if (errorText && errorText.trim()) {
                errorText = errorText.trim();
              }
            }
          } catch {
            // JSON değilse olduğu gibi kullan
            console.error("❌ API Error (not JSON):", errorText);
            // Backend'den gelen raw error text'i kullan
            if (errorText && errorText.trim()) {
              errorText = errorText.trim();
            }
          }
        }
        
        // Raw error text'te "User created" kontrolü yap (parse edilmiş errorText'te olmayabilir)
        const rawErrorLower = rawErrorText.toLowerCase();
        if (rawErrorLower.includes("user created") || 
            rawErrorLower.includes("kullanıcı oluşturuldu") ||
            (response.status === 500 && rawErrorLower.includes("failed to send"))) {
          console.log("🔍 Raw error text'te 'User created' bulundu, errorText'e ekleniyor");
          // Eğer errorText generic bir mesaj ise, raw error text'i kullan
          if (!errorText || errorText === "Internal Server Error" || errorText.includes("Sunucu hatası")) {
            errorText = rawErrorText;
          }
        }
      } catch (e) {
        console.error("❌ Error reading response:", e);
        errorText = `HTTP error! status: ${response.status}`;
      }
      
      // Özel hata mesajları için Türkçe çeviriler
      if (response.status === 400) {
        // 400 Bad Request - Validation hatası veya email zaten kayıtlı
        if (errorText.toLowerCase().includes("email already registered") || 
            errorText.toLowerCase().includes("email already exists") ||
            errorText.toLowerCase().includes("kullanıcı zaten kayıtlı")) {
          errorText = "Bu email adresi zaten kayıtlı. Lütfen farklı bir email kullanın veya giriş yapın.";
        } else if (errorText.toLowerCase().includes("invalid email")) {
          errorText = "Geçersiz email adresi. Lütfen geçerli bir email adresi girin.";
        } else if (errorText.toLowerCase().includes("password")) {
          errorText = "Şifre gereksinimlerini karşılamıyor. Lütfen kontrol edin.";
        }
      } else if (response.status === 401) {
        // 401 Unauthorized
        if (!errorText || errorText === "Unauthorized") {
          errorText = "Email veya şifre hatalı. Lütfen tekrar deneyin.";
        }
      } else if (response.status === 500) {
        // 500 Internal Server Error için daha açıklayıcı mesaj
        if (errorText && errorText !== "Internal Server Error") {
          // Backend'den özel bir mesaj gelmişse onu kullan
        } else {
          errorText = "Sunucu hatası oluştu. Lütfen backend log'larını kontrol edin veya daha sonra tekrar deneyin.";
        }
      }
      
      return {
        error: {
          message: errorText || `HTTP error! status: ${response.status}`,
          status: response.status,
        },
      };
    }

    // DELETE için body olmayabilir
    if (options?.method === "DELETE") {
      // 204 No Content için body yok
      if (response.status === 204) {
        return { data: undefined as T };
      }
      // 200 OK için body olabilir veya olmayabilir
      if (response.status === 200) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            return { data };
          } catch {
            return { data: undefined as T };
          }
        }
        return { data: undefined as T };
      }
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
}

// Backend'den gelen snake_case formatını frontend camelCase formatına çevir
function normalizeWorkflowFromBackend(workflow: any): Workflow {
  const graphJson = (workflow.graph_json || workflow.graphJson || {});
  
  // Boş obje {} ise veya nodes/edges yoksa normalize et
  const normalizedGraphJson = {
    nodes: Array.isArray(graphJson.nodes) ? graphJson.nodes : [],
    edges: Array.isArray(graphJson.edges) ? graphJson.edges : [],
  };

  return {
    id: String(workflow.id),
    name: workflow.name || "",
    description: workflow.description || "",
    isActive: workflow.is_active ?? workflow.isActive ?? false,
    createdAt: workflow.created_at || workflow.createdAt || "",
    updatedAt: workflow.updated_at || workflow.updatedAt || "",
    graphJson: normalizedGraphJson,
  };
}

// Frontend'den backend'e gönderirken camelCase'i snake_case'e çevir
function normalizeWorkflowToBackend(workflow: Partial<Workflow>): any {
  const graphJson = workflow.graphJson || { nodes: [], edges: [] };
  
  console.log("🔄 normalizeWorkflowToBackend - Input:", workflow);
  console.log("🔄 normalizeWorkflowToBackend - graphJson:", graphJson);
  console.log("🔄 normalizeWorkflowToBackend - nodes:", graphJson.nodes);
  console.log("🔄 normalizeWorkflowToBackend - edges:", graphJson.edges);
  
  const result = {
    name: workflow.name,
    description: workflow.description,
    is_active: workflow.isActive,
    graph_json: {
      nodes: graphJson.nodes || [],
      edges: graphJson.edges || [],
    },
  };
  
  console.log("🔄 normalizeWorkflowToBackend - Output:", JSON.stringify(result, null, 2));
  
  return result;
}

// Workflow API functions
export const workflowApi = {
  // GET /workflows/ - Get all workflows
  getAll: async (): Promise<ApiResponse<Workflow[]>> => {
    const response = await apiRequest<any[]>("/workflows/");
    // API'den gelen workflow'ları normalize et
    if (response.data) {
      response.data = response.data.map(normalizeWorkflowFromBackend);
    }
    return response as ApiResponse<Workflow[]>;
  },

  // GET /workflows/:id - Get single workflow
  getById: async (id: string): Promise<ApiResponse<Workflow>> => {
    // ID'yi encode et ve temizle
    const cleanId = String(id).trim();
    if (!cleanId) {
      return {
        error: {
          message: "Workflow ID is required",
        },
      };
    }
    const response = await apiRequest<any>(`/workflows/${encodeURIComponent(cleanId)}`);
    // API'den gelen workflow'u normalize et
    if (response.data) {
      response.data = normalizeWorkflowFromBackend(response.data);
    }
    return response as ApiResponse<Workflow>;
  },

  // POST /workflows/ - Create new workflow
  create: async (workflow: Partial<Workflow>): Promise<ApiResponse<Workflow>> => {
    const workflowData = normalizeWorkflowToBackend(workflow);
    const response = await apiRequest<any>("/workflows/", {
      method: "POST",
      body: JSON.stringify(workflowData),
    });
    // API'den dönen workflow'u normalize et
    if (response.data) {
      response.data = normalizeWorkflowFromBackend(response.data);
    }
    return response as ApiResponse<Workflow>;
  },

  // PUT /workflows/:id - Update workflow
  update: async (
    id: string,
    workflow: Partial<Workflow>
  ): Promise<ApiResponse<Workflow>> => {
    // ID'yi encode et ve temizle
    const cleanId = String(id).trim();
    if (!cleanId) {
      return {
        error: {
          message: "Workflow ID is required",
        },
      };
    }
    const workflowData = normalizeWorkflowToBackend(workflow);
    const response = await apiRequest<any>(`/workflows/${encodeURIComponent(cleanId)}`, {
      method: "PUT",
      body: JSON.stringify(workflowData),
    });
    // API'den dönen workflow'u normalize et
    if (response.data) {
      response.data = normalizeWorkflowFromBackend(response.data);
    }
    return response as ApiResponse<Workflow>;
  },

  // DELETE /workflows/:id - Delete workflow
  delete: async (id: string): Promise<ApiResponse<void>> => {
    // ID'yi encode et ve temizle
    const cleanId = String(id).trim();
    if (!cleanId) {
      return {
        error: {
          message: "Workflow ID is required",
        },
      };
    }
    return apiRequest<void>(`/workflows/${encodeURIComponent(cleanId)}`, {
      method: "DELETE",
    });
  },
};

// Auth API functions
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export const authApi = {
  // POST /api/auth/login - Login
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiRequest<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false); // Auth gerektirmez
    
    if (response.data) {
      const rawData = response.data;
      
      // Token'ı bul - farklı formatları kontrol et
      const token = 
        rawData.token || 
        rawData.access_token || 
        rawData.accessToken ||
        rawData.jwt_token ||
        rawData.jwt ||
        "";
      
      // User bilgilerini bul
      let userId = "";
      let userEmail = "";
      let userName = "";
      
      if (rawData.user) {
        userId = String(rawData.user.id || rawData.user.user_id || "");
        userEmail = rawData.user.email || "";
        userName = rawData.user.name || rawData.user.full_name || "";
      } else {
        userId = String(rawData.user_id || rawData.id || "");
        userEmail = rawData.email || "";
        userName = rawData.name || rawData.full_name || "";
      }
      
      // Backend'den gelen snake_case formatını normalize et
      response.data = {
        user: {
          id: userId,
          email: userEmail,
          name: userName,
        },
        token: token,
      };
    }
    
    return response as ApiResponse<LoginResponse>;
  },

  // POST /api/auth/register - Register
  register: async (
    email: string,
    password: string,
    name?: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    // Backend'e gönderilecek data
    // Backend full_name bekliyor, name değil!
    const requestData: any = { 
      email: email.trim().toLowerCase(), // Email'i lowercase yap
      password: password,
    };
    
    // Backend full_name bekliyor
    if (name && name.trim()) {
      requestData.full_name = name.trim();
    }
    
    const response = await apiRequest<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(requestData),
    }, false); // Auth gerektirmez
    
    if (response.error) {
      // Özel durum: Eğer hata mesajı "User created" içeriyorsa, 
      // kullanıcı oluşturulmuş demektir, bu yüzden response'u başarılı gibi işaretle
      const errorMessage = (response.error.message || "").toLowerCase();
      if (errorMessage.includes("user created") || 
          errorMessage.includes("kullanıcı oluşturuldu") ||
          (response.error.status === 500 && errorMessage.includes("failed to send"))) {
        // Error'u null yap, data'yı set et
        response.error = undefined as any;
        response.data = {
          user: {
            id: "",
            email: email,
            name: name,
          },
          token: "",
        } as RegisterResponse;
        return response as ApiResponse<RegisterResponse>;
      }
      
      return response as ApiResponse<RegisterResponse>;
    }
    
    // Backend başarılı response döndürdü (error yok)
    if (response.data) {
      const rawData = response.data;
      
      // Eğer backend sadece { message: "..." } döndürüyorsa, minimal bir response oluştur
      if (rawData.message && !rawData.user && !rawData.token) {
        response.data = {
          user: {
            id: "",
            email: email,
            name: name,
          },
          token: "",
        } as RegisterResponse;
      } else {
        // Normalize et (varsa)
        const token = 
          rawData.token || 
          rawData.access_token || 
          rawData.accessToken ||
          rawData.jwt_token ||
          rawData.jwt ||
          "";
        
        let userId = "";
        let userEmail = email;
        let userName = name;
        
        if (rawData.user) {
          userId = String(rawData.user.id || rawData.user.user_id || "");
          userEmail = rawData.user.email || userEmail;
          userName = rawData.user.name || rawData.user.full_name || userName;
        } else if (rawData.user_id || rawData.id) {
          userId = String(rawData.user_id || rawData.id || "");
          userEmail = rawData.email || userEmail;
          userName = rawData.name || rawData.full_name || userName;
        }
        
        response.data = {
          user: {
            id: userId,
            email: userEmail,
            name: userName,
          },
          token: token,
        } as RegisterResponse;
      }
    } else {
      // Backend data döndürmedi ama error da yok, başarılı say
      response.data = {
        user: {
          id: "",
          email: email,
          name: name,
        },
        token: "",
      } as RegisterResponse;
    }
    
    return response as ApiResponse<RegisterResponse>;
  },

};

