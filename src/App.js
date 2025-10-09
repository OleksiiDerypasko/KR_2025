import React, { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";
import CurlyBrace from "./CurlyBrace";

// --- START: Multilingual Setup ---

// 1. Словники перекладів
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
    singular_system_error: "Система вироджена або має нескінченно багато розв’язків (нульовий стовпець у позиції піва).",
    zero_diagonal_error: "Нуль на діагоналі під час зворотнього ходу (несумісність/невизначеність).",
    dropzone_title: "Перетягніть файл (n або n+1 колонок; якщо n+1 — остання це b)",
    dropzone_or: "або",
    choose_file_button: "Обрати файл",
    result_title: "Результат",
    algorithm_display: "Алгоритм",
    no_result_message: "Немає результату.",
    back_to_input_button: "Назад до введення",
    footer_text: "React • СЛАР: A·x = b • Динамічна дужка",
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
    singular_system_error: "System is singular or has infinitely many solutions (zero column at pivot position).",
    zero_diagonal_error: "Zero on diagonal during backward substitution (incompatible/undefined).",
    dropzone_title: "Drag & drop file (n or n+1 columns; if n+1 - last is b)",
    dropzone_or: "or",
    choose_file_button: "Choose File",
    result_title: "Result",
    algorithm_display: "Algorithm",
    no_result_message: "No result.",
    back_to_input_button: "Back to input",
    footer_text: "React • SLAE: A·x = b • Dynamic Curly Brace",
    language_switcher_label: "Language"
  }
};

// Функція для отримання мови з localStorage або встановлення дефолтної
const getInitialLanguage = () => {
  const storedLang = localStorage.getItem("language");
  return storedLang && TRANSLATIONS[storedLang] ? storedLang : "uk"; // Дефолтна українська
};

// --- END: Multilingual Setup ---


const makeSquare = (n, prev) => {
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

const makeVector = (n, prev) => {
  const next = Array.from({ length: n }, () => "");
  if (prev?.length)
    for (let i = 0; i < Math.min(n, prev.length); i++) next[i] = prev[i];
  return next;
};

// ===== helpers =====
function toNumericMatrix(A) {
  return A.map(row => row.map(v => {
    const x = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) ? x : NaN;
  }));
}
function toNumericVector(b) {
  return b.map(v => {
    const x = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) ? x : NaN;
  });
}

/** Проста реалізація Гаусса без часткового вибору опорного елемента */
function solveGauss(Ain, bin, t) { // Pass t to solveGauss for error messages
  const n = Ain.length;
  const A = Ain.map(r => r.slice());
  const b = bin.slice();

  // прямий хід
  for (let k = 0; k < n; k++) {
    // якщо діагональний елемент ~0 — спробуємо знайти нижче ненульовий і поміняти місцями рядки
    if (Math.abs(A[k][k]) < 1e-12) {
      let pivot = -1;
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(A[i][k]) > 1e-12) { pivot = i; break; }
      }
      if (pivot === -1) {
        throw new Error(t("singular_system_error")); // Translated error
      }
      [A[k], A[pivot]] = [A[pivot], A[k]];
      [b[k], b[pivot]] = [b[pivot], b[k]];
    }

    const akk = A[k][k];
    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / akk;
      for (let j = k; j < n; j++) {
        A[i][j] -= factor * A[k][j];
      }
      b[i] -= factor * b[k];
    }
  }

  // зворотній хід
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    const denom = A[i][i];
    if (Math.abs(denom) < 1e-12) {
      throw new Error(t("zero_diagonal_error")); // Translated error
    }
    x[i] = s / denom;
  }
  return x;
}

function formatNumber(x) {
  if (!Number.isFinite(x)) return String(x);
  // акуратне округлення
  const s = Math.abs(x) < 1e-6 || Math.abs(x) > 1e6 ? x.toExponential(6) : x.toFixed(6);
  // прибираємо зайві нулі
  return s.replace(/(\.\d*?[1-9])0+$/,"$1").replace(/\.0+$/,"");
}


