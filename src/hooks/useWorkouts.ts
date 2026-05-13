import { useCallback, useEffect, useState } from 'react';
import { loadWorkouts, saveWorkouts } from '../services/workoutStorage';
import type { Exercise, Workout, WorkoutMap } from '../types/workout';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadWorkouts()
      .then(setWorkouts)
      .catch(e => console.warn('Failed to load workouts', e))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveWorkouts(workouts).catch(e => console.warn('Failed to save workouts', e));
  }, [workouts, loaded]);

  const addWorkout = useCallback((workout: Workout) => {
    setWorkouts(prev => {
      const list = prev[workout.date] ? [...prev[workout.date], workout] : [workout];
      return { ...prev, [workout.date]: list };
    });
  }, []);

  const deleteWorkout = useCallback((dateKey: string, id: string) => {
    setWorkouts(prev => {
      const list = (prev[dateKey] || []).filter(w => w.id !== id);
      const next = { ...prev };
      if (list.length === 0) {
        delete next[dateKey];
      } else {
        next[dateKey] = list;
      }
      return next;
    });
  }, []);

  const addExerciseToWorkout = useCallback(
    (dateKey: string, workoutId: string, exercise: Exercise) => {
      setWorkouts(prev => {
        const list = prev[dateKey];
        if (!list) return prev;
        return {
          ...prev,
          [dateKey]: list.map(w =>
            w.id === workoutId
              ? { ...w, exercises: [...w.exercises, exercise] }
              : w,
          ),
        };
      });
    },
    [],
  );

  const deleteExercise = useCallback(
    (dateKey: string, workoutId: string, exerciseId: string) => {
      setWorkouts(prev => {
        const list = prev[dateKey];
        if (!list) return prev;
        return {
          ...prev,
          [dateKey]: list.map(w =>
            w.id === workoutId
              ? { ...w, exercises: w.exercises.filter(e => e.id !== exerciseId) }
              : w,
          ),
        };
      });
    },
    [],
  );

  return {
    workouts,
    loaded,
    addWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    deleteExercise,
  };
}
