/**
 * OpenKernel EDU - Visualization Events Contract v1.0
 * Event types for real-time UI rendering at 60fps
 * 
 * @module contracts/visualization-events
 * @version 1.0.0
 */

import { RegisterID } from '../core/types';

// Contract version
export const VISUALIZATION_EVENTS_VERSION = '1.0.0';

/**
 * Animation easing functions
 */
export type EasingFunction =
    | 'linear'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'spring';

/**
 * Animation configuration for smooth 60fps rendering
 */
export interface AnimationConfig {
    duration: number;
    easing: EasingFunction;
    delay?: number;
}

/**
 * Default animation settings
 */
export const DEFAULT_ANIMATION: AnimationConfig = {
    duration: 200,
    easing: 'ease-out',
    delay: 0,
};

/**
 * Color scheme for visualization
 */
export interface ColorScheme {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    highlight: string;
    muted: string;
}

/**
 * Default neon color scheme
 */
export const NEON_COLORS: ColorScheme = {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#95E1D3',
    warning: '#F38181',
    error: '#FF4757',
    highlight: '#AA96DA',
    muted: '#636E72',
};

// ============= Event Types =============

/**
 * Base visualization event
 */
export interface BaseVisualizationEvent {
    id: string;
    timestamp: number;
    animation?: AnimationConfig;
}

/**
 * Register value changed
 */
export interface RegisterUpdateEvent extends BaseVisualizationEvent {
    type: 'register_update';
    register: RegisterID;
    oldValue: number;
    newValue: number;
    source: 'load' | 'arithmetic' | 'copy' | 'pop' | 'input';
}

/**
 * Memory cell written
 */
export interface MemoryUpdateEvent extends BaseVisualizationEvent {
    type: 'memory_update';
    address: number;
    oldValue: number;
    newValue: number;
    source: 'store' | 'initialize';
}

/**
 * Memory cell read (for access highlighting)
 */
export interface MemoryReadEvent extends BaseVisualizationEvent {
    type: 'memory_read';
    address: number;
    value: number;
}

/**
 * Console output produced
 */
export interface OutputEvent extends BaseVisualizationEvent {
    type: 'output';
    value: string;
    isError: boolean;
}

/**
 * Program counter changed (instruction highlight)
 */
export interface PCUpdateEvent extends BaseVisualizationEvent {
    type: 'pc_update';
    oldLine: number;
    newLine: number;
    isJump: boolean;
}

/**
 * Stack operation
 */
export interface StackEvent extends BaseVisualizationEvent {
    type: 'stack_push' | 'stack_pop';
    value: number;
    stackDepth: number;
}

/**
 * CPU flags changed
 */
export interface FlagsUpdateEvent extends BaseVisualizationEvent {
    type: 'flags_update';
    zero: boolean;
    negative: boolean;
    overflow: boolean;
}

/**
 * Execution state changed
 */
export interface ExecutionStateEvent extends BaseVisualizationEvent {
    type: 'execution_state';
    state: 'started' | 'paused' | 'resumed' | 'halted' | 'error' | 'reset';
    message?: string;
}

/**
 * Lesson milestone achieved
 */
export interface MilestoneEvent extends BaseVisualizationEvent {
    type: 'milestone';
    lessonId: string;
    stepIndex: number;
    isComplete: boolean;
    showConfetti: boolean;
}

/**
 * Union of all visualization events
 */
export type VisualizationEvent =
    | RegisterUpdateEvent
    | MemoryUpdateEvent
    | MemoryReadEvent
    | OutputEvent
    | PCUpdateEvent
    | StackEvent
    | FlagsUpdateEvent
    | ExecutionStateEvent
    | MilestoneEvent;

/**
 * Event type discriminator
 */
export type VisualizationEventType = VisualizationEvent['type'];

// ============= Event Bus =============

/**
 * Event subscriber callback
 */
export type VisualizationEventHandler<T extends VisualizationEvent = VisualizationEvent> =
    (event: T) => void;

/**
 * Event bus interface for pub/sub
 */
export interface VisualizationEventBus {
    subscribe<T extends VisualizationEventType>(
        type: T,
        handler: VisualizationEventHandler<Extract<VisualizationEvent, { type: T }>>
    ): () => void;

    subscribeAll(handler: VisualizationEventHandler): () => void;

    publish(event: VisualizationEvent): void;

    clear(): void;
}

/**
 * Create event bus implementation
 */
export function createVisualizationEventBus(): VisualizationEventBus {
    const handlers = new Map<string, Set<VisualizationEventHandler>>();
    const allHandlers = new Set<VisualizationEventHandler>();

    return {
        subscribe(type, handler) {
            if (!handlers.has(type)) {
                handlers.set(type, new Set());
            }
            handlers.get(type)!.add(handler as VisualizationEventHandler);
            return () => handlers.get(type)?.delete(handler as VisualizationEventHandler);
        },

        subscribeAll(handler) {
            allHandlers.add(handler);
            return () => allHandlers.delete(handler);
        },

        publish(event) {
            handlers.get(event.type)?.forEach(h => h(event));
            allHandlers.forEach(h => h(event));
        },

        clear() {
            handlers.clear();
            allHandlers.clear();
        },
    };
}

/**
 * Generate unique event ID
 */
export function generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create event with defaults
 */
export function createEvent<T extends VisualizationEvent>(
    event: Omit<T, 'id' | 'timestamp'> & Partial<Pick<T, 'id' | 'timestamp'>>
): T {
    return {
        id: generateEventId(),
        timestamp: Date.now(),
        ...event,
    } as T;
}
