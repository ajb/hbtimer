import React, { Component } from 'react';
import { View, TextInput, ActionSheetIOS, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import styles, { colors } from '../styles'

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
    })
  }

  render() {
    return (
      <View style={StyleSheet.flatten([styles.listItem, styles.editableListItem])}>
        {this.props.showDelete ?
          <TouchableOpacity style={styles.editableListItemDelete} onPress={this.onDelete}>
            <Icon name="circle-with-minus" size={28} color={colors.deleteRed} />
          </TouchableOpacity>
        :
          <View style={StyleSheet.flatten([styles.editableListItemDelete, { opacity: 0.3 }])}>
            <Icon name="circle-with-minus" size={28} color={colors.deleteRed} />
          </View>
        }
        <TextInput
          style={styles.editableListItemText}
          value={this.props.item.text}
          autoFocus={this.props.isLast}
          onChangeText={(text) => this.props.onChangeText('text', text)}
          returnKeyType="next"
          onSubmitEditing={() => this.weightInput.focus()}
        />
        <TextInput
          style={styles.editableListItemWeight}
          value={this.props.item.weight}
          onChangeText={(text) => this.props.onChangeText('weight', text)}
          ref={(node) => this.weightInput = node}
          returnKeyType="done"
        />
        <Icon name="menu" size={28} color={colors.lighterGray} style={styles.editableListItemReorder} />
      </View>
    );
  }
}

export default EditableListItem;
