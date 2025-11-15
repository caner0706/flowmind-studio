"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkflowStore } from "@/store/workflowStore";
import { Workflow } from "@/types/workflow";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Plus, Play, Edit, Trash2, Sparkles, Clock } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    workflows,
    isLoading,
    error,
    fetchWorkflows,
    createWorkflow,
    deleteWorkflow,
  } = useWorkflowStore();

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleCreateNew = async () => {
    const newWorkflow = await createWorkflow({
      name: "Yeni Workflow",
      description: "",
      isActive: false,
      graphJson: { nodes: [], edges: [] },
    });

    if (newWorkflow) {
      router.push(`/workflow/${newWorkflow.id}`);
    } else {
      alert("Workflow oluşturulurken bir hata oluştu!");
    }
  };

  const handleEdit = (workflow: Workflow) => {
    router.push(`/workflow/${workflow.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu workflow'u silmek istediğinize emin misiniz?")) {
      const success = await deleteWorkflow(id);
      if (!success) {
        alert("Workflow silinirken bir hata oluştu!");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FlowMind Studio</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Workflow Automation</p>
              </div>
            </div>
            <Button onClick={handleCreateNew} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Yeni Workflow
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Hoş Geldiniz</h2>
          <p className="text-muted-foreground">
            Workflow'larınızı yönetin, yeni otomasyonlar oluşturun ve AI asistanı ile akışlarınızı tasarlayın.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
            <p className="text-red-400 text-sm">Hata: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : workflows.length === 0 ? (
          <Card className="text-center py-16">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Henüz workflow'unuz yok
            </h3>
            <p className="text-muted-foreground mb-6">
              İlk workflow'unuzu oluşturarak başlayın
            </p>
            <Button onClick={handleCreateNew} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Yeni Workflow Oluştur
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow: Workflow) => (
              <Card
                key={workflow.id}
                className="hover:border-primary-500/50 transition-all duration-200 cursor-pointer group"
                onClick={() => handleEdit(workflow)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary-400 transition-colors">
                      {workflow.name}
                    </h3>
                    {workflow.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workflow.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={workflow.isActive ? "success" : "default"}>
                    {workflow.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  <span>Güncellendi: {formatDate(workflow.updatedAt)}</span>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-dark-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleEdit(workflow);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDelete(workflow.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

