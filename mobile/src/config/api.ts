import { Platform } from 'react-native';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    [key: string]: string | undefined;
  };
};

/**
 * Configuración centralizada de conexión al API Gateway (BFF)
 *
 * Estrategia de resolución de URL:
 * 1. Variable de entorno EXPO_PUBLIC_API_URL (si está definida en .env)
 * 2. Emulador Android: http://10.0.2.2:8000 (10.0.2.2 es el alias del host en Android Emulator)
 * 3. iOS Simulator / Web / Entorno de desarrollo: http://localhost:8000
 */
export const getDefaultApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return Platform.select({
    android: 'http://10.0.2.2:8000',
    ios: 'http://localhost:8000',
    web: 'http://localhost:8000',
    default: 'http://localhost:8000',
  });
};

export const API_BASE_URL = getDefaultApiBaseUrl();

export const API_ENDPOINTS = {
  DAILY_RECOMMENDATION: '/api/v1/daily-recommendation',
  RECIPES: '/api/v1/recipes',
  CHAT: '/api/v1/chat',
  HEALTH: '/health',
} as const;
