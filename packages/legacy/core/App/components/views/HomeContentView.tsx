import { CredentialState } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../contexts/theme'
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'
import CredentialCard from '../misc/CredentialCard'
import EmptyWalletIcon from '../../assets/img/empty-wallet.svg' 

const offset = 25;

interface HomeContentViewProps {
  children?: any;
}

const HomeContentView: React.FC<HomeContentViewProps> = ({ children }) => {
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  .reverse(); // Reverse the order of credentials

  const { HomeTheme } = useTheme();
  const { t } = useTranslation();

  const screenWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: offset,
      paddingBottom: offset * 3,
    },
    welcomeContainer: {
      borderBottomWidth: 1,
      borderColor: '#D3D3D3',
    },
    welcomeText: {
      fontSize: 20,
      marginBottom: 3,
      marginLeft: 15,
    },
    messageContainer: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#D3D3D3',
      borderRadius: 15,
      paddingHorizontal: offset,
      paddingVertical: offset * 3,
      width: 370, // Set width to 370
      alignSelf: 'center', // Center message container horizontally
    },
    aboveBoxText: {
      textAlign: 'left',
      marginBottom: 25,
      marginLeft: 5,
      fontWeight: "bold",
      marginTop: 20,
    },
    emptyWalletContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
    },
    emptyWalletIcon: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    emptyWalletText: {
      fontSize: 16,
    },
    cardSpacing: {
      marginBottom: 15, // Add margin bottom to create separation between cards
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.welcomeContainer]}>
          <Text style={[HomeTheme.welcomeHeader, { marginTop: offset, marginBottom: 20 }]}>
            {t('Home.Welcome')}
          </Text>
        </View>
        <Text style={styles.aboveBoxText}>
          {t('Home.AddedDocuments')}
        </Text>
        {credentials.length === 0 ? (
          <View style={styles.messageContainer}>
            <View style={styles.emptyWalletContent}>
              <EmptyWalletIcon width={50} height={50} style={styles.emptyWalletIcon} />
              <Text style={styles.emptyWalletText}>{t('Home.EmptyWalletMessage')}</Text>
            </View>
          </View>
        ) : (
          <>
            {credentials.map((credential, index) => (
              <View style={styles.cardSpacing} key={index}>
                <CredentialCard
                  credential={credential}
                  style={styles.cardSpacing} // Apply spacing between each card
                />
              </View>
            ))}
          </>
        )}
      </View>
      {children}
    </ScrollView>
  );
};

export default HomeContentView;