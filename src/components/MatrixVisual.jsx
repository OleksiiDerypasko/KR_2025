// src/components/MatrixVisual.jsx
import React from 'react';

const MatrixVisual = ({ matrix, highlights = {} }) => {
  const isHighlighted = (r, c) => {
    if (highlights.type === 'diagonal' && r === c) {
      return 'highlight-diagonal';
    }
    if (highlights.type === 'vector' && c === matrix[0].length - 1) {
        return 'highlight-vector';
    }
    return '';
  };

  return (
    <div className="matrix-visual">
      <table>
        <tbody>
          {matrix.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className={isHighlighted(r, c)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixVisual;