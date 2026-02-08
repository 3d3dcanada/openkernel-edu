// OpenKernel EDU - Example Programs
// Curated emoji programs from simple to complex

export interface ExampleProgram {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'algorithms' | 'games' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  code: string;
  expectedOutput?: string[];
}

export const EXAMPLE_PROGRAMS: ExampleProgram[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Your first emoji program! Loads a number and prints it.',
    category: 'basics',
    difficulty: 'beginner',
    code: `📥 42\n🖨️\n⏹️`,
    expectedOutput: ['42'],
  },
  {
    id: 'simple-addition',
    title: 'Simple Addition',
    description: 'Add two numbers together.',
    category: 'basics',
    difficulty: 'beginner',
    code: `📥 10\n➕ 5\n🖨️\n⏹️`,
    expectedOutput: ['15'],
  },
  {
    id: 'calculator',
    title: 'Mini Calculator',
    description: 'Perform multiple arithmetic operations.',
    category: 'basics',
    difficulty: 'beginner',
    code: `📥 100\n➕ 50\n🖨️\n➖ 30\n🖨️\n✖️ 2\n🖨️\n➗ 4\n🖨️\n⏹️`,
    expectedOutput: ['150', '120', '240', '60'],
  },
  {
    id: 'countdown',
    title: 'Countdown Timer',
    description: 'Count down from 10 to 1 using a loop.',
    category: 'basics',
    difficulty: 'beginner',
    code: `📥 10\n🖨️\n➖ 1\n❓ 6\n⏭️ 1\n⏹️`,
    expectedOutput: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate the first 10 Fibonacci numbers.',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `# Fibonacci: prints first 10 numbers
📥 0
⬆️
📥 1
⬆️
📥 8
📋 R0 R2
# Loop start (line 6)
⬇️
📋 R0 R3
⬇️
📋 R0 R4
🖨️
📋 R0 R3
➕ R4
⬆️
📋 R0 R3
⬆️
📥 R2
➖ 1
📋 R0 R2
❓ 18
⏭️ 6
⏹️`,
    expectedOutput: ['1', '1', '2', '3', '5', '8', '13', '21'],
  },
  {
    id: 'powers-of-two',
    title: 'Powers of Two',
    description: 'Calculate 2^1 through 2^8.',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `📥 1\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n⏹️`,
    expectedOutput: ['1', '2', '4', '8', '16', '32', '64', '128'],
  },
  {
    id: 'memory-store',
    title: 'Memory Operations',
    description: 'Store and retrieve values from memory.',
    category: 'basics',
    difficulty: 'intermediate',
    code: `# Store values in memory\n📥 42\n💾 R0 0\n📥 99\n💾 R0 1\n# Load from memory and print\n📥 0\n📥 42\n🖨️\n📥 99\n🖨️\n⏹️`,
    expectedOutput: ['42', '99'],
  },
  {
    id: 'even-odd',
    title: 'Even or Odd',
    description: 'Check if a number is even or odd using MOD.',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `📥 7\n📊 2\n🖨️\n📥 8\n📊 2\n🖨️\n⏹️`,
    expectedOutput: ['1', '0'],
  },
  {
    id: 'stack-demo',
    title: 'Stack Operations',
    description: 'Push and pop values on the stack.',
    category: 'advanced',
    difficulty: 'advanced',
    code: `📥 10\n⬆️\n📥 20\n⬆️\n📥 30\n⬆️\n⬇️\n🖨️\n⬇️\n🖨️\n⬇️\n🖨️\n⏹️`,
    expectedOutput: ['30', '20', '10'],
  },
  {
    id: 'multiply-loop',
    title: 'Multiplication by Addition',
    description: 'Multiply 6 x 7 using repeated addition (how CPUs really do it!).',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `# Multiply 6 x 7 by repeated addition\n📥 0\n📋 R0 R1\n📥 7\n📋 R0 R2\n📥 6\n📋 R0 R3\n# Loop: add 7 six times\n📥 R1\n➕ R2\n📋 R0 R1\n📥 R3\n➖ 1\n📋 R0 R3\n❓ 14\n⏭️ 7\n📥 R1\n🖨️\n⏹️`,
    expectedOutput: ['42'],
  },
  {
    id: 'bitwise-demo',
    title: 'Bitwise Magic',
    description: 'Demonstrate AND, OR, XOR operations.',
    category: 'advanced',
    difficulty: 'advanced',
    code: `# Bitwise operations demo\n📥 12\n🔀 10\n🖨️\n📥 12\n🔃 3\n🖨️\n📥 12\n🔄 15\n🖨️\n📥 255\n❌\n🖨️\n⏹️`,
    expectedOutput: ['8', '15', '3', '-256'],
  },
  {
    id: 'sum-1-to-n',
    title: 'Sum 1 to N',
    description: 'Calculate the sum of numbers from 1 to 10.',
    category: 'algorithms',
    difficulty: 'beginner',
    code: `# Sum of 1 to 10\n📥 0\n📋 R0 R1\n📥 1\n📋 R0 R2\n# Loop\n📥 R1\n➕ R2\n📋 R0 R1\n📥 R2\n➕ 1\n📋 R0 R2\n⚖️ 11\n❓ 14\n⏭️ 5\n📥 R1\n🖨️\n⏹️`,
    expectedOutput: ['55'],
  },
  {
    id: 'factorial',
    title: 'Factorial Calculator',
    description: 'Calculate 5! (5 factorial = 120) using a loop.',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `# Calculate 5! = 120
📥 1
📋 R0 R1      # R1 = result = 1
📥 5
📋 R0 R2      # R2 = counter = 5
# Loop: result = result * counter
📥 R1
✖️ R2
📋 R0 R1      # R1 = R1 * R2
📥 R2
➖ 1
📋 R0 R2      # R2 = R2 - 1
❓ 14         # If counter = 0, exit
⏭️ 5          # Loop back
📥 R1
🖨️
⏹️`,
    expectedOutput: ['120'],
  },
  {
    id: 'max-of-two',
    title: 'Maximum of Two Numbers',
    description: 'Find the larger of two numbers (25 and 17).',
    category: 'basics',
    difficulty: 'beginner',
    code: `# Find max of 25 and 17
📥 25
📋 R0 R1      # R1 = 25
📥 17
📋 R0 R2      # R2 = 17
# Compare: R1 - R2
📥 R1
➖ R2
❓ 11         # If R1 <= R2, R2 is max
📥 R1         # R1 is max
⏭️ 12
📥 R2         # R2 is max
🖨️
⏹️`,
    expectedOutput: ['25'],
  },
  {
    id: 'swap-values',
    title: 'Swap Two Values',
    description: 'Swap values between R1 and R2 using the stack.',
    category: 'basics',
    difficulty: 'beginner',
    code: `# Swap R1=10 and R2=20 using stack
📥 10
📋 R0 R1
📥 20
📋 R0 R2
# Before swap
📥 R1
🖨️
📥 R2
🖨️
# Swap using stack
📥 R1
⬆️
📥 R2
📋 R0 R1
⬇️
📋 R0 R2
# After swap
📥 R1
🖨️
📥 R2
🖨️
⏹️`,
    expectedOutput: ['10', '20', '20', '10'],
  },
  {
    id: 'absolute-value',
    title: 'Absolute Value',
    description: 'Calculate the absolute value of -42.',
    category: 'algorithms',
    difficulty: 'beginner',
    code: `# Absolute value of -42
📥 -42
📋 R0 R1      # R1 = -42
# Check if negative (compare with 0)
⚖️ 0
❓ 7          # If R0 >= 0, skip negation
📥 0
➖ R1         # R0 = 0 - (-42) = 42
📋 R0 R1
📥 R1
🖨️
⏹️`,
    expectedOutput: ['42'],
  },
  {
    id: 'count-down-up',
    title: 'Count Down Then Up',
    description: 'Count from 3 to 1, then 1 to 3.',
    category: 'basics',
    difficulty: 'beginner',
    code: `# Count down 3,2,1 then up 1,2,3
📥 3
🖨️
➖ 1
❓ 5
⏭️ 1
📥 1
🖨️
➕ 1
⚖️ 4
❓ 11
⏭️ 6
⏹️`,
    expectedOutput: ['3', '2', '1', '1', '2', '3'],
  },
  {
    id: 'multiply-by-shift',
    title: 'Multiply by Bit Shifting',
    description: 'Multiply 7 by 4 using left shift (add to itself).',
    category: 'advanced',
    difficulty: 'intermediate',
    code: `# 7 * 4 = 28 (shift left twice = multiply by 4)
📥 7
📋 R0 R1
# Shift left = multiply by 2
📥 R1
➕ R1
📋 R0 R1      # R1 = 14
# Shift left again
📥 R1
➕ R1
📋 R0 R1      # R1 = 28
📥 R1
🖨️
⏹️`,
    expectedOutput: ['28'],
  },
  {
    id: 'triangle-numbers',
    title: 'Triangle Numbers',
    description: 'Print first 5 triangle numbers: 1, 3, 6, 10, 15.',
    category: 'algorithms',
    difficulty: 'intermediate',
    code: `# Triangle numbers: 1, 3, 6, 10, 15
📥 0
📋 R0 R1      # R1 = sum
📥 1
📋 R0 R2      # R2 = counter
# Loop
📥 R1
➕ R2
📋 R0 R1      # sum += counter
🖨️
📥 R2
➕ 1
📋 R0 R2      # counter++
⚖️ 6
❓ 15
⏭️ 5
⏹️`,
    expectedOutput: ['1', '3', '6', '10', '15'],
  },
  {
    id: 'register-cascade',
    title: 'Register Cascade',
    description: 'Copy a value through all 8 registers.',
    category: 'advanced',
    difficulty: 'intermediate',
    code: `# Cascade 42 through R0-R7
📥 42
📋 R0 R1
📋 R1 R2
📋 R2 R3
📋 R3 R4
📋 R4 R5
📋 R5 R6
📋 R6 R7
# Print from R7
📥 R7
🖨️
⏹️`,
    expectedOutput: ['42'],
  },
];
