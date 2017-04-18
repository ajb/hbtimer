import React from 'react'
import { View } from 'react-native'
import ListItem from '../components/ListItem'
import styles from '../styles'

export default {
  usesNavbar: true,
  render: (ctx) =>
    <View style={styles.listContainer}>
      {ctx.state.hangs.map((item, index) => <ListItem key={index} item={item} />)}
    </View>
}
