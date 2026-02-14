# OpenKernel EDU v2.0

**The world's most accessible computer science education platform.**

Learn operating systems, assembly language, and computational thinking using 100% emoji-native instructions. Zero language barriers. Zero prerequisites. Runs in your browser.

> *"Computation doesn't require English. Emojis are the most universally understood symbol set in human history."*

## Why OpenKernel?

There are **6.5 billion** people on Earth who don't speak English as a first language. Most programming education is locked behind English. OpenKernel EDU breaks that barrier completely.

- **No language required** — Emoji are universal. A child in Tokyo, a student in Lagos, a grandmother in Sao Paulo can all write `📥 42 🖨️ ⏹️` and see it work.
- **No prerequisites** — No math beyond counting. No computer science background. If you can tap a screen, you can code.
- **Real computer science** — This isn't a dumbed-down toy. You're programming real CPU registers, real memory, real instruction pipelines. Just in emoji.

## What's New in v2.0

### Welcome Experience
A beautiful landing page that explains the why, the how, and invites people to join the project. Available in 6 languages from the first screen.

### Beginner Mode with Guided Walkthroughs
On-screen guided walkthroughs with **glowing tiles** that show exactly which emoji to tap. A 5-year-old can follow along:

1. **Your First Program** — Load 42, print it, halt. Three emoji. Real code.
2. **Emoji Math** — Add two numbers together. Build a calculator.
3. **Countdown Loop** — Count from 5 to 1. Learn loops, the most powerful concept in programming.

Each walkthrough features:
- Glowing animated tiles showing the next step
- Number pad for young learners who can't type
- Guide bubbles with friendly instructions
- Celebration animations on completion
- Explanations of what each emoji does and why

### Live Demos
Three full emoji operating system simulations, playable right in the app:

- **Emoji OS — Single Core**: Process scheduling, CPU pipeline, memory allocation, filesystem
- **Emoji OS — Multi-Core**: Networking, virtual memory, device management, terminal emulator
- **Emoji OS — Advanced**: Hexacore CPU, embedded games (Snake!), calculator, performance graphs

### 6-Language Support
Every screen, every walkthrough, every button — translated:
- English, Espanol, Francais, 中文, العربية, हिन्दी

---

## Quick Start

```bash
git clone https://github.com/OpenKernel-edu/emoji-kernel-edu.git
cd emoji-kernel-edu
npm install
npm run dev
```

Open `http://localhost:5173` — new users see the Welcome page automatically.

## What is EmojiASM?

EmojiASM is a visual assembly language where every instruction is an emoji:

```
📥 10        # LOAD 10 into R0
➕ 5         # ADD 5 to R0
🖨️           # PRINT R0 (outputs: 15)
⏹️           # HALT
```

### Full Instruction Set (23 Opcodes)

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

## Architecture

- **8 virtual registers** (R0-R7) with real-time visualization
- **256 bytes virtual memory** displayed as interactive hex grid
- **Stack-based function calls** with PUSH/POP
- **CPU flag system** (Zero, Negative, Overflow)
- **Step-through debugging** — execute one instruction at a time
- **Compilation pipeline**: Tokenizer → Parser → Validator → Compiler → VM

## Features

### Editor & Runtime
- Emoji code editor with syntax highlighting and click-to-insert palette
- Run, Step, and Reset controls with adjustable speed
- CPU register visualizer — watch R0-R7 change in real-time
- Memory grid — 256-byte memory with hex display and access highlighting
- Output console with animated results

### Learning
- **Welcome page** with project introduction and quick-start guide
- **Beginner mode** with 3 guided walkthroughs and glowing tile navigation
- **10 progressive tutorials** from "Hello World" to building a mini OS
- **19 example programs** (Fibonacci, factorial, counters, bitwise ops, etc.)
- **Full opcode reference** with try-it buttons
- **3 live OS demos** — interactive emoji operating system simulations

### Accessibility & i18n
- **6 languages**: English, Spanish, French, Chinese, Arabic, Hindi
- **RTL support** for Arabic
- **Dark/Light mode**
- **Responsive design** (desktop, tablet, mobile)
- **WCAG 2.1** (ARIA labels, keyboard navigation, screen reader support)

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** (build tooling)
- **Zustand 5** (state management with localStorage persistence)
- **Framer Motion** (animations)
- **react-i18next** (internationalization — 6 languages)
- **Tailwind CSS 4** + custom CSS design system
- **Vitest** + **Playwright** (unit + E2E testing)

## Project Structure

```
src/
  core/              # VM engine (VirtualMachine, Memory, types)
  parser/            # Emoji tokenizer, parser, validator
  compiler/          # AST compiler and opcode metadata
  store/             # Zustand global state (useStore.ts)
  components/
    Welcome/         # Landing page (v2)
    BeginnerMode/    # Guided walkthroughs with glowing tiles (v2)
    Demos/           # Live demo panel and viewer (v2)
    CodeEditor/      # Emoji code editor with palette
    Controls/        # Run/Step/Reset/Speed controls
    Visualizer/      # CPUView + MemoryGrid
    Console/         # Output display
    Tutorial/        # Lesson sidebar
    Examples/        # Example programs panel
    Reference/       # Opcode reference
  demos/             # 3 self-contained emoji OS simulations (v2)
  tutorials/         # Lesson data, examples, beginner walkthroughs
  i18n/              # 6 language translation files
  styles/            # Global CSS variables + layout
tests/
  core/              # VM and Memory tests
  parser/            # Parser tests
  e2e/               # Playwright accessibility + flow tests
```

## Scripts

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npx vitest run       # Run unit tests
npx playwright test  # Run E2E tests
```

---

## Join Us

OpenKernel EDU is open source and community-driven. We need help in:

- **Translations** — Add new languages or improve existing ones
- **Lessons** — Write new tutorials and example programs
- **Code** — Fix bugs, add features, improve the VM
- **Testing** — Help us test across browsers, devices, and screen readers
- **Design** — UI/UX improvements, animations, visual guides
- **Education** — Curriculum design, classroom integration guides

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests (`npx vitest run`)
5. Submit a pull request

### Get in Touch

- **GitHub**: [OpenKernel-edu/emoji-kernel-edu](https://github.com/OpenKernel-edu/emoji-kernel-edu)
- **Issues**: [Report bugs or request features](https://github.com/OpenKernel-edu/emoji-kernel-edu/issues)
- **Email**: 3d3dcanada@gmail.com

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

*Every emoji you implement brings coding to millions who couldn't access it before.*

*Built with love by the OpenKernel community.*
