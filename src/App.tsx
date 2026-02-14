import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore, TabId } from './store/useStore';
import Welcome from './components/Welcome/Welcome';
import BeginnerMode from './components/BeginnerMode/BeginnerMode';
import CodeEditor from './components/CodeEditor/CodeEditor';
import CPUView from './components/Visualizer/CPUView';
import MemoryGrid from './components/Visualizer/MemoryGrid';
import OutputConsole from './components/Console/OutputConsole';
import Controls from './components/Controls/Controls';
import TutorialSidebar from './components/Tutorial/TutorialSidebar';
import ExamplesPanel from './components/Examples/ExamplesPanel';
import OpcodeReference from './components/Reference/OpcodeReference';
import DemosPanel from './components/Demos/DemosPanel';
import DemoViewer from './components/Demos/DemoViewer';
import { SUPPORTED_LANGUAGES } from './i18n';
import './styles/globals.css';
import './styles/layout.css';

const TAB_CONFIG: { id: TabId; emoji: string; labelKey: string }[] = [
  { id: 'welcome', emoji: '\u{1F3E0}', labelKey: 'nav.welcome' },
  { id: 'beginner', emoji: '\u{1F31F}', labelKey: 'nav.beginner' },
  { id: 'editor', emoji: '\u{270F}\uFE0F', labelKey: 'nav.editor' },
  { id: 'tutorials', emoji: '\u{1F4DA}', labelKey: 'nav.tutorials' },
  { id: 'examples', emoji: '\u{1F4CB}', labelKey: 'nav.examples' },
  { id: 'demos', emoji: '\u{1F680}', labelKey: 'nav.demos' },
  { id: 'reference', emoji: '\u{1F4D6}', labelKey: 'nav.reference' },
];

const FULLSCREEN_TABS = new Set<TabId>(['welcome', 'beginner', 'demos']);
const SIDEBAR_TABS = new Set<TabId>(['tutorials', 'examples', 'reference']);

function App() {
  const { t, i18n } = useTranslation();
  const {
    activeTab, setActiveTab,
    darkMode, toggleDarkMode,
    language, setLanguage,
    sidebarOpen, toggleSidebar,
    showMemoryGrid, toggleMemoryGrid,
    activeDemoId,
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
      default: return null;
    }
  };

  const isFullscreen = FULLSCREEN_TABS.has(activeTab);
  const hasSidebar = SIDEBAR_TABS.has(activeTab);

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
          {!isFullscreen && (
            <>
              <button
                className="header-btn"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? '\u25C0' : '\u25B6'}
              </button>

              <button
                className={`header-btn ${showMemoryGrid ? 'active' : ''}`}
                onClick={toggleMemoryGrid}
                aria-label="Toggle memory grid"
              >
                &#128190;
              </button>
            </>
          )}

          <button
            className="header-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '\u2600\uFE0F' : '\u{1F319}'}
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
        {TAB_CONFIG.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-emoji" aria-hidden="true">{tab.emoji}</span> {t(tab.labelKey)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      {isFullscreen ? (
        <main className="app-main app-main-fullscreen">
          {activeTab === 'welcome' && <Welcome />}
          {activeTab === 'beginner' && <BeginnerMode />}
          {activeTab === 'demos' && <DemosPanel />}
        </main>
      ) : (
        <main className="app-main">
          {sidebarOpen && hasSidebar && (
            <aside className="app-sidebar" role="complementary" aria-label="Sidebar">
              {renderSidebarContent()}
            </aside>
          )}

          <div className="app-center">
            <Controls />
            <div className="editor-wrapper">
              <CodeEditor />
            </div>
            <OutputConsole />
          </div>

          <aside className="app-right" role="complementary" aria-label="CPU and Memory visualizer">
            <CPUView />
            {showMemoryGrid && <MemoryGrid />}
          </aside>
        </main>
      )}

      {/* Demo Viewer Overlay */}
      {activeDemoId && <DemoViewer />}
    </div>
  );
}

export default App;
