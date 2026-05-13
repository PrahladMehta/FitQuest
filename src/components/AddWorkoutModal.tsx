import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../constants/theme';
import { genId } from '../utils/id';
import type { Exercise, Workout } from '../types/workout';
import DayPicker from './DayPicker';
import ExerciseFormFields, {
  emptyExerciseDraft,
  validateExercise,
  type ExerciseDraft,
} from './ExerciseFormFields';

type Props = {
  visible: boolean;
  defaultDate: string;
  onClose: () => void;
  onSave: (w: Workout) => void;
};

export default function AddWorkoutModal({
  visible,
  defaultDate,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState('');
  const [dateKey, setDateKey] = useState(defaultDate);
  const [draft, setDraft] = useState<ExerciseDraft>(emptyExerciseDraft);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDateKey(defaultDate);
      setDraft(emptyExerciseDraft);
      setExercises([]);
    }
  }, [visible, defaultDate]);

  const addExercise = () => {
    const error = validateExercise(draft);
    if (error) {
      Alert.alert('Invalid exercise', error);
      return;
    }
    setExercises(prev => [
      ...prev,
      {
        id: genId(),
        name: draft.name.trim(),
        sets: Number(draft.sets),
        reps: Number(draft.reps),
      },
    ]);
    setDraft(emptyExerciseDraft);
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const save = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Title required', 'Give this workout a title (e.g. "Push Day").');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Add an exercise', 'Add at least one exercise before saving.');
      return;
    }
    onSave({
      id: genId(),
      date: dateKey,
      title: trimmedTitle,
      exercises,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>New Workout</Text>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Push Day, Leg Day"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Day</Text>
            <DayPicker value={dateKey} onChange={setDateKey} />

            <Text style={styles.fieldLabel}>Add Exercise</Text>
            <ExerciseFormFields draft={draft} onChange={setDraft} onSubmit={addExercise} />
            <Pressable
              onPress={addExercise}
              style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
            >
              <Text style={styles.addBtnText}>+ Add to list</Text>
            </Pressable>

            {exercises.length > 0 && (
              <FlatList
                data={exercises}
                keyExtractor={e => e.id}
                style={styles.exerciseListBox}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.chip}>
                    <View style={styles.chipInfo}>
                      <Text style={styles.chipText}>{item.name}</Text>
                      <Text style={styles.chipSub}>
                        {item.sets} × {item.reps}
                      </Text>
                    </View>
                    <Pressable onPress={() => removeExercise(item.id)} hitSlop={8}>
                      <Text style={styles.chipX}>✕</Text>
                    </Pressable>
                  </View>
                )}
              />
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.secondaryBtnPressed,
              ]}
            >
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={save}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Save Workout</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.handle,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  addBtnText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  exerciseListBox: {
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  chipInfo: {
    flex: 1,
    marginRight: 8,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  chipSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  chipX: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  primaryBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  secondaryBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
