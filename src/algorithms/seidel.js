// src/algorithms/seidel.js
import { fmt2, fmt6 } from '../utils/matrixUtils';

export const solveSeidel = (A, b, t) => {
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
    const xOld = [...x];
    const derivationLines = [];

    for (let i = 0; i < n; i++) {
      let sum1 = 0, sum2 = 0;
      const terms1_symbolic = [], terms2_symbolic = [];
      const terms1_numeric = [], terms2_numeric = [];

      for (let j = 0; j < i; j++) {
        sum1 += A[i][j] * x[j];
        terms1_symbolic.push(`(${fmt2(A[i][j])})·x${j + 1}⁽${it}⁾`);
        terms1_numeric.push(`(${fmt2(A[i][j])})·(${fmt2(x[j])})`);
      }
      
      for (let j = i + 1; j < n; j++) {
        sum2 += A[i][j] * xOld[j];
        terms2_symbolic.push(`(${fmt2(A[i][j])})·x${j + 1}⁽${it - 1}⁾`);
        terms2_numeric.push(`(${fmt2(A[i][j])})·(${fmt2(xOld[j])})`);
      }

      const rhs_symbolic = [...terms1_symbolic, ...terms2_symbolic].join(' + ') || '0';
      const rhs_numeric = [...terms1_numeric, ...terms2_symbolic].join(' + ') || '0';

      const line1 = `x${i + 1}⁽${it}⁾ = ( ${fmt2(b[i])} - (${rhs_symbolic}) ) / ${fmt2(A[i][i])}`;
      const line2 = `      = ( ${fmt2(b[i])} - (${rhs_numeric}) ) / ${fmt2(A[i][i])}`;

      x[i] = (b[i] - sum1 - sum2) / A[i][i];
      const finalResult = ` = ${fmt2(x[i])}`;
      
      derivationLines.push(line1);
      derivationLines.push(line2 + finalResult);
    }
    
    let err = 0;
    for (let i = 0; i < n; i++) err += Math.abs(x[i] - xOld[i]);
    const r = residualInf(x);

    steps.push({
      titleKey: 'iteration_title',
      titleParams: { it },
      result: derivationLines.join('\n'),
      summaryKey: 'iteration_summary',
      summaryParams: {
        it_minus_1: it - 1,
        it: it,
        x_old: `[${xOld.map(fmt2).join(', ')}]`,
        x_new: `[${x.map(fmt2).join(', ')}]`,
        residual: fmt6(r),
        delta: fmt6(err)
      }
    });

    if (err < tol) return { solution: x, steps, error: null };
  }
  return { solution: null, steps, error: t('seidel_not_converged') };
};