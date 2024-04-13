import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../contexts/theme';

import InterfaceRafiki from '../../assets/img/interface-rafiki.svg';

const CredentialPending: React.FC = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bezier(0.36, -0.01, 0.5, 1.38),
    }).start();

    const shakeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 2, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -4, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 4, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -4, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 4, duration: 100, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -1, duration: 100, useNativeDriver: true }),
      ])
    );

    shakeAnimation.start();
    return () => shakeAnimation.stop();
  }, []);

  const animatedStyle = {
    opacity,
    transform: [{ translateX }]
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.front, animatedStyle]}>
        <InterfaceRafiki />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  front: {
    marginTop: 55,
    height: 280,
    width: 280,
  }
});

export default CredentialPending;
