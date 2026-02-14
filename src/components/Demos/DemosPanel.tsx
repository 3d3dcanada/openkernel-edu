import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { DEMOS } from '../../demos';
import './DemosPanel.css';

export default function DemosPanel() {
  const { t } = useTranslation();
  const { setActiveDemo } = useStore();

  return (
    <div className="demos-panel">
      <div className="demos-header">
        <h2 className="demos-title">{t('demos.title')}</h2>
        <p className="demos-subtitle">{t('demos.subtitle')}</p>
      </div>

      <div className="demos-grid">
        {DEMOS.map(demo => (
          <div key={demo.id} className="demo-card">
            <span className="demo-icon">{demo.icon}</span>
            <h3 className="demo-card-title">{t(demo.titleKey)}</h3>
            <p className="demo-card-desc">{t(demo.descKey)}</p>
            <div className="demo-concepts">
              {demo.concepts.map(c => (
                <span key={c} className="concept-tag">{c}</span>
              ))}
            </div>
            <button
              className="demo-launch-btn"
              onClick={() => setActiveDemo(demo.id)}
            >
              &#9654;&#65039; {t('demos.launch')}
            </button>
          </div>
        ))}
      </div>

      <div className="demos-info">
        <p>{t('demos.info')}</p>
      </div>
    </div>
  );
}
