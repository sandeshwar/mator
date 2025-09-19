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
  },
];
