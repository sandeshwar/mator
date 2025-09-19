import { motion } from 'framer-motion';
import { Audience } from '../types';

interface ScenarioShowcaseProps {
  focus: Audience;
}

const scenarios: Record<Audience, { title: string; description: string; action: string }[]> = {
  college: [
    {
      title: 'Exam Optimiser',
      description: 'Use probability weights to schedule revision sprints that match your exam risk profile.',
      action: 'Deploy a 10-minute plan',
    },
    {
      title: 'Campus Budgeteer',
      description: 'Track spending vs. savings with interactive ratios before the next tuition bill drops.',
      action: 'Generate insights',
    },
  ],
  professional: [
    {
      title: 'Portfolio Pulse',
      description: 'Simulate market swings and stress test how your investments react over a quarter.',
      action: 'Run stress test',
    },
    {
      title: 'Product Launch Odds',
      description: 'Estimate launch scenarios and expected revenue bands before presenting to leadership.',
      action: 'Model outcomes',
    },
  ],
};

export const ScenarioShowcase = ({ focus }: ScenarioShowcaseProps) => {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-display text-white">Real-World Math Moves</h3>
          <p className="text-sm text-slate-300">Pick a scenario that mirrors your world and apply today’s skills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios[focus].map((scenario) => (
          <motion.div
            key={scenario.title}
            whileHover={{ translateY: -4 }}
            className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5"
          >
            <h4 className="font-display text-xl text-white mb-2">{scenario.title}</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{scenario.description}</p>
            <button className="mt-4 inline-flex items-center rounded-full border border-aurora text-aurora px-4 py-2 text-xs uppercase tracking-widest">
              {scenario.action}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
