import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Toaster, toast } from 'react-hot-toast';
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";
import { makeSquare, makeVector, toNumericMatrix, toNumericVector } from "./utils/matrixUtils";
import { solveGauss } from "./algorithms/gauss";
import { solveCramer } from "./algorithms/cramer";
import { solveGaussJordan } from "./algorithms/gaussJordan";
import { solveSeidel } from "./algorithms/seidel";
import { solveJacobi } from "./algorithms/jacobi";

// --- START: Multilingual Setup ---
const TRANSLATIONS = {
  uk: {
    header_left: "Курсова робота",
    header_center: "Розв'язання СЛАР",
    header_right: "Дерипаско О.В. КН-423а",
    tab_manual_input: "Ручне заповнення",
    tab_drag_drop: "Drag & Drop",
    system_size_label: "Розмір системи N (1–9)",
    algorithm_label: "Алгоритм розв’язання",
    cramer_method: "Метод Крамера",
    gauss_method: "Метод Гауса",
    seidel_method: "Метод Зейделя",
    gauss_jordan_method: "Метод Гауса-Жордана",
    jacobi_method: "Метод Якобі",
    calculate_button: "Розрахувати",
    error_prefix: "Помилка",
    invalid_value_a: "Некоректне значення a{{r}}{{c}}",
    invalid_value_b: "Некоректне значення b{{r}}",
    singular_system_error: "Система вироджена або має нескінченно багато розв’язків.",
    zero_diagonal_error: "Нуль на діагоналі.",
    dropzone_title: "Перетягніть файл сюди",
    dropzone_or: "або",
    choose_file_button: "Обрати файл",
    result_title: "Результат",
    algorithm_display: "Алгоритм",
    no_result_message: "Немає результату.",
    back_to_input_button: "Назад до введення",
    language_switcher_label: "Мова"
  },
  en: {
    header_left: "Coursework",
    header_center: "Solution of SLAE",
    header_right: "Derypasko O.V. KN-423a",
    tab_manual_input: "Manual Input",
    tab_drag_drop: "Drag & Drop",
    system_size_label: "System Size N (1–9)",
    algorithm_label: "Solution Algorithm",
    cramer_method: "Cramer's method",
    gauss_method: "Gauss's method",
    seidel_method: "Seidel's method",
    gauss_jordan_method: "Gauss-Jordan method",
    jacobi_method: "Jacobi's method",
    calculate_button: "Calculate",
    error_prefix: "Error",
    invalid_value_a: "Invalid value a{{r}}{{c}}",
    invalid_value_b: "Invalid value b{{r}}",
    singular_system_error: "System is singular or has infinitely many solutions.",
    zero_diagonal_error: "Zero on diagonal.",
    dropzone_title: "Drag & drop file here",
    dropzone_or: "or",
    choose_file_button: "Choose File",
    result_title: "Result",
    algorithm_display: "Algorithm",
    no_result_message: "No result.",
    back_to_input_button: "Back to input",
    language_switcher_label: "Language"
  }
};

const getInitialLanguage = () => {
  const storedLang = localStorage.getItem("language");
  return storedLang && TRANSLATIONS[storedLang] ? storedLang : "uk";
};
// --- END: Multilingual Setup ---

function App() {
  // --- START: Multilingual State and Function ---
  const [language, setLanguage] = useState(getInitialLanguage);

  const t = useCallback((key, params) => {
    let text = TRANSLATIONS[language][key] || key;
    if (params) {
      for (const p in params) {
        text = text.replace(new RegExp(`{{${p}}}`, "g"), params[p]);
      }
    }
    return text;
  }, [language]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const TABS = [
    { id: "manual", label: t("tab_manual_input") },
    { id: "dnd", label: t("tab_drag_drop") },
  ];

  const ALGORITHMS = [
    { id: "cramer", label: t("cramer_method"), solver: solveCramer },
    { id: "gauss", label: t("gauss_method"), solver: solveGauss },
    { id: "seidel", label: t("seidel_method"), solver: solveSeidel },
    { id: "gauss-jordan", label: t("gauss_jordan_method"), solver: solveGaussJordan },
    { id: "jacobi", label: t("jacobi_method"), solver: solveJacobi },
  ];
  // --- END: Multilingual State and Function ---

  // State
  const [n, setN] = useState(3);
  const [algo, setAlgo] = useState(ALGORITHMS[1].id);
  const [activeTab, setActiveTab] = useState("manual");
  const [A, setA] = useState(() => makeSquare(3));
  const [b, setB] = useState(() => makeVector(3));
  const [screen, setScreen] = useState("input");
  const [result, setResult] = useState(null);

  // Handlers
  const changeN = (value) => {
    const v = Math.max(1, Math.min(9, Number(value) || 1));
    setN(v);
    setA((prev) => makeSquare(v, prev));
    setB((prev) => makeVector(v, prev));
  };

  const updateA = (r, c, val) =>
    setA((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? val : cell))
      )
    );

  const updateB = (r, val) =>
    setB((prev) => prev.map((x, i) => (i === r ? val : x)));

  const onCompute = () => {
    try {
      const Anum = toNumericMatrix(A);
      const bnum = toNumericVector(b);

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (!Number.isFinite(Anum[i][j])) throw new Error(t("invalid_value_a", { r: i + 1, c: j + 1 }));
        }
        if (!Number.isFinite(bnum[i])) throw new Error(t("invalid_value_b", { r: i + 1 }));
      }

      const selectedAlgorithm = ALGORITHMS.find(a => a.id === algo);
      if (!selectedAlgorithm) {
          throw new Error("Selected algorithm not found.");
      }

      const { solution, steps, error: algoError } = selectedAlgorithm.solver(Anum, bnum, t);

      if (algoError) {
          throw new Error(algoError);
      }

      setResult({ x: solution, algorithm: algo, n, steps });
      setScreen("result");
    } catch (e) {
      toast.error(`${t("error_prefix")}: ${e.message}`);
    }
  };

