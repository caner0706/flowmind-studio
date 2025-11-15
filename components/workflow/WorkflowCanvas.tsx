"use client";

import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/store/workflowStore";
import { nodeTypes } from "./NodeTypes";

export default function WorkflowCanvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    setSelectedNode,
  } = useWorkflowStore();

  // Store'dan başlangıç değerlerini al
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  
  const isInitializedRef = useRef(false);
  const isUpdatingFromStoreRef = useRef(false);

  // Store'dan gelen değişiklikleri ReactFlow state'ine yansıt
  useEffect(() => {
    // İlk yükleme
    if (!isInitializedRef.current) {
      console.log("🎬 WorkflowCanvas - İlk yükleme, nodes:", storeNodes.length, "edges:", storeEdges.length);
      isInitializedRef.current = true;
      isUpdatingFromStoreRef.current = true;
      setNodes(storeNodes);
      setEdges(storeEdges);
      // Flag'i hemen false yap ki sonraki değişiklikler store'a yazılabilsin
      setTimeout(() => {
        isUpdatingFromStoreRef.current = false;
      }, 0);
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
      setTimeout(() => {
        isUpdatingFromStoreRef.current = false;
      }, 0);
    }
    if (storeEdgesStr !== currentEdgesStr && !isUpdatingFromStoreRef.current) {
      console.log("🔄 WorkflowCanvas - Store'dan edge değişikliği algılandı:", storeEdges.length, "edge");
      isUpdatingFromStoreRef.current = true;
      setEdges(storeEdges);
      // Flag'i hemen false yap
      setTimeout(() => {
        isUpdatingFromStoreRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeNodes, storeEdges]);

  // ReactFlow'dan gelen değişiklikleri store'a yansıt (anlık)
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log("🔄 handleNodesChange çağrıldı, changes:", changes);
      const updatedNodes = applyNodeChanges(changes, nodes);
      console.log("🔄 handleNodesChange - updatedNodes:", updatedNodes);
      console.log("🔄 handleNodesChange - updatedNodes sayısı:", updatedNodes.length);
      setNodes(updatedNodes);
      // Store'a her zaman yaz - isUpdatingFromStoreRef kontrolünü kaldırdık
      console.log("🔄 handleNodesChange - Store'a yazılıyor:", updatedNodes.length, "node");
      setStoreNodes(updatedNodes);
    },
    [nodes, setNodes, setStoreNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log("🔄 handleEdgesChange çağrıldı, changes:", changes);
      const updatedEdges = applyEdgeChanges(changes, edges);
      console.log("🔄 handleEdgesChange - updatedEdges:", updatedEdges);
      console.log("🔄 handleEdgesChange - updatedEdges sayısı:", updatedEdges.length);
      setEdges(updatedEdges);
      // Store'a her zaman yaz
      console.log("🔄 handleEdgesChange - Store'a yazılıyor:", updatedEdges.length, "edge");
      setStoreEdges(updatedEdges);
    },
    [edges, setEdges, setStoreEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("🔗 onConnect çağrıldı, params:", params);
      const newEdge = addEdge(params, edges);
      console.log("🔗 onConnect - newEdge:", newEdge);
      setEdges(newEdge);
      // Store'a anlık yaz
      setStoreEdges(newEdge);
      console.log("🔗 onConnect - Store'a yazıldı");
    },
    [edges, setEdges, setStoreEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="w-full h-full bg-dark-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-dark-950"
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-dark-800 border-dark-700" />
        <MiniMap
          className="bg-dark-900 border-dark-800"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: "#16a34a",
              "ai-step": "#9333ea",
              decision: "#eab308",
              http: "#2563eb",
              output: "#ea580c",
            };
            return colors[node.data?.type] || "#64748b";
          }}
          maskColor="rgba(15, 23, 42, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}

