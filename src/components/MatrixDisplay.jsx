// src/components/MatrixDisplay.js
import React, { useRef } from 'react';
import CurlyBrace from './CurlyBrace';
import { formatNumber } from '../utils/matrixUtils';

const MatrixDisplay = ({ matrix, b, highlightCol, highlightInfo }) => {
  const eqWrapRef = useRef(null);
  const n = matrix.length;

  // --- РЕЖИМ 1: Відображення матриці-сітки (для Крамера) ---
  if (highlightCol !== undefined) {
    return (
      <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {matrix.map((row, ri) =>
          row.map((cell, ci) => {
            const isHighlighted = ci === highlightCol;
            const cellClassName = `matrix-cell ${isHighlighted ? 'highlighted-column' : ''}`;
            return (
              <div key={`${ri}-${ci}`} className={cellClassName}>
                {formatNumber(cell)}
              </div>
            );
          })
        )}
      </div>
    );
  }

  // --- РЕЖИМ 2: Відображення системи рівнянь (для Гаусса та інших) ---
  return (
    <div className="system" style={{ marginBottom: '1rem' }}>
      <CurlyBrace attachRef={eqWrapRef} side="left" />
      <div className="equations" ref={eqWrapRef}>
        {matrix.map((row, r) => {
          // Визначаємо CSS-класи для підсвічування рядка
          let rowClassName = "eqRow";
          if (highlightInfo) {
            if (highlightInfo.pivotRow === r) rowClassName += " pivot-row";
            if (highlightInfo.targetRow === r) rowClassName += " target-row";
            if (highlightInfo.swapRows?.includes(r)) rowClassName += " swap-row";
          }

          return (
            <div className={rowClassName} key={r}>
              {row.map((val, c) => {
                // Визначаємо CSS-клас для підсвічування опорного елемента
                let coefClassName = "coef-display";
                if (highlightInfo?.pivotElement?.r === r && highlightInfo?.pivotElement?.c === c) {
                  coefClassName += " pivot-element";
                }
                
                return (
                  <React.Fragment key={c}>
                    <span className={coefClassName}>{formatNumber(val)}</span>
                    <span className="varLabel">
                      x<sub style={{ fontSize: '0.75em' }}>{c + 1}</sub>
                    </span>
                    {c < row.length - 1 && <span className="op"> + </span>}
                  </React.Fragment>
                );
              })}
              {b && (
                <>
                  <span className="op"> = </span>
                  <span className="coef-display rhs">{formatNumber(b[r])}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatrixDisplay;