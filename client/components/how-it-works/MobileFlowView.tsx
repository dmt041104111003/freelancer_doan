"use client";

import { commonStep, freelancerSteps, employerSteps } from "./flowData";

function ArrowDown({ className = "", lineHeight = 32 }: { className?: string; lineHeight?: number }) {
  return (
    <div className={`flex flex-col items-center shrink-0 ${className}`}>
      <div className="w-0.5 bg-slate-400 rounded-full" style={{ minHeight: lineHeight }} />
      <svg width={18} height={14} viewBox="0 0 18 14" className="text-slate-500 -mt-px shrink-0" fill="currentColor">
        <path d="M9 14L0 0h6l3 9 3-9h6L9 14z" />
      </svg>
    </div>
  );
}

function ArrowBranch() {
  return (
    <div className="flex justify-center py-3">
      <svg
        width={120}
        height={56}
        viewBox="0 0 120 56"
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 0v20 M60 20L20 56 M60 20L100 56" />
        <polygon points="20,56 16,48 24,48" fill="#64748b" />
        <polygon points="100,56 96,48 104,48" fill="#64748b" />
      </svg>
    </div>
  );
}

const cardClass =
  "flex gap-3 items-start w-full rounded-sm border-2 border-slate-400 border-l-4 border-l-slate-500 bg-white px-3 py-3 min-h-[72px]";
const numClass =
  "w-7 h-7 shrink-0 rounded-full border-2 border-slate-500 flex items-center justify-center text-slate-700 font-semibold text-xs";
const titleClass = "font-semibold text-slate-800 text-sm leading-tight";
const descClass = "text-slate-600 text-xs mt-0.5 leading-relaxed";

export default function MobileFlowView() {
  return (
    <div className="space-y-1">
      {/* Bắt đầu */}
      <div className={cardClass}>
        <div className={numClass}>•</div>
        <div className="flex-1 min-w-0">
          <h3 className={titleClass}>{commonStep.title}</h3>
          <p className={descClass}>{commonStep.description}</p>
        </div>
      </div>

      <ArrowDown className="py-2" lineHeight={36} />

      {/* Chọn vai trò */}
      <div className="flex justify-center">
        <div
          className="bg-white border-2 border-slate-500 flex items-center justify-center text-center min-w-[140px] min-h-[72px] rounded-sm"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            padding: "0.75rem 1rem",
          }}
        >
          <span className="text-slate-800 font-semibold text-xs leading-tight whitespace-pre-line">
            Chọn vai trò:{"\n"}Freelancer / Bên thuê
          </span>
        </div>
      </div>

      <ArrowBranch />

      {/* Nhánh Freelancer */}
      <div>
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
          Nhánh Freelancer
        </p>
        <div className="space-y-0">
          {freelancerSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={cardClass}>
                <div className={numClass}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={titleClass}>{step.title}</h3>
                  <p className={descClass}>{step.description}</p>
                </div>
              </div>
              {i < freelancerSteps.length - 1 && (
                <ArrowDown className="py-1" lineHeight={20} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nhánh Bên thuê */}
      <div className="mt-6">
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
          Nhánh Bên thuê
        </p>
        <div className="space-y-0">
          {employerSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={cardClass}>
                <div className={numClass}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={titleClass}>{step.title}</h3>
                  <p className={descClass}>{step.description}</p>
                </div>
              </div>
              {i < employerSteps.length - 1 && (
                <ArrowDown className="py-1" lineHeight={20} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
