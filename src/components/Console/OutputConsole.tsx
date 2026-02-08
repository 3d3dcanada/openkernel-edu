import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import './Console.css';

export default function OutputConsole() {
  const { t } = useTranslation();
  const { vmState, isRunning } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [vmState.output]);

  const hasOutput = vmState.output.length > 0;
  const hasError = vmState.error !== null;
  const isHalted = vmState.cpu.halted && !hasError;

  return (
    <div className="output-console">
      <div className="console-header">
        <h3 className="panel-title">{t('console.title')}</h3>
        <div className="console-status">
          {isRunning && <span className="status-running">{t('console.running')}</span>}
          {isHalted && hasOutput && <span className="status-success">{t('console.success')}</span>}
          {hasError && <span className="status-error">{t('console.error')}</span>}
        </div>
      </div>

      <div className="console-body" ref={scrollRef} role="log" aria-live="polite" aria-label="Program output">
        {!hasOutput && !hasError && (
          <div className="console-empty">{t('console.empty')}</div>
        )}

        <AnimatePresence>
          {vmState.output.map((line, i) => (
            <motion.div
              key={i}
              className="console-line"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            >
              <span className="console-prompt">&gt;</span>
              <span className="console-value">{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {hasError && (
          <motion.div
            className="console-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="error-icon">!</span>
            <span>{vmState.error}</span>
          </motion.div>
        )}

        {isHalted && hasOutput && !hasError && (
          <motion.div
            className="console-complete"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            {t('console.success')}
          </motion.div>
        )}
      </div>

      <div className="console-footer">
        <span className="console-stats">
          {vmState.output.length > 0 && `${vmState.output.length} output(s) | ${vmState.cpu.cycleCount} cycles`}
        </span>
      </div>
    </div>
  );
}
