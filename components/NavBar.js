import React from 'react'
import { TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Entypo'

export default function NavBar(props) {
  return (
    <NavigationBar
      title={{ title: "HBTimer", style: { color: "#fff"} }}
      leftButton={
        props.currentRoute === 'edit' ?
          { title: "Done", handler: props.handleDone, tintColor: "#ff9600" } :
          { title: "Edit", handler: props.handleEdit, tintColor: "#ff9600" }
      }
      rightButton={
        <TouchableOpacity onPress={props.handleAdd}>
          <Icon name="plus" size={32} color="#ff9600" style={{marginTop: 6, marginRight: 8}} />
        </TouchableOpacity>
      }
      containerStyle={{
        borderBottomWidth: 1,
        borderBottomColor: "#666",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#222"
      }}
      statusBar={{ style: "light-content" }}
    />
  )
}
