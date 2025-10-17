// App.js
import React, { useState, useEffect, useMemo } from "react";
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
import { parseFile } from "./utils/fileParser";
import { validateSolution } from "./utils/matrixUtils";
import 'katex/dist/katex.min.css'; // Додайте цей рядок

import { STRINGS } from "./i18n/strings";
import { createT } from "./i18n";

import { ERR } from "./errors/codes";
import { AppError, err as makeErr } from "./errors/AppError";
import { formatError } from "./errors/formatError";

function App() {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem("language");
    return stored && STRINGS[stored] ? stored : "uk";
  });
  const t = useMemo(() => createT(language), [language]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // === ВИПРАВЛЕНО ТУТ: Обернуто в useMemo ===
  // Тепер ці масиви будуть перестворюватися зі свіжими перекладами при зміні мови
  const TABS = useMemo(() => [
    { id: "manual", label: t("tab_manual_input") },
    { id: "dnd", label: t("tab_drag_drop") },
    { id: "guide", label: t("guidelines_title") },
  ], [t]);

  const ALGORITHMS = useMemo(() => [
    { id: "cramer", label: t("cramer_method"), solver: solveCramer },
    { id: "gauss", label: t("gauss_method"), solver: solveGauss },
    { id: "seidel", label: t("seidel_method"), solver: solveSeidel },
    { id: "gauss-jordan", label: t("gauss_jordan_method"), solver: solveGaussJordan },
    { id: "jacobi", label: t("jacobi_method"), solver: solveJacobi },
  ], [t]);
  // === КІНЕЦЬ ВИПРАВЛЕННЯ ===

  const [n, setN] = useState(3);
  const [algo, setAlgo] = useState(ALGORITHMS[1].id);
  const [activeTab, setActiveTab] = useState("manual");
  const [A, setA] = useState(() => makeSquare(3));
  const [b, setB] = useState(() => makeVector(3));
  const [screen, setScreen] = useState("input");
  const [result, setResult] = useState(null);

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

  const handleError = (e) => {
    if (e instanceof AppError) {
      toast.error(`${t("error_prefix")}: ${formatError(t, e)}`);
    } else {
      toast.error(`${t("error_prefix")}: ${String(e.message || e)}`);
    }
  };

  const onCompute = () => {
    try {
      const Anum = toNumericMatrix(A);
      const bnum = toNumericVector(b);

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (!Number.isFinite(Anum[i][j])) throw makeErr(ERR.INVALID_A, { r: i + 1, c: j + 1 });
        }
        if (!Number.isFinite(bnum[i])) throw makeErr(ERR.INVALID_B, { r: i + 1 });
      }

      const selectedAlgorithm = ALGORITHMS.find(a => a.id === algo);
      if (!selectedAlgorithm) throw new Error("Algorithm not found");

      const { solution, steps, error } = selectedAlgorithm.solver(Anum, bnum, t);
      if (error) throw error;
      if (!solution) throw makeErr(ERR.NO_SOLUTION);

      const flag = validateSolution(Anum, bnum, solution, 1e-6);
      setResult({ x: solution, algorithm: algo, n, steps, flag });
      setScreen("result");
    } catch (e) {
      handleError(e);
    }
  };

  const handleFileParse = (file) => {
    const context = { changeN, setA, setB, setActiveTab, t, toast };
    parseFile(file, context);
  };

  return (
    <div className="page">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="header">
        <div className="container header-grid">
          <div className="header-part left header-text">{t("header_left")}</div>
          <div className="header-part center header-text">{t("header_center")}</div>
          <div className="header-part right header-text">{t("header_right")}</div>
          <div className="header-part language-switcher">
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
          <ResultPage t={t} result={result} setScreen={setScreen} ALGORITHMS={ALGORITHMS} />
        )}
      </main>
    </div>
  );
}

export default App;