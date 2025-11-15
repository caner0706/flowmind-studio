import { Handle, Position, NodeProps } from "reactflow";
import { NodeType } from "@/types/workflow";
import { NODE_REGISTRY } from "@/types/nodes";
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

export function CustomNode({ data, selected }: NodeProps) {
  const nodeType = data.type as NodeType;
  const metadata = NODE_REGISTRY[nodeType];

  if (!metadata) {
    // Fallback for unknown node types
    const Icon = Settings;
    const label = data.label || nodeType;
    return (
      <div
        className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[150px] bg-dark-900 ${
          selected
            ? "border-primary-500 shadow-primary-500/20"
            : "border-dark-700"
        } transition-all duration-200`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-primary-500 !border-2 !border-dark-800"
        />
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gray-600 p-1.5 rounded">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm font-semibold text-foreground">{label}</div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-primary-500 !border-2 !border-dark-800"
        />
      </div>
    );
  }

  const Icon = iconMap[metadata.icon] || Settings;
  const label = data.label || metadata.label;
  const description = data.description || metadata.description;

  // Output port sayısını belirle
  const outputCount = Array.isArray(metadata.outputs)
    ? metadata.outputs.length
    : typeof metadata.outputs === "number"
    ? metadata.outputs
    : 1;

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[150px] bg-dark-900 ${
        selected
          ? "border-primary-500 shadow-primary-500/20"
          : "border-dark-700"
      } transition-all duration-200`}
    >
      {/* Input handles */}
      {((typeof metadata.inputs === "number" && metadata.inputs > 0) ||
        (Array.isArray(metadata.inputs) && metadata.inputs.length > 0)) && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-primary-500 !border-2 !border-dark-800"
        />
      )}

      <div className="flex items-center gap-2 mb-1">
        <div className={`${metadata.color} p-1.5 rounded`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">{label}</div>
        </div>
      </div>

      {description && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </div>
      )}

      {/* Output handles */}
      {outputCount > 0 && (
        <>
          {outputCount === 1 ? (
            <Handle
              type="source"
              position={Position.Bottom}
              className="!bg-primary-500 !border-2 !border-dark-800"
            />
          ) : (
            // Multiple outputs - named handles
            Array.isArray(metadata.outputs) &&
            metadata.outputs.map((outputName, index) => {
              const outputsArray = metadata.outputs as string[];
              return (
                <Handle
                  key={outputName}
                  type="source"
                  position={Position.Bottom}
                  id={outputName}
                  style={{
                    left: `${((index + 1) * 100) / (outputsArray.length + 1)}%`,
                  }}
                  className="!bg-primary-500 !border-2 !border-dark-800"
                />
              );
            })
          )}
        </>
      )}
    </div>
  );
}

export const nodeTypes = {
  custom: CustomNode,
};
