import { DailyChallenge } from '../types';

export const dailyChallenges: DailyChallenge[] = [
  {
    id: 'speed-sprint',
    title: 'Speed Sprint',
    timeLimitMinutes: 5,
    description:
      'Solve as many rapid-fire puzzles as possible. Accuracy boosts your combo multiplier, so think fast but stay sharp.',
    reward: {
      points: 75,
      streakBonus: 1,
    },
    tasks: [
      'Estimate odds of drawing two hearts in a row from a deck.',
      'Balance a linear equation before the timer blinks red.',
      'Approximate the area of a polygon by decomposing shapes.',
    ],
    prompts: [
      {
        id: 'speed-sprint-1',
        question: 'What is the probability of drawing two hearts consecutively from a standard 52-card deck without replacement?',
        choices: ['(13/52) × (12/51)', '(13/52) × (13/52)', '(1/4) × (1/4)'],
        correctIndex: 0,
        hint: 'Remember that the total card count changes after the first draw.',
      },
      {
        id: 'speed-sprint-2',
        question: 'Solve for x: 3x - 4 = 2x + 5.',
        choices: ['x = 9', 'x = -9', 'x = 1/9'],
        correctIndex: 0,
      },
      {
        id: 'speed-sprint-3',
        question: 'A hexagon is decomposed into four congruent triangles each with area 6. What is the total area of the hexagon?',
        choices: ['12', '18', '24'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'strategy-lab',
    title: 'Strategy Lab',
    timeLimitMinutes: 10,
    description:
      'Tackle layered problems tied to your personal goals. Earn extra credit by submitting a power move in the discussion feed.',
    reward: {
      points: 110,
      streakBonus: 1,
    },
    tasks: [
      'Optimize an exam revision schedule using probability weights.',
      'Design a diversified allocation for a $10k portfolio.',
      'Calculate expected outcomes for a product launch gamble.',
    ],
    prompts: [
      {
        id: 'strategy-lab-1',
        question: 'If Topic A has a 0.6 probability of appearing and Topic B has 0.4, which schedule maximizes expected coverage in 5 study blocks?',
        choices: ['3 blocks for A, 2 for B', '4 blocks for B, 1 for A', 'Evenly split: 2.5 blocks each'],
        correctIndex: 0,
      },
      {
        id: 'strategy-lab-2',
        question: 'A balanced $10k portfolio aims for 40% equities, 35% bonds, and the rest cash. How much is allocated to bonds?',
        choices: ['$3,500', '$4,000', '$2,500'],
        correctIndex: 0,
      },
      {
        id: 'strategy-lab-3',
        question: 'Launching a product has a 30% chance of high success ($12k gain) and 70% chance of low success ($3k gain). What is the expected gain?',
        choices: ['$5,100', '$7,500', '$9,000'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'mystery-easter-egg',
    title: 'Mystery Signal',
    timeLimitMinutes: 7,
    description:
      'Decode the hidden pattern from audio pings and animated glyphs. Solving it unlocks the Easter-egg badge.',
    reward: {
      points: 140,
      streakBonus: 2,
    },
    tasks: [
      'Translate the pattern into a Fibonacci-like series.',
      'Predict the next glyph rotation angle.',
      'Explain the rule in 30 seconds to secure the badge.',
    ],
    prompts: [
      {
        id: 'mystery-easter-egg-1',
        question: 'The signal shows 2, 3, 5, 8... What number continues the pattern?',
        choices: ['11', '12', '13'],
        correctIndex: 2,
        hint: 'Each value is the sum of the previous two.',
      },
      {
        id: 'mystery-easter-egg-2',
        question: 'Glyph rotations increase by 45°. After 135°, what is the next angle?',
        choices: ['150°', '180°', '225°'],
        correctIndex: 1,
      },
      {
        id: 'mystery-easter-egg-3',
        question: 'To explain the rule quickly, what is the clearest summary?',
        choices: ['The sequence doubles each step.', 'Each term is the sum of the prior two, mirrored by 45° rotations.', 'Every odd term repeats.'],
        correctIndex: 1,
      },
    ],
  },
];
