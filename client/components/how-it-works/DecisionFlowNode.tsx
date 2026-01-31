"use client";

import { Handle, Position, type NodeProps } from "reactflow";

export type DecisionNodeData = {
  label: string;
};

export default function DecisionFlowNode({ data }: NodeProps<DecisionNodeData>) {
  return (
    <div className="flowchart-decision relative" style={{ width: 140, height: 80 }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !-top-1 !border-2 !border-slate-500 !bg-white"
      />
      <div
        className="absolute inset-0 bg-white border-2 border-slate-500 flex items-center justify-center text-center"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      >
        <span className="text-slate-800 font-semibold text-xs px-2 leading-tight whitespace-pre-line">
          {data.label}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !-left-1 !border-2 !border-slate-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !-right-1 !border-2 !border-slate-500 !bg-white"
      />
    </div>
  );
}
