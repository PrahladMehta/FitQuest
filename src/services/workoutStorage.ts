import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Workout, WorkoutMap } from '../types/workout';

const STORAGE_KEY = '@gym_tracker_workouts_v3';

function isWorkout(v: unknown): v is Workout {
  return (
    !!v &&
    typeof v === 'object' &&
    'id' in v &&
    'date' in v &&
    'exercises' in v &&
    Array.isArray((v as Workout).exercises)
  );
}

function mergeArrayWorkouts(list: Workout[]): Workout {
  return {
    id: list[0].id,
    date: list[0].date,
    title: list[0].title,
    exercises: list.flatMap(w => w.exercises),
  };
}

export async function loadWorkouts(): Promise<WorkoutMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== 'object') return {};

  const result: WorkoutMap = {};
  for (const [date, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const valid = value.filter(isWorkout);
      if (valid.length > 0) result[date] = mergeArrayWorkouts(valid);
    } else if (isWorkout(value)) {
      result[date] = value;
    }
  }
  return result;
}

export async function saveWorkouts(workouts: WorkoutMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}
