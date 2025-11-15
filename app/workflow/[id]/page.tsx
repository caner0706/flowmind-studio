"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkflowStore } from "@/store/workflowStore";
import { ReactFlowProvider } from "reactflow";
import WorkflowMetaPanel from "@/components/workflow/WorkflowMetaPanel";
import NodePalette from "@/components/workflow/NodePalette";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas";
import NodeSettingsPanel from "@/components/workflow/NodeSettingsPanel";
import AIChatPanel from "@/components/workflow/AIChatPanel";
import RunLogPanel from "@/components/workflow/RunLogPanel";

export default function WorkflowPage() {
  const params = useParams();
  const { fetchWorkflow, isLoading, error } = useWorkflowStore();

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      fetchWorkflow(params.id);
    }
  }, [params.id, fetchWorkflow]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">Hata: {error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-950">
      <WorkflowMetaPanel />
      
      <div className="flex-1 flex overflow-hidden relative">
        <ReactFlowProvider>
          <NodePalette />
          
          <div className="flex-1 relative">
            <WorkflowCanvas />
            <RunLogPanel />
          </div>
        </ReactFlowProvider>
        
        <div className="flex">
          <NodeSettingsPanel />
          <AIChatPanel />
        </div>
      </div>
    </div>
  );
}

