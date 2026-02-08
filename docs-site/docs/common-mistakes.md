# Common Mistakes and Fixes 🛠️

Stuck? Here are some common issues students face when first using EmojiASM.

## 1. Missing STOP ⏹️
**Issue:** The program runs forever or crashes at the end.
**Fix:** Always end your program with the HALT (`⏹️`) opcode.

## 2. Register Confusion
**Issue:** "I added a number but the result is wrong."
**Fix:** Most arithmetic operations (`➕`, `➖`, `✖️`, `➗`) use **R0** as the primary register. Make sure your value is in R0 before performing operations.

## 3. Loop Nesting 🔁
**Issue:** Loops are behaving unexpectedly.
**Fix:** Ensure every `🔁` (LOOP) has a corresponding `🛑` (RETURN). Avoid nesting loops more than 3 levels deep until you are comfortable with stack management.

## 4. Logical Comparisons ⚖️
**Issue:** `❓` (JUMP_IF_ZERO) isn't jumping when I expect.
**Fix:** Remember that `❓` only checks **R0**. Perform your calculation or comparison so that the result is `0` when you want the jump to happen.

## 5. Visualizer lag
**Issue:** Registers aren't updating.
**Fix:** Check if you have a `💤` (SLEEP) instruction with a very large value, or an infinite loop without a sleep.
