import { motion } from 'framer-motion';
import { LeaderboardEntry, RewardBadge } from '../types';

interface RewardCenterProps {
  badges: RewardBadge[];
  unlocked: string[];
  streak: number;
  totalPoints: number;
  leaderboard: LeaderboardEntry[];
}

export const RewardCenter = ({ badges, unlocked, streak, totalPoints, leaderboard }: RewardCenterProps) => {
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

      {leaderboard.length > 0 && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h4 className="text-lg font-display text-white mb-3">Weekly Leaderboard</h4>
          <ol className="space-y-2">
            {leaderboard.map((entry, index) => (
              <li key={entry.uid} className="flex items-center justify-between text-sm text-slate-200">
                <span className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-6">#{index + 1}</span>
                  <span
                    className="h-8 w-8 rounded-full border border-white/20 bg-cover bg-center"
                    style={{
                      background: entry.avatar || 'linear-gradient(135deg,#1d4ed8,#9333ea)',
                    }}
                  />
                  <span className="font-medium">{entry.name}</span>
                </span>
                <span className="text-xs text-slate-300">{entry.points} XP</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};
