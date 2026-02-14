import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { WALKTHROUGHS } from '../../tutorials/beginner-walkthrough';
import { OPCODE_INFO } from '../../core/types';
import GlowingTile from './GlowingTile';
import GuideBubble from './GuideBubble';
import StepIndicator from './StepIndicator';
import './BeginnerMode.css';

const RELEVANT_OPCODES = Object.entries(OPCODE_INFO).map(([emoji, info]) => ({
  emoji,
  name: info.name,
}));

export default function BeginnerMode() {
  const { t } = useTranslation();
  const {
    activeWalkthroughId, setActiveWalkthrough,
    beginnerStep, setBeginnerStep,
    setCode, runProgram, resetVM, vmState,
    setActiveTab,
  } = useStore();

  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [numberInput, setNumberInput] = useState('');
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const walkthrough = WALKTHROUGHS.find(w => w.id === activeWalkthroughId);
  const step = walkthrough?.steps[beginnerStep];

  // Reset state when walkthrough changes
  useEffect(() => {
    setCodeLines([]);
    setNumberInput('');
    setShowNumberPad(false);
    setShowCelebration(false);
    setHasRun(false);
    resetVM();
  }, [activeWalkthroughId, resetVM]);

  const advanceStep = useCallback(() => {
    if (!walkthrough) return;
    if (beginnerStep < walkthrough.steps.length - 1) {
      setBeginnerStep(beginnerStep + 1);
    }
  }, [walkthrough, beginnerStep, setBeginnerStep]);

  const handleTileClick = useCallback((emoji: string) => {
    if (!step || step.targetAction !== 'tap-emoji') return;
    if (step.targetEmoji !== emoji) return;

    // Add emoji to code
    const currentCode = codeLines.join('\n');
    const newCode = currentCode ? currentCode + '\n' + emoji + ' ' : emoji + ' ';
    const newLines = newCode.split('\n');
    setCodeLines(newLines);

    // Check if next step needs a number or if this emoji needs no args
    const nextStep = walkthrough?.steps[beginnerStep + 1];
    if (nextStep?.targetAction === 'type-number') {
      setShowNumberPad(true);
    }
    advanceStep();
  }, [step, codeLines, walkthrough, beginnerStep, advanceStep]);

  const handleNumberSubmit = useCallback(() => {
    if (!step || step.targetAction !== 'type-number') return;
    if (numberInput !== step.targetValue) return;

    // Append number to last line
    const updated = [...codeLines];
    const lastIdx = updated.length - 1;
    if (lastIdx >= 0) {
      updated[lastIdx] = updated[lastIdx].trimEnd() + numberInput;
    }
    setCodeLines(updated);
    setNumberInput('');
    setShowNumberPad(false);
    advanceStep();
  }, [step, numberInput, codeLines, advanceStep]);

  const handleNumberPadTap = useCallback((digit: string) => {
    setNumberInput(prev => prev + digit);
  }, []);

  const handleRun = useCallback(() => {
    if (!step || step.targetAction !== 'press-run') return;
    const code = step.codeSnapshot;
    setCode(code);
    resetVM();
    setTimeout(() => {
      runProgram();
      setHasRun(true);
      advanceStep();
    }, 100);
  }, [step, setCode, resetVM, runProgram, advanceStep]);

  // Show celebration when we reach the celebrate step
  useEffect(() => {
    if (step?.targetAction === 'celebrate' && hasRun) {
      setShowCelebration(true);
    }
  }, [step, hasRun]);

  // Walkthrough selection screen
  if (!walkthrough) {
    return (
      <div className="beginner-container">
        <div className="beginner-select">
          <h2 className="beginner-main-title">{t('beginner.title')}</h2>
          <p className="beginner-intro">{t('beginner.intro')}</p>
          <div className="walkthrough-grid">
            {WALKTHROUGHS.map((wt, idx) => (
              <button
                key={wt.id}
                className="walkthrough-card"
                onClick={() => setActiveWalkthrough(wt.id)}
              >
                <span className="wt-number">{idx + 1}</span>
                <h3>{t(wt.titleKey)}</h3>
                <p>{t(wt.descriptionKey)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const output = vmState.output || [];

  return (
    <div className="beginner-container">
      {/* Header */}
      <div className="beginner-header">
        <button className="beginner-back" onClick={() => setActiveWalkthrough(null)}>
          &#8592; {t('beginner.back')}
        </button>
        <h2 className="beginner-wt-title">{t(walkthrough.titleKey)}</h2>
        <StepIndicator total={walkthrough.steps.length} current={beginnerStep} />
      </div>

      {/* Guide bubble */}
      {step && <GuideBubble text={t(step.guideTextKey)} />}

      {/* Emoji Palette */}
      {(step?.targetAction === 'tap-emoji') && (
        <div className="beginner-palette">
          <div className="palette-label">{t('beginner.tap_emoji')}</div>
          <div className="palette-grid">
            {RELEVANT_OPCODES.map(({ emoji, name }) => (
              <GlowingTile
                key={emoji}
                emoji={emoji}
                label={name}
                isGlowing={step.targetEmoji === emoji}
                isDimmed={step.targetEmoji !== emoji}
                onClick={() => handleTileClick(emoji)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Number Input */}
      {(step?.targetAction === 'type-number' || showNumberPad) && step?.targetAction === 'type-number' && (
        <div className="beginner-number-input">
          <div className="number-display">
            <span className="number-value">{numberInput || '_'}</span>
          </div>
          <div className="number-pad">
            {['1','2','3','4','5','6','7','8','9','0'].map(d => (
              <button key={d} className="numpad-btn" onClick={() => handleNumberPadTap(d)}>{d}</button>
            ))}
            <button
              className="numpad-btn backspace"
              onClick={() => setNumberInput(prev => prev.slice(0, -1))}
            >
              &#9003;
            </button>
            <button
              className={`numpad-btn confirm ${numberInput === step?.targetValue ? 'ready' : ''}`}
              onClick={handleNumberSubmit}
              disabled={numberInput !== step?.targetValue}
            >
              &#10003;
            </button>
          </div>
        </div>
      )}

      {/* Run Button */}
      {step?.targetAction === 'press-run' && (
        <div className="beginner-run-area">
          <button className="beginner-run-btn glow-tile" onClick={handleRun}>
            &#9654;&#65039; {t('beginner.run')}
          </button>
        </div>
      )}

      {/* Celebration */}
      {showCelebration && step?.targetAction === 'celebrate' && (
        <div className="beginner-celebration">
          <div className="celebration-emojis">
            <span>&#127881;</span><span>&#11088;</span><span>&#127882;</span>
            <span>&#128079;</span><span>&#127942;</span>
          </div>
          <h3>{t('beginner.celebration')}</h3>
          <p>{t(step.explanationKey)}</p>
          <div className="celebration-actions">
            {beginnerStep < WALKTHROUGHS.length * 10 && (
              <button className="welcome-btn primary" onClick={() => {
                const currentIdx = WALKTHROUGHS.findIndex(w => w.id === activeWalkthroughId);
                if (currentIdx < WALKTHROUGHS.length - 1) {
                  setActiveWalkthrough(WALKTHROUGHS[currentIdx + 1].id);
                } else {
                  setActiveWalkthrough(null);
                }
              }}>
                {t('beginner.next_walkthrough')}
              </button>
            )}
            <button className="welcome-btn secondary" onClick={() => setActiveTab('editor')}>
              {t('beginner.go_editor')}
            </button>
          </div>
        </div>
      )}

      {/* Code Preview */}
      <div className="beginner-code-preview">
        <div className="code-preview-header">{t('beginner.your_code')}</div>
        <div className="code-preview-body">
          {codeLines.length === 0 ? (
            <span className="code-placeholder">{t('beginner.code_empty')}</span>
          ) : (
            codeLines.map((line, i) => (
              <div key={i} className="code-preview-line">
                <span className="line-num">{i + 1}</span>
                <span className="line-code">{line}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Output Preview */}
      {hasRun && output.length > 0 && (
        <div className="beginner-output">
          <div className="output-header">{t('beginner.output')}</div>
          <div className="output-body">
            {output.map((line, i) => (
              <div key={i} className="output-line">&#9654; {line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation panel */}
      {step && step.targetAction !== 'celebrate' && beginnerStep > 0 && (
        <div className="beginner-explanation">
          <span className="explain-icon">&#128161;</span>
          <p>{t(walkthrough.steps[beginnerStep - 1].explanationKey)}</p>
        </div>
      )}
    </div>
  );
}