function App() {
  // --- START: Multilingual State and Function ---
  const [language, setLanguage] = useState(getInitialLanguage);

  // Функція для перекладу
  const t = useCallback((key, params) => {
    let text = TRANSLATIONS[language][key] || key; // Повертаємо ключ, якщо переклад не знайдено
    if (params) {
      for (const p in params) {
        text = text.replace(new RegExp(`{{${p}}}`, "g"), params[p]);
      }
    }
    return text;
  }, [language]); // Перестворюємо t, коли змінюється language

  // Зберігаємо мову в localStorage при її зміні
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Оновлюємо лейбли TABS та ALGORITHMS при зміні мови
  const TABS = [
    { id: "manual", label: t("tab_manual_input") },
    { id: "dnd", label: t("tab_drag_drop") },
  ];

  const ALGORITHMS = [
    { id: "cramer", label: t("cramer_method") },
    { id: "gauss", label: t("gauss_method") },
    { id: "seidel", label: t("seidel_method") },
    { id: "gauss-jordan", label: t("gauss_jordan_method") },
    { id: "jordan", label: t("jacobi_method") },
  ];
  // --- END: Multilingual State and Function ---


  // Header
  // Note: We use t() directly in JSX now, no need for useState for header content if it only depends on t()
  // as the component will re-render when 'language' state changes.

  // Controls
  const [n, setN] = useState(3);
  const [algo, setAlgo] = useState(ALGORITHMS[1].id); // за замовчуванням Gauss
  const [activeTab, setActiveTab] = useState("manual");

  // Data
  const [A, setA] = useState(() => makeSquare(3));
  const [b, setB] = useState(() => makeVector(3));

  // Screen: "input" | "result"
  const [screen, setScreen] = useState("input");
  const [result, setResult] = useState(null); // { x: number[], algorithm: string }
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const eqWrapRef = useRef(null);

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
    setError("");
    try {
      const Anum = toNumericMatrix(A);
      const bnum = toNumericVector(b);

      // валідація
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (!Number.isFinite(Anum[i][j])) throw new Error(t("invalid_value_a", { r: i + 1, c: j + 1 }));
        }
        if (!Number.isFinite(bnum[i])) throw new Error(t("invalid_value_b", { r: i + 1 }));
      }

      let x;
      switch (algo) {
        case "gauss":
        case "gauss-jordan":
        case "cramer":
        case "seidel":
        case "jordan":
          x = solveGauss(Anum, bnum, t); // Pass t to solveGauss
          break;
        default:
          x = solveGauss(Anum, bnum, t); // Pass t to solveGauss
      }

      setResult({ x, algorithm: algo, n });
      setScreen("result");
    } catch (e) {
      // Catch custom errors from solveGauss or other validation errors
      setError(`${t("error_prefix")}: ${e.message}`);
      // залишаємося на екрані введення
    }
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) parseFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const rows = text
        .trim()
        .split(/\r?\n/)
        .map((l) => l.split(/[;, \t]+/).filter(Boolean));
      const nextA = makeSquare(n);
      const nextB = makeVector(n);
      for (let r = 0; r < Math.min(n, rows.length); r++) {
        const line = rows[r];
        for (let c = 0; c < Math.min(n, line.length); c++) nextA[r][c] = line[c];
        if (line.length >= n + 1) nextB[r] = line[n];
      }
      setA(nextA);
      setB(nextB);
      setActiveTab("manual");
    };
    reader.readAsText(file);
  };

  return (
    <div className="page">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="container header-grid">
          <div className="header-part left header-text">{t("header_left")}</div>
          <div className="header-part center header-text">{t("header_center")}</div>
          <div className="header-part right header-text">{t("header_right")}</div>
          {/* Language Switcher */}
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
        {screen === "input" && (
          <>
            {/* Controls */}
            <section className="controls card">
              <label className="field small">
                <span className="label">{t("system_size_label")}</span>
                <input
                  type="number"
                  min={1}
                  max={9}
                  className="input"
                  value={n}
                  onChange={(e) => changeN(e.target.value)}
                />
              </label>

              <label className="field">
                <span className="label">{t("algorithm_label")}</span>
                <select
                  className="input"
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value)}
                >
                  {ALGORITHMS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </label>

              <button className="btn primary" onClick={onCompute}>
                {t("calculate_button")}
              </button>
            </section>

            {error && (
              <section className="card" style={{ color: "#b91c1c" }}>
                {error}
              </section>
            )}

            {/* Tabs */}
            <nav className="tabs" role="tablist" aria-label={`${t("tab_manual_input")} / ${t("tab_drag_drop")}`}>
              {TABS.map((tab) => ( // Changed 't' to 'tab' to avoid conflict with translation function 't'
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Manual input */}
            {activeTab === "manual" && (
              <section className="card">
                <div className="system">
                  {/* Ліва дужка, тягнеться по висоті блоку рівнянь */}
                  <CurlyBrace attachRef={eqWrapRef} side="left" />

                  {/* Блок рівнянь */}
                  <div className="equations" ref={eqWrapRef}>
                    {A.map((row, r) => (
                      <div className="eqRow" key={r}>
                        {row.map((val, c) => (
                          <React.Fragment key={c}>
                            <input
                              className="coefInput"
                              placeholder={`a${r + 1}${c + 1}`}
                              aria-label={`a${r + 1}${c + 1}`}
                              value={val}
                              onChange={(e) => updateA(r, c, e.target.value)}
                              inputMode="decimal"
                            />
                            <span className="varLabel">
                              x<sub style={{ fontSize: "0.75em" }}>{c + 1}</sub>
                            </span>
                            {c < row.length - 1 && <span className="op"> + </span>}
                          </React.Fragment>
                        ))}
                        <span className="op"> = </span>
                        <input
                          className="coefInput rhs"
                          placeholder={`b${r + 1}`}
                          aria-label={`b${r + 1}`}
                          value={b[r]}
                          onChange={(e) => updateB(r, e.target.value)}
                          inputMode="decimal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Drag & Drop */}
            {activeTab === "dnd" && (
              <section
                className="dropzone card"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <p className="dz-title">
                  {t("dropzone_title")}
                </p>
                <p className="dz-sub">{t("dropzone_or")}</p>
                <button className="btn" onClick={() => fileInputRef.current?.click()}>
                  {t("choose_file_button")}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files && parseFile(e.target.files[0])}
                />
              </section>
            )}
          </>
        )}

        {screen === "result" && (
          <section className="card">
            <h2 style={{ marginTop: 0 }}>{t("result_title")}</h2>
            {result ? (
              <>
                <p>{t("algorithm_display")}: <b>{
                  ALGORITHMS.find(a => a.id === result.algorithm)?.label || result.algorithm
                }</b></p>
                <div style={{ display: "grid", gap: 6 }}>
                  {result.x.map((xi, i) => (
                    <div key={i}>
                      x<sub>{i + 1}</sub> = <b>{formatNumber(xi)}</b>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>{t("no_result_message")}</p>
            )}
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setScreen("input")}>
                {t("back_to_input_button")}
              </button>
            </div>
          </section>
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