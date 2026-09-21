import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { THEME } from '../theme/colors';
import { MobileChatMessage, MobileRecipe, WeatherInfo } from '../types/recipe';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { generateLocalMatiReply } from '../services/matiChatFallback';

interface Props {
  onBack: () => void;
  onSelectRecipe: (recipe: MobileRecipe) => void;
  weather?: WeatherInfo;
  apiBaseUrl?: string;
}

const INITIAL_SUGGESTIONS = [
  'Tengo papas y huevos en la heladera',
  'Quiero algo rápido en 15 minutos',
  'Tengo fideos y puré de tomate',
  '¿Qué comemos hoy con este clima?',
];

export const ChatScreen: React.FC<Props> = ({
  onBack,
  onSelectRecipe,
  weather,
  apiBaseUrl = API_BASE_URL,
}) => {
  const [messages, setMessages] = useState<MobileChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        '¡Buenas che! Acá Mati entre ollas al pie del cañón. ¿Qué hay por esa cocina hoy? Contame qué ingredientes tenés a mano en la heladera o la alacena (aunque sean dos pavadas) y te armamos una comida casera bien rica, sin vueltas y al toque.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: INITIAL_SUGGESTIONS,
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll hacia el último mensaje cuando cambia la lista
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage: MobileChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const url = `${apiBaseUrl}${API_ENDPOINTS.CHAT}`;
      const payload = {
        messages: updatedMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        context: weather
          ? {
              temperature: weather.temperature,
              condition: weather.condition,
              city: weather.city,
            }
          : undefined,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: MobileChatMessage = {
        id: `mati-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '¡Qué lindo che! Acá te preparé una idea que te va a encantar:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recipeSuggestion: data.recipeSuggestion || undefined,
        suggestedReplies: data.suggestedReplies || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('API Gateway no disponible, respondiendo con motor inteligente de Mati:', err);

      // Simulación de pausa natural de respuesta (400ms) para una interacción fluida
      await new Promise(resolve => setTimeout(resolve, 400));

      // Generar respuesta contextual, variada y con receta si corresponde según lo que escribió el usuario
      const localReply = generateLocalMatiReply(text, updatedMessages, weather);
      setMessages(prev => [...prev, localReply]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageItem = ({ item, index }: { item: MobileChatMessage; index: number }) => {
    const isUser = item.role === 'user';
    const isLatestMessage = index === messages.length - 1;

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.matiRow]}>
        {!isUser && (
          <View style={styles.avatarMini}>
            <Text style={styles.avatarEmoji}>👨‍🍳</Text>
          </View>
        )}

        <View style={[styles.bubbleContainer, isUser ? styles.userBubbleContainer : styles.matiBubbleContainer]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.matiBubble]}>
            {!isUser && <Text style={styles.matiLabel}>Mati entre ollas</Text>}
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.matiMessageText]}>
              {item.content}
            </Text>
            <Text style={[styles.timestampText, isUser ? styles.userTimestamp : styles.matiTimestamp]}>
              {item.timestamp}
            </Text>
          </View>

          {/* Tarjeta de Receta Recomendada Embebida en el Chat */}
          {item.recipeSuggestion && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelectRecipe(item.recipeSuggestion!)}
              style={styles.recipeCardPreview}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Ver receta sugerida: ${item.recipeSuggestion.title}. ${item.recipeSuggestion.prepTimeMinutes} minutos, dificultad ${item.recipeSuggestion.difficulty}.`}
            >
              <View style={styles.recipeCardBadge}>
                <Text style={styles.recipeCardBadgeText}>
                  {item.recipeSuggestion.badge || '💡 Idea de Mati'}
                </Text>
              </View>

              <Text style={styles.recipeCardTitle}>{item.recipeSuggestion.title}</Text>
              <Text style={styles.recipeCardDescription} numberOfLines={2}>
                {item.recipeSuggestion.description}
              </Text>

              <View style={styles.recipeCardMetrics}>
                <Text style={styles.metricText}>⏱️ {item.recipeSuggestion.prepTimeMinutes} min</Text>
                <Text style={styles.metricDividerDot}>•</Text>
                <Text style={styles.metricText}>🌱 {item.recipeSuggestion.difficulty}</Text>
                <Text style={styles.metricDividerDot}>•</Text>
                <Text style={styles.metricText}>🍲 {item.recipeSuggestion.servings}</Text>
              </View>

              <View style={styles.viewRecipeButton}>
                <Text style={styles.viewRecipeButtonText}>Ver receta e ingredientes paso a paso →</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Sugerencias Rápidas para Responder (Chips) */}
          {isLatestMessage && !loading && item.suggestedReplies && item.suggestedReplies.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>💡 Podés responderle:</Text>
              <View style={styles.suggestionsRow}>
                {item.suggestedReplies.map((suggestion, sIdx) => (
                  <TouchableOpacity
                    key={sIdx}
                    onPress={() => sendMessage(suggestion)}
                    style={styles.suggestionChip}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Responder: ${suggestion}`}
                  >
                    <Text style={styles.suggestionChipText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Cabecera Cálida y Amigable */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla principal"
        >
          <Text style={styles.backButtonIcon}>←</Text>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarEmoji}>👨‍🍳</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Mati Bot</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.headerSubtitle}>Tu compañero de cocina • En línea</Text>
          </View>
        </View>
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingBubble}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarEmoji}>👨‍🍳</Text>
              </View>
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
                <Text style={styles.loadingText}>Mati está pensando una receta casera...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Barra de Entrada de Texto con Soporte para Teclado */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Contale a Mati qué tenés en la heladera..."
            placeholderTextColor="#A8A29E"
            multiline={true}
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
            accessible={true}
            accessibilityLabel="Mensaje para Mati"
            accessibilityHint="Escribí los ingredientes que tenés o qué querés cocinar"
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || loading}
            style={[
              styles.sendButton,
              (!inputText.trim() || loading) && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje a Mati"
          >
            <Text style={styles.sendButtonIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1.5,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0ECE4',
    borderRadius: 14,
    marginRight: 10,
    minHeight: 44,
  },
  backButtonIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8D6',
    borderWidth: 1.5,
    borderColor: '#F8C8B1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarEmoji: {
    fontSize: 22,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginRight: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  matiRow: {
    justifyContent: 'flex-start',
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  bubbleContainer: {
    maxWidth: '85%',
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
  },
  matiBubbleContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: THEME.colors.textPrimary,
    borderBottomRightRadius: 4,
  },
  matiBubble: {
    backgroundColor: THEME.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderBottomLeftRadius: 4,
  },
  matiLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  matiMessageText: {
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#D6D3D1',
    alignSelf: 'flex-end',
  },
  matiTimestamp: {
    color: THEME.colors.textSecondary,
    alignSelf: 'flex-end',
  },
  recipeCardPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  recipeCardBadge: {
    backgroundColor: '#FFEADF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  recipeCardBadgeText: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  recipeCardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  recipeCardMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  metricDividerDot: {
    marginHorizontal: 6,
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  viewRecipeButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewRecipeButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  suggestionsContainer: {
    marginTop: 8,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  suggestionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    backgroundColor: THEME.colors.cardBackground,
    borderTopWidth: 1.5,
    borderTopColor: THEME.colors.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: THEME.colors.textPrimary,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    maxHeight: 90,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#DDD6CC',
  },
  sendButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

