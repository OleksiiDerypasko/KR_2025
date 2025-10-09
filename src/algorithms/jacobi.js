export const solveJacobi = (A, b, t) => {
  const n = A.length;
  const steps = [];
  let x = Array(n).fill(0);
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        sum += Math.abs(A[i][j]);
      }
    }
    if (Math.abs(A[i][i]) < sum) {
      return {
        solution: null,
        steps: [],
        error: "Matrix is not diagonally dominant. Jacobi method may not converge.",
      };
    }
  }

  steps.push({
    title: "Initial solution vector",
    result: `x = [${x.join(', ')}]`,
  });

  for (let iter = 0; iter < maxIterations; iter++) {
    const x_new = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum += A[i][j] * x[j];
        }
      }
      x_new[i] = (b[i] - sum) / A[i][i];
    }

    steps.push({
      title: `Iteration ${iter + 1}`,
      result: `x = [${x_new.map(val => val.toFixed(4)).join(', ')}]`,
    });

    let error = 0;
    for (let i = 0; i < n; i++) {
      error += Math.abs(x_new[i] - x[i]);
    }
    if (error < tolerance) {
      return { solution: x_new, steps, error: null };
    }
    x = x_new;
  }

  return {
    solution: null,
    steps,
    error: "Jacobi method did not converge within the maximum number of iterations.",
  };
};