// src/components/GuidelineSection.jsx
import React from 'react';

const GuidelineSection = ({ title, description, visualComponent }) => {
  return (
    <section className="guideline-section">
      <div className="guideline-text">
        <h3>{title}</h3>
        {description}
      </div>
      <div className="guideline-visual">
        {visualComponent}
      </div>
    </section>
  );
};

export default GuidelineSection;