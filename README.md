# 🍲 ¿Qué comemos hoy? (Inspirada en "Mati entre ollas")

Aplicación móvil con arquitectura de microservicios, diseñada con **accesibilidad total (WCAG 2.1 AAA)** y recomendaciones impulsadas por **Inteligencia Artificial (Gemini / OpenAI)** adaptadas al clima local en tiempo real, manteniendo la calidez, empatía y estilo argentino de **Mati entre ollas**.

---

## 🌟 1. Filosofía de Diseño UX/UI y Accesibilidad

- **Calidez y Cero Formalismos:** La app habla como un amigo en la cocina ("¡Buenas che!", "Mirá lo que te preparé", "Pintó guiso").
- **Accesibilidad para todos:**
  - **Zonas de toque gigantes:** Botones con altura mínima de **56px** y espaciados generosos para evitar toques involuntarios.
  - **Contraste visual:** Colores testeados con ratio de contraste superior a 7:1 (Carbón `#1C1917` sobre fondo Crema suave `#FAF7F2`).
  - **Instrucciones paso a paso visuales:** Cada paso numerado en grande, lenguaje llano sin términos técnicos intimidantes, e ingredientes con casillas interactivas para marcar mientras cocinás.
  - **Consejo de Oro de Mati:** Cada plato incluye el truco casero de cocina de Mati para que no falle.
- **Integración con Redes Sociales:** Botón llamativo y directo en cada receta para ver a Mati explicando el plato en video en **Instagram Reels** o **TikTok** (`@matientreollas`).

---

## 🏗️ 2. Arquitectura de Microservicios

El sistema está desacoplado en 4 servicios independientes orquestados mediante **Docker Compose**:

```
                              📱 App Móvil (React Native)
                                          │
                                          ▼ [Puerto 8000]
                             ┌─────────────────────────┐
                             │   API Gateway / BFF     │
                             └────────────┬────────────┘
                 ┌────────────────────────┼────────────────────────┐
                 ▼ [Puerto 8001]          ▼ [Puerto 8002]          ▼ [Puerto 8003]
     ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
     │    Weather Service    │ │   AI Recipe Service   │ │    Recipe Service     │
     │  (Clima & Sensación)  │ │   (Gemini / OpenAI)   │ │  (Catálogo & Videos)  │
     └───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

| Microservicio | Puerto | Descripción |
|---|---|---|
| **`api-gateway`** | `8000` | BFF (Backend for Frontend). Orquesta peticiones móviles, combina clima + IA + catálogo y unifica la respuesta. |
| **`weather-service`** | `8001` | Obtiene la temperatura y condición actual, categorizando el día según perfil culinario (frío de olla, templado, o calor de verano). |
| **`ai-recipe-service`** | `8002` | Consume LLM (Google Gemini o OpenAI) con system prompt argentino ("Mati entre ollas") y devuelve JSON estructurado adaptado al clima. Incluye fallback inteligente 100% operativo sin API key. |
| **`recipe-service`** | `8003` | Base de datos de recetas clásicas de Mati, ingredientes, pasos detallados y enlaces a reels de Instagram / videos de TikTok. |

---

## 🚀 3. Puesta en Marcha Rápida

### Opción A: Levantar todo con Docker Compose (Recomendado)

1. Duplicá el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *(Opcional: podés agregar tu `GEMINI_API_KEY`, `OPENAI_API_KEY` o `WEATHER_API_KEY`. Si no tenés, los microservicios cuentan con generadores inteligentes de respaldo para funcionar de inmediato).*

2. Construir y encender los contenedores:
   ```bash
   docker compose up --build
   ```

3. Verificar que el API Gateway esté funcionando:
   ```bash
   curl http://localhost:8000/health
   ```

---

### Opción B: Ejecución Local Independiente de Microservicios

Podés ejecutar cualquier servicio directamente con Node.js:

```bash
# Weather Service
cd services/weather-service && npm install && npm run dev

# AI Recipe Service
cd services/ai-recipe-service && npm install && npm run dev

# Recipe Service
cd services/recipe-service && npm install && npm run dev

# API Gateway
cd services/api-gateway && npm install && npm run dev
```

---

## 📱 4. Ejecución de la App Móvil (React Native / Expo)

1. Ingresar a la carpeta de la app móvil:
   ```bash
   cd mobile
   npm install
   ```

2. Iniciar el entorno de desarrollo:
   ```bash
   npm start
   ```
   - Presioná `w` para abrir en el navegador web.
   - O escaneá el código QR con la app **Expo Go** en tu celular Android o iOS.

---

## 🧪 5. Ejemplos de Peticiones y Respuestas

### Probar recomendación con frío (ej. 8°C -> Guiso de cuchara):
```bash
curl -X POST http://localhost:8002/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"temperature": 8, "condition": "Lluvia y viento", "city": "Buenos Aires"}'
```

### Probar recomendación con calor (ej. 33°C -> Plato fresco sin horno):
```bash
curl -X POST http://localhost:8002/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"temperature": 33, "condition": "Soleado", "city": "Córdoba"}'
```

### Probar flujo completo a través del API Gateway:
```bash
curl "http://localhost:8000/api/v1/daily-recommendation?city=BuenosAires&temp=11"
```
