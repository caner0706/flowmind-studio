"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkflowStore } from "@/store/workflowStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { Save, Trash2, Play, ArrowLeft, Power } from "lucide-react";

export default function WorkflowMetaPanel() {
  const router = useRouter();
  const {
    currentWorkflow,
    setCurrentWorkflow,
    saveWorkflow,
    updateWorkflow,
    deleteWorkflow,
    setIsRunning,
    clearRunLogs,
    isLoading,
  } = useWorkflowStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentWorkflow) {
      setName(currentWorkflow.name);
      setDescription(currentWorkflow.description || "");
      setIsActive(currentWorkflow.isActive);
    }
  }, [currentWorkflow]);

  const handleSave = async () => {
    if (!currentWorkflow) return;

    // Local state'teki name, description, isActive değerlerini saveWorkflow'a gönder
    const { nodes, edges } = useWorkflowStore.getState();
    console.log("💾 handleSave - Mevcut nodes:", nodes.length, "edges:", edges.length);
    console.log("💾 handleSave - Name:", name, "Description:", description, "IsActive:", isActive);
    
    // Sonra API'ye kaydet (nodes, edges, name, description, isActive dahil)
    const success = await saveWorkflow({
      name,
      description,
      isActive,
    });
    
    if (success) {
      alert("Workflow kaydedildi!");
    } else {
      const { error } = useWorkflowStore.getState();
      alert(`Workflow kaydedilirken bir hata oluştu: ${error || "Bilinmeyen hata"}`);
    }
  };

  const handleDelete = async () => {
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

  const handleToggleActive = async () => {
    if (!currentWorkflow) return;
    
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    const success = await updateWorkflow(currentWorkflow.id, {
      isActive: newActiveState,
    });
    
    if (!success) {
      setIsActive(!newActiveState); // Rollback
      alert("Durum güncellenirken bir hata oluştu!");
    }
  };

  const handleRun = async () => {
    if (!currentWorkflow) return;

    setIsRunning(true);
    clearRunLogs();

    const { nodes, addRunLog } = useWorkflowStore.getState();

    // Simüle edilmiş run - gerçek uygulamada API'ye istek atılacak
    for (const node of nodes) {
      const startTime = new Date().toISOString();
      
      addRunLog({
        nodeId: node.id,
        nodeName: node.data.label || node.data.type,
        status: "running",
        startTime,
      });

      // Simüle edilmiş işlem süresi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const endTime = new Date().toISOString();
      const success = Math.random() > 0.2; // %80 başarı oranı

      addRunLog({
        nodeId: node.id,
        nodeName: node.data.label || node.data.type,
        status: success ? "success" : "error",
        startTime,
        endTime,
        payload: { input: "test data", output: "processed data" },
        error: success ? undefined : "Simüle edilmiş hata",
      });
    }

    setIsRunning(false);
  };

  if (!currentWorkflow) {
    return null;
  }

  return (
    <div className="h-48 bg-dark-900 border-b border-dark-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workflow adı"
              className="text-lg font-semibold border-0 bg-transparent focus:ring-0 p-0 h-auto"
            />
          </div>
          <Badge variant={isActive ? "success" : "default"}>
            {isActive ? "Aktif" : "Pasif"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleActive}
            disabled={isLoading}
            className="gap-2"
          >
            <Power className="w-4 h-4" />
            {isActive ? "Pasifleştir" : "Aktifleştir"}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Sil
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isLoading}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Çalıştır
          </Button>
        </div>
      </div>

      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Workflow açıklaması..."
          rows={2}
          className="bg-dark-800"
        />
      </div>
    </div>
  );
}

