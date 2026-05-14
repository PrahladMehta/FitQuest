import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';
import type { BottomBarActions } from './ExerciseCard';
import Icon from './Icon';

type Props = {
  onAdd: (name: string) => void;
  placeholder?: string;
  registerActions?: (actions: BottomBarActions) => () => void;
};

export default function AddExerciseRow({ onAdd, placeholder, registerActions }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const close = () => {
    setOpen(false);
    setName('');
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  };

  const submitRef = useRef(submit);
  submitRef.current = submit;
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open || !registerActions) return;
    return registerActions({
      submit: () => submitRef.current(),
      close: () => closeRef.current(),
      submitLabel: 'Add Exercise',
    });
  }, [open, registerActions]);

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Icon name="plus" color={colors.accent} size={16} />
        <Text style={styles.btnText}>Add Exercise</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.form}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={placeholder || 'Exercise name'}
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      {!registerActions && (
        <View style={styles.actions}>
          <Pressable
            onPress={close}
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
          >
            <Text style={styles.cancelText}>Done</Text>
          </Pressable>
          <Pressable
            onPress={submit}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
          >
            <Icon name="plus" color={colors.background} size={15} />
            <Text style={styles.saveText}>Add</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  btnPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  btnText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    marginRight: 6,
  },
  cancelBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  cancelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  saveBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  saveText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
});
