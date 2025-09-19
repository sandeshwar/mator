import { useCallback, useEffect, useMemo, useState } from 'react';
import { DailyChallengePanel } from './components/DailyChallengePanel';
import { ExperiencePulse } from './components/ExperiencePulse';
import { HeaderStats } from './components/HeaderStats';
import { ModulePlayground } from './components/ModulePlayground';
import { OnboardingAdventure } from './components/OnboardingAdventure';
import { ProgressMap } from './components/ProgressMap';
import { RewardCenter } from './components/RewardCenter';
import { ScenarioShowcase } from './components/ScenarioShowcase';
import { dailyChallenges } from './data/dailyChallenges';
import { learningModules } from './data/modules';
import { rewardBadges } from './data/rewards';
import { usePersistentState } from './hooks/usePersistentState';
import {
  computeProgress,
  evaluateBadgeUnlocks,
  evaluateStreak,
  getDailyChallengeOfDay,
  getPersonalizedModules,
} from './utils/gameLogic';
import { DailyChallenge, LearningModule, ScenarioCompletionPayload, UserProfile } from './types';

const todayKey = () => new Date().toISOString().split('T')[0];

type DailyRecord = {
  date: string;
  completed: string[];
};

const initialDailyRecord: DailyRecord = { date: '', completed: [] };

