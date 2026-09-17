export interface Ingredient {
  name: string;
  amount: string;
  category?: 'verduleria' | 'carniceria' | 'almacen' | 'especias';
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  visualTip?: string;
  timerMinutes?: number;
}

export interface AIRecipeOption {
  id: string;
  title: string;
  badge: string; // Ej: "¡Plato de cuchara!", "Fresco y al toque", "Económico"
  description: string;
  prepTimeMinutes: number;
  difficulty: 'Súper fácil' | 'Fácil' | 'Para lucirse';
  estimatedCost: 'Económico' | 'Medio' | 'Especial';
  servings: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  matiSecretTip: string; // El consejo cariñoso y sabio de Mati
  videoUrl: string; // Enlace al reel/tiktok de Mati entre ollas
  videoPlatform: 'instagram' | 'tiktok';
}

export interface AIRecipeRecommendationResponse {
  matiGreeting: string; // Saludo cariñoso y empático adaptado al clima
  weatherContext: {
    temperature: number;
    condition: string;
    vibe: string;
  };
  featuredRecipe: AIRecipeOption;
  alternativeRecipes: AIRecipeOption[];
}
