import { useState } from 'react';
import { motion } from 'framer-motion';
import { DailyChallenge, DailyChallengeRunSummary } from '../types';
import { DailyChallengeRunner } from './DailyChallengeRunner';

interface DailyChallengePanelProps {
  challenge: DailyChallenge;
  completed: boolean;
  onComplete: (challenge: DailyChallenge, summary: DailyChallengeRunSummary) => void;
  summary?: DailyChallengeRunSummary | null;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
};

export const DailyChallengePanel = ({ challenge, completed, onComplete, summary }: DailyChallengePanelProps) => {
  const [showRunner, setShowRunner] = useState(false);

  const handleLaunch = () => {
    if (completed) return;
    setShowRunner(true);
  };

  const handleClose = () => {
    setShowRunner(false);
  };

  const handleComplete = (runChallenge: DailyChallenge, runSummary: DailyChallengeRunSummary) => {
    onComplete(runChallenge, runSummary);
    setShowRunner(false);
  };

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-6 py-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl text-white">Daily Challenge</h3>
        <span className="px-3 py-1 rounded-full bg-aurora/20 text-xs uppercase tracking-widest text-aurora">
          {challenge.timeLimitMinutes} min burst
        </span>
      </div>

      <div className="flex-1 space-y-4">
        <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>
        <ul className="space-y-3">
          {challenge.tasks.map((task) => (
            <li key={task} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-aurora" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: completed ? 1 : 1.03 }}
        whileTap={{ scale: completed ? 1 : 0.97 }}
        disabled={completed}
        onClick={handleLaunch}
        className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-all ${
          completed
            ? 'bg-white/10 text-slate-300 border border-white/10 cursor-not-allowed'
            : 'bg-gradient-to-r from-aurora to-ember text-midnight shadow-glow'
        }`}
      >
        {completed ? 'Challenge Completed' : `Start Challenge (+${challenge.reward.points} pts)`}
      </motion.button>

      {summary && summary.challengeId === challenge.id && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">Last run recap</p>
            <span className="text-xs uppercase tracking-widest text-slate-400">
              {formatDuration(summary.timeElapsedSeconds)} spent
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-400">Solved</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{summary.solved}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-400">Accuracy</dt>
              <dd className="mt-1 text-lg font-semibold text-aurora">{summary.accuracy}%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-400">Best combo</dt>
              <dd className="mt-1 text-lg font-semibold text-ember">
                {summary.bestCombo > 0 ? `x${summary.bestCombo}` : '—'}
              </dd>
            </div>
          </dl>

          {summary.completed && summary.allSolved && summary.bestCombo > 0 && (
            <p className="mt-3 text-xs text-aurora">
              Full clear! Combo streak peaked at x{summary.bestCombo}.
            </p>
          )}

          {!summary.allSolved && (
            <p className="mt-3 text-xs text-slate-300">
              Session closed with {summary.solved} prompts answered—try again tomorrow to push the streak higher.
            </p>
          )}
        </div>
      )}

      <DailyChallengeRunner
        challenge={showRunner ? challenge : null}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </section>
  );
};
