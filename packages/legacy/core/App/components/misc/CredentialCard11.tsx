import { CredentialExchangeRecord } from '@aries-framework/core'
import startCase from 'lodash.startcase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Dimensions, Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Person from '../../assets/icons/person.svg'
import Notes from '../../assets/icons/notes.svg'

import { useConfiguration } from '../../contexts/configuration'
import { useTheme } from '../../contexts/theme'
import { CredentialStatus } from '../../types/credential-status'
import { GenericFn } from '../../types/fn'
import { CardLayoutOverlay11, CredentialOverlay } from '../../types/oca'
import { Attribute, Predicate } from '../../types/record'
import { credentialTextColor, getCredentialIdentifiers, toImageSource } from '../../utils/credential'
import { getCredentialConnectionLabel, isDataUrl } from '../../utils/helpers'
import { testIdWithKey } from '../../utils/testable'
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

import CardWatermark from './CardWatermark'

interface CredentialCard11Props {
  credential?: CredentialExchangeRecord
  onPress?: GenericFn
  style?: ViewStyle
  displayItems?: (Attribute | Predicate)[]
  revoked?: boolean
  error?: boolean
  elevated?: boolean
  credName?: string
  credDefId?: string
  schemaId?: string
  proof?: boolean
  containerWidth?: number
  cardStyle?: ViewStyle
}

const { width } = Dimensions.get('screen')

const borderRadius = 10
const padding = width * 0.05
const logoHeight = width * 0.12

