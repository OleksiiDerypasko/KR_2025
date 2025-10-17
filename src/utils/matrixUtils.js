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

export const formatNumber = (x, digits = 2, expThreshold = 1e6, zeroEps = 1e-9) => {
  if (!Number.isFinite(x)) return String(x);
  if (Math.abs(x) < zeroEps) return (0).toFixed(digits);   // "0.00"
  // експонента — лише для ДУЖЕ великих |x|
  return (Math.abs(x) > expThreshold)
    ? x.toExponential(digits)
    : x.toFixed(digits);                                    // "1.67", "0.33", "-0.20"
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

export const validateSolution = (A, b, x, tol = 1e-6) => {
  if (!A || !b || !x) return false;
  const n = A.length;
  if (x.length !== n || b.length !== n) return false;

  let ok = true;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += A[i][j] * x[j];
    if (Math.abs(s - b[i]) > tol) { ok = false; break; }
  }
  return ok; // ← той самий flag
};




export const fmtRow2 = (row) => row.map(fmt2);
export const fmtMat2 = (M) => M.map(fmtRow2);

export const fmt2 = (x) => (Number.isFinite(x) ? (Math.abs(x) < 1e-12 ? "0.00" : x.toFixed(2)) : String(x));
export const fmt6 = (x) => (Number.isFinite(x) ? (Math.abs(x) < 1e-12 ? "0.000000" : x.toFixed(6)) : String(x));

export const rowOp = (to, factor, from) =>  // R_to := R_to − factor * R_from  (підпис кроку)
  `R${to} := R${to} − (${fmt6(factor)})·R${from}`;
