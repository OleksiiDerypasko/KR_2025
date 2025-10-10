import React, { useRef } from 'react';
import CurlyBrace from './CurlyBrace';
import { formatNumber } from '../utils/matrixUtils';

const MatrixDisplay = ({ matrix, b }) => {
  const eqWrapRef = useRef(null);

  return (
    <div className="system" style={{ marginBottom: '1rem' }}>
      <CurlyBrace attachRef={eqWrapRef} side="left" />
      <div className="equations" ref={eqWrapRef}>
        {matrix.map((row, r) => (
          <div className="eqRow" key={r}>
            {row.map((val, c) => (
              <React.Fragment key={c}>
                <span className="coef-display">{formatNumber(val)}</span>
                <span className="varLabel">
                  x<sub style={{ fontSize: '0.75em' }}>{c + 1}</sub>
                </span>
                {c < row.length - 1 && <span className="op"> + </span>}
              </React.Fragment>
            ))}
            {b && (
              <>
                <span className="op"> = </span>
                <span className="coef-display rhs">{formatNumber(b[r])}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrixDisplay;