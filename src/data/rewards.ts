import { RewardBadge } from '../types';

export const rewardBadges: RewardBadge[] = [
  {
    id: 'habit-streaker',
    name: 'Habit Streaker',
    description: 'Maintain a 7-day streak to unlock this glowing emblem.',
    threshold: 7,
  },
  {
    id: 'combo-master',
    name: 'Combo Master',
    description: 'Score 500 points in a single session to earn this badge.',
    threshold: 500,
  },
  {
    id: 'explorer',
    name: 'World Explorer',
    description: 'Complete all checkpoints on the Progress Map.',
    threshold: 4,
  },
];
