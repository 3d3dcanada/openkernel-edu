# Homework Assignments & Solutions 📝

## Assignment 1: The Multiplier ✖️
**Goal:** Create a program that multiplies R0 by 2 without using the `✖️` opcode.

**Solution:**
```emoji-asm
📥 5         # Initial value
📋 1         # Copy R0 to R1
➕           # R0 = R0 + R1 (effectively 5 + 5)
🖨️           # Prints 10
⏹️
```

## Assignment 2: Find the Even Number ⚖️
**Goal:** Take an input number. If it is even, print `1`. If odd, print `0`.

**Solution:**
```emoji-asm
📲           # Get input into R0
📊 2         # R0 = R0 % 2
⚖️           # Compare R0 to 0 (Implicit in some ISAs, or use CMP)
❓ 5         # If result is 0 (even), jump to line 5
📥 0         # Else: result is 1 (odd)
🖨️           # Print 0
⏹️
📥 1         # Correct path for even
🖨️           # Print 1
⏹️
```

## Assignment 3: The Countdown 🔁
**Goal:** Start at 10 and print every number down to 0.

**Solution:**
```emoji-asm
📥 10
🔁 10
  🖨️
  ➖ 1
🛑
🖨️           # Print final 0
⏹️
```
