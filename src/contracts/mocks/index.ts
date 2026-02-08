/**
 * OpenKernel EDU - Mock Data Generators
 * Test fixtures and mock data for all contracts
 * 
 * @module contracts/mocks
 * @version 1.0.0
 */

import { Opcode, RegisterID } from '../emoji-ast';
import {
    RuntimeSnapshot,
    ExecutionStatus,
    createInitialSnapshot
} from '../runtime-state';
import {
    TutorialLesson,
    TutorialStep,
    TutorialProgress,
    DifficultyLevel
} from '../tutorial-schema';
import {
    AssistantSession,
    AssistantMessage,
    createSession,
    createMessage
} from '../openclaw-protocol';
import {
    VisualizationEvent,
    RegisterUpdateEvent,
    MemoryUpdateEvent,
    generateEventId
} from '../visualization-events';

// ============= Program Mocks =============

/**
 * Create a mock simple program (LOAD, PRINT, HALT)
 */
export function createMockSimpleProgram(): string {
    return '📥 42\n🖨️\n⏹️';
}

/**
 * Create a mock arithmetic program
 */
export function createMockArithmeticProgram(): string {
    return '📥 10\n➕ 5\n✖️ 2\n🖨️\n⏹️';
}

/**
 * Create a mock loop program
 */
export function createMockLoopProgram(): string {
    return '📥 0\n🔁 5\n➕ 1\n🖨️\n🛑\n⏹️';
}

/**
 * Create a mock program with specified opcodes
 */
export function createMockProgramWithOpcodes(opcodes: Opcode[]): string {
    const lines = opcodes.map(op => {
        switch (op) {
            case Opcode.LOAD: return '📥 10';
            case Opcode.ADD: return '➕ 5';
            case Opcode.SUB: return '➖ 3';
            case Opcode.MUL: return '✖️ 2';
            case Opcode.DIV: return '➗ 2';
            case Opcode.PRINT: return '🖨️';
            case Opcode.HALT: return '⏹️';
            default: return op;
        }
    });
    return lines.join('\n');
}

/**
 * Create an invalid program with syntax errors
 */
export function createMockInvalidProgram(): string {
    return '📥 abc\n🤷\n⏹️';
}

// ============= Runtime States =============

/**
 * Create mock VM state with running status
 */
export function createMockRunningState(): RuntimeSnapshot {
    const snapshot = createInitialSnapshot();
    snapshot.status = ExecutionStatus.RUNNING;
    snapshot.cpu.registers.R0 = 42;
    snapshot.cpu.programCounter = 2;
    snapshot.stats.instructionsExecuted = 2;
    return snapshot;
}

/**
 * Create mock VM state with halted status
 */
export function createMockHaltedState(): RuntimeSnapshot {
    const snapshot = createInitialSnapshot();
    snapshot.status = ExecutionStatus.HALTED;
    snapshot.cpu.halted = true;
    snapshot.cpu.registers.R0 = 15;
    snapshot.output = ['15'];
    snapshot.stats.instructionsExecuted = 3;
    return snapshot;
}

/**
 * Create mock VM state with error
 */
export function createMockErrorState(error: string = 'Division by zero'): RuntimeSnapshot {
    const snapshot = createInitialSnapshot();
    snapshot.status = ExecutionStatus.ERROR;
    snapshot.error = error;
    return snapshot;
}

/**
 * Create mock VM state with specific register values
 */
export function createMockStateWithRegisters(
    registers: Partial<Record<RegisterID, number>>
): RuntimeSnapshot {
    const snapshot = createInitialSnapshot();
    Object.entries(registers).forEach(([reg, value]) => {
        snapshot.cpu.registers[reg as RegisterID] = value;
    });
    return snapshot;
}

// ============= Tutorial Mocks =============

/**
 * Create a mock lesson step
 */
