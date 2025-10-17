// src/pages/ResultPage.jsx
import React from 'react';
import { formatNumber } from '../utils/matrixUtils';
import MatrixDisplay from '../components/MatrixDisplay';

const ResultPage = ({ t, result, setScreen, ALGORITHMS }) => {
  if (!result) {
    return (
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{t('result_title')}</h2>
        <p>{t('no_result_message')}</p>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setScreen('input')}>
            {t('back_to_input_button')}
          </button>
        </div>
      </section>
    );
  }

  const algoLabel = ALGORITHMS.find((a) => a.id === result.algorithm)?.label || result.algorithm;

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{t('result_title')}</h2>
      <p>
        {t('algorithm_display')}: <b>{algoLabel}</b>
      </p>

      <div className="steps-container">
        {result.steps && result.steps.map((step, index) => {
          // Динамічно перекладаємо заголовок
          const stepTitle = step.titleKey 
            ? t(step.titleKey, step.titleParams) 
            : step.title;
          
          // Динамічно перекладаємо основний текст та підсумок
          const stepResult = step.resultKey 
            ? t(step.resultKey, step.resultParams) 
            : step.result;
          const stepSummary = step.summaryKey 
            ? t(step.summaryKey, step.summaryParams) 
            : step.summary;

          return (
            <div key={index} className="step">
              <h4>{stepTitle}</h4>

              {step.matrix && (
                <MatrixDisplay
                  matrix={step.matrix}
                  b={step.b}
                  highlightCol={step.highlightCol}
                  highlightInfo={step.highlightInfo}
                />
              )}

              {stepResult && (
                <pre className="result-pre">{stepResult}</pre>
              )}

              {stepSummary && (
                <pre className="result-pre summary">{stepSummary}</pre>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gap: 6, marginTop: '1rem' }}>
        {result.x && result.x.map((xi, i) => (
          <div key={i}>
            x<sub>{i + 1}</sub> = <b>{formatNumber(xi)}</b>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => {
          setScreen('input');
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        }}>
          {t('back_to_input_button')}
        </button>
      </div>
    </section>
  );
};

export default ResultPage;