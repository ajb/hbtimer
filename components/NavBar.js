import React from 'react'
import { TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Entypo'
import styles, { colors } from '../styles'

export default function NavBar(props) {
  return (
    <NavigationBar
      title={{ title: "Hangboard Timer", style: styles.navbarTitle }}
      leftButton={
        props.currentRoute === 'edit' ?
          { title: "Done", handler: props.handleDone, tintColor: colors.orange } :
          { title: "Edit", handler: props.handleEdit, tintColor: colors.orange }
      }
      rightButton={
        <TouchableOpacity onPress={props.handleAdd}>
          <Icon name="plus" size={32} color={colors.orange} style={styles.navbarPlus} />
        </TouchableOpacity>
      }
      containerStyle={styles.navbar}
      statusBar={{ style: 'light-content' }}
    />
  )
}
