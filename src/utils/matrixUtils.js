// Utility functions for matrix operations

export const makeSquare = (n, prev) => {
  const next = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => "")
  );
  if (prev?.length) {
    for (let r = 0; r < Math.min(n, prev.length); r++) {
      for (let c = 0; c < Math.min(n, prev[0].length); c++) {
        next[r][c] = prev[r][c];
      }
    }
  }
  return next;
};

export const makeVector = (n, prev) => {
  const next = Array.from({ length: n }, () => "");
  if (prev?.length)
    for (let i = 0; i < Math.min(n, prev.length); i++) next[i] = prev[i];
  return next;
};

export const toNumericMatrix = (A) => {
  return A.map(row => row.map(v => {
    const x = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) ? x : NaN;
  }));
};

export const toNumericVector = (b) => {
  return b.map(v => {
    const x = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) ? x : NaN;
  });
};

export const formatNumber = (x) => {
  if (!Number.isFinite(x)) return String(x);
  // a-la-Excel rounding
  const s = Math.abs(x) < 1e-6 || Math.abs(x) > 1e6 ? x.toExponential(6) : x.toFixed(6);
  return s.replace(/(\.\d*?[1-9])0+$/,"$1").replace(/\.0+$/,"");
};

export const determinant = (matrix) => {
  const n = matrix.length;
  if (n === 1) {
    return matrix[0][0];
  }
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  let det = 0;
  for (let j = 0; j < n; j++) {
    det +=
      matrix[0][j] *
      (j % 2 === 0 ? 1 : -1) *
      determinant(matrix.slice(1).map((row) => row.filter((_, k) => k !== j)));
  }
  return det;
};