import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Entypo'
import styles, { colors } from '../styles'

class NavBar extends Component {
  render() {
    return (
      <NavigationBar
        title={{ title: "Hangboard Timer", style: styles.navbarTitle }}
        leftButton={
          this.props.currentRoute === 'edit' ?
            { title: "Done", handler: this.props.handleDone, tintColor: colors.orange } :
            { title: "Edit", handler: this.props.handleEdit, tintColor: colors.orange }
        }
        rightButton={
          <TouchableOpacity onPress={this.props.handleAdd}>
            <Icon name="plus" size={32} color={colors.orange} style={styles.navbarPlus} />
          </TouchableOpacity>
        }
        containerStyle={styles.navbar}
        statusBar={{ style: 'light-content' }}
      />
    )
  }
}

export default NavBar
