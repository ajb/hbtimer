import React, { Component } from 'react';
import { View, TextInput, ActionSheetIOS, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

class EditableListItem extends Component {
  onDelete = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Delete', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this.props.onItemDelete()
      }
    });
  }

  render() {
    return (
      <View style={{
        height: 50,
        paddingRight: 46,
        paddingLeft: 36,
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#666",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
      }}>
        {this.props.showDelete ?
          <TouchableOpacity style={{position: "absolute", left: 0}} onPress={this.onDelete}>
            <Icon name="circle-with-minus" size={28} color="#ff3824" />
          </TouchableOpacity>
        :
          <View style={{position: "absolute", left: 0, opacity: 0.3}}>
            <Icon name="circle-with-minus" size={28} color="#ff3824" />
          </View>
        }
        <TextInput
          style={{fontSize: 17.5, flex: 1, color: "#ccc"}}
          value={this.props.item.text}
          autoFocus={this.props.isLast}
          onChangeText={(text) => this.props.onChangeText('text', text)}
          returnKeyType="next"
          onSubmitEditing={() => this.weightInput.focus()}
        />
        <TextInput
          style={{textAlign: 'right', minWidth: 60, fontSize: 17.5, color: "#999", marginLeft: 10, alignContent: "flex-end"}}
          value={this.props.item.weight}
          onChangeText={(text) => this.props.onChangeText('weight', text)}
          ref={(node) => this.weightInput = node}
          returnKeyType="done"
        />
        <Icon name="menu" size={28} color="#eee" style={{position: "absolute", right: 10}} />
      </View>
    );
  }
}

export default EditableListItem;
