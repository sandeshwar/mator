import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DailyChallenge,
  DailyChallengePrompt,
  DailyChallengeRunResult,
  DailyChallengeRunSummary,
} from '../types';

interface DailyChallengeRunnerProps {
  challenge: DailyChallenge | null;
  onClose: () => void;
  onComplete: (challenge: DailyChallenge, summary: DailyChallengeRunSummary) => void;
}

const formatTime = (value: number) => {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const DailyChallengeRunner = ({ challenge, onClose, onComplete }: DailyChallengeRunnerProps) => {
  const prompts = useMemo<DailyChallengePrompt[]>(() => {
    if (!challenge) return [];
    if (challenge.prompts && challenge.prompts.length > 0) {
      return challenge.prompts;
    }

    return challenge.tasks.map((task, index) => ({
      id: `${challenge.id}-${index}`,
      question: task,
      choices: ['Completed', 'Need more time'],
      correctIndex: 0,
    }));
  }, [challenge]);

  const totalSeconds = (challenge?.timeLimitMinutes ?? 0) * 60;

  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<DailyChallengeRunResult[]>([]);
  const [combo, setCombo] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (!challenge) return;
    setTimeRemaining(challenge.timeLimitMinutes * 60);
    setCurrentIndex(0);
    setResults([]);
    setCombo(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setHasFinished(false);
  }, [challenge]);

  const finalizeRun = useCallback(
    (finalResults: DailyChallengeRunResult[], completed: boolean) => {
      if (!challenge || hasFinished) return;

      const solved = finalResults.length;
      const correct = finalResults.filter((item) => item.correct).length;
      let bestCombo = 0;
      let streak = 0;
      finalResults.forEach((item) => {
        if (item.correct) {
          streak += 1;
          bestCombo = Math.max(bestCombo, streak);
        } else {
          streak = 0;
        }
      });
      const allSolved = finalResults.length === prompts.length;

      const summary: DailyChallengeRunSummary = {
        challengeId: challenge.id,
        solved,
        correct,
        accuracy: solved === 0 ? 0 : Math.round((correct / solved) * 100),
        bestCombo,
        completed: completed && allSolved,
        allSolved,
        timeElapsedSeconds: Math.max(0, challenge.timeLimitMinutes * 60 - timeRemaining),
        results: finalResults,
      };

      setHasFinished(true);
      onComplete(challenge, summary);
      onClose();
    },
    [challenge, hasFinished, onClose, onComplete, prompts.length, timeRemaining]
  );

  useEffect(() => {
    if (!challenge || hasFinished) return;
    if (timeRemaining <= 0) {
      finalizeRun(results, false);
      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [challenge, finalizeRun, hasFinished, results, timeRemaining]);

  const handleSelect = (choiceIndex: number) => {
    if (!challenge) return;
    if (selectedChoice !== null) return;

    const prompt = prompts[currentIndex];
    if (!prompt) return;

    const correct = choiceIndex === prompt.correctIndex;
    const nextResult: DailyChallengeRunResult = { promptId: prompt.id, correct };

    setResults((prev) => [...prev, nextResult]);
    setCombo((prev) => (correct ? prev + 1 : 0));
    setSelectedChoice(choiceIndex);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex >= prompts.length - 1) {
      finalizeRun(results, true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const answeredCount = results.length;
  const accuracy = answeredCount
    ? Math.round((results.filter((result) => result.correct).length / answeredCount) * 100)
    : 0;
  const currentPrompt = prompts[currentIndex];
  const progress = prompts.length === 0 ? 0 : Math.min(100, (answeredCount / prompts.length) * 100);
  const lastResult = results[results.length - 1];
  const showHint = showFeedback && lastResult && !lastResult.correct && currentPrompt?.hint;

  return (
    <AnimatePresence>
      {challenge && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-midnight/90 p-8 text-white shadow-glow"
          >
            <header className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Now playing</p>
                <h2 className="font-display text-2xl text-white">{challenge.title}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-200">
                <span className="rounded-full border border-aurora/50 bg-aurora/10 px-4 py-1 font-semibold text-aurora">
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-slate-300">Accuracy {accuracy}%</span>
              </div>
            </header>

            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-aurora to-ember transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
                <span>
                  Question {Math.min(answeredCount + 1, prompts.length)} / {prompts.length}
                </span>
                <span>Combo streak: {combo}</span>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {currentPrompt ? (
                <>
                  <motion.h3 layout className="font-display text-xl text-white">
                    {currentPrompt.question}
                  </motion.h3>
                  <div className="grid gap-3">
                    {currentPrompt.choices.map((choice, index) => {
                      const isSelected = selectedChoice === index;
                      const isCorrectChoice = currentPrompt.correctIndex === index;
                      const showState = showFeedback && (isSelected || isCorrectChoice);

                      return (
                        <motion.button
                          key={choice}
                          whileHover={{ scale: selectedChoice === null ? 1.02 : 1 }}
                          whileTap={{ scale: selectedChoice === null ? 0.98 : 1 }}
                          disabled={selectedChoice !== null}
                          onClick={() => handleSelect(index)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                            showState
                              ? isCorrectChoice
                                ? 'border-aurora bg-aurora/10 text-aurora'
                                : 'border-ember bg-ember/10 text-ember'
                              : 'border-white/10 bg-white/5 text-slate-100 hover:border-aurora/40 hover:bg-aurora/10'
                          }`}
                        >
                          {choice}
                        </motion.button>
                      );
                    })}
                  </div>

                  {showFeedback && lastResult && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        lastResult.correct
                          ? 'border-aurora/40 bg-aurora/10 text-aurora'
                          : 'border-ember/40 bg-ember/10 text-ember'
                      }`}
                    >
                      {lastResult.correct ? 'Nice! Combo climbing.' : 'Combo reset. Shake it off and keep going!'}
                      {showHint && <p className="mt-2 text-xs text-slate-200">Hint: {currentPrompt.hint}</p>}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-sm text-slate-300">
                  No prompts available for this challenge just yet.
                </p>
              )}
            </div>

            <footer className="mt-8 flex justify-end">
              {showFeedback ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-aurora to-ember px-6 py-2 text-sm font-semibold text-midnight shadow-glow"
                >
                  {currentIndex >= prompts.length - 1 ? 'Finish Run' : 'Next Prompt'}
                </button>
              ) : (
                <button
                  onClick={() => finalizeRun(results, false)}
                  className="inline-flex items-center rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-ember/60 hover:text-ember"
                >
                  Exit Session
                </button>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
