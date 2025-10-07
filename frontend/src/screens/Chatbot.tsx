import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '../hooks/useNavigation';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';
import SuggestionBubbles from '../components/SuggestionBubbles';
import TypingIndicator from '../components/TypingIndicator';
import ChatHeader from '../components/ChatHeader';
import { ChatMessage } from '../types/chatbot';

export default function ChatbotScreen() {
  // Estado para manejar el texto del input
  const [message, setMessage] = useState('');
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const animationOpacity = useRef(new Animated.Value(1)).current;
  
  // Hook personalizado para gestionar el chat
  const {
    messages,
    isLoading,
    showSuggestions,
    suggestions,
    sendMessage,
    selectSuggestion,
    hasMessages
  } = useChat();

  // Función para manejar el envío del mensaje
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage(''); // Limpiar input después del envío
      
      // Scroll al final después de enviar
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Función para navegar hacia atrás
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Función para manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion: any) => {
    selectSuggestion(suggestion);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Animación de fade out para la animación Lottie cuando hay mensajes
  useEffect(() => {
    Animated.timing(animationOpacity, {
      toValue: hasMessages ? 0.3 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [hasMessages, animationOpacity]);

  // Scroll automático cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Renderizar cada mensaje del chat
  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  );

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground 
        source={require('../../assets/images/fondo3.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        {/* Configuración de la barra de estado */}
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Header del chatbot - siempre visible */}
        <ChatHeader onBackPress={handleGoBack} />

        {/* Contenedor principal con animación y chat */}
        <View style={styles.container}>
          {/* Estado inicial: Animación y saludo */}
          {!hasMessages && (
            <Animated.View style={[styles.animationContainer, { opacity: animationOpacity }]}>
              <LottieView
                source={require('../../assets/lotties/onda.json')} 
                autoPlay
                loop
                style={styles.animation}
              />
              <Text style={styles.text}>Hola, ¿en qué puedo ayudarte?</Text>
            </Animated.View>
          )}

          {/* Estado de conversación: Lista de mensajes */}
          {hasMessages && (
            <View style={styles.chatContainer}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
              
              {/* Indicador de escritura */}
              <TypingIndicator visible={isLoading} />
            </View>
          )}
        </View>

        {/* Burbujas de sugerencias - solo visibles al inicio */}
        <SuggestionBubbles
          suggestions={suggestions}
          onSelectSuggestion={handleSuggestionSelect}
          visible={showSuggestions}
        />

        {/* Caja de texto con botón de envío en la parte inferior */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe....."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={message}
              onChangeText={setMessage}
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
              multiline={false}
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { opacity: isLoading ? 0.5 : 1 }]}
              onPress={handleSendMessage}
              activeOpacity={0.8}
              disabled={isLoading || !message.trim()}
            >
              <Ionicons name="send" size={20} color="#72a697ff" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Los estilos del header ahora están en ChatHeader.tsx
  container: { 
    flex: 1, 
    paddingTop: 90, // Ajustado para el header más arriba: de 110 a 100
    paddingBottom: 90, // Reducido: menos espacio para input y sugerencias
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  text: { 
    fontSize: 18, 
    fontFamily: 'Mooli-Regular',
    marginTop: -0,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  animation: {
    width: 270,
    height: 270,
  },
  // Estilos para el contenedor de chat
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 4,
    paddingHorizontal: 8, // Espacio lateral para evitar choques
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  // Estilos para la caja de texto y botón de envío
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    zIndex: 100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#37645870",
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#72a697ff",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Mooli-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});