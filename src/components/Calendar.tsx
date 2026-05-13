import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MONTH_NAMES, WEEKDAYS } from '../constants/dates';
import { colors } from '../constants/theme';
import { toDateKey } from '../utils/date';
import type { WorkoutMap } from '../types/workout';
import Icon from './Icon';

type Props = {
  year: number;
  month: number;
  workouts: WorkoutMap;
  todayKey: string;
  onPrev: () => void;
  onNext: () => void;
  onDayPress: (key: string) => void;
};

export default function Calendar({
  year,
  month,
  workouts,
  todayKey,
  onPrev,
  onNext,
  onDayPress,
}: Props) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          onPress={onPrev}
          hitSlop={10}
          style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
        >
          <Icon name="chevron-left" color={colors.text} size={20} />
        </Pressable>
        <Text style={styles.title}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <Pressable
          onPress={onNext}
          hitSlop={10}
          style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
        >
          <Icon name="chevron-right" color={colors.text} size={20} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map(d => (
          <Text key={d} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.cell} />;
          }
          const key = toDateKey(new Date(year, month, day));
          const workout = workouts[key];
          const has = !!workout && workout.exercises.length > 0;
          const isToday = key === todayKey;
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
              onPress={() => onDayPress(key)}
            >
              <View
                style={[
                  styles.dayInner,
                  has && styles.dayInnerDone,
                  isToday && !has && styles.dayInnerToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    has && styles.dayTextDone,
                    isToday && !has && styles.dayTextToday,
                  ]}
                >
                  {day}
                </Text>
                {has && (
                  <View style={styles.tick}>
                    <Icon name="check" color={colors.background} size={9} />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Done</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotToday]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.textFaint,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  cellPressed: {
    opacity: 0.7,
  },
  dayInner: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceDark,
  },
  dayInnerDone: {
    backgroundColor: colors.accent,
  },
  dayInnerToday: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dayTextDone: {
    color: colors.background,
  },
  dayTextToday: {
    color: colors.accent,
  },
  tick: {
    marginTop: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendDotToday: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  legendText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
