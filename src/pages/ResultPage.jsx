import React from 'react';
import { formatNumber } from '../utils/matrixUtils';
import MatrixDisplay from '../components/MatrixDisplay';

const ResultPage = ({ t, result, setScreen, ALGORITHMS }) => {

  const handleDownload = (format) => {
    if (!result) return;
    let data, mimeType, filename;

    if (format === 'json') {
      data = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
      filename = 'slar_solution.json';
    } else { // txt
      const { x, algorithm, steps } = result;
      const algoName = ALGORITHMS.find(a => a.id === algorithm)?.label || algorithm;
      let textContent = `Algorithm: ${algoName}\n\n`;

      textContent += "--- Steps ---\n";
      steps.forEach(step => {
        textContent += `${step.title}\n`;
        if (step.result) {
          textContent += `${step.result}\n`;
        }
        textContent += '\n';
      });

      textContent += "--- Solution ---\n";
      x.forEach((val, i) => {
        textContent += `x${i + 1} = ${formatNumber(val)}\n`;
      });

      data = textContent;
      mimeType = 'text/plain';
      filename = 'slar_solution.txt';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{t('result_title')}</h2>
      {result ? (
        <>
          <p>
            {t('algorithm_display')}:{' '}
            <b>
              {ALGORITHMS.find((a) => a.id === result.algorithm)?.label ||
                result.algorithm}
            </b>
          </p>

          <div className="steps-container">
            {result.steps && result.steps.map((step, index) => (
              <div key={index} className="step">
                <h4>{step.title}</h4>
                {step.matrix && (
                  <MatrixDisplay matrix={step.matrix} b={step.b} />
                )}
                {step.result && <p>{step.result}</p>}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 6, marginTop: '1rem' }}>
            {result.x && result.x.map((xi, i) => (
              <div key={i}>
                x<sub>{i + 1}</sub> = <b>{formatNumber(xi)}</b>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>{t('no_result_message')}</p>
      )}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setScreen('input')}>
          {t('back_to_input_button')}
        </button>
        <button className="btn" onClick={() => handleDownload('txt')}>
          Download .txt
        </button>
        <button className="btn" onClick={() => handleDownload('json')}>
          Download .json
        </button>
      </div>
    </section>
  );
};

export default ResultPage;