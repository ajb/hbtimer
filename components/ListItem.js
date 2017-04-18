import React from 'react'
import { View, Text } from 'react-native'
import styles from '../styles'

export default function ListItem(props) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{props.item.text}</Text>
      <Text style={styles.listItemWeight}>{props.item.weight}</Text>
    </View>
  );
}
