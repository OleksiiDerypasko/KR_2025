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
// Крок 1: Імпортуємо вашу нову функцію парсера
import { parseFile } from "./utils/fileParser";

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
    language_switcher_label: "Мова",
    footer_text: "© 2025 Дерипаско Олексій. Всі права захищено."
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
    language_switcher_label: "Language",
    footer_text: "© 2025 Derypasko Oleksii. All rights reserved."
  }
};


const getInitialLanguage = () => {
  const storedLang = localStorage.getItem("language");
  return storedLang && TRANSLATIONS[storedLang] ? storedLang : "uk";
};
// --- END: Multilingual Setup ---

function App() {
  // --- Multilingual State and Function ---
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

  // --- State ---
  const [n, setN] = useState(3);
  const [algo, setAlgo] = useState(ALGORITHMS[1].id);
  const [activeTab, setActiveTab] = useState("manual");
  const [A, setA] = useState(() => makeSquare(3));
  const [b, setB] = useState(() => makeVector(3));
  const [screen, setScreen] = useState("input");
  const [result, setResult] = useState(null);

  // --- Handlers ---
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

  // Функція-обгортка, яка буде викликати наш імпортований парсер
  const handleFileParse = (file) => {
    // Формуємо об'єкт-контекст з усіма необхідними даними та функціями
    const context = {
      changeN,
      setA,
      setB,
      setActiveTab,
      t,
      toast,
    };
    // Викликаємо парсер, передаючи файл та контекст
    parseFile(file, context);
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
            parseFile={handleFileParse}
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

