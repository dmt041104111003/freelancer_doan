"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  MarkerType,
  Panel,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import StepFlowNode from "./StepFlowNode";
import DecisionFlowNode from "./DecisionFlowNode";
import MobileFlowView from "@/components/how-it-works/MobileFlowView";
import FlowAnimatedEdge from "./FlowAnimatedEdge";
import { commonStep, freelancerSteps, employerSteps } from "./flowData";

const STEP_NODE = "stepNode";
const DECISION_NODE = "decisionNode";
const FLOW_EDGE = "flowAnimated";

const nodeTypes: NodeTypes = {
  [STEP_NODE]: StepFlowNode,
  [DECISION_NODE]: DecisionFlowNode,
};

const edgeTypes: EdgeTypes = {
  [FLOW_EDGE]: FlowAnimatedEdge,
};

const NODE_WIDTH = 260;
const COLUMN_GAP = 100;
const LEVEL_H = 120; // BFS: khoảng cách tầng (lớn = mũi tên dài hơn)

const LEFT_X = 0;
const RIGHT_X = NODE_WIDTH + COLUMN_GAP;
const CENTER_X = (RIGHT_X + NODE_WIDTH) / 2 - NODE_WIDTH / 2; // center cho start
const DECISION_W = 140;
const DECISION_CENTER_X = (RIGHT_X + NODE_WIDTH) / 2 - DECISION_W / 2;

const edgeStyle = {
  type: FLOW_EDGE,
  markerEnd: { type: MarkerType.ArrowClosed as const, color: "#475569" },
  style: { stroke: "#475569", strokeWidth: 1.5 },
};

function buildMergedFlow(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Level 0 (BFS): Start
  nodes.push({
    id: "start",
    type: STEP_NODE,
    position: { x: CENTER_X, y: 0 },
    data: { stepNumber: 0, title: commonStep.title, description: commonStep.description },
  });

  // Level 1: Decision (rẽ nhánh)
  nodes.push({
    id: "decision",
    type: DECISION_NODE,
    position: { x: DECISION_CENTER_X, y: LEVEL_H },
    data: { label: "Chọn vai trò:\nFreelancer / Bên thuê" },
  });
  edges.push({ id: "e-start-decision", source: "start", target: "decision", ...edgeStyle });

  // Level 2..N: Hai nhánh song song (cùng tầng = cùng y)
  freelancerSteps.forEach((step, i) => {
    nodes.push({
      id: `fl-${i + 1}`,
      type: STEP_NODE,
      position: { x: LEFT_X, y: 2 * LEVEL_H + i * LEVEL_H },
      data: { stepNumber: i + 1, title: step.title, description: step.description },
    });
  });
  employerSteps.forEach((step, i) => {
    nodes.push({
      id: `em-${i + 1}`,
      type: STEP_NODE,
      position: { x: RIGHT_X, y: 2 * LEVEL_H + i * LEVEL_H },
      data: { stepNumber: i + 1, title: step.title, description: step.description },
    });
  });

  // Cạnh từ decision ra 2 nhánh (sourceHandle left → fl-1, right → em-1)
  edges.push({
    id: "e-decision-fl",
    source: "decision",
    sourceHandle: "left",
    target: "fl-1",
    ...edgeStyle,
  });
  edges.push({
    id: "e-decision-em",
    source: "decision",
    sourceHandle: "right",
    target: "em-1",
    ...edgeStyle,
  });

  // Chuỗi trong từng nhánh
  for (let i = 0; i < freelancerSteps.length - 1; i++) {
    edges.push({
      id: `fl-e${i}`,
      source: `fl-${i + 1}`,
      target: `fl-${i + 2}`,
      ...edgeStyle,
    });
  }
  for (let i = 0; i < employerSteps.length - 1; i++) {
    edges.push({
      id: `em-e${i}`,
      source: `em-${i + 1}`,
      target: `em-${i + 2}`,
      ...edgeStyle,
    });
  }

  return { nodes, edges };
}

export default function HowItWorksFlow() {
  const [isMobile, setIsMobile] = useState(false);
  const { nodes, edges } = useMemo(buildMergedFlow, []);
  const onNodesChange = useCallback(() => {}, []);
  const onEdgesChange = useCallback(() => {}, []);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const set = () => setIsMobile(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);

  const maxRows = Math.max(freelancerSteps.length, employerSteps.length);
  const flowHeight = 2 * LEVEL_H + maxRows * LEVEL_H + 120;

  if (isMobile) {
    return (
      <div className="flowchart-container md:hidden rounded-lg border border-slate-300 bg-slate-50/50 p-3">
        <MobileFlowView />
      </div>
    );
  }

  return (
    <div
      className="flowchart-container hidden md:block rounded-lg overflow-hidden border border-slate-300 bg-slate-50/50"
      style={{ height: flowHeight }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        minZoom={1}
        maxZoom={1}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={20}
          size={0.5}
          color="#cbd5e1"
          style={{ opacity: 0.5 }}
        />
        <Panel position="top-left" className="!m-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
          Nhánh Freelancer
        </Panel>
        <Panel position="top-right" className="!m-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
          Nhánh Bên thuê
        </Panel>
      </ReactFlow>
    </div>
  );
}
