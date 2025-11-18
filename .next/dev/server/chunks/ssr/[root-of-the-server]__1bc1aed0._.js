module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi,
    "workflowApi",
    ()=>workflowApi
]);
const API_BASE = "https://flowmind-ai-flowmind-core-api.hf.space/api";
// Debug mode - console'da tüm API çağrılarını göster
const DEBUG = true;
// Token'ı localStorage'dan al (client-side için)
function getAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
async function apiRequest(endpoint, options, requireAuth = true) {
    try {
        const url = `${API_BASE}${endpoint}`;
        if ("TURBOPACK compile-time truthy", 1) {
            console.log(`🌐 API Request: ${options?.method || "GET"} ${url}`);
            if (options?.body && typeof options.body === "string") {
                try {
                    const bodyObj = JSON.parse(options.body);
                    console.log("📤 Request Body:", {
                        ...bodyObj,
                        password: bodyObj.password ? "***" : undefined
                    });
                } catch  {
                    console.log("📤 Request Body:", options.body);
                }
            }
        }
        // Token'ı header'a ekle (auth gerektiren endpoint'ler için)
        const headers = {
            "Content-Type": "application/json",
            ...options?.headers || {}
        };
        if (requireAuth) {
            const token = getAuthToken();
            if ("TURBOPACK compile-time truthy", 1) {
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
            headers
        });
        if (!response.ok) {
            // 401 Unauthorized - Token geçersiz veya süresi dolmuş
            if (response.status === 401 && requireAuth) {
                console.error("❌ 401 Unauthorized - Token geçersiz veya eksik");
                // Token'ı temizle ve logout yap
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
            let errorText = "";
            let errorJson = null;
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
                    errorText = errorJson.message || errorJson.detail || errorJson.error || errorJson.msg || errorJson.description || (typeof errorJson === "string" ? errorJson : errorText);
                } catch (parseError) {
                    // JSON string içinde JSON olabilir (örn: "{\"detail\":\"...\"}")
                    try {
                        // Eğer errorText bir JSON string ise (çift tırnak içinde)
                        if (errorText.trim().startsWith('"') && errorText.trim().endsWith('"')) {
                            const unquoted = JSON.parse(errorText);
                            errorJson = JSON.parse(unquoted);
                            console.error("❌ API Error JSON (nested):", errorJson);
                            errorText = errorJson.message || errorJson.detail || errorJson.error || errorJson.msg || errorJson.description || unquoted;
                        } else {
                            // JSON değilse olduğu gibi kullan
                            console.error("❌ API Error (not JSON):", errorText);
                            if (errorText && errorText.trim()) {
                                errorText = errorText.trim();
                            }
                        }
                    } catch  {
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
                if (rawErrorLower.includes("user created") || rawErrorLower.includes("kullanıcı oluşturuldu") || response.status === 500 && rawErrorLower.includes("failed to send")) {
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
                if (errorText.toLowerCase().includes("email already registered") || errorText.toLowerCase().includes("email already exists") || errorText.toLowerCase().includes("kullanıcı zaten kayıtlı")) {
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
                    status: response.status
                }
            };
        }
        // DELETE için body olmayabilir
        if (options?.method === "DELETE") {
            // 204 No Content için body yok
            if (response.status === 204) {
                return {
                    data: undefined
                };
            }
            // 200 OK için body olabilir veya olmayabilir
            if (response.status === 200) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    try {
                        const data = await response.json();
                        return {
                            data
                        };
                    } catch  {
                        return {
                            data: undefined
                        };
                    }
                }
                return {
                    data: undefined
                };
            }
        }
        const data = await response.json();
        return {
            data
        };
    } catch (error) {
        console.error("API Request Error:", error);
        return {
            error: {
                message: error instanceof Error ? error.message : "Unknown error occurred"
            }
        };
    }
}
// Backend'den gelen snake_case formatını frontend camelCase formatına çevir
function normalizeWorkflowFromBackend(workflow) {
    const graphJson = workflow.graph_json || workflow.graphJson || {};
    // Boş obje {} ise veya nodes/edges yoksa normalize et
    const normalizedGraphJson = {
        nodes: Array.isArray(graphJson.nodes) ? graphJson.nodes : [],
        edges: Array.isArray(graphJson.edges) ? graphJson.edges : []
    };
    return {
        id: String(workflow.id),
        name: workflow.name || "",
        description: workflow.description || "",
        isActive: workflow.is_active ?? workflow.isActive ?? false,
        createdAt: workflow.created_at || workflow.createdAt || "",
        updatedAt: workflow.updated_at || workflow.updatedAt || "",
        graphJson: normalizedGraphJson
    };
}
// Frontend'den backend'e gönderirken camelCase'i snake_case'e çevir
function normalizeWorkflowToBackend(workflow) {
    const graphJson = workflow.graphJson || {
        nodes: [],
        edges: []
    };
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
            edges: graphJson.edges || []
        }
    };
    console.log("🔄 normalizeWorkflowToBackend - Output:", JSON.stringify(result, null, 2));
    return result;
}
const workflowApi = {
    // GET /workflows/ - Get all workflows
    getAll: async ()=>{
        const response = await apiRequest("/workflows/");
        // API'den gelen workflow'ları normalize et
        if (response.data) {
            response.data = response.data.map(normalizeWorkflowFromBackend);
        }
        return response;
    },
    // GET /workflows/:id - Get single workflow
    getById: async (id)=>{
        // ID'yi encode et ve temizle
        const cleanId = String(id).trim();
        if (!cleanId) {
            return {
                error: {
                    message: "Workflow ID is required"
                }
            };
        }
        const response = await apiRequest(`/workflows/${encodeURIComponent(cleanId)}`);
        // API'den gelen workflow'u normalize et
        if (response.data) {
            response.data = normalizeWorkflowFromBackend(response.data);
        }
        return response;
    },
    // POST /workflows/ - Create new workflow
    create: async (workflow)=>{
        const workflowData = normalizeWorkflowToBackend(workflow);
        const response = await apiRequest("/workflows/", {
            method: "POST",
            body: JSON.stringify(workflowData)
        });
        // API'den dönen workflow'u normalize et
        if (response.data) {
            response.data = normalizeWorkflowFromBackend(response.data);
        }
        return response;
    },
    // PUT /workflows/:id - Update workflow
    update: async (id, workflow)=>{
        // ID'yi encode et ve temizle
        const cleanId = String(id).trim();
        if (!cleanId) {
            return {
                error: {
                    message: "Workflow ID is required"
                }
            };
        }
        const workflowData = normalizeWorkflowToBackend(workflow);
        const response = await apiRequest(`/workflows/${encodeURIComponent(cleanId)}`, {
            method: "PUT",
            body: JSON.stringify(workflowData)
        });
        // API'den dönen workflow'u normalize et
        if (response.data) {
            response.data = normalizeWorkflowFromBackend(response.data);
        }
        return response;
    },
    // DELETE /workflows/:id - Delete workflow
    delete: async (id)=>{
        // ID'yi encode et ve temizle
        const cleanId = String(id).trim();
        if (!cleanId) {
            return {
                error: {
                    message: "Workflow ID is required"
                }
            };
        }
        return apiRequest(`/workflows/${encodeURIComponent(cleanId)}`, {
            method: "DELETE"
        });
    }
};
const authApi = {
    // POST /api/auth/login - Login
    login: async (email, password)=>{
        const response = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }, false); // Auth gerektirmez
        if (response.data) {
            console.log("📥 Login Response Data (raw):", response.data);
            console.log("📥 Login Response Data (keys):", Object.keys(response.data));
            // Backend'den gelen formatı kontrol et
            const rawData = response.data;
            // Token'ı bul - farklı formatları kontrol et
            const token = rawData.token || rawData.access_token || rawData.accessToken || rawData.jwt_token || rawData.jwt || "";
            console.log("🔑 Login Token arama sonuçları:", {
                "rawData.token": rawData.token ? `${rawData.token.substring(0, 20)}...` : "YOK",
                "rawData.access_token": rawData.access_token ? `${rawData.access_token.substring(0, 20)}... (uzunluk: ${rawData.access_token.length})` : "YOK",
                "rawData.accessToken": rawData.accessToken ? "VAR" : "YOK",
                "bulunan_token": token ? `${token.substring(0, 50)}... (uzunluk: ${token.length})` : "BULUNAMADI"
            });
            // User bilgilerini bul
            let userId = "";
            let userEmail = "";
            let userName = "";
            if (rawData.user) {
                // { user: { id, email, name }, token: "..." } formatı
                userId = String(rawData.user.id || rawData.user.user_id || "");
                userEmail = rawData.user.email || "";
                userName = rawData.user.name || rawData.user.full_name || "";
            } else {
                // { user_id: ..., email: ..., token: ... } formatı
                userId = String(rawData.user_id || rawData.id || "");
                userEmail = rawData.email || "";
                userName = rawData.name || rawData.full_name || "";
            }
            // Backend'den gelen snake_case formatını normalize et
            const normalizedData = {
                user: {
                    id: userId,
                    email: userEmail,
                    name: userName
                },
                token: token
            };
            console.log("✅ Login Response Data (normalized):", {
                user: normalizedData.user,
                token: normalizedData.token ? `${normalizedData.token.substring(0, 20)}...` : "YOK"
            });
            // Token yoksa uyarı
            if (!normalizedData.token) {
                console.warn("⚠️ Login başarılı ama backend token döndürmedi!");
            }
            response.data = normalizedData;
        }
        return response;
    },
    // POST /api/auth/register - Register
    register: async (email, password, name)=>{
        // Backend'e gönderilecek data
        // Backend full_name bekliyor, name değil!
        const requestData = {
            email: email.trim().toLowerCase(),
            password: password
        };
        // Backend full_name bekliyor
        if (name && name.trim()) {
            requestData.full_name = name.trim();
        }
        console.log("📤 Register Request:", {
            email,
            password: "***",
            name: name || "undefined"
        });
        console.log("📤 Register Request Data:", requestData);
        console.log("📤 Register Request JSON:", JSON.stringify(requestData));
        const response = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(requestData)
        }, false); // Auth gerektirmez
        console.log("📥 Register Response (full):", JSON.stringify(response, null, 2));
        console.log("📥 Register Response:", response);
        console.log("📥 Register Response has error:", !!response.error);
        console.log("📥 Register Response has data:", !!response.data);
        console.log("📥 Register Response Status:", response.error?.status);
        if (response.error) {
            console.error("❌ Register Error:", response.error);
            console.error("❌ Register Error Message:", response.error.message);
            console.error("❌ Register Error Status:", response.error.status);
            // Özel durum: Eğer hata mesajı "User created" içeriyorsa, 
            // kullanıcı oluşturulmuş demektir, bu yüzden response'u başarılı gibi işaretle
            const errorMessage = (response.error.message || "").toLowerCase();
            if (errorMessage.includes("user created") || errorMessage.includes("kullanıcı oluşturuldu") || response.error.status === 500 && errorMessage.includes("failed to send")) {
                console.log("ℹ️ Register: Kullanıcı oluşturuldu ama email gönderilemedi, response'u başarılı gibi işaretle");
                // Error'u null yap, data'yı set et
                response.error = undefined;
                response.data = {
                    user: {
                        id: "",
                        email: email,
                        name: name
                    },
                    token: ""
                };
                console.log("✅ Register Response (modified):", response);
                return response;
            }
            return response;
        }
        // Backend başarılı response döndürdü (error yok)
        // Backend muhtemelen { message: "..." } veya boş bir response döndürüyor
        // Email doğrulama için sadece başarılı olması yeterli
        if (response.data) {
            console.log("📥 Register Response Data (raw):", response.data);
            console.log("📥 Register Response Data (stringified):", JSON.stringify(response.data, null, 2));
            console.log("📥 Register Response Data (keys):", Object.keys(response.data));
            // Backend'den gelen formatı kontrol et
            const rawData = response.data;
            // Eğer backend sadece { message: "..." } döndürüyorsa, minimal bir response oluştur
            if (rawData.message && !rawData.user && !rawData.token) {
                console.log("📋 Backend sadece message döndürdü, minimal response oluşturuluyor");
                response.data = {
                    user: {
                        id: "",
                        email: email,
                        name: name
                    },
                    token: ""
                };
            } else {
                // Normalize et (varsa)
                const token = rawData.token || rawData.access_token || rawData.accessToken || rawData.jwt_token || rawData.jwt || "";
                let userId = "";
                let userEmail = email; // Fallback olarak request'ten gelen email
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
                        name: userName
                    },
                    token: token
                };
            }
        } else {
            // Backend data döndürmedi ama error da yok, başarılı say
            console.log("📋 Backend data döndürmedi ama error yok, başarılı sayılıyor");
            response.data = {
                user: {
                    id: "",
                    email: email,
                    name: name
                },
                token: ""
            };
        }
        console.log("✅ Register Response Data (final):", response.data);
        return response;
    },
    // POST /api/auth/forgot-password - Forgot password
    forgotPassword: async (email)=>{
        return apiRequest("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({
                email
            })
        }, false); // Auth gerektirmez
    },
    // POST /api/auth/reset-password - Reset password
    resetPassword: async (token, newPassword)=>{
        return apiRequest("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
                token,
                new_password: newPassword
            })
        }, false); // Auth gerektirmez
    },
    // POST /api/auth/verify-email - Verify email with code
    verifyEmail: async (email, code)=>{
        console.log("📤 Verify Email Request:", {
            email,
            code
        });
        const response = await apiRequest("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({
                email,
                code
            })
        }, false); // Auth gerektirmez
        console.log("📥 Verify Email Response:", response);
        return response;
    },
    // POST /api/auth/resend-verification-code - Resend verification code
    resendVerificationCode: async (email)=>{
        return apiRequest("/auth/resend-verification-code", {
            method: "POST",
            body: JSON.stringify({
                email
            })
        }, false); // Auth gerektirmez
    }
};
}),
"[project]/store/authStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        login: async (email, password)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].login(email, password);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false,
                    user: null,
                    token: null
                });
                return false;
            }
            if (response.data) {
                set({
                    user: response.data.user,
                    token: response.data.token,
                    isLoading: false,
                    error: null
                });
                return true;
            }
            set({
                isLoading: false
            });
            return false;
        },
        register: async (email, password, name)=>{
            console.log("🔵 authStore.register çağrıldı");
            set({
                isLoading: true,
                error: null
            });
            console.log("📤 authApi.register çağrılıyor...");
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].register(email, password, name);
            console.log("📥 authApi.register response:", response);
            console.log("📥 response.error:", response.error);
            console.log("📥 response.data:", response.data);
            if (response.error) {
                console.error("❌ Register Error:", response.error);
                // Özel durum: Kullanıcı oluşturuldu ama email gönderilemedi
                // Backend 500 hatası döndürse bile, eğer "User created" mesajı varsa başarılı say
                const errorMessage = (response.error.message || "").toLowerCase();
                const errorStatus = response.error.status;
                console.log("🔍 Error message kontrolü:", errorMessage);
                console.log("🔍 Error status:", errorStatus);
                // 500 hatası ve "user created" içeriyorsa veya sadece "user created" içeriyorsa
                if (errorMessage.includes("user created") || errorMessage.includes("kullanıcı oluşturuldu") || errorStatus === 500 && errorMessage.includes("failed to send")) {
                    console.log("ℹ️ Kullanıcı oluşturuldu ama email gönderilemedi, step 'verify' yapılıyor");
                    set({
                        isLoading: false,
                        error: null
                    });
                    return true; // Başarılı say, step verify yapılsın
                }
                set({
                    error: response.error.message,
                    isLoading: false,
                    user: null,
                    token: null
                });
                console.log("❌ Register false döndürüyor (error var, user created yok)");
                return false;
            }
            // Backend başarılı response döndürdüyse (error yoksa) başarılı say
            // Backend muhtemelen { message: "..." } veya { user: {...} } formatında döndürüyor
            console.log("✅ Register başarılı! (error yok)");
            console.log("✅ Register response:", response);
            console.log("✅ Register response.data:", response.data);
            // Register başarılı, email doğrulama sayfasına yönlendirilecek
            // User bilgilerini kaydetme, sadece başarılı olduğunu belirt
            set({
                isLoading: false,
                error: null
            });
            console.log("✅ Register true döndürüyor");
            return true;
        },
        logout: ()=>{
            set({
                user: null,
                token: null,
                error: null
            });
        },
        forgotPassword: async (email)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].forgotPassword(email);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return false;
            }
            set({
                isLoading: false,
                error: null
            });
            return true;
        },
        resetPassword: async (token, newPassword)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].resetPassword(token, newPassword);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return false;
            }
            set({
                isLoading: false,
                error: null
            });
            return true;
        },
        verifyEmail: async (email, code)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].verifyEmail(email, code);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return false;
            }
            set({
                isLoading: false,
                error: null
            });
            return true;
        },
        resendVerificationCode: async (email)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].resendVerificationCode(email);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return false;
            }
            set({
                isLoading: false,
                error: null
            });
            return true;
        },
        setError: (error)=>set({
                error
            }),
        clearError: ()=>set({
                error: null
            })
    }), {
    name: "auth-storage",
    partialize: (state)=>({
            user: state.user,
            token: state.token
        })
}));
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, variant = "primary", size = "md", ...props }, ref)=>{
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-dark-800 text-foreground border border-dark-700 hover:bg-dark-700 focus:ring-dark-600",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "text-foreground hover:bg-dark-800 focus:ring-dark-600"
    };
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], sizes[size], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 27,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
const __TURBOPACK__default__export__ = Button;
}),
"[project]/components/ui/Input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, type = "text", ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Input.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = "Input";
const __TURBOPACK__default__export__ = Input;
}),
"[project]/components/ui/Card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-dark-900 border border-dark-800 rounded-xl p-6", "shadow-lg", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Card.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Card.displayName = "Card";
const __TURBOPACK__default__export__ = Card;
}),
"[project]/app/forgot-password/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForgotPasswordPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/authStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function ForgotPasswordPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { forgotPassword, isLoading, error, clearError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitted, setIsSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localError, setLocalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        clearError();
        setLocalError(null);
        // Validation
        if (!email) {
            setLocalError("Email adresi gereklidir");
            return;
        }
        if (!email.includes("@")) {
            setLocalError("Geçerli bir email adresi giriniz");
            return;
        }
        const success = await forgotPassword(email);
        if (success) {
            setIsSubmitted(true);
        }
    };
    const displayError = localError || error;
    if (isSubmitted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-dark-950 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-8 h-8 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/forgot-password/page.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-foreground mb-2",
                                children: "FlowMind Studio"
                            }, void 0, false, {
                                fileName: "[project]/app/forgot-password/page.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/forgot-password/page.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "p-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            className: "w-8 h-8 text-green-400"
                                        }, void 0, false, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/forgot-password/page.tsx",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-foreground mb-2",
                                            children: "Email Gönderildi"
                                        }, void 0, false, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: [
                                                "Şifre sıfırlama bağlantısı ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/forgot-password/page.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 46
                                                }, this),
                                                " adresine gönderildi. Lütfen email kutunuzu kontrol edin."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-4 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            onClick: ()=>router.push("/login"),
                                            size: "lg",
                                            className: "w-full gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/forgot-password/page.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 19
                                                }, this),
                                                "Giriş Sayfasına Dön"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/login",
                                            className: "block text-center text-sm text-primary-400 hover:text-primary-300 transition-colors",
                                            children: "Email gelmedi mi? Tekrar gönder"
                                        }, void 0, false, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/forgot-password/page.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/forgot-password/page.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/forgot-password/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-dark-950 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                className: "w-8 h-8 text-white"
                            }, void 0, false, {
                                fileName: "[project]/app/forgot-password/page.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-foreground mb-2",
                            children: "FlowMind Studio"
                        }, void 0, false, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Şifrenizi sıfırlayın"
                        }, void 0, false, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/forgot-password/page.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    className: "p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-6",
                            children: [
                                displayError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-red-600/10 border border-red-600/30 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-400 text-sm",
                                        children: displayError
                                    }, void 0, false, {
                                        fileName: "[project]/app/forgot-password/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-primary-600/10 border border-primary-600/30 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-primary-400 text-sm",
                                        children: "Şifrenizi sıfırlamak için email adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz."
                                    }, void 0, false, {
                                        fileName: "[project]/app/forgot-password/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "block text-sm font-medium text-foreground",
                                            children: "Email"
                                        }, void 0, false, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/forgot-password/page.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    id: "email",
                                                    type: "email",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    placeholder: "ornek@email.com",
                                                    className: "pl-10",
                                                    disabled: isLoading,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/forgot-password/page.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/forgot-password/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    type: "submit",
                                    size: "lg",
                                    className: "w-full gap-2",
                                    disabled: isLoading,
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/forgot-password/page.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this),
                                            "Gönderiliyor..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Şifre Sıfırlama Bağlantısı Gönder",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "w-4 h-4 rotate-180"
                                            }, void 0, false, {
                                                fileName: "[project]/app/forgot-password/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/forgot-password/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/forgot-password/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this),
                                    "Giriş sayfasına dön"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/forgot-password/page.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/forgot-password/page.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/forgot-password/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/forgot-password/page.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/forgot-password/page.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1bc1aed0._.js.map