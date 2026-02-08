// OpenKernel EDU - Program Validator
// Provides friendly, educational error messages

import { Program, ParseError, Opcode, OPCODE_INFO } from '../core/types';

export interface ValidationResult {
  valid: boolean;
  errors: ParseError[];
  warnings: string[];
  stats: {
    instructionCount: number;
    uniqueOpcodes: number;
    hasLoops: boolean;
    hasConditionals: boolean;
    estimatedCycles: number;
  };
}

export function validateAndAnalyze(program: Program): ValidationResult {
  const errors: ParseError[] = [...program.errors];
  const warnings: string[] = [];
  const uniqueOpcodes = new Set(program.instructions.map(i => i.opcode));

  // Check for empty program
  if (program.instructions.length === 0) {
    warnings.push('Your program is empty! Try adding some emoji instructions.');
  }

  // Check for HALT
  const hasHalt = program.instructions.some(i => i.opcode === Opcode.HALT);
  if (program.instructions.length > 0 && !hasHalt) {
    warnings.push('Tip: Add ⏹️ (HALT) at the end to properly stop your program.');
  }

  // Check for potential infinite loops
  const hasLoop = program.instructions.some(i => i.opcode === Opcode.LOOP);
  const hasJump = program.instructions.some(i => i.opcode === Opcode.JUMP);
  if (hasJump) {
    for (const inst of program.instructions) {
      if (inst.opcode === Opcode.JUMP) {
        const target = Number(inst.operands[0]);
        if (target <= inst.line - 1) {
          warnings.push(`Line ${inst.line}: Backward jump detected. Make sure your loop has an exit condition!`);
        }
      }
    }
  }

  // Estimate cycles
  let estimatedCycles = 0;
  for (const inst of program.instructions) {
    if (inst.opcode === Opcode.LOOP) {
      estimatedCycles += Number(inst.operands[0]) || 1;
    } else {
      estimatedCycles++;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      instructionCount: program.instructions.length,
      uniqueOpcodes: uniqueOpcodes.size,
      hasLoops: hasLoop,
      hasConditionals: program.instructions.some(i => i.opcode === Opcode.JUMP_IF_ZERO),
      estimatedCycles,
    },
  };
}

export function getFriendlyError(error: ParseError): string {
  const emoji = '💡';
  let message = `${emoji} Line ${error.line}: ${error.message}`;
  if (error.suggestion) {
    message += `\n   ${error.suggestion}`;
  }
  return message;
}

export function getOpcodeHelp(opcode: Opcode): string {
  const info = OPCODE_INFO[opcode];
  if (!info) return 'Unknown instruction';
  return `${opcode} ${info.name}: ${info.description}`;
}