const CredentialCard11: React.FC<CredentialCard11Props> = ({
  credential,
  style = {},
  displayItems,
  onPress = undefined,
  error = false,
  elevated = false,
  credName,
  credDefId,
  schemaId,
  proof,
  cardStyle = {},
}) => {
  const { i18n, t } = useTranslation()
  const { ColorPallet, TextTheme, ListItems } = useTheme()
  const { OCABundleResolver } = useConfiguration()
  const [isRevoked, setIsRevoked] = useState<boolean>(credential?.revocationNotification !== undefined)
  const credentialConnectionLabel = getCredentialConnectionLabel(credential)
  const [isProofRevoked, setIsProofRevoked] = useState<boolean>(
    credential?.revocationNotification !== undefined && !!proof
  )

  const [overlay, setOverlay] = useState<CredentialOverlay<CardLayoutOverlay11>>({})

  const primaryField = overlay?.presentationFields?.find(
    (field) => field.name === overlay?.cardLayoutOverlay?.primaryAttribute?.name
  )
  const secondaryField = overlay?.presentationFields?.find(
    (field) => field.name === overlay?.cardLayoutOverlay?.secondaryAttribute?.name
  )

  const cardData = [...(displayItems ?? []), primaryField, secondaryField]

  const [dimensions, setDimensions] = useState({ cardWidth: 0, cardHeight: 0 })

  const styles = StyleSheet.create({
    container: {
      width: 370,
      height: 200,
      marginBottom: 20,
      overflow: 'hidden',
      borderRadius: 20,
      backgroundColor: '#d2610f',
      position: 'relative',
    },

    cardContainer: {
      flexDirection: 'row',
    },
    primaryBodyContainer: {
      flexGrow: 1,
      padding,
    },
    imageAttr: {
      height: 150,
      aspectRatio: 1,
      resizeMode: 'contain',
      borderRadius: 10,
    },
    statusContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderTopRightRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      height: logoHeight,
      width: logoHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      ...TextTheme.labelSubtitle,
      ...ListItems.recordAttributeText,
      fontSize: 15,
      flexShrink: 1,
    },
    valueText: {
      ...TextTheme.normal,
      minHeight: ListItems.recordAttributeText.fontSize,
      paddingVertical: 4,
    },
    textContainer: {
      color: proof
        ? TextTheme.normal.color
        : credentialTextColor(ColorPallet, overlay.cardLayoutOverlay?.primaryBackgroundColor),
      flexShrink: 1,
    },
    errorText: {
      ...TextTheme.normal,
      color: ListItems.proofError.color,
    },
    errorIcon: {
      color: ListItems.proofError.color,
    },
    watermark: {
      opacity: 0.16,
      fontSize: 22,
      transform: [{ rotate: '-30deg' }],
    },
  })

  useEffect(() => {
    const params = {
      identifiers: credential ? getCredentialIdentifiers(credential) : { schemaId, credentialDefinitionId: credDefId },
      attributes: proof ? [] : credential?.credentialAttributes,
      meta: {
        credName: credName,
        credConnectionId: credential?.connectionId,
        alias: credentialConnectionLabel,
      },
      language: i18n.language,
    }
    OCABundleResolver.resolveAllBundles(params).then((bundle) => {
      setOverlay({
        ...overlay,
        ...bundle,
        cardLayoutOverlay: bundle.cardLayoutOverlay as CardLayoutOverlay11,
      })
    })
  }, [credential])

  useEffect(() => {
    setIsRevoked(credential?.revocationNotification !== undefined && !proof)
    setIsProofRevoked(credential?.revocationNotification !== undefined && !!proof)
  }, [credential?.revocationNotification])

  const AttributeLabel: React.FC<{ label: string }> = ({ label }) => {
    return (
      <Text
        style={[
          TextTheme.labelSubtitle,
          styles.textContainer,
          {
            lineHeight: 19,
            opacity: 0.8,
          },
        ]}
        testID={testIdWithKey('AttributeName')}
      >
        {label}
      </Text>
    )
  }

  const AttributeValue: React.FC<{ value: string | number | null }> = ({ value }) => {
    return (
      <>
        {isDataUrl(value) ? (
          <Image style={styles.imageAttr} source={{ uri: value as string }}></Image>
        ) : (
          <Text
            style={[
              TextTheme.normal,
              styles.textContainer,
              {
                lineHeight: 24,
                fontWeight: 'bold',
              },
            ]}
            testID={testIdWithKey('AttributeValue')}
          >
            {value}
          </Text>
        )}
      </>
    )
  }

  const parseAttribute = (item: (Attribute & Predicate) | undefined) => {
    return { label: item?.label ?? startCase(item?.name ?? ''), value: item?.value || `${item?.pType} ${item?.pValue}` }
  }

  const renderCardAttribute = (item: Attribute & Predicate) => {
    const { label, value } = parseAttribute(item)
    return (
      item && (
        <View style={{ marginTop: 15 }}>
          {!(item?.value || item?.pValue) ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                style={{ paddingTop: 2, paddingHorizontal: 2 }}
                name="close"
                color={ListItems.proofError.color}
                size={ListItems.recordAttributeText.fontSize}
              />
              <AttributeLabel label={label} />
            </View>
          ) : (
            <AttributeLabel label={label} />
          )}
          {!(item?.value || item?.pValue) ? null : <AttributeValue value={value} />}
        </View>
      )
    )
  }

  const CredentialCardPrimaryBody: React.FC = () => {
    return (
      <View testID={testIdWithKey('CredentialCardPrimaryBody')} style={styles.primaryBodyContainer}>
        <Text
          testID={testIdWithKey('CredentialName')}
          style={[
            TextTheme.normal,
            styles.textContainer,
            {
              fontWeight: 'bold',
              lineHeight: 24,
              textAlign: 'left',
              marginTop: -10,
            },
          ]}
        >
          {overlay.metaOverlay?.name}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  marginLeft: 40, marginBottom: 40, }}>
          <Person width={90} height={110} fill="white" />
          <Notes width={90} height={110} fill="white" />
        </View>
        {(error || isProofRevoked) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 }}>
            <Icon style={[styles.errorIcon]} name="close" size={30} />
            <Text style={[styles.errorText]} testID={testIdWithKey('RevokedOrNotAvailable')} numberOfLines={1}>
              {error ? t('ProofRequest.NotAvailableInYourWallet') : t('CredentialDetails.Revoked')}
            </Text>
          </View>
        )}
        <FlatList
          data={cardData}
          scrollEnabled={false}
          renderItem={({ item }) => {
            return renderCardAttribute(item as Attribute & Predicate)
          }}
        />
      </View>
    )
  }  

  const CredentialCardStatus: React.FC<{ status?: CredentialStatus }> = ({ status }) => {
    const Status: React.FC<{ status?: CredentialStatus }> = ({ status }) => {
      switch (status) {
        case CredentialStatus.REVOKED:
          return (
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: ColorPallet.notification.error,
                },
              ]}
            >
              <Icon size={0.7 * logoHeight} style={{ color: ColorPallet.semantic.error }} name="error" />
            </View>
          )
        default:
          return <View style={[styles.statusContainer]} />
      }
    }

    return (
      <View testID={testIdWithKey('CredentialCardStatus')} style={styles.statusContainer}>
        <Status status={status} />
      </View>
    )
  }

  const CredentialCard: React.FC<{ status?: CredentialStatus }> = ({ status }) => {
    return (
      <View
        style={styles.cardContainer}
        accessible={true}
        accessibilityLabel={
          `${
            overlay.metaOverlay?.issuerName ? `${t('Credentials.IssuedBy')} ${overlay.metaOverlay?.issuerName}` : ''
          }, ${overlay.metaOverlay?.watermark ?? ''} ${overlay.metaOverlay?.name ?? ''} ${t(
            'Credentials.Credential'
          )}.` +
          cardData.map((item) => {
            const { label, value } = parseAttribute(item as (Attribute & Predicate) | undefined)
            if (label && value) {
              return ` ${label}, ${value}`
            }
          })
        }
      >
    
        <CredentialCardPrimaryBody />
        <CredentialCardStatus status={status} />
      </View>
    )
  }

  return overlay.bundle ? (
    <View
      style={[styles.container, style, { elevation: elevated ? 5 : 0, overflow: 'hidden' }]}
      onLayout={(event) => {
        setDimensions({ cardHeight: event.nativeEvent.layout.height, cardWidth: event.nativeEvent.layout.width })
      }}
    >

      <TouchableOpacity
        accessible={false}
        accessibilityLabel={typeof onPress === 'undefined' ? undefined : t('Credentials.CredentialDetails')}
        disabled={typeof onPress === 'undefined' ? true : false}
        onPress={onPress}
        style={[
          styles.container,
          style,
          { backgroundColor: isProofRevoked ? ColorPallet.notification.error : style.backgroundColor },
        ]}
        testID={testIdWithKey('ShowCredentialDetails')}
      >
        <View testID={testIdWithKey('CredentialCard')}>
          {overlay.metaOverlay?.watermark && (
            <CardWatermark
              width={dimensions.cardWidth}
              height={dimensions.cardHeight}
              style={styles.watermark}
              watermark={overlay.metaOverlay?.watermark}
            />
          )}
          <CredentialCard status={isRevoked ? CredentialStatus.REVOKED : undefined} />
        </View>
      </TouchableOpacity>
    </View>
  ) : null
}

export default CredentialCard11
