import { motion } from 'framer-motion';
import { RewardBadge } from '../types';

interface RewardCenterProps {
  badges: RewardBadge[];
  unlocked: string[];
  streak: number;
  totalPoints: number;
}

export const RewardCenter = ({ badges, unlocked, streak, totalPoints }: RewardCenterProps) => {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-display text-white">Rewards Vault</h3>
          <p className="text-sm text-slate-300">Maintain streaks and score big to unlock hidden emblems.</p>
        </div>
        <div className="text-xs text-slate-300">
          <p>Streak: {streak} days</p>
          <p>Total points: {totalPoints}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const isUnlocked = unlocked.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              layout
              className={`rounded-3xl border px-5 py-5 transition-all ${
                isUnlocked ? 'border-moss bg-moss/20 text-white' : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              <h4 className="font-display text-xl mb-2">{badge.name}</h4>
              <p className="text-sm leading-relaxed">{badge.description}</p>
              <p className="text-xs uppercase tracking-widest mt-4">Goal: {badge.threshold}</p>
              {isUnlocked && <p className="mt-4 text-sm text-moss">Unlocked ✔</p>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
