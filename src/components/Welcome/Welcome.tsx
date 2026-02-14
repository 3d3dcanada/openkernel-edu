import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { SUPPORTED_LANGUAGES } from '../../i18n';
import './Welcome.css';

export default function Welcome() {
  const { t } = useTranslation();
  const { setActiveTab, setHasSeenIntro, setActiveWalkthrough, language, setLanguage } = useStore();
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimStep(1), 300),
      setTimeout(() => setAnimStep(2), 600),
      setTimeout(() => setAnimStep(3), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartLearning = () => {
    setHasSeenIntro(true);
    setActiveWalkthrough('hello-world');
    setActiveTab('beginner');
  };

  const handleExplore = () => {
    setHasSeenIntro(true);
    setActiveTab('editor');
  };

  return (
    <div className="welcome" role="main">
      {/* Language selector - prominent */}
      <div className="welcome-lang-bar">
        <div className="welcome-lang-row">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`welcome-lang-btn ${language === lang.code ? 'active' : ''}`}
              onClick={() => setLanguage(lang.code)}
              aria-label={lang.name}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="welcome-hero">
        <div className={`welcome-emoji-float ${animStep >= 1 ? 'visible' : ''}`}>
          <span className="float-emoji float-1">&#128218;</span>
          <span className="float-emoji float-2">&#129504;</span>
          <span className="float-emoji float-3">&#128187;</span>
          <span className="float-emoji float-4">&#127758;</span>
          <span className="float-emoji float-5">&#128640;</span>
        </div>
        <h1 className={`welcome-title ${animStep >= 1 ? 'visible' : ''}`}>
          OpenKernel EDU
        </h1>
        <p className={`welcome-tagline ${animStep >= 2 ? 'visible' : ''}`}>
          {t('welcome.hero_title')}
        </p>
        <p className={`welcome-subtitle ${animStep >= 2 ? 'visible' : ''}`}>
          {t('welcome.hero_subtitle')}
        </p>
        <div className={`welcome-ctas ${animStep >= 3 ? 'visible' : ''}`}>
          <button className="welcome-btn primary" onClick={handleStartLearning}>
            &#127891; {t('welcome.start_learning')}
          </button>
          <button className="welcome-btn secondary" onClick={handleExplore}>
            &#128421;&#65039; {t('welcome.explore')}
          </button>
        </div>
      </section>

      {/* Why Emoji? */}
      <section className="welcome-section">
        <h2 className="welcome-section-title">{t('welcome.why_title')}</h2>
        <div className="welcome-cards">
          <div className="welcome-card">
            <span className="card-icon">&#127758;</span>
            <h3>{t('welcome.why_universal')}</h3>
            <p>{t('welcome.why_universal_desc')}</p>
          </div>
          <div className="welcome-card">
            <span className="card-icon">&#129490;</span>
            <h3>{t('welcome.why_everyone')}</h3>
            <p>{t('welcome.why_everyone_desc')}</p>
          </div>
          <div className="welcome-card">
            <span className="card-icon">&#129504;</span>
            <h3>{t('welcome.why_real_cs')}</h3>
            <p>{t('welcome.why_real_cs_desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="welcome-section">
        <h2 className="welcome-section-title">{t('welcome.how_title')}</h2>
        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="step-number">1</div>
            <div className="step-visual">
              <div className="step-code-preview">
                <span className="emoji-line">&#128229; 42</span>
                <span className="emoji-line">&#128424;&#65039;</span>
                <span className="emoji-line">&#9209;&#65039;</span>
              </div>
            </div>
            <p className="step-label">{t('welcome.how_step1')}</p>
          </div>
          <div className="welcome-step-arrow">&#10132;</div>
          <div className="welcome-step">
            <div className="step-number">2</div>
            <div className="step-visual">
              <div className="step-cpu-preview">
                <div className="mini-register"><span>R0</span><span className="reg-val">42</span></div>
                <div className="mini-register dim"><span>R1</span><span className="reg-val">0</span></div>
                <div className="mini-register dim"><span>R2</span><span className="reg-val">0</span></div>
              </div>
            </div>
            <p className="step-label">{t('welcome.how_step2')}</p>
          </div>
          <div className="welcome-step-arrow">&#10132;</div>
          <div className="welcome-step">
            <div className="step-number">3</div>
            <div className="step-visual">
              <div className="step-output-preview">
                <span className="output-line">&#9654; 42</span>
                <span className="output-success">&#9989; {t('console.success')}</span>
              </div>
            </div>
            <p className="step-label">{t('welcome.how_step3')}</p>
          </div>
        </div>
      </section>

      {/* Live Demos Preview */}
      <section className="welcome-section">
        <h2 className="welcome-section-title">{t('welcome.demos_title')}</h2>
        <div className="welcome-cards">
          <button className="welcome-card clickable" onClick={() => { setHasSeenIntro(true); setActiveTab('demos'); }}>
            <span className="card-icon">&#9881;&#65039;</span>
            <h3>{t('demos.demo1_title')}</h3>
            <p>{t('demos.demo1_desc')}</p>
          </button>
          <button className="welcome-card clickable" onClick={() => { setHasSeenIntro(true); setActiveTab('demos'); }}>
            <span className="card-icon">&#127760;</span>
            <h3>{t('demos.demo2_title')}</h3>
            <p>{t('demos.demo2_desc')}</p>
          </button>
          <button className="welcome-card clickable" onClick={() => { setHasSeenIntro(true); setActiveTab('demos'); }}>
            <span className="card-icon">&#128187;</span>
            <h3>{t('demos.demo3_title')}</h3>
            <p>{t('demos.demo3_desc')}</p>
          </button>
        </div>
      </section>

      {/* Join the Project */}
      <section className="welcome-section welcome-join">
        <h2 className="welcome-section-title">{t('welcome.join_title')}</h2>
        <p className="welcome-join-text">{t('welcome.join_desc')}</p>
        <div className="welcome-join-areas">
          <span className="join-tag">&#127760; {t('welcome.join_translate')}</span>
          <span className="join-tag">&#128218; {t('welcome.join_lessons')}</span>
          <span className="join-tag">&#128187; {t('welcome.join_code')}</span>
          <span className="join-tag">&#129514; {t('welcome.join_test')}</span>
          <span className="join-tag">&#127912; {t('welcome.join_design')}</span>
        </div>
        <a
          className="welcome-btn primary"
          href="https://github.com/OpenKernel-edu/emoji-kernel-edu"
          target="_blank"
          rel="noopener noreferrer"
        >
          &#128736;&#65039; {t('welcome.join_cta')}
        </a>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>OpenKernel EDU &mdash; {t('welcome.footer')}</p>
      </footer>
    </div>
  );
}
