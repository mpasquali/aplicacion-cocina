import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MATI_RECIPES_DATABASE } from './recipes.data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'recipe-service', status: 'healthy', totalRecipes: MATI_RECIPES_DATABASE.length });
});

/**
 * Listar todas las recetas con posibilidad de filtrar por temporada o categoría
 * GET /recipes?season=frio
 */
app.get('/recipes', (req: Request, res: Response) => {
  const { season, category } = req.query;
  let results = [...MATI_RECIPES_DATABASE];

  if (season) {
    results = results.filter(
      r => r.recommendedSeason === season || r.recommendedSeason === 'todo_el_ano'
    );
  }

  if (category) {
    results = results.filter(r => r.category === category);
  }

  return res.json({
    count: results.length,
    recipes: results
  });
});

/**
 * Obtener receta individual por ID
 * GET /recipes/:id
 */
app.get('/recipes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = MATI_RECIPES_DATABASE.find(r => r.id === id);

  if (!recipe) {
    return res.status(404).json({ error: 'Receta no encontrada' });
  }

  return res.json(recipe);
});

app.listen(PORT, () => {
  console.log(`🍲 Recipe Service (Mati entre ollas) activo en puerto ${PORT}`);
});
