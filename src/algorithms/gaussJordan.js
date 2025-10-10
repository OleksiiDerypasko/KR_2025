export const solveGaussJordan = (A, b, t) => {
  const n = A.length;
  const steps = [];
  const M = A.map((row, i) => [...row, b[i]]); // Augmented matrix

  steps.push({
    title: "Initial augmented matrix [A|b]",
    matrix: M.map(row => row.slice(0, n)),
    b: M.map(row => row[n]),
  });

  for (let k = 0; k < n; k++) {
    // Pivot
    let pivot = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > Math.abs(M[pivot][k])) {
        pivot = i;
      }
    }
    [M[k], M[pivot]] = [M[pivot], M[k]];

    steps.push({
      title: `Step ${steps.length}: Swap row ${k + 1} with row ${pivot + 1} to get the largest pivot`,
      matrix: M.map(row => row.slice(0, n)),
      b: M.map(row => row[n]),
    });

    if (Math.abs(M[k][k]) < 1e-9) {
      return {
        solution: null,
        steps,
        error: t('singular_system_error'),
      };
    }

    // Normalize
    const divisor = M[k][k];
    for (let j = k; j < n + 1; j++) {
      M[k][j] /= divisor;
    }
    steps.push({
      title: `Step ${steps.length}: Normalize row ${k + 1}`,
      matrix: M.map(row => row.slice(0, n)),
      b: M.map(row => row[n]),
    });

    // Eliminate
    for (let i = 0; i < n; i++) {
      if (i !== k) {
        const factor = M[i][k];
        for (let j = k; j < n + 1; j++) {
          M[i][j] -= factor * M[k][j];
        }
      }
    }
    steps.push({
      title: `Step ${steps.length}: Eliminate column ${k + 1}`,
      matrix: M.map(row => row.slice(0, n)),
      b: M.map(row => row[n]),
    });
  }

  const x = M.map(row => row[n]);
  return { solution: x, steps, error: null };
};