import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon, { type IconName } from '../components/Icon';
import { colors } from '../constants/theme';
import { pickRandomQuote } from '../constants/quotes';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const quote = useMemo(() => pickRandomQuote(), []);

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Icon name="zap" color={colors.background} size={20} />
          </View>
          <Text style={styles.brand}>Gym Tracker</Text>
        </View>
        <Text style={styles.tagline}>Stay consistent. Grow stronger.</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quoteText}>{quote.text}</Text>
        {quote.author && <Text style={styles.quoteAuthor}>— {quote.author}</Text>}
      </View>

      <View style={styles.actions}>
        <ActionButton
          label="Start Tracking"
          subLabel="Log a workout for today"
          icon="activity"
          variant="primary"
          onPress={() => navigation.navigate('AddWorkout')}
        />
        <ActionButton
          label="See Your Consistency"
          subLabel="View the calendar"
          icon="calendar"
          variant="secondary"
          onPress={() => navigation.navigate('Tracker')}
        />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  subLabel,
  icon,
  variant,
  onPress,
}: {
  label: string;
  subLabel: string;
  icon: IconName;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        isPrimary ? styles.actionPrimary : styles.actionSecondary,
        pressed && (isPrimary ? styles.actionPrimaryPressed : styles.actionSecondaryPressed),
      ]}
    >
      <View
        style={[
          styles.actionIconWrap,
          isPrimary ? styles.actionIconWrapPrimary : styles.actionIconWrapSecondary,
        ]}
      >
        <Icon
          name={icon}
          color={isPrimary ? colors.background : colors.accent}
          size={20}
        />
      </View>
      <View style={styles.actionText}>
        <Text
          style={[
            styles.actionLabel,
            isPrimary ? styles.actionLabelPrimary : styles.actionLabelSecondary,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.actionSub,
            isPrimary ? styles.actionSubPrimary : styles.actionSubSecondary,
          ]}
        >
          {subLabel}
        </Text>
      </View>
      <Icon
        name="arrow-right"
        color={isPrimary ? colors.background : colors.text}
        size={18}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  tagline: {
    marginTop: 10,
    fontSize: 15,
    color: colors.textMuted,
  },
  quoteCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  quoteMark: {
    color: colors.accent,
    fontSize: 56,
    lineHeight: 56,
    fontWeight: '900',
    marginBottom: -10,
  },
  quoteText: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  quoteAuthor: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
  },
  actionPrimary: {
    backgroundColor: colors.accent,
  },
  actionPrimaryPressed: {
    backgroundColor: colors.accentPressed,
  },
  actionSecondary: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  actionSecondaryPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionIconWrapPrimary: {
    backgroundColor: 'rgba(14, 15, 19, 0.15)',
  },
  actionIconWrapSecondary: {
    backgroundColor: 'rgba(123, 211, 137, 0.12)',
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionLabelPrimary: {
    color: colors.background,
  },
  actionLabelSecondary: {
    color: colors.text,
  },
  actionSub: {
    fontSize: 12,
  },
  actionSubPrimary: {
    color: 'rgba(14, 15, 19, 0.7)',
  },
  actionSubSecondary: {
    color: colors.textMuted,
  },
});
