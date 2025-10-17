import { ERR } from '../errors/codes';
import { AppError } from '../errors/AppError';
import { fmt2, fmt6 } from '../utils/matrixUtils';

export const solveGaussJordan = (Ain, bin, t) => {
  const n = Ain.length;
  const M = Ain.map((row,i) => [...row, bin[i]]);
  const steps = [];

  const push = (title) => steps.push({
    title, matrix: M.map(r => r.slice(0,n)), b: M.map(r => r[n])
  });

  push(t('initial_augmented'));

  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i= k+1; i<n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    if (p !== k) { [M[k], M[p]] = [M[p], M[k]]; push(`${t('step')} ${steps.length}: ${t('swapped_rows_tpl',{a:k+1,b:p+1})}`); }

    if (Math.abs(M[k][k]) < 1e-12) return { solution: null, steps, error: new AppError(ERR.SINGULAR) };

    const div = M[k][k];
    for (let j=k; j<=n; j++) M[k][j] /= div;
    push(`${t('step')} ${steps.length}: ${t('normalize_row_tpl',{row:k+1})} (÷ ${fmt6(div)})`);

    for (let i=0; i<n; i++) if (i !== k) {
      const f = M[i][k];
      for (let j=k; j<=n; j++) M[i][j] -= f * M[k][j];
      push(`${t('step')} ${steps.length}: ${t('eliminate_column_tpl',{col:k+1})} (R${i+1} := R${i+1} − ${fmt6(f)}·R${k+1})`);
    }
  }

  const x = M.map(r => r[n]);
  steps.push({ title: t('final_solution'), result: x.map((v,i)=>`x${i+1}=${fmt2(v)}`).join(', ') });
  return { solution: x, steps, error: null };
};
