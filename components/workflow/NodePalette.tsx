"use client";

import { useState } from "react";
import { useReactFlow } from "reactflow";
import { NODE_REGISTRY, NODE_CATEGORIES, NodeCategory } from "@/types/nodes";
import { NodeType } from "@/types/workflow";
import { useWorkflowStore } from "@/store/workflowStore";
import {
  Play,
  Brain,
  GitBranch,
  Globe,
  FileOutput,
  Settings,
  Filter,
  Clock,
  Webhook,
  Database,
  Bell,
  Zap,
  Repeat,
  GitMerge,
  ArrowRightLeft,
  FileText,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  File,
  Code,
  Variable,
  FileSpreadsheet,
  HardDrive,
  Calendar,
  BarChart,
  Cloud,
  MessageSquare,
  MessageCircle,
  Send,
  Phone,
  Table,
  CheckSquare,
  Bug,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  TrendingUp,
  Lock,
  Unlock,
  FileCode,
  Download,
  Grid,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
  Play,
  Brain,
  GitBranch,
  Globe,
  FileOutput,
  Settings,
  Filter,
  Clock,
  Webhook,
  Database,
  Bell,
  Zap,
  Repeat,
  GitMerge,
  ArrowRightLeft,
  FileText,
  PlayCircle,
  Mail,
  File,
  Code,
  Variable,
  FileSpreadsheet,
  HardDrive,
  Calendar,
  BarChart,
  Cloud,
  MessageSquare,
  MessageCircle,
  Send,
  Phone,
  Table,
  CheckSquare,
  Bug,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  TrendingUp,
  Lock,
  Unlock,
  FileCode,
  Download,
  Grid,
};

interface NodeOption {
  type: NodeType;
  label: string;
  icon: any;
  description: string;
  color: string;
  phase?: 1 | 2 | 3;
}

export default function NodePalette() {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode: addNodeToStore } = useWorkflowStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(
    new Set(["triggers", "flow-logic", "ai-nodes", "integrations", "data-utils", "outputs"])
  );

  const toggleCategory = (category: NodeCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddNode = (nodeType: NodeType) => {
    const metadata = NODE_REGISTRY[nodeType];
    if (!metadata) return;

    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const Icon = iconMap[metadata.icon] || Settings;

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: "custom", // ReactFlow için her zaman "custom"
      position,
      data: {
        type: nodeType, // Gerçek node type'ı (start, ai_step, http, vs.)
        label: metadata.label,
        description: metadata.description,
        config: {},
      },
    };

    // Direkt store'a ekle - WorkflowCanvas otomatik olarak ReactFlow'a yazacak
    console.log("➕ NodePalette - Node ekleniyor:", newNode);
    addNodeToStore(newNode);
    console.log("➕ NodePalette - Node store'a eklendi");
  };

  // Kategorilere göre node'ları grupla
  const nodesByCategory = Object.entries(NODE_REGISTRY).reduce(
    (acc, [nodeType, metadata]) => {
      if (!acc[metadata.category]) {
        acc[metadata.category] = [];
      }
      acc[metadata.category].push({ ...metadata, type: nodeType as NodeType });
      return acc;
    },
    {} as Record<NodeCategory, Array<{ type: NodeType } & typeof NODE_REGISTRY[NodeType]>>
  );

  // Kategori sırası
  const categoryOrder: NodeCategory[] = [
    "triggers",
    "flow-logic",
    "ai-nodes",
    "integrations",
    "data-utils",
    "outputs",
  ];

  return (
    <div className="w-72 bg-dark-900 border-r border-dark-800 h-full flex flex-col">
      <div className="p-4 border-b border-dark-800">
        <h3 className="text-sm font-semibold text-foreground mb-1">Node'lar</h3>
        <p className="text-xs text-muted-foreground">
          Kategorilere göre düzenlenmiş node'lar
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {categoryOrder.map((category) => {
          const categoryInfo = NODE_CATEGORIES[category];
          const nodes = nodesByCategory[category] || [];
          const isExpanded = expandedCategories.has(category);
          const CategoryIcon = iconMap[categoryInfo.icon] || Settings;

          // Sadece Phase 1 node'ları göster (isteğe bağlı filtreleme)
          const visibleNodes = nodes; // Tüm node'ları göster, phase 2+ olanları disabled yapabiliriz

          if (visibleNodes.length === 0) return null;

          return (
            <div key={category} className="border-b border-dark-800">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <CategoryIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-foreground">
                    {categoryInfo.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {visibleNodes.length}
                </span>
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-1">
                  {visibleNodes.map((node) => {
                    const Icon = iconMap[node.icon] || Settings;
                    const isPhase2Plus = node.phase && node.phase > 1;

                    return (
                      <button
                        key={node.type}
                        onClick={() => !isPhase2Plus && handleAddNode(node.type)}
                        disabled={isPhase2Plus}
                        className={`w-full p-2.5 rounded-lg border transition-all duration-200 text-left group ${
                          isPhase2Plus
                            ? "border-dark-700 bg-dark-800/50 opacity-50 cursor-not-allowed"
                            : "border-dark-700 bg-dark-800 hover:border-primary-500/50 hover:bg-dark-700"
                        }`}
                        title={
                          isPhase2Plus
                            ? `${node.label} - Phase ${node.phase} (Yakında)`
                            : node.description
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`${node.color} p-1.5 rounded flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-xs font-medium ${
                                isPhase2Plus
                                  ? "text-muted-foreground"
                                  : "text-foreground group-hover:text-primary-400 transition-colors"
                              }`}
                            >
                              {node.label}
                              {isPhase2Plus && (
                                <span className="ml-1 text-[10px] text-muted-foreground">
                                  (Phase {node.phase})
                                </span>
                              )}
                            </div>
                            {!isPhase2Plus && (
                              <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                {node.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
