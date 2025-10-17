import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

// Роздільник для пошуку формул: $...$ або $$...$$
const mathRegex = /(\$\$.*?\$\$|\$.*?\$)/g;

const MathRenderer = ({ text }) => {
  // Розбиваємо текст на частини: звичайний текст і формули
  const parts = text.split(mathRegex);

  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Блокова формула: $$...$$
          return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          // Вбудована формула: $...$
          return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
        }
        // Звичайний текст, можливо з HTML-тегами
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </p>
  );
};

export default MathRenderer;