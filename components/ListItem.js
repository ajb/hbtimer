import React from 'react';
import { View, Text } from 'react-native';

export default function ListItem(props) {
  return (
    <View style={{
      height: 50,
      paddingRight: 15,
      marginLeft: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#666",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Text style={{fontSize: 17.5, color: "#ccc"}}>{props.item.text}</Text>
      <Text style={{fontSize: 17.5, color: "#999", marginLeft: 10}}>{props.item.weight}</Text>
    </View>
  );
}
