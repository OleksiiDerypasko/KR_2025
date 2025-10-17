// src/components/FileStructureVisual.jsx
import React from 'react';

const FileStructureVisual = ({ title, structure }) => {
  return (
    <div className="file-visual">
      <strong>{title}</strong>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: structure }} />
      </pre>
    </div>
  );
};

export default FileStructureVisual;