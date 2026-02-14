// OpenKernel EDU v2 - Global State Management (Zustand)
// Single source of truth for the entire application

import { create } from 'zustand';
import { VirtualMachine } from '../core/VirtualMachine';
import { VMState, CPUState, Program, ExecutionEvent } from '../core/types';
import { compile, CompilationResult } from '../compiler/compiler';
import { EXAMPLE_PROGRAMS } from '../tutorials/examples';

interface LessonProgress {
  lessonId: string;
  currentStep: number;
  completed: boolean;
  startedAt: number;
  completedAt?: number;
}

export type TabId = 'welcome' | 'beginner' | 'editor' | 'tutorials' | 'examples' | 'demos' | 'reference';

interface AppStore {
  // Code editor
  code: string;
  setCode: (code: string) => void;

  // VM state
  vm: VirtualMachine;
  vmState: VMState;
  compilationResult: CompilationResult | null;
  executionSpeed: number;
  isRunning: boolean;
  executionHistory: ExecutionEvent[];

  // Actions
  compileCode: () => CompilationResult;
  runProgram: () => void;
  stepProgram: () => void;
  resetVM: () => void;
  setExecutionSpeed: (speed: number) => void;
  provideInput: (value: string) => void;

  // Tutorial state
  currentLessonId: string | null;
  lessonProgress: Record<string, LessonProgress>;
  setCurrentLesson: (lessonId: string | null) => void;
  completeStep: (lessonId: string, step: number) => void;
  completeLesson: (lessonId: string) => void;

  // Welcome / Intro
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;

  // Beginner mode
  beginnerMode: boolean;
  setBeginnerMode: (on: boolean) => void;
  beginnerStep: number;
  setBeginnerStep: (step: number) => void;
  activeWalkthroughId: string | null;
  setActiveWalkthrough: (id: string | null) => void;

  // Live demos
  activeDemoId: string | null;
  setActiveDemo: (id: string | null) => void;

  // UI state
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  showMemoryGrid: boolean;
  toggleMemoryGrid: () => void;

  // Example programs
  loadExample: (id: string) => void;
}

// Persistence helpers
const loadPersisted = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(`openkernel-edu:${key}`);
    return stored !== null ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

const persist = (key: string, value: unknown) => {
  try { localStorage.setItem(`openkernel-edu:${key}`, JSON.stringify(value)); } catch {}
};

const createInitialVM = (): VirtualMachine => new VirtualMachine();

export const useStore = create<AppStore>((set, get) => {
  const vm = createInitialVM();
  const hasSeenIntro = loadPersisted('hasSeenIntro', false);

  return {
    // Code editor
    code: '📥 10\n➕ 5\n🖨️\n⏹️',
    setCode: (code) => set({ code }),

    // VM
    vm,
    vmState: vm.getState(),
    compilationResult: null,
    executionSpeed: 500,
    isRunning: false,
    executionHistory: [],

    compileCode: () => {
      const result = compile(get().code);
      set({ compilationResult: result });
      return result;
    },

    runProgram: () => {
      const { vm, code } = get();
      const result = compile(code);
      set({ compilationResult: result });

      if (!result.validation.valid) return;

      vm.loadProgram(result.program.instructions);
      set({ isRunning: true, executionHistory: [] });

      const events: ExecutionEvent[] = [];
      const unsub = vm.onEvent((event) => events.push(event));

      vm.run();
      unsub();

      set({
        vmState: vm.getState(),
        isRunning: false,
        executionHistory: events,
      });
    },

    stepProgram: () => {
      const { vm, compilationResult, code } = get();

      if (!compilationResult || vm.getState().cpu.halted) {
        const result = compile(code);
        set({ compilationResult: result });
        if (!result.validation.valid) return;
        vm.loadProgram(result.program.instructions);
        set({ vmState: vm.getState(), executionHistory: [] });
      }

      const events: ExecutionEvent[] = [...get().executionHistory];
      const unsub = vm.onEvent((event) => events.push(event));
      vm.step();
      unsub();

      set({ vmState: vm.getState(), executionHistory: events });
    },

    resetVM: () => {
      const { vm } = get();
      vm.reset();
      set({
        vmState: vm.getState(),
        compilationResult: null,
        isRunning: false,
        executionHistory: [],
      });
    },

    setExecutionSpeed: (speed) => set({ executionSpeed: speed }),

    provideInput: (value) => {
      get().vm.provideInput(value);
    },

    // Tutorial state
    currentLessonId: null,
    lessonProgress: {},
    setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId }),

    completeStep: (lessonId, step) => {
      const progress = get().lessonProgress;
      const current = progress[lessonId] || {
        lessonId,
        currentStep: 0,
        completed: false,
        startedAt: Date.now(),
      };
      set({
        lessonProgress: {
          ...progress,
          [lessonId]: { ...current, currentStep: Math.max(current.currentStep, step + 1) },
        },
      });
    },

    completeLesson: (lessonId) => {
      const progress = get().lessonProgress;
      const current = progress[lessonId] || {
        lessonId,
        currentStep: 0,
        completed: false,
        startedAt: Date.now(),
      };
      set({
        lessonProgress: {
          ...progress,
          [lessonId]: { ...current, completed: true, completedAt: Date.now() },
        },
      });
    },

    // Welcome / Intro
    hasSeenIntro,
    setHasSeenIntro: (seen) => {
      persist('hasSeenIntro', seen);
      set({ hasSeenIntro: seen });
    },

    // Beginner mode
    beginnerMode: loadPersisted('beginnerMode', false),
    setBeginnerMode: (on) => {
      persist('beginnerMode', on);
      set({ beginnerMode: on });
    },
    beginnerStep: 0,
    setBeginnerStep: (step) => set({ beginnerStep: step }),
    activeWalkthroughId: null,
    setActiveWalkthrough: (id) => set({ activeWalkthroughId: id, beginnerStep: 0 }),

    // Live demos
    activeDemoId: null,
    setActiveDemo: (id) => set({ activeDemoId: id }),

    // UI state
    activeTab: hasSeenIntro ? 'editor' : 'welcome',
    setActiveTab: (tab) => set({ activeTab: tab }),
    darkMode: loadPersisted('darkMode', true),
    toggleDarkMode: () => set((s) => {
      persist('darkMode', !s.darkMode);
      return { darkMode: !s.darkMode };
    }),
    language: loadPersisted('language', 'en'),
    setLanguage: (lang) => {
      persist('language', lang);
      set({ language: lang });
    },
    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    showMemoryGrid: false,
    toggleMemoryGrid: () => set((s) => ({ showMemoryGrid: !s.showMemoryGrid })),

    loadExample: (id) => {
      const example = EXAMPLE_PROGRAMS.find(e => e.id === id);
      if (example) {
        set({ code: example.code });
        get().resetVM();
      }
    },
  };
});
