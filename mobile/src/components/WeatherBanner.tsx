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
      {/* Encabezado del Clima */}
      <View style={styles.weatherHeader}>
        <Text style={styles.weatherIcon}>{weatherIcon}</Text>
        <View style={styles.tempInfoContainer}>
          <View style={styles.tempBadgeRow}>
            <Text style={styles.tempNumber}>{temp}°C</Text>
            <View style={[styles.badge, { backgroundColor: tagBackground }]}>
              <Text style={[styles.badgeText, { color: tagColor }]} numberOfLines={1}>
                {weather.culinaryProfile?.sensationText || (isCold ? '¡Día de Olla!' : isHot ? '¡Día Fresco!' : '¡Día Templado!')}
              </Text>
            </View>
          </View>
          <Text style={styles.conditionText} numberOfLines={1} ellipsizeMode="tail">
            {weather.condition}
          </Text>
        </View>
      </View>

      {/* Línea divisoria muy fina y sutil */}
      <View style={styles.divider} />

      {/* Mensaje de Mati integrado de forma fluida, sin borde interior ni caja separada */}
      <View style={styles.messageContainer}>
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 34,
    marginRight: 12,
  },
  tempInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  tempBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tempNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 32,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  conditionText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECE4',
    marginVertical: 12,
  },
  messageContainer: {
    paddingTop: 2,
  },
  greetingText: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME.colors.textPrimary,
    fontWeight: '400',
  }
});
