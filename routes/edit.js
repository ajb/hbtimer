import React from 'react'
import { View } from 'react-native'
import EditableListItem from '../components/EditableListItem'
import styles from '../styles'

export default {
  usesNavbar: true,
  render: (ctx) =>
    <View style={styles.listContainer}>
      {ctx.state.hangs.map((item, index) =>
        <EditableListItem
          key={index}
          showDelete={ctx.state.hangs.length > 1}
          item={item}
          isLast={index === ctx.state.hangs.length - 1}
          onChangeText={(attr, text) => ctx.onChangeText(index, attr, text)}
          onItemDelete={() => ctx.onItemDelete(index) }
        />
      )}
    </View>
}
