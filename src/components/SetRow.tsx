import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';
import type { ExerciseSet } from '../types/workout';
import Icon from './Icon';

type Props = {
  index: number;
  set: ExerciseSet;
  editable: boolean;
  onUpdate: (patch: Partial<Omit<ExerciseSet, 'id'>>) => void;
  onDelete: () => void;
};

export default function SetRow({ index, set, editable, onUpdate, onDelete }: Props) {
  const [repsDraft, setRepsDraft] = useState(String(set.reps));
  const [weightDraft, setWeightDraft] = useState(
    set.weight != null ? String(set.weight) : '',
  );

  useEffect(() => {
    setRepsDraft(String(set.reps));
  }, [set.reps]);

  useEffect(() => {
    setWeightDraft(set.weight != null ? String(set.weight) : '');
  }, [set.weight]);

  const commitReps = () => {
    const n = Number(repsDraft);
    if (Number.isInteger(n) && n > 0) {
      if (n !== set.reps) onUpdate({ reps: n });
    } else {
      setRepsDraft(String(set.reps));
    }
  };

  const commitWeight = () => {
    if (weightDraft.trim() === '') {
      if (set.weight !== undefined) onUpdate({ weight: undefined });
      return;
    }
    const n = Number(weightDraft);
    if (Number.isFinite(n) && n >= 0) {
      if (n !== set.weight) onUpdate({ weight: n });
    } else {
      setWeightDraft(set.weight != null ? String(set.weight) : '');
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index}</Text>
      </View>

      <View style={styles.field}>
        <TextInput
          value={repsDraft}
          onChangeText={setRepsDraft}
          onBlur={commitReps}
          editable={editable}
          keyboardType="number-pad"
          selectTextOnFocus
          style={[styles.input, !editable && styles.inputReadOnly]}
        />
        <Text style={styles.unit}>reps</Text>
      </View>

      <View style={styles.timesWrap}>
        <Icon name="x" color={colors.textFaint} size={14} />
      </View>

      <View style={styles.field}>
        <TextInput
          value={weightDraft}
          onChangeText={setWeightDraft}
          onBlur={commitWeight}
          editable={editable}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={colors.textFaint}
          selectTextOnFocus
          style={[styles.input, !editable && styles.inputReadOnly]}
        />
        <Text style={styles.unit}>kg</Text>
      </View>

      {editable && (
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
        >
          <Icon name="trash-2" color={colors.danger} size={15} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  indexText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flex: 1,
  },
  input: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
    minWidth: 32,
  },
  inputReadOnly: {
    color: colors.textBody,
  },
  unit: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  timesWrap: {
    marginHorizontal: 8,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
