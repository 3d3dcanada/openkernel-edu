import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { EXAMPLE_PROGRAMS, ExampleProgram } from '../../tutorials/examples';
import './Examples.css';

export default function ExamplesPanel() {
  const { t } = useTranslation();
  const { loadExample } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'basics', 'algorithms', 'advanced'] as const;

  const filtered = filter === 'all'
    ? EXAMPLE_PROGRAMS
    : EXAMPLE_PROGRAMS.filter(e => e.category === filter);

  return (
    <div className="examples-panel">
      <h3 className="panel-title">{t('examples.title')}</h3>

      <div className="examples-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="examples-grid">
        {filtered.map(example => (
          <div key={example.id} className="example-card">
            <div className="example-header">
              <h4 className="example-title">{example.title}</h4>
              <span className={`example-difficulty diff-${example.difficulty}`}>
                {example.difficulty}
              </span>
            </div>
            <p className="example-desc">{example.description}</p>
            <pre className="example-preview">{example.code.split('\n').slice(0, 3).join('\n')}{example.code.split('\n').length > 3 ? '\n...' : ''}</pre>
            <button
              className="example-load-btn"
              onClick={() => loadExample(example.id)}
            >
              {t('examples.load')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
