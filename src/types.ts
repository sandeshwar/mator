export type Audience = 'college' | 'professional';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  focus: Audience;
  unlockedModules: string[];
  badges: string[];
  streak: number;
  lastPlayed: string;
  onboardingScore: number;
}

export interface ModuleMiniGame {
  id: string;
  title: string;
  type: 'drag-drop' | 'visual' | 'boss';
  description: string;
  durationMinutes: number;
  reward: {
    points: number;
    badge?: string;
  };
  payload: Record<string, unknown>;
}

export interface LearningModule {
  id: string;
  name: string;
  theme: string;
  trackFocus: Audience[];
  checkpointLabel: string;
  summary: string;
  mentorTip: string;
  background: string;
  miniGame: ModuleMiniGame;
}

export interface DailyChallenge {
  id: string;
  title: string;
  timeLimitMinutes: number;
  description: string;
  reward: {
    points: number;
    streakBonus?: number;
  };
  tasks: string[];
}

export interface RewardBadge {
  id: string;
  name: string;
  description: string;
  threshold: number;
}

export interface ProgressSnapshot {
  unlockedCount: number;
  totalCount: number;
  completionRate: number;
}
