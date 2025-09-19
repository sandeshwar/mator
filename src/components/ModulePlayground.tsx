import { motion } from 'framer-motion';
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { LearningModule } from '../types';

interface ModulePlaygroundProps {
  module: LearningModule | null;
  completed: boolean;
  onComplete: (module: LearningModule, bonusPoints: number) => void;
}

const tolerance = 0.12;

type DragPayload = {
  targetEquation: string;
  solutions: { left: number; right: number }[];
  tiles: number[];
};

type SliderPayload = {
  sliderTargets: { id: string; label: string; optimal: number }[];
};

type LayoutPayload = {
  boardSize: number;
  shapes: { id: string; cells: [number, number][] }[];
  goalCoverage: number;
};

type BossQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

type BossPayload = {
  questions: BossQuestion[];
  timeLimitSeconds: number;
};

const DragDropGame = ({ payload, onSuccess, disabled }: { payload: DragPayload; onSuccess: () => void; disabled: boolean }) => {
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const targetTotal = useMemo(() => payload.targetEquation.split('=').pop()?.trim() ?? '?', [payload.targetEquation]);

  const handleDrop = (slot: 'left' | 'right', value: number) => {
    if (disabled) return;
    if (slot === 'left') {
      setLeft(value);
    } else {
      setRight(value);
    }
  };

  const handleCheck = () => {
    if (left === null || right === null) {
      setMessage('Drop tiles into both slots to balance the tower.');
      return;
    }

    const match = payload.solutions.some((solution) => solution.left === left && solution.right === right);
    if (match) {
      setMessage('Tower stabilised!');
      onSuccess();
    } else {
      setMessage('The tower wobbles — try a different combo.');
    }
  };

  const handleDragStart = (value: number) => (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData('text/plain', value.toString());
  };

  const handleDropEvent = (event: DragEvent<HTMLDivElement>, slot: 'left' | 'right') => {
    event.preventDefault();
    const value = Number(event.dataTransfer.getData('text/plain'));
    handleDrop(slot, value);
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-200">Drag a tile into each slot to satisfy {payload.targetEquation}.</p>
      <div className="flex items-center gap-4">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDropEvent(event, 'left')}
          className="flex-1 min-h-[80px] rounded-2xl border border-dashed border-aurora/40 bg-white/5 flex items-center justify-center text-2xl text-white"
        >
          {left ?? '?'}
        </div>
        <span className="text-3xl text-slate-200">+</span>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDropEvent(event, 'right')}
          className="flex-1 min-h-[80px] rounded-2xl border border-dashed border-aurora/40 bg-white/5 flex items-center justify-center text-2xl text-white"
        >
          {right ?? '?'}
        </div>
        <span className="text-3xl text-slate-200">= {targetTotal}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {payload.tiles.map((tile) => (
          <motion.div key={tile} whileHover={{ scale: 1.05 }}>
            <button
              draggable
              onDragStart={handleDragStart(tile)}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aurora/40 to-ember/40 text-white text-2xl font-semibold flex items-center justify-center border border-white/10"
            >
              {tile}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheck}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-moss to-aurora px-6 py-3 text-midnight font-semibold"
      >
        Stabilise Equation
      </motion.button>

      {message && <p className="text-sm text-sunshine">{message}</p>}
    </div>
  );
};

