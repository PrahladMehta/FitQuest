import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AddExerciseRow from '../components/AddExerciseRow';
import ExerciseCard from '../components/ExerciseCard';
import Icon from '../components/Icon';
import { colors } from '../constants/theme';
import { formatLongDate } from '../utils/date';
import type { ExerciseSet, Workout } from '../types/workout';

type Props = {
  dateKey: string | null;
  todayKey: string;
  workouts: Workout[];
  onClose: () => void;
  onAddExercise: (workoutId: string, name: string) => void;
  onRenameExercise: (workoutId: string, exerciseId: string, name: string) => void;
  onDeleteExercise: (workoutId: string, exerciseId: string) => void;
  onAddSet: (workoutId: string, exerciseId: string, set: Omit<ExerciseSet, 'id'>) => void;
  onUpdateSet: (
    workoutId: string,
    exerciseId: string,
    setId: string,
    patch: Partial<Omit<ExerciseSet, 'id'>>,
  ) => void;
  onDeleteSet: (workoutId: string, exerciseId: string, setId: string) => void;
  onCreateNewWorkout: () => void;
};

export default function DayScreen({
  dateKey,
  todayKey,
  workouts,
  onClose,
  onAddExercise,
  onRenameExercise,
  onDeleteExercise,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
  onCreateNewWorkout,
}: Props) {
  const insets = useSafeAreaInsets();
  const isToday = dateKey === todayKey;

  return (
    <Modal
      visible={dateKey !== null}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          >
            <Icon name="chevron-left" color={colors.text} size={22} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isToday ? 'Today' : 'Workout Log'}
            </Text>
            {dateKey && <Text style={styles.headerSub}>{formatLongDate(dateKey)}</Text>}
          </View>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {workouts.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Icon name="calendar" color={colors.textMuted} size={36} />
              </View>
              <Text style={styles.emptyTitle}>No workouts logged</Text>
              <Text style={styles.emptySub}>
                {isToday
                  ? 'Create your first workout for today below.'
                  : 'Nothing was logged on this day.'}
              </Text>
            </View>
          ) : (
            workouts.map(workout => (
              <View key={workout.id} style={styles.workoutBlock}>
                <Text style={styles.workoutTitle}>{workout.title}</Text>

                {workout.exercises.map(ex => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    editable={isToday}
                    onRename={name => onRenameExercise(workout.id, ex.id, name)}
                    onDelete={() => onDeleteExercise(workout.id, ex.id)}
                    onAddSet={set => onAddSet(workout.id, ex.id, set)}
                    onUpdateSet={(setId, patch) =>
                      onUpdateSet(workout.id, ex.id, setId, patch)
                    }
                    onDeleteSet={setId => onDeleteSet(workout.id, ex.id, setId)}
                  />
                ))}

                {isToday && (
                  <AddExerciseRow
                    onAdd={name => onAddExercise(workout.id, name)}
                  />
                )}
              </View>
            ))
          )}

          {isToday && (
            <Pressable
              onPress={onCreateNewWorkout}
              style={({ pressed }) => [
                styles.newWorkoutBtn,
                pressed && styles.newWorkoutBtnPressed,
              ]}
            >
              <Icon name="plus" color={colors.background} size={18} />
              <Text style={styles.newWorkoutBtnText}>New Workout</Text>
            </Pressable>
          )}

          {!isToday && workouts.length > 0 && (
            <View style={styles.readOnlyNote}>
              <Icon name="lock" color={colors.textMuted} size={13} />
              <Text style={styles.readOnlyText}>
                Read-only — only today's workouts can be edited.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  headerSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  workoutBlock: {
    marginBottom: 18,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    paddingLeft: 4,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyIconWrap: {
    marginBottom: 12,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  newWorkoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  newWorkoutBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  newWorkoutBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  readOnlyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  readOnlyText: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 6,
  },
});
