import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecipeDetailScreen } from './src/screens/RecipeDetailScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { MobileRecipe, WeatherInfo } from './src/types/recipe';
import { THEME } from './src/theme/colors';
import { API_BASE_URL } from './src/config/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'detail' | 'chat'>('splash');
  const [previousScreen, setPreviousScreen] = useState<'home' | 'chat'>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<MobileRecipe | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | undefined>(undefined);

  const handleSelectRecipe = (recipe: MobileRecipe) => {
    setSelectedRecipe(recipe);
    setPreviousScreen(currentScreen === 'chat' ? 'chat' : 'home');
    setCurrentScreen('detail');
  };

  const handleOpenChat = (weather?: WeatherInfo) => {
    setCurrentWeather(weather);
    setCurrentScreen('chat');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackFromDetail = () => {
    setCurrentScreen(previousScreen);
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'splash' && (
        <SplashScreen
          onFinish={() => setCurrentScreen('home')}
          durationMs={1800}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onSelectRecipe={handleSelectRecipe}
          onOpenChat={handleOpenChat}
          apiBaseUrl={API_BASE_URL}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen
          onBack={handleBackToHome}
          onSelectRecipe={handleSelectRecipe}
          weather={currentWeather}
          apiBaseUrl={API_BASE_URL}
        />
      )}

      {currentScreen === 'detail' && selectedRecipe && (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          onBack={handleBackFromDetail}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
