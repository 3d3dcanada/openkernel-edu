// OpenKernel EDU - Emoji Program Parser
// Converts tokenized emoji source into executable AST

import { Instruction, Opcode, Program, ParseError, RegisterID, ALL_REGISTERS, OPCODE_INFO } from '../core/types';
import { tokenize, Token, getOpcodeFromEmoji } from './tokenizer';

export function parseEmojiProgram(source: string): Program {
  const tokens = tokenize(source);
  const instructions: Instruction[] = [];
  const errors: ParseError[] = [];

  let currentLine = 1;
  let lineTokens: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'newline') {
      if (lineTokens.length > 0) {
        const result = parseLine(lineTokens, currentLine, source.split('\n')[currentLine - 1] || '');
        if (result.instruction) {
          instructions.push(result.instruction);
        }
        if (result.error) {
          errors.push(result.error);
        }
      }
      lineTokens = [];
      currentLine = token.line + 1;
    } else if (token.type !== 'comment') {
      lineTokens.push(token);
    }
  }

  // Handle last line (no trailing newline)
  if (lineTokens.length > 0) {
    const result = parseLine(lineTokens, lineTokens[0].line, source.split('\n')[lineTokens[0].line - 1] || '');
    if (result.instruction) instructions.push(result.instruction);
    if (result.error) errors.push(result.error);
  }

  return {
    instructions,
    source,
    errors,
    valid: errors.length === 0,
  };
}

interface ParseLineResult {
  instruction?: Instruction;
  error?: ParseError;
}

function parseLine(tokens: Token[], line: number, raw: string): ParseLineResult {
  const opcodeToken = tokens.find(t => t.type === 'opcode');

  if (!opcodeToken) {
    const unknowns = tokens.filter(t => t.type === 'unknown');
    if (unknowns.length > 0) {
      const suggestion = findClosestEmoji(unknowns[0].value);
      return {
        error: {
          line,
          column: unknowns[0].column,
          message: `Unknown instruction: "${unknowns[0].value}"`,
          suggestion: suggestion ? `Did you mean ${suggestion}?` : 'Check the opcode reference for valid emoji instructions.',
          raw,
        },
      };
    }
    return {};
  }

  const opcode = getOpcodeFromEmoji(opcodeToken.value);
  if (!opcode) {
    return {
      error: {
        line,
        column: opcodeToken.column,
        message: `Unrecognized emoji opcode: "${opcodeToken.value}"`,
        raw,
      },
    };
  }

  const operandTokens = tokens.filter(t => t.type === 'number' || t.type === 'register' || t.type === 'string');
  const operands = operandTokens.map(t => {
    if (t.type === 'number') return parseInt(t.value, 10);
    if (t.type === 'register') return t.value as RegisterID;
    return t.value;
  });

  // Validate operand count
  const info = OPCODE_INFO[opcode];
  if (info && operands.length < info.operands) {
    if (info && operands.length < info.operands) {
      if (opcode !== Opcode.STORE && opcode !== Opcode.COPY) {
        return {
          error: {
            line,
            column: opcodeToken.column,
            message: `Opcode ${info.name} requires ${info.operands} operands, but got ${operands.length}.`,
            suggestion: `Usage: ${opcode} ${'[value] '.repeat(info.operands).trim()}`,
            raw
          }
        };
      }
    }
  }

  return {
    instruction: {
      opcode,
      operands,
      line,
      raw,
    },
  };
}

function findClosestEmoji(input: string): string | null {
  const emojiList = Object.values(Opcode);
  // Simple heuristic: check if any emoji visually "contains" part of input
  for (const emoji of emojiList) {
    if (input.includes(emoji) || emoji.includes(input)) {
      return emoji;
    }
  }
  return null;
}

export function validateProgram(program: Program): ParseError[] {
  const errors: ParseError[] = [...program.errors];

  // Check for HALT instruction
  const hasHalt = program.instructions.some(i => i.opcode === Opcode.HALT);
  if (!hasHalt && program.instructions.length > 0) {
    errors.push({
      line: program.instructions.length,
      column: 0,
      message: 'Program has no HALT instruction. It may not terminate properly.',
      suggestion: 'Add ⏹️ at the end of your program.',
      raw: '',
    });
  }

  // Check jump targets
  for (const inst of program.instructions) {
    if (inst.opcode === Opcode.JUMP || inst.opcode === Opcode.JUMP_IF_ZERO || inst.opcode === Opcode.CALL) {
      const target = Number(inst.operands[0]);
      if (target < 0 || target >= program.instructions.length) {
        errors.push({
          line: inst.line,
          column: 0,
          message: `Jump target ${target} is out of bounds (valid: 0-${program.instructions.length - 1})`,
          raw: inst.raw,
        });
      }
    }
  }

  return errors;
}
