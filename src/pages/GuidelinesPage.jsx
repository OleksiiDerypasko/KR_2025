// src/pages/GuidelinesPage.jsx
import React from 'react';
import MatrixVisual from '../components/MatrixVisual';
import FileStructureVisual from '../components/FileStructureVisual';
import './GuidelinesPage.css';

const GuidelinesPage = ({ t }) => {

  const guidelineData = [
    {
      id: 'algorithms',
      title: t('algorithms_short_title'),
      items: [
        {
          id: 'algo-cramer',
          title: t('cramer_method'),
          description: t('algo_cramer_full_desc'),
          visual: <MatrixVisual matrix={[['A₁₁', 'A₁₂', 'b₁'], ['A₂₁', 'A₂₂', 'b₂'], ['A₃₁', 'A₃₂', 'b₃']]} highlights={{ type: 'vector' }} />
        },
        {
          id: 'algo-gauss',
          title: t('gauss_method'),
          description: t('algo_gauss_full_desc'),
          visual: <MatrixVisual matrix={[['A₁₁', 'A₁₂', 'A₁₃'], ['0', 'A₂₂', 'A₂₃'], ['0', '0', 'A₃₃']]} highlights={{ type: 'diagonal' }} />
        },
        {
          id: 'algo-gj',
          title: t('gauss_jordan_method'),
          description: t('algo_gj_full_desc'),
          visual: <MatrixVisual matrix={[['1', '0', '0'], ['0', '1', '0'], ['0', '0', '1']]} highlights={{ type: 'diagonal' }} />
        },
        {
          id: 'algo-jacobi',
          title: t('jacobi_method'),
          description: t('algo_jacobi_full_desc'),
          visual: <MatrixVisual matrix={[['x₁⁽ᵏ⁺¹⁾'], ['x₂⁽ᵏ⁺¹⁾'], ['x₃⁽ᵏ⁺¹⁾']]} />
        },
        {
          id: 'algo-seidel',
          title: t('seidel_method'),
          description: t('algo_seidel_full_desc'),
          visual: <p className="visual-formula">xᵢ⁽ᵏ⁺¹⁾ = f(x₁⁽ᵏ⁺¹⁾, ..., xᵢ₋₁⁽ᵏ⁺¹⁾, xᵢ⁽ᵏ⁾, ...)</p>
        },
      ]
    },
    {
      id: 'conditions',
      title: t('method_requirements_title'),
      items: [
        {
          id: 'cond-cramer',
          title: t('cramer_method'),
          description: t('method_req_cramer_full_desc'),
          visual: <MatrixVisual matrix={[['a', 'b'], ['c', 'd']]} highlights={{ type: 'determinant' }} />
        },
        {
          id: 'cond-iterative',
          title: `${t('jacobi_method')} & ${t('seidel_method')}`,
          description: t('method_req_iterative_full_desc'),
          visual: <MatrixVisual matrix={[['10', '2', '1'], ['1', '5', '1'], ['2', '3', '10']]} highlights={{ type: 'diagonal' }} />
        },
        {
          id: 'cond-gauss',
          title: `${t('gauss_method')} / ${t('gauss_jordan_method')}`,
          description: t('method_req_gauss_full_desc'),
          visual: <MatrixVisual matrix={[['A₁₁', '…', 'A₁ₙ'], ['⋮', '⋱', '⋮'], ['Aₙ₁', '…', 'Aₙₙ']]} />
        }
      ]
    },
    {
      id: 'file-reqs',
      title: t('file_requirements_title'),
      items: [
        {
          id: 'file-format',
          title: "Формат та структура файлу",
          description: (
            <>
              <p>{t('file_requirements_full_desc')}</p>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: t('file_format_N') }} />
                <li dangerouslySetInnerHTML={{ __html: t('file_format_Matrix') }} />
                <li dangerouslySetInnerHTML={{ __html: t('file_format_Separator') }} />
              </ul>
            </>
          ),
          visual: <FileStructureVisual 
            title={t('file_example_title')} 
            structure={t('file_example_content')} 
          />
        },
      ]
    }
  ];

  // Функція для обробки рядків, що містять LaTeX-подібні формули
  const renderDescription = (text) => {
    // Проста заміна для відображення LaTeX, якщо ви використовуєте MathJax/KaTeX
    // Тут ми просто видаляємо слеші, щоб текст був читабельним
    const processedText = text.replace(/\\\(|\\\)/g, '');
    return <p dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <section className="card guideline-container">
      {/* --- ЗМІСТ --- */}
      <nav className="guideline-toc">
        <h2>{t("guidelines_title")}</h2>
        <ul>
          {guidelineData.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- РЕНДЕРИНГ СЕКЦІЙ --- */}
      {guidelineData.map(section => (
        <section key={section.id} id={section.id} className="guideline-major-section">
          <h2>{section.title}</h2>
          {section.items.map(item => (
            <div key={item.id} id={item.id} className="guideline-subsection">
              <div className="guideline-subsection-grid">
                <div className="guideline-text">
                  <h3>{item.title}</h3>
                  {/* Перевіряємо, чи опис є JSX-елементом чи звичайним рядком */}
                  {React.isValidElement(item.description) 
                    ? item.description 
                    : renderDescription(item.description)
                  }
                </div>
                <div className="guideline-visual">
                  {item.visual}
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}
    </section>
  );
};

export default GuidelinesPage;