import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SuggestionBubble } from '../types/chatbot';

interface SuggestionsProps {
  suggestions: SuggestionBubble[];
  onSelectSuggestion: (suggestion: SuggestionBubble) => void;
  visible: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'routes':
      return 'map-outline';
    case 'weather':
      return 'partly-sunny-outline';
    case 'traffic':
      return 'car-outline';
    case 'events':
      return 'calendar-outline';
    case 'general':
      return 'help-circle-outline';
    default:
      return 'chatbubble-outline';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'routes':
      return '#113734ff';
    case 'weather':
      return '#4A90E2';
    case 'traffic':
      return '#F5A623';
    case 'events':
      return '#BD10E0';
    case 'general':
      return '#50E3C2';
    default:
      return '#0F6E66';
  }
};

export default function SuggestionBubbles({ suggestions, onSelectSuggestion, visible }: SuggestionsProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={200}
        snapToAlignment="center"
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[
              styles.suggestionBubble,
              { borderColor: getCategoryColor(suggestion.category) }
            ]}
            onPress={() => onSelectSuggestion(suggestion)}
            activeOpacity={0.8}
            delayPressIn={0}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={getCategoryIcon(suggestion.category as any)} 
                size={20} 
                color={getCategoryColor(suggestion.category)} 
              />
            </View>
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 150, // Más arriba
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
    maxHeight: 80, // Reducido para solo las burbujas
  },
  scrollContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  suggestionBubble: {
    backgroundColor: '#317358ff',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 8, // Centrado mejor
    minWidth: 180,
    maxWidth: 220,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    color: '#ceddd6ff',
    textAlign: 'center',
    flex: 1,
    lineHeight: 18,
  },
});