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

export interface DailyChallengePrompt {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  hint?: string;
}

export interface DailyChallengeRunResult {
  promptId: string;
  correct: boolean;
}

export interface DailyChallengeRunSummary {
  challengeId: string;
  solved: number;
  correct: number;
  accuracy: number;
  bestCombo: number;
  completed: boolean;
  allSolved: boolean;
  timeElapsedSeconds: number;
  results: DailyChallengeRunResult[];
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
  prompts?: DailyChallengePrompt[];
  scoring?: {
    comboBonus?: number;
  };
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

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatar: string;
  points: number;
}

export interface ScenarioParameter {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  defaultValue: number;
  targetRange: [number, number];
  insight: string;
  caution: string;
}

export interface ScenarioPersonaContent {
  cardDescription: string;
  narrative: string;
  objective: string;
  baseline: { label: string; value: string; helper: string }[];
}

export interface ScenarioReward {
  points: number;
  badgeId?: string;
  celebration: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  icon: string;
  accent: string;
  moduleContext: {
    id: string;
    name: string;
    insight: string;
  };
  personas: Record<Audience, ScenarioPersonaContent>;
  parameters: ScenarioParameter[];
  success: {
    summary: string;
    checkpoints: string[];
  };
  reward: ScenarioReward;
}

export interface ScenarioCompletionPayload {
  scenarioId: string;
  reward: ScenarioReward;
}
