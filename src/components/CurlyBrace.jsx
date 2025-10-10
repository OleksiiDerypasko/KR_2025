// CurlyBrace.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Створює плавну, динамічну фігурну дужку SVG ("{" або "}").
 * Висота автоматично підлаштовується під висоту елемента, на який вказує `attachRef`.
 * Горизонтальне розширення контролюється пропсом `expansion`.
 * Товщина контролюється пропсом `strokeWidth`.
 */
export default function CurlyBrace({
  attachRef,
  fixedHeight,
  side = "left",
  stroke = "#111827",
  // --- Основні контролери форми ---
  strokeWidth = 2,  // Товщина лінії
  expansion = 4,    // Горизонтальне розширення
  // --- Пропси для геометрії (можна залишити за замовчуванням) ---
  width = 4,        // Базова ширина
  stemX = 1.5,      // X-координата стовбура
  capH = 2,         // Висота верхнього "гачка"
  knotH = 2,        // Висота центрального "вузла"
  botH = 2,         // Висота нижнього "гачка"
  style,
}) {
  const [autoH, setAutoH] = useState(120);

  // Ефект для відстеження зміни висоти прив'язаного елемента
  useEffect(() => {
    if (typeof fixedHeight === "number") return;
    const el = attachRef?.current;
    if (!el) return;

    if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        requestAnimationFrame(() => setAutoH(el.offsetHeight || 0));
      });
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      setAutoH(el.offsetHeight || 120);
    }
  }, [attachRef, fixedHeight]);

  // Використовуємо динамічну висоту H
  const H = typeof fixedHeight === "number" ? fixedHeight : autoH;

  const { pathData, viewBox, dynamicWidth } = useMemo(() => {
    // Мінімальна висота, щоб уникнути некоректного малювання
    const minHeight = capH + knotH + botH;
    if (H < minHeight) return { pathData: "", viewBox: `0 0 ${width} ${minHeight}`, dynamicWidth: width };

    // --- 1. Розрахунок ВЕРТИКАЛЬНИХ координат (залежать від висоти H) ---
    const stretchTotal = H - minHeight;
    const stretch = stretchTotal / 2; // Симетричне розтягнення
    
    const y_top_end = 0;
    const y_top_hook_start = y_top_end + capH;
    const y_knot_top = y_top_hook_start + stretch;
    const y_knot_mid = y_knot_top + knotH / 2;
    const y_knot_bottom = y_knot_top + knotH;
    const y_bottom_hook_start = y_knot_bottom + stretch;
    const y_bottom_end = y_bottom_hook_start + botH;

    // --- 2. Розрахунок ГОРИЗОНТАЛЬНИХ координат (залежать від expansion та strokeWidth) ---
    const baseKnotX = 0.5; // Базова позиція кінчика
    const baseEndX = width - 0.5; // Базова позиція кінців

    const thicknessCompensation = strokeWidth / 2;

    const dynamicKnotX = baseKnotX - expansion - thicknessCompensation;
    const dynamicEndX = baseEndX + expansion;
    
    // --- 3. Формування SVG-шляху ---
    const d = `M${dynamicEndX} ${y_bottom_end} C${stemX} ${y_bottom_end} ${stemX} ${y_bottom_end} ${stemX} ${y_bottom_hook_start} C${stemX} ${y_bottom_hook_start - 1} ${stemX} ${y_knot_bottom + 1} ${stemX} ${y_knot_bottom} C${stemX} ${y_knot_bottom - 1} ${dynamicKnotX} ${y_knot_mid} ${dynamicKnotX} ${y_knot_mid} C${dynamicKnotX} ${y_knot_mid} ${stemX} ${y_knot_top + 1} ${stemX} ${y_knot_top} C${stemX} ${y_top_hook_start + 1} ${stemX} ${y_top_hook_start - 1} ${stemX} ${y_top_hook_start} C${stemX} ${y_top_end} ${stemX} ${y_top_end} ${dynamicEndX} ${y_top_end}`;

    // --- 4. Адаптація viewBox та ширини ---
    const finalWidth = dynamicEndX - dynamicKnotX;
    const finalViewBox = `${dynamicKnotX} 0 ${finalWidth} ${H}`;

    return { pathData: d, viewBox: finalViewBox, dynamicWidth: finalWidth };

  }, [H, expansion, strokeWidth, width, stemX, capH, knotH, botH]);

  const wrapStyle = {
    width: dynamicWidth,
    height: H,
    lineHeight: 0,
    transform: side === "right" ? "scaleX(-1)" : "none",
    transformOrigin: "center",
    ...style,
  };

  return (
    <div aria-hidden style={wrapStyle}>
      <svg
        width={dynamicWidth}
        height={H}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d={pathData}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}