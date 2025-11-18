(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/store/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        login: async (email, password)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login(email, password);
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
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].register(email, password, name);
            if (response.error) {
                // Özel durum: Kullanıcı oluşturuldu ama email gönderilemedi
                // Backend 500 hatası döndürse bile, eğer "User created" mesajı varsa başarılı say
                const errorMessage = (response.error.message || "").toLowerCase();
                const errorStatus = response.error.status;
                // 500 hatası ve "user created" içeriyorsa veya sadece "user created" içeriyorsa
                if (errorMessage.includes("user created") || errorMessage.includes("kullanıcı oluşturuldu") || errorStatus === 500 && errorMessage.includes("failed to send")) {
                    set({
                        isLoading: false,
                        error: null
                    });
                    return true;
                }
                set({
                    error: response.error.message,
                    isLoading: false,
                    user: null,
                    token: null
                });
                return false;
            }
            set({
                isLoading: false,
                error: null
            });
            return true;
        },
        logout: ()=>{
            set({
                user: null,
                token: null,
                error: null
            });
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
                if ("TURBOPACK compile-time truthy", 1) {
                    // Auth store'u da temizle
                    try {
                        const { useAuthStore } = __turbopack_context__.r("[project]/store/authStore.ts [app-client] (ecmascript)");
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
            const rawData = response.data;
            // Token'ı bul - farklı formatları kontrol et
            const token = rawData.token || rawData.access_token || rawData.accessToken || rawData.jwt_token || rawData.jwt || "";
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
                    name: userName
                },
                token: token
            };
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
        const response = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(requestData)
        }, false); // Auth gerektirmez
        if (response.error) {
            // Özel durum: Eğer hata mesajı "User created" içeriyorsa, 
            // kullanıcı oluşturulmuş demektir, bu yüzden response'u başarılı gibi işaretle
            const errorMessage = (response.error.message || "").toLowerCase();
            if (errorMessage.includes("user created") || errorMessage.includes("kullanıcı oluşturuldu") || response.error.status === 500 && errorMessage.includes("failed to send")) {
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
                return response;
            }
            return response;
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
                        name: name
                    },
                    token: ""
                };
            } else {
                // Normalize et (varsa)
                const token = rawData.token || rawData.access_token || rawData.accessToken || rawData.jwt_token || rawData.jwt || "";
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
                        name: userName
                    },
                    token: token
                };
            }
        } else {
            // Backend data döndürmedi ama error da yok, başarılı say
            response.data = {
                user: {
                    id: "",
                    email: email,
                    name: name
                },
                token: ""
            };
        }
        return response;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/workflowStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWorkflowStore",
    ()=>useWorkflowStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