const parseFile = (file) => {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      // 1) Текст + нормалізація дивних символів
      const raw = String(reader.result || "")
        .replace(/\u00A0/g, " ")       // NBSP -> space
        .replace(/\u2212/g, "-")       // unicode minus -> '-'
        .replace(/[\u2013\u2014]/g, "-"); // en/em dash -> '-'

      // 2) Рядки: прибрати порожні та коментарі
      const lines = raw
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0 && !/^(#|\/\/|;)/.test(l));

      if (lines.length === 0) {
        throw new Error("File is empty or in the wrong format.");
      }

      // 3) Токенізація рядка: пробіли/таб/коми/крапки з комою/|
      const tokenize = (line) =>
        line.split(/[,\s;|]+/).filter(Boolean).map(v => v.replace(",", "."));

      // 4) Визначаємо формат: чи перший рядок це N?
      const firstTokens = tokenize(lines[0]);
      const firstInt = Number(firstTokens[0]);
      const firstLooksLikeN =
        firstTokens.length === 1 && Number.isInteger(firstInt) && firstInt >= 1 && firstInt <= 9;

      let N, numberRows; // масиви числових токенів по рядках (без коментарів)
      if (firstLooksLikeN) {
        // Формат: N, далі N рядків A, останній рядок B
        N = firstInt;
        const rest = lines.slice(1).map(tokenize);
        if (rest.length !== N + 1) {
          throw new Error(`Expected ${N} rows for A and 1 row for B after N, got ${rest.length}.`);
        }
        numberRows = rest;
      } else {
        // Формат: одразу N рядків (визначаємо N по кількості рядків)
        const rows = lines.map(tokenize);
        const n = rows.length;
        if (n < 1 || n > 9) {
          throw new Error("Invalid N derived from rows count. N must be between 1 and 9.");
        }
        N = n;
        numberRows = rows;
      }

      // 5) Перевіряємо два допустимих варіанти розмірів
      const looksLikeSeparateB =
        numberRows.length === N + 1 &&
        numberRows.slice(0, N).every(r => r.length === N) &&
        numberRows[N].length === N;

      const looksLikeAugmented =
        numberRows.length === N &&
        numberRows.every(r => r.length === N + 1);

      if (!looksLikeSeparateB && !looksLikeAugmented) {
        const rowsCnt = numberRows.length;
        const colsMax = numberRows.reduce((m, r) => Math.max(m, r.length), 0) || 0;
        throw new Error(
          `Invalid matrix dimensions. Expected NxN + B (total ${N + 1} lines) ` +
          `or N lines of N+1 numbers (augmented). Got ${rowsCnt}x${colsMax}.`
        );
      }

      // 6) Допоміжне перетворення до числа з підказкою де помилка
      const toNum = (s, i, j) => {
        const v = Number(s);
        if (!Number.isFinite(v)) {
          throw new Error(`Non-numeric value at row ${i + 1}, col ${j + 1}: "${s}"`);
        }
        return v;
      };

      // 7) Формуємо A, B
      changeN(N);
      const nextA = makeSquare(N);
      const nextB = makeVector(N);

      if (looksLikeSeparateB) {
        for (let r = 0; r < N; r++) {
          const row = numberRows[r];
          for (let c = 0; c < N; c++) nextA[r][c] = toNum(row[c], r + 1, c + 1);
        }
        const last = numberRows[N];
        for (let c = 0; c < N; c++) nextB[c] = toNum(last[c], N + 1, c + 1);
      } else {
        // Augmented [A|B]
        for (let r = 0; r < N; r++) {
          const row = numberRows[r];
          for (let c = 0; c < N; c++) nextA[r][c] = toNum(row[c], r + 1, c + 1);
          nextB[r] = toNum(row[N], r + 1, N + 1);
        }
      }

      setA(nextA);
      setB(nextB);
      setActiveTab("manual");
    } catch (e) {
      toast.error(`${t("error_prefix")}: ${e.message}`);
    }
  };

  reader.onerror = () => {
    toast.error(`${t("error_prefix")}: Could not read the file.`);
  };

  reader.readAsText(file);
};

  return (
    <div className="page">
      <Toaster position="top-center" reverseOrder={false} />
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="container header-grid">
          <div className="header-part left header-text">{t("header_left")}</div>
          <div className="header-part center header-text">{t("header_center")}</div>
          <div className="header-part right header-text">{t("header_right")}</div>
          <div className="header-part language-switcher">
            <label className="label" htmlFor="language-select">{t("language_switcher_label")}</label>
            <select
              id="language-select"
              className="input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: 'unset', minWidth: '80px', textAlign: 'center' }}
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="container main">
        {screen === "input" ? (
          <InputPage
            t={t}
            n={n}
            changeN={changeN}
            algo={algo}
            setAlgo={setAlgo}
            onCompute={onCompute}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            A={A}
            updateA={updateA}
            b={b}
            updateB={updateB}
            parseFile={parseFile}
            TABS={TABS}
            ALGORITHMS={ALGORITHMS}
          />
        ) : (
          <ResultPage
            t={t}
            result={result}
            setScreen={setScreen}
            ALGORITHMS={ALGORITHMS}
          />
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="container footer">
        {t("footer_text")}
      </footer>
    </div>
  );
}

export default App;