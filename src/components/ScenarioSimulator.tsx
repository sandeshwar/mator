import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Audience, ScenarioCompletionPayload, ScenarioDefinition } from '../types';

interface ScenarioSimulatorProps {
  scenario: ScenarioDefinition;
  focus: Audience;
  open: boolean;
  completed: boolean;
  onClose: () => void;
  onObjectiveMet: (payload: ScenarioCompletionPayload) => void;
}

const withinTarget = (value: number, [min, max]: [number, number]) => value >= min && value <= max;

const formatValue = (value: number, unit?: string) => {
  const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  if (!unit) {
    return formatted;
  }
  const trimmed = unit.trim();
  if (trimmed.startsWith('%')) {
    const descriptor = trimmed.slice(1).trim();
    return `${formatted}%${descriptor ? ` ${descriptor}` : ''}`;
  }
  return `${formatted} ${trimmed}`;
};

export const ScenarioSimulator = ({
  scenario,
  focus,
  open,
  completed,
  onClose,
  onObjectiveMet,
}: ScenarioSimulatorProps) => {
  const persona = scenario.personas[focus];
  const [values, setValues] = useState<Record<string, number>>(() => {
    const entries = scenario.parameters.map((parameter) => [parameter.id, parameter.defaultValue]);
    return Object.fromEntries(entries);
  });
  const [claimed, setClaimed] = useState<boolean>(completed);

  useEffect(() => {
    setClaimed(completed);
  }, [completed]);

  useEffect(() => {
    setValues(() => {
      const entries = scenario.parameters.map((parameter) => [parameter.id, parameter.defaultValue]);
      return Object.fromEntries(entries);
    });
  }, [scenario]);

  const readiness = useMemo(() => {
    const met = scenario.parameters.every((parameter) => withinTarget(values[parameter.id], parameter.targetRange));
    const dialed = scenario.parameters.filter((parameter) => withinTarget(values[parameter.id], parameter.targetRange)).length;
    const ratio = Math.round((dialed / scenario.parameters.length) * 100);
    return {
      met,
      dialed,
      ratio,
    };
  }, [scenario.parameters, values]);

  const handleClaim = () => {
    if (!readiness.met || claimed) {
      return;
    }
    onObjectiveMet({
      scenarioId: scenario.id,
      reward: scenario.reward,
    });
    setClaimed(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/90 px-6 py-6 shadow-2xl"
            initial={{ translateY: 32, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 32, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${scenario.accent} px-4 py-1 text-sm text-white`}> 
                  <span>{scenario.icon}</span>
                  <span>{scenario.moduleContext.name}</span>
                </div>
                <h3 className="mt-4 text-2xl font-display text-white">{scenario.title}</h3>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">{persona.narrative}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-slate-200 hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-sm font-semibold text-white uppercase tracking-widest">Forest Insight</h4>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">{scenario.moduleContext.insight}</p>

                <h4 className="mt-6 text-sm font-semibold text-white uppercase tracking-widest">Objective</h4>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">{persona.objective}</p>

                <h4 className="mt-6 text-sm font-semibold text-white uppercase tracking-widest">Baseline Signals</h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-200">
                  {persona.baseline.map((item) => (
                    <li key={item.label} className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                      <p className="font-semibold text-white">{item.label}</p>
                      <p>{item.value}</p>
                      <p className="text-xs text-slate-300">{item.helper}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                {scenario.parameters.map((parameter) => {
                  const value = values[parameter.id];
                  const inRange = withinTarget(value, parameter.targetRange);
                  const delta = !inRange
                    ? value < parameter.targetRange[0]
                      ? parameter.targetRange[0] - value
                      : value - parameter.targetRange[1]
                    : 0;
                  return (
                    <div key={parameter.id} className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3">
                      <div className="flex items-center justify-between text-sm text-white">
                        <p className="font-medium">{parameter.label}</p>
                        <span className="text-xs uppercase tracking-widest text-slate-300">
                          {formatValue(value, parameter.unit)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">{parameter.description}</p>
                      <input
                        type="range"
                        min={parameter.min}
                        max={parameter.max}
                        step={parameter.step}
                        value={value}
                        onChange={(event) => {
                          const nextValue = Number(event.target.value);
                          setValues((prev) => ({ ...prev, [parameter.id]: nextValue }));
                        }}
                        className="mt-3 w-full accent-aurora"
                      />
                      <p className={`mt-2 text-xs ${inRange ? 'text-moss' : 'text-amber-300'}`}>
                        {inRange
                          ? parameter.insight
                          : `${parameter.caution} (${formatValue(delta, parameter.unit)} off target)`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-white">Success Criteria</p>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">{scenario.success.summary}</p>
                <ul className="mt-2 list-disc pl-5 text-xs text-slate-300 space-y-1">
                  {scenario.success.checkpoints.map((checkpoint) => (
                    <li key={checkpoint}>{checkpoint}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-center">
                <p className="text-xs uppercase tracking-widest text-slate-300">Readiness</p>
                <p className="mt-2 text-3xl font-display text-white">{readiness.ratio}%</p>
                <p className="text-xs text-slate-300">Targets dialled in: {readiness.dialed}/{scenario.parameters.length}</p>
                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={!readiness.met || claimed}
                  className={`mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                    readiness.met && !claimed
                      ? 'bg-aurora/90 text-slate-950 hover:bg-aurora'
                      : 'border border-white/10 bg-white/5 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {claimed ? 'Objective logged' : readiness.met ? 'Log scenario & claim' : 'Tune targets to unlock'}
                </button>
                <p className="mt-2 text-xs text-slate-400">
                  Reward: +{scenario.reward.points} pts{scenario.reward.badgeId ? ` · Badge: ${scenario.reward.badgeId}` : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
