import * as Location from 'expo-location';
import { WeatherInfo } from '../types/recipe';

export interface RealLocationWeatherResult {
  weather: WeatherInfo;
  coords: { latitude: number; longitude: number };
  isRealGps: boolean;
}

const DEFAULT_COORDS = {
  latitude: -34.6037,
  longitude: -58.3816,
};
const DEFAULT_CITY = 'Buenos Aires';

/**
 * Mapea los códigos meteorológicos WMO de Open-Meteo a descripciones en español
 */
export function mapWmoCodeToCondition(code: number): string {
  switch (code) {
    case 0:
      return 'Cielo despejado';
    case 1:
      return 'Mayormente despejado';
    case 2:
      return 'Parcialmente nublado';
    case 3:
      return 'Nublado';
    case 45:
    case 48:
      return 'Neblina';
    case 51:
    case 53:
    case 55:
      return 'Llovizna';
    case 56:
    case 57:
      return 'Llovizna helada';
    case 61:
      return 'Lluvia débil';
    case 63:
      return 'Lluvia moderada';
    case 65:
      return 'Lluvia fuerte';
    case 66:
    case 67:
      return 'Lluvia helada';
    case 71:
    case 73:
    case 75:
    case 77:
      return 'Nieve o granizo';
    case 80:
    case 81:
    case 82:
      return 'Chaparrones';
    case 85:
    case 86:
      return 'Chaparrones de nieve';
    case 95:
      return 'Tormenta eléctrica';
    case 96:
    case 99:
      return 'Tormenta con granizo';
    default:
      return 'Cielo nublado';
  }
}

/**
 * Calcula el perfil culinario según la temperatura y condición climática real
 */
export function calculateCulinaryProfile(temp: number, condition: string): WeatherInfo['culinaryProfile'] {
  const condLower = condition.toLowerCase();
  const isRainy =
    condLower.includes('lluvia') ||
    condLower.includes('llovizna') ||
    condLower.includes('tormenta') ||
    condLower.includes('chaparron') ||
    condLower.includes('chaparrones');

  if (temp <= 15 || isRainy) {
    return {
      category: 'frio',
      sensationText: temp <= 10 ? '¡Fresquete polar!' : '¡Día de guiso y frazada!',
      suggestedDishType: 'Plato de olla, guiso o sopa crema caliente',
    };
  } else if (temp > 15 && temp < 25) {
    return {
      category: 'templado',
      sensationText: 'Clima ideal',
      suggestedDishType: 'Pastas caseras, tartas o clásicos al horno',
    };
  } else {
    return {
      category: 'calor',
      sensationText: temp >= 30 ? '¡Un horno afuera!' : '¡Mucho calor para prender el horno!',
      suggestedDishType: 'Platos frescos, ensaladas completas y comidas de heladera',
    };
  }
}

/**
 * Solicita permisos de ubicación al usuario, obtiene coordenadas GPS,
 * geocodifica la localidad y consulta la temperatura real en Open-Meteo.
 */
export async function fetchRealWeather(): Promise<RealLocationWeatherResult> {
  let coords = DEFAULT_COORDS;
  let cityName = DEFAULT_CITY;
  let isRealGps = false;

  try {
    // 1. Solicitar permisos de ubicación en primer plano
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      isRealGps = true;

      // 2. Geocodificación inversa para obtener el nombre de la ciudad
      try {
        const [geo] = await Location.reverseGeocodeAsync(coords);
        if (geo) {
          cityName = geo.city || geo.subregion || geo.region || geo.district || DEFAULT_CITY;
        }
      } catch (geoErr) {
        console.warn('No se pudo obtener nombre de localidad por geocodificación:', geoErr);
      }
    }
  } catch (locErr) {
    console.warn('No se pudo obtener ubicación GPS, usando ubicación predeterminada:', locErr);
  }

  // 3. Consultar Open-Meteo API pública y gratuita
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }
    const data = await res.json();
    const current = data.current_weather;
    const temp = Math.round(current.temperature);
    const condition = mapWmoCodeToCondition(current.weathercode);
    const culinaryProfile = calculateCulinaryProfile(temp, condition);

    return {
      weather: {
        city: cityName,
        temperature: temp,
        condition,
        culinaryProfile,
      },
      coords,
      isRealGps,
    };
  } catch (weatherErr) {
    console.warn('Fallo llamada a Open-Meteo, usando respaldo climático:', weatherErr);
    const fallbackTemp = 18;
    const fallbackCondition = 'Agradable y templado';
    return {
      weather: {
        city: cityName,
        temperature: fallbackTemp,
        condition: fallbackCondition,
        culinaryProfile: calculateCulinaryProfile(fallbackTemp, fallbackCondition),
      },
      coords,
      isRealGps,
    };
  }
}

