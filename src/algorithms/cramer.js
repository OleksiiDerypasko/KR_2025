// src/algorithms/cramer.js
import { determinant } from '../utils/matrixUtils';
import { fmt2 } from '../utils/matrixUtils';

/**
 * Розв’язання СЛАР методом Крамера.
 * Логує всі кроки: det(A), det(A_i) та формули для x_i.
 * Підтримує ключ перекладу `cramer_det_Ai` як:
 *   - рядок-шаблон "Обчислення визначника матриці A{{i}}"
 *   - або як функцію (i) => "… A{i}"
 */
export const solveCramer = (A, b, t) => {
  const n = A.length;
  const steps = [];

  // Обмеження методу
  if (n > 4) {
    return { solution: null, steps: [], error: t('method_req_cramer') };
  }

  // helper: коректний заголовок кроку для det(Ai) (шаблон або функція)
  const titleCramerAi = (i) => {
    const raw = t('cramer_det_Ai');       // може бути функцією або ключем
    if (typeof raw === 'function') {
      return raw(i);
    }
    const templ = t('cramer_det_Ai', { i });
    if (templ && templ !== 'cramer_det_Ai') return templ;
    return `det(A${i})`; // fallback
  };

  // det(A)
  const detA = determinant(A);
  steps.push({
    title: t('cramer_det_main') || 'Calculate the determinant of the main matrix A',
    matrix: A,
    b,
    result: `det(A) = ${fmt2(detA)}`
  });

  if (Math.abs(detA) < 1e-12) {
    return { solution: null, steps, error: t('singular_system_error') };
  }

  // Обчислюємо усі x_i
  const x = [];
  for (let i = 0; i < n; i++) {
    // A_i — матриця A з заміною стовпця i на вектор b
    const Ai = A.map((row, r) => row.map((v, c) => (c === i ? b[r] : v)));
    const detAi = determinant(Ai);

    // Крок: показати A_i та det(A_i)
    steps.push({
      title: titleCramerAi(i + 1),
      matrix: Ai,
      b,
      result: `det(A${i + 1}) = ${fmt2(detAi)}`
    });

    const xi = detAi / detA;
    x.push(xi);

    // Крок: формула для x_i у числах
    steps.push({
      title: `${t('step')} ${steps.length}: x${i + 1}`,
      result: `x${i + 1} = det(A${i + 1}) / det(A) = ${fmt2(detAi)} / ${fmt2(detA)} = ${fmt2(xi)}`
    });
  }

  // Підсумок
  steps.push({
    title: t('final_solution') || 'Final solution',
    result: x.map((v, i) => `x${i + 1} = ${fmt2(v)}`).join(', ')
  });

  return { solution: x, steps, error: null };
};
