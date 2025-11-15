// NodeType artık nodes.ts'den import ediliyor
import type { NodeType } from "./nodes";
export type { NodeType };

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  graphJson: {
    nodes: NodeData[];
    edges: EdgeData[];
  };
}

export interface NodeConfig {
  [key: string]: any;
}

export interface AIStepConfig extends NodeConfig {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
}

export interface HTTPConfig extends NodeConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface DecisionConfig extends NodeConfig {
  condition: string;
  truePath: string;
  falsePath: string;
}

