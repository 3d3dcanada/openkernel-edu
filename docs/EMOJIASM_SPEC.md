# EmojiASM v1.0 Specification

**OpenKernel EDU Emoji Assembly Language**

Version 1.0.0 | February 2026

---

## 1. Overview

EmojiASM is a visual assembly language designed for teaching computer science fundamentals. It uses emoji characters as opcodes to eliminate language barriers and create an instantly recognizable instruction set.

### Design Goals
- **Universal**: No prior programming experience required
- **Visual**: Emoji opcodes convey meaning at a glance
- **Educational**: Simplified CPU architecture for learning
- **Accessible**: Works in any browser, any language

---

## 2. Execution Model

### 2.1 Registers
8 general-purpose registers: `R0` through `R7`

| Register | Purpose |
|----------|---------|
| R0 | Accumulator (default for most operations) |
| R1-R5 | General purpose |
| R6 | Loop counter (by convention) |
| R7 | Temporary storage (by convention) |

### 2.2 Memory
- **Size**: 256 bytes (addresses 0-255)
- **Word size**: 8-bit values (0-255)
- **Addressing**: Direct addressing only

### 2.3 Stack
- **Type**: LIFO (Last In, First Out)
- **Size**: 256 entries maximum
- **Operations**: PUSH (⬆️), POP (⬇️)

### 2.4 Flags
| Flag | Set When |
|------|----------|
| Zero | Result equals 0 |
| Negative | Result is negative |
| Overflow | Result exceeds 32-bit range |

---

## 3. Instruction Set

### 3.1 Data Movement

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| 📥 | LOAD | `📥 value [reg]` | Load value into register (default R0) |
| 💾 | STORE | `💾 reg addr` | Store register to memory address |
| 📋 | COPY | `📋 src dst` | Copy source register to destination |

### 3.2 Arithmetic

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| ➕ | ADD | `➕ value` | R0 = R0 + value |
| ➖ | SUB | `➖ value` | R0 = R0 - value |
| ✖️ | MUL | `✖️ value` | R0 = R0 × value |
| ➗ | DIV | `➗ value` | R0 = R0 ÷ value (integer division) |
| 📊 | MOD | `📊 value` | R0 = R0 mod value |

### 3.3 Logic & Comparison

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| 🔀 | AND | `🔀 value` | R0 = R0 AND value (bitwise) |
| 🔃 | OR | `🔃 value` | R0 = R0 OR value (bitwise) |
| ❌ | NOT | `❌` | R0 = NOT R0 (bitwise) |
| 🔄 | XOR | `🔄 value` | R0 = R0 XOR value (bitwise) |
| ⚖️ | CMP | `⚖️ value` | Compare R0 with value, set flags |

### 3.4 Control Flow

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| ⏭️ | JUMP | `⏭️ line` | Unconditional jump to line (0-indexed) |
| ❓ | JUMP_IF_ZERO | `❓ line` | Jump if Zero flag is set |
| 🔁 | LOOP | `🔁 count` | Begin loop block (count iterations) |
| 🛑 | RETURN | `🛑` | End loop block / Return from call |
| 📞 | CALL | `📞 line` | Call subroutine at line |

### 3.5 Input/Output

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| 🖨️ | PRINT | `🖨️` | Output R0 value to console |
| 📲 | INPUT | `📲` | Read input into R0 |

### 3.6 Stack Operations

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| ⬆️ | PUSH | `⬆️` | Push R0 onto stack |
| ⬇️ | POP | `⬇️` | Pop stack into R0 |

### 3.7 System

| Emoji | Name | Syntax | Description |
|-------|------|--------|-------------|
| ⏹️ | HALT | `⏹️` | Stop program execution |
| 💤 | SLEEP | `💤 ms` | Pause execution (milliseconds) |
| ⏸️ | NOP | `⏸️` | No operation |

---

## 4. Syntax

### 4.1 Line Format
```
[opcode] [operand1] [operand2] [# comment]
```

### 4.2 Comments
```
# This is a full-line comment
📥 42  # This is an inline comment
```

### 4.3 Operand Types
- **Immediate**: Decimal number (e.g., `42`, `-5`)
- **Register**: `R0` through `R7`
- **String**: Double-quoted text (e.g., `"Hello"`)

### 4.4 Whitespace
- Lines separated by newline
- Multiple spaces/tabs treated as single separator
- Empty lines are ignored

---

## 5. Example Programs

### 5.1 Hello World
```
📥 42      # Load 42 into R0
🖨️         # Print R0
⏹️         # Halt
```
**Output**: `42`

### 5.2 Simple Addition
```
📥 10      # R0 = 10
➕ 5       # R0 = R0 + 5 = 15
🖨️         # Print 15
⏹️
```
**Output**: `15`

### 5.3 Countdown Loop
```
📥 5       # R0 = 5
🖨️         # Print R0
➖ 1       # R0 = R0 - 1
❓ 5       # If R0 = 0, jump to line 5 (HALT)
⏭️ 1       # Jump back to line 1 (PRINT)
⏹️         # Halt
```
**Output**: `5 4 3 2 1`

### 5.4 Fibonacci Sequence
```
📥 1       # First Fibonacci number
📋 R0 R1   # R1 = 1
📋 R0 R2   # R2 = 1
🖨️         # Print first number
📥 R1      # R0 = R1
➕ R2      # R0 = R1 + R2
📋 R1 R2   # R2 = old R1
📋 R0 R1   # R1 = new sum
🖨️         # Print
⚖️ 100     # Compare with 100
❓ 12      # If R0 >= 100, halt
⏭️ 3       # Loop back
⏹️
```

---

## 6. Error Handling

### 6.1 Syntax Errors
| Error | Message |
|-------|---------|
| Unknown emoji | "Unrecognized emoji 'X' at line N" |
| Missing operand | "LOAD requires a value operand" |
| Invalid register | "R8 is not a valid register (use R0-R7)" |

### 6.2 Runtime Errors
| Error | Message |
|-------|---------|
| Division by zero | "Cannot divide by zero" |
| Stack underflow | "Stack is empty, cannot POP" |
| Infinite loop | "Exceeded 100,000 cycles" |
| Invalid jump | "Jump target N is out of bounds" |

---

## 7. Execution Limits

| Limit | Value |
|-------|-------|
| Max cycles | 100,000 |
| Max memory | 256 bytes |
| Max stack | 256 entries |
| Max output lines | 1,000 |

---

## 8. Unicode Considerations

EmojiASM uses the following Unicode emoji:

```
📥 💾 📋 ➕ ➖ ✖️ ➗ 📊 🔀 🔃 ❌ 🔄 ⚖️
⏭️ ❓ 🔁 🛑 📞 🖨️ 📲 ⬆️ ⬇️ ⏹️ 💤 ⏸️
```

Note: Some emoji include variation selectors (U+FE0F) for proper rendering.

---

*EmojiASM v1.0 — Making assembly accessible to everyone 🌍*