export function createMockLessonStep(overrides: Partial<TutorialStep> = {}): TutorialStep {
    return {
        id: `step-${Math.random().toString(36).substr(2, 8)}`,
        instruction: { en: 'Type the emoji code below:' },
        emojiCode: '📥 10\n🖨️\n⏹️',
        expectedOutput: ['10'],
        hint: { en: 'The 📥 emoji loads a value into the computer.' },
        explanation: { en: 'This loads 10 into register R0 and prints it.' },
        ...overrides,
    };
}

/**
 * Create a mock lesson
 */
export function createMockLesson(overrides: Partial<TutorialLesson> = {}): TutorialLesson {
    const now = new Date().toISOString();
    return {
        id: `lesson-${Math.random().toString(36).substr(2, 8)}`,
        version: '1.0.0',
        title: { en: 'Mock Lesson' },
        description: { en: 'A mock lesson for testing purposes.' },
        difficulty: 'beginner' as DifficultyLevel,
        estimatedMinutes: 5,
        concepts: [
            { emoji: '📥', name: 'LOAD', category: 'data' },
            { emoji: '🖨️', name: 'PRINT', category: 'io' },
        ],
        prerequisites: [],
        steps: [createMockLessonStep()],
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
}

/**
 * Create mock lesson progress
 */
export function createMockProgress(
    lessonId: string,
    overrides: Partial<TutorialProgress> = {}
): TutorialProgress {
    return {
        lessonId,
        userId: 'user-mock-123',
        currentStep: 0,
        completedSteps: [],
        started: true,
        completed: false,
        startedAt: Date.now(),
        timeSpentSeconds: 0,
        attempts: 0,
        hintsUsed: 0,
        ...overrides,
    };
}

/**
 * Create mock completed progress
 */
export function createMockCompletedProgress(lessonId: string): TutorialProgress {
    return createMockProgress(lessonId, {
        currentStep: 3,
        completedSteps: [0, 1, 2],
        completed: true,
        completedAt: Date.now(),
        timeSpentSeconds: 300,
    });
}

// ============= Assistant Mocks =============

/**
 * Create a mock assistant session
 */
export function createMockAssistantSession(): AssistantSession {
    const session = createSession();
    session.messages.push(
        createMessage('user', 'How do I print a number?'),
        createMessage('assistant', 'To print a number, first load it with 📥 then use 🖨️ to print!', 'explanation')
    );
    return session;
}

/**
 * Create mock conversation history
 */
export function createMockConversation(messageCount: number = 5): AssistantMessage[] {
    const messages: AssistantMessage[] = [];
    for (let i = 0; i < messageCount; i++) {
        const role = i % 2 === 0 ? 'user' : 'assistant';
        const content = role === 'user'
            ? `Question ${Math.floor(i / 2) + 1}`
            : `Answer ${Math.floor(i / 2) + 1}`;
        messages.push(createMessage(role, content));
    }
    return messages;
}

// ============= Visualization Event Mocks =============

/**
 * Create mock register update event
 */
export function createMockRegisterEvent(
    register: RegisterID = 'R0',
    oldValue: number = 0,
    newValue: number = 42
): RegisterUpdateEvent {
    return {
        id: generateEventId(),
        type: 'register_update',
        timestamp: Date.now(),
        register,
        oldValue,
        newValue,
        source: 'load',
    };
}

/**
 * Create mock memory update event
 */
export function createMockMemoryEvent(
    address: number = 0,
    newValue: number = 255
): MemoryUpdateEvent {
    return {
        id: generateEventId(),
        type: 'memory_update',
        timestamp: Date.now(),
        address,
        oldValue: 0,
        newValue,
        source: 'store',
    };
}

/**
 * Create a sequence of mock events for animation testing
 */
export function createMockEventSequence(): VisualizationEvent[] {
    return [
        createMockRegisterEvent('R0', 0, 10),
        createMockRegisterEvent('R0', 10, 15),
        {
            id: generateEventId(),
            type: 'output',
            timestamp: Date.now(),
            value: '15',
            isError: false,
        },
        {
            id: generateEventId(),
            type: 'execution_state',
            timestamp: Date.now(),
            state: 'halted',
        },
    ];
}
