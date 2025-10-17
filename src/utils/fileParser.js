function makeSquare(size) {
  return Array.from({ length: size }, () => Array(size).fill(''));
}
function makeVector(size) {
  return Array(size).fill('');
}

export const parseFile = (file, { changeN, setA, setB, setActiveTab, t, toast }) => {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const rawText = String(reader.result || "");

      // 1) нормалізація і попереднє очищення
      const lines = rawText
        .replace(/\u00A0/g, " ")      // non-breaking space → space
        .replace(/\u2212/g, "-")      // minus sign → hyphen
        .replace(/[\u2013\u2014]/g, "-") // en/em dash → hyphen
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0 && !/^(#|\/\/|;)/.test(l)); // коментарі/порожні

      if (lines.length === 0) throw new Error(t('error_file_empty'));

      // 2) перший рядок МАЄ бути числом N
      const nTokens = lines[0].split(/[,\s;|]+/).filter(Boolean).map(v => v.replace(",", "."));
      if (!(nTokens.length === 1 && Number.isInteger(Number(nTokens[0])))) {
        throw new Error(t('error_first_line_must_be_n'));
      }
      const n = Number(nTokens[0]);
      if (n < 1 || n > 9) throw new Error(t('error_n_out_of_bounds', { n }));

      // 3) далі мають бути рівно n рядків розширеної матриці A|b
      const dataLines = lines.slice(1);
      if (dataLines.length !== n) {
        throw new Error(t('error_expected_rows_n', { n, actual: dataLines.length }));
      }

      // токенізація рядка (допускаємо пробіли/коми/крапки з комою/верт. риску як роздільники)
      const tokenize = (line) =>
        line.split(/[,\s;|]+/).filter(Boolean).map(v => v.replace(",", "."));

      const A = makeSquare(n);
      const b = makeVector(n);

      const toNum = (s, r, c) => {
        const v = Number(s);
        if (!Number.isFinite(v)) throw new Error(t('error_non_numeric', { s, r, c }));
        return v;
      };

      // 4) перевірка кожного рядка: рівно n+1 чисел
      dataLines.forEach((line, r0) => {
        const row = tokenize(line);
        if (row.length !== n + 1) {
          throw new Error(
            t('error_row_expected_len', { r: r0 + 1, expected: n + 1, actual: row.length })
          );
        }
        for (let c = 0; c < n; c++) A[r0][c] = toNum(row[c], r0 + 1, c + 1);
        b[r0] = toNum(row[n], r0 + 1, n + 1);
      });

      // 5) застосувати в стан
      changeN(n);
      setA(A);
      setB(b);
      setActiveTab("manual");
      toast.success(t("success_file_parsed"));

    } catch (e) {
      toast.error(`${t("error_prefix")}: ${e.message}`);
    }
  };

  reader.onerror = () => {
    toast.error(`${t("error_prefix")}: ${t('error_file_read')}`);
  };

  reader.readAsText(file);
};
