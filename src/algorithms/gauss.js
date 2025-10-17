import { ERR } from '../errors/codes';
import { AppError } from '../errors/AppError';
import { fmt2, fmt6, rowOp } from '../utils/matrixUtils';

export const solveGauss = (Ain, bin, t) => {
  const n = Ain.length;
  const A = Ain.map(r => r.slice());
  const b = bin.slice();
  const steps = [];

  steps.push({ title: t('initial_matrix'), matrix: A.map(r => r.slice()), b: b.slice() });

  for (let k = 0; k < n; k++) {
    // пошук опорного
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;

    if (p !== k) {
      [A[k], A[p]] = [A[p], A[k]];
      [b[k], b[p]] = [b[p], b[k]];
      steps.push({
        title: `${t('step')} ${steps.length}: ${t('swapped_rows_tpl', { a: k+1, b: p+1 })}`,
        matrix: A.map(r => r.slice()), b: b.slice()
      });
    }

    if (Math.abs(A[k][k]) < 1e-12) return { solution: null, steps, error: new AppError(ERR.SINGULAR) };

    const akk = A[k][k];
    // елімінація внизу стовпця k
    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / akk;
      for (let j = k; j < n; j++) A[i][j] -= factor * A[k][j];
      b[i] -= factor * b[k];

      steps.push({
        title: `${t('step')} ${steps.length}: ${rowOp(i+1, factor, k+1)}`,
        matrix: A.map(r => r.slice()), b: b.slice(),
        result: `${t('forward_elimination_tpl', { col: k+1 })}`
      });
    }
  }

  // зворотний хід з поясненням формул
  const x = Array(n).fill(0);
  let derivation = [];
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    let sub = [];
    for (let j = i + 1; j < n; j++) { s -= A[i][j] * x[j]; sub.push(`(${fmt2(A[i][j])})·x${j+1}`); }
    const denom = A[i][i];
    if (Math.abs(denom) < 1e-12) return { solution: null, steps, error: new AppError(ERR.ZERO_DIAG) };
    x[i] = s / denom;

    const rhs = sub.length ? `${fmt2(b[i])} − ${sub.join(' − ')}` : fmt2(b[i]);
    derivation.push(`x${i+1} = [ ${rhs} ] / ${fmt2(denom)} = ${fmt2(x[i])}`);
  }

  steps.push({ title: t('final_solution_back'), result: derivation.reverse().join('\n') });
  return { solution: x, steps, error: null };
};
