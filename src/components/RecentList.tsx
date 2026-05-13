import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { formatLongDate } from '../utils/date';
import type { WorkoutMap } from '../types/workout';

type Props = {
  workouts: WorkoutMap;
  onPress: (key: string) => void;
};

export default function RecentList({ workouts, onPress }: Props) {
  const keys = Object.keys(workouts).sort((a, b) => (a < b ? 1 : -1)).slice(0, 5);

  if (keys.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>No workouts yet.</Text>
        <Text style={styles.emptySub}>Tap "Add Workout" to log your first session.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {keys.map(key => {
        const list = workouts[key];
        const titles = list.map(w => w.title).join(' • ');
        const totalEx = list.reduce((s, w) => s + w.exercises.length, 0);
        return (
          <Pressable
            key={key}
            onPress={() => onPress(key)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.info}>
              <Text style={styles.date}>{formatLongDate(key)}</Text>
              <Text style={styles.titles} numberOfLines={1}>
                {titles}
              </Text>
            </View>
            <Text style={styles.badge}>{totalEx} ex</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  info: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  titles: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    backgroundColor: 'rgba(123, 211, 137, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
