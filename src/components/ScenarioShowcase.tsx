import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { scenariosForAudience } from '../data/scenarios';
import { Audience, ScenarioCompletionPayload, ScenarioDefinition } from '../types';
import { ScenarioSimulator } from './ScenarioSimulator';

interface ScenarioShowcaseProps {
  focus: Audience;
  completedScenarioIds: string[];
  onScenarioComplete: (payload: ScenarioCompletionPayload) => void;
}

export const ScenarioShowcase = ({ focus, completedScenarioIds, onScenarioComplete }: ScenarioShowcaseProps) => {
  const scenarios = useMemo(() => scenariosForAudience(focus), [focus]);
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition | null>(null);

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-display text-white">Real-World Math Moves</h3>
          <p className="text-sm text-slate-300">Pick a scenario that mirrors your world and apply today’s skills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => {
          const persona = scenario.personas[focus];
          const completed = completedScenarioIds.includes(scenario.id);

          return (
            <motion.div
              key={scenario.id}
              whileHover={{ translateY: -4 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-5"
            >
              <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${scenario.accent}`} aria-hidden />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs uppercase tracking-widest text-white">
                  <span>{scenario.icon}</span>
                  <span>{scenario.moduleContext.name}</span>
                </div>
                <h4 className="font-display text-xl text-white mt-3">{scenario.title}</h4>
                <p className="text-sm text-slate-200 leading-relaxed mt-2">{persona.cardDescription}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-slate-200">Objective</p>
                <p className="text-sm text-slate-100 leading-relaxed">{persona.objective}</p>
                <button
                  type="button"
                  onClick={() => setActiveScenario(scenario)}
                  className="mt-4 inline-flex items-center rounded-full border border-white/20 bg-slate-950/40 px-4 py-2 text-xs uppercase tracking-widest text-aurora hover:border-aurora hover:text-white"
                >
                  {completed ? 'Review your log' : 'Launch simulator'}
                </button>
                {completed && (
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-moss/40 bg-moss/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-moss">
                    Completed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {activeScenario && (
        <ScenarioSimulator
          key={activeScenario.id}
          open={Boolean(activeScenario)}
          scenario={activeScenario}
          focus={focus}
          completed={completedScenarioIds.includes(activeScenario.id)}
          onClose={() => setActiveScenario(null)}
          onObjectiveMet={(payload) => {
            onScenarioComplete(payload);
            setActiveScenario(null);
          }}
        />
      )}
    </section>
  );
};
