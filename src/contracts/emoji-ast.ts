/**
 * OpenKernel EDU - Emoji AST Contract v1.0
 * TypeScript interfaces for parsed emoji programs
 * 
 * @module contracts/emoji-ast
 * @version 1.0.0
 */

// Re-export stable types from core
export {
    Opcode,
    RegisterID,
    ALL_REGISTERS,
    OPCODE_MAP,
    OPCODE_INFO
} from '../core/types';

// Contract version for compatibility checking
export const EMOJI_AST_VERSION = '1.0.0';

/**
 * Source location for precise error reporting
 */
export interface SourceLocation {
    line: number;
    column: number;
    offset: number;
    length: number;
}

/**
 * Base AST node with location tracking
 */
export interface ASTNode {
    type: string;
    location: SourceLocation;
}

/**
 * Operand types in EmojiASM
 */
export type OperandType = 'number' | 'register' | 'string' | 'label';

/**
 * Typed operand with metadata
 */
export interface Operand {
    type: OperandType;
    value: number | string;
    raw: string;
    location: SourceLocation;
}

/**
 * Single instruction node
 */
export interface InstructionNode extends ASTNode {
    type: 'instruction';
    opcode: string;
    opcodeEmoji: string;
    operands: Operand[];
    comment?: string;
}

/**
 * Label definition (for jump targets)
 */
export interface LabelNode extends ASTNode {
    type: 'label';
    name: string;
}

/**
 * Comment node (preserved for documentation)
 */
export interface CommentNode extends ASTNode {
    type: 'comment';
    text: string;
}

/**
 * Union of all AST node types
 */
export type ProgramNode = InstructionNode | LabelNode | CommentNode;

/**
 * Parse error with suggestions
 */
export interface ParseErrorInfo {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'hint';
    location: SourceLocation;
    suggestion?: string;
    relatedInfo?: Array<{
        message: string;
        location: SourceLocation;
    }>;
}

/**
 * Program metadata for caching and debugging
 */
export interface ProgramMetadata {
    version: string;
    sourceHash: string;
    parseTime: number;
    instructionCount: number;
    usedOpcodes: string[];
    hasLabels: boolean;
    hasComments: boolean;
}

/**
 * Complete parsed program with AST and metadata
 */
export interface EmojiProgram {
    version: typeof EMOJI_AST_VERSION;
    source: string;
    nodes: ProgramNode[];
    instructions: InstructionNode[];
    labels: Map<string, number>;
    errors: ParseErrorInfo[];
    warnings: ParseErrorInfo[];
    metadata: ProgramMetadata;
    valid: boolean;
}

/**
 * Parser configuration options
 */
export interface ParserOptions {
    strict?: boolean;
    allowUnknownEmoji?: boolean;
    maxInstructions?: number;
    collectComments?: boolean;
}

/**
 * Parser result with timing info
 */
export interface ParseResult {
    program: EmojiProgram;
    parseTimeMs: number;
    tokenCount: number;
}

/**
 * Type guard: Check if node is an instruction
 */
export function isInstruction(node: ProgramNode): node is InstructionNode {
    return node.type === 'instruction';
}

/**
 * Type guard: Check if node is a label
 */
export function isLabel(node: ProgramNode): node is LabelNode {
    return node.type === 'label';
}

/**
 * Type guard: Check if node is a comment
 */
export function isComment(node: ProgramNode): node is CommentNode {
    return node.type === 'comment';
}

/**
 * Create a source hash for cache invalidation
 */
export function createSourceHash(source: string): string {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
        const char = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}
