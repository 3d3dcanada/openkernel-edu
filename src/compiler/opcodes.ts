// OpenKernel EDU - Opcode Definitions and Reference
// Complete emoji instruction set reference

import { Opcode, OPCODE_INFO } from '../core/types';

export interface OpcodeCategory {
  name: string;
  emoji: string;
  description: string;
  opcodes: Opcode[];
}

export const OPCODE_CATEGORIES: OpcodeCategory[] = [
  {
    name: 'Data Movement',
    emoji: '📦',
    description: 'Move data between registers and memory',
    opcodes: [Opcode.LOAD, Opcode.STORE, Opcode.COPY],
  },
  {
    name: 'Arithmetic',
    emoji: '🔢',
    description: 'Mathematical operations',
    opcodes: [Opcode.ADD, Opcode.SUB, Opcode.MUL, Opcode.DIV, Opcode.MOD],
  },
  {
    name: 'Logic',
    emoji: '🧠',
    description: 'Bitwise and comparison operations',
    opcodes: [Opcode.AND, Opcode.OR, Opcode.NOT, Opcode.XOR, Opcode.CMP],
  },
  {
    name: 'Control Flow',
    emoji: '🔀',
    description: 'Control program execution path',
    opcodes: [Opcode.JUMP, Opcode.JUMP_IF_ZERO, Opcode.LOOP, Opcode.RETURN, Opcode.CALL],
  },
  {
    name: 'Input/Output',
    emoji: '💬',
    description: 'Communicate with the outside world',
    opcodes: [Opcode.PRINT, Opcode.INPUT],
  },
  {
    name: 'Stack',
    emoji: '📚',
    description: 'Stack operations for subroutines',
    opcodes: [Opcode.PUSH, Opcode.POP],
  },
  {
    name: 'System',
    emoji: '⚙️',
    description: 'System control instructions',
    opcodes: [Opcode.HALT, Opcode.SLEEP, Opcode.NOP],
  },
];

export function getOpcodeReference(): { emoji: string; name: string; description: string; usage: string }[] {
  return Object.entries(OPCODE_INFO).map(([emoji, info]) => ({
    emoji,
    name: info.name,
    description: info.description,
    usage: generateUsage(emoji as Opcode, info),
  }));
}

function generateUsage(opcode: Opcode, info: typeof OPCODE_INFO[Opcode]): string {
  switch (opcode) {
    case Opcode.LOAD:  return `${opcode} 42        # Load 42 into R0`;
    case Opcode.STORE: return `${opcode} R0 100    # Store R0 at address 100`;
    case Opcode.COPY:  return `${opcode} R0 R1     # Copy R0 to R1`;
    case Opcode.ADD:   return `${opcode} 5         # R0 = R0 + 5`;
    case Opcode.SUB:   return `${opcode} 3         # R0 = R0 - 3`;
    case Opcode.MUL:   return `${opcode} 2         # R0 = R0 * 2`;
    case Opcode.DIV:   return `${opcode} 4         # R0 = R0 / 4`;
    case Opcode.MOD:   return `${opcode} 3         # R0 = R0 % 3`;
    case Opcode.JUMP:  return `${opcode} 0         # Jump to line 0`;
    case Opcode.JUMP_IF_ZERO: return `${opcode} 5  # Jump to line 5 if R0 = 0`;
    case Opcode.LOOP:  return `${opcode} 10        # Repeat next block 10 times`;
    case Opcode.PRINT: return `${opcode}            # Print R0 value`;
    case Opcode.HALT:  return `${opcode}            # Stop program`;
    default: return `${opcode}`;
  }
}
