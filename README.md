# OpenKernel EDU v1.0.0

**The world's most accessible computer science education platform.**

Learn operating systems, assembly language, and computational thinking using 100% emoji-native instructions. Zero language barriers. Zero prerequisites. Runs in your browser.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and start coding with emoji!

## What is EmojiASM?

EmojiASM is a visual assembly language where every instruction is an emoji:

```
📥 10        # LOAD 10 into R0
➕ 5         # ADD 5 to R0
🖨️           # PRINT R0 (outputs: 15)
⏹️           # HALT
```

### Full Instruction Set

| Emoji | Name | Description |
|-------|------|-------------|
| 📥 | LOAD | Load value into register |
| 💾 | STORE | Store register to memory |
| 📋 | COPY | Copy register to register |
| ➕ | ADD | Add to R0 |
| ➖ | SUB | Subtract from R0 |
| ✖️ | MUL | Multiply R0 |
| ➗ | DIV | Divide R0 |
| 📊 | MOD | Modulo R0 |
| 🔀 | AND | Bitwise AND |
| 🔃 | OR | Bitwise OR |
| ❌ | NOT | Bitwise NOT |
| 🔄 | XOR | Bitwise XOR |
| ⚖️ | CMP | Compare R0 |
| ⏭️ | JUMP | Jump to address |
| ❓ | JUMP_IF_ZERO | Conditional jump |
| 🔁 | LOOP | Loop N times |
| 🛑 | RETURN | Return/end loop |
| 📞 | CALL | Call subroutine |
| 🖨️ | PRINT | Print R0 |
| 📲 | INPUT | Read input |
| ⬆️ | PUSH | Push to stack |
| ⬇️ | POP | Pop from stack |
| ⏹️ | HALT | Stop execution |
| 💤 | SLEEP | Pause |
| ⏸️ | NOP | No operation |

## Architecture

- **8 virtual registers** (R0-R7)
- **256 bytes virtual memory** with visualization
- **Stack-based function calls**
- **Real-time CPU/Memory visualization**
- **Step-through debugging**

## Features

- Emoji Code Editor with syntax highlighting and autocomplete palette
- CPU Register Visualizer - watch R0-R7 change in real-time
- Memory Grid - 256-byte memory displayed as hex grid
- Output Console with animated results
- 10 Progressive Tutorials from "Hello World" to building a mini OS
- 12 Example Programs (Fibonacci, counters, bitwise ops, etc.)
- Full Opcode Reference with try-it buttons
- 6 Languages (English, Spanish, French, Chinese, Arabic, Hindi)
- Dark/Light Mode
- Responsive Design (desktop, tablet, mobile)
- WCAG 2.1 Accessible (ARIA labels, keyboard navigation, screen reader support)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (build tooling)
- **Zustand** (state management)
- **Framer Motion** (animations)
- **react-i18next** (internationalization)
- **Vitest** (testing - 55 tests)

## Project Structure

```
src/
  core/           # VM engine (types, VirtualMachine, Memory)
  parser/         # Emoji tokenizer and parser
  compiler/       # AST compiler and opcode reference
  store/          # Zustand global state
  components/     # React UI (Editor, CPU, Memory, Console, Tutorial, Reference)
  tutorials/      # 10 lessons + 12 example programs
  i18n/           # 6 language translations
  styles/         # Global CSS + layout
tests/
  core/           # VM and Memory tests
  parser/         # Parser tests
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npx vitest run   # Run tests (55 passing)
```

---

*Built with VibeCoding. Powered by 3D3D.ca.*
*Every emoji you implement brings coding to millions who couldn't access it before.*
