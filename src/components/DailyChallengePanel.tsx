import { motion } from 'framer-motion';
import { DailyChallenge } from '../types';

interface DailyChallengePanelProps {
  challenge: DailyChallenge;
  completed: boolean;
  onComplete: (challenge: DailyChallenge) => void;
}

export const DailyChallengePanel = ({ challenge, completed, onComplete }: DailyChallengePanelProps) => {
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
        onClick={() => onComplete(challenge)}
        className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-all ${
          completed
            ? 'bg-white/10 text-slate-300 border border-white/10 cursor-not-allowed'
            : 'bg-gradient-to-r from-aurora to-ember text-midnight shadow-glow'
        }`}
      >
        {completed ? 'Challenge Completed' : `Start Challenge (+${challenge.reward.points} pts)`}
      </motion.button>
    </section>
  );
};
