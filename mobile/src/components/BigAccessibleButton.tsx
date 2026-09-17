import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { THEME } from '../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'socialInstagram' | 'socialTikTok' | 'outline';
  icon?: string;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export const BigAccessibleButton: React.FC<Props> = ({
  title,
  subtitle,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return THEME.colors.secondary;
      case 'socialInstagram':
        return THEME.colors.instagram;
      case 'socialTikTok':
        return THEME.colors.tiktok;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return THEME.colors.primary;
    }
  };

  const isOutline = variant === 'outline';
  const textColor = isOutline ? THEME.colors.primary : THEME.colors.textInverse;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.82}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outlineBorder,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <View style={styles.textColumn}>
            <Text style={[styles.title, { color: textColor }, textStyle]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: isOutline ? THEME.colors.textSecondary : '#FFE0D6' }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: THEME.accessibility.minTouchTarget,
    paddingVertical: THEME.spacing.sm + 2,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.accessibility.borderRadiusButton,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: THEME.spacing.xs,
  },
  outlineBorder: {
    borderWidth: 2.5,
    borderColor: THEME.colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  textColumn: {
    alignItems: 'center',
  },
  title: {
    fontSize: THEME.typography.sizes.bodyLarge,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.caption,
    fontWeight: '500',
    marginTop: 2,
  }
});