export default function App() {
  const [profile, setProfile] = usePersistentState<UserProfile | null>('mathquest-profile', null);
  const [totalPoints, setTotalPoints] = usePersistentState<number>('mathquest-total-points', 0);
  const [completedModules, setCompletedModules] = usePersistentState<string[]>('mathquest-completed-modules', []);
  const [completedScenarios, setCompletedScenarios] = usePersistentState<string[]>(
    'mathquest-completed-scenarios',
    []
  );
  const [dailyRecord, setDailyRecord] = usePersistentState<DailyRecord>('mathquest-daily-record', initialDailyRecord);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [pulseMessage, setPulseMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile && !activeModuleId) {
      setActiveModuleId(profile.unlockedModules[profile.unlockedModules.length - 1] ?? null);
    }
  }, [activeModuleId, profile]);

  useEffect(() => {
    if (!pulseMessage) return;
    const timeout = window.setTimeout(() => setPulseMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [pulseMessage]);

  const handleOnboardingComplete = useCallback(
    (nextProfile: UserProfile) => {
      setProfile(nextProfile);
      setActiveModuleId(nextProfile.unlockedModules[0] ?? null);
      setPulseMessage('Welcome to MathQuest! 🚀');
    },
    [setProfile]
  );

  const personalizedModules = useMemo(() => {
    if (!profile) return [] as LearningModule[];
    return getPersonalizedModules(learningModules, profile.focus);
  }, [profile]);

  const unlockedIds = useMemo(() => {
    if (!profile) return [] as string[];
    const valid = profile.unlockedModules.filter((moduleId) =>
      personalizedModules.some((module) => module.id === moduleId)
    );
    return Array.from(new Set(valid));
  }, [personalizedModules, profile]);

  const progress = useMemo(() => computeProgress(personalizedModules, unlockedIds), [personalizedModules, unlockedIds]);

  const activeModule = useMemo(
    () => personalizedModules.find((module) => module.id === activeModuleId) ?? personalizedModules[0] ?? null,
    [activeModuleId, personalizedModules]
  );

  useEffect(() => {
    if (activeModule && activeModuleId !== activeModule.id) {
      setActiveModuleId(activeModule.id);
    }
  }, [activeModule, activeModuleId]);

  const todayChallenge = useMemo(() => getDailyChallengeOfDay(dailyChallenges), [dailyRecord.date]);
  const today = todayKey();
  const dailyCompleted = dailyRecord.date === today && dailyRecord.completed.includes(todayChallenge.id);

  const updateProfile = useCallback(
    (updater: (current: UserProfile) => UserProfile) => {
      setProfile((current) => {
        if (!current) return current;
        return updater(current);
      });
    },
    [setProfile]
  );

  const pushCelebration = useCallback((message: string) => {
    setPulseMessage(message);
  }, []);

  const handleModuleComplete = useCallback(
    (module: LearningModule, pointsAwarded: number) => {
      if (!profile) return;
      const moduleIndex = personalizedModules.findIndex((item) => item.id === module.id);
      const nextModule = personalizedModules[moduleIndex + 1];

      const nextUnlocked = new Set(unlockedIds);
      nextUnlocked.add(module.id);
      if (nextModule) {
        nextUnlocked.add(nextModule.id);
      }

      const totalAfter = totalPoints + pointsAwarded;
      setTotalPoints(totalAfter);
      setCompletedModules((prev) => Array.from(new Set([...prev, module.id])));

      updateProfile((current) => {
        const streakReady = evaluateStreak(current, true);
        const enhancedProfile: UserProfile = {
          ...streakReady,
          unlockedModules: Array.from(nextUnlocked),
        };
        const badges = evaluateBadgeUnlocks(
          enhancedProfile,
          pointsAwarded,
          totalAfter,
          computeProgress(personalizedModules, Array.from(nextUnlocked)),
          rewardBadges
        );

        return {
          ...enhancedProfile,
          badges,
        };
      });

      if (nextModule) {
        setActiveModuleId(nextModule.id);
        pushCelebration(`Checkpoint unlocked: ${nextModule.name}! ✨`);
      } else {
        pushCelebration(`You mastered ${module.name}! 🎉`);
      }
    },
    [personalizedModules, profile, setCompletedModules, setTotalPoints, totalPoints, unlockedIds, updateProfile, pushCelebration]
  );

  const handleChallengeComplete = useCallback(
    (challenge: DailyChallenge) => {
      if (!profile) return;
      const todayKeyed = todayKey();
      const updatedRecord: DailyRecord =
        dailyRecord.date === todayKeyed
          ? { date: todayKeyed, completed: Array.from(new Set([...dailyRecord.completed, challenge.id])) }
          : { date: todayKeyed, completed: [challenge.id] };

      setDailyRecord(updatedRecord);
      const pointsAwarded = challenge.reward.points;
      const totalAfter = totalPoints + pointsAwarded;
      setTotalPoints(totalAfter);

      updateProfile((current) => {
        const streakReady = evaluateStreak(current, true);
        const badges = evaluateBadgeUnlocks(
          streakReady,
          pointsAwarded,
          totalAfter,
          progress,
          rewardBadges
        );
        return {
          ...streakReady,
          badges,
        };
      });

      pushCelebration(`Daily challenge cleared! +${pointsAwarded} pts 🎯`);
    },
    [dailyRecord, progress, profile, pushCelebration, setDailyRecord, setTotalPoints, totalPoints, updateProfile]
  );

  const handleScenarioComplete = useCallback(
    ({ scenarioId, reward }: ScenarioCompletionPayload) => {
      if (!profile) return;
      if (completedScenarios.includes(scenarioId)) {
        pushCelebration('Scenario already logged—keep exploring! ✅');
        return;
      }

      setCompletedScenarios([...completedScenarios, scenarioId]);

      const totalAfter = totalPoints + reward.points;
      setTotalPoints(totalAfter);

      updateProfile((current) => {
        const streakReady = evaluateStreak(current, true);
        const autoUnlocked = evaluateBadgeUnlocks(
          streakReady,
          reward.points,
          totalAfter,
          progress,
          rewardBadges
        );
        const badgeSet = new Set(autoUnlocked);
        if (reward.badgeId) {
          badgeSet.add(reward.badgeId);
        }

        return {
          ...streakReady,
          badges: Array.from(badgeSet),
        };
      });

      pushCelebration(reward.celebration);
    },
    [
      completedScenarios,
      progress,
      profile,
      pushCelebration,
      rewardBadges,
      setCompletedScenarios,
      setTotalPoints,
      totalPoints,
      updateProfile,
    ]
  );

  if (!profile) {
    return <OnboardingAdventure onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen w-full px-6 py-8 md:px-10 space-y-8">
      <HeaderStats
        name={profile.name}
        avatar={profile.avatar}
        streak={profile.streak}
        points={totalPoints}
        onboardingScore={profile.onboardingScore}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ProgressMap
            modules={personalizedModules}
            unlockedIds={unlockedIds}
            activeModuleId={activeModule?.id ?? null}
            onSelect={(module) => setActiveModuleId(module.id)}
          />

          <ModulePlayground
            module={activeModule}
            completed={completedModules.includes(activeModule?.id ?? '')}
            onComplete={handleModuleComplete}
          />

          <ScenarioShowcase
            focus={profile.focus}
            completedScenarioIds={completedScenarios}
            onScenarioComplete={handleScenarioComplete}
          />
        </div>

        <div className="space-y-6">
          <DailyChallengePanel
            challenge={todayChallenge}
            completed={dailyCompleted}
            onComplete={handleChallengeComplete}
          />

          <RewardCenter badges={rewardBadges} unlocked={profile.badges} streak={profile.streak} totalPoints={totalPoints} />
        </div>
      </div>

      <ExperiencePulse message={pulseMessage} />
    </div>
  );
}
