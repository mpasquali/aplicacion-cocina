import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL || 'http://localhost:8001';
const AI_RECIPE_SERVICE_URL = process.env.AI_RECIPE_SERVICE_URL || 'http://localhost:8002';
const RECIPE_SERVICE_URL = process.env.RECIPE_SERVICE_URL || 'http://localhost:8003';

app.use(cors());
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  res.json({
    service: 'api-gateway',
    status: 'healthy',
    downstreamServices: {
      weather: WEATHER_SERVICE_URL,
      aiRecipe: AI_RECIPE_SERVICE_URL,
      recipe: RECIPE_SERVICE_URL
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint Orquestador BFF (Backend For Frontend) para la Pantalla Principal Móvil
 * GET /api/v1/daily-recommendation?city=Buenos Aires&temp=12
 * 
 * Flujo de ejecución:
 * 1. Consulta condiciones meteorológicas y sensación térmica en Weather Service.
 * 2. Solicita a AI Recipe Service recomendaciones generadas y adaptadas al clima en tono Mati.
 * 3. Cruza con catálogo de videos y recetas de Recipe Service para enlaces verificados.
 * 4. Devuelve un payload unificado y optimizado para UI accesible móvil.
 */
app.get('/api/v1/daily-recommendation', async (req: Request, res: Response) => {
  try {
    const { city, lat, lon, temp } = req.query;

    // 1. Obtener clima
    const weatherParams = new URLSearchParams();
    if (city) weatherParams.append('city', city as string);
    if (lat) weatherParams.append('lat', lat as string);
    if (lon) weatherParams.append('lon', lon as string);
    if (temp) weatherParams.append('temp', temp as string);

    let weatherData = {
      city: (city as string) || 'Buenos Aires',
      temperature: temp ? parseFloat(temp as string) : 14,
      condition: 'Nublado',
      culinaryProfile: {
        category: 'frio',
        sensationText: 'Está bien fresco para cuchara',
        suggestedDishType: 'Plato de olla o guiso'
      }
    };

    try {
      const weatherRes = await axios.get(`${WEATHER_SERVICE_URL}/weather/current?${weatherParams.toString()}`, {
        timeout: 4000
      });
      weatherData = weatherRes.data;
    } catch (err) {
      console.warn('API Gateway: Weather Service no disponible directamente, usando fallback:', (err as Error).message);
    }

    // 2. Pedir recomendación a AI Service
    let aiRecommendation = null;
    try {
      const aiRes = await axios.post(
        `${AI_RECIPE_SERVICE_URL}/ai/recommend`,
        {
          temperature: weatherData.temperature,
          condition: weatherData.condition,
          city: weatherData.city
        },
        { timeout: 8000 }
      );
      aiRecommendation = aiRes.data;
    } catch (err) {
      console.warn('API Gateway: AI Service no disponible directamente:', (err as Error).message);
    }

    // 3. Consultar recetas de catálogo por si se necesita respaldo o enriquecimiento
    let catalogRecipes = [];
    try {
      const recipeRes = await axios.get(`${RECIPE_SERVICE_URL}/recipes`, { timeout: 3000 });
      catalogRecipes = recipeRes.data.recipes || [];
    } catch (err) {
      console.warn('API Gateway: Recipe Service catálogo no disponible:', (err as Error).message);
    }

    return res.json({
      meta: {
        appName: '¿Qué comemos hoy? - Mati entre ollas',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      },
      weather: weatherData,
      recommendation: aiRecommendation,
      catalogBackup: catalogRecipes.slice(0, 2)
    });
  } catch (error) {
    console.error('Error en API Gateway /api/v1/daily-recommendation:', error);
    return res.status(500).json({
      error: 'Inconveniente orquestando recomendaciones',
      detail: (error as Error).message
    });
  }
});

/**
 * Proxy directo a recetas catalogadas
 */
app.get('/api/v1/recipes', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RECIPE_SERVICE_URL}/recipes`, { params: req.query });
    return res.json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'Recipe Service no responde' });
  }
});

app.get('/api/v1/recipes/:id', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RECIPE_SERVICE_URL}/recipes/${req.params.id}`);
    return res.json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'Receta no encontrada o servicio no responde' });
  }
});

/**
 * Proxy al Asistente Culinario con IA ("Mati Bot")
 * POST /api/v1/chat
 * Body: { messages: [{ role: 'user' | 'assistant', content: string }], context?: { temperature?: number, condition?: string, city?: string } }
 */
app.post('/api/v1/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'El campo "messages" es requerido y debe ser un arreglo.' });
    }

    const response = await axios.post(
      `${AI_RECIPE_SERVICE_URL}/ai/chat`,
      { messages, context },
      { timeout: 10000 }
    );

    return res.json(response.data);
  } catch (error) {
    console.error('Error en API Gateway /api/v1/chat:', (error as Error).message);
    return res.status(502).json({
      error: 'Inconveniente comunicando con el Asistente Mati Bot',
      detail: (error as Error).message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway activo en el puerto ${PORT}`);
});
