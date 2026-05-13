export type ExerciseSet = {
  id: string;
  reps: number;
  weight?: number;
};

export type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export type Workout = {
  id: string;
  date: string;
  title: string;
  exercises: Exercise[];
};

export type WorkoutMap = Record<string, Workout>;
