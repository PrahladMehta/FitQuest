import { createContext, useContext, type ReactNode } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';

type WorkoutsContextValue = ReturnType<typeof useWorkouts>;

const WorkoutsContext = createContext<WorkoutsContextValue | null>(null);

export function WorkoutsProvider({ children }: { children: ReactNode }) {
  const value = useWorkouts();
  return (
    <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>
  );
}

export function useWorkoutsContext(): WorkoutsContextValue {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) {
    throw new Error('useWorkoutsContext must be used within a WorkoutsProvider');
  }
  return ctx;
}
