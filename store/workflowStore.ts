import { create } from "zustand";
import { Workflow, NodeData, EdgeData } from "@/types/workflow";
import { Node, Edge } from "reactflow";
import { workflowApi } from "@/lib/api";

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;
  runLogs: Array<{
    nodeId: string;
    nodeName: string;
    status: "success" | "error" | "running";
    startTime: string;
    endTime?: string;
    payload?: any;
    error?: string;
  }>;
  
  // Actions
  fetchWorkflows: () => Promise<void>;
  fetchWorkflow: (id: string) => Promise<void>;
  createWorkflow: (workflow: Partial<Workflow>) => Promise<Workflow | null>;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => Promise<boolean>;
  deleteWorkflow: (id: string) => Promise<boolean>;
  setWorkflows: (workflows: Workflow[]) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: Partial<NodeData["data"]>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | null) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  addRunLog: (log: WorkflowStore["runLogs"][0]) => void;
  clearRunLogs: () => void;
  saveWorkflow: (updates?: { name?: string; description?: string; isActive?: boolean }) => Promise<boolean>;
  setError: (error: string | null) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
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
  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    const response = await workflowApi.getAll();
    if (response.error) {
      set({ error: response.error.message, isLoading: false });
      return;
    }
    if (response.data) {
      set({ workflows: response.data, isLoading: false });
    }
  },

  fetchWorkflow: async (id: string) => {
    set({ isLoading: true, error: null, selectedNode: null });
    const response = await workflowApi.getById(id);
    if (response.error) {
      set({ error: response.error.message, isLoading: false });
      return;
    }
    if (response.data) {
      const workflow = response.data;
      // graphJson yoksa veya boşsa varsayılan değerler kullan
      const graphJson = workflow.graphJson || { nodes: [], edges: [] };
      
      // Node'ları ve edge'leri normalize et
      const normalizedNodes = (graphJson.nodes || []).map((node: any) => ({
        id: node.id,
        type: node.type || "custom",
        position: node.position || { x: 0, y: 0 },
        data: {
          ...(node.data || {}),
          type: node.data?.type || node.type || "custom",
          label: node.data?.label || node.label || node.id,
          config: node.data?.config || {},
        },
      })) as Node[];

      const normalizedEdges = (graphJson.edges || []).map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
      })) as Edge[];
      
      set({
        currentWorkflow: workflow,
        nodes: normalizedNodes,
        edges: normalizedEdges,
        isLoading: false,
      });
    }
  },

  createWorkflow: async (workflow: Partial<Workflow>) => {
    set({ isLoading: true, error: null });
    // graphJson yoksa varsayılan değer ekle
    const workflowData = {
      ...workflow,
      graphJson: workflow.graphJson || { nodes: [], edges: [] },
    };
    const response = await workflowApi.create(workflowData);
    if (response.error) {
      set({ error: response.error.message, isLoading: false });
      return null;
    }
    if (response.data) {
      const newWorkflow = response.data;
      // graphJson'ı normalize et
      const normalizedWorkflow = {
        ...newWorkflow,
        graphJson: newWorkflow.graphJson || { nodes: [], edges: [] },
      };
      set((state) => ({
        workflows: [...state.workflows, normalizedWorkflow],
        isLoading: false,
      }));
      return normalizedWorkflow;
    }
    return null;
  },

  updateWorkflow: async (id: string, workflow: Partial<Workflow>) => {
    set({ isLoading: true, error: null });
    const response = await workflowApi.update(id, workflow);
    if (response.error) {
      set({ error: response.error.message, isLoading: false });
      return false;
    }
    if (response.data) {
      const updatedWorkflow = response.data;
      // graphJson'ı normalize et
      const normalizedWorkflow = {
        ...updatedWorkflow,
        graphJson: updatedWorkflow.graphJson || { nodes: [], edges: [] },
      };
      set((state) => ({
        workflows: state.workflows.map((w) =>
          w.id === id ? normalizedWorkflow : w
        ),
        currentWorkflow:
          state.currentWorkflow?.id === id
            ? normalizedWorkflow
            : state.currentWorkflow,
        isLoading: false,
      }));
      return true;
    }
    return false;
  },

  deleteWorkflow: async (id: string) => {
    if (!id || !String(id).trim()) {
      set({ error: "Geçersiz workflow ID", isLoading: false });
      return false;
    }
    
    set({ isLoading: true, error: null });
    const response = await workflowApi.delete(id);
    if (response.error) {
      set({ error: response.error.message || "Workflow silinirken bir hata oluştu", isLoading: false });
      return false;
    }
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflow:
        state.currentWorkflow?.id === id ? null : state.currentWorkflow,
      isLoading: false,
    }));
    return true;
  },

  setWorkflows: (workflows) => set({ workflows }),
  
  setCurrentWorkflow: (workflow) => {
    if (workflow) {
      // graphJson yoksa veya boşsa mevcut nodes/edges'i koru
      const graphJson = workflow.graphJson || { nodes: [], edges: [] };
      const currentState = get();
      
      // Eğer graphJson'da node'lar varsa kullan, yoksa mevcut node'ları koru
      const newNodes = (graphJson.nodes && graphJson.nodes.length > 0) 
        ? (graphJson.nodes || []) as Node[]
        : currentState.nodes; // Mevcut node'ları koru
      
      const newEdges = (graphJson.edges && graphJson.edges.length > 0)
        ? (graphJson.edges || []) as Edge[]
        : currentState.edges; // Mevcut edge'leri koru
      
      console.log("🔄 setCurrentWorkflow - workflow:", workflow);
      console.log("🔄 setCurrentWorkflow - graphJson.nodes:", graphJson.nodes?.length || 0);
      console.log("🔄 setCurrentWorkflow - Mevcut nodes:", currentState.nodes.length);
      console.log("🔄 setCurrentWorkflow - Yeni nodes:", newNodes.length);
      
      set({
        currentWorkflow: workflow,
        nodes: newNodes,
        edges: newEdges,
      });
    } else {
      set({
        currentWorkflow: null,
        nodes: [],
        edges: [],
        selectedNode: null,
      });
    }
  },

  setNodes: (nodes) => {
    console.log("🔄 setNodes çağrıldı, yeni nodes:", nodes);
    set({ nodes });
  },
  
  setEdges: (edges) => {
    console.log("🔄 setEdges çağrıldı, yeni edges:", edges);
    set({ edges });
  },
  
  addNode: (node) => {
    console.log("➕ addNode çağrıldı, eklenen node:", node);
    set((state) => {
      const newNodes = [...state.nodes, node];
      console.log("📊 Yeni nodes array:", newNodes);
      return { nodes: newNodes };
    });
  },
  
  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),
  
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
    })),
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  
  deleteEdge: (edgeId) =>
    set((state) => ({ edges: state.edges.filter((edge) => edge.id !== edgeId) })),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  
  addRunLog: (log) =>
    set((state) => ({ runLogs: [...state.runLogs, log] })),
  
  clearRunLogs: () => set({ runLogs: [] }),
  
  saveWorkflow: async (updates) => {
    // get() ile en güncel state'i al - her zaman fresh state al
    const state = get();
    const { currentWorkflow, nodes, edges } = state;
    
    if (!currentWorkflow) {
      set({ error: "Kaydedilecek workflow bulunamadı" });
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
    const cleanNodes = nodes.map((node) => {
      // Gerçek node type'ı data.type'dan al, yoksa node.type'dan al
      const realNodeType = node.data?.type || node.type || "custom";
      
      return {
        id: node.id,
        type: realNodeType, // Backend için gerçek node type
        position: node.position,
        data: {
          ...node.data,
          type: realNodeType, // data.type'ı da set et
          // Eğer config yoksa boş obje ekle
          config: node.data?.config || {},
        },
      };
    });

    const cleanEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
    }));
    
    console.log("🧹 Temizlenmiş nodes:", cleanNodes);
    console.log("🧹 Temizlenmiş edges:", cleanEdges);
    console.log("🧹 Temizlenmiş nodes sayısı:", cleanNodes.length);
    console.log("🧹 Temizlenmiş edges sayısı:", cleanEdges.length);
    
    // Updates parametresi varsa onları kullan, yoksa currentWorkflow'dan al
    const updatedWorkflow: Partial<Workflow> = {
      name: updates?.name !== undefined ? updates.name : currentWorkflow.name,
      description: updates?.description !== undefined ? updates.description : currentWorkflow.description,
      isActive: updates?.isActive !== undefined ? updates.isActive : currentWorkflow.isActive,
      graphJson: {
        nodes: cleanNodes as NodeData[],
        edges: cleanEdges as EdgeData[],
      },
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
              nodes: cleanNodes as NodeData[],
              edges: cleanEdges as EdgeData[],
            },
          },
        });
      }
    }
    
    return success;
  },

  setError: (error) => set({ error }),
}));

