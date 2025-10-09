// CurlyBrace.jsx
import React, { useEffect, useMemo, useState } from "react";

/** Seamless curly brace “{”/“}” as one SVG path (no seams, no kinks). */
export default function CurlyBrace({
  attachRef,
  fixedHeight,
  side = "left",
  stroke = "#111827",
  strokeWidth = 2,
  width = 10,     // visual block width
  stemX = 6,      // x of the vertical stem inside the width
  capH = 14,      // top hook height
  knotH = 22,     // knot height
  botH = 14,      // bottom hook height
  style,
}) {
  const [autoH, setAutoH] = useState(120);

  useEffect(() => {
    if (typeof fixedHeight === "number") return;
    const el = attachRef?.current;
    if (!el) return;
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      setAutoH(el.offsetHeight || 120);
      return;
    }
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => setAutoH(el.offsetHeight || 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [attachRef, fixedHeight]);

  const H = typeof fixedHeight === "number" ? fixedHeight : autoH;

  // vertical allocation
  const stretchTotal = Math.max(0, H - (capH + knotH + botH));
  const stretchTop = Math.floor(stretchTotal / 2);
  const stretchBot = stretchTotal - stretchTop;

  // pixel-snap X for crisp strokes (for integer strokeWidth)
  const X = Math.round(stemX) + 0.5;

  // how far the brace curls left
  const HOOK_OUT = Math.max(2, width * 0.60);
  const KNOT_OUT = Math.max(2, width * 0.55);

  // knot shaping (ensure ordered handles and vertical tangents)
  const k1 = Math.max(4, Math.round(knotH * 0.28));           // first handle down from knot start
  const k2 = Math.max(k1 + 2, Math.round(knotH * 0.74));      // second handle (further down)

  const d = useMemo(() => {
    const y0 = 0;
    const yCap = y0 + capH;
    const yTopStretchStart = yCap;
    const yTopStretchEnd = yCap + stretchTop;

    const yKnotStart = yTopStretchEnd;
    const yKnotMid   = yKnotStart + knotH / 2;
    const yKnotEnd   = yKnotStart + knotH;

    const yBotStretchStart = yKnotEnd;
    const yBotStretchEnd   = H - botH;

    const yEnd = H;

    return [
      // Start at top
      `M ${X} ${y0}`,

      // Top hook (return to X with vertical tangent at yCap)
      `C ${X - HOOK_OUT * 0.10} ${y0 + capH * 0.10}, ${X - HOOK_OUT} ${y0 + capH * 0.45}, ${X - HOOK_OUT * 0.60} ${y0 + capH * 0.45}`,
      `C ${X - HOOK_OUT * 0.35} ${y0 + capH * 0.45}, ${X} ${yCap - capH * 0.12}, ${X} ${yCap}`,

      // Upper straight (vertical)
      `L ${X} ${yTopStretchEnd}`,

      // Knot: FIRST cubic – start tangent is vertical (P1 at X, below the join)
      `C ${X} ${yKnotStart + k1}, ${X - KNOT_OUT} ${yKnotStart + k2}, ${X} ${yKnotMid}`,

      // Knot: SECOND cubic – end tangent vertical (P2 at X, above knot end)
      `C ${X + KNOT_OUT} ${yKnotStart + (knotH - k2)}, ${X} ${yKnotEnd - k1}, ${X} ${yKnotEnd}`,

      // Lower straight (vertical)
      `L ${X} ${yBotStretchEnd}`,

      // Bottom hook (start tangent vertical at yBotStretchEnd)
      `C ${X} ${yEnd - botH * 0.88}, ${X - HOOK_OUT} ${yEnd - botH * 0.55}, ${X - HOOK_OUT * 0.60} ${yEnd - botH * 0.55}`,
      `C ${X - HOOK_OUT * 0.35} ${yEnd - botH * 0.55}, ${X - 0.10} ${yEnd - botH * 0.12}, ${X} ${yEnd}`,
    ].join(" ");
  }, [X, H, capH, stretchTop, knotH, botH, width, k1, k2]);

  const wrap = {
    width,
    lineHeight: 0,
    transform: side === "right" ? "scaleX(-1)" : "none",
    transformOrigin: "center",
    ...style,
  };

  return (
    <div aria-hidden style={wrap}>
      <svg
        width={width}
        height={H}
        viewBox={`0 0 ${width} ${H}`}
        style={{ display: "block" }}
        preserveAspectRatio="none"
      >
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          shapeRendering="geometricPrecision"
        />
      </svg>
    </div>
  );
}
