import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AIService } from './ai.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;
const aiService = new AIService();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'ai-recipe-service',
    status: 'healthy',
    aiEngine: process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai' : 'smart_curated_mati',
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint principal de recomendaciones inteligentes
 * POST /ai/recommend
 * Body: { temperature: number, condition?: string, city?: string, dietaryPreference?: string }
 */
app.post('/ai/recommend', async (req: Request, res: Response) => {
  try {
    const { temperature, condition, city, dietaryPreference } = req.body;

    if (temperature === undefined || typeof temperature !== 'number') {
      return res.status(400).json({
        error: 'El campo "temperature" es obligatorio y debe ser un número (temperatura actual en grados Celsius).'
      });
    }

    const recommendation = await aiService.getDailyRecommendation({
      temperature,
      condition,
      city,
      dietaryPreference
    });

    return res.json(recommendation);
  } catch (error) {
    console.error('Error procesando recomendación de IA:', error);
    return res.status(500).json({
      error: 'Hubo un inconveniente al generar la recomendación culinaria.',
      detail: (error as Error).message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 AI Recipe Service (Mati entre ollas) escuchando en puerto ${PORT}`);
});
