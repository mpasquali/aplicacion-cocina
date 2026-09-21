import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { THEME } from '../theme/colors';
import { MobileRecipe } from '../types/recipe';

interface Props {
  recipe: MobileRecipe;
  onPress: () => void;
  isFeatured?: boolean;
}

export const RecipeCard: React.FC<Props> = ({
  recipe,
  onPress,
  isFeatured = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${isFeatured ? 'Recomendación principal:' : 'Opción alternativa:'} ${recipe.title}. Tiempo: ${recipe.prepTimeMinutes} minutos. Dificultad: ${recipe.difficulty}. Toca para abrir la receta completa.`}
      style={[
        styles.card,
        isFeatured && styles.featuredCard
      ]}
    >
      {/* Badge de cabecera */}
      <View style={styles.headerBadgeRow}>
        <View style={[styles.badge, isFeatured ? styles.badgeFeatured : styles.badgeNormal]}>
          <Text style={[styles.badgeText, isFeatured && styles.badgeTextFeatured]}>
            {recipe.badge || (isFeatured ? '⭐ Plato Recomendado' : 'Opción Rica')}
          </Text>
        </View>
        <View style={styles.socialIndicator}>
          <Text style={styles.socialIndicatorText}>📹 Video de Mati</Text>
        </View>
      </View>

      {/* Título y descripción de la receta */}
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {recipe.description}
      </Text>

      {/* Metadatos accesibles con iconos grandes */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⏱️</Text>
          <Text style={styles.metaText}>{recipe.prepTimeMinutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>🌱</Text>
          <Text style={styles.metaText}>{recipe.difficulty}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>👥</Text>
          <Text style={styles.metaText}>{recipe.servings}</Text>
        </View>
      </View>

      {/* Botón de acción integrado */}
      <View style={styles.actionRow}>
        <Text style={styles.actionButtonText}>
          Ver ingredientes y paso a paso
        </Text>
        <Text style={styles.actionArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.accessibility.borderRadiusCard,
    padding: THEME.spacing.md,
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredCard: {
    borderColor: THEME.colors.primary,
    borderWidth: 2,
    backgroundColor: '#FFFDF9',
  },
  headerBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeFeatured: {
    backgroundColor: '#FFE9DF',
  },
  badgeNormal: {
    backgroundColor: '#F1EFE9',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
  },
  badgeTextFeatured: {
    color: THEME.colors.primary,
  },
  socialIndicator: {
    backgroundColor: '#FDF2F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  socialIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.instagram,
  },
  title: {
    fontSize: THEME.typography.sizes.h2,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: THEME.spacing.xs,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: THEME.typography.sizes.body,
    lineHeight: THEME.typography.lineHeights.body,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: 14,
    padding: THEME.spacing.sm,
    justifyContent: 'space-around',
    marginBottom: THEME.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  metaText: {
    fontSize: THEME.typography.sizes.caption,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  actionButtonText: {
    fontSize: THEME.typography.sizes.body,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  actionArrow: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  }
});
