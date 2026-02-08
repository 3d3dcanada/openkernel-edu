import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { ALL_REGISTERS } from '../../core/types';
import './Visualizer.css';

export default function CPUView() {
  const { t } = useTranslation();
  const { vmState } = useStore();
  const { cpu } = vmState;

  return (
    <div className="cpu-view">
      <h3 className="panel-title">{t('cpu.title')}</h3>

      <div className="registers-grid">
        {ALL_REGISTERS.map((reg) => (
          <motion.div
            key={reg}
            className={`register-cell ${cpu.registers[reg] !== 0 ? 'register-active' : ''}`}
            animate={{
              scale: cpu.registers[reg] !== 0 ? [1, 1.05, 1] : 1,
              backgroundColor: cpu.registers[reg] !== 0 ? 'var(--accent-dim)' : 'var(--surface-alt)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="register-name">{reg}</span>
            <span className="register-value">{cpu.registers[reg]}</span>
          </motion.div>
        ))}
      </div>

      <div className="cpu-info">
        <div className="cpu-info-row">
          <span className="cpu-label">{t('cpu.programCounter')}</span>
          <span className="cpu-value">{cpu.programCounter}</span>
        </div>
        <div className="cpu-info-row">
          <span className="cpu-label">{t('cpu.stackPointer')}</span>
          <span className="cpu-value">{cpu.stackPointer}</span>
        </div>
        <div className="cpu-info-row">
          <span className="cpu-label">{t('cpu.cycles')}</span>
          <span className="cpu-value">{cpu.cycleCount}</span>
        </div>
      </div>

      <div className="cpu-flags">
        <span className="flag-title">{t('cpu.flags')}</span>
        <div className="flags-row">
          <span className={`flag ${cpu.flags.zero ? 'flag-on' : ''}`}>Z</span>
          <span className={`flag ${cpu.flags.negative ? 'flag-on' : ''}`}>N</span>
          <span className={`flag ${cpu.flags.overflow ? 'flag-on' : ''}`}>O</span>
        </div>
      </div>
    </div>
  );
}
