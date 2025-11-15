import { Workflow } from "@/types/workflow";

const API_BASE = "https://flowmind-ai-flowmind-core-api.hf.space/api";

export interface ApiError {
  message: string;
  status?: number;
}

// API Response wrapper
interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log(`API Request: ${options?.method || "GET"} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        // JSON ise parse et
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || errorJson.detail || errorText;
        } catch {
          // JSON değilse olduğu gibi kullan
        }
      } catch {
        errorText = `HTTP error! status: ${response.status}`;
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

