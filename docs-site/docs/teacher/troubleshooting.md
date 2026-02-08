# Troubleshooting Student Issues 🩺

Guide for teachers to help students debug their EmojiASM code.

## "My code won't run!"
*   **Check for Syntax:** Are there non-emoji characters in the opcode section?
*   **Verify Halt:** Does the program end with `⏹️`? Without it, the VM might keep looking for instructions in empty memory.

## "The output is 0 but it should be 15."
*   **Check R0:** Remind students that arithmetic results are stored in **R0**.
*   **Load Order:** Ensure they aren't overwriting R0 with a new `📥` before printing the result of a `➕`.

## "The simulator is slow."
*   **Loop count:** Check if the student set a `🔁` count to a very high number (e.g., 65535) without a `💤` sleep.
*   **Recursion depth:** If using `📞` calls, they might have reached the stack limit.

## "I can't see my memory changes."
*   **Base-10 vs Hex:** The memory grid shows values in Hex. Students might need a reminder of how 10 in decimal is A in hex.
*   **Address range:** Ensure they are `💾` storing to an address between 0 and 255.
