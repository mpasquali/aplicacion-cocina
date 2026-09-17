import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(cors());
app.use(express.json());

interface WeatherReport {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  culinaryProfile: {
    category: 'frio' | 'fresco' | 'templado' | 'calor';
    sensationText: string;
    suggestedDishType: string;
  };
  source: 'api' | 'smart_fallback';
}

function calculateCulinaryProfile(temp: number, condition: string): WeatherReport['culinaryProfile'] {
  if (temp <= 14 || condition.toLowerCase().includes('lluvia') || condition.toLowerCase().includes('nieve')) {
    return {
      category: 'frio',
      sensationText: temp <= 10 ? '¡Fresquete polar, che!' : 'Está bien fresco para cuchara',
      suggestedDishType: 'Plato de olla, guiso, sopa crema o estofado reparador'
    };
  } else if (temp > 14 && temp <= 23) {
    return {
      category: 'templado',
      sensationText: 'Clima ideal, agradable y templado',
      suggestedDishType: 'Pastas caseras, tarta tibia, milanesas con puré o pollo al horno'
    };
  } else {
    return {
      category: 'calor',
      sensationText: temp >= 30 ? '¡Un horno total afuera!' : 'Día cálido para comer livianito',
      suggestedDishType: 'Ensalada completa, tarta fría, sándwich gourmet o pescado fresco'
    };
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'weather-service', status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/weather/current', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Buenos Aires, Argentina';
  const lat = req.query.lat as string;
  const lon = req.query.lon as string;
  const mockTemp = req.query.temp ? parseFloat(req.query.temp as string) : null;

  // Si se pasa un parámetro de prueba 'temp' (ej. ?temp=9 o ?temp=34), lo usamos directamente para facilitar tests
  if (mockTemp !== null && !isNaN(mockTemp)) {
    const report: WeatherReport = {
      city,
      temperature: mockTemp,
      condition: mockTemp < 15 ? 'Nublado y frío' : mockTemp > 28 ? 'Caluroso y soleado' : 'Agradable',
      humidity: 65,
      culinaryProfile: calculateCulinaryProfile(mockTemp, mockTemp < 15 ? 'frio' : 'despejado'),
      source: 'smart_fallback'
    };
    return res.json(report);
  }

  // Si hay API Key configurada para OpenWeatherMap
  if (WEATHER_API_KEY) {
    try {
      const url = lat && lon
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;

      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0]?.description || 'Normal';

      const report: WeatherReport = {
        city: data.name || city,
        temperature: temp,
        condition: condition.charAt(0).toUpperCase() + condition.slice(1),
        humidity: data.main.humidity,
        culinaryProfile: calculateCulinaryProfile(temp, condition),
        source: 'api'
      };

      return res.json(report);
    } catch (error) {
      console.warn('Fallo llamada a OpenWeatherMap, activando fallback inteligente:', (error as Error).message);
    }
  }

  // Fallback inteligente para desarrollo local sin API Key
  const defaultTemp = 13; // Típico día de fresquete ideal para ollas
  const defaultCondition = 'Cielo nublado';
  const report: WeatherReport = {
    city: city || 'Buenos Aires',
    temperature: defaultTemp,
    condition: defaultCondition,
    humidity: 70,
    culinaryProfile: calculateCulinaryProfile(defaultTemp, defaultCondition),
    source: 'smart_fallback'
  };

  return res.json(report);
});

app.listen(PORT, () => {
  console.log(`🌤️ Weather Service corriendo en el puerto ${PORT}`);
});
