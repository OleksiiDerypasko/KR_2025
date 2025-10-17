// src/algorithms/gaussJordan.js
import { ERR } from '../errors/codes';
import { AppError } from '../errors/AppError';
import { fmt2 } from '../utils/matrixUtils';

export const solveGaussJordan = (Ain, bin, t) => {
  const n = Ain.length;
  const M = Ain.map((row, i) => [...row, bin[i]]);
  const steps = [];

  const pushStep = (stepData) => {
    const { titleKey, titleParams, matrixState, highlightInfo, resultKey, resultParams, result } = stepData;
    steps.push({
      titleKey,
      titleParams,
      matrix: matrixState.map(r => r.slice(0, n)),
      b: matrixState.map(r => r[n]),
      highlightInfo,
      resultKey,
      resultParams,
      result
    });
  };

  pushStep({ titleKey: 'gj_initial_matrix', matrixState: M });

  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > Math.abs(M[p][k])) {
        p = i;
      }
    }

    if (p !== k) {
      const M_before = M.map(r => r.slice());
      [M[k], M[p]] = [M[p], M[k]];
      pushStep({
        titleKey: 'gj_swap_rows',
        titleParams: { r1: k + 1, r2: p + 1 },
        matrixState: M_before,
        highlightInfo: { swapRows: [k, p] }
      });
    }

    const pivotVal = M[k][k];
    if (Math.abs(pivotVal) < 1e-12) {
      return { solution: null, steps, error: new AppError(ERR.SINGULAR) };
    }

    if (Math.abs(pivotVal - 1) > 1e-9) {
      const M_before = M.map(r => r.slice());
      for (let j = k; j <= n; j++) {
        M[k][j] /= pivotVal;
      }
      pushStep({
        titleKey: 'gj_normalize_row_title',
        titleParams: { row: k + 1 },
        matrixState: M_before,
        highlightInfo: { pivotRow: k, pivotElement: { r: k, c: k } },
        resultKey: 'gj_normalize_row_details',
        resultParams: { pivotVal: fmt2(pivotVal) }
      });
    }

    for (let i = 0; i < n; i++) {
      if (i !== k) {
        const factor = M[i][k];
        if (Math.abs(factor) < 1e-12) continue;

        const M_before = M.map(r => r.slice());
        for (let j = k; j <= n; j++) {
          M[i][j] -= factor * M[k][j];
        }
        pushStep({
          titleKey: 'gj_eliminate_row_title',
          titleParams: { targetRow: i + 1 },
          matrixState: M_before,
          highlightInfo: { pivotRow: k, targetRow: i },
          resultKey: 'gj_eliminate_row_details',
          resultParams: {
            targetRow: i + 1,
            sourceRow: k + 1,
            factor: fmt2(factor)
          }
        });
      }
    }
  }

  pushStep({ titleKey: 'gj_final_matrix', matrixState: M });

  const x = M.map(r => r[n]);
  return { solution: x, steps, error: null };
};