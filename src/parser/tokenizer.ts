// OpenKernel EDU - Emoji Tokenizer
// Converts raw emoji source code into tokens

import { Opcode, OPCODE_MAP } from '../core/types';

export interface Token {
  type: 'opcode' | 'number' | 'register' | 'string' | 'comment' | 'newline' | 'unknown';
  value: string;
  line: number;
  column: number;
}

const REGISTER_PATTERN = /^R[0-7]$/;
const NUMBER_PATTERN = /^-?\d+$/;
const STRING_PATTERN = /^"[^"]*"$/;

const EMOJI_OPCODES = new Set(Object.values(Opcode));

function isEmojiOpcode(token: string): boolean {
  return EMOJI_OPCODES.has(token as Opcode);
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const lines = source.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    if (!line.trim()) continue;

    // Handle comments
    const commentIdx = line.indexOf('#');
    const codePart = commentIdx >= 0 ? line.substring(0, commentIdx) : line;
    if (commentIdx >= 0) {
      tokens.push({
        type: 'comment',
        value: line.substring(commentIdx),
        line: lineIdx + 1,
        column: commentIdx + 1,
      });
    }

    if (!codePart.trim()) continue;

    // Segment the code part using Unicode-aware splitting
    const segments = segmentEmojiLine(codePart);

    let column = 1;
    for (const seg of segments) {
      const trimmed = seg.trim();
      if (!trimmed) {
        column += seg.length;
        continue;
      }

      if (isEmojiOpcode(trimmed)) {
        tokens.push({ type: 'opcode', value: trimmed, line: lineIdx + 1, column });
      } else if (REGISTER_PATTERN.test(trimmed)) {
        tokens.push({ type: 'register', value: trimmed, line: lineIdx + 1, column });
      } else if (NUMBER_PATTERN.test(trimmed)) {
        tokens.push({ type: 'number', value: trimmed, line: lineIdx + 1, column });
      } else if (STRING_PATTERN.test(trimmed)) {
        tokens.push({ type: 'string', value: trimmed.slice(1, -1), line: lineIdx + 1, column });
      } else if (trimmed.length > 0) {
        tokens.push({ type: 'unknown', value: trimmed, line: lineIdx + 1, column });
      }

      column += seg.length;
    }

    tokens.push({ type: 'newline', value: '\n', line: lineIdx + 1, column });
  }

  return tokens;
}

function segmentEmojiLine(line: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inString = false;

  const chars = Array.from(line);
  let i = 0;

  while (i < chars.length) {
    const char = chars[i];

    if (char === '"') {
      if (inString) {
        current += char;
        segments.push(current);
        current = '';
        inString = false;
        i++;
        continue;
      } else {
        if (current.trim()) segments.push(current);
        current = char;
        inString = true;
        i++;
        continue;
      }
    }

    if (inString) {
      current += char;
      i++;
      continue;
    }

    if (char === ' ' || char === '\t') {
      if (current.trim()) segments.push(current);
      current = '';
      i++;
      continue;
    }

    // Check for multi-codepoint emoji (with variation selectors, ZWJ sequences)
    let emojiStr = '';
    let j = i;
    while (j < chars.length) {
      const testStr = emojiStr + chars[j];
      if (isEmojiOpcode(testStr)) {
        emojiStr = testStr;
        j++;
        // Check if adding the next char still forms a valid opcode
        if (j < chars.length && isEmojiOpcode(testStr + chars[j])) {
          continue;
        }
        break;
      } else if (emojiStr === '' && isEmojiChar(chars[j])) {
        emojiStr += chars[j];
        j++;
      } else {
        break;
      }
    }

    if (emojiStr && isEmojiOpcode(emojiStr)) {
      if (current.trim()) segments.push(current);
      current = '';
      segments.push(emojiStr);
      i = j;
      continue;
    }

    current += char;
    i++;
  }

  if (current.trim()) segments.push(current);
  return segments;
}

function isEmojiChar(char: string): boolean {
  const code = char.codePointAt(0) || 0;
  return code > 0x1F000 || (code >= 0x2600 && code <= 0x27BF) || char === '\uFE0F';
}

export function getOpcodeFromEmoji(emoji: string): Opcode | null {
  return OPCODE_MAP[emoji] || null;
}
