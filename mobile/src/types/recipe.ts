export interface Ingredient {
  name: string;
  amount: string;
  category?: string;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  visualTip?: string;
  timerMinutes?: number;
}

export interface MobileRecipe {
  id: string;
  title: string;
  badge: string;
  description: string;
  prepTimeMinutes: number;
  difficulty: 'Súper fácil' | 'Fácil' | 'Para lucirse';
  estimatedCost?: string;
  servings: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  matiSecretTip: string;
  videoUrl: string;
  videoPlatform?: 'instagram' | 'tiktok';
}

export interface WeatherInfo {
  city: string;
  temperature: number;
  condition: string;
  culinaryProfile?: {
    category: 'frio' | 'fresco' | 'templado' | 'calor';
    sensationText: string;
    suggestedDishType: string;
  };
}

export interface DailyFeedResponse {
  weather: WeatherInfo;
  matiGreeting: string;
  featuredRecipe: MobileRecipe;
  alternativeRecipes: MobileRecipe[];
}
