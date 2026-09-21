import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { THEME } from '../theme/colors';

interface Props {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<Props> = ({
  onFinish,
  durationMs = 1800,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // 1. Animación de entrada: Fade in y escala suave
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Transición automática hacia la pantalla principal con fade out
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, durationMs, onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[
          styles.logoImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Mati entre ollas - ¿Qué comemos hoy?"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '75%',
    maxWidth: 320,
    maxHeight: 320,
    aspectRatio: 1,
  },
});
