import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { Opcode, OPCODE_INFO } from '../../core/types';
import './CodeEditor.css';

const EMOJI_SUGGESTIONS = Object.entries(OPCODE_INFO).map(([emoji, info]) => ({
  emoji,
  name: info.name,
  description: info.description,
}));

export default function CodeEditor() {
  const { t } = useTranslation();
  const { code, setCode, compilationResult } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  }, [setCode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, [code, setCode]);

  const insertEmoji = useCallback((emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + emoji + ' ' + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length + 1;
    }, 0);
  }, [code, setCode]);

  const lineCount = code.split('\n').length;
  const errors = compilationResult?.validation.errors || [];

  return (
    <div className="code-editor">
      <div className="code-editor-toolbar">
        <span className="code-editor-title">EmojiASM</span>
        <span className="code-editor-line-count">{lineCount} lines</span>
      </div>

      <div className="emoji-palette">
        {EMOJI_SUGGESTIONS.map(({ emoji, name, description }) => (
          <button
            key={emoji}
            className="emoji-btn"
            onClick={() => insertEmoji(emoji)}
            title={`${name}: ${description}`}
            aria-label={`Insert ${name} (${emoji})`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="code-editor-body">
        <div className="line-numbers" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className={`line-number ${errors.some(e => e.line === i + 1) ? 'line-error' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('editor.placeholder')}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Emoji code editor"
        />
      </div>

      {errors.length > 0 && (
        <div className="code-editor-errors" role="alert">
          {errors.map((error, i) => (
            <div key={i} className="error-item">
              <span className="error-line">Line {error.line}:</span>
              <span className="error-msg">{error.message}</span>
              {error.suggestion && <span className="error-suggestion">{error.suggestion}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
