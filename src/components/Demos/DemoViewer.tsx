import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { DEMOS, DemoComponents } from '../../demos';
import './DemosPanel.css';

export default function DemoViewer() {
  const { t } = useTranslation();
  const { activeDemoId, setActiveDemo } = useStore();

  if (!activeDemoId) return null;

  const demo = DEMOS.find(d => d.id === activeDemoId);
  const DemoComponent = DemoComponents[activeDemoId];

  if (!demo || !DemoComponent) return null;

  return (
    <div className="demo-viewer-overlay" role="dialog" aria-label={t(demo.titleKey)}>
      <div className="demo-viewer-header">
        <div className="demo-viewer-info">
          <span className="demo-viewer-icon">{demo.icon}</span>
          <h2>{t(demo.titleKey)}</h2>
        </div>
        <button
          className="demo-close-btn"
          onClick={() => setActiveDemo(null)}
          aria-label={t('demos.close')}
        >
          &#10005; {t('demos.close')}
        </button>
      </div>
      <div className="demo-viewer-body">
        <Suspense fallback={
          <div className="demo-loading">
            <span className="loading-spinner">&#9881;&#65039;</span>
            <p>{t('demos.loading')}</p>
          </div>
        }>
          <DemoComponent />
        </Suspense>
      </div>
    </div>
  );
}
