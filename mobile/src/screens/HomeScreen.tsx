import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { THEME } from '../theme/colors';
import { DailyFeedResponse, MobileRecipe, WeatherInfo } from '../types/recipe';
import { WeatherBanner } from '../components/WeatherBanner';
import { RecipeCard } from '../components/RecipeCard';
import { BigAccessibleButton } from '../components/BigAccessibleButton';

interface Props {
  onSelectRecipe: (recipe: MobileRecipe) => void;
  apiBaseUrl?: string;
}

export const HomeScreen: React.FC<Props> = ({
  onSelectRecipe,
  apiBaseUrl = 'http://localhost:8000'
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [simulatedTemp, setSimulatedTemp] = useState<number>(12); // Clima invernal por defecto
  const [feed, setFeed] = useState<DailyFeedResponse | null>(null);

  const fetchDailyFeed = async (tempOverride?: number) => {
    setLoading(true);
    const tempToUse = tempOverride !== undefined ? tempOverride : simulatedTemp;

    try {
      // Llamada al API Gateway / BFF
      const url = `${apiBaseUrl}/api/v1/daily-recommendation?city=Buenos%20Aires&temp=${tempToUse}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.recommendation) {
        setFeed({
          weather: data.weather,
          matiGreeting: data.recommendation.matiGreeting,
          featuredRecipe: data.recommendation.featuredRecipe,
          alternativeRecipes: data.recommendation.alternativeRecipes || []
        });
      } else {
        // Fallback local en caso de desconexión momentánea de red
        setFeed(getOfflineFallback(tempToUse));
      }
    } catch (err) {
      console.warn('API Gateway no accesible, activando modo sin conexión de Mati:', err);
      setFeed(getOfflineFallback(tempToUse));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyFeed(simulatedTemp);
  }, [simulatedTemp]);

  const handleTempChange = (temp: number) => {
    setSimulatedTemp(temp);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera Cálida y Humana */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>🍲 MATI ENTRE OLLAS</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>¿Qué comemos hoy?</Text>
          <Text style={styles.subtitle}>
            Comida casera, sin vueltas y para chuparse los dedos.
          </Text>
        </View>

        {/* Selector Accesible de Clima (Ideal para probar cómo la IA adapta los platos) */}
        <View style={styles.tempSelectorSection}>
          <Text style={styles.sectionMiniTitle}>PROBÁ CÓMO CAMBIA SEGÚN EL CLIMA:</Text>
          <View style={styles.tempButtonsRow}>
            <TouchableOpacity
              onPress={() => handleTempChange(8)}
              style={[styles.tempChip, simulatedTemp <= 14 && styles.tempChipActive]}
              accessibilityRole="button"
              accessibilityLabel="Simular día frío de 8 grados para platos de olla"
            >
              <Text style={styles.tempChipText}>❄️ Frío (8°C)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTempChange(19)}
              style={[styles.tempChip, simulatedTemp > 14 && simulatedTemp < 25 && styles.tempChipActive]}
              accessibilityRole="button"
              accessibilityLabel="Simular día templado de 19 grados para tartas o pastas"
            >
              <Text style={styles.tempChipText}>🌤️ Templado (19°C)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTempChange(32)}
              style={[styles.tempChip, simulatedTemp >= 25 && styles.tempChipActive]}
              accessibilityRole="button"
              accessibilityLabel="Simular día caluroso de 32 grados para platos frescos"
            >
              <Text style={styles.tempChipText}>☀️ Calor (32°C)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <Text style={styles.loadingText}>
              Mati está pensando qué cocinar según el clima de hoy...
            </Text>
          </View>
        ) : feed ? (
          <>
            {/* Banner de Clima y Saludo Empático */}
            <WeatherBanner
              weather={feed.weather}
              matiGreeting={feed.matiGreeting}
            />

            {/* Plato Destacado del Día */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>La opción recomendada para hoy</Text>
              <Text style={styles.sectionHint}>Pensada especialmente para este clima</Text>
            </View>

            <RecipeCard
              recipe={feed.featuredRecipe}
              isFeatured={true}
              onPress={() => onSelectRecipe(feed.featuredRecipe)}
            />

            {/* Opciones Alternativas */}
            {feed.alternativeRecipes.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: THEME.spacing.lg }]}>
                  <Text style={styles.sectionTitle}>¿No te convence? Mirá esta otra opción:</Text>
                  <Text style={styles.sectionHint}>Rápida, económica y con la misma onda</Text>
                </View>

                {feed.alternativeRecipes.map((alt) => (
                  <RecipeCard
                    key={alt.id}
                    recipe={alt}
                    isFeatured={false}
                    onPress={() => onSelectRecipe(alt)}
                  />
                ))}
              </>
            )}

            {/* Botón de refresco accesible */}
            <View style={styles.refreshBox}>
              <BigAccessibleButton
                title="Pedir otra sugerencia a la IA"
                subtitle="Mati te busca otra idea al instante"
                icon="💡"
                variant="outline"
                onPress={() => fetchDailyFeed()}
                accessibilityLabel="Pedir otra recomendación de comida a la inteligencia artificial de Mati"
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// Respaldo sin conexión para visualización garantizada
function getOfflineFallback(temp: number): DailyFeedResponse {
  if (temp <= 14) {
    return {
      weather: {
        city: 'Buenos Aires',
        temperature: temp,
        condition: 'Nublado con frío',
        culinaryProfile: {
          category: 'frio',
          sensationText: '¡Día de guiso y frazada!',
          suggestedDishType: 'Platos de olla y cuchara'
        }
      },
      matiGreeting: `¡Che, qué fresquete con estos ${temp}°C! Hoy sale o sale un guisito bien cargado para levantar el ánimo y abrigar el cuerpo.`,
      featuredRecipe: {
        id: 'guiso-lentejas-demo',
        title: 'Guiso Criollo de Lentejas Reconfortante',
        badge: '¡El favorito del invierno!',
        description: 'Con papas en cubitos tiernas, caldito espeso y mucho perfume casero.',
        prepTimeMinutes: 40,
        difficulty: 'Fácil',
        estimatedCost: 'Económico',
        servings: '4 porciones',
        ingredients: [
          { name: 'Lentejas (secas o 2 latas)', amount: '400g' },
          { name: 'Papas medianas', amount: '2 cortadas en cubos' },
          { name: 'Cebolla y morrón picados', amount: '1 de cada uno' },
          { name: 'Puré de tomate', amount: '500g' }
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Sofrito',
            instruction: 'Dorá cebolla y morrón en olla amplia con un poco de aceite.'
          },
          {
            stepNumber: 2,
            title: 'Olla a fuego lento',
            instruction: 'Agregá las papas, puré de tomate, lentejas y 3 tazas de agua caliente. Tapá y cociná 35 min.'
          }
        ],
        matiSecretTip: 'Apagá el fuego y tirale orégano seco y un toque de oliva crudo antes de servir.',
        videoUrl: 'https://www.instagram.com/matientreollas',
        videoPlatform: 'instagram'
      },
      alternativeRecipes: [
        {
          id: 'polenta-demo',
          title: 'Polenta Cremosa con Queso y Salsa',
          badge: 'Rápido en 15 minutos',
          description: 'Cremosa, humeante y con lluvia de queso derretido en el fondo.',
          prepTimeMinutes: 15,
          difficulty: 'Súper fácil',
          servings: '2 a 3 porciones',
          ingredients: [
            { name: 'Polenta mágica', amount: '1 taza' },
            { name: 'Leche o caldo', amount: '3 tazas' },
            { name: 'Queso cremoso', amount: '150g' }
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Hervir y verter',
              instruction: 'Herví leche con sal, volcá la polenta batiendo con fuerza 1 minuto.'
            }
          ],
          matiSecretTip: 'Cubos gigantes de queso en el fondo del plato.',
          videoUrl: 'https://www.tiktok.com/@matientreollas',
          videoPlatform: 'tiktok'
        }
      ]
    };
  } else if (temp >= 25) {
    return {
      weather: {
        city: 'Buenos Aires',
        temperature: temp,
        condition: 'Caluroso y soleado',
        culinaryProfile: {
          category: 'calor',
          sensationText: '¡Mucho calor para prender el horno!',
          suggestedDishType: 'Plato fresco y rápido'
        }
      },
      matiGreeting: `¡Uf, qué calor con ${temp}°C! Ni se te ocurra prender el horno. Hoy vamos con algo fresco de heladera que se hace en un abrir y cerrar de ojos.`,
      featuredRecipe: {
        id: 'bowl-garbanzos-demo',
        title: 'Bowl Fresco de Garbanzos, Palta y Tomate',
        badge: '¡Fresquito y listo en 10 min!',
        description: 'Saciador, lleno de energía y sin prender una sola hornalla.',
        prepTimeMinutes: 10,
        difficulty: 'Súper fácil',
        servings: '2 porciones',
        ingredients: [
          { name: 'Garbanzos cocidos', amount: '1 lata bien enjuagada' },
          { name: 'Palta madura', amount: '1 en cubos' },
          { name: 'Tomates cherry', amount: '1 taza al medio' }
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Mezclar',
            instruction: 'Enjuagá los garbanzos y mezclalos en un bowl con los tomates y la palta.'
          }
        ],
        matiSecretTip: 'Hojitas de albahaca fresca y jugo de limón recién exprimido.',
        videoUrl: 'https://www.instagram.com/matientreollas',
        videoPlatform: 'instagram'
      },
      alternativeRecipes: []
    };
  } else {
    return {
      weather: {
        city: 'Buenos Aires',
        temperature: temp,
        condition: 'Agradable y templado',
        culinaryProfile: {
          category: 'templado',
          sensationText: 'Clima ideal',
          suggestedDishType: 'Clásicos caseros'
        }
      },
      matiGreeting: `¡Hermoso día con ${temp}°C! Da gusto entrar a la cocina a preparar algo casero y rendidor.`,
      featuredRecipe: {
        id: 'tarta-zapallitos-demo',
        title: 'Tarta Dorada de Zapallitos y Queso',
        badge: '¡Clásico rendidor!',
        description: 'Masa crujiente y relleno cremoso con queso derretido.',
        prepTimeMinutes: 35,
        difficulty: 'Fácil',
        servings: '4 porciones',
        ingredients: [
          { name: 'Zapallitos', amount: '4 medianos' },
          { name: 'Huevos', amount: '3 unidades' },
          { name: 'Masa para tarta', amount: '1 tapa' }
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Saltear y mezclar',
            instruction: 'Salteá los zapallitos picados, mezclá con huevos y queso, y horneá 30 min.'
          }
        ],
        matiSecretTip: 'Poné queso rallado sobre la masa antes del relleno para que quede bien crocante.',
        videoUrl: 'https://www.instagram.com/matientreollas',
        videoPlatform: 'instagram'
      },
      alternativeRecipes: []
    };
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.xl * 2,
  },
  header: {
    marginBottom: THEME.spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandBadge: {
    backgroundColor: '#FFEADF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8C8B1',
  },
  brandBadgeText: {
    color: THEME.colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: THEME.typography.sizes.hero,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.body,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  tempSelectorSection: {
    backgroundColor: THEME.colors.cardBackground,
    padding: THEME.spacing.sm,
    borderRadius: 16,
    marginVertical: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionMiniTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tempButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempChip: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 12,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  tempChipActive: {
    backgroundColor: '#FFE9DF',
    borderColor: THEME.colors.primary,
  },
  tempChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  loadingContainer: {
    paddingVertical: THEME.spacing.xl * 2,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.typography.sizes.body,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.lg,
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
  sectionHint: {
    fontSize: THEME.typography.sizes.caption,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  refreshBox: {
    marginTop: THEME.spacing.lg,
  }
});
