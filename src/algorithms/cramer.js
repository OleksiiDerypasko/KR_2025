import { determinant } from '../utils/matrixUtils';

export const solveCramer = (A, b, t) => {
  const n = A.length;
  const steps = [];

  if (n > 4) {
    return {
      solution: null,
      steps: [],
      error: "Cramer's method is only applicable for N <= 4.",
    };
  }

  const detA = determinant(A);
  steps.push({
    title: "Calculate the determinant of the main matrix A",
    matrix: A,
    b: b,
    result: `det(A) = ${detA}`,
  });

  if (Math.abs(detA) < 1e-9) {
    return {
      solution: null,
      steps,
      error: t('singular_system_error'),
    };
  }

  const x = [];
  for (let i = 0; i < n; i++) {
    const Ai = A.map((row, j) => {
      const newRow = [...row];
      newRow[i] = b[j];
      return newRow;
    });
    const detAi = determinant(Ai);
    steps.push({
      title: `Calculate the determinant of matrix A${i + 1}`,
      matrix: Ai,
      b: b,
      result: `det(A${i + 1}) = ${detAi}`,
    });
    x.push(detAi / detA);
  }

  steps.push({
    title: "Final solution",
    result: x.map((val, i) => `x${i+1} = ${detA ? (determinant(A.map((r, j) => r.map((c, k) => k === i ? b[j] : c))) / detA) : 'undefined'}`).join(', ')
  });

  return { solution: x, steps, error: null };
};