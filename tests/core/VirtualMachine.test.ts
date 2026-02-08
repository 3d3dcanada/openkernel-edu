import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualMachine } from '../../src/core/VirtualMachine';
import { Instruction, Opcode } from '../../src/core/types';

describe('VirtualMachine', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    vm = new VirtualMachine();
  });

  describe('Basic Operations', () => {
    it('should initialize with zeroed registers', () => {
      const state = vm.getCPU();
      expect(state.registers.R0).toBe(0);
      expect(state.registers.R7).toBe(0);
      expect(state.programCounter).toBe(0);
      expect(state.halted).toBe(false);
    });

    it('should execute COPY instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42, 'R0'], line: 1, raw: '' },
        { opcode: Opcode.COPY, operands: ['R0', 'R1'], line: 2, raw: '' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '' }
      ]);
      vm.run();
      expect(vm.getCPU().registers.R1).toBe(42);
    });

    it('should execute STORE instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [99], line: 1, raw: '' },
        { opcode: Opcode.STORE, operands: [50], line: 2, raw: '' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '' }
      ]);
      vm.run();
      expect(vm.getMemory().read(50)).toBe(99);
    });

    it('should execute LOAD instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.HALT, operands: [], line: 2, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(42);
    });

    it('should execute ADD instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.ADD, operands: [5], line: 2, raw: '➕ 5' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(15);
    });

    it('should execute SUB instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [20], line: 1, raw: '📥 20' },
        { opcode: Opcode.SUB, operands: [8], line: 2, raw: '➖ 8' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(12);
    });

    it('should execute MUL instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [6], line: 1, raw: '📥 6' },
        { opcode: Opcode.MUL, operands: [7], line: 2, raw: '✖️ 7' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(42);
    });

    it('should execute DIV instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.DIV, operands: [6], line: 2, raw: '➗ 6' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(7);
    });

    it('should throw on division by zero', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.DIV, operands: [0], line: 2, raw: '➗ 0' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getState().error).toContain('Division by zero');
    });

    it('should execute MOD instruction', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.MOD, operands: [3], line: 2, raw: '📊 3' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(1);
    });
  });

  describe('PRINT and Output', () => {
    it('should produce output with PRINT', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.PRINT, operands: [], line: 2, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['42']);
    });

    it('should produce multiple outputs', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.PRINT, operands: [], line: 2, raw: '🖨️' },
        { opcode: Opcode.ADD, operands: [5], line: 3, raw: '➕ 5' },
        { opcode: Opcode.PRINT, operands: [], line: 4, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 5, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['10', '15']);
    });
  });



  describe('Control Flow', () => {
    it('should execute LOOP', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [0], line: 1, raw: '' },      // R0 = 0
        { opcode: Opcode.LOOP, operands: [3], line: 2, raw: '' },      // Loop 3 times
        { opcode: Opcode.ADD, operands: [1], line: 3, raw: '' },       // R0 += 1
        { opcode: Opcode.RETURN, operands: [], line: 4, raw: '' },     // End loop
        { opcode: Opcode.HALT, operands: [], line: 5, raw: '' }
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(3);
    });

    it('should execute JUMP', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [1], line: 1, raw: '📥 1' },
        { opcode: Opcode.JUMP, operands: [3], line: 2, raw: '⏭️ 3' },
        { opcode: Opcode.LOAD, operands: [99], line: 3, raw: '📥 99' }, // skipped
        { opcode: Opcode.PRINT, operands: [], line: 4, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 5, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['1']);
    });

    it('should execute JUMP_IF_ZERO when zero', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [0], line: 1, raw: '📥 0' },
        { opcode: Opcode.JUMP_IF_ZERO, operands: [3], line: 2, raw: '❓ 3' },
        { opcode: Opcode.LOAD, operands: [99], line: 3, raw: '📥 99' }, // skipped
        { opcode: Opcode.PRINT, operands: [], line: 4, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 5, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['0']);
    });

    it('should NOT jump when not zero', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [5], line: 1, raw: '📥 5' },
        { opcode: Opcode.JUMP_IF_ZERO, operands: [4], line: 2, raw: '❓ 4' },
        { opcode: Opcode.LOAD, operands: [99], line: 3, raw: '📥 99' },
        { opcode: Opcode.PRINT, operands: [], line: 4, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 5, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['99']);
    });
  });

  describe('Stack Operations', () => {
    it('should PUSH and POP values', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.PUSH, operands: [], line: 2, raw: '⬆️' },
        { opcode: Opcode.LOAD, operands: [20], line: 3, raw: '📥 20' },
        { opcode: Opcode.PUSH, operands: [], line: 4, raw: '⬆️' },
        { opcode: Opcode.POP, operands: [], line: 5, raw: '⬇️' },
        { opcode: Opcode.PRINT, operands: [], line: 6, raw: '🖨️' },
        { opcode: Opcode.POP, operands: [], line: 7, raw: '⬇️' },
        { opcode: Opcode.PRINT, operands: [], line: 8, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 9, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['20', '10']);
    });

    it('should error on stack underflow', () => {
      vm.loadProgram([
        { opcode: Opcode.POP, operands: [], line: 1, raw: '⬇️' },
        { opcode: Opcode.HALT, operands: [], line: 2, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getState().error).toContain('Stack underflow');
    });
  });

  describe('Logic Operations', () => {
    it('should execute AND', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [12], line: 1, raw: '📥 12' },
        { opcode: Opcode.AND, operands: [10], line: 2, raw: '🔀 10' },
        { opcode: Opcode.PRINT, operands: [], line: 3, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 4, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['8']); // 1100 & 1010 = 1000
    });

    it('should execute OR', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [5], line: 1, raw: '' },  // 0101
        { opcode: Opcode.OR, operands: [3], line: 2, raw: '' },    // 0011
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '' }
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(7); // 0111
    });

    it('should execute XOR', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [5], line: 1, raw: '' },  // 0101
        { opcode: Opcode.XOR, operands: [3], line: 2, raw: '' },   // 0011
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '' }
      ]);
      vm.run();
      expect(vm.getCPU().registers.R0).toBe(6); // 0110
    });

    it('should execute CMP', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '' },
        { opcode: Opcode.CMP, operands: [10], line: 2, raw: '' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '' }
      ]);
      vm.run();
      expect(vm.getCPU().flags.zero).toBe(true);
    });

    it('should execute NOT', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [0], line: 1, raw: '📥 0' },
        { opcode: Opcode.NOT, operands: [], line: 2, raw: '❌' },
        { opcode: Opcode.PRINT, operands: [], line: 3, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 4, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['-1']); // ~0 = -1
    });
  });

  describe('Flags', () => {
    it('should set zero flag when result is zero', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [5], line: 1, raw: '📥 5' },
        { opcode: Opcode.SUB, operands: [5], line: 2, raw: '➖ 5' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().flags.zero).toBe(true);
    });

    it('should set negative flag when result is negative', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [3], line: 1, raw: '📥 3' },
        { opcode: Opcode.SUB, operands: [10], line: 2, raw: '➖ 10' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getCPU().flags.negative).toBe(true);
    });
  });

  describe('Reset', () => {
    it('should reset all state', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.PRINT, operands: [], line: 2, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['42']);

      vm.reset();
      expect(vm.getCPU().registers.R0).toBe(0);
      expect(vm.getOutput()).toEqual([]);
      expect(vm.getCPU().halted).toBe(false);
    });
  });

  describe('Step Mode', () => {
    it('should step one instruction at a time', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.ADD, operands: [5], line: 2, raw: '➕ 5' },
        { opcode: Opcode.PRINT, operands: [], line: 3, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 4, raw: '⏹️' },
      ]);

      vm.step(); // LOAD 10
      expect(vm.getCPU().registers.R0).toBe(10);
      expect(vm.getCPU().programCounter).toBe(1);

      vm.step(); // ADD 5
      expect(vm.getCPU().registers.R0).toBe(15);

      vm.step(); // PRINT
      expect(vm.getOutput()).toEqual(['15']);

      const continued = vm.step(); // HALT
      expect(continued).toBe(false);
      expect(vm.getCPU().halted).toBe(true);
    });
  });

  describe('Execution Limit', () => {
    it('should halt after max cycles', () => {
      // Create an infinite loop
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [1], line: 1, raw: '📥 1' },
        { opcode: Opcode.JUMP, operands: [0], line: 2, raw: '⏭️ 0' },
      ]);
      vm.run();
      expect(vm.getState().error).toContain('Execution limit');
    });
  });

  describe('Complete Programs', () => {
    it('should run Hello World (LOAD, PRINT, HALT)', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [42], line: 1, raw: '📥 42' },
        { opcode: Opcode.PRINT, operands: [], line: 2, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 3, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['42']);
    });

    it('should run a simple calculator (10 + 5 = 15)', () => {
      vm.loadProgram([
        { opcode: Opcode.LOAD, operands: [10], line: 1, raw: '📥 10' },
        { opcode: Opcode.ADD, operands: [5], line: 2, raw: '➕ 5' },
        { opcode: Opcode.PRINT, operands: [], line: 3, raw: '🖨️' },
        { opcode: Opcode.HALT, operands: [], line: 4, raw: '⏹️' },
      ]);
      vm.run();
      expect(vm.getOutput()).toEqual(['15']);
    });
  });
});
