import { useEffect, useState } from 'react';
import {
  Alert,
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
import type { Exercise, ExerciseSet, Workout } from '../types/workout';
import AddExerciseRow from './AddExerciseRow';
import DayPicker from './DayPicker';
import ExerciseCard from './ExerciseCard';

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
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDateKey(defaultDate);
      setExercises([]);
    }
  }, [visible, defaultDate]);

  const addExercise = (name: string) => {
    setExercises(prev => [...prev, { id: genId(), name, sets: [] }]);
  };

  const renameExercise = (id: string, name: string) => {
    setExercises(prev => prev.map(e => (e.id === id ? { ...e, name } : e)));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const addSet = (exId: string, set: Omit<ExerciseSet, 'id'>) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId ? { ...e, sets: [...e.sets, { ...set, id: genId() }] } : e,
      ),
    );
  };

  const updateSet = (
    exId: string,
    setId: string,
    patch: Partial<Omit<ExerciseSet, 'id'>>,
  ) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId
          ? { ...e, sets: e.sets.map(s => (s.id === setId ? { ...s, ...patch } : s)) }
          : e,
      ),
    );
  };

  const deleteSet = (exId: string, setId: string) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e,
      ),
    );
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

            <Text style={styles.fieldLabel}>Exercises</Text>

            {exercises.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                editable
                onRename={name => renameExercise(ex.id, name)}
                onDelete={() => deleteExercise(ex.id)}
                onAddSet={set => addSet(ex.id, set)}
                onUpdateSet={(setId, patch) => updateSet(ex.id, setId, patch)}
                onDeleteSet={setId => deleteSet(ex.id, setId)}
              />
            ))}

            <AddExerciseRow onAdd={addExercise} />
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
