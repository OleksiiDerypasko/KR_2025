import React, { useRef } from 'react';
import MatrixInput from '../components/MatrixInput';
import Dropzone from '../components/Dropzone';
import MethodSelector from '../components/MethodSelector';

const InputPage = ({
  t,
  n,
  changeN,
  algo,
  setAlgo,
  onCompute,
  activeTab,
  setActiveTab,
  A,
  updateA,
  b,
  updateB,
  parseFile,
  TABS,
  ALGORITHMS
}) => {
  const fileInputRef = useRef(null);

  return (
    <>
      {/* Controls */}
      <section className="controls card">
        <label className="field small">
          <span className="label">{t('system_size_label')}</span>
          <input
            type="number"
            min={1}
            max={9}
            className="input"
            value={n}
            onChange={(e) => changeN(e.target.value)}
          />
        </label>

        <MethodSelector
          t={t}
          algo={algo}
          setAlgo={setAlgo}
          ALGORITHMS={ALGORITHMS}
        />

        <button className="btn primary" onClick={onCompute}>
          {t('calculate_button')}
        </button>
      </section>

      {/* Tabs */}
      <nav className="tabs" role="tablist" aria-label={`${t('tab_manual_input')} / ${t('tab_drag_drop')}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Manual input */}
      {activeTab === 'manual' && (
        <MatrixInput
          A={A}
          b={b}
          updateA={updateA}
          updateB={updateB}
        />
      )}

      {/* Drag & Drop */}
      {activeTab === 'dnd' && (
        <Dropzone
          t={t}
          parseFile={parseFile}
          fileInputRef={fileInputRef}
        />
      )}
    </>
  );
};

export default InputPage;