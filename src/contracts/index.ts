/**
 * OpenKernel EDU - Integration Contracts
 * Barrel exports for all contract definitions
 * 
 * @module contracts
 * @version 1.0.0
 */

// ============= Emoji AST Contracts =============
export {
    // Types
    type SourceLocation,
    type ASTNode,
    type OperandType,
    type Operand,
    type InstructionNode,
    type LabelNode,
    type CommentNode,
    type ProgramNode,
    type ParseErrorInfo,
    type ProgramMetadata,
    type EmojiProgram,
    type ParserOptions,
    type ParseResult,
    // Constants
    EMOJI_AST_VERSION,
    // Re-exports from core
    Opcode,
    type RegisterID,
    ALL_REGISTERS,
    OPCODE_MAP,
    OPCODE_INFO,
    // Functions
    isInstruction,
    isLabel,
    isComment,
    createSourceHash,
} from './emoji-ast';

// ============= Runtime State Contracts =============
export {
    // Types
    type CPUState,
    type VMState,
    type MemoryState,
    type ExecutionEvent,
    type ResourceLimits,
    type ExecutionStats,
    type RuntimeSnapshot,
    type ExecutionContext,
    type ProcessInfo,
    type ProcessTable,
    type Breakpoint,
    type WatchExpression,
    type DebuggerState,
    type FullRuntimeState,
    type RuntimeEventType,
    type RuntimeEvent,
    type RuntimeEventListener,
    type RuntimeEventEmitter,
    // Enums
    ExecutionStatus,
    // Constants
    RUNTIME_STATE_VERSION,
    DEFAULT_LIMITS,
    // Functions
    createInitialSnapshot,
} from './runtime-state';

// ============= Visualization Contracts =============
export {
    // Types
    type EasingFunction,
    type AnimationConfig,
    type ColorScheme,
    type BaseVisualizationEvent,
    type RegisterUpdateEvent,
    type MemoryUpdateEvent,
    type MemoryReadEvent,
    type OutputEvent,
    type PCUpdateEvent,
    type StackEvent,
    type FlagsUpdateEvent,
    type ExecutionStateEvent,
    type MilestoneEvent,
    type VisualizationEvent,
    type VisualizationEventType,
    type VisualizationEventHandler,
    type VisualizationEventBus,
    // Constants
    VISUALIZATION_EVENTS_VERSION,
    DEFAULT_ANIMATION,
    NEON_COLORS,
    // Functions
    createVisualizationEventBus,
    generateEventId,
    createEvent,
} from './visualization-events';

// ============= Tutorial Contracts =============
export {
    // Types
    type SupportedLanguage,
    type MultilingualText,
    type DifficultyLevel,
    type EmojiConcept,
    type ValidationRule,
    type TutorialStep,
    type TutorialLesson,
    type LessonCategory,
    type TutorialProgress,
    type ValidationResult as TutorialValidationResult,
    type Achievement,
    type UserAchievement,
    type Curriculum,
    type TutorialService,
    // Constants
    TUTORIAL_SCHEMA_VERSION,
    // Functions
    validateStepOutput,
    getLocalizedText,
} from './tutorial-schema';

// ============= OpenClaw Contracts =============
export {
    // Types
    type MessageRole,
    type ContentType,
    type AssistantMessage,
    type CodeSuggestion,
    type ExplanationRequest,
    type ExplanationResponse,
    type HintRequest,
    type HintResponse,
    type DebugRequest,
    type DebugResponse,
    type AssistantSession,
    type SessionConfig,
    type OpenClawService,
    type OpenClawEventType,
    type OpenClawEvent,
    // Constants
    OPENCLAW_PROTOCOL_VERSION,
    DEFAULT_SESSION_CONFIG,
    // Functions
    generateSessionId,
    generateMessageId,
    createMessage,
    createSession,
} from './openclaw-protocol';

// ============= Mocks =============
export * from './mocks';

// ============= Validators =============
export {
    type ValidationError,
    type ValidationSuccess,
    type ValidationFailure,
    type ValidationResult,
    validateProgram,
    validateInstruction,
    validateRuntimeSnapshot,
    validateResourceLimits,
    validateLesson,
    validateLessonStep,
    validateAssistantMessage,
    validateAssistantSession,
} from './validators';
