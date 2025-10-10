export const solveSeidel = (A, b, t) => {
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
        error: "Matrix is not diagonally dominant. Seidel method may not converge.",
      };
    }
  }

  steps.push({
    title: "Initial solution vector",
    result: `x = [${x.join(', ')}]`,
  });

  for (let iter = 0; iter < maxIterations; iter++) {
    const x_old = [...x];
    for (let i = 0; i < n; i++) {
      let sum1 = 0;
      for (let j = 0; j < i; j++) {
        sum1 += A[i][j] * x[j];
      }
      let sum2 = 0;
      for (let j = i + 1; j < n; j++) {
        sum2 += A[i][j] * x_old[j];
      }
      x[i] = (b[i] - sum1 - sum2) / A[i][i];
    }

    steps.push({
      title: `Iteration ${iter + 1}`,
      result: `x = [${x.map(val => val.toFixed(4)).join(', ')}]`,
    });

    let error = 0;
    for (let i = 0; i < n; i++) {
      error += Math.abs(x[i] - x_old[i]);
    }
    if (error < tolerance) {
      return { solution: x, steps, error: null };
    }
  }

  return {
    solution: null,
    steps,
    error: "Seidel method did not converge within the maximum number of iterations.",
  };
};