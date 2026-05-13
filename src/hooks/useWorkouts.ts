import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadWorkouts, saveWorkouts } from '../services/workoutStorage';
import { genId } from '../utils/id';
import type { Exercise, ExerciseSet, Workout, WorkoutMap } from '../types/workout';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadWorkouts()
      .then(data => {
        if (!cancelled) setWorkouts(data);
      })
      .catch(e => console.warn('Failed to load workouts', e))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveWorkouts(workouts).catch(e =>
      console.warn('Failed to save workouts', e),
    );
  }, [workouts, loaded]);

  const upsertWorkout = useCallback((workout: Workout) => {
    setWorkouts(prev => ({ ...prev, [workout.date]: workout }));
  }, []);

  const deleteWorkout = useCallback((dateKey: string) => {
    setWorkouts(prev => {
      if (!prev[dateKey]) return prev;
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  }, []);

  const mutateWorkout = useCallback(
    (dateKey: string, fn: (w: Workout) => Workout) => {
      setWorkouts(prev => {
        const existing = prev[dateKey];
        if (!existing) return prev;
        return { ...prev, [dateKey]: fn(existing) };
      });
    },
    [],
  );

  const mutateExercise = useCallback(
    (dateKey: string, exerciseId: string, fn: (e: Exercise) => Exercise) => {
      mutateWorkout(dateKey, w => ({
        ...w,
        exercises: w.exercises.map(e => (e.id === exerciseId ? fn(e) : e)),
      }));
    },
    [mutateWorkout],
  );

  const setTitle = useCallback(
    (dateKey: string, title: string) => {
      mutateWorkout(dateKey, w => ({ ...w, title }));
    },
    [mutateWorkout],
  );

  const addExercise = useCallback(
    (dateKey: string, name: string) => {
      mutateWorkout(dateKey, w => ({
        ...w,
        exercises: [...w.exercises, { id: genId(), name, sets: [] }],
      }));
    },
    [mutateWorkout],
  );

  const renameExercise = useCallback(
    (dateKey: string, exerciseId: string, name: string) => {
      mutateExercise(dateKey, exerciseId, e => ({ ...e, name }));
    },
    [mutateExercise],
  );

  const deleteExercise = useCallback(
    (dateKey: string, exerciseId: string) => {
      mutateWorkout(dateKey, w => ({
        ...w,
        exercises: w.exercises.filter(e => e.id !== exerciseId),
      }));
    },
    [mutateWorkout],
  );

  const addSet = useCallback(
    (dateKey: string, exerciseId: string, set: Omit<ExerciseSet, 'id'>) => {
      mutateExercise(dateKey, exerciseId, e => ({
        ...e,
        sets: [...e.sets, { ...set, id: genId() }],
      }));
    },
    [mutateExercise],
  );

  const updateSet = useCallback(
    (
      dateKey: string,
      exerciseId: string,
      setId: string,
      patch: Partial<Omit<ExerciseSet, 'id'>>,
    ) => {
      mutateExercise(dateKey, exerciseId, e => ({
        ...e,
        sets: e.sets.map(s => (s.id === setId ? { ...s, ...patch } : s)),
      }));
    },
    [mutateExercise],
  );

  const deleteSet = useCallback(
    (dateKey: string, exerciseId: string, setId: string) => {
      mutateExercise(dateKey, exerciseId, e => ({
        ...e,
        sets: e.sets.filter(s => s.id !== setId),
      }));
    },
    [mutateExercise],
  );

  return useMemo(
    () => ({
      workouts,
      loaded,
      upsertWorkout,
      deleteWorkout,
      setTitle,
      addExercise,
      renameExercise,
      deleteExercise,
      addSet,
      updateSet,
      deleteSet,
    }),
    [
      workouts,
      loaded,
      upsertWorkout,
      deleteWorkout,
      setTitle,
      addExercise,
      renameExercise,
      deleteExercise,
      addSet,
      updateSet,
      deleteSet,
    ],
  );
}
