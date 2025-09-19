import { DailyChallenge, LearningModule, ProgressSnapshot, RewardBadge, UserProfile } from '../types';

const todayKey = () => new Date().toISOString().split('T')[0];

export function evaluateStreak(profile: UserProfile, completedToday: boolean): UserProfile {
  const today = todayKey();

  if (!completedToday) {
    if (profile.lastPlayed && profile.lastPlayed !== today) {
      return { ...profile, streak: 0 };
    }
    return profile;
  }

  const updatedStreak = profile.lastPlayed === today ? profile.streak : profile.streak + 1;
  return {
    ...profile,
    streak: updatedStreak,
    lastPlayed: today,
  };
}

export function evaluateBadgeUnlocks(
  profile: UserProfile,
  pointsEarned: number,
  totalPoints: number,
  progress: ProgressSnapshot,
  badges: RewardBadge[]
) {
  const unlocked = new Set(profile.badges);

  badges.forEach((badge) => {
    if (unlocked.has(badge.id)) {
      return;
    }

    if (badge.id === 'habit-streaker' && profile.streak >= badge.threshold) {
      unlocked.add(badge.id);
    }

    if (badge.id === 'combo-master' && pointsEarned >= badge.threshold) {
      unlocked.add(badge.id);
    }

    if (badge.id === 'explorer' && progress.unlockedCount >= badge.threshold) {
      unlocked.add(badge.id);
    }
  });

  return Array.from(unlocked);
}

export function computeProgress(modules: LearningModule[], unlockedIds: string[]): ProgressSnapshot {
  const unique = new Set(unlockedIds);
  const total = modules.length;
  const unlockedCount = [...unique].length;

  return {
    unlockedCount,
    totalCount: total,
    completionRate: total === 0 ? 0 : Math.round((unlockedCount / total) * 100),
  };
}

export function getPersonalizedModules(modules: LearningModule[], focus: UserProfile['focus']) {
  return modules.filter((module) => module.trackFocus.includes(focus));
}

export function getDailyChallengeOfDay(challenges: DailyChallenge[]) {
  const index = new Date().getDate() % challenges.length;
  return challenges[index];
}

export function pointsForChallenge(challenge: DailyChallenge) {
  return challenge.reward.points;
}

export function buildAvatar(name: string, focus: UserProfile['focus']) {
  const initials = name
    .split(' ')
    .map((piece) => piece.charAt(0).toUpperCase())
    .join('');

  const palette = focus === 'college' ? ['#00D4FF', '#FFD166'] : ['#FF6F61', '#2ED47A'];
  return `linear-gradient(135deg, ${palette[0]}, ${palette[1]}) /* ${initials} */`;
}
