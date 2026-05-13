import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  value: string;
  label: string;
};

export default function SummaryStat({ value, label }: Props) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
