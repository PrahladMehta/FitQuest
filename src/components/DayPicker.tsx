import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { WEEKDAYS } from '../constants/dates';
import { colors } from '../constants/theme';
import { toDateKey } from '../utils/date';

type Props = {
  value: string;
  onChange: (key: string) => void;
};

export default function DayPicker({ value, onChange }: Props) {
  const days = useMemo(() => {
    const arr: { key: string; label: string; sub: string }[] = [];
    const base = new Date();
    for (let i = -7; i <= 0; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push({
        key: toDateKey(d),
        label: String(d.getDate()),
        sub: WEEKDAYS[d.getDay()],
      });
    }
    return arr;
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map(d => {
        const selected = d.key === value;
        return (
          <Pressable
            key={d.key}
            onPress={() => onChange(d.key)}
            style={({ pressed }) => [
              styles.cell,
              selected && styles.cellSelected,
              pressed && styles.cellPressed,
            ]}
          >
            <Text style={[styles.sub, selected && styles.textSelected]}>{d.sub}</Text>
            <Text style={[styles.label, selected && styles.textSelected]}>{d.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  cell: {
    width: 52,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    marginRight: 8,
  },
  cellSelected: {
    backgroundColor: colors.accent,
  },
  cellPressed: {
    opacity: 0.8,
  },
  sub: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  textSelected: {
    color: colors.background,
  },
});
