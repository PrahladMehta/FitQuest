import { useEffect, useState } from 'react';
import {
  Alert,
  InputAccessoryView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../constants/theme';
import type { Exercise, ExerciseSet } from '../types/workout';
import Icon from './Icon';
import SetRow from './SetRow';

type Props = {
  exercise: Exercise;
  editable: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddSet: (set: Omit<ExerciseSet, 'id'>) => void;
  onUpdateSet: (setId: string, patch: Partial<Omit<ExerciseSet, 'id'>>) => void;
  onDeleteSet: (setId: string) => void;
};

export default function ExerciseCard({
  exercise,
  editable,
  onRename,
  onDelete,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}: Props) {
  const [nameDraft, setNameDraft] = useState(exercise.name);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setNameDraft(exercise.name);
  }, [exercise.name]);

  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setNameDraft(exercise.name);
      return;
    }
    if (trimmed !== exercise.name) onRename(trimmed);
  };

  const confirmDelete = () => {
    Alert.alert('Delete exercise?', `Remove "${exercise.name}" and all its sets.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TextInput
          value={nameDraft}
          onChangeText={setNameDraft}
          onBlur={commitName}
          editable={editable}
          style={[styles.name, !editable && styles.nameReadOnly]}
          placeholder="Exercise name"
          placeholderTextColor={colors.textFaint}
        />
        {editable && (
          <Pressable
            onPress={confirmDelete}
            hitSlop={8}
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
          >
            <Icon name="trash-2" color={colors.danger} size={16} />
          </Pressable>
        )}
      </View>

      {exercise.sets.length === 0 ? (
        <Text style={styles.empty}>
          {editable ? 'No sets yet — add one below.' : 'No sets recorded.'}
        </Text>
      ) : (
        <View style={styles.setList}>
          {exercise.sets.map((set, i) => (
            <SetRow
              key={set.id}
              index={i + 1}
              set={set}
              editable={editable}
              onUpdate={patch => onUpdateSet(set.id, patch)}
              onDelete={() => onDeleteSet(set.id)}
            />
          ))}
        </View>
      )}

      {editable && (adding ? (
        <AddSetForm
          onAdd={set => onAddSet(set)}
          onClose={() => setAdding(false)}
        />
      ) : (
        <Pressable
          onPress={() => setAdding(true)}
          style={({ pressed }) => [styles.addSetBtn, pressed && styles.addSetBtnPressed]}
        >
          <Icon name="plus" color={colors.accent} size={16} />
          <Text style={styles.addSetBtnText}>Add Set</Text>
        </Pressable>
      ))}
    </View>
  );
}

const ADD_SET_ACCESSORY_ID = 'add-set-actions';

function AddSetForm({
  onAdd,
  onClose,
}: {
  onAdd: (set: Omit<ExerciseSet, 'id'>) => void;
  onClose: () => void;
}) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const submit = () => {
    const r = Number(reps);
    if (!Number.isInteger(r) || r <= 0) {
      Alert.alert('Invalid reps', 'Reps must be a positive whole number.');
      return;
    }
    let w: number | undefined;
    if (weight.trim() !== '') {
      const wn = Number(weight);
      if (!Number.isFinite(wn) || wn < 0) {
        Alert.alert('Invalid weight', 'Weight must be a non-negative number.');
        return;
      }
      w = wn;
    }
    onAdd({ reps: r, weight: w });
    setReps('');
    setWeight('');
    onClose();
  };

  const renderActions = (compact: boolean) => (
    <View style={[styles.addActions, compact && styles.addActionsCompact]}>
      <Pressable
        onPress={onClose}
        style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
      >
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.confirmBtn, pressed && styles.confirmBtnPressed]}
      >
        <Icon name="plus" color={colors.background} size={15} />
        <Text style={styles.confirmText}>Add Set</Text>
      </Pressable>
    </View>
  );

  const useAccessory = Platform.OS === 'ios';

  return (
    <View style={styles.addForm}>
      <View style={styles.addFormRow}>
        <View style={styles.addField}>
          <Text style={styles.addLabel}>Reps</Text>
          <TextInput
            value={reps}
            onChangeText={setReps}
            placeholder="10"
            placeholderTextColor={colors.textFaint}
            keyboardType="number-pad"
            style={styles.addInput}
            autoFocus
            returnKeyType="next"
            inputAccessoryViewID={useAccessory ? ADD_SET_ACCESSORY_ID : undefined}
          />
        </View>
        <View style={styles.addFieldGap} />
        <View style={styles.addField}>
          <Text style={styles.addLabel}>Weight (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="optional"
            placeholderTextColor={colors.textFaint}
            keyboardType="decimal-pad"
            style={styles.addInput}
            returnKeyType="done"
            onSubmitEditing={submit}
            inputAccessoryViewID={useAccessory ? ADD_SET_ACCESSORY_ID : undefined}
          />
        </View>
      </View>
      {renderActions(false)}
      {useAccessory && (
        <InputAccessoryView nativeID={ADD_SET_ACCESSORY_ID} backgroundColor={colors.surface}>
          <View style={styles.accessoryBar}>{renderActions(true)}</View>
        </InputAccessoryView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  nameReadOnly: {
    color: colors.text,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  setList: {
    marginBottom: 6,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceDark,
    marginTop: 8,
  },
  addSetBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  addSetBtnText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  addForm: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  addFormRow: {
    flexDirection: 'row',
  },
  addField: {
    flex: 1,
  },
  addFieldGap: {
    width: 10,
  },
  addLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  addInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  addActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  addActionsCompact: {
    marginTop: 0,
  },
  accessoryBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceAlt,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    marginRight: 6,
  },
  doneBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  doneText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  confirmBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  confirmText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
});
