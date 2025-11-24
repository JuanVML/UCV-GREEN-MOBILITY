import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

interface TypingIndicatorProps {
  visible: boolean;
}

export default function TypingIndicator({ visible }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animationSequence = () => {
        const animate = (dot: Animated.Value, delay: number) => {
          return Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ]);
        };

        Animated.loop(
          Animated.parallel([
            animate(dot1, 0),
            animate(dot2, 150),
            animate(dot3, 300),
          ])
        ).start();
      };

      animationSequence();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
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
      <View style={styles.bubble}>
        <Text style={styles.text}>Escribiendo</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1, transform: [{ scale: dot1 }] }]} />
          <Animated.View style={[styles.dot, { opacity: dot2, transform: [{ scale: dot2 }] }]} />
          <Animated.View style={[styles.dot, { opacity: dot3, transform: [{ scale: dot3 }] }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    color: '#555555',
    marginRight: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F6E66',
    marginHorizontal: 2,
  },
});