export const solveGauss = (Ain, bin, t) => {
  const n = Ain.length;
  const A = Ain.map(r => r.slice());
  const b = bin.slice();
  const steps = [];

  steps.push({
    title: "Initial matrix and vector",
    matrix: A.map(row => row.slice()),
    b: b.slice(),
  });

  // Forward elimination
  for (let k = 0; k < n; k++) {
    let pivot = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(A[i][k]) > Math.abs(A[pivot][k])) {
        pivot = i;
      }
    }
    [A[k], A[pivot]] = [A[pivot], A[k]];
    [b[k], b[pivot]] = [b[pivot], b[k]];

    steps.push({
      title: `Step ${steps.length}: Swapped row ${k+1} with row ${pivot+1} for max pivot`,
      matrix: A.map(r => r.slice()),
      b: b.slice(),
    });

    if (Math.abs(A[k][k]) < 1e-9) {
      return {
        solution: null,
        steps,
        error: t('singular_system_error'),
      };
    }

    const akk = A[k][k];
    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / akk;
      for (let j = k; j < n; j++) {
        A[i][j] -= factor * A[k][j];
      }
      b[i] -= factor * b[k];
    }
    steps.push({
      title: `Step ${steps.length}: Forward elimination for column ${k+1}`,
      matrix: A.map(r => r.slice()),
      b: b.slice(),
    });
  }

  // Back substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) {
      s -= A[i][j] * x[j];
    }
    const denom = A[i][i];
    if (Math.abs(denom) < 1e-9) {
      return {
        solution: null,
        steps,
        error: t('zero_diagonal_error'),
      };
    }
    x[i] = s / denom;
  }

  steps.push({
      title: "Final solution after back substitution",
      result: x.map((val, i) => `x${i+1} = ${val}`).join(', ')
  });

  return { solution: x, steps, error: null };
};