;
const useWorkflowStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        workflows: [],
        currentWorkflow: null,
        nodes: [],
        edges: [],
        selectedNode: null,
        isRunning: false,
        isLoading: false,
        error: null,
        runLogs: [],
        // API Actions
        fetchWorkflows: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowApi"].getAll();
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return;
            }
            if (response.data) {
                set({
                    workflows: response.data,
                    isLoading: false
                });
            }
        },
        fetchWorkflow: async (id)=>{
            set({
                isLoading: true,
                error: null,
                selectedNode: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowApi"].getById(id);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return;
            }
            if (response.data) {
                const workflow = response.data;
                // graphJson yoksa veya boşsa varsayılan değerler kullan
                const graphJson = workflow.graphJson || {
                    nodes: [],
                    edges: []
                };
                // Node'ları ve edge'leri normalize et
                const normalizedNodes = (graphJson.nodes || []).map((node)=>({
                        id: node.id,
                        type: node.type || "custom",
                        position: node.position || {
                            x: 0,
                            y: 0
                        },
                        data: {
                            ...node.data || {},
                            type: node.data?.type || node.type || "custom",
                            label: node.data?.label || node.label || node.id,
                            config: node.data?.config || {}
                        }
                    }));
                const normalizedEdges = (graphJson.edges || []).map((edge)=>({
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        sourceHandle: edge.sourceHandle,
                        targetHandle: edge.targetHandle,
                        type: edge.type
                    }));
                set({
                    currentWorkflow: workflow,
                    nodes: normalizedNodes,
                    edges: normalizedEdges,
                    isLoading: false
                });
            }
        },
        createWorkflow: async (workflow)=>{
            set({
                isLoading: true,
                error: null
            });
            // graphJson yoksa varsayılan değer ekle
            const workflowData = {
                ...workflow,
                graphJson: workflow.graphJson || {
                    nodes: [],
                    edges: []
                }
            };
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowApi"].create(workflowData);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return null;
            }
            if (response.data) {
                const newWorkflow = response.data;
                // graphJson'ı normalize et
                const normalizedWorkflow = {
                    ...newWorkflow,
                    graphJson: newWorkflow.graphJson || {
                        nodes: [],
                        edges: []
                    }
                };
                set((state)=>({
                        workflows: [
                            ...state.workflows,
                            normalizedWorkflow
                        ],
                        isLoading: false
                    }));
                return normalizedWorkflow;
            }
            return null;
        },
        updateWorkflow: async (id, workflow)=>{
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowApi"].update(id, workflow);
            if (response.error) {
                set({
                    error: response.error.message,
                    isLoading: false
                });
                return false;
            }
            if (response.data) {
                const updatedWorkflow = response.data;
                // graphJson'ı normalize et
                const normalizedWorkflow = {
                    ...updatedWorkflow,
                    graphJson: updatedWorkflow.graphJson || {
                        nodes: [],
                        edges: []
                    }
                };
                set((state)=>({
                        workflows: state.workflows.map((w)=>w.id === id ? normalizedWorkflow : w),
                        currentWorkflow: state.currentWorkflow?.id === id ? normalizedWorkflow : state.currentWorkflow,
                        isLoading: false
                    }));
                return true;
            }
            return false;
        },
        deleteWorkflow: async (id)=>{
            if (!id || !String(id).trim()) {
                set({
                    error: "Geçersiz workflow ID",
                    isLoading: false
                });
                return false;
            }
            set({
                isLoading: true,
                error: null
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowApi"].delete(id);
            if (response.error) {
                set({
                    error: response.error.message || "Workflow silinirken bir hata oluştu",
                    isLoading: false
                });
                return false;
            }
            set((state)=>({
                    workflows: state.workflows.filter((w)=>w.id !== id),
                    currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
                    isLoading: false
                }));
            return true;
        },
        setWorkflows: (workflows)=>set({
                workflows
            }),
        setCurrentWorkflow: (workflow)=>{
            if (workflow) {
                // graphJson yoksa veya boşsa mevcut nodes/edges'i koru
                const graphJson = workflow.graphJson || {
                    nodes: [],
                    edges: []
                };
                const currentState = get();
                // Eğer graphJson'da node'lar varsa kullan, yoksa mevcut node'ları koru
                const newNodes = graphJson.nodes && graphJson.nodes.length > 0 ? graphJson.nodes || [] : currentState.nodes; // Mevcut node'ları koru
                const newEdges = graphJson.edges && graphJson.edges.length > 0 ? graphJson.edges || [] : currentState.edges; // Mevcut edge'leri koru
                console.log("🔄 setCurrentWorkflow - workflow:", workflow);
                console.log("🔄 setCurrentWorkflow - graphJson.nodes:", graphJson.nodes?.length || 0);
                console.log("🔄 setCurrentWorkflow - Mevcut nodes:", currentState.nodes.length);
                console.log("🔄 setCurrentWorkflow - Yeni nodes:", newNodes.length);
                set({
                    currentWorkflow: workflow,
                    nodes: newNodes,
                    edges: newEdges
                });
            } else {
                set({
                    currentWorkflow: null,
                    nodes: [],
                    edges: [],
                    selectedNode: null
                });
            }
        },
        setNodes: (nodes)=>{
            console.log("🔄 setNodes çağrıldı, yeni nodes:", nodes);
            set({
                nodes
            });
        },
        setEdges: (edges)=>{
            console.log("🔄 setEdges çağrıldı, yeni edges:", edges);
            set({
                edges
            });
        },
        addNode: (node)=>{
            console.log("➕ addNode çağrıldı, eklenen node:", node);
            set((state)=>{
                const newNodes = [
                    ...state.nodes,
                    node
                ];
                console.log("📊 Yeni nodes array:", newNodes);
                return {
                    nodes: newNodes
                };
            });
        },
        updateNode: (nodeId, data)=>set((state)=>({
                    nodes: state.nodes.map((node)=>node.id === nodeId ? {
                            ...node,
                            data: {
                                ...node.data,
                                ...data
                            }
                        } : node)
                })),
        deleteNode: (nodeId)=>set((state)=>({
                    nodes: state.nodes.filter((node)=>node.id !== nodeId),
                    edges: state.edges.filter((edge)=>edge.source !== nodeId && edge.target !== nodeId),
                    selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode
                })),
        setSelectedNode: (node)=>set({
                selectedNode: node
            }),
        addEdge: (edge)=>set((state)=>({
                    edges: [
                        ...state.edges,
                        edge
                    ]
                })),
        deleteEdge: (edgeId)=>set((state)=>({
                    edges: state.edges.filter((edge)=>edge.id !== edgeId)
                })),
        setIsRunning: (isRunning)=>set({
                isRunning
            }),
        addRunLog: (log)=>set((state)=>({
                    runLogs: [
                        ...state.runLogs,
                        log
                    ]
                })),
        clearRunLogs: ()=>set({
                runLogs: []
            }),
        saveWorkflow: async (updates)=>{
            // get() ile en güncel state'i al - her zaman fresh state al
            const state = get();
            const { currentWorkflow, nodes, edges } = state;
            if (!currentWorkflow) {
                set({
                    error: "Kaydedilecek workflow bulunamadı"
                });
                return false;
            }
            console.log("💾 saveWorkflow çağrıldı");
            console.log("📊 Store'daki nodes:", nodes);
            console.log("📊 Store'daki nodes sayısı:", nodes.length);
            console.log("📊 Store'daki edges:", edges);
            console.log("📊 Store'daki edges sayısı:", edges.length);
            console.log("📊 Current workflow:", currentWorkflow);
            console.log("📊 Updates:", updates);
            // Nodes ve edges'i temizle ve doğru formata dönüştür
            // Backend'e gönderirken: node.type = gerçek node type (start, ai_step, vs.)
            // ReactFlow'da: node.type = "custom", node.data.type = gerçek node type
            const cleanNodes = nodes.map((node)=>{
                // Gerçek node type'ı data.type'dan al, yoksa node.type'dan al
                const realNodeType = node.data?.type || node.type || "custom";
                return {
                    id: node.id,
                    type: realNodeType,
                    position: node.position,
                    data: {
                        ...node.data,
                        type: realNodeType,
                        // Eğer config yoksa boş obje ekle
                        config: node.data?.config || {}
                    }
                };
            });
            const cleanEdges = edges.map((edge)=>({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle,
                    type: edge.type
                }));
            console.log("🧹 Temizlenmiş nodes:", cleanNodes);
            console.log("🧹 Temizlenmiş edges:", cleanEdges);
            console.log("🧹 Temizlenmiş nodes sayısı:", cleanNodes.length);
            console.log("🧹 Temizlenmiş edges sayısı:", cleanEdges.length);
            // Updates parametresi varsa onları kullan, yoksa currentWorkflow'dan al
            const updatedWorkflow = {
                name: updates?.name !== undefined ? updates.name : currentWorkflow.name,
                description: updates?.description !== undefined ? updates.description : currentWorkflow.description,
                isActive: updates?.isActive !== undefined ? updates.isActive : currentWorkflow.isActive,
                graphJson: {
                    nodes: cleanNodes,
                    edges: cleanEdges
                }
            };
            console.log("📤 Backend'e gönderilecek workflow:", JSON.stringify(updatedWorkflow, null, 2));
            console.log("📤 graphJson.nodes length:", updatedWorkflow.graphJson?.nodes?.length);
            console.log("📤 graphJson.edges length:", updatedWorkflow.graphJson?.edges?.length);
            const success = await get().updateWorkflow(currentWorkflow.id, updatedWorkflow);
            console.log("✅ updateWorkflow sonucu:", success);
            if (success) {
                // Başarılı kayıt sonrası store'daki currentWorkflow'u güncelle
                const updated = get().currentWorkflow;
                if (updated) {
                    set({
                        currentWorkflow: {
                            ...updated,
                            name: updatedWorkflow.name || updated.name,
                            description: updatedWorkflow.description !== undefined ? updatedWorkflow.description : updated.description,
                            isActive: updatedWorkflow.isActive !== undefined ? updatedWorkflow.isActive : updated.isActive,
                            graphJson: {
                                nodes: cleanNodes,
                                edges: cleanEdges
                            }
                        }
                    });
                }
            }
            return success;
        },
        setError: (error)=>set({
                error
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant = "primary", size = "md", ...props }, ref)=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], sizes[size], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 27,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
const __TURBOPACK__default__export__ = Button;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, type = "text", ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Input.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
const __TURBOPACK__default__export__ = Input;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", "transition-all duration-200 resize-none", "disabled:opacity-50 disabled:cursor-not-allowed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Textarea.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Textarea;
Textarea.displayName = "Textarea";
const __TURBOPACK__default__export__ = Textarea;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Badge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant = "default", ...props }, ref)=>{
    const variants = {
        default: "bg-dark-800 text-foreground",
        success: "bg-green-600/20 text-green-400 border border-green-600/30",
        error: "bg-red-600/20 text-red-400 border border-red-600/30",
        warning: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
        info: "bg-blue-600/20 text-blue-400 border border-blue-600/30"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Badge.tsx",
        lineNumber: 19,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Badge;
Badge.displayName = "Badge";
const __TURBOPACK__default__export__ = Badge;
var _c, _c1;
__turbopack_context__.k.register(_c, "Badge$forwardRef");
__turbopack_context__.k.register(_c1, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/WorkflowMetaPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkflowMetaPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-client] (ecmascript) <export default as Power>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function WorkflowMetaPanel() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { currentWorkflow, setCurrentWorkflow, saveWorkflow, updateWorkflow, deleteWorkflow, setIsRunning, clearRunLogs, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isActive, setIsActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowMetaPanel.useEffect": ()=>{
            if (currentWorkflow) {
                setName(currentWorkflow.name);
                setDescription(currentWorkflow.description || "");
                setIsActive(currentWorkflow.isActive);
            }
        }
    }["WorkflowMetaPanel.useEffect"], [
        currentWorkflow
    ]);
    const handleSave = async ()=>{
        if (!currentWorkflow) return;
        // Local state'teki name, description, isActive değerlerini saveWorkflow'a gönder
        const { nodes, edges } = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"].getState();
        console.log("💾 handleSave - Mevcut nodes:", nodes.length, "edges:", edges.length);
        console.log("💾 handleSave - Name:", name, "Description:", description, "IsActive:", isActive);
        // Sonra API'ye kaydet (nodes, edges, name, description, isActive dahil)
        const success = await saveWorkflow({
            name,
            description,
            isActive
        });
        if (success) {
            alert("Workflow kaydedildi!");
        } else {
            const { error } = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"].getState();
            alert(`Workflow kaydedilirken bir hata oluştu: ${error || "Bilinmeyen hata"}`);
        }
    };
    const handleDelete = async ()=>{
        if (!currentWorkflow) return;
        if (confirm("Bu workflow'u silmek istediğinize emin misiniz?")) {
            const success = await deleteWorkflow(currentWorkflow.id);
            if (success) {
                router.push("/");
            } else {
                alert("Workflow silinirken bir hata oluştu!");
            }
        }
    };
    const handleToggleActive = async ()=>{
        if (!currentWorkflow) return;
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        const success = await updateWorkflow(currentWorkflow.id, {
            isActive: newActiveState
        });
        if (!success) {
            setIsActive(!newActiveState); // Rollback
            alert("Durum güncellenirken bir hata oluştu!");
        }
    };
    const handleRun = async ()=>{
        if (!currentWorkflow) return;
        setIsRunning(true);
        clearRunLogs();
        const { nodes, addRunLog } = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"].getState();
        // Simüle edilmiş run - gerçek uygulamada API'ye istek atılacak
        for (const node of nodes){
            const startTime = new Date().toISOString();
            addRunLog({
                nodeId: node.id,
                nodeName: node.data.label || node.data.type,
                status: "running",
                startTime
            });
            // Simüle edilmiş işlem süresi
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            const endTime = new Date().toISOString();
            const success = Math.random() > 0.2; // %80 başarı oranı
            addRunLog({
                nodeId: node.id,
                nodeName: node.data.label || node.data.type,
                status: success ? "success" : "error",
                startTime,
                endTime,
                payload: {
                    input: "test data",
                    output: "processed data"
                },
                error: success ? undefined : "Simüle edilmiş hata"
            });
        }
        setIsRunning(false);
    };
    if (!currentWorkflow) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-48 bg-dark-900 border-b border-dark-800 p-4 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>router.push("/"),
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                        lineNumber: 142,
                                        columnNumber: 13
                                    }, this),
                                    "Geri"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: name,
                                    onChange: (e)=>setName(e.target.value),
                                    placeholder: "Workflow adı",
                                    className: "text-lg font-semibold border-0 bg-transparent focus:ring-0 p-0 h-auto"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: isActive ? "success" : "default",
                                children: isActive ? "Aktif" : "Pasif"
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: handleToggleActive,
                                disabled: isLoading,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    isActive ? "Pasifleştir" : "Aktifleştir"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "danger",
                                size: "sm",
                                onClick: handleDelete,
                                disabled: isLoading,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this),
                                    "Sil"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "secondary",
                                size: "sm",
                                onClick: handleSave,
                                disabled: isLoading,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    isLoading ? "Kaydediliyor..." : "Kaydet"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                size: "sm",
                                onClick: handleRun,
                                disabled: isLoading,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    "Çalıştır"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    value: description,
                    onChange: (e)=>setDescription(e.target.value),
                    placeholder: "Workflow açıklaması...",
                    rows: 2,
                    className: "bg-dark-800"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/WorkflowMetaPanel.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(WorkflowMetaPanel, "0yaIVbJwiyVaJ64poanIa52jNFA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = WorkflowMetaPanel;
var _c;
__turbopack_context__.k.register(_c, "WorkflowMetaPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/types/nodes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Node Kategorileri
__turbopack_context__.s([
    "NODE_CATEGORIES",
    ()=>NODE_CATEGORIES,
    "NODE_REGISTRY",
    ()=>NODE_REGISTRY
]);
const NODE_REGISTRY = {
    // ========== TRIGGERS ==========
    start: {
        type: "start",
        category: "triggers",
        label: "Start",
        description: "Workflow başlangıç noktası",
        icon: "Play",
        color: "bg-green-600",
        inputs: 0,
        outputs: 1,
        phase: 1,
        configSchema: {
            name: {
                type: "string",
                label: "Name",
                description: "Opsiyonel başlangıç noktası adı",
                required: false,
                default: "Default Start"
            }
        }
    },
    webhook_trigger: {
        type: "webhook_trigger",
        category: "triggers",
        label: "Webhook Trigger",
        description: "HTTP çağrısı ile workflow'u tetikler",
        icon: "Webhook",
        color: "bg-blue-600",
        inputs: 0,
        outputs: 1,
        phase: 2,
        configSchema: {
            path: {
                type: "string",
                label: "Path",
                description: "Webhook URL path",
                required: true,
                placeholder: "/webhooks/my-flow"
            },
            method: {
                type: "select",
                label: "Method",
                required: true,
                default: "POST",
                options: [
                    {
                        value: "GET",
                        label: "GET"
                    },
                    {
                        value: "POST",
                        label: "POST"
                    },
                    {
                        value: "PUT",
                        label: "PUT"
                    },
                    {
                        value: "DELETE",
                        label: "DELETE"
                    }
                ]
            },
            auth_required: {
                type: "boolean",
                label: "Auth Required",
                required: false,
                default: false
            }
        }
    },
    schedule_trigger: {
        type: "schedule_trigger",
        category: "triggers",
        label: "Schedule",
        description: "Zamana bağlı tetikleme (Cron)",
        icon: "Clock",
        color: "bg-purple-600",
        inputs: 0,
        outputs: 1,
        phase: 2,
        configSchema: {
            cron: {
                type: "string",
                label: "Cron Expression",
                required: true,
                placeholder: "0 * * * *"
            },
            timezone: {
                type: "string",
                label: "Timezone",
                required: false,
                default: "UTC"
            }
        }
    },
    // ========== FLOW & LOGIC ==========
    decision: {
        type: "decision",
        category: "flow-logic",
        label: "Decision",
        description: "Koşullu dallanma (if/else)",
        icon: "GitBranch",
        color: "bg-yellow-600",
        inputs: 1,
        outputs: [
            "true",
            "false"
        ],
        phase: 1,
        configSchema: {
            conditions: {
                type: "array",
                label: "Conditions",
                description: "Koşul listesi",
                required: true,
                default: []
            }
        }
    },
    switch: {
        type: "switch",
        category: "flow-logic",
        label: "Switch",
        description: "Multi-branch yönlendirme",
        icon: "GitBranch",
        color: "bg-yellow-500",
        inputs: 1,
        outputs: [
            "default"
        ],
        phase: 2,
        configSchema: {
            expression: {
                type: "string",
                label: "Expression",
                required: true,
                placeholder: "{{ context.status }}"
            },
            cases: {
                type: "array",
                label: "Cases",
                required: true,
                default: []
            }
        }
    },
    delay: {
        type: "delay",
        category: "flow-logic",
        label: "Delay",
        description: "Bekleme süresi",
        icon: "Clock",
        color: "bg-gray-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            duration_ms: {
                type: "number",
                label: "Duration (ms)",
                required: false,
                placeholder: "5000"
            },
            duration_human: {
                type: "string",
                label: "Duration (Human)",
                required: false,
                placeholder: "5 minutes"
            }
        }
    },
    parallel_split: {
        type: "parallel_split",
        category: "flow-logic",
        label: "Parallel Split",
        description: "Paralel branch'ler başlatma",
        icon: "GitBranch",
        color: "bg-indigo-600",
        inputs: 1,
        outputs: [
            "branch_1",
            "branch_2"
        ],
        phase: 2,
        configSchema: {}
    },
    parallel_join: {
        type: "parallel_join",
        category: "flow-logic",
        label: "Parallel Join",
        description: "Paralel branch'leri birleştirme",
        icon: "GitMerge",
        color: "bg-indigo-500",
        inputs: [
            "branch_1",
            "branch_2"
        ],
        outputs: 1,
        phase: 2,
        configSchema: {}
    },
    loop: {
        type: "loop",
        category: "flow-logic",
        label: "Loop",
        description: "Liste üzerinde dönme",
        icon: "Repeat",
        color: "bg-cyan-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            collection: {
                type: "string",
                label: "Collection",
                required: true,
                placeholder: "{{ context.items }}"
            }
        }
    },
    // ========== AI NODES ==========
    ai_step: {
        type: "ai_step",
        category: "ai-nodes",
        label: "AI Step",
        description: "LLM Completion - Genel amaçlı AI node",
        icon: "Brain",
        color: "bg-purple-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            provider: {
                type: "select",
                label: "Provider",
                required: true,
                default: "openai",
                options: [
                    {
                        value: "openai",
                        label: "OpenAI (GPT-4, GPT-3.5)"
                    },
                    {
                        value: "anthropic",
                        label: "Anthropic (Claude)"
                    },
                    {
                        value: "google",
                        label: "Google (Gemini)"
                    },
                    {
                        value: "mistral",
                        label: "Mistral AI"
                    },
                    {
                        value: "cohere",
                        label: "Cohere"
                    },
                    {
                        value: "hf",
                        label: "HuggingFace"
                    },
                    {
                        value: "azure_openai",
                        label: "Azure OpenAI"
                    },
                    {
                        value: "aws_bedrock",
                        label: "AWS Bedrock"
                    },
                    {
                        value: "local",
                        label: "Local Model"
                    }
                ]
            },
            model: {
                type: "string",
                label: "Model",
                required: true,
                placeholder: "gpt-4.1-mini"
            },
            system_prompt: {
                type: "textarea",
                label: "System Prompt",
                required: false,
                placeholder: "You are a helpful assistant..."
            },
            user_template: {
                type: "textarea",
                label: "User Template",
                required: true,
                placeholder: "Kullanıcının mesajı: {{input.text}}"
            },
            output_mode: {
                type: "select",
                label: "Output Mode",
                required: true,
                default: "text",
                options: [
                    {
                        value: "text",
                        label: "Text"
                    },
                    {
                        value: "json",
                        label: "JSON"
                    },
                    {
                        value: "classification",
                        label: "Classification"
                    }
                ]
            },
            temperature: {
                type: "number",
                label: "Temperature",
                required: false,
                default: 0.7
            },
            max_tokens: {
                type: "number",
                label: "Max Tokens",
                required: false,
                default: 1000
            }
        }
    },
    ai_classify: {
        type: "ai_classify",
        category: "ai-nodes",
        label: "AI Classify",
        description: "Metin sınıflandırma",
        icon: "Brain",
        color: "bg-purple-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            labels: {
                type: "array",
                label: "Labels",
                required: true,
                default: []
            },
            instruction: {
                type: "textarea",
                label: "Instruction",
                required: true
            }
        }
    },
    ai_extract: {
        type: "ai_extract",
        category: "ai-nodes",
        label: "AI Extract",
        description: "Structured data extraction",
        icon: "Brain",
        color: "bg-purple-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            schema: {
                type: "object",
                label: "Schema",
                required: true
            }
        }
    },
    ai_simulate: {
        type: "ai_simulate",
        category: "ai-nodes",
        label: "AI Simulate",
        description: "Flow simulator - akışı simüle eder",
        icon: "PlayCircle",
        color: "bg-pink-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            simulation_mode: {
                type: "select",
                label: "Simulation Mode",
                required: true,
                default: "dry-run",
                options: [
                    {
                        value: "dry-run",
                        label: "Dry Run"
                    },
                    {
                        value: "explain",
                        label: "Explain"
                    },
                    {
                        value: "step-by-step",
                        label: "Step by Step"
                    }
                ]
            }
        }
    },
    // ========== INTEGRATIONS ==========
    http: {
        type: "http",
        category: "integrations",
        label: "HTTP Request",
        description: "API çağrısı yapma",
        icon: "Globe",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            method: {
                type: "select",
                label: "Method",
                required: true,
                default: "GET",
                options: [
                    {
                        value: "GET",
                        label: "GET"
                    },
                    {
                        value: "POST",
                        label: "POST"
                    },
                    {
                        value: "PUT",
                        label: "PUT"
                    },
                    {
                        value: "DELETE",
                        label: "DELETE"
                    },
                    {
                        value: "PATCH",
                        label: "PATCH"
                    }
                ]
            },
            url: {
                type: "string",
                label: "URL",
                required: true,
                placeholder: "https://api.example.com/users/{{userId}}"
            },
            headers: {
                type: "object",
                label: "Headers",
                required: false
            },
            body: {
                type: "textarea",
                label: "Body",
                required: false,
                placeholder: "JSON veya string"
            },
            timeout_ms: {
                type: "number",
                label: "Timeout (ms)",
                required: false,
                default: 30000
            }
        }
    },
    webhook_call: {
        type: "webhook_call",
        category: "integrations",
        label: "Webhook Call",
        description: "Dış sistemlere event gönderme",
        icon: "Webhook",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            url: {
                type: "string",
                label: "URL",
                required: true
            },
            method: {
                type: "select",
                label: "Method",
                required: true,
                default: "POST",
                options: [
                    {
                        value: "POST",
                        label: "POST"
                    },
                    {
                        value: "PUT",
                        label: "PUT"
                    }
                ]
            },
            body: {
                type: "textarea",
                label: "Body",
                required: false
            }
        }
    },
    db_query: {
        type: "db_query",
        category: "integrations",
        label: "Database Query",
        description: "SQL query çalıştırma",
        icon: "Database",
        color: "bg-teal-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            connection: {
                type: "string",
                label: "Connection",
                required: true
            },
            query: {
                type: "textarea",
                label: "Query",
                required: true,
                placeholder: "SELECT * FROM users WHERE id = {{user_id}}"
            }
        }
    },
    // ========== DATA & UTILS ==========
    transform: {
        type: "transform",
        category: "data-utils",
        label: "Transform",
        description: "Veri dönüşümü",
        icon: "Settings",
        color: "bg-indigo-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            script_type: {
                type: "select",
                label: "Script Type",
                required: true,
                default: "js",
                options: [
                    {
                        value: "jsonata",
                        label: "JSONata"
                    },
                    {
                        value: "js",
                        label: "JavaScript"
                    },
                    {
                        value: "jinja",
                        label: "Jinja"
                    }
                ]
            },
            expression: {
                type: "textarea",
                label: "Expression",
                required: true,
                placeholder: "return { fullName: ctx.firstName + ' ' + ctx.lastName }"
            }
        }
    },
    filter: {
        type: "filter",
        category: "data-utils",
        label: "Filter",
        description: "Şart kontrolü ve filtreleme",
        icon: "Filter",
        color: "bg-pink-600",
        inputs: 1,
        outputs: [
            "pass",
            "fail"
        ],
        phase: 1,
        configSchema: {
            expression: {
                type: "string",
                label: "Expression",
                required: true,
                placeholder: "{{ context.amount > 1000 }}"
            },
            mode: {
                type: "select",
                label: "Mode",
                required: true,
                default: "continue",
                options: [
                    {
                        value: "continue",
                        label: "Continue"
                    },
                    {
                        value: "stop",
                        label: "Stop"
                    },
                    {
                        value: "branch_error",
                        label: "Branch Error"
                    }
                ]
            }
        }
    },
    map_fields: {
        type: "map_fields",
        category: "data-utils",
        label: "Map Fields",
        description: "Alan eşleştirme",
        icon: "ArrowRightLeft",
        color: "bg-orange-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            mappings: {
                type: "array",
                label: "Mappings",
                required: true,
                default: []
            }
        }
    },
    log: {
        type: "log",
        category: "data-utils",
        label: "Log",
        description: "Debug için loglama",
        icon: "FileText",
        color: "bg-gray-500",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            message_template: {
                type: "textarea",
                label: "Message Template",
                required: true,
                placeholder: "Current user: {{context.userId}}"
            }
        }
    },
    // ========== OUTPUTS ==========
    output: {
        type: "output",
        category: "outputs",
        label: "Output",
        description: "Workflow çıktısı",
        icon: "FileOutput",
        color: "bg-orange-600",
        inputs: 1,
        outputs: 0,
        phase: 1,
        configSchema: {
            payload_template: {
                type: "textarea",
                label: "Payload Template",
                required: false,
                placeholder: "{{ context.result }}"
            }
        }
    },
    notify: {
        type: "notify",
        category: "outputs",
        label: "Notify",
        description: "Bildirim gönderme",
        icon: "Bell",
        color: "bg-yellow-500",
        inputs: 1,
        outputs: 0,
        phase: 2,
        configSchema: {
            channel: {
                type: "select",
                label: "Channel",
                required: true,
                default: "email",
                options: [
                    {
                        value: "email",
                        label: "Email"
                    },
                    {
                        value: "webhook",
                        label: "Webhook"
                    },
                    {
                        value: "slack",
                        label: "Slack"
                    }
                ]
            },
            target: {
                type: "string",
                label: "Target",
                required: true,
                placeholder: "email@example.com veya webhook URL"
            },
            message_template: {
                type: "textarea",
                label: "Message Template",
                required: true
            }
        }
    },
    // ========== YENİ TRIGGERS ==========
    email_trigger: {
        type: "email_trigger",
        category: "triggers",
        label: "Email Trigger",
        description: "Gelen e-posta ile workflow'u tetikler",
        icon: "Mail",
        color: "bg-blue-500",
        inputs: 0,
        outputs: 1,
        phase: 2,
        configSchema: {
            email_address: {
                type: "string",
                label: "Email Address",
                required: true,
                placeholder: "trigger@example.com"
            },
            filter_subject: {
                type: "string",
                label: "Subject Filter",
                required: false,
                placeholder: "Optional subject filter"
            }
        }
    },
    file_watch_trigger: {
        type: "file_watch_trigger",
        category: "triggers",
        label: "File Watch",
        description: "Dosya değişikliklerini izler",
        icon: "File",
        color: "bg-indigo-500",
        inputs: 0,
        outputs: 1,
        phase: 2,
        configSchema: {
            watch_path: {
                type: "string",
                label: "Watch Path",
                required: true,
                placeholder: "/path/to/watch"
            },
            file_pattern: {
                type: "string",
                label: "File Pattern",
                required: false,
                placeholder: "*.json"
            }
        }
    },
    // ========== YENİ FLOW & LOGIC ==========
    merge: {
        type: "merge",
        category: "flow-logic",
        label: "Merge",
        description: "Birden fazla branch'i birleştirir",
        icon: "GitMerge",
        color: "bg-indigo-500",
        inputs: [
            "branch_1",
            "branch_2"
        ],
        outputs: 1,
        phase: 2,
        configSchema: {
            merge_strategy: {
                type: "select",
                label: "Merge Strategy",
                required: true,
                default: "all",
                options: [
                    {
                        value: "all",
                        label: "Wait for All"
                    },
                    {
                        value: "first",
                        label: "First to Complete"
                    }
                ]
            }
        }
    },
    wait: {
        type: "wait",
        category: "flow-logic",
        label: "Wait",
        description: "Belirli bir koşul gerçekleşene kadar bekler",
        icon: "Clock",
        color: "bg-gray-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            wait_condition: {
                type: "string",
                label: "Wait Condition",
                required: true,
                placeholder: "{{ context.status === 'ready' }}"
            },
            timeout_seconds: {
                type: "number",
                label: "Timeout (seconds)",
                required: false,
                default: 60
            }
        }
    },
    // ========== YENİ AI NODES ==========
    ai_embed: {
        type: "ai_embed",
        category: "ai-nodes",
        label: "AI Embed",
        description: "Metni vektör embedding'e dönüştürür",
        icon: "Brain",
        color: "bg-purple-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            provider: {
                type: "select",
                label: "Provider",
                required: true,
                default: "openai",
                options: [
                    {
                        value: "openai",
                        label: "OpenAI"
                    },
                    {
                        value: "cohere",
                        label: "Cohere"
                    },
                    {
                        value: "hf",
                        label: "HuggingFace"
                    }
                ]
            },
            model: {
                type: "string",
                label: "Model",
                required: true,
                placeholder: "text-embedding-ada-002"
            }
        }
    },
    ai_summarize: {
        type: "ai_summarize",
        category: "ai-nodes",
        label: "AI Summarize",
        description: "Metni özetler",
        icon: "Brain",
        color: "bg-purple-300",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            max_length: {
                type: "number",
                label: "Max Length",
                required: false,
                default: 200
            },
            style: {
                type: "select",
                label: "Style",
                required: false,
                default: "concise",
                options: [
                    {
                        value: "concise",
                        label: "Concise"
                    },
                    {
                        value: "detailed",
                        label: "Detailed"
                    },
                    {
                        value: "bullet",
                        label: "Bullet Points"
                    }
                ]
            }
        }
    },
    ai_translate: {
        type: "ai_translate",
        category: "ai-nodes",
        label: "AI Translate",
        description: "Metni farklı dillere çevirir",
        icon: "Brain",
        color: "bg-purple-200",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            target_language: {
                type: "string",
                label: "Target Language",
                required: true,
                placeholder: "en, tr, de, fr"
            },
            source_language: {
                type: "string",
                label: "Source Language (auto-detect if empty)",
                required: false
            }
        }
    },
    // ========== YENİ INTEGRATIONS - HTTP ==========
    rest_api: {
        type: "rest_api",
        category: "integrations",
        label: "REST API",
        description: "RESTful API çağrısı",
        icon: "Globe",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            endpoint: {
                type: "string",
                label: "Endpoint",
                required: true
            },
            method: {
                type: "select",
                label: "Method",
                required: true,
                default: "GET",
                options: [
                    {
                        value: "GET",
                        label: "GET"
                    },
                    {
                        value: "POST",
                        label: "POST"
                    },
                    {
                        value: "PUT",
                        label: "PUT"
                    },
                    {
                        value: "DELETE",
                        label: "DELETE"
                    },
                    {
                        value: "PATCH",
                        label: "PATCH"
                    }
                ]
            },
            authentication: {
                type: "select",
                label: "Authentication",
                required: false,
                default: "none",
                options: [
                    {
                        value: "none",
                        label: "None"
                    },
                    {
                        value: "bearer",
                        label: "Bearer Token"
                    },
                    {
                        value: "basic",
                        label: "Basic Auth"
                    },
                    {
                        value: "oauth2",
                        label: "OAuth 2.0"
                    }
                ]
            }
        }
    },
    graphql: {
        type: "graphql",
        category: "integrations",
        label: "GraphQL",
        description: "GraphQL query/mutation",
        icon: "Code",
        color: "bg-pink-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            endpoint: {
                type: "string",
                label: "GraphQL Endpoint",
                required: true,
                placeholder: "https://api.example.com/graphql"
            },
            query: {
                type: "textarea",
                label: "Query/Mutation",
                required: true,
                rows: 8
            },
            variables: {
                type: "object",
                label: "Variables",
                required: false
            }
        }
    },
    // ========== YENİ INTEGRATIONS - DATABASE ==========
    db_insert: {
        type: "db_insert",
        category: "integrations",
        label: "DB Insert",
        description: "Veritabanına kayıt ekler",
        icon: "Database",
        color: "bg-teal-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            connection: {
                type: "string",
                label: "Connection",
                required: true
            },
            table: {
                type: "string",
                label: "Table",
                required: true
            },
            data: {
                type: "object",
                label: "Data",
                required: true
            }
        }
    },
    db_update: {
        type: "db_update",
        category: "integrations",
        label: "DB Update",
        description: "Veritabanı kaydını günceller",
        icon: "Database",
        color: "bg-teal-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            connection: {
                type: "string",
                label: "Connection",
                required: true
            },
            table: {
                type: "string",
                label: "Table",
                required: true
            },
            where: {
                type: "string",
                label: "WHERE Clause",
                required: true,
                placeholder: "id = {{ context.id }}"
            },
            data: {
                type: "object",
                label: "Data",
                required: true
            }
        }
    },
    db_delete: {
        type: "db_delete",
        category: "integrations",
        label: "DB Delete",
        description: "Veritabanı kaydını siler",
        icon: "Database",
        color: "bg-red-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            connection: {
                type: "string",
                label: "Connection",
                required: true
            },
            table: {
                type: "string",
                label: "Table",
                required: true
            },
            where: {
                type: "string",
                label: "WHERE Clause",
                required: true
            }
        }
    },
    // ========== GOOGLE INTEGRATIONS ==========
    google_sheets: {
        type: "google_sheets",
        category: "integrations",
        label: "Google Sheets",
        description: "Google Sheets ile çalışır",
        icon: "FileSpreadsheet",
        color: "bg-green-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "read",
                options: [
                    {
                        value: "read",
                        label: "Read Range"
                    },
                    {
                        value: "write",
                        label: "Write Range"
                    },
                    {
                        value: "append",
                        label: "Append Row"
                    },
                    {
                        value: "update",
                        label: "Update Cell"
                    }
                ]
            },
            spreadsheet_id: {
                type: "string",
                label: "Spreadsheet ID",
                required: true
            },
            range: {
                type: "string",
                label: "Range",
                required: true,
                placeholder: "Sheet1!A1:B10"
            },
            credentials: {
                type: "string",
                label: "Credentials (JSON)",
                required: true,
                description: "Google Service Account JSON"
            }
        }
    },
    google_drive: {
        type: "google_drive",
        category: "integrations",
        label: "Google Drive",
        description: "Google Drive dosya işlemleri",
        icon: "HardDrive",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "list",
                options: [
                    {
                        value: "list",
                        label: "List Files"
                    },
                    {
                        value: "download",
                        label: "Download File"
                    },
                    {
                        value: "upload",
                        label: "Upload File"
                    },
                    {
                        value: "delete",
                        label: "Delete File"
                    },
                    {
                        value: "share",
                        label: "Share File"
                    }
                ]
            },
            file_id: {
                type: "string",
                label: "File ID",
                required: false
            },
            folder_id: {
                type: "string",
                label: "Folder ID",
                required: false
            }
        }
    },
    google_calendar: {
        type: "google_calendar",
        category: "integrations",
        label: "Google Calendar",
        description: "Google Calendar etkinlik yönetimi",
        icon: "Calendar",
        color: "bg-blue-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "list",
                options: [
                    {
                        value: "list",
                        label: "List Events"
                    },
                    {
                        value: "create",
                        label: "Create Event"
                    },
                    {
                        value: "update",
                        label: "Update Event"
                    },
                    {
                        value: "delete",
                        label: "Delete Event"
                    }
                ]
            },
            calendar_id: {
                type: "string",
                label: "Calendar ID",
                required: false,
                default: "primary"
            }
        }
    },
    google_gmail: {
        type: "google_gmail",
        category: "integrations",
        label: "Gmail",
        description: "Gmail e-posta işlemleri",
        icon: "Mail",
        color: "bg-red-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "send",
                options: [
                    {
                        value: "send",
                        label: "Send Email"
                    },
                    {
                        value: "read",
                        label: "Read Emails"
                    },
                    {
                        value: "search",
                        label: "Search Emails"
                    }
                ]
            },
            to: {
                type: "string",
                label: "To",
                required: false
            },
            subject: {
                type: "string",
                label: "Subject",
                required: false
            },
            body: {
                type: "textarea",
                label: "Body",
                required: false
            }
        }
    },
    google_analytics: {
        type: "google_analytics",
        category: "integrations",
        label: "Google Analytics",
        description: "Google Analytics veri çekme",
        icon: "BarChart",
        color: "bg-orange-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            property_id: {
                type: "string",
                label: "Property ID",
                required: true
            },
            date_range: {
                type: "string",
                label: "Date Range",
                required: false,
                default: "7daysAgo"
            },
            metrics: {
                type: "array",
                label: "Metrics",
                required: true,
                default: [
                    "sessions",
                    "users"
                ]
            }
        }
    },
    google_cloud_storage: {
        type: "google_cloud_storage",
        category: "integrations",
        label: "Google Cloud Storage",
        description: "GCS bucket işlemleri",
        icon: "Cloud",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "upload",
                options: [
                    {
                        value: "upload",
                        label: "Upload"
                    },
                    {
                        value: "download",
                        label: "Download"
                    },
                    {
                        value: "list",
                        label: "List Objects"
                    },
                    {
                        value: "delete",
                        label: "Delete"
                    }
                ]
            },
            bucket: {
                type: "string",
                label: "Bucket Name",
                required: true
            },
            object_path: {
                type: "string",
                label: "Object Path",
                required: false
            }
        }
    },
    // ========== COMMUNICATION INTEGRATIONS ==========
    slack: {
        type: "slack",
        category: "integrations",
        label: "Slack",
        description: "Slack mesaj gönderme",
        icon: "MessageSquare",
        color: "bg-purple-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "send_message",
                options: [
                    {
                        value: "send_message",
                        label: "Send Message"
                    },
                    {
                        value: "send_dm",
                        label: "Send DM"
                    },
                    {
                        value: "create_channel",
                        label: "Create Channel"
                    }
                ]
            },
            channel: {
                type: "string",
                label: "Channel",
                required: true,
                placeholder: "#general"
            },
            message: {
                type: "textarea",
                label: "Message",
                required: true
            },
            bot_token: {
                type: "string",
                label: "Bot Token",
                required: true
            }
        }
    },
    discord: {
        type: "discord",
        category: "integrations",
        label: "Discord",
        description: "Discord mesaj gönderme",
        icon: "MessageCircle",
        color: "bg-indigo-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            webhook_url: {
                type: "string",
                label: "Webhook URL",
                required: true
            },
            message: {
                type: "textarea",
                label: "Message",
                required: true
            },
            username: {
                type: "string",
                label: "Username",
                required: false
            }
        }
    },
    telegram: {
        type: "telegram",
        category: "integrations",
        label: "Telegram",
        description: "Telegram mesaj gönderme",
        icon: "Send",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            bot_token: {
                type: "string",
                label: "Bot Token",
                required: true
            },
            chat_id: {
                type: "string",
                label: "Chat ID",
                required: true
            },
            message: {
                type: "textarea",
                label: "Message",
                required: true
            }
        }
    },
    whatsapp: {
        type: "whatsapp",
        category: "integrations",
        label: "WhatsApp",
        description: "WhatsApp mesaj gönderme",
        icon: "MessageSquare",
        color: "bg-green-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            phone_number: {
                type: "string",
                label: "Phone Number",
                required: true,
                placeholder: "+1234567890"
            },
            message: {
                type: "textarea",
                label: "Message",
                required: true
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            }
        }
    },
    sms: {
        type: "sms",
        category: "integrations",
        label: "SMS",
        description: "SMS gönderme",
        icon: "Phone",
        color: "bg-green-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            provider: {
                type: "select",
                label: "Provider",
                required: true,
                default: "twilio",
                options: [
                    {
                        value: "twilio",
                        label: "Twilio"
                    },
                    {
                        value: "aws_sns",
                        label: "AWS SNS"
                    }
                ]
            },
            to: {
                type: "string",
                label: "To",
                required: true
            },
            message: {
                type: "string",
                label: "Message",
                required: true
            }
        }
    },
    // ========== CLOUD STORAGE ==========
    aws_s3: {
        type: "aws_s3",
        category: "integrations",
        label: "AWS S3",
        description: "Amazon S3 işlemleri",
        icon: "Cloud",
        color: "bg-orange-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "upload",
                options: [
                    {
                        value: "upload",
                        label: "Upload"
                    },
                    {
                        value: "download",
                        label: "Download"
                    },
                    {
                        value: "list",
                        label: "List Objects"
                    },
                    {
                        value: "delete",
                        label: "Delete"
                    }
                ]
            },
            bucket: {
                type: "string",
                label: "Bucket",
                required: true
            },
            key: {
                type: "string",
                label: "Object Key",
                required: false
            },
            access_key: {
                type: "string",
                label: "Access Key",
                required: true
            },
            secret_key: {
                type: "string",
                label: "Secret Key",
                required: true
            }
        }
    },
    azure_blob: {
        type: "azure_blob",
        category: "integrations",
        label: "Azure Blob Storage",
        description: "Azure Blob Storage işlemleri",
        icon: "Cloud",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "upload",
                options: [
                    {
                        value: "upload",
                        label: "Upload"
                    },
                    {
                        value: "download",
                        label: "Download"
                    },
                    {
                        value: "list",
                        label: "List Blobs"
                    }
                ]
            },
            container: {
                type: "string",
                label: "Container",
                required: true
            },
            blob_name: {
                type: "string",
                label: "Blob Name",
                required: false
            },
            connection_string: {
                type: "string",
                label: "Connection String",
                required: true
            }
        }
    },
    dropbox: {
        type: "dropbox",
        category: "integrations",
        label: "Dropbox",
        description: "Dropbox dosya işlemleri",
        icon: "Cloud",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "upload",
                options: [
                    {
                        value: "upload",
                        label: "Upload"
                    },
                    {
                        value: "download",
                        label: "Download"
                    },
                    {
                        value: "list",
                        label: "List Files"
                    }
                ]
            },
            path: {
                type: "string",
                label: "Path",
                required: true,
                placeholder: "/folder/file.txt"
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    // ========== PRODUCTIVITY ==========
    notion: {
        type: "notion",
        category: "integrations",
        label: "Notion",
        description: "Notion sayfa ve veritabanı işlemleri",
        icon: "FileText",
        color: "bg-gray-800",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_page",
                options: [
                    {
                        value: "create_page",
                        label: "Create Page"
                    },
                    {
                        value: "update_page",
                        label: "Update Page"
                    },
                    {
                        value: "query_database",
                        label: "Query Database"
                    }
                ]
            },
            database_id: {
                type: "string",
                label: "Database ID",
                required: false
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            }
        }
    },
    airtable: {
        type: "airtable",
        category: "integrations",
        label: "Airtable",
        description: "Airtable kayıt işlemleri",
        icon: "Table",
        color: "bg-blue-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create",
                options: [
                    {
                        value: "create",
                        label: "Create Record"
                    },
                    {
                        value: "read",
                        label: "Read Records"
                    },
                    {
                        value: "update",
                        label: "Update Record"
                    },
                    {
                        value: "delete",
                        label: "Delete Record"
                    }
                ]
            },
            base_id: {
                type: "string",
                label: "Base ID",
                required: true
            },
            table_name: {
                type: "string",
                label: "Table Name",
                required: true
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            }
        }
    },
    trello: {
        type: "trello",
        category: "integrations",
        label: "Trello",
        description: "Trello kart ve liste işlemleri",
        icon: "Grid",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_card",
                options: [
                    {
                        value: "create_card",
                        label: "Create Card"
                    },
                    {
                        value: "update_card",
                        label: "Update Card"
                    },
                    {
                        value: "list_cards",
                        label: "List Cards"
                    }
                ]
            },
            board_id: {
                type: "string",
                label: "Board ID",
                required: true
            },
            list_id: {
                type: "string",
                label: "List ID",
                required: false
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            },
            token: {
                type: "string",
                label: "Token",
                required: true
            }
        }
    },
    asana: {
        type: "asana",
        category: "integrations",
        label: "Asana",
        description: "Asana görev yönetimi",
        icon: "CheckSquare",
        color: "bg-purple-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_task",
                options: [
                    {
                        value: "create_task",
                        label: "Create Task"
                    },
                    {
                        value: "update_task",
                        label: "Update Task"
                    },
                    {
                        value: "list_tasks",
                        label: "List Tasks"
                    }
                ]
            },
            project_id: {
                type: "string",
                label: "Project ID",
                required: false
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    jira: {
        type: "jira",
        category: "integrations",
        label: "Jira",
        description: "Jira issue yönetimi",
        icon: "Bug",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_issue",
                options: [
                    {
                        value: "create_issue",
                        label: "Create Issue"
                    },
                    {
                        value: "update_issue",
                        label: "Update Issue"
                    },
                    {
                        value: "search_issues",
                        label: "Search Issues"
                    }
                ]
            },
            project_key: {
                type: "string",
                label: "Project Key",
                required: true
            },
            domain: {
                type: "string",
                label: "Jira Domain",
                required: true,
                placeholder: "yourcompany.atlassian.net"
            },
            email: {
                type: "string",
                label: "Email",
                required: true
            },
            api_token: {
                type: "string",
                label: "API Token",
                required: true
            }
        }
    },
    // ========== E-COMMERCE ==========
    shopify: {
        type: "shopify",
        category: "integrations",
        label: "Shopify",
        description: "Shopify mağaza işlemleri",
        icon: "ShoppingCart",
        color: "bg-green-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "get_products",
                options: [
                    {
                        value: "get_products",
                        label: "Get Products"
                    },
                    {
                        value: "create_product",
                        label: "Create Product"
                    },
                    {
                        value: "get_orders",
                        label: "Get Orders"
                    },
                    {
                        value: "update_order",
                        label: "Update Order"
                    }
                ]
            },
            shop_domain: {
                type: "string",
                label: "Shop Domain",
                required: true,
                placeholder: "your-shop.myshopify.com"
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    woocommerce: {
        type: "woocommerce",
        category: "integrations",
        label: "WooCommerce",
        description: "WooCommerce mağaza işlemleri",
        icon: "ShoppingBag",
        color: "bg-purple-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "get_products",
                options: [
                    {
                        value: "get_products",
                        label: "Get Products"
                    },
                    {
                        value: "create_order",
                        label: "Create Order"
                    },
                    {
                        value: "get_orders",
                        label: "Get Orders"
                    }
                ]
            },
            store_url: {
                type: "string",
                label: "Store URL",
                required: true
            },
            consumer_key: {
                type: "string",
                label: "Consumer Key",
                required: true
            },
            consumer_secret: {
                type: "string",
                label: "Consumer Secret",
                required: true
            }
        }
    },
    stripe: {
        type: "stripe",
        category: "integrations",
        label: "Stripe",
        description: "Stripe ödeme işlemleri",
        icon: "CreditCard",
        color: "bg-indigo-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_payment",
                options: [
                    {
                        value: "create_payment",
                        label: "Create Payment"
                    },
                    {
                        value: "create_customer",
                        label: "Create Customer"
                    },
                    {
                        value: "list_charges",
                        label: "List Charges"
                    },
                    {
                        value: "refund",
                        label: "Refund"
                    }
                ]
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            },
            amount: {
                type: "number",
                label: "Amount (cents)",
                required: false
            },
            currency: {
                type: "string",
                label: "Currency",
                required: false,
                default: "usd"
            }
        }
    },
    paypal: {
        type: "paypal",
        category: "integrations",
        label: "PayPal",
        description: "PayPal ödeme işlemleri",
        icon: "CreditCard",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_order",
                options: [
                    {
                        value: "create_order",
                        label: "Create Order"
                    },
                    {
                        value: "capture_order",
                        label: "Capture Order"
                    }
                ]
            },
            client_id: {
                type: "string",
                label: "Client ID",
                required: true
            },
            client_secret: {
                type: "string",
                label: "Client Secret",
                required: true
            },
            mode: {
                type: "select",
                label: "Mode",
                required: true,
                default: "sandbox",
                options: [
                    {
                        value: "sandbox",
                        label: "Sandbox"
                    },
                    {
                        value: "live",
                        label: "Live"
                    }
                ]
            }
        }
    },
    // ========== SOCIAL MEDIA ==========
    twitter: {
        type: "twitter",
        category: "integrations",
        label: "Twitter / X",
        description: "Twitter/X tweet işlemleri",
        icon: "Twitter",
        color: "bg-black",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "post_tweet",
                options: [
                    {
                        value: "post_tweet",
                        label: "Post Tweet"
                    },
                    {
                        value: "search_tweets",
                        label: "Search Tweets"
                    },
                    {
                        value: "get_user_tweets",
                        label: "Get User Tweets"
                    }
                ]
            },
            text: {
                type: "textarea",
                label: "Tweet Text",
                required: false
            },
            bearer_token: {
                type: "string",
                label: "Bearer Token",
                required: true
            }
        }
    },
    facebook: {
        type: "facebook",
        category: "integrations",
        label: "Facebook",
        description: "Facebook post işlemleri",
        icon: "Facebook",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "post",
                options: [
                    {
                        value: "post",
                        label: "Create Post"
                    },
                    {
                        value: "get_posts",
                        label: "Get Posts"
                    }
                ]
            },
            page_id: {
                type: "string",
                label: "Page ID",
                required: true
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    instagram: {
        type: "instagram",
        category: "integrations",
        label: "Instagram",
        description: "Instagram post işlemleri",
        icon: "Instagram",
        color: "bg-pink-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "post_photo",
                options: [
                    {
                        value: "post_photo",
                        label: "Post Photo"
                    },
                    {
                        value: "get_media",
                        label: "Get Media"
                    }
                ]
            },
            image_url: {
                type: "string",
                label: "Image URL",
                required: false
            },
            caption: {
                type: "string",
                label: "Caption",
                required: false
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    linkedin: {
        type: "linkedin",
        category: "integrations",
        label: "LinkedIn",
        description: "LinkedIn post işlemleri",
        icon: "Linkedin",
        color: "bg-blue-700",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "post",
                options: [
                    {
                        value: "post",
                        label: "Create Post"
                    },
                    {
                        value: "get_posts",
                        label: "Get Posts"
                    }
                ]
            },
            text: {
                type: "textarea",
                label: "Post Text",
                required: false
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    youtube: {
        type: "youtube",
        category: "integrations",
        label: "YouTube",
        description: "YouTube video işlemleri",
        icon: "Youtube",
        color: "bg-red-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "search",
                options: [
                    {
                        value: "search",
                        label: "Search Videos"
                    },
                    {
                        value: "get_video",
                        label: "Get Video Details"
                    },
                    {
                        value: "get_comments",
                        label: "Get Comments"
                    }
                ]
            },
            query: {
                type: "string",
                label: "Search Query",
                required: false
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            }
        }
    },
    // ========== CRM ==========
    salesforce: {
        type: "salesforce",
        category: "integrations",
        label: "Salesforce",
        description: "Salesforce CRM işlemleri",
        icon: "TrendingUp",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "query",
                options: [
                    {
                        value: "query",
                        label: "SOQL Query"
                    },
                    {
                        value: "create",
                        label: "Create Record"
                    },
                    {
                        value: "update",
                        label: "Update Record"
                    }
                ]
            },
            soql: {
                type: "textarea",
                label: "SOQL Query",
                required: false,
                placeholder: "SELECT Id, Name FROM Account"
            },
            instance_url: {
                type: "string",
                label: "Instance URL",
                required: true
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    hubspot: {
        type: "hubspot",
        category: "integrations",
        label: "HubSpot",
        description: "HubSpot CRM işlemleri",
        icon: "TrendingUp",
        color: "bg-orange-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_contact",
                options: [
                    {
                        value: "create_contact",
                        label: "Create Contact"
                    },
                    {
                        value: "update_contact",
                        label: "Update Contact"
                    },
                    {
                        value: "get_contact",
                        label: "Get Contact"
                    }
                ]
            },
            api_key: {
                type: "string",
                label: "API Key",
                required: true
            }
        }
    },
    zoho: {
        type: "zoho",
        category: "integrations",
        label: "Zoho CRM",
        description: "Zoho CRM işlemleri",
        icon: "TrendingUp",
        color: "bg-red-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            action: {
                type: "select",
                label: "Action",
                required: true,
                default: "create_record",
                options: [
                    {
                        value: "create_record",
                        label: "Create Record"
                    },
                    {
                        value: "update_record",
                        label: "Update Record"
                    },
                    {
                        value: "search_records",
                        label: "Search Records"
                    }
                ]
            },
            module: {
                type: "string",
                label: "Module",
                required: true,
                placeholder: "Leads, Contacts, Deals"
            },
            access_token: {
                type: "string",
                label: "Access Token",
                required: true
            }
        }
    },
    // ========== YENİ DATA & UTILS ==========
    set_variable: {
        type: "set_variable",
        category: "data-utils",
        label: "Set Variable",
        description: "Değişken tanımlama",
        icon: "Variable",
        color: "bg-cyan-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            variable_name: {
                type: "string",
                label: "Variable Name",
                required: true,
                placeholder: "myVar"
            },
            value: {
                type: "string",
                label: "Value",
                required: true,
                placeholder: "{{ context.data }}"
            }
        }
    },
    get_variable: {
        type: "get_variable",
        category: "data-utils",
        label: "Get Variable",
        description: "Değişken okuma",
        icon: "Variable",
        color: "bg-cyan-500",
        inputs: 0,
        outputs: 1,
        phase: 1,
        configSchema: {
            variable_name: {
                type: "string",
                label: "Variable Name",
                required: true
            }
        }
    },
    json_parse: {
        type: "json_parse",
        category: "data-utils",
        label: "JSON Parse",
        description: "JSON string'i parse eder",
        icon: "Code",
        color: "bg-yellow-500",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            json_string: {
                type: "string",
                label: "JSON String",
                required: true,
                placeholder: "{{ context.jsonString }}"
            }
        }
    },
    json_stringify: {
        type: "json_stringify",
        category: "data-utils",
        label: "JSON Stringify",
        description: "Obje'yi JSON string'e çevirir",
        icon: "Code",
        color: "bg-yellow-400",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {
            pretty: {
                type: "boolean",
                label: "Pretty Print",
                required: false,
                default: false
            }
        }
    },
    csv_parse: {
        type: "csv_parse",
        category: "data-utils",
        label: "CSV Parse",
        description: "CSV string'i parse eder",
        icon: "FileSpreadsheet",
        color: "bg-green-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            csv_string: {
                type: "string",
                label: "CSV String",
                required: true
            },
            delimiter: {
                type: "string",
                label: "Delimiter",
                required: false,
                default: ","
            },
            has_headers: {
                type: "boolean",
                label: "Has Headers",
                required: false,
                default: true
            }
        }
    },
    csv_generate: {
        type: "csv_generate",
        category: "data-utils",
        label: "CSV Generate",
        description: "Array'den CSV oluşturur",
        icon: "FileSpreadsheet",
        color: "bg-green-400",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            data: {
                type: "array",
                label: "Data Array",
                required: true
            },
            delimiter: {
                type: "string",
                label: "Delimiter",
                required: false,
                default: ","
            }
        }
    },
    xml_parse: {
        type: "xml_parse",
        category: "data-utils",
        label: "XML Parse",
        description: "XML string'i parse eder",
        icon: "FileCode",
        color: "bg-orange-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            xml_string: {
                type: "string",
                label: "XML String",
                required: true
            }
        }
    },
    base64_encode: {
        type: "base64_encode",
        category: "data-utils",
        label: "Base64 Encode",
        description: "String'i Base64'e encode eder",
        icon: "Lock",
        color: "bg-gray-600",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {}
    },
    base64_decode: {
        type: "base64_decode",
        category: "data-utils",
        label: "Base64 Decode",
        description: "Base64 string'i decode eder",
        icon: "Unlock",
        color: "bg-gray-500",
        inputs: 1,
        outputs: 1,
        phase: 1,
        configSchema: {}
    },
    hash: {
        type: "hash",
        category: "data-utils",
        label: "Hash",
        description: "String'i hash'ler",
        icon: "Lock",
        color: "bg-gray-700",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            algorithm: {
                type: "select",
                label: "Algorithm",
                required: true,
                default: "sha256",
                options: [
                    {
                        value: "md5",
                        label: "MD5"
                    },
                    {
                        value: "sha1",
                        label: "SHA1"
                    },
                    {
                        value: "sha256",
                        label: "SHA256"
                    },
                    {
                        value: "sha512",
                        label: "SHA512"
                    }
                ]
            }
        }
    },
    encrypt: {
        type: "encrypt",
        category: "data-utils",
        label: "Encrypt",
        description: "Veriyi şifreler",
        icon: "Lock",
        color: "bg-red-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            algorithm: {
                type: "select",
                label: "Algorithm",
                required: true,
                default: "aes-256-gcm",
                options: [
                    {
                        value: "aes-256-gcm",
                        label: "AES-256-GCM"
                    },
                    {
                        value: "aes-128-gcm",
                        label: "AES-128-GCM"
                    }
                ]
            },
            key: {
                type: "string",
                label: "Encryption Key",
                required: true
            }
        }
    },
    decrypt: {
        type: "decrypt",
        category: "data-utils",
        label: "Decrypt",
        description: "Şifrelenmiş veriyi çözer",
        icon: "Unlock",
        color: "bg-red-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            algorithm: {
                type: "select",
                label: "Algorithm",
                required: true,
                default: "aes-256-gcm",
                options: [
                    {
                        value: "aes-256-gcm",
                        label: "AES-256-GCM"
                    },
                    {
                        value: "aes-128-gcm",
                        label: "AES-128-GCM"
                    }
                ]
            },
            key: {
                type: "string",
                label: "Decryption Key",
                required: true
            }
        }
    },
    // ========== YENİ OUTPUTS ==========
    email_send: {
        type: "email_send",
        category: "outputs",
        label: "Send Email",
        description: "E-posta gönderir",
        icon: "Mail",
        color: "bg-blue-500",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            to: {
                type: "string",
                label: "To",
                required: true
            },
            subject: {
                type: "string",
                label: "Subject",
                required: true
            },
            body: {
                type: "textarea",
                label: "Body",
                required: true
            },
            from: {
                type: "string",
                label: "From",
                required: false
            },
            smtp_server: {
                type: "string",
                label: "SMTP Server",
                required: true
            },
            smtp_port: {
                type: "number",
                label: "SMTP Port",
                required: false,
                default: 587
            }
        }
    },
    file_write: {
        type: "file_write",
        category: "outputs",
        label: "Write File",
        description: "Dosyaya yazar",
        icon: "File",
        color: "bg-gray-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            file_path: {
                type: "string",
                label: "File Path",
                required: true,
                placeholder: "/path/to/file.txt"
            },
            content: {
                type: "textarea",
                label: "Content",
                required: true
            },
            mode: {
                type: "select",
                label: "Mode",
                required: true,
                default: "write",
                options: [
                    {
                        value: "write",
                        label: "Write (Overwrite)"
                    },
                    {
                        value: "append",
                        label: "Append"
                    }
                ]
            }
        }
    },
    file_download: {
        type: "file_download",
        category: "outputs",
        label: "Download File",
        description: "Dosya indirir",
        icon: "Download",
        color: "bg-blue-600",
        inputs: 1,
        outputs: 1,
        phase: 2,
        configSchema: {
            url: {
                type: "string",
                label: "File URL",
                required: true
            },
            save_path: {
                type: "string",
                label: "Save Path",
                required: false
            }
        }
    }
};
const NODE_CATEGORIES = {
    triggers: {
        label: "Triggers",
        description: "Tetikleyiciler",
        icon: "Zap"
    },
    "flow-logic": {
        label: "Flow & Logic",
        description: "Akış & Mantık",
        icon: "GitBranch"
    },
    "ai-nodes": {
        label: "AI Nodes",
        description: "Yapay Zeka",
        icon: "Brain"
    },
    integrations: {
        label: "Integrations",
        description: "Entegrasyonlar",
        icon: "Globe"
    },
    "data-utils": {
        label: "Data & Utils",
        description: "Veri & Yardımcılar",
        icon: "Settings"
    },
    outputs: {
        label: "Outputs",
        description: "Çıktı & Kullanıcıya Dönüş",
        icon: "FileOutput"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/NodePalette.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NodePalette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/nodes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$output$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileOutput$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-output.js [app-client] (ecmascript) <export default as FileOutput>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Webhook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/webhook.js [app-client] (ecmascript) <export default as Webhook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-merge.js [app-client] (ecmascript) <export default as GitMerge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.js [app-client] (ecmascript) <export default as ArrowRightLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play-circle.js [app-client] (ecmascript) <export default as PlayCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$variable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Variable$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/variable.js [app-client] (ecmascript) <export default as Variable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.js [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bar-chart.js [app-client] (ecmascript) <export default as BarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table.js [app-client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-square.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bug$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bug.js [app-client] (ecmascript) <export default as Bug>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/instagram.js [app-client] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/linkedin.js [app-client] (ecmascript) <export default as Linkedin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/youtube.js [app-client] (ecmascript) <export default as Youtube>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlock.js [app-client] (ecmascript) <export default as Unlock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-code.js [app-client] (ecmascript) <export default as FileCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-client] (ecmascript) <export default as Grid>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Icon mapping
const iconMap = {
    Play: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"],
    Brain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
    GitBranch: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"],
    Globe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
    FileOutput: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$output$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileOutput$3e$__["FileOutput"],
    Settings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
    Filter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"],
    Clock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
    Webhook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Webhook$3e$__["Webhook"],
    Database: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
    Bell: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
    Repeat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"],
    GitMerge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__["GitMerge"],
    ArrowRightLeft: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__["ArrowRightLeft"],
    FileText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    PlayCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"],
    Mail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
    File: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
    Code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
    Variable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$variable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Variable$3e$__["Variable"],
    FileSpreadsheet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
    HardDrive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"],
    Calendar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
    BarChart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__["BarChart"],
    Cloud: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"],
    MessageSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
    MessageCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
    Send: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
    Phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
    Table: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"],
    CheckSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
    Bug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bug$3e$__["Bug"],
    ShoppingCart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    ShoppingBag: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
    CreditCard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    Twitter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"],
    Facebook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"],
    Instagram: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"],
    Linkedin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__["Linkedin"],
    Youtube: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__["Youtube"],
    TrendingUp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    Lock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"],
    Unlock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"],
    FileCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__["FileCode"],
    Download: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
    Grid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"]
};
function NodePalette() {
    _s();
    const { screenToFlowPosition } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"])();
    const { addNode: addNodeToStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    const [expandedCategories, setExpandedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set([
        "triggers",
        "flow-logic",
        "ai-nodes",
        "integrations",
        "data-utils",
        "outputs"
    ]));
    const toggleCategory = (category)=>{
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };
    const handleAddNode = (nodeType)=>{
        const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_REGISTRY"][nodeType];
        if (!metadata) return;
        const position = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });
        const Icon = iconMap[metadata.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
        const newNode = {
            id: `${nodeType}-${Date.now()}`,
            type: "custom",
            position,
            data: {
                type: nodeType,
                label: metadata.label,
                description: metadata.description,
                config: {}
            }
        };
        // Direkt store'a ekle - WorkflowCanvas otomatik olarak ReactFlow'a yazacak
        console.log("➕ NodePalette - Node ekleniyor:", newNode);
        addNodeToStore(newNode);
        console.log("➕ NodePalette - Node store'a eklendi");
    };
    // Kategorilere göre node'ları grupla
    const nodesByCategory = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_REGISTRY"]).reduce((acc, [nodeType, metadata])=>{
        if (!acc[metadata.category]) {
            acc[metadata.category] = [];
        }
        acc[metadata.category].push({
            ...metadata,
            type: nodeType
        });
        return acc;
    }, {});
    // Kategori sırası
    const categoryOrder = [
        "triggers",
        "flow-logic",
        "ai-nodes",
        "integrations",
        "data-utils",
        "outputs"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-72 bg-dark-900 border-r border-dark-800 h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-dark-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-foreground mb-1",
                        children: "Node'lar"
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/NodePalette.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Kategorilere göre düzenlenmiş node'lar"
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/NodePalette.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/NodePalette.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto scrollbar-thin",
                children: categoryOrder.map((category)=>{
                    const categoryInfo = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_CATEGORIES"][category];
                    const nodes = nodesByCategory[category] || [];
                    const isExpanded = expandedCategories.has(category);
                    const CategoryIcon = iconMap[categoryInfo.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
                    // Sadece Phase 1 node'ları göster (isteğe bağlı filtreleme)
                    const visibleNodes = nodes; // Tüm node'ları göster, phase 2+ olanları disabled yapabiliriz
                    if (visibleNodes.length === 0) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-dark-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleCategory(category),
                                className: "w-full px-4 py-3 flex items-center justify-between hover:bg-dark-800 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-4 h-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                                lineNumber: 217,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                className: "w-4 h-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                                lineNumber: 219,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                className: "w-4 h-4 text-primary-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-foreground",
                                                children: categoryInfo.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                                lineNumber: 222,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workflow/NodePalette.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-muted-foreground",
                                        children: visibleNodes.length
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/NodePalette.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this),
                            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-2 pb-2 space-y-1",
                                children: visibleNodes.map((node)=>{
                                    const Icon = iconMap[node.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
                                    const isPhase2Plus = node.phase && node.phase > 1;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>!isPhase2Plus && handleAddNode(node.type),
                                        disabled: isPhase2Plus,
                                        className: `w-full p-2.5 rounded-lg border transition-all duration-200 text-left group ${isPhase2Plus ? "border-dark-700 bg-dark-800/50 opacity-50 cursor-not-allowed" : "border-dark-700 bg-dark-800 hover:border-primary-500/50 hover:bg-dark-700"}`,
                                        title: isPhase2Plus ? `${node.label} - Phase ${node.phase} (Yakında)` : node.description,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `${node.color} p-1.5 rounded flex-shrink-0`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: "w-3.5 h-3.5 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workflow/NodePalette.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workflow/NodePalette.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-xs font-medium ${isPhase2Plus ? "text-muted-foreground" : "text-foreground group-hover:text-primary-400 transition-colors"}`,
                                                            children: [
                                                                node.label,
                                                                isPhase2Plus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "ml-1 text-[10px] text-muted-foreground",
                                                                    children: [
                                                                        "(Phase ",
                                                                        node.phase,
                                                                        ")"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workflow/NodePalette.tsx",
                                                                    lineNumber: 267,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/workflow/NodePalette.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 29
                                                        }, this),
                                                        !isPhase2Plus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-muted-foreground mt-0.5 line-clamp-1",
                                                            children: node.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workflow/NodePalette.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workflow/NodePalette.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workflow/NodePalette.tsx",
                                            lineNumber: 253,
                                            columnNumber: 25
                                        }, this)
                                    }, node.type, false, {
                                        fileName: "[project]/components/workflow/NodePalette.tsx",
                                        lineNumber: 238,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/NodePalette.tsx",
                                lineNumber: 232,
                                columnNumber: 17
                            }, this)
                        ]
                    }, category, true, {
                        fileName: "[project]/components/workflow/NodePalette.tsx",
                        lineNumber: 210,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/workflow/NodePalette.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/NodePalette.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(NodePalette, "iwGxjNhT30n97V1mz5HoSEhy0BU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = NodePalette;
var _c;
__turbopack_context__.k.register(_c, "NodePalette");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/NodeTypes.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomNode",
    ()=>CustomNode,
    "nodeTypes",
    ()=>nodeTypes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/nodes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$output$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileOutput$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-output.js [app-client] (ecmascript) <export default as FileOutput>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Webhook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/webhook.js [app-client] (ecmascript) <export default as Webhook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-merge.js [app-client] (ecmascript) <export default as GitMerge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.js [app-client] (ecmascript) <export default as ArrowRightLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play-circle.js [app-client] (ecmascript) <export default as PlayCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$variable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Variable$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/variable.js [app-client] (ecmascript) <export default as Variable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.js [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bar-chart.js [app-client] (ecmascript) <export default as BarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table.js [app-client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-square.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bug$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bug.js [app-client] (ecmascript) <export default as Bug>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/instagram.js [app-client] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/linkedin.js [app-client] (ecmascript) <export default as Linkedin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/youtube.js [app-client] (ecmascript) <export default as Youtube>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlock.js [app-client] (ecmascript) <export default as Unlock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-code.js [app-client] (ecmascript) <export default as FileCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-client] (ecmascript) <export default as Grid>");
;
;
;
;
// Icon mapping
const iconMap = {
    Play: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"],
    Brain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
    GitBranch: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"],
    Globe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
    FileOutput: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$output$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileOutput$3e$__["FileOutput"],
    Settings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
    Filter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"],
    Clock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
    Webhook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Webhook$3e$__["Webhook"],
    Database: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
    Bell: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
    Repeat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"],
    GitMerge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__["GitMerge"],
    ArrowRightLeft: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__["ArrowRightLeft"],
    FileText: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    PlayCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"],
    Mail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
    File: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"],
    Code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
    Variable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$variable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Variable$3e$__["Variable"],
    FileSpreadsheet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
    HardDrive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"],
    Calendar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
    BarChart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bar$2d$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__["BarChart"],
    Cloud: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"],
    MessageSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
    MessageCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
    Send: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
    Phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
    Table: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"],
    CheckSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
    Bug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bug$3e$__["Bug"],
    ShoppingCart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    ShoppingBag: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
    CreditCard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
    Twitter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"],
    Facebook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"],
    Instagram: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"],
    Linkedin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__["Linkedin"],
    Youtube: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Youtube$3e$__["Youtube"],
    TrendingUp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    Lock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"],
    Unlock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"],
    FileCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__["FileCode"],
    Download: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
    Grid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid$3e$__["Grid"]
};
function CustomNode({ data, selected }) {
    const nodeType = data.type;
    const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_REGISTRY"][nodeType];
    if (!metadata) {
        // Fallback for unknown node types
        const Icon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
        const label = data.label || nodeType;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `px-4 py-3 shadow-lg rounded-lg border-2 min-w-[150px] bg-dark-900 ${selected ? "border-primary-500 shadow-primary-500/20" : "border-dark-700"} transition-all duration-200`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                    type: "target",
                    position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Top,
                    className: "!bg-primary-500 !border-2 !border-dark-800"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/NodeTypes.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-600 p-1.5 rounded",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "w-4 h-4 text-white"
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/NodeTypes.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeTypes.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-foreground",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeTypes.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workflow/NodeTypes.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                    type: "source",
                    position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                    className: "!bg-primary-500 !border-2 !border-dark-800"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/NodeTypes.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/workflow/NodeTypes.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this);
    }
    const Icon = iconMap[metadata.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"];
    const label = data.label || metadata.label;
    const description = data.description || metadata.description;
    // Output port sayısını belirle
    const outputCount = Array.isArray(metadata.outputs) ? metadata.outputs.length : typeof metadata.outputs === "number" ? metadata.outputs : 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `px-4 py-3 shadow-lg rounded-lg border-2 min-w-[150px] bg-dark-900 ${selected ? "border-primary-500 shadow-primary-500/20" : "border-dark-700"} transition-all duration-200`,
        children: [
            (typeof metadata.inputs === "number" && metadata.inputs > 0 || Array.isArray(metadata.inputs) && metadata.inputs.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                type: "target",
                position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Top,
                className: "!bg-primary-500 !border-2 !border-dark-800"
            }, void 0, false, {
                fileName: "[project]/components/workflow/NodeTypes.tsx",
                lineNumber: 163,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${metadata.color} p-1.5 rounded`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "w-4 h-4 text-white"
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeTypes.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/NodeTypes.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-foreground",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeTypes.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/NodeTypes.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/NodeTypes.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-muted-foreground mt-1 line-clamp-2",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/workflow/NodeTypes.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this),
            outputCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: outputCount === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                    type: "source",
                    position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                    className: "!bg-primary-500 !border-2 !border-dark-800"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/NodeTypes.tsx",
                    lineNumber: 189,
                    columnNumber: 13
                }, this) : // Multiple outputs - named handles
                Array.isArray(metadata.outputs) && metadata.outputs.map((outputName, index)=>{
                    const outputsArray = metadata.outputs;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                        type: "source",
                        position: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Bottom,
                        id: outputName,
                        style: {
                            left: `${(index + 1) * 100 / (outputsArray.length + 1)}%`
                        },
                        className: "!bg-primary-500 !border-2 !border-dark-800"
                    }, outputName, false, {
                        fileName: "[project]/components/workflow/NodeTypes.tsx",
                        lineNumber: 200,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/NodeTypes.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_c = CustomNode;
const nodeTypes = {
    custom: CustomNode
};
var _c;
__turbopack_context__.k.register(_c, "CustomNode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/WorkflowCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkflowCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript) <export ReactFlow as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/background/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/controls/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/minimap/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodeTypes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/NodeTypes.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function WorkflowCanvas() {
    _s();
    const { nodes: storeNodes, edges: storeEdges, setNodes: setStoreNodes, setEdges: setStoreEdges, setSelectedNode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    // Store'dan başlangıç değerlerini al
    const [nodes, setNodes, onNodesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNodesState"])(storeNodes);
    const [edges, setEdges, onEdgesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEdgesState"])(storeEdges);
    const isInitializedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isUpdatingFromStoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Store'dan gelen değişiklikleri ReactFlow state'ine yansıt
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowCanvas.useEffect": ()=>{
            // İlk yükleme
            if (!isInitializedRef.current) {
                console.log("🎬 WorkflowCanvas - İlk yükleme, nodes:", storeNodes.length, "edges:", storeEdges.length);
                isInitializedRef.current = true;
                isUpdatingFromStoreRef.current = true;
                setNodes(storeNodes);
                setEdges(storeEdges);
                // Flag'i hemen false yap ki sonraki değişiklikler store'a yazılabilsin
                setTimeout({
                    "WorkflowCanvas.useEffect": ()=>{
                        isUpdatingFromStoreRef.current = false;
                    }
                }["WorkflowCanvas.useEffect"], 0);
                return;
            }
            // Store'dan gelen yeni değişiklikleri kontrol et
            const storeNodesStr = JSON.stringify(storeNodes);
            const currentNodesStr = JSON.stringify(nodes);
            const storeEdgesStr = JSON.stringify(storeEdges);
            const currentEdgesStr = JSON.stringify(edges);
            // Eğer store'dan gelen değişiklik varsa ve biz store'dan güncelliyorsak
            if (storeNodesStr !== currentNodesStr && !isUpdatingFromStoreRef.current) {
                console.log("🔄 WorkflowCanvas - Store'dan node değişikliği algılandı:", storeNodes.length, "node");
                isUpdatingFromStoreRef.current = true;
                setNodes(storeNodes);
                // Flag'i hemen false yap
                setTimeout({
                    "WorkflowCanvas.useEffect": ()=>{
                        isUpdatingFromStoreRef.current = false;
                    }
                }["WorkflowCanvas.useEffect"], 0);
            }
            if (storeEdgesStr !== currentEdgesStr && !isUpdatingFromStoreRef.current) {
                console.log("🔄 WorkflowCanvas - Store'dan edge değişikliği algılandı:", storeEdges.length, "edge");
                isUpdatingFromStoreRef.current = true;
                setEdges(storeEdges);
                // Flag'i hemen false yap
                setTimeout({
                    "WorkflowCanvas.useEffect": ()=>{
                        isUpdatingFromStoreRef.current = false;
                    }
                }["WorkflowCanvas.useEffect"], 0);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["WorkflowCanvas.useEffect"], [
        storeNodes,
        storeEdges
    ]);
    // ReactFlow'dan gelen değişiklikleri store'a yansıt (anlık)
    const handleNodesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowCanvas.useCallback[handleNodesChange]": (changes)=>{
            console.log("🔄 handleNodesChange çağrıldı, changes:", changes);
            const updatedNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNodeChanges"])(changes, nodes);
            console.log("🔄 handleNodesChange - updatedNodes:", updatedNodes);
            console.log("🔄 handleNodesChange - updatedNodes sayısı:", updatedNodes.length);
            setNodes(updatedNodes);
            // Store'a her zaman yaz - isUpdatingFromStoreRef kontrolünü kaldırdık
            console.log("🔄 handleNodesChange - Store'a yazılıyor:", updatedNodes.length, "node");
            setStoreNodes(updatedNodes);
        }
    }["WorkflowCanvas.useCallback[handleNodesChange]"], [
        nodes,
        setNodes,
        setStoreNodes
    ]);
    const handleEdgesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowCanvas.useCallback[handleEdgesChange]": (changes)=>{
            console.log("🔄 handleEdgesChange çağrıldı, changes:", changes);
            const updatedEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyEdgeChanges"])(changes, edges);
            console.log("🔄 handleEdgesChange - updatedEdges:", updatedEdges);
            console.log("🔄 handleEdgesChange - updatedEdges sayısı:", updatedEdges.length);
            setEdges(updatedEdges);
            // Store'a her zaman yaz
            console.log("🔄 handleEdgesChange - Store'a yazılıyor:", updatedEdges.length, "edge");
            setStoreEdges(updatedEdges);
        }
    }["WorkflowCanvas.useCallback[handleEdgesChange]"], [
        edges,
        setEdges,
        setStoreEdges
    ]);
    const onConnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowCanvas.useCallback[onConnect]": (params)=>{
            console.log("🔗 onConnect çağrıldı, params:", params);
            const newEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addEdge"])(params, edges);
            console.log("🔗 onConnect - newEdge:", newEdge);
            setEdges(newEdge);
            // Store'a anlık yaz
            setStoreEdges(newEdge);
            console.log("🔗 onConnect - Store'a yazıldı");
        }
    }["WorkflowCanvas.useCallback[onConnect]"], [
        edges,
        setEdges,
        setStoreEdges
    ]);
    const onNodeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowCanvas.useCallback[onNodeClick]": (_, node)=>{
            setSelectedNode(node);
        }
    }["WorkflowCanvas.useCallback[onNodeClick]"], [
        setSelectedNode
    ]);
    const onPaneClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkflowCanvas.useCallback[onPaneClick]": ()=>{
            setSelectedNode(null);
        }
    }["WorkflowCanvas.useCallback[onPaneClick]"], [
        setSelectedNode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full bg-dark-950",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__["default"], {
            nodes: nodes,
            edges: edges,
            onNodesChange: handleNodesChange,
            onEdgesChange: handleEdgesChange,
            onConnect: onConnect,
            onNodeClick: onNodeClick,
            onPaneClick: onPaneClick,
            nodeTypes: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodeTypes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nodeTypes"],
            fitView: true,
            className: "bg-dark-950",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Background"], {
                    color: "#334155",
                    gap: 16
                }, void 0, false, {
                    fileName: "[project]/components/workflow/WorkflowCanvas.tsx",
                    lineNumber: 150,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controls"], {
                    className: "bg-dark-800 border-dark-700"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/WorkflowCanvas.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniMap"], {
                    className: "bg-dark-900 border-dark-800",
                    nodeColor: (node)=>{
                        const colors = {
                            start: "#16a34a",
                            "ai-step": "#9333ea",
                            decision: "#eab308",
                            http: "#2563eb",
                            output: "#ea580c"
                        };
                        return colors[node.data?.type] || "#64748b";
                    },
                    maskColor: "rgba(15, 23, 42, 0.6)"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/WorkflowCanvas.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/workflow/WorkflowCanvas.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/workflow/WorkflowCanvas.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_s(WorkflowCanvas, "wtGEV4hviTXEd8Jho5j5uoFHEFw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNodesState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEdgesState"]
    ];
});
_c = WorkflowCanvas;
var _c;
__turbopack_context__.k.register(_c, "WorkflowCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/NodeSettingsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NodeSettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/nodes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function NodeSettingsPanel() {
    _s();
    const { selectedNode, updateNode, setSelectedNode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NodeSettingsPanel.useEffect": ()=>{
            if (selectedNode) {
                setConfig(selectedNode.data.config || {});
            }
        }
    }["NodeSettingsPanel.useEffect"], [
        selectedNode
    ]);
    if (!selectedNode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-80 bg-dark-900 border-l border-dark-800 h-full flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground text-sm",
                    children: "Bir node seçin veya yeni node ekleyin"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 25,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    const nodeType = selectedNode.data.type;
    const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$nodes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_REGISTRY"][nodeType];
    const handleUpdate = (field, value)=>{
        const newConfig = {
            ...config,
            [field]: value
        };
        setConfig(newConfig);
        updateNode(selectedNode.id, {
            ...selectedNode.data,
            config: newConfig
        });
    };
    const handleLabelUpdate = (label)=>{
        updateNode(selectedNode.id, {
            ...selectedNode.data,
            label
        });
    };
    const renderConfigField = (key, fieldSchema)=>{
        const value = config[key] ?? fieldSchema.default ?? "";
        switch(fieldSchema.type){
            case "string":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 61,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 64,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: value,
                            onChange: (e)=>handleUpdate(key, e.target.value),
                            placeholder: fieldSchema.placeholder,
                            required: fieldSchema.required
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this);
            case "textarea":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 80,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 83,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: value,
                            onChange: (e)=>handleUpdate(key, e.target.value),
                            placeholder: fieldSchema.placeholder,
                            rows: fieldSchema.rows || 4,
                            required: fieldSchema.required
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this);
            case "number":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 100,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 103,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            type: "number",
                            value: value,
                            onChange: (e)=>handleUpdate(key, fieldSchema.step === 0.1 ? parseFloat(e.target.value) : parseInt(e.target.value)),
                            placeholder: fieldSchema.placeholder,
                            min: fieldSchema.min,
                            max: fieldSchema.max,
                            step: fieldSchema.step,
                            required: fieldSchema.required
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this);
            case "boolean":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex items-center gap-2 cursor-pointer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: value,
                                    onChange: (e)=>handleUpdate(key, e.target.checked),
                                    className: "w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-600 focus:ring-primary-500"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-foreground",
                                    children: [
                                        fieldSchema.label,
                                        fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-400 ml-1",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                            lineNumber: 137,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground ml-6",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 141,
                            columnNumber: 15
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this);
            case "select":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 151,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 154,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: value,
                            onChange: (e)=>handleUpdate(key, e.target.value),
                            className: "w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
                            required: fieldSchema.required,
                            children: fieldSchema.options?.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: option.value,
                                    children: option.label
                                }, option.value, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 163,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this);
            case "object":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 176,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 179,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: typeof value === "object" ? JSON.stringify(value, null, 2) : value || "{}",
                            onChange: (e)=>{
                                try {
                                    handleUpdate(key, JSON.parse(e.target.value));
                                } catch  {
                                // Invalid JSON, ignore
                                }
                            },
                            rows: 6,
                            placeholder: "{}"
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 173,
                    columnNumber: 11
                }, this);
            case "array":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground",
                            children: [
                                fieldSchema.label,
                                fieldSchema.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400 ml-1",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 203,
                                    columnNumber: 40
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this),
                        fieldSchema.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: fieldSchema.description
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 206,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: Array.isArray(value) ? JSON.stringify(value, null, 2) : value || "[]",
                            onChange: (e)=>{
                                try {
                                    handleUpdate(key, JSON.parse(e.target.value));
                                } catch  {
                                // Invalid JSON, ignore
                                }
                            },
                            rows: 4,
                            placeholder: "[]"
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 200,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-80 bg-dark-900 border-l border-dark-800 h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-dark-800 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-foreground",
                                children: "Node Ayarları"
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children: selectedNode.data.label || metadata?.label || nodeType
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectedNode(null),
                        className: "p-1.5 hover:bg-dark-800 rounded-lg transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto scrollbar-thin p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-foreground mb-2",
                                    children: "Label"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: selectedNode.data.label || "",
                                    onChange: (e)=>handleLabelUpdate(e.target.value),
                                    placeholder: metadata?.label || "Node adı"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        metadata?.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: metadata.description
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this),
                        metadata?.configSchema && Object.entries(metadata.configSchema).map(([key, fieldSchema])=>renderConfigField(key, fieldSchema)),
                        metadata?.phase && metadata.phase > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-yellow-400",
                                children: [
                                    "⚠️ Bu node Phase ",
                                    metadata.phase,
                                    " özelliğidir ve henüz tam olarak implement edilmemiştir."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                    lineNumber: 248,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/NodeSettingsPanel.tsx",
        lineNumber: 231,
        columnNumber: 5
    }, this);
}
_s(NodeSettingsPanel, "eLR8hC6z+MZaif8MBhJtnENf+h0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = NodeSettingsPanel;
var _c;
__turbopack_context__.k.register(_c, "NodeSettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/AIChatPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIChatPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-2.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AIChatPanel() {
    _s();
    const { nodes, edges, setNodes, setEdges } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            role: "assistant",
            content: "Merhaba! Workflow'unuzu oluşturmanıza yardımcı olabilirim. Ne yapmak istiyorsunuz?"
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            scrollToBottom();
        }
    }["AIChatPanel.useEffect"], [
        messages
    ]);
    const handleGenerateFlow = async ()=>{
        if (!input.trim()) return;
        const userInput = input.trim();
        const userMessage = {
            role: "user",
            content: userInput
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setIsLoading(true);
        // Simüle edilmiş AI yanıtı - gerçek uygulamada API'ye istek atılacak
        setTimeout(()=>{
            const assistantMessage = {
                role: "assistant",
                content: `Anladım! "${userInput}" için bir workflow oluşturuyorum...`
            };
            setMessages((prev)=>[
                    ...prev,
                    assistantMessage
                ]);
            // Örnek workflow oluştur
            const generatedNodes = [
                {
                    id: "start-1",
                    type: "custom",
                    position: {
                        x: 250,
                        y: 100
                    },
                    data: {
                        type: "start",
                        label: "Start"
                    }
                },
                {
                    id: "http-1",
                    type: "custom",
                    position: {
                        x: 250,
                        y: 200
                    },
                    data: {
                        type: "http",
                        label: "Fetch Data",
                        method: "GET",
                        url: ""
                    }
                },
                {
                    id: "ai-step-1",
                    type: "custom",
                    position: {
                        x: 250,
                        y: 300
                    },
                    data: {
                        type: "ai_step",
                        label: "AI Analysis",
                        config: {
                            provider: "openai",
                            model: "gpt-4",
                            user_template: userInput,
                            temperature: 0.7,
                            max_tokens: 1000,
                            output_mode: "text"
                        }
                    }
                },
                {
                    id: "output-1",
                    type: "custom",
                    position: {
                        x: 250,
                        y: 400
                    },
                    data: {
                        type: "output",
                        label: "Output"
                    }
                }
            ];
            const generatedEdges = [
                {
                    id: "e1",
                    source: "start-1",
                    target: "http-1"
                },
                {
                    id: "e2",
                    source: "http-1",
                    target: "ai-step-1"
                },
                {
                    id: "e3",
                    source: "ai-step-1",
                    target: "output-1"
                }
            ];
            setNodes(generatedNodes);
            setEdges(generatedEdges);
            setTimeout(()=>{
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: "assistant",
                            content: "Workflow oluşturuldu! Canvas'da görüntüleyebilir ve düzenleyebilirsiniz."
                        }
                    ]);
                setIsLoading(false);
            }, 1000);
        }, 1500);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-80 bg-dark-900 border-l border-dark-800 h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-dark-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-4 h-4 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-foreground",
                                children: "AI Asistan"
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Doğal dil ile workflow oluşturun"
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4",
                children: [
                    messages.map((message, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `max-w-[85%] rounded-lg px-3 py-2 ${message.role === "user" ? "bg-primary-600 text-white" : "bg-dark-800 text-foreground"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm whitespace-pre-wrap",
                                    children: message.content
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        }, index, false, {
                            fileName: "[project]/components/workflow/AIChatPanel.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-start",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-dark-800 rounded-lg px-3 py-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 text-primary-500 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/AIChatPanel.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-dark-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            placeholder: "Örn: Her gün saat 09:00'da Twitter'dan #btc etiketli son 10 tweet'i çek, sentiment analizi yap, negatifse bana e-posta gönder.",
                            rows: 3,
                            onKeyDown: (e)=>{
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerateFlow();
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/AIChatPanel.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onClick: handleGenerateFlow,
                            disabled: !input.trim() || isLoading,
                            className: "w-full gap-2",
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, this),
                                    "Oluşturuluyor..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/AIChatPanel.tsx",
                                        lineNumber: 181,
                                        columnNumber: 17
                                    }, this),
                                    "Akışı Öner"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/AIChatPanel.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workflow/AIChatPanel.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workflow/AIChatPanel.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/AIChatPanel.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(AIChatPanel, "uNZZyzLDehXliUAVOpKfwSINaHc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = AIChatPanel;
var _c;
__turbopack_context__.k.register(_c, "AIChatPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflow/RunLogPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RunLogPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-circle-2.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x-circle.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-2.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function RunLogPanel() {
    _s();
    const { runLogs, isRunning } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    if (!isRunning && runLogs.length === 0) {
        return null;
    }
    const getStatusIcon = (status)=>{
        switch(status){
            case "success":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-4 h-4 text-green-400"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 17,
                    columnNumber: 16
                }, this);
            case "error":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "w-4 h-4 text-red-400"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 19,
                    columnNumber: 16
                }, this);
            case "running":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-4 h-4 text-primary-500 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 21,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "w-4 h-4 text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 23,
                    columnNumber: 16
                }, this);
        }
    };
    const getStatusBadge = (status)=>{
        switch(status){
            case "success":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    variant: "success",
                    children: "Başarılı"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 30,
                    columnNumber: 16
                }, this);
            case "error":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    variant: "error",
                    children: "Hata"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 32,
                    columnNumber: 16
                }, this);
            case "running":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    variant: "info",
                    children: "Çalışıyor"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 34,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: "Bekliyor"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 36,
                    columnNumber: 16
                }, this);
        }
    };
    const formatTime = (timeString)=>{
        return new Date(timeString).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };
    const getDuration = (start, end)=>{
        if (!end) return "-";
        const duration = new Date(end).getTime() - new Date(start).getTime();
        return `${duration}ms`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-0 left-0 right-0 h-64 bg-dark-900 border-t border-dark-800 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-dark-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-semibold text-foreground",
                            children: "Run Logs"
                        }, void 0, false, {
                            fileName: "[project]/components/workflow/RunLogPanel.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "info",
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-3 h-3 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this),
                                "Çalışıyor..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflow/RunLogPanel.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3",
                children: runLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-muted-foreground text-sm py-8",
                    children: "Henüz log yok"
                }, void 0, false, {
                    fileName: "[project]/components/workflow/RunLogPanel.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this) : runLogs.map((log, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-dark-800 rounded-lg p-3 border border-dark-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            getStatusIcon(log.status),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-foreground",
                                                children: log.nodeName
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                                lineNumber: 82,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this),
                                    getStatusBadge(log.status)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Başlangıç:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            formatTime(log.startTime)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 90,
                                        columnNumber: 17
                                    }, this),
                                    log.endTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Bitiş:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                                lineNumber: 96,
                                                columnNumber: 21
                                            }, this),
                                            " ",
                                            formatTime(log.endTime)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Süre:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                                lineNumber: 101,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            getDuration(log.startTime, log.endTime)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 100,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this),
                            log.payload && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                className: "mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                        className: "text-xs text-muted-foreground cursor-pointer hover:text-foreground",
                                        children: "Payload'ı göster"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 108,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "mt-2 p-2 bg-dark-950 rounded text-xs text-foreground overflow-x-auto",
                                        children: JSON.stringify(log.payload, null, 2)
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 111,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                lineNumber: 107,
                                columnNumber: 17
                            }, this),
                            log.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 p-2 bg-red-600/10 border border-red-600/30 rounded text-xs text-red-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "Hata:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                        lineNumber: 119,
                                        columnNumber: 19
                                    }, this),
                                    " ",
                                    log.error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                                lineNumber: 118,
                                columnNumber: 17
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/components/workflow/RunLogPanel.tsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/workflow/RunLogPanel.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflow/RunLogPanel.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(RunLogPanel, "FzxLDmTdDd53bgsUXNLuSn7mbnw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = RunLogPanel;
var _c;
__turbopack_context__.k.register(_c, "RunLogPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workflow/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkflowPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/workflowStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$WorkflowMetaPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/WorkflowMetaPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodePalette$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/NodePalette.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$WorkflowCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/WorkflowCanvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodeSettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/NodeSettingsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$AIChatPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/AIChatPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$RunLogPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow/RunLogPanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
;
function WorkflowPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { fetchWorkflow, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"])();
    // Auth kontrolü
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowPage.useEffect": ()=>{
            if (!user) {
                router.push("/login");
            }
        }
    }["WorkflowPage.useEffect"], [
        user,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkflowPage.useEffect": ()=>{
            if (user && params.id && typeof params.id === "string") {
                fetchWorkflow(params.id);
            }
        }
    }["WorkflowPage.useEffect"], [
        params.id,
        fetchWorkflow,
        user
    ]);
    // Auth kontrolü geçene kadar loading göster
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-dark-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
            }, void 0, false, {
                fileName: "[project]/app/workflow/[id]/page.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workflow/[id]/page.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-dark-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
            }, void 0, false, {
                fileName: "[project]/app/workflow/[id]/page.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workflow/[id]/page.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-dark-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-400 mb-4",
                        children: [
                            "Hata: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workflow/[id]/page.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.href = "/",
                        className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700",
                        children: "Ana Sayfaya Dön"
                    }, void 0, false, {
                        fileName: "[project]/app/workflow/[id]/page.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workflow/[id]/page.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workflow/[id]/page.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex flex-col bg-dark-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$WorkflowMetaPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/workflow/[id]/page.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex overflow-hidden relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactFlowProvider"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodePalette$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/workflow/[id]/page.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$WorkflowCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/workflow/[id]/page.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$RunLogPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/workflow/[id]/page.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workflow/[id]/page.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workflow/[id]/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$NodeSettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/workflow/[id]/page.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2f$AIChatPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/workflow/[id]/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workflow/[id]/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workflow/[id]/page.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workflow/[id]/page.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(WorkflowPage, "vQbswRRa30t2glMQG+aFiFcQUCM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$workflowStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowStore"]
    ];
});
_c = WorkflowPage;
var _c;
__turbopack_context__.k.register(_c, "WorkflowPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_efaf86b3._.js.map