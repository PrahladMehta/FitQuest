import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AddWorkoutFab from '../components/AddWorkoutFab';
import Calendar from '../components/Calendar';
import RecentList from '../components/RecentList';
import SummaryStat from '../components/SummaryStat';
import { MONTH_NAMES } from '../constants/dates';
import { colors } from '../constants/theme';
import { useWorkoutsContext } from '../context/WorkoutsContext';
import { toDateKey } from '../utils/date';
import type { RootStackParamList } from '../types/navigation';
import DayScreen from './DayScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Tracker'>;

export default function TrackerScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const {
    workouts,
    addExercise,
    renameExercise,
    deleteExercise,
    addSet,
    updateSet,
    deleteSet,
  } = useWorkoutsContext();

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [dayScreenKey, setDayScreenKey] = useState<string | null>(null);

  const monthStats = useMemo(() => {
    let days = 0;
    let sessions = 0;
    let sets = 0;
    for (const [k, w] of Object.entries(workouts)) {
      const [y, m] = k.split('-').map(Number);
      if (y !== viewYear || m - 1 !== viewMonth) continue;
      if (w.exercises.length === 0) continue;
      days += 1;
      sessions += 1;
      sets += w.exercises.reduce((s, e) => s + e.sets.length, 0);
    }
    return { days, sessions, sets };
  }, [workouts, viewMonth, viewYear]);

  const goPrevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const closeDayScreen = useCallback(() => setDayScreenKey(null), []);

  const dayWorkout = dayScreenKey ? workouts[dayScreenKey] : undefined;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <View style={styles.summaryRow}>
            <SummaryStat value={String(monthStats.days)} label="Active Days" />
            <SummaryStat value={String(monthStats.sessions)} label="Sessions" />
            <SummaryStat value={String(monthStats.sets)} label="Total Sets" />
          </View>
        </View>

        <Calendar
          year={viewYear}
          month={viewMonth}
          workouts={workouts}
          todayKey={todayKey}
          onPrev={goPrevMonth}
          onNext={goNextMonth}
          onDayPress={setDayScreenKey}
        />

        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <RecentList workouts={workouts} onPress={setDayScreenKey} />
      </ScrollView>

      <AddWorkoutFab
        bottom={insets.bottom + 24}
        onPress={() => navigation.navigate('AddWorkout')}
      />

      <DayScreen
        dateKey={dayScreenKey}
        todayKey={todayKey}
        workout={dayWorkout}
        onClose={closeDayScreen}
        onAddExercise={name => {
          if (dayScreenKey) addExercise(dayScreenKey, name);
        }}
        onRenameExercise={(exerciseId, name) => {
          if (dayScreenKey) renameExercise(dayScreenKey, exerciseId, name);
        }}
        onDeleteExercise={exerciseId => {
          if (dayScreenKey) deleteExercise(dayScreenKey, exerciseId);
        }}
        onAddSet={(exerciseId, set) => {
          if (dayScreenKey) addSet(dayScreenKey, exerciseId, set);
        }}
        onUpdateSet={(exerciseId, setId, patch) => {
          if (dayScreenKey) updateSet(dayScreenKey, exerciseId, setId, patch);
        }}
        onDeleteSet={(exerciseId, setId) => {
          if (dayScreenKey) deleteSet(dayScreenKey, exerciseId, setId);
        }}
        onCreateWorkout={() => {
          setDayScreenKey(null);
          navigation.navigate('AddWorkout');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
});
