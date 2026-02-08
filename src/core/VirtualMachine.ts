// OpenKernel EDU - Virtual Machine Execution Engine
// The beating heart: executes emoji programs instruction by instruction

import { Instruction, CPUState, VMState, Opcode, RegisterID, ALL_REGISTERS, ExecutionEvent } from './types';
import { Memory } from './Memory';

const MAX_CYCLES = 100000;

export class VirtualMachine {
  private cpu: CPUState;
  private memory: Memory;
  private stack: number[] = [];
  private output: string[] = [];
  private inputBuffer: string[] = [];
  private error: string | null = null;
  private program: Instruction[] = [];
  private eventListeners: ((event: ExecutionEvent) => void)[] = [];
  private loopStack: { start: number; remaining: number }[] = [];
  private fastMode: boolean = false;
  private optimizedProgram: { opcode: Opcode; operands: number[]; isReg: boolean[] }[] = [];
  private registerMap: Record<RegisterID, number> = { R0: 0, R1: 1, R2: 2, R3: 3, R4: 4, R5: 5, R6: 6, R7: 7 };
  private registerArray: number[] = new Array(8).fill(0);

  constructor() {
    this.memory = new Memory(256);
    this.cpu = this.createInitialCPU();
  }

  private createInitialCPU(): CPUState {
    this.registerArray = new Array(8).fill(0);
    return {
      registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0 },
      programCounter: 0,
      stackPointer: 255,
      flags: { zero: false, negative: false, overflow: false },
      halted: false,
      cycleCount: 0,
    };
  }

  private emit(event: ExecutionEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  onEvent(listener: (event: ExecutionEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  loadProgram(instructions: Instruction[]): void {
    this.program = instructions;
    this.optimizedProgram = instructions.map(inst => ({
      opcode: inst.opcode,
      operands: inst.operands.map(op => {
        if (typeof op === 'string' && this.registerMap[op as RegisterID] !== undefined) {
          return this.registerMap[op as RegisterID];
        }
        return Number(op);
      }),
      isReg: inst.operands.map(op => typeof op === 'string' && this.registerMap[op as RegisterID] !== undefined)
    }));
    this.reset();
  }

  provideInput(value: string): void {
    this.inputBuffer.push(value);
  }

  reset(): void {
    this.cpu = this.createInitialCPU();
    this.memory.clear();
    this.stack = [];
    this.output = [];
    this.error = null;
    this.loopStack = [];
  }

  private resolveOperand(operand: number | string | RegisterID): number {
    if (typeof operand === 'string' && ALL_REGISTERS.includes(operand as RegisterID)) {
      return this.cpu.registers[operand as RegisterID];
    }
    return Number(operand);
  }

  private setRegister(reg: RegisterID, value: number): void {
    const idx = this.registerMap[reg];
    this.registerArray[idx] = value;
    this.cpu.registers[reg] = value;
    this.updateFlags(value);
    if (!this.fastMode) {
      this.emit({ type: 'register_changed', register: reg, value, timestamp: Date.now() });
    }
  }

  private updateFlags(value: number): void {
    const flags = this.cpu.flags;
    flags.zero = value === 0;
    flags.negative = value < 0;
    flags.overflow = value > 2147483647 || value < -2147483648;
  }

  setFastMode(enabled: boolean): void {
    this.fastMode = enabled;
  }

  step(): boolean {
    if (this.cpu.halted || this.cpu.programCounter >= this.program.length) {
      this.cpu.halted = true;
      this.emit({ type: 'halted', timestamp: Date.now() });
      return false;
    }

    if (this.cpu.cycleCount >= MAX_CYCLES) {
      this.error = `Execution limit reached (${MAX_CYCLES} cycles). Possible infinite loop.`;
      this.cpu.halted = true;
      this.emit({ type: 'error', value: this.error, timestamp: Date.now() });
      return false;
    }

    const optInst = this.optimizedProgram[this.cpu.programCounter];
    this.cpu.cycleCount++;

    try {
      this.executeOptimizedInstruction(optInst);
      if (!this.fastMode) {
        this.emit({ type: 'instruction_executed', instruction: this.program[this.cpu.programCounter], timestamp: Date.now() });
      }
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.cpu.halted = true;
      this.emit({ type: 'error', value: this.error, timestamp: Date.now() });
      return false;
    }

    return !this.cpu.halted;
  }

  private executeOptimizedInstruction(inst: { opcode: Opcode; operands: number[]; isReg: boolean[] }): void {
    const { opcode, operands, isReg } = inst;
    const cpu = this.cpu;
    const regs = this.registerArray;

    const resolve = (idx: number) => isReg[idx] ? regs[operands[idx]] : operands[idx];

    switch (opcode) {
      case Opcode.LOAD: {
        const val = resolve(0);
        const regIdx = operands[1] !== undefined ? operands[1] : 0;
        regs[regIdx] = val;
        this.updateFlags(val);
        cpu.programCounter++;
        break;
      }
      case Opcode.STORE: {
        const address = isReg[1] ? regs[operands[1]] : (operands[1] !== undefined ? operands[1] : (isReg[0] ? regs[operands[0]] : operands[0]));
        const value = operands[1] !== undefined ? (isReg[0] ? regs[operands[0]] : operands[0]) : regs[0];
        this.memory.write(address, value);
        if (!this.fastMode) {
          this.emit({ type: 'memory_written', address, value, timestamp: Date.now() });
        }
        cpu.programCounter++;
        break;
      }
      case Opcode.ADD: {
        const val = resolve(0);
        regs[0] += val;
        this.updateFlags(regs[0]);
        cpu.programCounter++;
        break;
      }
      case Opcode.SUB: {
        const val = resolve(0);
        regs[0] -= val;
        this.updateFlags(regs[0]);
        cpu.programCounter++;
        break;
      }
      case Opcode.MUL: {
        const val = resolve(0);
        regs[0] *= val;
        this.updateFlags(regs[0]);
        cpu.programCounter++;
        break;
      }
      case Opcode.DIV: {
        const val = resolve(0);
        if (val === 0) throw new Error('Division by zero');
        regs[0] = Math.floor(regs[0] / val);
        this.updateFlags(regs[0]);
        cpu.programCounter++;
        break;
      }
      case Opcode.JUMP: {
        cpu.programCounter = resolve(0);
        break;
      }
      case Opcode.JUMP_IF_ZERO: {
        if (cpu.flags.zero) cpu.programCounter = resolve(0);
        else cpu.programCounter++;
        break;
      }
      case Opcode.LOOP: {
        const count = resolve(0);
        if (this.loopStack.length > 0 && this.loopStack[this.loopStack.length - 1].start === cpu.programCounter) {
          const loop = this.loopStack[this.loopStack.length - 1];
          loop.remaining--;
          if (loop.remaining <= 0) {
            this.loopStack.pop();
            cpu.programCounter++;
          } else {
            cpu.programCounter++;
          }
        } else {
          this.loopStack.push({ start: cpu.programCounter, remaining: count });
          cpu.programCounter++;
        }
        break;
      }
      case Opcode.RETURN: {
        if (this.loopStack.length > 0) {
          const loop = this.loopStack[this.loopStack.length - 1];
          if (loop.remaining > 1) cpu.programCounter = loop.start;
          else { this.loopStack.pop(); cpu.programCounter++; }
        } else if (this.stack.length > 0) {
          cpu.programCounter = this.stack.pop()!;
        } else cpu.programCounter++;
        break;
      }
      case Opcode.HALT: {
        cpu.halted = true;
        break;
      }
      default: {
        // Fallback to slow execution for unhandled opcodes in fast mode
        this.executeInstruction(this.program[cpu.programCounter]);
        return;
      }
    }

    // Sync back to CPU state registers for compatibility
    if (!this.fastMode) {
      ALL_REGISTERS.forEach((name, i) => { cpu.registers[name] = regs[i]; });
    }
  }

  private executeInstruction(inst: Instruction): void {
    const ops = inst.operands;

    switch (inst.opcode) {
      // === DATA MOVEMENT ===
      case Opcode.LOAD: {
        const targetReg = (typeof ops[1] === 'string' && ALL_REGISTERS.includes(ops[1] as RegisterID))
          ? ops[1] as RegisterID : 'R0';
        const value = this.resolveOperand(ops[0]);
        this.setRegister(targetReg, value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.STORE: {
        const address = this.resolveOperand(ops[1] !== undefined ? ops[1] : ops[0]);
        const value = ops[1] !== undefined ? this.resolveOperand(ops[0]) : this.cpu.registers.R0;
        this.memory.write(address, value);
        if (!this.fastMode) {
          this.emit({ type: 'memory_written', address, value, timestamp: Date.now() });
        }
        this.cpu.programCounter++;
        break;
      }

      case Opcode.COPY: {
        const srcReg = (typeof ops[0] === 'string' && ALL_REGISTERS.includes(ops[0] as RegisterID))
          ? ops[0] as RegisterID : 'R0';
        const dstReg = (typeof ops[1] === 'string' && ALL_REGISTERS.includes(ops[1] as RegisterID))
          ? ops[1] as RegisterID : 'R1';
        this.setRegister(dstReg, this.cpu.registers[srcReg]);
        this.cpu.programCounter++;
        break;
      }

      // === ARITHMETIC ===
      case Opcode.ADD: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 + value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.SUB: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 - value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.MUL: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 * value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.DIV: {
        const value = this.resolveOperand(ops[0]);
        if (value === 0) throw new Error('Division by zero');
        this.setRegister('R0', Math.floor(this.cpu.registers.R0 / value));
        this.cpu.programCounter++;
        break;
      }

      case Opcode.MOD: {
        const value = this.resolveOperand(ops[0]);
        if (value === 0) throw new Error('Modulo by zero');
        this.setRegister('R0', this.cpu.registers.R0 % value);
        this.cpu.programCounter++;
        break;
      }

      // === LOGIC ===
      case Opcode.AND: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 & value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.OR: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 | value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.NOT: {
        this.setRegister('R0', ~this.cpu.registers.R0);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.XOR: {
        const value = this.resolveOperand(ops[0]);
        this.setRegister('R0', this.cpu.registers.R0 ^ value);
        this.cpu.programCounter++;
        break;
      }

      case Opcode.CMP: {
        const value = this.resolveOperand(ops[0]);
        const result = this.cpu.registers.R0 - value;
        this.updateFlags(result);
        this.cpu.programCounter++;
        break;
      }

      // === CONTROL FLOW ===
      case Opcode.JUMP: {
        const address = this.resolveOperand(ops[0]);
        if (address < 0 || address >= this.program.length) {
          throw new Error(`Jump to invalid address: ${address}`);
        }
        this.cpu.programCounter = address;
        break;
      }

      case Opcode.JUMP_IF_ZERO: {
        const address = this.resolveOperand(ops[0]);
        if (this.cpu.flags.zero) {
          this.cpu.programCounter = address;
        } else {
          this.cpu.programCounter++;
        }
        break;
      }

      case Opcode.LOOP: {
        const count = this.resolveOperand(ops[0]);
        if (this.loopStack.length > 0 && this.loopStack[this.loopStack.length - 1].start === this.cpu.programCounter) {
          const loop = this.loopStack[this.loopStack.length - 1];
          loop.remaining--;
          if (loop.remaining <= 0) {
            this.loopStack.pop();
            this.cpu.programCounter++;
          } else {
            this.cpu.programCounter++;
          }
        } else {
          this.loopStack.push({ start: this.cpu.programCounter, remaining: count });
          this.cpu.programCounter++;
        }
        break;
      }

      case Opcode.RETURN: {
        if (this.loopStack.length > 0) {
          const loop = this.loopStack[this.loopStack.length - 1];
          if (loop.remaining > 1) {
            this.cpu.programCounter = loop.start;
          } else {
            this.loopStack.pop();
            this.cpu.programCounter++;
          }
        } else if (this.stack.length > 0) {
          this.cpu.programCounter = this.stack.pop()!;
        } else {
          this.cpu.programCounter++;
        }
        break;
      }

      case Opcode.CALL: {
        const address = this.resolveOperand(ops[0]);
        this.stack.push(this.cpu.programCounter + 1);
        this.cpu.programCounter = address;
        break;
      }

      // === I/O ===
      case Opcode.PRINT: {
        const value = String(this.cpu.registers.R0);
        this.output.push(value);
        if (!this.fastMode) {
          this.emit({ type: 'output_produced', value, timestamp: Date.now() });
        }
        this.cpu.programCounter++;
        break;
      }

      case Opcode.INPUT: {
        if (this.inputBuffer.length > 0) {
          const val = this.inputBuffer.shift()!;
          this.setRegister('R0', parseInt(val) || 0);
        }
        this.cpu.programCounter++;
        break;
      }

      // === STACK ===
      case Opcode.PUSH: {
        this.stack.push(this.cpu.registers.R0);
        this.cpu.stackPointer--;
        this.cpu.programCounter++;
        break;
      }

      case Opcode.POP: {
        if (this.stack.length === 0) throw new Error('Stack underflow');
        this.setRegister('R0', this.stack.pop()!);
        this.cpu.stackPointer++;
        this.cpu.programCounter++;
        break;
      }

      // === SYSTEM ===
      case Opcode.HALT: {
        this.cpu.halted = true;
        break;
      }

      case Opcode.SLEEP: {
        this.cpu.programCounter++;
        break;
      }

      case Opcode.NOP: {
        this.cpu.programCounter++;
        break;
      }

      default:
        throw new Error(`Unknown opcode: ${inst.opcode}`);
    }
  }

  run(): VMState {
    while (this.step()) {
      // keep stepping
    }
    this.syncRegisters();
    return this.getState();
  }

  private syncRegisters(): void {
    ALL_REGISTERS.forEach((name, i) => {
      this.cpu.registers[name] = this.registerArray[i];
    });
  }

  getState(): VMState {
    return {
      cpu: { ...this.cpu, registers: { ...this.cpu.registers }, flags: { ...this.cpu.flags } },
      memory: this.memory.getState(),
      stack: [...this.stack],
      output: [...this.output],
      input: [...this.inputBuffer],
      error: this.error,
      running: !this.cpu.halted,
      paused: false,
    };
  }

  getOutput(): string[] {
    return [...this.output];
  }

  getCPU(): CPUState {
    return { ...this.cpu, registers: { ...this.cpu.registers }, flags: { ...this.cpu.flags } };
  }

  getMemory(): Memory {
    return this.memory;
  }
}
