import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme/colors';
import { WeatherInfo } from '../types/recipe';

interface Props {
  weather: WeatherInfo;
  matiGreeting?: string;
}

export const WeatherBanner: React.FC<Props> = ({ weather, matiGreeting }) => {
  const temp = weather.temperature;
  const isCold = temp <= 15;
  const isHot = temp >= 25;

  const weatherIcon = isCold ? '🍲' : isHot ? '☀️' : '🌤️';
  const tagBackground = isCold ? '#E3F2FD' : isHot ? '#FFF3E0' : '#E8F5E9';
  const tagColor = isCold ? '#1565C0' : isHot ? '#E65100' : '#2E7D32';

  const defaultGreeting = isCold
    ? '¡Che, qué frío hace hoy! Poné la pava pal mate que hoy sale una comidita que te va a abrigar el corazón...'
    : isHot
    ? '¡Mamita qué calor hace afuera! Ni loco prendas el horno hoy. Vamos a comer algo fresco y liviano al toque.'
    : '¡Hermoso día para cocinar algo rico y casero sin apuro! Mirá lo que te preparé para hoy:';

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Clima actual: ${temp} grados centígrados, ${weather.condition}. Mensaje de Mati: ${matiGreeting || defaultGreeting}`}
    >
      {/* Cabecera del Clima */}
      <View style={styles.topRow}>
        <View style={styles.tempGroup}>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
          <View>
            <Text style={styles.tempNumber}>{temp}°C</Text>
            <Text style={styles.conditionText}>{weather.condition} • {weather.city}</Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: tagBackground }]}>
          <Text style={[styles.badgeText, { color: tagColor }]}>
            {weather.culinaryProfile?.sensationText || (isCold ? '¡Día de Olla!' : isHot ? '¡Día Fresco!' : '¡Día Templado!')}
          </Text>
        </View>
      </View>

      {/* Saludo empático y cercano de Mati */}
      <View style={styles.greetingBox}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarEmoji}>👨‍🍳</Text>
        </View>
        <Text style={styles.greetingText}>
          {matiGreeting || defaultGreeting}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.accessibility.borderRadiusCard,
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  tempGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 34,
    marginRight: 10,
  },
  tempNumber: {
    fontSize: THEME.typography.sizes.hero,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  conditionText: {
    fontSize: THEME.typography.sizes.caption,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 13,
  },
  greetingBox: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardHighlight,
    borderRadius: 16,
    padding: THEME.spacing.sm + 2,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  greetingText: {
    flex: 1,
    fontSize: THEME.typography.sizes.body,
    lineHeight: THEME.typography.lineHeights.body,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    fontWeight: '500',
  }
});
