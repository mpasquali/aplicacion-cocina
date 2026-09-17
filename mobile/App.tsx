import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecipeDetailScreen } from './src/screens/RecipeDetailScreen';
import { MobileRecipe } from './src/types/recipe';
import { THEME } from './src/theme/colors';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail'>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<MobileRecipe | null>(null);

  const handleSelectRecipe = (recipe: MobileRecipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen('detail');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'home' || !selectedRecipe ? (
        <HomeScreen
          onSelectRecipe={handleSelectRecipe}
          apiBaseUrl="http://localhost:8000"
        />
      ) : (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          onBack={handleBackToHome}
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
