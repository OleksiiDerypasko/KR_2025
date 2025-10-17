// src/algorithms/gauss.js

import { ERR } from '../errors/codes';
import { AppError } from '../errors/AppError';
import { fmt2 } from '../utils/matrixUtils';

export const solveGauss = (Ain, bin, t) => {
  const n = Ain.length;
  const A = Ain.map(r => r.slice());
  const b = bin.slice();
  const steps = [];

  steps.push({
    titleKey: 'initial_matrix',
    matrix: A.map(r => r.slice()),
    b: b.slice()
  });

  // === Прямий хід ===
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(A[i][k]) > Math.abs(A[p][k])) {
        p = i;
      }
    }

    if (p !== k) {
      const A_before_swap = A.map(r => r.slice());
      const b_before_swap = b.slice();
      [A[k], A[p]] = [A[p], A[k]];
      [b[k], b[p]] = [b[p], b[k]];
      
      steps.push({
        titleKey: 'gauss_swap_rows',
        titleParams: { r1: k + 1, r2: p + 1 },
        matrix: A_before_swap,
        b: b_before_swap,
        highlightInfo: { swapRows: [k, p] }
      });
    }

    const akk = A[k][k];
    if (Math.abs(akk) < 1e-12) {
      return { solution: null, steps, error: new AppError(ERR.SINGULAR) };
    }
    
    for (let i = k + 1; i < n; i++) {
      const val_ik_before = A[i][k];
      if (Math.abs(val_ik_before) < 1e-12) continue;

      const A_before_op = A.map(r => r.slice());
      const b_before_op = b.slice();
      const factor = val_ik_before / akk;

      for (let j = k; j < n; j++) {
        A[i][j] -= factor * A[k][j];
      }
      b[i] -= factor * b[k];

      steps.push({
        titleKey: 'gauss_eliminate_step_title',
        titleParams: { targetRow: i + 1 },
        matrix: A_before_op,
        b: b_before_op,
        highlightInfo: { pivotRow: k, targetRow: i, pivotElement: { r: k, c: k } },
        resultKey: 'gauss_eliminate_details',
        resultParams: {
          targetRow: i + 1,
          sourceRow: k + 1,
          col: k + 1,
          val_ik: fmt2(val_ik_before),
          val_kk: fmt2(akk),
          factor: fmt2(factor)
        }
      });
    }
  }

  // === Зворотний хід ===
  const x = Array(n).fill(0);
  const derivation = [];
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    let sub = [];
    for (let j = i + 1; j < n; j++) {
      s -= A[i][j] * x[j];
      sub.push(`(${fmt2(A[i][j])}) * x${j + 1}`);
    }
    const denom = A[i][i];
    if (Math.abs(denom) < 1e-12) {
      return { solution: null, steps, error: new AppError(ERR.ZERO_DIAG) };
    }
    x[i] = s / denom;
    const rhs = sub.length ? `${fmt2(b[i])} - (${sub.join(' + ')})` : fmt2(b[i]);
    derivation.push(`x${i + 1} = [${rhs}] / ${fmt2(denom)} = ${fmt2(x[i])}`);
  }

  steps.push({
    titleKey: 'final_triangular_matrix',
    matrix: A,
    b: b
  });

  steps.push({
    titleKey: 'final_solution_back',
    result: derivation.reverse().join('\n')
  });

  return { solution: x, steps, error: null };
};