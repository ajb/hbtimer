import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';

export default {
  hideStartBar: true,
  render: (ctx) => {
    return (
      <TouchableWithoutFeedback onPress={() => ctx.navigate('list')}>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#222", paddingTop: 20}} >
          <Text style={{color: "#fff", fontSize: 40}}>Nice job!</Text>
          <Text style={{color: "#fff"}}>Touch anywhere to dismiss.</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
