import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import styles from '../styles'

export default {
  hideStartBar: true,
  render: (ctx) =>
    <TouchableWithoutFeedback onPress={() => ctx.navigate('list')}>
      <View style={styles.doneContainer} >
        <Text style={styles.doneTitle}>Nice job!</Text>
        <Text style={styles.doneSubtext}>Touch anywhere to dismiss.</Text>
      </View>
    </TouchableWithoutFeedback>
}
