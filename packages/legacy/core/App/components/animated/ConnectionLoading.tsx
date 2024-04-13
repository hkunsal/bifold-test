import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useTranslation } from 'react-i18next';

const ConnectionLoading: React.FC = () => {
  const { ColorPallet } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ColorPallet.brand.primaryBackground,
      flex: 1,
    },
    image: {
      width: 100, // Adjust the width as needed
      height: 100, // Adjust the height as needed
      resizeMode: 'contain' // Ensures the GIF scales correctly
    },
    text: {
      textAlign: 'center',
      color: 'black', // Set text color
      fontSize: 18, // Set text size
      marginBottom: 10,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t('ConnectionLoading.BuildingID')}
      </Text>
      <Image 
        style={styles.image}
        source={require('../../assets/img/loading-spinner.gif')}
      />
    </View>
  );
};

export default ConnectionLoading;
