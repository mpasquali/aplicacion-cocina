export interface StoredRecipe {
  id: string;
  title: string;
  category: 'olla' | 'pastas' | 'tartas' | 'ensaladas' | 'carnes';
  recommendedSeason: 'frio' | 'templado' | 'calor' | 'todo_el_ano';
  prepTimeMinutes: number;
  servings: string;
  difficulty: 'Súper fácil' | 'Fácil' | 'Para lucirse';
  description: string;
  ingredients: Array<{ name: string; amount: string; icon?: string }>;
  steps: Array<{ stepNumber: number; instruction: string; visualTip?: string }>;
  matiSecretTip: string;
  socialMedia: {
    instagramReelUrl: string;
    tiktokUrl: string;
    videoThumbnailUrl: string;
    authorName: string;
    caption: string;
  };
}

export const MATI_RECIPES_DATABASE: StoredRecipe[] = [
  {
    id: 'guiso-de-lentejas-completo',
    title: 'Guiso Criollo de Lentejas Reconfortante',
    category: 'olla',
    recommendedSeason: 'frio',
    prepTimeMinutes: 45,
    servings: '4 platos generosos',
    difficulty: 'Fácil',
    description: 'El plato insignia de los días frescos: caldito espeso, papas bien tiernas y sabor a hogar.',
    ingredients: [
      { name: 'Lentejas secas (remojadas) o 2 latas', amount: '400g' },
      { name: 'Papas medianas', amount: '2 cortadas en cubos' },
      { name: 'Cebolla', amount: '1 grande picadita' },
      { name: 'Morrón rojo', amount: 'Medio morrón en cubos' },
      { name: 'Zanahoria', amount: '1 grande cortada en rodajitas' },
      { name: 'Puré de tomate', amount: '500g' },
      { name: 'Caldo de verduras o agua caliente', amount: '1 litro' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'En una olla caliente con un hilo de aceite, dorá la cebolla, el morrón y la zanahoria hasta que huelan increíble.',
        visualTip: 'Fuego medio, revolviendo con cuchara de madera.'
      },
      {
        stepNumber: 2,
        instruction: 'Sumá las papas en cubitos, el puré de tomate y rehogá 2 minutos.',
        visualTip: 'Dejá que el tomate empiece a burbujear.'
      },
      {
        stepNumber: 3,
        instruction: 'Agregá las lentejas y cubrí con el caldo. Bajá el fuego al mínimo, tapá y cociná 35 minutos hasta que todo esté suave.',
        visualTip: 'Si te gusta más espeso, aplastá unas papas contra el borde de la olla.'
      }
    ],
    matiSecretTip: '¡El toque de oro de Mati! Apagá el fuego, tirale orégano seco, un poquito de ají molido y un chorrito de aceite de oliva crudo. Reposalo 5 minutos antes de comer.',
    socialMedia: {
      instagramReelUrl: 'https://www.instagram.com/reel/matientreollas-guiso',
      tiktokUrl: 'https://www.tiktok.com/@matientreollas/video/guiso-lentejas',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
      authorName: 'Mati entre ollas',
      caption: '¡Se vino el frío y en esta casa no se negocia un buen guiso! Mirá lo fácil que sale.'
    }
  },
  {
    id: 'estofado-con-polenta',
    title: 'Polenta Cremosa con Estofado Suave',
    category: 'olla',
    recommendedSeason: 'frio',
    prepTimeMinutes: 30,
    servings: '3 a 4 personas',
    difficulty: 'Súper fácil',
    description: 'Polenta sedosa con mucha manteca y una salsita que te transporta a los domingos en familia.',
    ingredients: [
      { name: 'Harina de maíz instantánea (Polenta mágica)', amount: '250g' },
      { name: 'Leche entera o caldo', amount: '1 litro' },
      { name: 'Manteca', amount: '50g' },
      { name: 'Queso cremoso o cuartirolo', amount: '200g' },
      { name: 'Salsa de tomate casera o filetto', amount: '2 tazas' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Calentá la leche o caldo con sal y la manteca hasta que rompa el primer hervor.',
        visualTip: 'Olla mediana antiadherente.'
      },
      {
        stepNumber: 2,
        instruction: 'Volcá la polenta en forma de lluvia revolviendo fuerte con batidor para que jamás se hagan grumos.',
        visualTip: 'Cociná 1 minuto reloj a fuego mínimo.'
      },
      {
        stepNumber: 3,
        instruction: 'Serví en fuente honda con abundante queso en el medio y cubrí con la salsa bien caliente por encima.',
        visualTip: 'Queso bien derretido garantizado.'
      }
    ],
    matiSecretTip: 'Rallale queso parmesano o reggianito arriba y una pizca de pimienta negra recién molida. Te aseguro que no queda ni un rastro.',
    socialMedia: {
      instagramReelUrl: 'https://www.instagram.com/reel/matientreollas-polenta',
      tiktokUrl: 'https://www.tiktok.com/@matientreollas/video/polenta-cremosa',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600',
      authorName: 'Mati entre ollas',
      caption: 'Hacete esta polenta de 15 minutos y decime si no es un monumento al confort food.'
    }
  },
  {
    id: 'tarta-souffle-zapallitos',
    title: 'Tarta Soufflé de Zapallitos y Queso',
    category: 'tartas',
    recommendedSeason: 'templado',
    prepTimeMinutes: 35,
    servings: '4 porciones',
    difficulty: 'Fácil',
    description: 'Liviana, húmeda y súper rendidora para cuando querés comer casero y sano.',
    ingredients: [
      { name: 'Zapallitos redondos', amount: '4 medianos' },
      { name: 'Cebolla salteada', amount: '1 unidad' },
      { name: 'Huevos', amount: '3 unidades' },
      { name: 'Queso cremoso en cubos', amount: '150g' },
      { name: 'Tapa de tarta hojaldrada', amount: '1 unidad' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Rallá o picá los zapallitos y cocinalos 5 minutos en sartén para evaporar el líquido.',
        visualTip: 'Clave secar bien el zapallito.'
      },
      {
        stepNumber: 2,
        instruction: 'Batí los huevos con sal, pimienta, la cebolla y el queso.',
        visualTip: 'Queda una mezcla espumosa.'
      },
      {
        stepNumber: 3,
        instruction: 'Poné la masa en la tartera, volcá la mezcla y horneá a 190°C por 30 minutos hasta dorar.',
        visualTip: 'Horno medio.'
      }
    ],
    matiSecretTip: 'Poné una capa fina de queso rallado sobre la masa antes de poner el relleno. Te hace una película impermeable y la masa queda crocante como galletita.',
    socialMedia: {
      instagramReelUrl: 'https://www.instagram.com/reel/matientreollas-tarta',
      tiktokUrl: 'https://www.tiktok.com/@matientreollas/video/tarta-zapallitos',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
      authorName: 'Mati entre ollas',
      caption: '¡La tarta de zapallitos que no sale aguada nunca más! Anotate este trucazo.'
    }
  },
  {
    id: 'ensalada-fresca-verano',
    title: 'Ensalada Completa de Fideos Tirabuzón, Atún y Tomatitos',
    category: 'ensaladas',
    recommendedSeason: 'calor',
    prepTimeMinutes: 15,
    servings: '2 platos abundantes',
    difficulty: 'Súper fácil',
    description: 'Para los días de 30°C: fresca de heladera, saciadora y sin prender el horno.',
    ingredients: [
      { name: 'Fideos tirabuzón o moñito cocidos y fríos', amount: '200g' },
      { name: 'Lata de atún al natural o en aceite', amount: '1 lata' },
      { name: 'Tomates cherry cortados al medio', amount: '1 taza' },
      { name: 'Choclo en granos', amount: 'Media taza' },
      { name: 'Aceitunas negras o verdes', amount: '1 puñadito' }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Herví los fideos al dente, colalos y enfrialos bajo el chorro de agua fría con unas gotas de aceite.',
        visualTip: 'Para que no se peguen.'
      },
      {
        stepNumber: 2,
        instruction: 'En una ensaladera poné los fideos, desmenuzá el atún y sumá los tomates, el choclo y las aceitunas.',
        visualTip: 'Colores alegres.'
      },
      {
        stepNumber: 3,
        instruction: 'Condimentá con aceite de oliva, jugo de limón y una pizca de orégano fresco.',
        visualTip: 'Dejá 10 minutos en la heladera antes de servir.'
      }
    ],
    matiSecretTip: 'Preparate una emulsión rápida de mayonesa, una cucharadita de mostaza y jugo de limón. Mezclalo con los fideos y te queda una pasta salad inolvidable.',
    socialMedia: {
      instagramReelUrl: 'https://www.instagram.com/reel/matientreollas-ensalada',
      tiktokUrl: 'https://www.tiktok.com/@matientreollas/video/pasta-salad-fresca',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
      authorName: 'Mati entre ollas',
      caption: 'Con 33 grados no se cocina caliente: ¡hacete este bowl de fideos fríos tremendo!'
    }
  }
];
