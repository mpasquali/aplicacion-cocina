import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { THEME } from '../theme/colors';
import { DailyFeedResponse, MobileRecipe, WeatherInfo } from '../types/recipe';
import { WeatherBanner } from '../components/WeatherBanner';
import { RecipeCard } from '../components/RecipeCard';
import { BigAccessibleButton } from '../components/BigAccessibleButton';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { fetchRealWeather } from '../services/weatherService';

interface Props {
  onSelectRecipe: (recipe: MobileRecipe) => void;
  onOpenChat?: (weather?: WeatherInfo) => void;
  apiBaseUrl?: string;
}

export const HomeScreen: React.FC<Props> = ({
  onSelectRecipe,
  onOpenChat,
  apiBaseUrl = API_BASE_URL
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [isGps, setIsGps] = useState<boolean>(false);
  const [feed, setFeed] = useState<DailyFeedResponse | null>(null);

  const loadRealWeatherAndFeed = async () => {
    setLoading(true);
    try {
      // 1. Obtener coordenadas, localidad y temperatura real con Open-Meteo y expo-location
      const { weather, coords, isRealGps } = await fetchRealWeather();
      setCurrentWeather(weather);
      setIsGps(isRealGps);

      // 2. Intentar consultar API Gateway BFF con la temperatura y ubicación real
      try {
        const queryParams = new URLSearchParams({
          city: weather.city,
          temp: weather.temperature.toString(),
          lat: coords.latitude.toString(),
          lon: coords.longitude.toString(),
        });
        const url = `${apiBaseUrl}${API_ENDPOINTS.DAILY_RECOMMENDATION}?${queryParams.toString()}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.recommendation) {
            setFeed({
              weather: data.weather || weather,
              matiGreeting: data.recommendation.matiGreeting,
              featuredRecipe: data.recommendation.featuredRecipe,
              alternativeRecipes: data.recommendation.alternativeRecipes || []
            });
            return;
          }
        }
      } catch (apiErr) {
        console.warn('API Gateway no accesible, activando modo sin conexión de Mati:', apiErr);
      }

      // 3. Fallback inteligente adaptado a la temperatura real
      setFeed(getOfflineFallback(weather));
    } catch (err) {
      console.error('Error cargando clima y feed:', err);
      setFeed(getOfflineFallback(18));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRealWeatherAndFeed();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera Minimalista y Cálida */}
        <View style={styles.header}>
          <View style={styles.logoCenterContainer}>
            <Image
              source={require('../../assets/images/sello-mati.png')}
              style={styles.brandSeal}
              resizeMode="contain"
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Logo circular de Mati entre ollas"
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>¿Qué comemos hoy?</Text>
            <Text style={styles.subtitle}>
              Comida casera, sin vueltas y para chuparse los dedos.
            </Text>
          </View>
        </View>

        {/* Ubicación en contenedor flotante ligero tipo píldora */}
        <View style={styles.locationPillContainer}>
          <Text style={styles.locationText} numberOfLines={1}>
            📍 {currentWeather?.city || 'Detectando ubicación...'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setRefreshing(true);
              loadRealWeatherAndFeed();
            }}
            disabled={loading || refreshing}
            style={styles.refreshIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Actualizar clima y ubicación actual"
          >
            <Text style={styles.refreshIconText}>{refreshing ? '⏳' : '🔄'}</Text>
          </TouchableOpacity>
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
            {/* Banner de Clima y Saludo Empático Unificado */}
            <View style={styles.weatherBannerContainer}>
              <WeatherBanner
                weather={feed.weather}
                matiGreeting={feed.matiGreeting}
              />
            </View>

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
              <View style={styles.alternativeSection}>
                <View style={styles.alternativeSectionHeader}>
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
              </View>
            )}

            {/* Botón interactivo para abrir Chat con Mati Bot */}
            <View style={styles.refreshBox}>
              <BigAccessibleButton
                title="Pedir otra sugerencia a la IA"
                subtitle="Charlá con Mati Bot para que te ayude"
                icon="👨‍🍳"
                variant="outline"
                onPress={() => (onOpenChat ? onOpenChat(feed?.weather) : loadRealWeatherAndFeed())}
                accessibilityLabel="Abrir chat con el asistente de cocina Mati Bot"
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// Respaldo sin conexión adaptado dinámicamente al clima y localidad real
function getOfflineFallback(weatherOrTemp: WeatherInfo | number): DailyFeedResponse {
  const temp = typeof weatherOrTemp === 'number' ? weatherOrTemp : weatherOrTemp.temperature;
  const city = typeof weatherOrTemp === 'number' ? 'Buenos Aires' : weatherOrTemp.city;
  const condition = typeof weatherOrTemp === 'number'
    ? (temp <= 14 ? 'Nublado con frío' : temp >= 25 ? 'Caluroso y soleado' : 'Agradable y templado')
    : weatherOrTemp.condition;
  const culinaryProfile = typeof weatherOrTemp === 'number'
    ? (temp <= 14
        ? { category: 'frio' as const, sensationText: '¡Día de guiso y frazada!', suggestedDishType: 'Platos de olla y cuchara' }
        : temp >= 25
        ? { category: 'calor' as const, sensationText: '¡Mucho calor para prender el horno!', suggestedDishType: 'Plato fresco y rápido' }
        : { category: 'templado' as const, sensationText: 'Clima ideal', suggestedDishType: 'Clásicos caseros' })
    : (weatherOrTemp.culinaryProfile || {
        category: (temp <= 14 ? 'frio' : temp >= 25 ? 'calor' : 'templado') as 'frio' | 'calor' | 'templado',
        sensationText: temp <= 14 ? '¡Día de guiso y frazada!' : temp >= 25 ? '¡Mucho calor para prender el horno!' : 'Clima ideal',
        suggestedDishType: temp <= 14 ? 'Platos de olla y cuchara' : temp >= 25 ? 'Plato fresco y rápido' : 'Clásicos caseros'
      });

  const weatherObj: WeatherInfo = {
    city,
    temperature: temp,
    condition,
    culinaryProfile,
  };

  if (temp <= 14) {
    return {
      weather: weatherObj,
      matiGreeting: `¡Che, qué fresquete con estos ${temp}°C en ${city}! Hoy sale o sale un guisito bien cargado para levantar el ánimo y abrigar el cuerpo.`,
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
      weather: weatherObj,
      matiGreeting: `¡Uf, qué calor con ${temp}°C en ${city}! Ni se te ocurra prender el horno. Hoy vamos con algo fresco de heladera que se hace en un abrir y cerrar de ojos.`,
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
      weather: weatherObj,
      matiGreeting: `¡Hermoso día con ${temp}°C en ${city}! Da gusto entrar a la cocina a preparar algo casero y rendidor.`,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
    alignItems: 'stretch',
  },
  header: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  logoCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandSeal: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#F8C8B1',
    backgroundColor: '#FFEADF',
  },
  titleContainer: {
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: 6,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    fontWeight: '400',
    lineHeight: 22,
  },
  locationPillContainer: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EDE7DE',
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  refreshIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7F3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIconText: {
    fontSize: 12,
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
  weatherBannerContainer: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  sectionHeader: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  alternativeSection: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  alternativeSectionHeader: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  refreshBox: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 16,
    marginBottom: 24,
  }
});
