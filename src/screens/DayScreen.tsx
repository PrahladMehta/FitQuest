import { useState } from 'react';
import {
  Alert,
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

import ExerciseFormFields, {
  emptyExerciseDraft,
  validateExercise,
  type ExerciseDraft,
} from '../components/ExerciseFormFields';
import { colors } from '../constants/theme';
import { formatLongDate } from '../utils/date';
import { genId } from '../utils/id';
import type { Workout } from '../types/workout';

type Props = {
  dateKey: string | null;
  todayKey: string;
  workouts: Workout[];
  onClose: () => void;
  onAddExercise: (workoutId: string, exercise: ReturnType<typeof buildExercise>) => void;
  onDeleteExercise: (workoutId: string, exerciseId: string) => void;
  onCreateNewWorkout: () => void;
};

function buildExercise(draft: ExerciseDraft) {
  return {
    id: genId(),
    name: draft.name.trim(),
    sets: Number(draft.sets),
    reps: Number(draft.reps),
  };
}

export default function DayScreen({
  dateKey,
  todayKey,
  workouts,
  onClose,
  onAddExercise,
  onDeleteExercise,
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
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isToday ? 'Today' : 'Workout Log'}
            </Text>
            {dateKey && (
              <Text style={styles.headerSub}>{formatLongDate(dateKey)}</Text>
            )}
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
            <EmptyDay isToday={isToday} />
          ) : (
            workouts.map(w => (
              <WorkoutCard
                key={w.id}
                workout={w}
                editable={isToday}
                onAddExercise={ex => onAddExercise(w.id, ex)}
                onDeleteExercise={exId => onDeleteExercise(w.id, exId)}
              />
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
              <Text style={styles.newWorkoutBtnText}>+ New Workout</Text>
            </Pressable>
          )}

          {!isToday && workouts.length > 0 && (
            <View style={styles.readOnlyNote}>
              <Text style={styles.readOnlyText}>
                🔒 Read-only — only today's workouts can be edited.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EmptyDay({ isToday }: { isToday: boolean }) {
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyIcon}>🗓️</Text>
      <Text style={styles.emptyTitle}>No workouts logged</Text>
      <Text style={styles.emptySub}>
        {isToday
          ? 'Create your first workout for today below.'
          : 'Nothing was logged on this day.'}
      </Text>
    </View>
  );
}

function WorkoutCard({
  workout,
  editable,
  onAddExercise,
  onDeleteExercise,
}: {
  workout: Workout;
  editable: boolean;
  onAddExercise: (ex: ReturnType<typeof buildExercise>) => void;
  onDeleteExercise: (exerciseId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<ExerciseDraft>(emptyExerciseDraft);

  const submit = () => {
    const error = validateExercise(draft);
    if (error) {
      Alert.alert('Invalid exercise', error);
      return;
    }
    onAddExercise(buildExercise(draft));
    setDraft(emptyExerciseDraft);
    setAdding(false);
  };

  const confirmDelete = (exerciseId: string, name: string) => {
    Alert.alert('Delete exercise?', `Remove "${name}" from this workout.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDeleteExercise(exerciseId),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{workout.title}</Text>

      {workout.exercises.length === 0 ? (
        <Text style={styles.cardEmpty}>No exercises yet.</Text>
      ) : (
        workout.exercises.map(ex => (
          <View key={ex.id} style={styles.exerciseRow}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMeta}>
                {ex.sets} sets × {ex.reps} reps
              </Text>
            </View>
            {editable && (
              <Pressable
                onPress={() => confirmDelete(ex.id, ex.name)}
                hitSlop={8}
                style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.deleteX}>✕</Text>
              </Pressable>
            )}
          </View>
        ))
      )}

      {editable && !adding && (
        <Pressable
          onPress={() => setAdding(true)}
          style={({ pressed }) => [styles.addRow, pressed && styles.addRowPressed]}
        >
          <Text style={styles.addRowText}>+ Add exercise</Text>
        </Pressable>
      )}

      {editable && adding && (
        <View style={styles.inlineForm}>
          <ExerciseFormFields draft={draft} onChange={setDraft} onSubmit={submit} />
          <View style={styles.inlineActions}>
            <Pressable
              onPress={() => {
                setAdding(false);
                setDraft(emptyExerciseDraft);
              }}
              style={({ pressed }) => [
                styles.inlineCancelBtn,
                pressed && styles.inlineCancelBtnPressed,
              ]}
            >
              <Text style={styles.inlineCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              style={({ pressed }) => [
                styles.inlineSaveBtn,
                pressed && styles.inlineSaveBtnPressed,
              ]}
            >
              <Text style={styles.inlineSaveText}>Add</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
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
  backIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  cardEmpty: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteX: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  addRow: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    alignItems: 'center',
    marginTop: 8,
  },
  addRowPressed: {
    backgroundColor: 'rgba(123, 211, 137, 0.08)',
  },
  addRowText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  inlineForm: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
  },
  inlineActions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  inlineCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    marginRight: 6,
  },
  inlineCancelBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  inlineCancelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  inlineSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    marginLeft: 6,
  },
  inlineSaveBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  inlineSaveText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyIcon: {
    fontSize: 40,
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
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  newWorkoutBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  newWorkoutBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  readOnlyNote: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    alignItems: 'center',
  },
  readOnlyText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