const VisualGame = ({ payload, onSuccess }: { payload: SliderPayload | LayoutPayload; onSuccess: () => void }) => {
  if ('sliderTargets' in payload) {
    const [values, setValues] = useState(() =>
      Object.fromEntries(payload.sliderTargets.map((target) => [target.id, Math.round(target.optimal * 100)]))
    );
    const [complete, setComplete] = useState(false);

    useEffect(() => {
      const solved = payload.sliderTargets.every((target) => {
        const current = values[target.id] / 100;
        return Math.abs(current - target.optimal) <= tolerance;
      });
      setComplete(solved);
    }, [payload.sliderTargets, values]);

    return (
      <div className="space-y-6">
        {payload.sliderTargets.map((target) => (
          <div key={target.id} className="space-y-2">
            <p className="text-sm text-slate-200">{target.label}</p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values[target.id]}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [target.id]: Number(event.target.value),
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-300">
              <span>{(values[target.id] / 100).toFixed(2)}</span>
              <span>Target: {target.optimal.toFixed(2)}</span>
            </div>
          </div>
        ))}

        <motion.button
          whileHover={{ scale: complete ? 1.03 : 1 }}
          whileTap={{ scale: complete ? 0.97 : 1 }}
          disabled={!complete}
          onClick={onSuccess}
          className={`rounded-full px-6 py-3 font-semibold ${
            complete
              ? 'bg-gradient-to-r from-aurora to-moss text-midnight shadow-glow'
              : 'bg-white/10 border border-white/10 text-slate-400 cursor-not-allowed'
          }`}
        >
          {complete ? 'Lock in probability plan' : 'Fine tune to solve'}
        </motion.button>
      </div>
    );
  }

  const layoutPayload = payload as LayoutPayload;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const totalCoverage = useMemo(() => {
    const cells = new Set<string>();
    selectedIds.forEach((id) => {
      const shape = layoutPayload.shapes.find((item) => item.id === id);
      shape?.cells.forEach(([x, y]) => cells.add(`${x}-${y}`));
    });
    return cells.size;
  }, [layoutPayload.shapes, selectedIds]);

  useEffect(() => {
    if (totalCoverage >= layoutPayload.goalCoverage) {
      onSuccess();
    }
  }, [layoutPayload.goalCoverage, onSuccess, totalCoverage]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-200">
        Activate holographic tiles to cover at least {layoutPayload.goalCoverage} zones on the layout grid.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {layoutPayload.shapes.map((shape) => {
          const active = selectedIds.includes(shape.id);
          return (
            <motion.button
              key={shape.id}
              onClick={() =>
                setSelectedIds((prev) =>
                  prev.includes(shape.id) ? prev.filter((id) => id !== shape.id) : [...prev, shape.id]
                )
              }
              whileHover={{ scale: 1.05 }}
              className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                active ? 'border-moss text-white bg-moss/20' : 'border-white/10 text-slate-200 bg-white/5'
              }`}
            >
              <span className="block text-lg font-display mb-2">{shape.id}</span>
              <span>{shape.cells.length} tiles</span>
            </motion.button>
          );
        })}
      </div>
      <div className="text-sm text-slate-200">Coverage score: {totalCoverage}</div>
    </div>
  );
};

const BossBattle = ({ payload, onSuccess }: { payload: BossPayload; onSuccess: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(payload.timeLimitSeconds);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (timeLeft <= 0 || index >= payload.questions.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [index, payload.questions.length, timeLeft]);

  useEffect(() => {
    if (index >= payload.questions.length) {
      if (correct >= 2) {
        onSuccess();
      } else {
        setFeedback('The Quant Titan remains undefeated. Try again tomorrow!');
      }
    }
  }, [correct, index, onSuccess, payload.questions.length]);

  if (index >= payload.questions.length) {
    return (
      <div className="space-y-4">
        <p className="text-slate-200">Boss battle complete.</p>
        <p className="text-slate-400 text-sm">{feedback}</p>
      </div>
    );
  }

  const question = payload.questions[index];

  const handleAnswer = (choice: string) => {
    const isCorrect = choice === question.answer;
    setFeedback(isCorrect ? 'Critical hit! 💥' : question.explanation);
    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    }
    setTimeout(() => {
      setFeedback('');
      setIndex((prev) => prev + 1);
    }, 700);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">Time left: {timeLeft}s</span>
        <span className="text-sm text-slate-300">Boss HP: {payload.questions.length - index}</span>
      </div>
      <h4 className="text-xl font-display text-white">{question.prompt}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(option)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-slate-100 hover:border-aurora"
          >
            {option}
          </motion.button>
        ))}
      </div>
      {feedback && <p className="text-sm text-sunshine">{feedback}</p>}
    </div>
  );
};

export const ModulePlayground = ({ module, completed, onComplete }: ModulePlaygroundProps) => {
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    setGameCompleted(completed);
  }, [completed]);

  if (!module) {
    return (
      <section className="bg-white/5 border border-white/10 rounded-3xl px-8 py-10 min-h-[340px] flex items-center justify-center text-slate-300">
        Select a checkpoint from the Progress Map to begin your next adventure.
      </section>
    );
  }

  const handleSuccess = () => {
    if (gameCompleted) return;
    setGameCompleted(true);
    onComplete(module, module.miniGame.reward.points);
  };

  const { miniGame } = module;

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-300">{module.checkpointLabel}</span>
          <h3 className="text-2xl font-display text-white">{miniGame.title}</h3>
          <p className="text-sm text-slate-300 max-w-2xl">{miniGame.description}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-200">
          <span className="rounded-full border border-white/10 px-4 py-2">{miniGame.durationMinutes} min burst</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Reward: {miniGame.reward.points} pts</span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        {miniGame.type === 'drag-drop' && (
          <DragDropGame
            key={miniGame.id}
            payload={miniGame.payload as DragPayload}
            onSuccess={handleSuccess}
            disabled={gameCompleted}
          />
        )}
        {miniGame.type === 'visual' && (
          <VisualGame key={miniGame.id} payload={miniGame.payload as SliderPayload | LayoutPayload} onSuccess={handleSuccess} />
        )}
        {miniGame.type === 'boss' && <BossBattle key={miniGame.id} payload={miniGame.payload as BossPayload} onSuccess={handleSuccess} />}
      </div>

      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-moss/50 bg-moss/20 px-6 py-4 text-moss"
        >
          <p className="font-semibold">Level cleared! Reward dispatched to your inventory.</p>
        </motion.div>
      )}
    </section>
  );
};
