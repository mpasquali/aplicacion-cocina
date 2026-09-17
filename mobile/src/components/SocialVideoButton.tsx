import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Linking,
  Alert
} from 'react-native';
import { THEME } from '../theme/colors';

interface Props {
  videoUrl: string;
  platform?: 'instagram' | 'tiktok';
  recipeTitle: string;
}

export const SocialVideoButton: React.FC<Props> = ({
  videoUrl,
  platform = 'instagram',
  recipeTitle
}) => {
  const isInstagram = platform === 'instagram';
  const networkName = isInstagram ? 'Instagram' : 'TikTok';
  const icon = isInstagram ? '📸' : '🎵';
  const brandColor = isInstagram ? THEME.colors.instagram : THEME.colors.tiktok;

  const handleOpenVideo = async () => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        // Fallback al perfil oficial de Mati
        const fallbackUrl = isInstagram
          ? 'https://www.instagram.com/matientreollas'
          : 'https://www.tiktok.com/@matientreollas';
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      Alert.alert(
        'Abriendo video de Mati',
        `Podes buscar esta receta en el perfil de Instagram @matientreollas`,
        [{ text: 'Entendido' }]
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handleOpenVideo}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Ver video explicativo de ${recipeTitle} en ${networkName} de Mati entre ollas`}
      accessibilityHint="Abre la aplicación de redes sociales o el navegador para ver a Mati cocinando este plato paso a paso"
      style={[styles.container, { backgroundColor: brandColor }]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.pillRow}>
          <Text style={styles.pillText}>EN REDES • MATI ENTRE OLLAS</Text>
        </View>
        <Text style={styles.mainActionText}>
          Ver video explicativo en {networkName}
        </Text>
        <Text style={styles.subActionText}>
          ¡Mirá a Mati explicándolo paso a paso en segundos!
        </Text>
      </View>

      <Text style={styles.arrowIcon}>▶</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm + 4,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.accessibility.borderRadiusButton,
    marginVertical: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  pillRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainActionText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.bodyLarge,
    fontWeight: '800',
  },
  subActionText: {
    color: '#FFF0F5',
    fontSize: THEME.typography.sizes.caption,
    marginTop: 2,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 8,
    fontWeight: 'bold',
  }
});
