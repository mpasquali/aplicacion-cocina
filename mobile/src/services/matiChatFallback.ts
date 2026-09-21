import { MobileChatMessage, MobileRecipe, WeatherInfo } from '../types/recipe';

// Catálogo de recetas probadas y enriquecidas de Mati para el chat
const RECIPES_DB: Record<string, MobileRecipe> = {
  tortilla: {
    id: 'tortilla-papas-chat',
    title: 'Tortilla de Papas y Cebolla Babé',
    badge: '¡El clásico argentino por excelencia!',
    description: 'Doradita por fuera, tierna y jugosa por dentro. Cero vueltas.',
    prepTimeMinutes: 25,
    difficulty: 'Fácil',
    estimatedCost: 'Económico',
    servings: '2 a 3 porciones',
    ingredients: [
      { name: 'Papas medianas', amount: '3 cortadas en rodajas finitas' },
      { name: 'Huevos de campo', amount: '4 a 5 unidades' },
      { name: 'Cebolla grande', amount: '1 en juliana (opcional)' },
      { name: 'Aceite y sal', amount: 'Cantidad necesaria' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Cocer papas y cebollas',
        instruction:
          'En una sartén con abundante aceite caliente, cociná las papas y la cebolla a fuego medio hasta que estén tiernas y apenas doradas. Escurrilas bien.',
        visualTip: 'Fuego medio para que no se quemen.',
      },
      {
        stepNumber: 2,
        title: 'El remojo sagrado',
        instruction:
          'Batí los huevos con una pizca de sal. Volcá las papas tibias y dejalas descansar 5 minutos para que la papa absorba el huevo.',
        visualTip: 'La papa tibia chupa el huevo y queda cremosa.',
      },
      {
        stepNumber: 3,
        title: 'Sartén bien caliente',
        instruction:
          'En sartén con una gota de aceite humeante, volcá todo. Cociná 2-3 minutos a fuego fuerte, dala vuelta con plato playo y dale 1 minuto más si te gusta babé.',
        visualTip: 'Plato un toque más grande que la sartén.',
        timerMinutes: 4,
      },
    ],
    matiSecretTip:
      'Dejá reposar las papas tibias en el huevo batido unos minutos antes de mandar todo a la sartén. La papa chupa el huevo y queda cremosa como un flan.',
    videoUrl: 'https://www.instagram.com/matientreollas',
    videoPlatform: 'instagram',
  },

  fideos: {
    id: 'pastas-tuco-express-chat',
    title: 'Fideos Caseros al Tuco Rápido y Queso',
    badge: '¡Abrazo de domingo en 20 min!',
    description: 'Salsa suave con tomate, laurel y lluvia de queso rallado.',
    prepTimeMinutes: 20,
    difficulty: 'Súper fácil',
    estimatedCost: 'Económico',
    servings: '2 a 3 porciones',
    ingredients: [
      { name: 'Fideos (tallarines, moñitos o cinta)', amount: '350g' },
      { name: 'Puré de tomate o lata perita', amount: '1 cajita (500g)' },
      { name: 'Cebolla y diente de ajo', amount: '1 de cada uno picaditos' },
      { name: 'Queso rallado y laurel', amount: 'A gusto y piaccere' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Dorar la base aromática',
        instruction:
          'Rehogá la cebolla y el ajo picados en una cacerolita con un chorrito de aceite hasta que estén transparentes.',
        visualTip: 'No quemar el ajo.',
      },
      {
        stepNumber: 2,
        title: 'Cocinar el tuco',
        instruction:
          'Sumá el tomate, una hoja de laurel, una pizca de azúcar y una de sal. Dejalo espesar 15 minutos a fuego bajito.',
        visualTip: 'Fuego corona, que burbujee despacio.',
        timerMinutes: 15,
      },
      {
        stepNumber: 3,
        title: 'Juntar todo en la cacerola',
        instruction:
          'Herví los fideos al dente, colalos guardando un chorrito del agua de hervor, y volcálos directo adentro del tuco.',
        visualTip: 'El agua con almidón espesa la salsa.',
      },
    ],
    matiSecretTip:
      'Nunca le tires la salsa arriba a los fideos secos en el plato. Tirale los fideos directo adentro de la olla con el tuco hirviendo y un chorrito del agua de cocción. El almidón une todo y te queda como en una cantina de La Boca.',
    videoUrl: 'https://www.tiktok.com/@matientreollas',
    videoPlatform: 'tiktok',
  },

  arrozPollo: {
    id: 'arroz-pollo-olla-chat',
    title: 'Arroz Cremoso con Pollo al Verdeo',
    badge: '¡Rendidor y en una sola olla!',
    description: 'Cremoso, dorado y con mucho perfume casero.',
    prepTimeMinutes: 30,
    difficulty: 'Fácil',
    estimatedCost: 'Medio',
    servings: '3 porciones',
    ingredients: [
      { name: 'Pechuga o muslo de pollo deshuesado', amount: '400g en cubos' },
      { name: 'Arroz largo fino o doble carolina', amount: '1 taza' },
      { name: 'Cebolla de verdeo', amount: '2 tallos picados' },
      { name: 'Caldo de verduras o pollo caliente', amount: '2 tazas y media' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Dorar el pollo',
        instruction:
          'En una olla caliente con aceite, dorá los cubos de pollo con sal y pimienta hasta que tomen buen colorcito. Retirá y reservá.',
      },
      {
        stepNumber: 2,
        title: 'Nacarar el arroz',
        instruction:
          'En la misma olla con el juguito que dejó el pollo, rehogá el verdeo y sumá el arroz 1 minuto hasta que se ponga brillante y translúcido.',
      },
      {
        stepNumber: 3,
        title: 'Cocción suave',
        instruction:
          'Reincorporá el pollo, volcá el caldo hirviendo, tapá y cociná a fuego mínimo 15 minutos sin revolver.',
        timerMinutes: 15,
      },
    ],
    matiSecretTip:
      'Una cucharada generosa de queso crema o manteca fría al apagar el fuego le da una cremosidad estilo risotto que te va a volar la cabeza.',
    videoUrl: 'https://www.instagram.com/matientreollas',
    videoPlatform: 'instagram',
  },

  guiso: {
    id: 'guiso-lentejas-chat',
    title: 'Guisito Criollo de Lentejas y Papas',
    badge: '¡El rey de los días frescos!',
    description: 'Espeso, reconfortante y con caldito rendidor que te abraza.',
    prepTimeMinutes: 40,
    difficulty: 'Fácil',
    estimatedCost: 'Económico',
    servings: '4 platos generosos',
    ingredients: [
      { name: 'Lentejas (secas o 2 latas)', amount: '400g' },
      { name: 'Papas medianas', amount: '2 cortadas en cubos' },
      { name: 'Cebolla y morrón', amount: '1 de cada uno picaditos' },
      { name: 'Puré de tomate', amount: '500g' },
      { name: 'Caldo caliente', amount: '3 tazas' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'El sofrito casero',
        instruction:
          'Rehogá la cebolla y el morrón en una olla amplia con un chorrito de aceite hasta que queden tiernos y dulces.',
      },
      {
        stepNumber: 2,
        title: 'Adentro todo',
        instruction:
          'Agregá las papas en cubitos, el puré de tomate, las lentejas y cubrí con el caldo caliente.',
      },
      {
        stepNumber: 3,
        title: 'Fuego lento que reconforta',
        instruction:
          'Tapá la olla y dejá que cocine 35 minutos a fuego bajito hasta que la papa esté manteca y el caldo bien espeso.',
        timerMinutes: 35,
      },
    ],
    matiSecretTip:
      'Apagá el fuego y tirale una cucharadita de orégano seco y un chorrito de aceite de oliva crudo antes de servir. Dejalo reposar 5 minutos tapado. Es un viaje de ida.',
    videoUrl: 'https://www.instagram.com/matientreollas',
    videoPlatform: 'instagram',
  },

  polenta: {
    id: 'polenta-cremosa-chat',
    title: 'Polenta Cremosa con Queso en el Fondo',
    badge: '¡Listo en 15 minutos!',
    description: 'Cremosa, humeante y con lluvia de queso derretido.',
    prepTimeMinutes: 15,
    difficulty: 'Súper fácil',
    estimatedCost: 'Económico',
    servings: '2 porciones',
    ingredients: [
      { name: 'Polenta mágica (cocción rápida)', amount: '1 taza' },
      { name: 'Leche o caldo caliente', amount: '3 tazas' },
      { name: 'Queso cremoso o cuartirolo', amount: '150g en cubos' },
      { name: 'Manteca', amount: '1 cucharada generosa' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Hervir el líquido',
        instruction:
          'Poné a hervir la leche o caldo con una pizca de sal y la manteca en una cacerolita.',
      },
      {
        stepNumber: 2,
        title: 'Lluvia mágica',
        instruction:
          'Volcá la polenta en forma de lluvia batiendo con fuerza 1 minuto para que no se forme ni un solo grumo.',
        timerMinutes: 1,
      },
      {
        stepNumber: 3,
        title: 'Montar con el queso',
        instruction:
          'Poné cubos de queso en el fondo del plato hondo y tirá la polenta hirviendo por encima.',
      },
    ],
    matiSecretTip:
      'Cubos gigantes de queso en el fondo del plato hondo antes de servir. Al primer tenedor tenés hilos de queso infinitos que son una fiesta.',
    videoUrl: 'https://www.tiktok.com/@matientreollas',
    videoPlatform: 'tiktok',
  },

  ensalada: {
    id: 'bowl-fresco-chat',
    title: 'Bowl Fresco de Garbanzos, Palta y Tomate',
    badge: '¡Fresco, nutritivo y sin prender hornalla!',
    description: 'Saciador, lleno de energía y listo en apenas 10 minutos.',
    prepTimeMinutes: 10,
    difficulty: 'Súper fácil',
    estimatedCost: 'Económico',
    servings: '2 porciones',
    ingredients: [
      { name: 'Garbanzos cocidos (lata o frasco)', amount: '1 lata bien enjuagada' },
      { name: 'Palta madura', amount: '1 en cubitos' },
      { name: 'Tomates cherry o redondos', amount: '1 taza al medio' },
      { name: 'Limón y oliva', amount: '2 cucharadas' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enjuagar',
        instruction:
          'Abrí la lata de garbanzos y pasalos por un colador bajo la canilla para dejarlos limpios y frescos.',
      },
      {
        stepNumber: 2,
        title: 'Integrar',
        instruction:
          'En un bowl mezclá los garbanzos, los tomatitos y la palta con cuidado de no pisarla.',
      },
      {
        stepNumber: 3,
        title: 'Aderezar',
        instruction:
          'Condimentá con sal, abundante aceite de oliva y unas gotas de limón recién exprimido.',
      },
    ],
    matiSecretTip:
      'Hojitas de albahaca fresca rotas con la mano por arriba antes de servir. Le dan un aroma veraniego espectacular.',
    videoUrl: 'https://www.instagram.com/matientreollas',
    videoPlatform: 'instagram',
  },
};

