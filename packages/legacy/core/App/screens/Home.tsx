import { useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { useConfiguration } from '../contexts/configuration'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { useTour } from '../contexts/tour/tour-context'
import { HomeStackParams, Screens } from '../types/navigators'
import  ListCredentials  from './ListCredentials'

const { width } = Dimensions.get('window')
const offset = 25
const offsetPadding = 5

type HomeProps = StackScreenProps<HomeStackParams, Screens.Home>

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { useCustomNotifications, enableTours: enableToursConfig } = useConfiguration()
  const { notifications } = useCustomNotifications()
  const { t } = useTranslation()
  const { homeContentView: HomeContentView } = useConfiguration()

  // This syntax is required for the jest mocks to work
  // eslint-disable-next-line import/no-named-as-default-member
  const { HomeTheme } = useTheme()
  const [store, dispatch] = useStore()
  const { start, stop } = useTour()
  const screenIsFocused = useIsFocused()


  return (
    <ScrollView>
      <HomeContentView />
    </ScrollView>
  )
}

export default Home