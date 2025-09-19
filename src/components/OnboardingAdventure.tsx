import { motion } from 'framer-motion';
import { FormEvent, useMemo, useState } from 'react';
import { Audience, UserProfile } from '../types';
import { buildAvatar } from '../utils/gameLogic';

interface OnboardingAdventureProps {
  onComplete: (profile: UserProfile) => void;
}

const puzzles = [
  {
    id: 'sequence',
    prompt: 'Crack the portal code: 3, 9, 27, ?',
    options: ['30', '54', '81'],
    answer: '81',
    explanation: 'Multiply by 3 each time. 27 × 3 = 81.',
    score: 40,
  },
  {
    id: 'balance',
    prompt: 'Balance the energy core: 2x + 5 = 19. What is x?',
    options: ['7', '6', '5'],
    answer: '7',
    explanation: 'Subtract 5 then divide: (19 - 5) / 2 = 7.',
    score: 35,
  },
  {
    id: 'probability',
    prompt: 'Pick the better odds: Which has higher probability?',
    options: ['Rolling a sum of 7 with two dice', 'Flipping 3 heads in a row'],
    answer: 'Rolling a sum of 7 with two dice',
    explanation:
      'There are 6 favourable outcomes out of 36 for a sum of 7 (~16.7%), versus 12.5% for three heads.',
    score: 45,
  },
];

const focusCards: { id: Audience; title: string; description: string }[] = [
  {
    id: 'college',
    title: 'College Challenger',
    description: 'Dominate exams, study groups, and competitions with lightning-fast practice quests.',
  },
  {
    id: 'professional',
    title: 'Professional Strategist',
    description: 'Sharpen financial intuition, forecasting, and data-driven decisions for your next big move.',
  },
];

export const OnboardingAdventure = ({ onComplete }: OnboardingAdventureProps) => {
  const [name, setName] = useState('');
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [focus, setFocus] = useState<Audience | null>(null);
  const [feedback, setFeedback] = useState('');

  const puzzle = puzzles[currentPuzzle];

  const progress = useMemo(
    () => ((currentPuzzle + (focus ? 1 : 0)) / (puzzles.length + 1)) * 100,
    [currentPuzzle, focus]
  );

  const handleSubmit = (answer: string) => {
    if (answer === puzzle.answer) {
      setScore((prev) => prev + puzzle.score);
      setFeedback('Nice! Portal stabilised.');
      setTimeout(() => {
        setFeedback('');
        setCurrentPuzzle((prev) => (prev + 1 >= puzzles.length ? puzzles.length : prev + 1));
      }, 600);
    } else {
      setFeedback('Not quite right — try a different angle!');
    }
  };

  const handleFocusComplete = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !focus) {
      setFeedback('Name and path are required before entering MathQuest.');
      return;
    }

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      focus,
      avatar: buildAvatar(name.trim(), focus),
      unlockedModules: ['probability-forest'],
      badges: [],
      streak: 0,
      lastPlayed: '',
      onboardingScore: score,
    };

    onComplete(profile);
  };

  const puzzlesComplete = currentPuzzle >= puzzles.length - 1 && score >= puzzles.reduce((sum, item) => sum + item.score, 0) * 0.4;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <motion.section
        className="w-full max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-glow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="mb-8" layout>
          <p className="uppercase tracking-[0.35em] text-xs text-slate-300 mb-3">MathQuest Initiation</p>
          <h1 className="font-display text-4xl font-semibold text-white">
            Solve the entry puzzles to unlock your personalised adventure.
          </h1>
        </motion.div>

        <div className="w-full bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-aurora via-sunshine to-ember"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeInOut', duration: 0.6 }}
          />
        </div>

        {currentPuzzle < puzzles.length ? (
          <motion.div key={puzzle.id} layout className="space-y-6">
            <h2 className="text-2xl font-semibold font-display text-white">{puzzle.prompt}</h2>
            <p className="text-sm text-slate-300">Pick the best move to keep the portal humming.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {puzzle.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit(option)}
                  className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5 text-left text-white font-medium shadow hover:shadow-glow"
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {feedback && <p className="text-sunshine text-sm font-semibold">{feedback}</p>}
            <p className="text-xs text-slate-400">{puzzle.explanation}</p>
          </motion.div>
        ) : (
          <motion.form
            layout
            className="space-y-6"
            onSubmit={handleFocusComplete}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <label className="block text-sm uppercase tracking-widest text-slate-300 mb-2">Codename</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Lightning Scholar"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-aurora"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focusCards.map((card) => (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => setFocus(card.id)}
                  whileHover={{ y: -6 }}
                  className={`relative overflow-hidden rounded-3xl border ${
                    focus === card.id ? 'border-aurora shadow-glow' : 'border-white/10'
                  } bg-white/10 px-6 py-7 text-left transition-all`}
                >
                  <span className="font-display text-xl text-white block mb-2">{card.title}</span>
                  <span className="text-sm text-slate-300 leading-relaxed">{card.description}</span>
                  {focus === card.id && (
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-aurora/20 to-ember/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={!focus || !name.trim() || !puzzlesComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-aurora to-ember px-8 py-3 font-semibold text-midnight disabled:opacity-40"
            >
              Enter MathQuest
            </motion.button>

            {!puzzlesComplete && (
              <p className="text-xs text-slate-400">
                Finish the initiation puzzles to unlock your personalised journey.
              </p>
            )}
          </motion.form>
        )}
      </motion.section>
    </div>
  );
};
