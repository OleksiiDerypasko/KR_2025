export class AppError extends Error {
  constructor(code, params = {}) {
    super(code);
    this.code = code;
    this.params = params;
  }
}

// Зручно створювати: throw err(ERR.INVALID_A, { r: 2, c: 3 })
export const err = (code, params) => new AppError(code, params);
