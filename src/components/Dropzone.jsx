import React from 'react';

const Dropzone = ({ t, parseFile, fileInputRef }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) parseFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <section
      className="dropzone card"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p className="dz-title">{t('dropzone_title')}</p>
      <p className="dz-sub">{t('dropzone_or')}</p>
      <button
        className="btn"
        onClick={() => fileInputRef.current?.click()}
      >
        {t('choose_file_button')}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt, text/plain"
        className="hidden"
        onChange={(e) =>
          e.target.files && parseFile(e.target.files[0])
        }
      />
    </section>
  );
};

export default Dropzone;