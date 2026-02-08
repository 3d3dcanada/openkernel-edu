import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OPCODE_CATEGORIES, getOpcodeReference } from '../../compiler/opcodes';
import { OPCODE_INFO, Opcode } from '../../core/types';
import { useStore } from '../../store/useStore';
import './Reference.css';

export default function OpcodeReference() {
  const { t } = useTranslation();
  const { setCode } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? OPCODE_CATEGORIES.filter(c => c.name === selectedCategory)
    : OPCODE_CATEGORIES;

  return (
    <div className="opcode-reference">
      <h3 className="panel-title">{t('reference.title')}</h3>

      <div className="category-tabs">
        <button
          className={`category-tab ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {OPCODE_CATEGORIES.map(cat => (
          <button
            key={cat.name}
            className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      <div className="opcode-list">
        {filteredCategories.map(category => (
          <div key={category.name} className="opcode-category">
            <h4 className="category-header">
              {category.emoji} {category.name}
              <span className="category-desc">{category.description}</span>
            </h4>
            <div className="opcode-items">
              {category.opcodes.map(opcode => {
                const info = OPCODE_INFO[opcode];
                return (
                  <div key={opcode} className="opcode-item">
                    <span className="opcode-emoji">{opcode}</span>
                    <div className="opcode-details">
                      <span className="opcode-name">{info.name}</span>
                      <span className="opcode-desc">{info.description}</span>
                    </div>
                    <button
                      className="opcode-try"
                      onClick={() => {
                        const example = getQuickExample(opcode);
                        if (example) setCode(example);
                      }}
                      title="Try it"
                    >
                      Try
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getQuickExample(opcode: Opcode): string {
  switch (opcode) {
    case Opcode.LOAD: return '📥 42\n🖨️\n⏹️';
    case Opcode.STORE: return '📥 42\n💾 R0 0\n⏹️';
    case Opcode.COPY: return '📥 42\n📋 R0 R1\n⏹️';
    case Opcode.ADD: return '📥 10\n➕ 5\n🖨️\n⏹️';
    case Opcode.SUB: return '📥 20\n➖ 8\n🖨️\n⏹️';
    case Opcode.MUL: return '📥 6\n✖️ 7\n🖨️\n⏹️';
    case Opcode.DIV: return '📥 42\n➗ 6\n🖨️\n⏹️';
    case Opcode.MOD: return '📥 10\n📊 3\n🖨️\n⏹️';
    case Opcode.PRINT: return '📥 99\n🖨️\n⏹️';
    case Opcode.HALT: return '📥 1\n🖨️\n⏹️';
    case Opcode.PUSH: return '📥 42\n⬆️\n📥 0\n⬇️\n🖨️\n⏹️';
    case Opcode.POP: return '📥 42\n⬆️\n📥 0\n⬇️\n🖨️\n⏹️';
    case Opcode.JUMP: return '📥 1\n🖨️\n⏭️ 4\n📥 0\n⏹️';
    case Opcode.LOOP: return '📥 0\n🔁 3\n➕ 1\n🖨️\n🛑\n⏹️';
    default: return '📥 0\n🖨️\n⏹️';
  }
}
