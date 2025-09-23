import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { sendMessageToGemini } from '../api/gemini';
import ProfileFloatingMenu from '../components/ProfileFloatingMenu';
import ProfilePanel from '../components/ProfilePanel';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola, ¿en qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');

    try {
      // Llamada real a la API del chatbot
      const response = await sendMessageToGemini(messageToSend);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Mensaje de error si falla la API
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta nuevamente.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!item.isUser && (
        <Image
          source={require('../../assets/images/robot-assistant.png')}
          style={styles.botAvatar}
        />
      )}
      <View style={[
        styles.messageBubble,
        item.isUser 
          ? { backgroundColor: theme.primary } 
          : { backgroundColor: theme.card }
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser 
            ? { color: '#FFFFFF' }
            : { color: '#000000' }
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chatbot</Text>
        <TouchableOpacity 
          style={styles.avatarButton}
          onPress={() => setMenuVisible(v => !v)}
        >
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Componentes de perfil */}
      <ProfileFloatingMenu
        visible={menuVisible}
        onViewProfile={() => { setPanelVisible(true); setMenuVisible(false); }}
        onToggleDark={() => { /* utilizar useTheme().toggleTheme si quieres */ }}
        onSignOut={() => { /* logout desde AuthContext */ }}
      />

      <ProfilePanel 
        visible={panelVisible} 
        onClose={() => setPanelVisible(false)} 
      />

      {/* Área central con robot y mensaje inicial */}
      <View style={styles.centralArea}>
        <Image
          source={require('../../assets/images/robot-assistant.png')}
          style={styles.centralRobot}
        />
        <Text style={styles.welcomeText}>
          Hola, ¿en qué puedo ayudarte?
        </Text>
      </View>

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages.slice(1)} // Excluir el mensaje inicial ya que se muestra en el área central
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input de mensaje */}
      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.textInput, { color: '#000000' }]}
          placeholder="Escribe..."
          placeholderTextColor="#999999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  avatarButton: {
    padding: 5,
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  centralArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  centralRobot: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Mooli-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
