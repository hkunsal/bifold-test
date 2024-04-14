import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useConfiguration } from '../contexts/configuration';
import { useStore } from '../contexts/store';
import { useTheme } from '../contexts/theme';
import { useTour } from '../contexts/tour/tour-context';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParams, Screens } from '../types/navigators';

type HomeProps = StackScreenProps<HomeStackParams, Screens.Home>;

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { useCustomNotifications, enableTours: enableToursConfig } = useConfiguration();
  const { notifications } = useCustomNotifications();
  const { t } = useTranslation();
  const { homeContentView: HomeContentView } = useConfiguration();
  const { HomeTheme } = useTheme();
  const [store, dispatch] = useStore();
  const { start, stop } = useTour();

  return (
    <View style={{ flex: 1 }}>
      <HomeContentView />
    </View>
  );
};

export default Home;
