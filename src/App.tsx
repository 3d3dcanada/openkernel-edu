import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from './store/useStore';
import CodeEditor from './components/CodeEditor/CodeEditor';
import CPUView from './components/Visualizer/CPUView';
import MemoryGrid from './components/Visualizer/MemoryGrid';
import OutputConsole from './components/Console/OutputConsole';
import Controls from './components/Controls/Controls';
import TutorialSidebar from './components/Tutorial/TutorialSidebar';
import ExamplesPanel from './components/Examples/ExamplesPanel';
import OpcodeReference from './components/Reference/OpcodeReference';
import { SUPPORTED_LANGUAGES } from './i18n';
import './styles/globals.css';
import './styles/layout.css';

function App() {
  const { t, i18n } = useTranslation();
  const {
    activeTab, setActiveTab,
    darkMode, toggleDarkMode,
    language, setLanguage,
    sidebarOpen, toggleSidebar,
    showMemoryGrid, toggleMemoryGrid,
  } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, i18n]);

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'tutorials': return <TutorialSidebar />;
      case 'examples': return <ExamplesPanel />;
      case 'reference': return <OpcodeReference />;
      default: return <TutorialSidebar />;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header" role="banner">
        <div className="app-brand">
          <span className="app-logo" role="img" aria-label="OpenKernel EDU">&#128218;</span>
          <span className="app-title">{t('app.title')}</span>
          <span className="app-subtitle">{t('app.subtitle')}</span>
        </div>

        <div className="header-actions">
          <button
            className="header-btn"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '&#9664;' : '&#9654;'}
          </button>

          <button
            className={`header-btn ${showMemoryGrid ? 'active' : ''}`}
            onClick={toggleMemoryGrid}
            aria-label="Toggle memory grid"
          >
            &#128190;
          </button>

          <button
            className="header-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '&#9728;&#65039;' : '&#127769;'}
          </button>

          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav" role="tablist" aria-label="Main navigation">
        {(['editor', 'tutorials', 'examples', 'reference'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {t(`nav.${tab}`)}
          </button>
        ))}
      </nav>

      {/* Main Layout */}
      <main className="app-main">
        {/* Sidebar */}
        {sidebarOpen && activeTab !== 'editor' && (
          <aside className="app-sidebar" role="complementary" aria-label="Sidebar">
            {renderSidebarContent()}
          </aside>
        )}

        {/* Center: Editor + Controls + Console */}
        <div className="app-center">
          <Controls />
          <div className="editor-wrapper">
            <CodeEditor />
          </div>
          <OutputConsole />
        </div>

        {/* Right: Visualizer */}
        <aside className="app-right" role="complementary" aria-label="CPU and Memory visualizer">
          <CPUView />
          {showMemoryGrid && <MemoryGrid />}
        </aside>
      </main>
    </div>
  );
}

export default App;
