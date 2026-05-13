import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';

export type ExerciseDraft = {
  name: string;
  sets: string;
  reps: string;
};

type Props = {
  draft: ExerciseDraft;
  onChange: (next: ExerciseDraft) => void;
  onSubmit?: () => void;
};

export default function ExerciseFormFields({ draft, onChange, onSubmit }: Props) {
  return (
    <View>
      <TextInput
        value={draft.name}
        onChangeText={name => onChange({ ...draft, name })}
        placeholder="Exercise name (e.g. Bench Press)"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
      />
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.smallLabel}>Sets</Text>
          <TextInput
            value={draft.sets}
            onChangeText={sets => onChange({ ...draft, sets })}
            placeholder="4"
            placeholderTextColor={colors.textFaint}
            keyboardType="number-pad"
            style={styles.input}
            returnKeyType="next"
          />
        </View>
        <View style={styles.colGap} />
        <View style={styles.col}>
          <Text style={styles.smallLabel}>Reps per set</Text>
          <TextInput
            value={draft.reps}
            onChangeText={reps => onChange({ ...draft, reps })}
            placeholder="8"
            placeholderTextColor={colors.textFaint}
            keyboardType="number-pad"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
    </View>
  );
}

export function validateExercise(draft: ExerciseDraft): string | null {
  if (!draft.name.trim()) return 'Exercise name is required.';
  const sets = Number(draft.sets);
  const reps = Number(draft.reps);
  if (!Number.isFinite(sets) || sets <= 0 || !Number.isInteger(sets)) {
    return 'Sets must be a positive whole number.';
  }
  if (!Number.isFinite(reps) || reps <= 0 || !Number.isInteger(reps)) {
    return 'Reps must be a positive whole number.';
  }
  return null;
}

export const emptyExerciseDraft: ExerciseDraft = { name: '', sets: '', reps: '' };

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  colGap: {
    width: 10,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
});
