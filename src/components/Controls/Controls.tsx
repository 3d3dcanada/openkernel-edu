import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import './Controls.css';

export default function Controls() {
  const { t } = useTranslation();
  const { runProgram, stepProgram, resetVM, isRunning, executionSpeed, setExecutionSpeed, vmState } = useStore();

  return (
    <div className="controls" role="toolbar" aria-label="Program execution controls">
      <button
        className="control-btn control-run"
        onClick={runProgram}
        disabled={isRunning}
        title={t('editor.run')}
        aria-label="Run program"
      >
        <span className="control-icon">&#9654;&#65039;</span>
        <span className="control-label">{t('editor.run')}</span>
      </button>

      <button
        className="control-btn control-step"
        onClick={stepProgram}
        disabled={isRunning}
        title={t('editor.step')}
        aria-label="Step through one instruction"
      >
        <span className="control-icon">&#9197;&#65039;</span>
        <span className="control-label">{t('editor.step')}</span>
      </button>

      <button
        className="control-btn control-reset"
        onClick={resetVM}
        title={t('editor.reset')}
        aria-label="Reset virtual machine"
      >
        <span className="control-icon">&#128260;</span>
        <span className="control-label">{t('editor.reset')}</span>
      </button>

      <div className="control-divider" />

      <div className="speed-control">
        <label htmlFor="speed-slider" className="speed-label">{t('editor.speed')}</label>
        <input
          id="speed-slider"
          type="range"
          min="50"
          max="2000"
          step="50"
          value={executionSpeed}
          onChange={(e) => setExecutionSpeed(Number(e.target.value))}
          className="speed-slider"
        />
      </div>

      {vmState.cpu.halted && vmState.output.length > 0 && !vmState.error && (
        <div className="control-celebration" role="status" aria-label="Program completed">
          &#127881;
        </div>
      )}
    </div>
  );
}
