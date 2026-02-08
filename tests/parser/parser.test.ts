import { describe, it, expect } from 'vitest';
import { parseEmojiProgram, validateProgram } from '../../src/parser/parser';
import { Opcode } from '../../src/core/types';

describe('Emoji Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse a simple LOAD instruction', () => {
      const program = parseEmojiProgram('📥 42');
      expect(program.instructions).toHaveLength(1);
      expect(program.instructions[0].opcode).toBe(Opcode.LOAD);
      expect(program.instructions[0].operands).toEqual([42]);
    });

    it('should parse PRINT instruction (no operands)', () => {
      const program = parseEmojiProgram('🖨️');
      expect(program.instructions).toHaveLength(1);
      expect(program.instructions[0].opcode).toBe(Opcode.PRINT);
      expect(program.instructions[0].operands).toEqual([]);
    });

    it('should parse HALT instruction', () => {
      const program = parseEmojiProgram('⏹️');
      expect(program.instructions).toHaveLength(1);
      expect(program.instructions[0].opcode).toBe(Opcode.HALT);
    });

    it('should parse multi-line programs', () => {
      const source = '📥 10\n➕ 5\n🖨️\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.instructions).toHaveLength(4);
      expect(program.instructions[0].opcode).toBe(Opcode.LOAD);
      expect(program.instructions[1].opcode).toBe(Opcode.ADD);
      expect(program.instructions[2].opcode).toBe(Opcode.PRINT);
      expect(program.instructions[3].opcode).toBe(Opcode.HALT);
    });
  });

  describe('Comments', () => {
    it('should ignore comment lines', () => {
      const source = '# This is a comment\n📥 42\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.instructions).toHaveLength(2);
    });

    it('should handle inline comments', () => {
      const source = '📥 42  # Load 42\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.instructions).toHaveLength(2);
      expect(program.instructions[0].operands).toEqual([42]);
    });

    it('should skip empty lines', () => {
      const source = '📥 42\n\n\n🖨️\n\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.instructions).toHaveLength(3);
    });
  });

  describe('Arithmetic Opcodes', () => {
    it('should parse ADD', () => {
      const program = parseEmojiProgram('➕ 5');
      expect(program.instructions[0].opcode).toBe(Opcode.ADD);
      expect(program.instructions[0].operands).toEqual([5]);
    });

    it('should parse SUB', () => {
      const program = parseEmojiProgram('➖ 3');
      expect(program.instructions[0].opcode).toBe(Opcode.SUB);
      expect(program.instructions[0].operands).toEqual([3]);
    });

    it('should parse MUL', () => {
      const program = parseEmojiProgram('✖️ 2');
      expect(program.instructions[0].opcode).toBe(Opcode.MUL);
    });

    it('should parse DIV', () => {
      const program = parseEmojiProgram('➗ 4');
      expect(program.instructions[0].opcode).toBe(Opcode.DIV);
    });

    it('should parse MOD', () => {
      const program = parseEmojiProgram('📊 3');
      expect(program.instructions[0].opcode).toBe(Opcode.MOD);
    });
  });

  describe('Logic Opcodes', () => {
    it('should parse AND', () => {
      const program = parseEmojiProgram('🔀 5');
      expect(program.instructions[0].opcode).toBe(Opcode.AND);
    });
    it('should parse OR', () => {
      const program = parseEmojiProgram('🔃 5');
      expect(program.instructions[0].opcode).toBe(Opcode.OR);
    });
    it('should parse NOT', () => {
      const program = parseEmojiProgram('❌');
      expect(program.instructions[0].opcode).toBe(Opcode.NOT);
    });
    it('should parse XOR', () => {
      const program = parseEmojiProgram('🔄 5');
      expect(program.instructions[0].opcode).toBe(Opcode.XOR);
    });
  });

  describe('Comparison Opcodes', () => {
    it('should parse CMP', () => {
      const program = parseEmojiProgram('⚖️ 10');
      expect(program.instructions[0].opcode).toBe(Opcode.CMP);
    });
  });

  describe('Stack Opcodes', () => {
    it('should parse PUSH', () => {
      const program = parseEmojiProgram('⬆️');
      expect(program.instructions[0].opcode).toBe(Opcode.PUSH);
    });
    it('should parse POP', () => {
      const program = parseEmojiProgram('⬇️');
      expect(program.instructions[0].opcode).toBe(Opcode.POP);
    });
  });

  describe('Control Flow', () => {
    it('should parse JUMP with address', () => {
      const program = parseEmojiProgram('⏭️ 0');
      expect(program.instructions[0].opcode).toBe(Opcode.JUMP);
      expect(program.instructions[0].operands).toEqual([0]);
    });

    it('should parse JUMP_IF_ZERO', () => {
      const program = parseEmojiProgram('❓ 5');
      expect(program.instructions[0].opcode).toBe(Opcode.JUMP_IF_ZERO);
    });
  });

  describe('Register Operands', () => {
    it('should parse COPY with register operands', () => {
      const program = parseEmojiProgram('📋 R0 R1');
      expect(program.instructions[0].opcode).toBe(Opcode.COPY);
      expect(program.instructions[0].operands).toEqual(['R0', 'R1']);
    });
  });

  describe('Validation', () => {
    it('should warn about missing HALT', () => {
      const program = parseEmojiProgram('📥 42\n🖨️');
      const errors = validateProgram(program);
      expect(errors.some(e => e.message.includes('HALT'))).toBe(true);
    });

    it('should detect out-of-bounds jump targets', () => {
      const program = parseEmojiProgram('⏭️ 99\n⏹️');
      const errors = validateProgram(program);
      expect(errors.some(e => e.message.includes('out of bounds'))).toBe(true);
    });
  });

  describe('Complete Program Parsing', () => {
    it('should parse hello world program', () => {
      const source = '📥 42\n🖨️\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.valid).toBe(true);
      expect(program.instructions).toHaveLength(3);
    });

    it('should parse calculator program', () => {
      const source = '📥 10\n➕ 5\n🖨️\n➖ 3\n🖨️\n⏹️';
      const program = parseEmojiProgram(source);
      expect(program.valid).toBe(true);
      expect(program.instructions).toHaveLength(6);
    });
  });
});
