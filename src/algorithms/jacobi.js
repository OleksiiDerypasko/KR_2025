// src/algorithms/jacobi.js
import { fmt2, fmt6 } from '../utils/matrixUtils';

export const solveJacobi = (A, b, t) => {
  const n = A.length;
  const steps = [];
  let x = Array(n).fill(0);
  const maxIt = 100;
  const tol = 1e-6;

  steps.push({ titleKey: 'initial_matrix', matrix: A, b: b });
  steps.push({ titleKey: 'initial_solution_vector', result: `x⁽⁰⁾ = [${x.map(fmt2).join(', ')}]` });

  const residualInf = (xv) => {
    let m = 0;
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += A[i][j] * xv[j];
      m = Math.max(m, Math.abs(s - b[i]));
    }
    return m;
  };

  for (let it = 1; it <= maxIt; it++) {
    const xNew = Array(n).fill(0);
    const derivationLines = [];

    for (let i = 0; i < n; i++) {
      let sum = 0;
      const terms_symbolic = [];
      const terms_numeric = [];

      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum += A[i][j] * x[j];
          terms_symbolic.push(`(${fmt2(A[i][j])})·x${j + 1}⁽${it - 1}⁾`);
          terms_numeric.push(`(${fmt2(A[i][j])})·(${fmt2(x[j])})`);
        }
      }

      const rhs_symbolic = terms_symbolic.join(' + ') || '0';
      const rhs_numeric = terms_numeric.join(' + ') || '0';

      const line1 = `x${i + 1}⁽${it}⁾ = ( ${fmt2(b[i])} - (${rhs_symbolic}) ) / ${fmt2(A[i][i])}`;
      const line2 = `      = ( ${fmt2(b[i])} - (${rhs_numeric}) ) / ${fmt2(A[i][i])}`;

      xNew[i] = (b[i] - sum) / A[i][i];
      const finalResult = ` = ${fmt2(xNew[i])}`;
      
      derivationLines.push(line1);
      derivationLines.push(line2 + finalResult);
    }

    let err = 0;
    for (let i = 0; i < n; i++) err += Math.abs(xNew[i] - x[i]);
    const r = residualInf(xNew);

    steps.push({
      titleKey: 'iteration_title',
      titleParams: { it },
      result: derivationLines.join('\n'),
      summaryKey: 'iteration_summary',
      summaryParams: {
        it_minus_1: it - 1,
        it: it,
        x_old: `[${x.map(fmt2).join(', ')}]`,
        x_new: `[${xNew.map(fmt2).join(', ')}]`,
        residual: fmt6(r),
        delta: fmt6(err)
      }
    });

    if (err < tol) return { solution: xNew, steps, error: null };
    
    x = [...xNew];
  }
  return { solution: null, steps, error: t('jacobi_not_converged') };
};