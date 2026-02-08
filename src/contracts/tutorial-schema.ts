/**
 * OpenKernel EDU - Tutorial Schema Contract v1.0
 * Tutorial system interfaces with multilingual support
 * 
 * @module contracts/tutorial-schema
 * @version 1.0.0
 */

// Contract version
export const TUTORIAL_SCHEMA_VERSION = '1.0.0';

/**
 * Supported languages for multilingual content
 */
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'zh' | 'ar' | 'hi' | 'pt' | 'ru';

/**
 * Multilingual text field
 */
export type MultilingualText = Partial<Record<SupportedLanguage, string>> & {
    en: string; // English is required
};

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Emoji concepts taught in a lesson
 */
export interface EmojiConcept {
    emoji: string;
    name: string;
    category: string;
}

/**
 * Validation rule for step completion
 */
export interface ValidationRule {
    type: 'output_matches' | 'contains_opcode' | 'register_equals' | 'custom';
    value: string | number | string[];
    message?: string;
}

/**
 * Single lesson step
 */
export interface TutorialStep {
    id: string;
    instruction: MultilingualText;
    emojiCode: string;
    expectedOutput?: string[];
    hint?: MultilingualText;
    explanation?: MultilingualText;
    validation?: ValidationRule[];
    allowFreeform?: boolean;
}

/**
 * Complete tutorial lesson
 */
export interface TutorialLesson {
    id: string;
    version: string;
    title: MultilingualText;
    description: MultilingualText;
    difficulty: DifficultyLevel;
    estimatedMinutes: number;
    concepts: EmojiConcept[];
    prerequisites: string[];
    steps: TutorialStep[];
    tags?: string[];
    author?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Lesson category for organization
 */
export interface LessonCategory {
    id: string;
    name: MultilingualText;
    description: MultilingualText;
    icon: string;
    lessons: string[];
    order: number;
}

/**
 * User progress on a single lesson
 */
export interface TutorialProgress {
    lessonId: string;
    userId: string;
    currentStep: number;
    completedSteps: number[];
    started: boolean;
    completed: boolean;
    startedAt: number;
    completedAt?: number;
    timeSpentSeconds: number;
    attempts: number;
    hintsUsed: number;
}

/**
 * Step validation result
 */
export interface ValidationResult {
    valid: boolean;
    passed: ValidationRule[];
    failed: ValidationRule[];
    feedback?: MultilingualText;
    nextHint?: MultilingualText;
}

/**
 * Achievement definition
 */
export interface Achievement {
    id: string;
    name: MultilingualText;
    description: MultilingualText;
    icon: string;
    criteria: {
        type: 'lessons_completed' | 'streak' | 'speed' | 'accuracy' | 'custom';
        value: number;
        lessonIds?: string[];
    };
    points: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * User achievement record
 */
export interface UserAchievement {
    achievementId: string;
    userId: string;
    earnedAt: number;
    metadata?: Record<string, unknown>;
}

/**
 * Curriculum structure
 */
export interface Curriculum {
    id: string;
    name: MultilingualText;
    description: MultilingualText;
    categories: LessonCategory[];
    achievements: Achievement[];
    totalLessons: number;
    estimatedHours: number;
}

/**
 * Tutorial service interface
 */
export interface TutorialService {
    getLessons(): Promise<TutorialLesson[]>;
    getLesson(id: string): Promise<TutorialLesson | null>;
    getProgress(userId: string): Promise<TutorialProgress[]>;
    updateProgress(progress: TutorialProgress): Promise<void>;
    validateStep(lessonId: string, stepIndex: number, code: string, output: string[]): Promise<ValidationResult>;
    getHint(lessonId: string, stepIndex: number): Promise<MultilingualText | null>;
    getAchievements(userId: string): Promise<UserAchievement[]>;
    checkAchievements(userId: string): Promise<Achievement[]>;
}

/**
 * Validate lesson step based on expected output
 */
export function validateStepOutput(
    step: TutorialStep,
    actualOutput: string[]
): ValidationResult {
    const passed: ValidationRule[] = [];
    const failed: ValidationRule[] = [];

    // If no expected output, step is valid
    if (!step.expectedOutput || step.expectedOutput.length === 0) {
        return { valid: true, passed: [], failed: [] };
    }

    // Check output matches
    const outputMatches =
        actualOutput.length === step.expectedOutput.length &&
        actualOutput.every((out, i) => out === step.expectedOutput![i]);

    const rule: ValidationRule = {
        type: 'output_matches',
        value: step.expectedOutput,
    };

    if (outputMatches) {
        passed.push(rule);
    } else {
        failed.push(rule);
    }

    return {
        valid: failed.length === 0,
        passed,
        failed,
    };
}

/**
 * Get localized text based on language preference
 */
export function getLocalizedText(
    text: MultilingualText,
    language: SupportedLanguage = 'en'
): string {
    return text[language] || text.en;
}
