"use client";

import { Handle, Position, type NodeProps } from "reactflow";

export type StepNodeData = {
  stepNumber: number;
  title: string;
  description: string;
};

export default function StepFlowNode({ data }: NodeProps<StepNodeData>) {
  const isStart = data.stepNumber === 0;

  return (
    <div
      className={`
        flowchart-node bg-white relative
        border-2 border-slate-400 font-sans
        w-[260px] h-[88px]
        flex items-center
        ${isStart ? "rounded-full px-6 py-2.5" : "rounded-sm px-4 py-3 border-l-4 border-l-slate-500"}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !-top-1 !border-2 !border-slate-500 !bg-white !opacity-80"
      />
      <div className="flex gap-3 items-start w-full min-w-0 overflow-hidden">
        {!isStart && (
          <div
            className="w-7 h-7 shrink-0 rounded-full border-2 border-slate-500 flex items-center justify-center text-slate-700 font-semibold text-xs"
            aria-hidden
          >
            {data.stepNumber}
          </div>
        )}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-1">
            {data.title}
          </h3>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !-bottom-1 !border-2 !border-slate-500 !bg-white !opacity-80"
      />
    </div>
  );
}
