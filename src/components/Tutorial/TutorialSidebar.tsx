import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { LESSONS, Lesson } from '../../tutorials/lessons';
import './Tutorial.css';

export default function TutorialSidebar() {
  const { t } = useTranslation();
  const { currentLessonId, setCurrentLesson, lessonProgress, setCode, completeStep } = useStore();
  const [showHint, setShowHint] = useState(false);

  const currentLesson = LESSONS.find(l => l.id === currentLessonId);
  const currentProgress = currentLessonId ? lessonProgress[currentLessonId] : null;
  const currentStep = currentProgress?.currentStep ?? 0;

  if (!currentLesson) {
    return (
      <div className="tutorial-sidebar">
        <h3 className="panel-title">{t('tutorial.title')}</h3>
        <div className="lesson-list">
          {LESSONS.map((lesson, idx) => {
            const progress = lessonProgress[lesson.id];
            const completed = progress?.completed;
            return (
              <button
                key={lesson.id}
                className={`lesson-card ${completed ? 'lesson-completed' : ''}`}
                onClick={() => setCurrentLesson(lesson.id)}
              >
                <div className="lesson-card-header">
                  <span className="lesson-number">{idx + 1}</span>
                  <span className={`lesson-difficulty lesson-${lesson.difficulty}`}>
                    {t(`tutorial.difficulty.${lesson.difficulty}`)}
                  </span>
                </div>
                <h4 className="lesson-title">{lesson.title}</h4>
                <p className="lesson-description">{lesson.description}</p>
                <div className="lesson-meta">
                  <span className="lesson-time">{lesson.estimatedMinutes} min</span>
                  <span className="lesson-concepts">{lesson.concepts.join(', ')}</span>
                  {completed && <span className="lesson-check">&#10003;</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const step = currentLesson.steps[currentStep];
  const totalSteps = currentLesson.steps.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="tutorial-sidebar">
      <div className="tutorial-header">
        <button className="back-btn" onClick={() => setCurrentLesson(null)}>&#8592; Back</button>
        <h3 className="tutorial-lesson-title">{currentLesson.title}</h3>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="progress-text">
          {t('tutorial.step', { current: currentStep + 1, total: totalSteps })}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step && (
          <motion.div
            key={currentStep}
            className="step-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="step-instruction">{step.instruction}</p>

            <div className="step-code-block">
              <pre className="step-code">{step.emojiCode}</pre>
              <button
                className="try-it-btn"
                onClick={() => setCode(step.emojiCode)}
              >
                {t('tutorial.tryIt')}
              </button>
            </div>

            {step.explanation && (
              <div className="step-explanation">
                <p>{step.explanation}</p>
              </div>
            )}

            {step.hint && (
              <>
                <button
                  className="hint-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? 'Hide Hint' : t('tutorial.hint')}
                </button>
                {showHint && (
                  <motion.div
                    className="hint-box"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    {step.hint}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tutorial-nav">
        <button
          className="nav-btn"
          disabled={currentStep === 0}
          onClick={() => {
            const prev = Math.max(0, currentStep - 1);
            completeStep(currentLesson.id, prev);
            setShowHint(false);
          }}
        >
          {t('tutorial.previous')}
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            className="nav-btn nav-next"
            onClick={() => {
              completeStep(currentLesson.id, currentStep);
              setShowHint(false);
            }}
          >
            {t('tutorial.next')}
          </button>
        ) : (
          <button
            className="nav-btn nav-complete"
            onClick={() => {
              const store = useStore.getState();
              store.completeLesson(currentLesson.id);
              store.setCurrentLesson(null);
            }}
          >
            {t('tutorial.complete')} &#127881;
          </button>
        )}
      </div>
    </div>
  );
}
