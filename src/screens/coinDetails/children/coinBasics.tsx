import React, { Fragment } from 'react'
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native'
import { DataPair } from '../../../redux/reducers/walletReducer'
import styles from './children.styles'


interface CoinBasicsProps {
    valuePairs: DataPair[];
    extraData: DataPair[];
    coinSymbol: string;
    percentChange: number;
}

export const CoinBasics = ({ valuePairs, extraData, coinSymbol, percentChange }: CoinBasicsProps) => {
    const intl = useIntl();
    const _renderCoinHeader = (
        <>
            <View style={styles.coinTitleContainer}>
                <Text style={styles.textCoinTitle}>{coinSymbol}</Text>
            </View>
            <Text 
                style={styles.textHeaderChange}>
                    {intl.formatMessage({ id: 'wallet.change' })} 
                        <Text 
                            style={percentChange > 0 ? styles.textPositive : styles.textNegative}>
                                {` ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`}
                        </Text>
                        
            </Text>
        </>
    )

    const _renderValuePair = (args: DataPair, index: number) => {
        const label = intl.formatMessage({ id: `wallet.${args.labelId}` })
        return (
            <Fragment key={`basic-data-${args.labelId}-${index}`}>
                <Text style={styles.textBasicValue}>{args.value}</Text>
                <Text style={styles.textBasicLabel}>{label}</Text>
            </Fragment>
        )
    }

    const _renderExtraData = (args: DataPair, index: number) => {
        const label = intl.formatMessage({ id: `wallet.${args.labelId}` })
        return (
            <View key={`extra-data-${args.labelId}-${index}`} style={styles.extraDataContainer}>
                <Text style={styles.textExtraLabel}>{label}</Text>
                <Text style={styles.textExtraValue}>{args.value}</Text>
            </View>
        )
    }

    return (
        <View style={[styles.card, styles.basicsContainer]}>
            {_renderCoinHeader}
            {valuePairs.map(_renderValuePair)}
            {extraData && extraData.map(_renderExtraData)}
        </View>
    )
}
