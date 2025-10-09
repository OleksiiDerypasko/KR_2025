import React from 'react';

const MethodSelector = ({ t, algo, setAlgo, ALGORITHMS }) => {
  return (
    <label className="field">
      <span className="label">{t('algorithm_label')}</span>
      <select
        className="input"
        value={algo}
        onChange={(e) => setAlgo(e.target.value)}
      >
        {ALGORITHMS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default MethodSelector;