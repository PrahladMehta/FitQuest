import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AddExerciseRow from '../components/AddExerciseRow';
import ExerciseCard from '../components/ExerciseCard';
import Icon from '../components/Icon';
import { MONTH_NAMES, WEEKDAYS } from '../constants/dates';
import { colors } from '../constants/theme';
import { useWorkoutsContext } from '../context/WorkoutsContext';
import type { RootStackParamList } from '../types/navigation';
import { toDateKey } from '../utils/date';
import { genId } from '../utils/id';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWorkout'>;

export default function AddWorkoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const {
    workouts,
    upsertWorkout,
    deleteWorkout,
    setTitle,
    addExerciseEnsuringWorkout,
    renameExercise,
    deleteExercise,
    addSet,
    updateSet,
    deleteSet,
  } = useWorkoutsContext();

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);
  const todayLabel = useMemo(
    () =>
      `${WEEKDAYS[today.getDay()]}, ${MONTH_NAMES[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
    [today],
  );

  const workout = workouts[todayKey];

  const [titleDraft, setTitleDraft] = useState(workout?.title ?? '');
  useEffect(() => {
    setTitleDraft(workout?.title ?? '');
  }, [workout?.title]);

  const ensureWorkoutWithTitle = useCallback(
    (titleToUse: string): boolean => {
      if (workout) return true;
      if (!titleToUse.trim()) return false;
      upsertWorkout({
        id: genId(),
        date: todayKey,
        title: titleToUse.trim(),
        exercises: [],
      });
      return true;
    },
    [workout, todayKey, upsertWorkout],
  );

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(workout?.title ?? '');
      return;
    }
    if (workout) {
      if (trimmed !== workout.title) setTitle(todayKey, trimmed);
    } else {
      upsertWorkout({
        id: genId(),
        date: todayKey,
        title: trimmed,
        exercises: [],
      });
    }
  };

  const handleAddExercise = useCallback(
    (name: string) => {
      addExerciseEnsuringWorkout(
        todayKey,
        name,
        titleDraft.trim() || 'Workout',
      );
    },
    [todayKey, titleDraft, addExerciseEnsuringWorkout],
  );

  const confirmDiscardEmpty = () => {
    console.log('confirmDiscardEmpty', workout);
    if (workout && workout.exercises.length === 0) {
      Alert.alert(
        'Discard empty workout?',
        'You haven\'t added any exercises. Discard this workout?',
        [
          { text: 'Keep', style: 'cancel', onPress: () => navigation.goBack() },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              deleteWorkout(todayKey);
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.dateChip}>
          <Icon name="calendar" color={colors.accent} size={14} />
          <Text style={styles.dateChipText}>{todayLabel}</Text>
        </View>

        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          value={titleDraft}
          onChangeText={setTitleDraft}
          onBlur={commitTitle}
          placeholder="e.g. Push Day, Leg Day"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Exercises</Text>

        {workout?.exercises.map(ex => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            editable
            onRename={name => renameExercise(todayKey, ex.id, name)}
            onDelete={() => deleteExercise(todayKey, ex.id)}
            onAddSet={set => addSet(todayKey, ex.id, set)}
            onUpdateSet={(setId, patch) => updateSet(todayKey, ex.id, setId, patch)}
            onDeleteSet={setId => deleteSet(todayKey, ex.id, setId)}
          />
        ))}

        <AddExerciseRow onAdd={handleAddExercise} />

        <Text style={styles.helperText}>
          Changes are saved automatically.
        </Text>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={confirmDiscardEmpty}
          style={({ pressed }) => [
            styles.doneBtn,
            pressed && styles.doneBtnPressed,
          ]}
        >
          <Icon name="check" color={colors.background} size={18} />
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(123, 211, 137, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },
  dateChipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 16,
  },
  helperText: {
    textAlign: 'center',
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  doneBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  doneBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
});
