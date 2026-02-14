// OpenKernel EDU - Beginner Walkthrough Definitions
// Step-by-step guided experiences for first-time users

export interface WalkthroughStep {
  id: string;
  guideTextKey: string;       // i18n key for the guide bubble
  targetAction: 'tap-emoji' | 'type-number' | 'type-register' | 'press-run' | 'celebrate';
  targetEmoji?: string;       // Which emoji should glow
  targetValue?: string;       // Expected input value
  codeSnapshot: string;       // What the code looks like after this step
  explanationKey: string;     // i18n key for educational context
  visualHighlight?: 'palette' | 'editor' | 'run-btn' | 'output' | 'cpu';
}

export interface Walkthrough {
  id: string;
  titleKey: string;
  descriptionKey: string;
  targetOutput: string[];
  steps: WalkthroughStep[];
}

export const WALKTHROUGHS: Walkthrough[] = [
  {
    id: 'hello-world',
    titleKey: 'beginner.wt_hello_title',
    descriptionKey: 'beginner.wt_hello_desc',
    targetOutput: ['42'],
    steps: [
      {
        id: 'hw-1',
        guideTextKey: 'beginner.wt_hello_s1',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F4E5}',  // 📥
        codeSnapshot: '\u{1F4E5} ',
        explanationKey: 'beginner.wt_hello_s1_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'hw-2',
        guideTextKey: 'beginner.wt_hello_s2',
        targetAction: 'type-number',
        targetValue: '42',
        codeSnapshot: '\u{1F4E5} 42',
        explanationKey: 'beginner.wt_hello_s2_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'hw-3',
        guideTextKey: 'beginner.wt_hello_s3',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F5A8}\uFE0F',  // 🖨️
        codeSnapshot: '\u{1F4E5} 42\n\u{1F5A8}\uFE0F',
        explanationKey: 'beginner.wt_hello_s3_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'hw-4',
        guideTextKey: 'beginner.wt_hello_s4',
        targetAction: 'tap-emoji',
        targetEmoji: '\u23F9\uFE0F',  // ⏹️
        codeSnapshot: '\u{1F4E5} 42\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_hello_s4_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'hw-5',
        guideTextKey: 'beginner.wt_hello_s5',
        targetAction: 'press-run',
        codeSnapshot: '\u{1F4E5} 42\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_hello_s5_explain',
        visualHighlight: 'run-btn',
      },
      {
        id: 'hw-6',
        guideTextKey: 'beginner.wt_hello_s6',
        targetAction: 'celebrate',
        codeSnapshot: '\u{1F4E5} 42\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_hello_s6_explain',
        visualHighlight: 'output',
      },
    ],
  },
  {
    id: 'emoji-math',
    titleKey: 'beginner.wt_math_title',
    descriptionKey: 'beginner.wt_math_desc',
    targetOutput: ['15'],
    steps: [
      {
        id: 'math-1',
        guideTextKey: 'beginner.wt_math_s1',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F4E5}',
        codeSnapshot: '\u{1F4E5} ',
        explanationKey: 'beginner.wt_math_s1_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'math-2',
        guideTextKey: 'beginner.wt_math_s2',
        targetAction: 'type-number',
        targetValue: '10',
        codeSnapshot: '\u{1F4E5} 10',
        explanationKey: 'beginner.wt_math_s2_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'math-3',
        guideTextKey: 'beginner.wt_math_s3',
        targetAction: 'tap-emoji',
        targetEmoji: '\u2795',  // ➕
        codeSnapshot: '\u{1F4E5} 10\n\u2795 ',
        explanationKey: 'beginner.wt_math_s3_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'math-4',
        guideTextKey: 'beginner.wt_math_s4',
        targetAction: 'type-number',
        targetValue: '5',
        codeSnapshot: '\u{1F4E5} 10\n\u2795 5',
        explanationKey: 'beginner.wt_math_s4_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'math-5',
        guideTextKey: 'beginner.wt_math_s5',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F5A8}\uFE0F',
        codeSnapshot: '\u{1F4E5} 10\n\u2795 5\n\u{1F5A8}\uFE0F',
        explanationKey: 'beginner.wt_math_s5_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'math-6',
        guideTextKey: 'beginner.wt_math_s6',
        targetAction: 'tap-emoji',
        targetEmoji: '\u23F9\uFE0F',
        codeSnapshot: '\u{1F4E5} 10\n\u2795 5\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_math_s6_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'math-7',
        guideTextKey: 'beginner.wt_math_s7',
        targetAction: 'press-run',
        codeSnapshot: '\u{1F4E5} 10\n\u2795 5\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_math_s7_explain',
        visualHighlight: 'run-btn',
      },
      {
        id: 'math-8',
        guideTextKey: 'beginner.wt_math_s8',
        targetAction: 'celebrate',
        codeSnapshot: '\u{1F4E5} 10\n\u2795 5\n\u{1F5A8}\uFE0F\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_math_s8_explain',
        visualHighlight: 'output',
      },
    ],
  },
  {
    id: 'countdown',
    titleKey: 'beginner.wt_count_title',
    descriptionKey: 'beginner.wt_count_desc',
    targetOutput: ['5', '4', '3', '2', '1'],
    steps: [
      {
        id: 'count-1',
        guideTextKey: 'beginner.wt_count_s1',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F4E5}',
        codeSnapshot: '\u{1F4E5} ',
        explanationKey: 'beginner.wt_count_s1_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-2',
        guideTextKey: 'beginner.wt_count_s2',
        targetAction: 'type-number',
        targetValue: '5',
        codeSnapshot: '\u{1F4E5} 5',
        explanationKey: 'beginner.wt_count_s2_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'count-3',
        guideTextKey: 'beginner.wt_count_s3',
        targetAction: 'tap-emoji',
        targetEmoji: '\u{1F5A8}\uFE0F',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F',
        explanationKey: 'beginner.wt_count_s3_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-4',
        guideTextKey: 'beginner.wt_count_s4',
        targetAction: 'tap-emoji',
        targetEmoji: '\u2796',  // ➖
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 ',
        explanationKey: 'beginner.wt_count_s4_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-5',
        guideTextKey: 'beginner.wt_count_s5',
        targetAction: 'type-number',
        targetValue: '1',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1',
        explanationKey: 'beginner.wt_count_s5_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'count-6',
        guideTextKey: 'beginner.wt_count_s6',
        targetAction: 'tap-emoji',
        targetEmoji: '\u2753',  // ❓
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 ',
        explanationKey: 'beginner.wt_count_s6_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-7',
        guideTextKey: 'beginner.wt_count_s7',
        targetAction: 'type-number',
        targetValue: '5',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5',
        explanationKey: 'beginner.wt_count_s7_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'count-8',
        guideTextKey: 'beginner.wt_count_s8',
        targetAction: 'tap-emoji',
        targetEmoji: '\u23ED\uFE0F',  // ⏭️
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5\n\u23ED\uFE0F ',
        explanationKey: 'beginner.wt_count_s8_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-9',
        guideTextKey: 'beginner.wt_count_s9',
        targetAction: 'type-number',
        targetValue: '1',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5\n\u23ED\uFE0F 1',
        explanationKey: 'beginner.wt_count_s9_explain',
        visualHighlight: 'editor',
      },
      {
        id: 'count-10',
        guideTextKey: 'beginner.wt_count_s10',
        targetAction: 'tap-emoji',
        targetEmoji: '\u23F9\uFE0F',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5\n\u23ED\uFE0F 1\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_count_s10_explain',
        visualHighlight: 'palette',
      },
      {
        id: 'count-11',
        guideTextKey: 'beginner.wt_count_s11',
        targetAction: 'press-run',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5\n\u23ED\uFE0F 1\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_count_s11_explain',
        visualHighlight: 'run-btn',
      },
      {
        id: 'count-12',
        guideTextKey: 'beginner.wt_count_s12',
        targetAction: 'celebrate',
        codeSnapshot: '\u{1F4E5} 5\n\u{1F5A8}\uFE0F\n\u2796 1\n\u2753 5\n\u23ED\uFE0F 1\n\u23F9\uFE0F',
        explanationKey: 'beginner.wt_count_s12_explain',
        visualHighlight: 'output',
      },
    ],
  },
];
