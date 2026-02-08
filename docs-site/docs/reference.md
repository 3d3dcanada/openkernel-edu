# EmojiASM Quick Reference 📋

Use this guide to look up opcodes and their functions.

## Data Movement
| Emoji | Name | Description | Example |
|-------|------|-------------|---------|
| 📥 | LOAD | Load value into R0 | `📥 10` |
| 💾 | STORE | Store R0 to memory address | `💾 100` |
| 📋 | COPY | Copy R0 to register X | `📋 1` (R0 -> R1) |

## Arithmetic
| Emoji | Name | Description | Example |
|-------|------|-------------|---------|
| ➕ | ADD | Add value/reg to R0 | `➕ 5` |
| ➖ | SUB | Subtract value/reg from R0 | `➖ 2` |
| ✖️ | MUL | Multiply R0 by value/reg | `✖️ 10` |
| ➗ | DIV | Divide R0 by value/reg | `➗ 2` |

## Control Flow
| Emoji | Name | Description | Example |
|-------|------|-------------|---------|
| ⏭️ | JUMP | Jump to address | `⏭️ 10` |
| ❓ | JUMP_IF_ZERO | Jump to address if R0 is 0 | `❓ 5` |
| 🔁 | LOOP | Start loop of N iterations | `🔁 10` |
| 🛑 | RETURN | End loop / return from call | `🛑` |

## I/O & System
| Emoji | Name | Description | Example |
|-------|------|-------------|---------|
| 🖨️ | PRINT | Print current value of R0 | `🖨️` |
| ⏹️ | HALT | Stop execution | `⏹️` |
| 💤 | SLEEP | Wait for N milliseconds | `💤 500` |

> [!TIP]
> You can find more detail in the full [Opcode Reference](./dev/api-reference).
