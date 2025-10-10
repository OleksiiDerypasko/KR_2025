// Допоміжні функції (можна винести в окремий файл, наприклад, matrixUtils.js)
function makeSquare(size) {
  return Array.from({ length: size }, () => Array(size).fill(''));
}
function makeVector(size) {
  return Array(size).fill('');
}

/**
 * Покращена функція для парсингу файлу з системою лінійних рівнянь.
 * @param {File} file - Файл, обраний користувачем.
 * @param {object} context - Об'єкт, що містить функції для оновлення стану та перекладу.
 * @param {function} context.changeN - Функція для зміни розміру системи.
 * @param {function} context.setA - Функція для оновлення матриці A.
 * @param {function} context.setB - Функція для оновлення вектора B.
 * @param {function} context.setActiveTab - Функція для переключення на вкладку ручного вводу.
 * @param {function} context.t - Функція для інтернаціоналізації (перекладу).
 * @param {function} context.toast - Функція для відображення сповіщень.
 */
export const parseFile = (file, { changeN, setA, setB, setActiveTab, t, toast }) => {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      // Крок 1: Очищення та підготовка рядків
      const rawText = String(reader.result || "");
      const lines = rawText
        .replace(/\u00A0/g, " ")
        .replace(/\u2212/g, "-")
        .replace(/[\u2013\u2014]/g, "-")
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0 && !/^(#|\/\/|;)/.test(l));

      if (lines.length === 0) {
        throw new Error(t('error_file_empty', 'Файл порожній або містить лише коментарі.'));
      }

      // ... (решта коду парсера залишається без змін) ...
      const tokenize = (line) => line.split(/[,\s;|]+/).filter(Boolean).map(v => v.replace(",", "."));
      const tokenizedLines = lines.map(tokenize);

      let n;
      let matrixDataLines;
      const firstLineTokens = tokenizedLines[0];

      if (firstLineTokens.length === 1 && Number.isInteger(Number(firstLineTokens[0]))) {
        n = Number(firstLineTokens[0]);
        if (n < 1 || n > 9) {
          throw new Error(t('error_n_out_of_bounds', `Розмір системи N має бути від 1 до 9, але в файлі вказано {n}.`, { n }));
        }
        matrixDataLines = tokenizedLines.slice(1);
      } else {
        n = tokenizedLines.length;
        if (tokenizedLines.every(row => row.length === n + 1)) {
             matrixDataLines = tokenizedLines;
        } else if (tokenizedLines.length > n + 1) {
            throw new Error(t('error_too_many_lines_no_n', 'Забагато рядків у файлі для автоматичного визначення N. Вкажіть N у першому рядку.'));
        }
        else {
             n = tokenizedLines.length - 1;
             matrixDataLines = tokenizedLines;
        }
        if (n < 1 || n > 9) {
            throw new Error(t('error_n_derived_out_of_bounds', `Визначений розмір системи N ({n}) виходить за межі (1-9). Перевірте структуру файлу.`, { n }));
        }
      }

      const newA = makeSquare(n);
      const newB = makeVector(n);

      const toNum = (s, r, c) => {
        const v = Number(s);
        if (!Number.isFinite(v)) {
          throw new Error(t('error_non_numeric', `Нечислове значення "{s}" у рядку {r}, стовпці {c}.`, { s, r, c }));
        }
        return v;
      };

      if (matrixDataLines.length === n && matrixDataLines.every(row => row.length === n + 1)) {
        matrixDataLines.forEach((row, r) => {
          if (row.length !== n + 1) {
            throw new Error(t('error_augmented_row_length', `Рядок {r} має містити {expected} чисел (N+1), але містить {actual}.`, { r: r + 1, expected: n + 1, actual: row.length }));
          }
          for (let c = 0; c < n; c++) {
            newA[r][c] = toNum(row[c], r + 1, c + 1);
          }
          newB[r] = toNum(row[n], r + 1, n + 1);
        });
      }
      else if (matrixDataLines.length === n + 1) {
        const matrixAData = matrixDataLines.slice(0, n);
        const vectorBData = matrixDataLines[n];

        matrixAData.forEach((row, r) => {
          if (row.length !== n) {
            throw new Error(t('error_matrix_a_row_length', `Рядок {r} матриці A має містити {expected} чисел (N), але містить {actual}.`, { r: r + 1, expected: n, actual: row.length }));
          }
          for (let c = 0; c < n; c++) {
            newA[r][c] = toNum(row[c], r + 1, c + 1);
          }
        });

        if (vectorBData.length !== n) {
          throw new Error(t('error_vector_b_length', `Останній рядок (вектор B) має містити {expected} чисел (N), але містить {actual}.`, { expected: n, actual: vectorBData.length }));
        }
        for (let c = 0; c < n; c++) {
          newB[c] = toNum(vectorBData[c], n + 1, c + 1);
        }
      }
      else {
        throw new Error(t('error_structure_mismatch', `Структура файлу не відповідає жодному з підтримуваних форматів. Очікувалось {n} або {n_plus_1} рядків даних.`, { n: n, n_plus_1: n + 1 }));
      }
      
      changeN(n);
      setA(newA);
      setB(newB);
      setActiveTab("manual");
      toast.success(t('success_file_parsed', 'Файл успішно розібрано!'));

    } catch (e) {
      toast.error(`${t("error_prefix", "Помилка")}: ${e.message}`);
    }
  };

  reader.onerror = () => {
    toast.error(`${t("error_prefix", "Помилка")}: ${t('error_file_read', 'Не вдалося прочитати файл.')}`);
  };

  reader.readAsText(file);
};