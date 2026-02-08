// OpenKernel EDU - Compiler
// Compiles parsed programs with optimization passes

import { Program, Instruction, Opcode } from '../core/types';
import { parseEmojiProgram, validateProgram } from '../parser/parser';
import { validateAndAnalyze, ValidationResult } from '../parser/validator';

export interface CompilationResult {
  program: Program;
  validation: ValidationResult;
  optimized: boolean;
  compiledAt: number;
}

export function compile(source: string): CompilationResult {
  const program = parseEmojiProgram(source);
  const validation = validateAndAnalyze(program);

  return {
    program,
    validation,
    optimized: false,
    compiledAt: Date.now(),
  };
}

export function compileAndValidate(source: string): CompilationResult {
  const result = compile(source);
  const extraErrors = validateProgram(result.program);
  result.validation.errors.push(...extraErrors);
  result.validation.valid = result.validation.errors.length === 0;
  return result;
}

export function formatProgram(instructions: Instruction[]): string {
  return instructions.map(inst => {
    const ops = inst.operands.length > 0 ? ' ' + inst.operands.join(' ') : '';
    return `${inst.opcode}${ops}`;
  }).join('\n');
}

export function decompile(instructions: Instruction[]): string {
  return instructions.map((inst, idx) => {
    const ops = inst.operands.length > 0 ? ' ' + inst.operands.join(' ') : '';
    const comment = getInstructionComment(inst);
    return `${inst.opcode}${ops}${comment ? '  # ' + comment : ''}`;
  }).join('\n');
}

function getInstructionComment(inst: Instruction): string {
  switch (inst.opcode) {
    case Opcode.LOAD: return `Load ${inst.operands[0]} into R0`;
    case Opcode.ADD: return `R0 = R0 + ${inst.operands[0]}`;
    case Opcode.SUB: return `R0 = R0 - ${inst.operands[0]}`;
    case Opcode.MUL: return `R0 = R0 * ${inst.operands[0]}`;
    case Opcode.DIV: return `R0 = R0 / ${inst.operands[0]}`;
    case Opcode.PRINT: return 'Print R0';
    case Opcode.HALT: return 'Stop';
    case Opcode.LOOP: return `Repeat ${inst.operands[0]} times`;
    case Opcode.JUMP: return `Go to line ${inst.operands[0]}`;
    case Opcode.JUMP_IF_ZERO: return `If R0=0, go to line ${inst.operands[0]}`;
    default: return '';
  }
}
