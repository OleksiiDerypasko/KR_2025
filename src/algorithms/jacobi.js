import { fmt2, fmt6 } from '../utils/matrixUtils';

export const solveJacobi = (A, b, t) => {
  const n = A.length, steps = [];
  let x = Array(n).fill(0), maxIt = 100, tol = 1e-6;

  steps.push({ title: t('initial_solution_vector'), result: `x⁰ = [${x.map(fmt2).join(', ')}]` });

  const residualInf = (xv)=>{
    let m=0; for (let i=0;i<n;i++){ let s=0; for (let j=0;j<n;j++) s+=A[i][j]*xv[j]; m=Math.max(m,Math.abs(s-b[i])); }
    return m;
  };

  for (let it=1; it<=maxIt; it++){
    const xn = Array(n).fill(0);
    const lines = [];
    for (let i=0;i<n;i++){
      let sum=0, terms=[];
      for (let j=0;j<n;j++) if (i!==j){ sum += A[i][j]*x[j]; terms.push(`(${fmt2(A[i][j])})·x${j+1}⁽${it-1}⁾`); }
      xn[i] = (b[i]-sum)/A[i][i];
      lines.push(`x${i+1}⁽${it}⁾ = ( ${fmt2(b[i])} − ${terms.join(' − ')||'0'} ) / ${fmt2(A[i][i])} = ${fmt2(xn[i])}`);
    }
    let err = 0; for (let i=0;i<n;i++) err += Math.abs(xn[i]-x[i]);
    const r = residualInf(xn);

    steps.push({
      title: `${t('iteration')} ${it}`,
      result: lines.join('\n') + `\n‖Ax−b‖∞ = ${fmt6(r)},   Δ = ${fmt6(err)}`
    });

    if (err < tol) return { solution: xn, steps, error: null };
    x = xn;
  }
  return { solution:null, steps, error: t('jacobi_not_converged') };
};
