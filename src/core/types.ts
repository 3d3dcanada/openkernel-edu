// OpenKernel EDU - Core Type Definitions
// The heart of the emoji assembly language

export type RegisterID = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';

export const ALL_REGISTERS: RegisterID[] = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];

export enum Opcode {
  // Data Movement
  LOAD = '📥',
  STORE = '💾',
  COPY = '📋',

  // Arithmetic
  ADD = '➕',
  SUB = '➖',
  MUL = '✖️',
  DIV = '➗',
  MOD = '📊',

  // Logic
  AND = '🔀',
  OR = '🔃',
  NOT = '❌',
  XOR = '🔄',

  // Comparison
  CMP = '⚖️',

  // Control Flow
  JUMP = '⏭️',
  JUMP_IF_ZERO = '❓',
  LOOP = '🔁',
  RETURN = '🛑',
  CALL = '📞',

  // I/O
  PRINT = '🖨️',
  INPUT = '📲',

  // Stack
  PUSH = '⬆️',
  POP = '⬇️',

  // System
  HALT = '⏹️',
  SLEEP = '💤',
  NOP = '⏸️',
}

export interface Instruction {
  opcode: Opcode;
  operands: (number | string | RegisterID)[];
  line: number;
  raw: string;
}

export interface CPUState {
  registers: Record<RegisterID, number>;
  programCounter: number;
  stackPointer: number;
  flags: {
    zero: boolean;
    negative: boolean;
    overflow: boolean;
  };
  halted: boolean;
  cycleCount: number;
}

export interface MemoryState {
  data: Uint8Array;
  size: number;
  lastAccessed: number | null;
  lastWritten: number | null;
}

export interface VMState {
  cpu: CPUState;
  memory: MemoryState;
  stack: number[];
  output: string[];
  input: string[];
  error: string | null;
  running: boolean;
  paused: boolean;
}

export interface ExecutionEvent {
  type: 'instruction_executed' | 'register_changed' | 'memory_written' | 'output_produced' | 'error' | 'halted';
  instruction?: Instruction;
  register?: RegisterID;
  address?: number;
  value?: number | string;
  timestamp: number;
}

export interface ParseError {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
  raw: string;
}

export interface Program {
  instructions: Instruction[];
  source: string;
  errors: ParseError[];
  valid: boolean;
}

export const OPCODE_MAP: Record<string, Opcode> = {};
for (const [key, value] of Object.entries(Opcode)) {
  OPCODE_MAP[value] = Opcode[key as keyof typeof Opcode];
}

export const OPCODE_INFO: Record<Opcode, { name: string; description: string; operands: number; category: string }> = {
  [Opcode.LOAD]:         { name: 'LOAD',         description: 'Load value into register',    operands: 1, category: 'data' },
  [Opcode.STORE]:        { name: 'STORE',        description: 'Store register to memory',    operands: 2, category: 'data' },
  [Opcode.COPY]:         { name: 'COPY',         description: 'Copy register to register',   operands: 2, category: 'data' },
  [Opcode.ADD]:          { name: 'ADD',           description: 'Add value to R0',             operands: 1, category: 'arithmetic' },
  [Opcode.SUB]:          { name: 'SUB',           description: 'Subtract value from R0',      operands: 1, category: 'arithmetic' },
  [Opcode.MUL]:          { name: 'MUL',           description: 'Multiply R0 by value',        operands: 1, category: 'arithmetic' },
  [Opcode.DIV]:          { name: 'DIV',           description: 'Divide R0 by value',          operands: 1, category: 'arithmetic' },
  [Opcode.MOD]:          { name: 'MOD',           description: 'R0 modulo value',             operands: 1, category: 'arithmetic' },
  [Opcode.AND]:          { name: 'AND',           description: 'Bitwise AND',                 operands: 1, category: 'logic' },
  [Opcode.OR]:           { name: 'OR',            description: 'Bitwise OR',                  operands: 1, category: 'logic' },
  [Opcode.NOT]:          { name: 'NOT',           description: 'Bitwise NOT of R0',           operands: 0, category: 'logic' },
  [Opcode.XOR]:          { name: 'XOR',           description: 'Bitwise XOR',                 operands: 1, category: 'logic' },
  [Opcode.CMP]:          { name: 'CMP',           description: 'Compare R0 with value',       operands: 1, category: 'logic' },
  [Opcode.JUMP]:         { name: 'JUMP',          description: 'Jump to address',             operands: 1, category: 'control' },
  [Opcode.JUMP_IF_ZERO]: { name: 'JUMP_IF_ZERO',  description: 'Jump if R0 is zero',         operands: 1, category: 'control' },
  [Opcode.LOOP]:         { name: 'LOOP',          description: 'Loop N times',                operands: 1, category: 'control' },
  [Opcode.RETURN]:       { name: 'RETURN',        description: 'Return from subroutine',      operands: 0, category: 'control' },
  [Opcode.CALL]:         { name: 'CALL',          description: 'Call subroutine at address',   operands: 1, category: 'control' },
  [Opcode.PRINT]:        { name: 'PRINT',         description: 'Print R0 value',              operands: 0, category: 'io' },
  [Opcode.INPUT]:        { name: 'INPUT',         description: 'Read input into R0',           operands: 0, category: 'io' },
  [Opcode.PUSH]:         { name: 'PUSH',          description: 'Push R0 onto stack',           operands: 0, category: 'stack' },
  [Opcode.POP]:          { name: 'POP',           description: 'Pop stack into R0',            operands: 0, category: 'stack' },
  [Opcode.HALT]:         { name: 'HALT',          description: 'Stop execution',               operands: 0, category: 'system' },
  [Opcode.SLEEP]:        { name: 'SLEEP',         description: 'Pause execution (ms)',          operands: 1, category: 'system' },
  [Opcode.NOP]:          { name: 'NOP',           description: 'No operation',                  operands: 0, category: 'system' },
};
