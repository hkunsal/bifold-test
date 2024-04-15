import React, { useState, useRef } from 'react';
import { View, Animated, PanResponder, Dimensions, StyleSheet, Text } from 'react-native';
import CredentialCard from '../misc/CredentialCard';
import { useCredentialByState } from '@aries-framework/react-hooks';
import { CredentialState } from '@aries-framework/core';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/theme';
import EmptyWalletIcon from '../../assets/img/empty-wallet.svg';
import { borderRadius } from 'theme';

const SWIPE_THRESHOLD = 100;
const CARD_OFFSET = 40;
const { width: screenWidth } = Dimensions.get('window');

const HomeContentView = () => {
  const initialCredentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ].reverse();

  const [credentials, setCredentials] = useState(initialCredentials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gesture) => {
      if (Math.abs(gesture.dy) < SWIPE_THRESHOLD) {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start(() => {
          setCredentials(prevCredentials => {
            const newCredentials = [...prevCredentials];
            const movedCard = newCredentials.splice(currentIndex, 1)[0];
            newCredentials.push(movedCard);
            return newCredentials;
          });
          setCurrentIndex(prevIndex => prevIndex === 0 ? 0 : (prevIndex - 1) % credentials.length);
        });
      }
    }
  });

  const { t } = useTranslation();
  const { HomeTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[HomeTheme.welcomeHeader, styles.welcomeText]}>
          {t('Home.Welcome')}
        </Text>
        <View style={styles.headerBorder}></View>
        <Text style={styles.aboveBoxText}>
          {t('Home.AddedDocuments')}
        </Text>
      </View>
      {credentials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyWalletIcon width={50} height={50} />
          <Text style={styles.emptyWalletText}>{t('Home.EmptyWalletMessage')}</Text>
        </View>
      ) : (
        <View {...panResponder.panHandlers} style={styles.cardContainer}>
          {credentials.map((credential, index) => {
  const isActive = index === currentIndex;
  let yOffset;

  if (credentials.length === 1) {
    yOffset = 40;
  } else if (credentials.length === 2) {
    if (index === 0) {
      yOffset = isActive ? pan.y : -50;  
    } else if (index === 1){
      yOffset = isActive ? pan.y -20 : -50;  
    }
  } else {
    if (index <= 2) {
      yOffset = isActive ? pan.y : -CARD_OFFSET * (index - currentIndex);
    } else {
      yOffset = -CARD_OFFSET * 2; 
    }
  }

            const cardStyle = {
              transform: [{ translateY: yOffset }],
              opacity: isActive ? 1 : 0.5,
              zIndex: isActive ? 100 : index,
            };

            return (
              <Animated.View
                key={credential.id || index}
                style={[styles.card, cardStyle]}
              >
                <CredentialCard credential={credential} containerWidth={screenWidth} />
              </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const BORDER_PADDING = 24; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
    paddingLeft: 20, 
  },
  cardContainer: {
    width: '100%',
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 24,
    marginTop: 10,
    textAlign: 'left', 
  },
  aboveBoxText: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 80,
    textAlign: 'left', 
  },
  emptyContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 370,
    height: 200,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: -50,  
    padding: 40,
  },
  emptyWalletText: {
    fontSize: 16,
    marginLeft: 10,
  },
  headerBorder: {
    height: 1,
    width: screenWidth - 2 * BORDER_PADDING, 
    backgroundColor: '#D3D3D3',
    marginBottom: 10,
    alignSelf: 'center', 
    marginLeft: BORDER_PADDING - 34,
    marginRight: BORDER_PADDING - 12
  },
});




export default HomeContentView;
