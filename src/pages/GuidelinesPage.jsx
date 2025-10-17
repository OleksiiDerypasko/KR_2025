import React from 'react';
import MatrixVisual from '../components/MatrixVisual';
import FileStructureVisual from '../components/FileStructureVisual';
import MathRenderer from '../components/MathRenderer';
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
          descriptionKey: 'algo_cramer_full_desc',
          visual: <MatrixVisual 
            title="A → Aⱼ"
            matrix={[['a₁₁', 'b₁', 'a₁₃'], ['a₂₁', 'b₂', 'a₂₃'], ['a₃₁', 'b₃', 'a₃₃']]} 
            highlights={{ type: 'vector', col: 1 }} 
          />
        },
        {
          id: 'algo-gauss',
          title: t('gauss_method'),
          descriptionKey: 'algo_gauss_full_desc',
          visual: <MatrixVisual 
            title="Трикутна матриця"
            matrix={[['a₁₁', 'a₁₂', 'a₁₃'], ['0', 'a₂₂', 'a₂₃'], ['0', '0', 'a₃₃']]} 
            highlights={{ type: 'diagonal' }} 
          />
        },
        {
          id: 'algo-gj',
          title: t('gauss_jordan_method'),
          descriptionKey: 'algo_gj_full_desc',
          visual: <MatrixVisual 
            title="Одинична матриця"
            matrix={[['1', '0', '0'], ['0', '1', '0'], ['0', '0', '1']]} 
            highlights={{ type: 'diagonal' }} 
          />
        },
        {
          id: 'algo-jacobi',
          title: t('jacobi_method'),
          descriptionKey: 'algo_jacobi_full_desc',
          visual: <div className="visual-iteration">
            <MatrixVisual matrix={[['x₁⁽ᵏ⁾'], ['x₂⁽ᵏ⁾'], ['x₃⁽ᵏ⁾']]} />
            <span className="arrow">→</span>
            <MatrixVisual matrix={[['x₁⁽ᵏ⁺¹⁾'], ['x₂⁽ᵏ⁺¹⁾'], ['x₃⁽ᵏ⁺¹⁾']]} />
          </div>
        },
        {
          id: 'algo-seidel',
          title: t('seidel_method'),
          descriptionKey: 'algo_seidel_full_desc',
          visual: <div className="visual-seidel">
            <div className="matrix-title">Покомпонентне оновлення</div>
            {/* FIX: Using MathRenderer to correctly parse the string and avoid ESLint errors */}
            <MathRenderer text={'Для розрахунку $x_2^{(k+1)}$:'} />
            <MatrixVisual matrix={[['x₁⁽ᵏ⁺¹⁾'], ['x₂⁽ᵏ⁾'], ['x₃⁽ᵏ⁾']]} highlights={{ type: 'vector', row: 0 }} />
          </div>
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
          descriptionKey: 'method_req_cramer_full_desc',
          visual: <MatrixVisual 
            title="det(A) ≠ 0"
            matrix={[['a', 'b'], ['c', 'd']]} 
            highlights={{ type: 'determinant' }} 
          />
        },
        {
          id: 'cond-iterative',
          title: `${t('jacobi_method')} & ${t('seidel_method')}`,
          descriptionKey: 'method_req_iterative_full_desc',
          visual: <MatrixVisual 
            title="Діагональне переважання"
            matrix={[['10', '2', '1'], ['1', '5', '1'], ['2', '3', '10']]} 
            highlights={{ type: 'diagonal' }} 
          />
        },
        {
          id: 'cond-gauss',
          title: `${t('gauss_method')} / ${t('gauss_jordan_method')}`,
          descriptionKey: 'method_req_gauss_full_desc',
          visual: <MatrixVisual 
            title="Невироджена матриця"
            matrix={[['A₁₁', '…', 'A₁ₙ'], ['⋮', '⋱', '⋮'], ['Aₙ₁', '…', 'Aₙₙ']]} 
          />
        }
      ]
    },
    {
      id: 'file-reqs',
      title: t('file_requirements_title'),
      items: [
        {
          id: 'file-format',
          title: t('file_format_title'),
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

  return (
    <section className="card guideline-container">
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

      {guidelineData.map(section => (
        <section key={section.id} id={section.id} className="guideline-major-section">
          <h2>{section.title}</h2>
          {section.items.map(item => (
            <div key={item.id} id={item.id} className="guideline-subsection">
              <div className="guideline-subsection-grid">
                <div className="guideline-text">
                  <h3>{item.title}</h3>
                  {React.isValidElement(item.description) 
                    ? item.description 
                    : <MathRenderer text={t(item.descriptionKey)} />
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