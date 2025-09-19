import { motion } from 'framer-motion';
import { LearningModule } from '../types';

interface ProgressMapProps {
  modules: LearningModule[];
  unlockedIds: string[];
  activeModuleId: string | null;
  onSelect: (module: LearningModule) => void;
}

export const ProgressMap = ({ modules, unlockedIds, activeModuleId, onSelect }: ProgressMapProps) => {
  const unlockedSet = new Set(unlockedIds);

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-2xl text-white">Adventure Progress Map</h3>
          <p className="text-sm text-slate-300">Unlock checkpoints by completing mini-games. Follow the glowing path.</p>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-stretch gap-6 min-w-max">
          {modules.map((module, index) => {
            const unlocked = unlockedSet.has(module.id);
            const isActive = activeModuleId === module.id;
            const isNext = index === unlockedSet.size;

            return (
              <motion.button
                key={module.id}
                onClick={() => onSelect(module)}
                whileHover={{ translateY: -6 }}
                className={`relative w-60 rounded-3xl border px-6 py-6 text-left transition-all ${
                  isActive
                    ? 'border-aurora shadow-glow'
                    : unlocked
                    ? 'border-moss/60'
                    : isNext
                    ? 'border-sunshine/60 border-dashed'
                    : 'border-white/10'
                } bg-white/5 backdrop-blur`}
              >
                <span className="block text-xs uppercase tracking-widest text-slate-300 mb-2">
                  {module.checkpointLabel}
                </span>
                <h4 className="font-display text-xl text-white mb-2">{module.name}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{module.summary}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                  <span>{module.miniGame.durationMinutes} min burst</span>
                  <span>{module.miniGame.reward.points} pts</span>
                </div>

                {unlocked && (
                  <motion.span
                    layoutId="checkpoint-glow"
                    className="absolute inset-0 rounded-3xl border border-aurora/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="absolute left-0 right-0 bottom-8 h-1 bg-gradient-to-r from-white/10 via-aurora/40 to-white/5" />
      </div>
    </section>
  );
};
