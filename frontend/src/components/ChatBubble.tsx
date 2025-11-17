import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ChatMessage } from '../types/chatbot';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.isUser;

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {/* Avatar del bot - solo para mensajes del bot */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={styles.avatar}
          />
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={[styles.avatar, { position: 'absolute' }]}
          />
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={[styles.avatar, { position: 'absolute' }]}
          />
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={[styles.avatar, { position: 'absolute' }]}
          />
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={[styles.avatar, { position: 'absolute' }]}
          />
          <LottieView
            source={require('../../assets/lotties/onda.json')}
            autoPlay
            loop
            style={[styles.avatar, { position: 'absolute' }]}
          />
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {message.message}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    marginLeft: -5,
    marginBottom: 4,
    backgroundColor: '#081a1d',
    borderWidth: 1,
    borderColor: '#777777',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#0F6E66',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 5,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Mooli-Regular',
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Mooli-Regular',
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botTimestamp: {
    color: 'rgba(51, 51, 51, 0.6)',
    textAlign: 'left',
  },
});