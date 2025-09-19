import { motion } from 'framer-motion';

interface HeaderStatsProps {
  name: string;
  avatar: string;
  streak: number;
  points: number;
  onboardingScore: number;
}

export const HeaderStats = ({ name, avatar, streak, points, onboardingScore }: HeaderStatsProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-white/5 border border-white/10 px-8 py-6">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl border border-white/20 shadow-inner flex items-center justify-center text-midnight font-display text-xl"
          style={{ backgroundImage: avatar, backgroundSize: 'cover' }}
        >
          {name
            .split(' ')
            .map((piece) => piece.charAt(0).toUpperCase())
            .join('')}
        </div>
        <div>
          <p className="text-sm text-slate-300 uppercase tracking-wider">Math Mentor welcomes</p>
          <h2 className="text-2xl font-display text-white">{name}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
            <span>Portal Score: {onboardingScore}</span>
            <span className="inline-flex h-1 w-1 rounded-full bg-white/40" />
            <span>Daily Streak: {streak}🔥</span>
          </div>
        </div>
      </div>

      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-aurora/20 to-ember/20 border border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-300">Total Points</p>
          <p className="text-2xl font-semibold text-white">{points}</p>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-moss/20 to-sunshine/20 border border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-300">Streak Power</p>
          <p className="text-2xl font-semibold text-white">{streak}</p>
        </div>
      </motion.div>
    </header>
  );
};
