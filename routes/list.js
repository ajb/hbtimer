import React from 'react';
import { View } from 'react-native';
import ListItem from '../components/ListItem'

export default {
  usesNavbar: true,
  render: (ctx) => {
    return (
      <View style={{flex: 1, backgroundColor: "#222"}}>
        <View style={{flex: 1}}>
          {ctx.state.hangs.map((item, index) => <ListItem key={index} item={item} />)}
        </View>
      </View>
    )
  }
}
