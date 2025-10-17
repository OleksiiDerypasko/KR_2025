// src/algorithms/cramer.js
import { determinant, fmt2 } from '../utils/matrixUtils';

export const solveCramer = (A, b, t) => {
  const n = A.length;
  const steps = [];

  if (n > 4) {
    return { solution: null, steps: [], error: t('method_req_cramer') };
  }

  // Обчислюємо головний визначник
  const detA = determinant(A);
  steps.push({
    titleKey: 'cramer_det_main', // ВИПРАВЛЕНО: Використовуємо ключ для перекладу
    matrix: A,
    b,
    result: `det(A) = ${fmt2(detA)}`
  });

  // Перевірка на виродженість системи
  if (Math.abs(detA) < 1e-12) {
    return { solution: null, steps, error: t('singular_system_error') };
  }

  const x = [];
  for (let i = 0; i < n; i++) {
    // Створюємо матрицю A_i
    const Ai = A.map((row, r) => row.map((v, c) => (c === i ? b[r] : v)));
    const detAi = determinant(Ai);

    // Крок для обчислення det(A_i)
    steps.push({
      titleKey: 'cramer_det_Ai_tpl',   // ВИПРАВЛЕНО: Використовуємо ключ
      titleParams: { i: i + 1 },       // ВИПРАВЛЕНО: Передаємо параметри
      matrix: Ai,
      highlightCol: i, 
      result: `det(A${i + 1}) = ${fmt2(detAi)}`
    });

    // Обчислюємо x_i
    const xi = detAi / detA;
    x.push(xi);

    // Крок для обчислення x_i
    steps.push({
      titleKey: 'cramer_calc_xi',     // ВИПРАВЛЕНО: Використовуємо ключ
      titleParams: { i: i + 1 },       // ВИПРАВЛЕНО: Передаємо параметри
      result: `x${i + 1} = det(A${i + 1}) / det(A) = ${fmt2(detAi)} / ${fmt2(detA)} = ${fmt2(xi)}`
    });
  }

  // Фінальний крок з розв'язком
  steps.push({
    titleKey: 'final_solution', // ВИПРАВЛЕНО: Використовуємо ключ
    result: x.map((v, i) => `x${i + 1} = ${fmt2(v)}`).join(', ')
  });

  return { solution: x, steps, error: null };
};