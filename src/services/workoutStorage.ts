import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutMap } from '../types/workout';

const STORAGE_KEY = '@gym_tracker_workouts_v3';

export async function loadWorkouts(): Promise<WorkoutMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as WorkoutMap) : {};
}

export async function saveWorkouts(workouts: WorkoutMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}
