import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { MATI_SYSTEM_PROMPT } from './matiPrompt';
import { AIRecipeRecommendationResponse } from './types';

export interface RecommendParams {
  temperature: number;
  condition?: string;
  city?: string;
  dietaryPreference?: string;
}

export class AIService {
  private geminiClient: GoogleGenerativeAI | null = null;
  private openaiClient: OpenAI | null = null;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey && geminiKey !== 'tu_api_key_de_gemini_aqui') {
      this.geminiClient = new GoogleGenerativeAI(geminiKey);
      console.log('🤖 AI Service: Motor Google Gemini configurado.');
    }

    if (openaiKey && openaiKey !== 'tu_api_key_de_openai_aqui') {
      this.openaiClient = new OpenAI({ apiKey: openaiKey });
      console.log('🤖 AI Service: Motor OpenAI configurado.');
    }
  }

  /**
   * Genera recomendaciones personalizadas adaptadas a la temperatura y clima.
   */
  public async getDailyRecommendation(params: RecommendParams): Promise<AIRecipeRecommendationResponse> {
    const { temperature, condition = 'Despejado', city = 'tu ciudad', dietaryPreference } = params;

    const userContextPrompt = `
Contexto del usuario:
- Ubicación: ${city}
- Temperatura actual: ${temperature}°C
- Condición meteorológica: ${condition}
${dietaryPreference ? `- Preferencia alimentaria: ${dietaryPreference}` : ''}

Por favor, como Mati de "Mati entre ollas", recomendame qué cocinar hoy adaptándote estrictamente a estos ${temperature}°C y condición. Recordá responder en formato JSON estricto.
`;

    // 1. Intento con Google Gemini
    if (this.geminiClient) {
      try {
        const model = this.geminiClient.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
          systemInstruction: MATI_SYSTEM_PROMPT,
        });

        const result = await model.generateContent(userContextPrompt);
        const text = result.response.text();
        const parsed = JSON.parse(text) as AIRecipeRecommendationResponse;
        return parsed;
      } catch (err) {
        console.warn('⚠️ Error al consultar Gemini API, intentando siguiente vía:', (err as Error).message);
      }
    }

    // 2. Intento con OpenAI si está disponible
    if (this.openaiClient) {
      try {
        const completion = await this.openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: MATI_SYSTEM_PROMPT },
            { role: 'user', content: userContextPrompt },
          ],
          temperature: 0.7,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content) as AIRecipeRecommendationResponse;
        }
      } catch (err) {
        console.warn('⚠️ Error al consultar OpenAI API:', (err as Error).message);
      }
    }

    // 3. Fallback inteligente y curado de Mati entre ollas según temperatura
    // Garantiza 100% de operatividad en entornos de desarrollo o sin API Keys
    return this.generateSmartCuratedFallback(temperature, condition);
  }

  /**
   * Generador heurístico de respaldo con recetas reales y probadas de "Mati entre ollas"
   */
  private generateSmartCuratedFallback(temperature: number, condition: string): AIRecipeRecommendationResponse {
    if (temperature <= 15) {
      // Clima Frío
      return {
        matiGreeting: `¡Che, qué fresquete que hace con estos ${temperature}°C! Ideal para prender la hornalla, poner la pava para unos mates y mandarse un platazo de olla que te levante el alma.`,
        weatherContext: {
          temperature,
          condition,
          vibe: 'Frío para taparse con frazada y comer rico con cuchara'
        },
        featuredRecipe: {
          id: 'guiso-lentejas-mati',
          title: 'Guiso Criollo de Lentejas y Verduras',
          badge: '¡Platazo de olla reparador!',
          description: 'Espeso, lleno de sabor y con ingredientes que seguro tenés en la heladera. Es como un abrazo calentito.',
          prepTimeMinutes: 40,
          difficulty: 'Fácil',
          estimatedCost: 'Económico',
          servings: '4 porciones abundantes',
          ingredients: [
            { name: 'Lentejas (secas o en lata)', amount: '1 paquete o 2 latas' },
            { name: 'Papas medianas', amount: '2 cortadas en cubos' },
            { name: 'Cebolla blanca y morrón', amount: '1 de cada uno bien picados' },
            { name: 'Zanahoria', amount: '1 rallada o en rodajas finas' },
            { name: 'Puré de tomate', amount: '500g' },
            { name: 'Caldo de verduras o agua caliente', amount: '3 tazas' }
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Rehogar la base de verduras',
              instruction: 'En una olla amplia tirá un chorrito de aceite. Agregá la cebolla, morrón y zanahoria con una pizca de sal. Cociná a fuego medio 5 minutos hasta que largue aroma rico.',
              visualTip: 'Saltear despacio para que la cebolla se ponga transparente.'
            },
            {
              stepNumber: 2,
              title: 'Sumar las papas y el tomate',
              instruction: 'Agregá las papas en cubitos y volcá el puré de tomate. Rehogá 2 minutos para que tome color.',
              visualTip: 'Cubos de papa del tamaño de un bocado.'
            },
            {
              stepNumber: 3,
              title: 'Lentejas y caldito',
              instruction: 'Volcá las lentejas y cubrí con el caldo caliente. Bajá el fuego al mínimo, tapá la olla y dejalo cocinar 30 minutos revolviendo de vez en cuando.',
              visualTip: 'Fuego corona, tranquilo.',
              timerMinutes: 30
            }
          ],
          matiSecretTip: 'Cuando apagues el fuego, tirale un puñadito de orégano seco y una cucharadita de pimentón dulce. Dejalo asentarse 5 minutos tapado antes de servir. ¡No te das una idea cómo mejora!',
          videoUrl: 'https://www.instagram.com/matientreollas',
          videoPlatform: 'instagram'
        },
        alternativeRecipes: [
          {
            id: 'polenta-estofado-mati',
            title: 'Polenta Cremosa con Salsa Filetto y Queso',
            badge: 'Rápido, calentito y económico',
            description: 'En 15 minutos tenés un plato humeante con queso derretido en el fondo.',
            prepTimeMinutes: 15,
            difficulty: 'Súper fácil',
            estimatedCost: 'Económico',
            servings: '2 a 3 porciones',
            ingredients: [
              { name: 'Polenta mágica (cocción rápida)', amount: '1 taza' },
              { name: 'Leche o caldo', amount: '3 tazas' },
              { name: 'Manteca', amount: '1 cucharada generosa' },
              { name: 'Queso cremoso o muzarella', amount: '150g' }
            ],
            steps: [
              {
                stepNumber: 1,
                title: 'Hervir el líquido',
                instruction: 'Poné a hervir la leche o caldo con una pizca de sal y la manteca.',
                visualTip: 'Cacerola mediana.'
              },
              {
                stepNumber: 2,
                title: 'Lluvia de polenta',
                instruction: 'Tirá la polenta en forma de lluvia batiendo enérgicamente con batidor o tenedor para que no queden grumos. Cociná 1 minuto y apagá.',
                visualTip: 'Bols de queso en la base para servir.'
              }
            ],
            matiSecretTip: 'En el fondo del plato poné cubos grandes de queso cremoso y serví la polenta hirviendo encima. Al primer tenedor vas a tener hilos de queso infinitos.',
            videoUrl: 'https://www.tiktok.com/@matientreollas',
            videoPlatform: 'tiktok'
          }
        ]
      };
    } else if (temperature >= 25) {
      // Clima Caluroso
      return {
        matiGreeting: `¡Mamita querida, qué calor hace hoy con ${temperature}°C! Ni loco prendas el horno. Hoy nos armamos algo súper fresco, crocante y nutritivo que no te robe tiempo.`,
        weatherContext: {
          temperature,
          condition,
          vibe: 'Calor de verano, ideal para plato frío y bebida fresca'
        },
        featuredRecipe: {
          id: 'ensalada-legumbres-fresca',
          title: 'Bowl Fresco de Garbanzos, Palta y Tomatitos Cherry',
          badge: '¡Fresquito, llenador y sin hornalla!',
          description: 'Cero calor en la cocina: un plato saciador, colorido y listo en apenas 10 minutos.',
          prepTimeMinutes: 10,
          difficulty: 'Súper fácil',
          estimatedCost: 'Económico',
          servings: '2 porciones',
          ingredients: [
            { name: 'Garbanzos cocidos (lata o frasco)', amount: '1 lata enjuagada' },
            { name: 'Tomates cherry o redondos', amount: '1 taza cortados al medio' },
            { name: 'Palta madura', amount: '1 cortada en cubitos' },
            { name: 'Queso sardo o feta desgranado', amount: '50g' },
            { name: 'Jugo de limón y oliva', amount: '2 cucharadas' }
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Enjuagar y escurrir',
              instruction: 'Abrí la lata de garbanzos, pasalos por el colador y enjuagalos con agua de la canilla para dejarlos bien limpios.',
              visualTip: 'Dejalos secar 2 minutos sobre papel de cocina.'
            },
            {
              stepNumber: 2,
              title: 'Integrar en un bowl generoso',
              instruction: 'En un bowl amplio mezclá los garbanzos, los tomatitos al medio y la palta en cubos.',
              visualTip: 'Revolvé suave para no desarmar la palta.'
            },
            {
              stepNumber: 3,
              title: 'El toque de aderezo',
              instruction: 'Condimentá con sal marina, aceite de oliva, unas gotas de jugo de limón y coroná con el queso desgranado.',
              visualTip: 'Servilo bien fresco de la heladera.'
            }
          ],
          matiSecretTip: 'Si tenés unas hojitas de albahaca o menta en la ventana, rompelas con la mano y tiralas por arriba. Le da un aroma refrescante insuperable.',
          videoUrl: 'https://www.instagram.com/matientreollas',
          videoPlatform: 'instagram'
        },
        alternativeRecipes: [
          {
            id: 'sandwich-mati-verano',
            title: 'Sándwich Gourmet de Pollo al Limón y Vegetales',
            badge: 'Rápido y playero',
            description: 'Aprovechá pollo que te haya quedado o fetas magras con un pan crocante.',
            prepTimeMinutes: 10,
            difficulty: 'Súper fácil',
            estimatedCost: 'Económico',
            servings: '1 porción abundante',
            ingredients: [
              { name: 'Pan de campo o baguette', amount: '1 unidad' },
              { name: 'Pechuga desmenuzada o jamón cocido natural', amount: '100g' },
              { name: 'Rúcula fresca y rodajas de tomate', amount: '1 puñado' },
              { name: 'Mostaza con miel o mayonesa casera', amount: '1 cucharada' }
            ],
            steps: [
              {
                stepNumber: 1,
                title: 'Tostar el pan apenas',
                instruction: 'Tostá el pan solo para que esté tibio y crocante por fuera.',
                visualTip: '30 segundos en la sartén.'
              },
              {
                stepNumber: 2,
                title: 'Armar por capas',
                instruction: 'Untá con la salsa, poné el colchón de rúcula, el pollo y las rodajas de tomate.',
                visualTip: 'Cortar al medio en diagonal.'
              }
            ],
            matiSecretTip: 'Untá las dos caras del pan con un diente de ajo apenas frotado antes de tostarlo. Ese detalle cambia el juego por completo.',
            videoUrl: 'https://www.tiktok.com/@matientreollas',
            videoPlatform: 'tiktok'
          }
        ]
      };
    } else {
      // Clima Templado (16°C - 24°C)
      return {
        matiGreeting: `¡Qué lindo día tenemos hoy con ${temperature}°C! Está templadito y da gusto cocinar algo rico y casero sin derretirse ni congelarse. Mirá lo que pensé para vos:`,
        weatherContext: {
          temperature,
          condition,
          vibe: 'Clima primaveral ideal para clásicos de la cocina casera'
        },
        featuredRecipe: {
          id: 'tarta-pascualina-cremosa',
          title: 'Tarta Dorada de Acelga, Ricota y Corazón de Huevo',
          badge: '¡El clásico que nunca falla!',
          description: 'Masa crocante, relleno suave y jugoso, perfecta tanto tibia como a temperatura ambiente.',
          prepTimeMinutes: 35,
          difficulty: 'Fácil',
          estimatedCost: 'Económico',
          servings: '4 a 6 porciones',
          ingredients: [
            { name: 'Tapas de tarta hojaldre o criolla', amount: '2 unidades' },
            { name: 'Acelga o espinaca cocida y bien escurrida', amount: '1 atado' },
            { name: 'Cebolla salteada', amount: '1 unidad' },
            { name: 'Ricota o queso crema', amount: '200g' },
            { name: 'Huevos', amount: '3 unidades' },
            { name: 'Queso rallado', amount: '3 cucharadas' }
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Preparar el relleno bien sequito',
              instruction: 'Picá la acelga hervida y exprimila con las manos para quitarle todo el agua. Mezclala con la cebolla doradita, la ricota, 1 huevo, sal, pimienta y nuez moscada.',
              visualTip: 'Clave: que no tenga exceso de líquido.'
            },
            {
              stepNumber: 2,
              title: 'Montar en la tartera',
              instruction: 'Colocá una tapa de masa en una tartera engrasada. Volcá el relleno, hacé 2 huequitos y colocá los otros 2 huevos crudos enteros.',
              visualTip: 'Los huevos se cocinan en el horno.'
            },
            {
              stepNumber: 3,
              title: 'Horno hasta dorar',
              instruction: 'Cubrí con la otra tapa (o dejala abierta estilo quiche) y horneá a 200°C unos 25-30 minutos hasta que la masa esté dorada y crocante.',
              visualTip: 'Fuego medio-alto.',
              timerMinutes: 28
            }
          ],
          matiSecretTip: 'Espolvoreá la base de la masa con una cucharadita de pan rallado o avena antes de volcar el relleno. Eso absorbe cualquier humedad y te deja la masa de abajo bien crocante.',
          videoUrl: 'https://www.instagram.com/matientreollas',
          videoPlatform: 'instagram'
        },
        alternativeRecipes: [
          {
            id: 'milanesas-pure-esponjoso',
            title: 'Milanesitas con Puré de Papas Súper Esponjoso',
            badge: 'El abrazo de mamá en el plato',
            description: 'El plato argentino por excelencia, con el secreto para que el puré quede sedoso.',
            prepTimeMinutes: 30,
            difficulty: 'Fácil',
            estimatedCost: 'Medio',
            servings: '2 a 3 porciones',
            ingredients: [
              { name: 'Milanesas de nalga o pollo', amount: '4 unidades' },
              { name: 'Papas', amount: '1 kg' },
              { name: 'Manteca', amount: '50g' },
              { name: 'Leche tibia', amount: 'Medio vaso' }
            ],
            steps: [
              {
                stepNumber: 1,
                title: 'Hervir las papas desde agua fría',
                instruction: 'Herví las papas con cáscara desde agua fría con sal. Cuando estén tiernas, pelalas calientes y pisalas inmediatamente.',
                visualTip: 'Pisar mientras sale humo.'
              },
              {
                stepNumber: 2,
                title: 'Cocinar las milangas y montar',
                instruction: 'Hacé las milanesas al horno con un chorrito de aceite hasta dorar de ambos lados. Al puré agregale la manteca y la leche tibia batiendo bien.',
                visualTip: 'Puré brillante.'
              }
            ],
            matiSecretTip: 'Agregá siempre la leche tibia al puré, nunca fría de la heladera. Ese es el secreto para que no se ponga chicloso y quede como una nube.',
            videoUrl: 'https://www.tiktok.com/@matientreollas',
            videoPlatform: 'tiktok'
          }
        ]
      };
    }
  }
}