/**
 * Genera una respuesta contextualizada, variada y con el tono auténtico de Mati
 * cuando el servicio backend está offline o como motor inteligente local.
 */
export function generateLocalMatiReply(
  userText: string,
  _history: MobileChatMessage[],
  weather?: WeatherInfo
): MobileChatMessage {
  const text = userText.toLowerCase().trim();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Cómo dar vuelta la tortilla / miedo a romperla
  if (
    text.includes('darla vuelta') ||
    text.includes('dar vuelta') ||
    text.includes('se rompa') ||
    text.includes('se desarme') ||
    text.includes('desarmar') ||
    text.includes('pegar')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡El gran miedo de todos pero es una pavada, che! Mirá el secreto: usá un plato playo un toque más grande que la sartén y humedecelo apenas con una gotita de agua para que resbale. Poné la mano bien abierta y firme en el centro del plato. Y sin dudar: ¡un solo movimiento decidido, seguro y al toque! Asegurate de que la sartén tenga una gotita de aceite caliente antes de mandarla de nuevo para que no se pegue.',
      timestamp: now,
      suggestedReplies: [
        '¿Cuánto tiempo la dejo del otro lado?',
        '¿Cómo la hago babé?',
        'Quiero otra receta fácil',
      ],
    };
  }

  // 2. Tortilla sin cebolla / variaciones
  if (text.includes('sin cebolla')) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Olvidate, che! En España está la eterna grieta entre los "concebollistas" y "sincebollistas". Sin cebolla queda espectacular igual: sentís mucho más el sabor dulce de la papa frita y la cremosidad del huevo. ¡Mandale sin miedo que te sale de diez!',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.tortilla,
      suggestedReplies: [
        '¿Cómo hago para darla vuelta sin que se rompa?',
        '¿Qué condimentos le pongo?',
        'Tengo fideos también',
      ],
    };
  }

  // 3. Petición explícita o ingredientes de Tortilla (papas, huevos, tortilla)
  if (
    text.includes('tortilla') ||
    text.includes('papa') ||
    text.includes('huevo') ||
    text.includes('papas y huevos')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Qué hacés che! Mirá, teniendo papas y huevos ya tenés la gloria servida en bandeja. Te armás una tortilla babé bien jugosa, con ese toque casero que te reconforta al toque. ¡Mirá el paso a paso que te armé acá abajo!',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.tortilla,
      suggestedReplies: [
        '¿Cómo hago para darla vuelta sin que se rompa?',
        '¿Se puede hacer sin cebolla?',
        'Pasame otra idea con papas',
      ],
    };
  }

  // 4. Cómo saber si la pasta está al dente
  if (text.includes('al dente') || text.includes('tiempo de hervor')) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Clave total! Sacá un fideo un minuto antes de lo que dice el paquete y mordelo con los dientes de adelante: en el centro tenés que ver un puntito blanco microscópico. Ahí está perfecto, porque cuando lo volcás adentro de la cacerola con la salsa hirviendo se termina de cocinar y chupa todo el sabor sin ponerse blando.',
      timestamp: now,
      suggestedReplies: [
        '¿Qué queso le queda mejor?',
        'Pasame la receta de los fideos',
        'Dame otra opción rápida',
      ],
    };
  }

  // 5. Pastas, fideos, tuco, salsa
  if (
    text.includes('fideo') ||
    text.includes('pasta') ||
    text.includes('tuco') ||
    text.includes('salsa') ||
    text.includes('moñito') ||
    text.includes('tallarin')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Upa, qué manjar una buena pasta casera! El olorcito a salsa perfumando la cocina no tiene comparación. Te preparé una salsita express bien sabrosa para acompañar cualquier fideo que tengas a mano:',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.fideos,
      suggestedReplies: [
        '¿Cómo sé cuándo están al dente?',
        '¿Qué queso le queda mejor?',
        'Quiero algo sin salsa de tomate',
      ],
    };
  }

  // 6. Pollo, carne, arroz
  if (
    text.includes('pollo') ||
    text.includes('carne') ||
    text.includes('arroz') ||
    text.includes('milanesa')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Che, qué platazo salvador! El arroz con pollo en una sola olla te resuelve el almuerzo o la cena con casi nada de trabajo y sin ensuciar la cocina. Queda con una cremosidad tremenda:',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.arrozPollo,
      suggestedReplies: [
        '¿Le puedo poner queso crema?',
        'No tengo verdeo, ¿pongo cebolla común?',
        'Quiero una opción vegetariana',
      ],
    };
  }

  // 7. Frío, guiso, lentejas, olla, sopa
  if (
    text.includes('frio') ||
    text.includes('frío') ||
    text.includes('guiso') ||
    text.includes('lenteja') ||
    text.includes('sopa') ||
    text.includes('olla') ||
    (weather && weather.temperature <= 15)
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Che, con este fresquete no hay nada como poner la pava para unos mates y mandarse un platazo de olla que te abrigue hasta el corazón! Mirá lo que tengo pensado para vos:',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.guiso,
      suggestedReplies: [
        '¿Lleva carne o se puede hacer veggie?',
        '¿Puedo usar lentejas de lata?',
        'Dame otra opción para el frío',
      ],
    };
  }

  // 8. Rápido, 15 minutos, apurado, fácil
  if (
    text.includes('rapido') ||
    text.includes('rápido') ||
    text.includes('15') ||
    text.includes('apurad') ||
    text.includes('facil') ||
    text.includes('fácil')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Tranqui che, acá cero complicaciones! Si estás con poco tiempo y la panza te hace ruido, en 15 minutos de reloj te armás esta delicia humeante con lluvia de queso en el fondo:',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.polenta,
      suggestedReplies: [
        '¿Cómo hago para que no queden grumos?',
        '¿Qué salsa rápida le queda bien?',
        'Quiero otra receta de 15 minutos',
      ],
    };
  }

  // 9. Calor, ensalada, fresco, verano
  if (
    text.includes('calor') ||
    text.includes('ensalada') ||
    text.includes('fresco') ||
    text.includes('verano')
  ) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡Mamita querida, ni loco prendas el horno hoy! Te armás este bowl fresco con garbanzos, palta y tomatitos en 10 minutos de reloj. Nutritivo, saciador y bien de heladera:',
      timestamp: now,
      recipeSuggestion: RECIPES_DB.ensalada,
      suggestedReplies: [
        '¿Qué aderezo casero le pongo?',
        'No tengo garbanzos, ¿con qué reemplazo?',
        'Otra idea fresca',
      ],
    };
  }

  // 10. Consejos generales, secretos de cocina
  if (text.includes('secreto') || text.includes('tip') || text.includes('consejo')) {
    return {
      id: `mati-${Date.now()}`,
      role: 'assistant',
      content:
        '¡El secreto de oro de Mati! En la cocina casera, el 80% del éxito es cocinar con paciencia a fuego bajito y dejar reposar la comida 5 minutos tapada antes de servir. Los sabores se acomodan y queda diez veces más rica.',
      timestamp: now,
      suggestedReplies: [
        'Pasame la receta de la tortilla',
        'Tengo papas y huevos',
        '¿Qué comemos hoy?',
      ],
    };
  }

  // 11. Saludo o respuesta general personalizada
  return {
    id: `mati-${Date.now()}`,
    role: 'assistant',
    content: `¡Qué hacés che! Con "${userText}" podemos hacer algo riquísimo. Contame si tenés algún ingrediente más en la heladera o la alacena, o si querés que te tire una idea rápida para salir del paso.`,
    timestamp: now,
    suggestedReplies: [
      'Tengo papas y huevos',
      'Quiero unos fideos express',
      'Algo calentito para hoy',
      'Quiero algo rápido en 15 min',
    ],
  };
}

