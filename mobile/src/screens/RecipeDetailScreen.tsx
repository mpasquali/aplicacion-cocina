import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { THEME } from '../theme/colors';
import { MobileRecipe } from '../types/recipe';
import { SocialVideoButton } from '../components/SocialVideoButton';
import { BigAccessibleButton } from '../components/BigAccessibleButton';

interface Props {
  recipe: MobileRecipe;
  onBack: () => void;
}

export const RecipeDetailScreen: React.FC<Props> = ({ recipe, onBack }) => {
  // Estado local para permitir al usuario tachar ingredientes que ya tiene listos
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Barra superior con botón volver gigante y accesible */}
      <View style={styles.topNavigation}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Volver a las opciones del día"
          accessibilityHint="Regresa a la pantalla principal"
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Volver a opciones</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera y Badge de la Receta */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{recipe.badge || 'Receta de Mati'}</Text>
          </View>
        </View>

        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        {/* Tarjeta de métricas amigables */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricEmoji}>⏱️</Text>
            <Text style={styles.metricValue}>{recipe.prepTimeMinutes} min</Text>
            <Text style={styles.metricLabel}>Tiempo total</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricEmoji}>🌱</Text>
            <Text style={styles.metricValue}>{recipe.difficulty}</Text>
            <Text style={styles.metricLabel}>Dificultad</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricEmoji}>🍲</Text>
            <Text style={styles.metricValue}>{recipe.servings}</Text>
            <Text style={styles.metricLabel}>Rinde</Text>
          </View>
        </View>

        {/* BOTÓN PROMINENTE DE REDES SOCIALES (Instagram / TikTok de Mati entre ollas) */}
        <SocialVideoButton
          videoUrl={recipe.videoUrl}
          platform={recipe.videoPlatform || 'instagram'}
          recipeTitle={recipe.title}
        />

        {/* Sección: El Secreto de Oro de Mati */}
        {recipe.matiSecretTip ? (
          <View
            style={styles.secretTipCard}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel={`El secreto de Mati: ${recipe.matiSecretTip}`}
          >
            <View style={styles.secretTipHeader}>
              <Text style={styles.secretTipEmoji}>💡</Text>
              <Text style={styles.secretTipTitle}>El secreto de Mati</Text>
            </View>
            <Text style={styles.secretTipText}>{recipe.matiSecretTip}</Text>
          </View>
        ) : null}

        {/* Sección de Ingredientes con tilde táctil */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🛒 ¿Qué vas a necesitar?</Text>
          <Text style={styles.sectionSubtitle}>
            Tocá cada ingrediente para marcarlo cuando lo tengas a mano:
          </Text>
        </View>

        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ing, idx) => {
            const isChecked = !!checkedIngredients[idx];
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => toggleIngredient(idx)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                accessibilityLabel={`${ing.amount} de ${ing.name}. ${isChecked ? 'Marcado como conseguido' : 'Pendiente'}`}
                style={[
                  styles.ingredientRow,
                  isChecked && styles.ingredientRowChecked
                ]}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                  <Text style={styles.checkboxText}>{isChecked ? '✓' : ''}</Text>
                </View>

                <View style={styles.ingredientTexts}>
                  <Text style={[styles.ingredientAmount, isChecked && styles.ingredientTextChecked]}>
                    {ing.amount}
                  </Text>
                  <Text style={[styles.ingredientName, isChecked && styles.ingredientTextChecked]}>
                    {ing.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sección de Preparación Paso a Paso Súper Visual */}
        <View style={[styles.sectionHeader, { marginTop: THEME.spacing.lg }]}>
          <Text style={styles.sectionTitle}>👩‍🍳 Paso a paso sin complicaciones</Text>
          <Text style={styles.sectionSubtitle}>
            Seguí estos pasos sencillos y te sale de diez:
          </Text>
        </View>

        <View style={styles.stepsList}>
          {recipe.steps.map((step, idx) => (
            <View
              key={idx}
              style={styles.stepCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Paso ${step.stepNumber}: ${step.title}. Instrucción: ${step.instruction}`}
            >
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title || `Paso ${step.stepNumber}`}</Text>
                <Text style={styles.stepInstruction}>{step.instruction}</Text>

                {step.visualTip ? (
                  <View style={styles.visualTipBox}>
                    <Text style={styles.visualTipLabel}>👀 Ojo con esto:</Text>
                    <Text style={styles.visualTipText}>{step.visualTip}</Text>
                  </View>
                ) : null}

                {step.timerMinutes ? (
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerText}>⏳ Tiempo aproximado: {step.timerMinutes} min</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Botón inferior para regresar */}
        <View style={styles.bottomActions}>
          <BigAccessibleButton
            title="Listo, ¡a comer!"
            subtitle="Volver a las sugerencias del día"
            icon="🎉"
            onPress={onBack}
            accessibilityLabel="Finalizar y volver a la pantalla principal"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topNavigation: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#F0ECE4',
    borderRadius: 14,
    minHeight: 48,
  },
  backIcon: {
    fontSize: 22,
    color: THEME.colors.textPrimary,
    fontWeight: '900',
    marginRight: 8,
  },
  backText: {
    fontSize: THEME.typography.sizes.body,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl * 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xs,
  },
  badge: {
    backgroundColor: '#FFEADF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  title: {
    fontSize: THEME.typography.sizes.h1,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    lineHeight: THEME.typography.lineHeights.h1,
    marginVertical: THEME.spacing.xs,
  },
  description: {
    fontSize: THEME.typography.sizes.bodyLarge,
    lineHeight: THEME.typography.lineHeights.bodyLarge,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 18,
    paddingVertical: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 35,
    backgroundColor: THEME.colors.border,
  },
  secretTipCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 18,
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    borderWidth: 1.5,
    borderColor: '#F6E09E',
    borderLeftWidth: 6,
    borderLeftColor: THEME.colors.amberWarm,
  },
  secretTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  secretTipEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  secretTipTitle: {
    fontSize: THEME.typography.sizes.bodyLarge,
    fontWeight: '800',
    color: THEME.colors.amberWarm,
  },
  secretTipText: {
    fontSize: THEME.typography.sizes.body,
    lineHeight: THEME.typography.lineHeights.body,
    color: '#6B4701',
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xs,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.h2,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: THEME.typography.sizes.caption,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  ingredientsList: {
    marginTop: THEME.spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    minHeight: 56,
  },
  ingredientRowChecked: {
    backgroundColor: '#F3EFE9',
    borderColor: '#DDD6CC',
    opacity: 0.7,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: THEME.colors.primary,
  },
  checkboxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ingredientTexts: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientAmount: {
    fontSize: THEME.typography.sizes.bodyLarge,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginRight: 8,
  },
  ingredientName: {
    fontSize: THEME.typography.sizes.bodyLarge,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textSecondary,
  },
  stepsList: {
    marginTop: THEME.spacing.xs,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 18,
    padding: THEME.spacing.md,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  stepNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: THEME.typography.sizes.bodyLarge,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  stepInstruction: {
    fontSize: THEME.typography.sizes.body,
    lineHeight: THEME.typography.lineHeights.body,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  visualTipBox: {
    backgroundColor: '#F7F4EE',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.secondary,
  },
  visualTipLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.secondary,
    marginBottom: 2,
  },
  visualTipText: {
    fontSize: 14,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  timerBadge: {
    backgroundColor: '#EDF4FB',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
  },
  bottomActions: {
    marginTop: THEME.spacing.xl,
  }
});
