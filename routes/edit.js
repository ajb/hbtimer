import React from 'react';
import { View } from 'react-native';
import EditableListItem from '../components/EditableListItem';

export default {
  usesNavbar: true,
  render: (ctx) => {
    return (
      <View style={{flex: 1, backgroundColor: "#222"}}>
        <View style={{flex: 1}}>
          {ctx.state.hangs.map((item, index) => {
            return <EditableListItem
                      key={index}
                      showDelete={ctx.state.hangs.length > 1}
                      item={item}
                      isLast={index == ctx.state.hangs.length - 1}
                      onChangeText={(attr, text) => {
                        ctx.onChangeText(index, attr, text)
                      }}
                      onItemDelete={() => ctx.onItemDelete(index) }
                    />
          })}
        </View>
      </View>
    )
  }
}
