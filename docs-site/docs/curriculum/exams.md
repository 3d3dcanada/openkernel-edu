# Exam Questions 📝

Sample questions for a final exam on Computer Architecture using EmojiASM.

## Section 1: Memory & Registers
1. **Q:** What is the maximum addressable memory in EmojiASM?
   *   **A:** 256 bytes (0-255).
2. **Q:** Which register is primarily used for the results of arithmetic operations like `➕`?
   *   **A:** R0.

## Section 2: Code Analysis
**Q:** What will be the value of R0 after executing the following program?
```emoji-asm
📥 20
📋 1
➕ 5
⏹️
```
*   **A:** 25 (20 loaded into R0, then 5 added to R0). Note: `📋 1` copies 20 to R1 but doesn't change R0.

## Section 3: Logic & Branching
**Q:** Explain what the `❓` (JUMP_IF_ZERO) opcode does.
*   **A:** It pivots the program execution to a new address ONLY IF the current value in R0 is precisely 0.
