// OpenKernel EDU - Tutorial Lessons
// 10 progressive lessons from "Hello World" to building an OS

export interface LessonStep {
  instruction: string;
  emojiCode: string;
  expectedOutput?: string[];
  hint?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  concepts: string[];
  steps: LessonStep[];
  prerequisites: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-01',
    title: 'Your First Emoji Program',
    description: 'Write and run your very first emoji program! Load a number and print it.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    concepts: ['LOAD', 'PRINT', 'HALT'],
    prerequisites: [],
    steps: [
      {
        instruction: 'Type this emoji code to load the number 42 into the computer:',
        emojiCode: '📥 42',
        hint: '📥 means LOAD - it puts a number into the computer\'s brain (register R0).',
        explanation: 'The 📥 instruction loads a value into register R0. Think of R0 as a small box that holds one number.',
      },
      {
        instruction: 'Now print the number so we can see it:',
        emojiCode: '📥 42\n🖨️',
        hint: '🖨️ means PRINT - it shows whatever number is in R0.',
        explanation: 'The 🖨️ instruction outputs the current value of R0 to the console.',
      },
      {
        instruction: 'Finally, stop the program:',
        emojiCode: '📥 42\n🖨️\n⏹️',
        expectedOutput: ['42'],
        hint: '⏹️ means HALT - it tells the computer to stop running.',
        explanation: 'Every program needs a ⏹️ at the end, just like how every sentence needs a period!',
      },
    ],
  },
  {
    id: 'lesson-02',
    title: 'Understanding Registers',
    description: 'Learn about the 8 registers (R0-R7) - the CPU\'s tiny but fast memory.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    concepts: ['Registers', 'R0-R7', 'COPY'],
    prerequisites: ['lesson-01'],
    steps: [
      {
        instruction: 'Load a value into R0 (the default register):',
        emojiCode: '📥 100\n🖨️\n⏹️',
        expectedOutput: ['100'],
        explanation: 'R0 is the main working register. Most instructions use R0 by default.',
      },
      {
        instruction: 'Copy R0 to R1 to save it, then load a new value:',
        emojiCode: '📥 100\n📋 R0 R1\n📥 200\n🖨️\n⏹️',
        expectedOutput: ['200'],
        hint: '📋 copies from the first register to the second one.',
        explanation: 'You can copy values between registers with 📋. This is like making a backup before changing R0.',
      },
      {
        instruction: 'Watch the CPU Visualizer panel to see all 8 registers update in real-time!',
        emojiCode: '📥 10\n📋 R0 R1\n📥 20\n📋 R0 R2\n📥 30\n📋 R0 R3\n🖨️\n⏹️',
        expectedOutput: ['30'],
        explanation: 'The CPU has 8 registers (R0-R7). Each holds one number. They\'re the fastest memory in a computer!',
      },
    ],
  },
  {
    id: 'lesson-03',
    title: 'Emoji Math',
    description: 'Perform arithmetic operations: add, subtract, multiply, divide.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    concepts: ['ADD', 'SUB', 'MUL', 'DIV'],
    prerequisites: ['lesson-01'],
    steps: [
      {
        instruction: 'Add two numbers together:',
        emojiCode: '📥 10\n➕ 5\n🖨️\n⏹️',
        expectedOutput: ['15'],
        explanation: '➕ adds the value to R0. So R0 (10) + 5 = 15!',
      },
      {
        instruction: 'Now try subtraction:',
        emojiCode: '📥 20\n➖ 8\n🖨️\n⏹️',
        expectedOutput: ['12'],
        explanation: '➖ subtracts from R0. So R0 (20) - 8 = 12!',
      },
      {
        instruction: 'Multiplication and division:',
        emojiCode: '📥 6\n✖️ 7\n🖨️\n➗ 2\n🖨️\n⏹️',
        expectedOutput: ['42', '21'],
        hint: 'Operations chain together! First 6*7=42, then 42/2=21.',
        explanation: 'Each operation modifies R0 in sequence. You can chain them like a calculator!',
      },
      {
        instruction: 'Build your own calculator! Try: (100 + 50) * 2 - 75',
        emojiCode: '📥 100\n➕ 50\n✖️ 2\n➖ 75\n🖨️\n⏹️',
        expectedOutput: ['225'],
        explanation: 'Real CPUs work exactly like this - one operation at a time, modifying registers.',
      },
    ],
  },
  {
    id: 'lesson-04',
    title: 'Loops - Repeating Things',
    description: 'Make the computer repeat instructions using loops and jumps.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    concepts: ['LOOP', 'JUMP', 'RETURN'],
    prerequisites: ['lesson-03'],
    steps: [
      {
        instruction: 'Count down from 5 to 1 using JUMP:',
        emojiCode: '📥 5\n🖨️\n➖ 1\n❓ 5\n⏭️ 1\n⏹️',
        expectedOutput: ['5', '4', '3', '2', '1'],
        hint: '⏭️ 1 means "jump back to line 1" (0-indexed). ❓ jumps only if R0 is zero.',
        explanation: 'JUMP creates a loop by going back to an earlier instruction. JUMP_IF_ZERO breaks the loop when R0 reaches 0.',
      },
      {
        instruction: 'Use LOOP for a simpler way to repeat:',
        emojiCode: '📥 0\n🔁 5\n➕ 1\n🖨️\n🛑\n⏹️',
        expectedOutput: ['1', '2', '3', '4', '5'],
        explanation: '🔁 N repeats the block between 🔁 and 🛑 exactly N times. Much easier than manual jumps!',
      },
    ],
  },
  {
    id: 'lesson-05',
    title: 'Conditional Logic - Making Decisions',
    description: 'Make your program choose different paths based on conditions.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    concepts: ['JUMP_IF_ZERO', 'CMP', 'Branching'],
    prerequisites: ['lesson-04'],
    steps: [
      {
        instruction: 'Use JUMP_IF_ZERO to skip code when R0 is zero:',
        emojiCode: '📥 0\n❓ 3\n📥 99\n🖨️\n⏹️',
        expectedOutput: [],
        hint: 'Since R0 is 0, ❓ jumps to line 3, skipping the PRINT.',
        explanation: '❓ checks if R0 is zero. If yes, it jumps to the specified line. This is how computers make decisions!',
      },
      {
        instruction: 'Compare values with CMP:',
        emojiCode: '📥 10\n⚖️ 10\n❓ 5\n📥 0\n🖨️\n⏹️\n📥 1\n🖨️\n⏹️',
        explanation: '⚖️ compares R0 with a value. If they\'re equal, the zero flag is set, and ❓ will jump.',
      },
    ],
  },
  {
    id: 'lesson-06',
    title: 'Memory - The Computer\'s Notebook',
    description: 'Learn to store and retrieve data from the 256-byte virtual memory.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    concepts: ['STORE', 'Memory addresses', 'Memory grid'],
    prerequisites: ['lesson-02'],
    steps: [
      {
        instruction: 'Store a value in memory:',
        emojiCode: '📥 42\n💾 R0 0\n📥 0\n🖨️\n⏹️',
        expectedOutput: ['0'],
        hint: 'Watch the Memory Grid light up when you store a value!',
        explanation: '💾 stores the value from a register into memory at a specific address. Memory keeps data even after R0 changes.',
      },
      {
        instruction: 'Store multiple values and see the memory grid fill up:',
        emojiCode: '📥 72\n💾 R0 0\n📥 101\n💾 R0 1\n📥 108\n💾 R0 2\n🖨️\n⏹️',
        hint: 'Each memory address can hold a number 0-255. These are ASCII codes for "Hel"!',
        explanation: 'Memory has 256 addresses (0-255). Each can store a byte (0-255). This is how text is stored!',
      },
    ],
  },
  {
    id: 'lesson-07',
    title: 'Building a Counter',
    description: 'Build a program that counts from 0 to any number.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    concepts: ['Loops', 'Increments', 'Comparisons'],
    prerequisites: ['lesson-04', 'lesson-05'],
    steps: [
      {
        instruction: 'Build a counter from 1 to 5:',
        emojiCode: '📥 0\n➕ 1\n🖨️\n⚖️ 5\n❓ 6\n⏭️ 1\n⏹️',
        expectedOutput: ['1', '2', '3', '4', '5'],
        explanation: 'This is a fundamental programming pattern: initialize, increment, check condition, loop or exit.',
      },
    ],
  },
  {
    id: 'lesson-08',
    title: 'The Fibonacci Sequence',
    description: 'Implement the famous Fibonacci algorithm using emoji!',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    concepts: ['Algorithms', 'Multiple registers', 'Stack'],
    prerequisites: ['lesson-07'],
    steps: [
      {
        instruction: 'The Fibonacci sequence: each number is the sum of the two before it (1, 1, 2, 3, 5, 8...). Let\'s build it!',
        emojiCode: '📥 1\n📋 R0 R1\n📋 R0 R2\n🖨️\n📥 R1\n➕ R2\n📋 R0 R3\n📋 R0 R1\n🖨️\n📥 R2\n📋 R0 R1\n📥 R3\n📋 R0 R2\n⚖️ 100\n❓ 16\n⏭️ 4\n⏹️',
        explanation: 'This uses multiple registers to track the previous two Fibonacci numbers and compute the next one.',
      },
    ],
  },
  {
    id: 'lesson-09',
    title: 'Stack Operations - Function Basics',
    description: 'Learn the stack - the foundation of function calls in real computers.',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    concepts: ['PUSH', 'POP', 'Stack', 'LIFO'],
    prerequisites: ['lesson-06'],
    steps: [
      {
        instruction: 'Push values onto the stack and pop them back (notice they come out in reverse order!):',
        emojiCode: '📥 1\n⬆️\n📥 2\n⬆️\n📥 3\n⬆️\n⬇️\n🖨️\n⬇️\n🖨️\n⬇️\n🖨️\n⏹️',
        expectedOutput: ['3', '2', '1'],
        hint: 'The stack is LIFO: Last In, First Out. Like a stack of plates!',
        explanation: 'The stack is crucial for function calls. When you call a function, the return address is pushed. When you return, it\'s popped.',
      },
    ],
  },
  {
    id: 'lesson-10',
    title: 'Your Own Mini Operating System',
    description: 'Combine everything you\'ve learned to build a simple OS-like program!',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    concepts: ['System design', 'All opcodes', 'Architecture'],
    prerequisites: ['lesson-08', 'lesson-09'],
    steps: [
      {
        instruction: 'Build a program that: 1) Initializes memory, 2) Runs a computation, 3) Stores the result, 4) Prints a report:',
        emojiCode: `# Mini OS: Initialize, Compute, Store, Report
# Phase 1: Initialize memory with zeros
📥 0
💾 R0 0
💾 R0 1
💾 R0 2

# Phase 2: Compute sum of 1 to 10
📥 0
📋 R0 R1
📥 1
📋 R0 R2
📥 R1
➕ R2
📋 R0 R1
📥 R2
➕ 1
📋 R0 R2
⚖️ 11
❓ 18
⏭️ 10

# Phase 3: Store result in memory
📥 R1
💾 R0 0
🖨️

# Phase 4: Halt
⏹️`,
        expectedOutput: ['55'],
        explanation: 'Congratulations! You\'ve built a program that mirrors what real operating systems do: initialize hardware, run processes, manage memory, and produce output.',
      },
    ],
  },
];
