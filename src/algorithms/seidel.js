import { fmt2, fmt6 } from '../utils/matrixUtils';

export const solveSeidel = (A, b, t) => {
  const n = A.length, steps = [];
  let x = Array(n).fill(0), maxIt = 100, tol = 1e-6;

  steps.push({ title: t('initial_solution_vector'), result: `x⁰ = [${x.map(fmt2).join(', ')}]` });

  const residualInf = (xv)=>{
    let m=0; for (let i=0;i<n;i++){ let s=0; for (let j=0;j<n;j++) s+=A[i][j]*xv[j]; m=Math.max(m,Math.abs(s-b[i])); }
    return m;
  };

  for (let it=1; it<=maxIt; it++){
    const xOld = [...x];
    const lines = [];
    for (let i=0;i<n;i++){
      let s1=0,s2=0, t1=[], t2=[];
      for (let j=0;j<i;j++){ s1+=A[i][j]*x[j]; t1.push(`(${fmt2(A[i][j])})·x${j+1}⁽${it}⁾`); }
      for (let j=i+1;j<n;j++){ s2+=A[i][j]*xOld[j]; t2.push(`(${fmt2(A[i][j])})·x${j+1}⁽${it-1}⁾`); }
      x[i]=(b[i]-s1-s2)/A[i][i];
      const rhs = [t1.join(' + ')||'0', t2.join(' + ')||'0'].filter(s=>s!=='0').join(' + ');
      lines.push(`x${i+1}⁽${it}⁾ = ( ${fmt2(b[i])} − ${rhs||'0'} ) / ${fmt2(A[i][i])} = ${fmt2(x[i])}`);
    }
    let err=0; for (let i=0;i<n;i++) err += Math.abs(x[i]-xOld[i]);
    const r = residualInf(x);

    steps.push({
      title: `${t('iteration')} ${it}`,
      result: lines.join('\n') + `\n‖Ax−b‖∞ = ${fmt6(r)},   Δ = ${fmt6(err)}`
    });

    if (err < tol) return { solution:x, steps, error:null };
  }
  return { solution:null, steps, error: t('seidel_not_converged') };
};
