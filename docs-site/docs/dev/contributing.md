# Contributing Guide 🤝

Thank you for your interest in contributing to OpenKernel EDU! We are building a universal education platform, and your help is vital.

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/openkernel-edu/openkernel-edu.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Development Workflow

### Adding a new Opcode
1. Define the emoji in `src/core/types.ts`.
2. Update the tokenizer in `src/parser/tokenizer.ts`.
3. Implement the execution logic in `src/core/VirtualMachine.ts`.
4. Add a test case in `tests/core/VM.test.ts`.

### Modifying the UI
We use **React 19** and **Tailwind CSS**. Components are located in `src/components/`.

## Pull Request Guidelines
- Follow the **Conventional Commits** format.
- Ensure all tests pass (`npm run test`).
- Include a brief description of the change and any relevant issue numbers.

## Multilingual Support
If you are adding text to the UI, please update the translation files in `src/i18n/locales/`. We support EN, ES, FR, ZH, AR, and HI.
