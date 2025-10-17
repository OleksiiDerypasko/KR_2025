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

  const algoLabel =
    ALGORITHMS.find((a) => a.id === result.algorithm)?.label ||
    result.algorithm;

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{t('result_title')}</h2>

      <p>
        {t('algorithm_display')}: <b>{algoLabel}</b>
      </p>

      {/* КРОКИ РОЗВ’ЯЗАННЯ */}
      <div className="steps-container">
  {result.steps && result.steps.map((step, index) => (
    <div key={index} className="step">
      <h4>{step.title}</h4>

      {step.matrix && (
        <MatrixDisplay matrix={step.matrix} b={step.b} />
      )}

      {step.result && (
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
          background: '#f9f9f9',
          padding: '0.5rem',
          borderRadius: '4px',
          overflowX: 'auto'
        }}>
          {step.result}
        </pre>
      )}
    </div>
  ))}
</div>


      {/* ПІДСУМКОВИЙ РОЗВ’ЯЗОК */}
      <div style={{ display: 'grid', gap: 6, marginTop: '1rem' }}>
        {result.x && result.x.map((xi, i) => (
          <div key={i}>
            x<sub>{i + 1}</sub> = <b>{formatNumber(xi)}</b>
          </div>
        ))}
      </div>

      {/* ТІЛЬКИ КНОПКА НАЗАД */}
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
