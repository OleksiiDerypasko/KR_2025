import React, { useRef } from 'react';
import CurlyBrace from './CurlyBrace';

const MatrixInput = ({ A, b, updateA, updateB }) => {
  const eqWrapRef = useRef(null);

  return (
    <section className="card">
      <div className="system">
        <CurlyBrace attachRef={eqWrapRef} side="left" />
        <div className="equations" ref={eqWrapRef}>
          {A.map((row, r) => (
            <div className="eqRow" key={r}>
              {row.map((val, c) => (
                <React.Fragment key={c}>
                  <input
                    className="coefInput"
                    placeholder={`a${r + 1}${c + 1}`}
                    aria-label={`a${r + 1}${c + 1}`}
                    value={val}
                    onChange={(e) => updateA(r, c, e.target.value)}
                    inputMode="decimal"
                  />
                  <span className="varLabel">
                    x<sub style={{ fontSize: '0.75em' }}>{c + 1}</sub>
                  </span>
                  {c < row.length - 1 && <span className="op"> + </span>}
                </React.Fragment>
              ))}
              <span className="op"> = </span>
              <input
                className="coefInput rhs"
                placeholder={`b${r + 1}`}
                aria-label={`b${r + 1}`}
                value={b[r]}
                onChange={(e) => updateB(r, e.target.value)}
                inputMode="decimal"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatrixInput;