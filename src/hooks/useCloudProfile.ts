import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { ensureAnonymousUser, getFirestoreDb, subscribeToAuthState } from '../services/firebase';
import { LeaderboardEntry, UserProfile } from '../types';
import { usePersistentState } from './usePersistentState';

export type DailyRecord = {
  date: string;
  completed: string[];
  updatedAt?: string;
};

const initialDailyRecord: DailyRecord = { date: '', completed: [] };

const todayKey = () => new Date().toISOString().split('T')[0];

interface CloudProfileDoc extends DocumentData {
  id: string;
  name: string;
  avatar: string;
  focus: UserProfile['focus'];
  unlockedModules: string[];
  badges: string[];
  streak: number;
  lastPlayed: string;
  onboardingScore: number;
  totalPoints?: number;
  completedModules?: string[];
}

type SyncPayload = {
  profile?: UserProfile;
  totalPoints?: number;
  completedModules?: string[];
};

type RecordDailyRunPayload = {
  date: string;
  completed: string[];
  pointsAwarded?: number;
};

export function useCloudProfile() {
  const db = useMemo(() => getFirestoreDb(), []);

  const [cachedProfile, setCachedProfile] = usePersistentState<UserProfile | null>('mathquest-profile', null);
  const [cachedTotalPoints, setCachedTotalPoints] = usePersistentState<number>('mathquest-total-points', 0);
  const [cachedCompletedModules, setCachedCompletedModules] = usePersistentState<string[]>(
    'mathquest-completed-modules',
    []
  );
  const [cachedDailyRecord, setCachedDailyRecord] = usePersistentState<DailyRecord>(
    'mathquest-daily-record',
    initialDailyRecord
  );

  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const [totalPoints, setTotalPoints] = useState<number>(cachedTotalPoints);
  const [completedModules, setCompletedModules] = useState<string[]>(cachedCompletedModules);
  const [dailyRecord, setDailyRecord] = useState<DailyRecord>(cachedDailyRecord);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUid) => {
      if (nextUid) {
        setUid(nextUid);
      } else {
        void ensureAnonymousUser().then((generatedUid) => setUid(generatedUid));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!uid) {
      return;
    }

    const profileRef = doc(db, 'profiles', uid);

    const unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CloudProfileDoc;
          const nextProfile: UserProfile = {
            id: uid,
            name: data.name,
            avatar: data.avatar,
            focus: data.focus,
            unlockedModules: data.unlockedModules ?? [],
            badges: data.badges ?? [],
            streak: data.streak ?? 0,
            lastPlayed: data.lastPlayed ?? '',
            onboardingScore: data.onboardingScore ?? 0,
          };

          setProfile(nextProfile);
          setCachedProfile(nextProfile);

          if (typeof data.totalPoints === 'number') {
            setTotalPoints(data.totalPoints);
            setCachedTotalPoints(data.totalPoints);
          }

          if (Array.isArray(data.completedModules)) {
            setCompletedModules(data.completedModules);
            setCachedCompletedModules(data.completedModules);
          }
        } else {
          setProfile(cachedProfile);
          setTotalPoints(cachedTotalPoints);
          setCompletedModules(cachedCompletedModules);
        }
        setLoading(false);
      },
      (error: FirestoreError) => {
        console.error('Failed to read profile document', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [cachedCompletedModules, cachedProfile, cachedTotalPoints, db, setCachedCompletedModules, setCachedProfile, setCachedTotalPoints, uid]);

  useEffect(() => {
    if (!uid) {
      return;
    }

    const today = todayKey();
    const dailyRunRef = doc(db, 'dailyRuns', uid, 'runs', today);

    const unsubscribe = onSnapshot(dailyRunRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const record: DailyRecord = {
          date: today,
          completed: Array.isArray(data.completedChallenges) ? data.completedChallenges : [],
          updatedAt: data.updatedAt?.toDate?.().toISOString(),
        };

        setDailyRecord(record);
        setCachedDailyRecord(record);
      } else if (cachedDailyRecord.date === today) {
        setDailyRecord(cachedDailyRecord);
      } else {
        setDailyRecord(initialDailyRecord);
      }
    });

    return () => unsubscribe();
  }, [cachedDailyRecord, db, setCachedDailyRecord, uid]);

  useEffect(() => {
    const leaderboardQuery = query(
      collection(db, 'leaderboards', 'weekly', 'entries'),
      orderBy('points', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      const entries: LeaderboardEntry[] = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          uid: docSnapshot.id,
          name: data.name ?? 'Adventurer',
          avatar: data.avatar ?? '',
          points: data.points ?? 0,
        } as LeaderboardEntry;
      });
      setLeaderboard(entries);
    });

    return () => unsubscribe();
  }, [db]);

  const syncProfile = useCallback(
    async ({ profile: nextProfileCandidate, totalPoints: nextPointsCandidate, completedModules: nextCompletedCandidate }: SyncPayload) => {
      if (!uid) {
        return;
      }

      const nextProfile = nextProfileCandidate ?? profile;
      if (!nextProfile) {
        return;
      }

      const nextPoints =
        typeof nextPointsCandidate === 'number' ? nextPointsCandidate : typeof totalPoints === 'number' ? totalPoints : 0;
      const nextCompleted = nextCompletedCandidate ?? completedModules;

      setProfile(nextProfile);
      setCachedProfile(nextProfile);

      if (typeof nextPointsCandidate === 'number') {
        setTotalPoints(nextPoints);
        setCachedTotalPoints(nextPoints);
      }

      if (nextCompletedCandidate) {
        setCompletedModules(nextCompleted);
        setCachedCompletedModules(nextCompleted);
      }

      const batch = writeBatch(db);
      const profileRef = doc(db, 'profiles', uid);
      batch.set(
        profileRef,
        {
          ...nextProfile,
          totalPoints: nextPoints,
          completedModules: nextCompleted,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (typeof nextPointsCandidate === 'number') {
        const leaderboardRef = doc(db, 'leaderboards', 'weekly', 'entries', uid);
        batch.set(
          leaderboardRef,
          {
            uid,
            name: nextProfile.name,
            avatar: nextProfile.avatar,
            points: nextPoints,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      await batch.commit();
    },
    [completedModules, db, profile, setCachedCompletedModules, setCachedProfile, setCachedTotalPoints, totalPoints, uid]
  );

  const recordDailyRun = useCallback(
    async ({ date, completed, pointsAwarded }: RecordDailyRunPayload) => {
      if (!uid) {
        return;
      }

      const optimisticRecord: DailyRecord = {
        date,
        completed,
        updatedAt: new Date().toISOString(),
      };
      setDailyRecord(optimisticRecord);
      setCachedDailyRecord(optimisticRecord);

      const dailyRunRef = doc(db, 'dailyRuns', uid, 'runs', date);
      const payload: Record<string, unknown> = {
        completedChallenges: completed,
        updatedAt: serverTimestamp(),
      };
      if (typeof pointsAwarded === 'number') {
        payload.pointsAwarded = pointsAwarded;
      }
      await setDoc(dailyRunRef, payload, { merge: true });
    },
    [db, setCachedDailyRecord, uid]
  );

  const completeOnboarding = useCallback(
    async (incomingProfile: UserProfile) => {
      const ensuredUid = uid ?? (await ensureAnonymousUser());
      const normalizedProfile: UserProfile = {
        ...incomingProfile,
        id: ensuredUid,
      };

      await syncProfile({
        profile: normalizedProfile,
        totalPoints: 0,
        completedModules: normalizedProfile.unlockedModules,
      });

      return normalizedProfile;
    },
    [syncProfile, uid]
  );

  return {
    uid,
    loading,
    profile,
    totalPoints,
    completedModules,
    dailyRecord,
    leaderboard,
    syncProfile,
    recordDailyRun,
    completeOnboarding,
  };
}

export { initialDailyRecord };
