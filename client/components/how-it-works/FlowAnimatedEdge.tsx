"use client";

import { memo, useRef, useEffect } from "react";
import { getStraightPath, getMarkerEnd, type EdgeProps } from "reactflow";
import gsap from "gsap";

const DASH_LENGTH = 12;
const FLOW_DURATION = 2.2;

function FlowAnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  markerStart,
  interactionWidth = 20,
}: EdgeProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathStr] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const markerEndUrl = typeof markerEnd === "string" ? markerEnd : getMarkerEnd(markerEnd?.type);
  const markerStartUrl = typeof markerStart === "string" ? markerStart : getMarkerEnd(markerStart?.type);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;
    const length = pathEl.getTotalLength();
    const gap = Math.max(length * 0.15, 80);
    const total = DASH_LENGTH + gap;
    gsap.set(pathEl, {
      strokeDasharray: `${DASH_LENGTH} ${gap}`,
      strokeDashoffset: 0,
    });
    const tween = gsap.to(pathEl, {
      strokeDashoffset: -total,
      duration: FLOW_DURATION,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [pathStr]);

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        className="react-flow__edge-path"
        d={pathStr}
        fill="none"
        style={{
          stroke: "#475569",
          strokeWidth: 1.5,
          ...style,
        }}
        markerEnd={markerEndUrl}
        markerStart={markerStartUrl}
      />
      {interactionWidth > 0 && (
        <path
          d={pathStr}
          fill="none"
          strokeOpacity={0}
          strokeWidth={interactionWidth}
          className="react-flow__edge-interaction"
        />
      )}
    </>
  );
}

export default memo(FlowAnimatedEdge);
