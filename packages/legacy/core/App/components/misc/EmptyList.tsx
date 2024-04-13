import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View, StyleSheet } from 'react-native'

import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'

export interface EmptyListProps {
  message?: string
}

const EmptyList: React.FC<EmptyListProps> = ({ message }) => {
  const { t } = useTranslation()
  const { ListItems, Assets, ColorPallet } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // Center items horizontally
      alignItems: 'center', // Center items vertically
      backgroundColor: ColorPallet.brand.primaryBackground,
      marginTop: 50,
    },
    message: {
      marginTop: 10,
      textAlign: 'center',
      ...ListItems.emptyList,
      paddingTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Assets.svg.emptyWallet fill={ListItems.emptyList.color} height={100} />
      <Text style={styles.message} testID={testIdWithKey('NoneYet')}>
        {message || t('Global.NoneYet!')}
      </Text>
    </View>
  )
}

export default EmptyList
