import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import './Visualizer.css';

export default function MemoryGrid() {
  const { t } = useTranslation();
  const { vmState } = useStore();
  const { memory } = vmState;

  const usedBytes = Array.from(memory.data).filter(b => b !== 0).length;

  return (
    <div className="memory-grid-container">
      <div className="memory-header">
        <h3 className="panel-title">{t('memory.title')}</h3>
        <span className="memory-used">{usedBytes}/256 bytes</span>
      </div>

      <div className="memory-grid" role="grid" aria-label="Virtual memory grid">
        {Array.from(memory.data).map((byte, addr) => (
          <motion.div
            key={addr}
            className={`memory-cell ${byte !== 0 ? 'memory-used-cell' : ''} ${addr === memory.lastWritten ? 'memory-last-written' : ''} ${addr === memory.lastAccessed ? 'memory-last-accessed' : ''}`}
            title={`Address ${addr}: ${byte} (0x${byte.toString(16).padStart(2, '0')})`}
            animate={{
              scale: addr === memory.lastWritten ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
            role="gridcell"
            aria-label={`Memory address ${addr}, value ${byte}`}
          >
            <span className="memory-cell-value">
              {byte !== 0 ? byte.toString(16).padStart(2, '0').toUpperCase() : '··'}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="memory-legend">
        <span className="legend-item"><span className="legend-dot legend-empty"></span> Empty</span>
        <span className="legend-item"><span className="legend-dot legend-used"></span> Used</span>
        <span className="legend-item"><span className="legend-dot legend-written"></span> Last Write</span>
        <span className="legend-item"><span className="legend-dot legend-accessed"></span> Last Read</span>
      </div>
    </div>
  );
}
