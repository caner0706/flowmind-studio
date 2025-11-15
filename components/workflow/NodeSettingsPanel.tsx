"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { NodeType } from "@/types/workflow";
import { NODE_REGISTRY } from "@/types/nodes";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { X } from "lucide-react";

export default function NodeSettingsPanel() {
  const { selectedNode, updateNode, setSelectedNode } = useWorkflowStore();
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-dark-900 border-l border-dark-800 h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground text-sm">
            Bir node seçin veya yeni node ekleyin
          </p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.data.type as NodeType;
  const metadata = NODE_REGISTRY[nodeType];

  const handleUpdate = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    updateNode(selectedNode.id, {
      ...selectedNode.data,
      config: newConfig,
    });
  };

  const handleLabelUpdate = (label: string) => {
    updateNode(selectedNode.id, {
      ...selectedNode.data,
      label,
    });
  };

  const renderConfigField = (key: string, fieldSchema: any) => {
    const value = config[key] ?? fieldSchema.default ?? "";

    switch (fieldSchema.type) {
      case "string":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <Input
              value={value}
              onChange={(e) => handleUpdate(key, e.target.value)}
              placeholder={fieldSchema.placeholder}
              required={fieldSchema.required}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <Textarea
              value={value}
              onChange={(e) => handleUpdate(key, e.target.value)}
              placeholder={fieldSchema.placeholder}
              rows={fieldSchema.rows || 4}
              required={fieldSchema.required}
            />
          </div>
        );

      case "number":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleUpdate(
                  key,
                  fieldSchema.step === 0.1
                    ? parseFloat(e.target.value)
                    : parseInt(e.target.value)
                )
              }
              placeholder={fieldSchema.placeholder}
              min={fieldSchema.min}
              max={fieldSchema.max}
              step={fieldSchema.step}
              required={fieldSchema.required}
            />
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleUpdate(key, e.target.checked)}
                className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-foreground">
                {fieldSchema.label}
                {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
              </span>
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground ml-6">{fieldSchema.description}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <select
              value={value}
              onChange={(e) => handleUpdate(key, e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              required={fieldSchema.required}
            >
              {fieldSchema.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "object":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <Textarea
              value={
                typeof value === "object" ? JSON.stringify(value, null, 2) : value || "{}"
              }
              onChange={(e) => {
                try {
                  handleUpdate(key, JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={6}
              placeholder="{}"
            />
          </div>
        );

      case "array":
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {fieldSchema.label}
              {fieldSchema.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {fieldSchema.description && (
              <p className="text-xs text-muted-foreground">{fieldSchema.description}</p>
            )}
            <Textarea
              value={
                Array.isArray(value) ? JSON.stringify(value, null, 2) : value || "[]"
              }
              onChange={(e) => {
                try {
                  handleUpdate(key, JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={4}
              placeholder="[]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-dark-900 border-l border-dark-800 h-full flex flex-col">
      <div className="p-4 border-b border-dark-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Node Ayarları</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedNode.data.label || metadata?.label || nodeType}
          </p>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="p-1.5 hover:bg-dark-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Label
            </label>
            <Input
              value={selectedNode.data.label || ""}
              onChange={(e) => handleLabelUpdate(e.target.value)}
              placeholder={metadata?.label || "Node adı"}
            />
          </div>

          {/* Description */}
          {metadata?.description && (
            <div>
              <p className="text-xs text-muted-foreground">{metadata.description}</p>
            </div>
          )}

          {/* Config Fields */}
          {metadata?.configSchema &&
            Object.entries(metadata.configSchema).map(([key, fieldSchema]) =>
              renderConfigField(key, fieldSchema)
            )}

          {/* Phase 2+ warning */}
          {metadata?.phase && metadata.phase > 1 && (
            <div className="p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⚠️ Bu node Phase {metadata.phase} özelliğidir ve henüz tam olarak
                implement edilmemiştir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
