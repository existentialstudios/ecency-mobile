import React from 'react';
import { View, Text } from 'react-native';
import styles from './transferFormItemStyles';

/* Props
 * ------------------------------------------------
 *   @prop { type }    name                - Description....
 */

const TransferFormItemView = ({ rightComponent, label, containerStyle }) => (
  <View style={[styles.container, containerStyle]}>
    <View style={styles.leftPart}>{label && <Text style={styles.text}>{label}</Text>}</View>
    <View style={styles.rightPart}>{rightComponent && rightComponent()}</View>
  </View>
);

export default TransferFormItemView;
