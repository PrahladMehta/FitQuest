export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

export type Workout = {
  id: string;
  date: string;
  title: string;
  exercises: Exercise[];
};

export type WorkoutMap = Record<string, Workout[]>;
