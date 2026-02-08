/**
 * OpenKernel EDU - Runtime State Contract v1.0
 * Execution state interfaces for VM communication
 * 
 * @module contracts/runtime-state
 * @version 1.0.0
 */

import { RegisterID, CPUState, VMState, MemoryState, ExecutionEvent } from '../core/types';

// Re-export core runtime types
export { CPUState, VMState, MemoryState, ExecutionEvent, RegisterID };

// Contract version
export const RUNTIME_STATE_VERSION = '1.0.0';

/**
 * Resource limits for execution safety
 */
export interface ResourceLimits {
    maxCycles: number;
    maxMemoryBytes: number;
    maxStackDepth: number;
    maxOutputLines: number;
    timeoutMs: number;
}

/**
 * Default resource limits
 */
export const DEFAULT_LIMITS: ResourceLimits = {
    maxCycles: 100000,
    maxMemoryBytes: 256,
    maxStackDepth: 256,
    maxOutputLines: 1000,
    timeoutMs: 5000,
};

/**
 * Execution status enum
 */
export enum ExecutionStatus {
    IDLE = 'idle',
    RUNNING = 'running',
    PAUSED = 'paused',
    HALTED = 'halted',
    ERROR = 'error',
    TIMEOUT = 'timeout',
}

/**
 * Execution statistics
 */
export interface ExecutionStats {
    instructionsExecuted: number;
    cycleCount: number;
    elapsedMs: number;
    memoryUsed: number;
    stackDepth: number;
}

/**
 * Point-in-time VM snapshot
 */
export interface RuntimeSnapshot {
    version: typeof RUNTIME_STATE_VERSION;
    timestamp: number;
    status: ExecutionStatus;
    cpu: CPUState;
    memory: MemoryState;
    stack: number[];
    output: string[];
    input: string[];
    error: string | null;
    stats: ExecutionStats;
}

/**
 * Extended execution context with history
 */
export interface ExecutionContext {
    snapshot: RuntimeSnapshot;
    history: ExecutionEvent[];
    breakpoints: number[];
    watchedRegisters: RegisterID[];
    watchedAddresses: number[];
}

/**
 * Process info for future multi-process support
 */
export interface ProcessInfo {
    pid: number;
    name: string;
    status: ExecutionStatus;
    priority: number;
    cpuTime: number;
    memoryStart: number;
    memorySize: number;
    createdAt: number;
    parentPid?: number;
}

/**
 * Process table for OS simulation
 */
export interface ProcessTable {
    processes: ProcessInfo[];
    currentPid: number;
    nextPid: number;
}

/**
 * Debugger breakpoint
 */
export interface Breakpoint {
    id: string;
    line: number;
    condition?: string;
    enabled: boolean;
    hitCount: number;
}

/**
 * Watch expression for debugging
 */
export interface WatchExpression {
    id: string;
    expression: string;
    lastValue: number | string | null;
    hasChanged: boolean;
}

/**
 * Debugger state
 */
export interface DebuggerState {
    breakpoints: Breakpoint[];
    watches: WatchExpression[];
    callStack: number[];
    stepping: boolean;
    stepMode: 'into' | 'over' | 'out' | null;
}

/**
 * Complete runtime state with debugging
 */
export interface FullRuntimeState {
    context: ExecutionContext;
    debugger: DebuggerState;
    limits: ResourceLimits;
    processTable?: ProcessTable;
}

/**
 * Runtime event types for pub/sub
 */
export type RuntimeEventType =
    | 'state_changed'
    | 'breakpoint_hit'
    | 'watch_triggered'
    | 'limit_reached'
    | 'process_created'
    | 'process_terminated';

/**
 * Runtime event payload
 */
export interface RuntimeEvent {
    type: RuntimeEventType;
    timestamp: number;
    data: unknown;
}

/**
 * Runtime event listener
 */
export type RuntimeEventListener = (event: RuntimeEvent) => void;

/**
 * Runtime event emitter interface
 */
export interface RuntimeEventEmitter {
    on(type: RuntimeEventType, listener: RuntimeEventListener): void;
    off(type: RuntimeEventType, listener: RuntimeEventListener): void;
    emit(event: RuntimeEvent): void;
}

/**
 * Create initial runtime snapshot
 */
export function createInitialSnapshot(): RuntimeSnapshot {
    return {
        version: RUNTIME_STATE_VERSION,
        timestamp: Date.now(),
        status: ExecutionStatus.IDLE,
        cpu: {
            registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0 },
            programCounter: 0,
            stackPointer: 255,
            flags: { zero: false, negative: false, overflow: false },
            halted: false,
            cycleCount: 0,
        },
        memory: {
            data: new Uint8Array(256),
            size: 256,
            lastAccessed: null,
            lastWritten: null,
        },
        stack: [],
        output: [],
        input: [],
        error: null,
        stats: {
            instructionsExecuted: 0,
            cycleCount: 0,
            elapsedMs: 0,
            memoryUsed: 0,
            stackDepth: 0,
        },
    };
}
