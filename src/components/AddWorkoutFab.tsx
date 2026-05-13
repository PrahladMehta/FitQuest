import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';
import Icon from './Icon';

type Props = {
  bottom: number;
  onPress: () => void;
};

export default function AddWorkoutFab({ bottom, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { bottom },
        pressed && styles.fabPressed,
      ]}
      onPress={onPress}
    >
      <Icon name="plus" color={colors.background} size={20} />
      <Text style={styles.label}>Add Workout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: colors.accentPressed,
  },
  label: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
});
