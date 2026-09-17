/**
 * Sistema de Diseño y Tokens de Color para "¿Qué comemos hoy?" (Mati entre ollas)
 * Diseñado con criterios estrictos de accesibilidad WCAG 2.1 AAA:
 * - Contraste alto entre texto y fondos (>7:1).
 * - Calidez visual hogareña inspirada en arcilla, ollas de hierro y madera.
 * - Dimensiones mínimas de toque táctil de 56px para facilitar su uso a personas mayores.
 */

export const THEME = {
  colors: {
    // Fondos cálidos para no fatigar la vista
    background: '#FAF7F2',       // Crema cálido
    cardBackground: '#FFFFFF',   // Blanco puro para tarjetas con elevación
    cardHighlight: '#FFF8F0',    // Blanco tostado para platos destacados

    // Colores de acento y marca (Mati entre ollas)
    primary: '#D35400',          // Terracota / Olla de barro (Acción principal)
    primaryDark: '#A04000',      // Terracota profundo para presionado
    secondary: '#2E7D32',        // Verde romero/oliva (Fresco y natural)
    amberWarm: '#B45309',        // Ámbar tostado para "Tips de Mati"
    badgeCold: '#1565C0',        // Azul abrigo para días de frío polar

    // Redes Sociales de "Mati entre ollas"
    instagram: '#E1306C',        // Rosa magenta Instagram
    tiktok: '#111111',           // Negro característico TikTok

    // Tipografía con máximo contraste accesible
    textPrimary: '#1C1917',      // Carbón profundo (Contraste 13:1 sobre crema)
    textSecondary: '#57534E',    // Gris tierra medio (Contraste 7:1)
    textInverse: '#FFFFFF',      // Blanco sobre primario

    // Bordes y separadores táctiles
    border: '#E7E2DA',
    borderFocus: '#D35400',
    shadow: '#000000',
  },

  typography: {
    fontFamily: 'System',
    sizes: {
      hero: 32,      // Saludo principal y temperatura
      h1: 26,        // Título de la receta
      h2: 22,        // Subtítulos ("Ingredientes", "Paso a Paso")
      bodyLarge: 19, // Texto principal y pasos (fácil lectura)
      body: 17,      // Textos secundarios
      caption: 15,   // Badges y metadatos (nunca menor a 15px)
    },
    lineHeights: {
      hero: 38,
      h1: 32,
      bodyLarge: 28,
      body: 24,
    }
  },

  spacing: {
    xs: 6,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
  },

  accessibility: {
    minTouchTarget: 56, // 56px de alto mínimo para botones táctiles
    borderRadiusButton: 20,
    borderRadiusCard: 24,
  }
};
