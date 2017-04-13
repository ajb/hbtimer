/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Navigator,
  ActionSheetIOS,
  AsyncStorage
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import Icon from 'react-native-vector-icons/Entypo';

let navigator;

function ListItem(props) {
  return (
    <View style={{
      height: 43,
      paddingRight: 15,
      marginLeft: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    }}>
      <Text style={{fontSize: 16.5}}>{props.item.text}</Text>
      <Text style={{fontSize: 16.5, color: "#8e8e93", marginLeft: 10}}>{props.item.weight}</Text>
    </View>
  );
}

class EditableListItem extends Component {
  constructor(props) {
    super(props);
  }

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
        height: 43,
        paddingRight: 46,
        paddingLeft: 36,
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
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
          style={{fontSize: 16.5, flex: 1}}
          value={this.props.item.text}
          autoFocus={this.props.isLast}
          onChangeText={(text) => this.props.onChangeText('text', text)}
          returnKeyType="next"
          onSubmitEditing={() => this.weightInput.focus()}
        />
        <TextInput
          style={{minWidth: 60, fontSize: 16.5, color: "#8e8e93", marginLeft: 10, alignContent: "flex-end"}}
          value={this.props.item.weight}
          onChangeText={(text) => this.props.onChangeText('weight', text)}
          ref={(node) => this.weightInput = node}
          returnKeyType="done"
        />
        <Icon name="menu" size={28} color="#333" style={{position: "absolute", right: 10}} />
      </View>
    );
  }
}

function StartBar () {
  return (
    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", height: 100, padding: 1, borderTopWidth: 1, borderTopColor: "#ccc", backgroundColor: "white"}}>
      <TouchableHighlight style={{
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: "#007100"
      }} underlayColor="#004f00"
      onPress={() => {}}
      >
        <View style={{
          borderColor: "white",
          borderWidth: 1,
          height: 76,
          width: 76,
          marginTop: 2,
          marginLeft: 2,
          borderRadius: 76/2,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{fontSize: 16, color: "#cbe6c4", backgroundColor: "transparent"}}>Start</Text>
        </View>
      </TouchableHighlight>
    </View>
  )
}

function MainScreen (props) {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {props.hangs.map((item, index) => <ListItem key={index} item={item} />)}
      </View>

      <StartBar />
    </View>
  )
}

function EditScreen (props) {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {props.hangs.map((item, index) => {
          return <EditableListItem
                    key={index}
                    showDelete={props.hangs.length > 1}
                    item={item}
                    isLast={index == props.hangs.length - 1}
                    onChangeText={(attr, text) => {
                      props.onChangeText(index, attr, text)
                    }}
                    onItemDelete={() => props.onItemDelete(index) }
                  />
        })}
      </View>
      <StartBar />
    </View>
  )
}

const routes = [
  {
    title: 'Main',
    renderScene: (ctx) => <MainScreen hangs={ctx.state.hangs} />
  },
  {
    title: 'Edit',
    renderScene: (ctx) => <EditScreen
                            hangs={ctx.state.hangs}
                            onChangeText={ctx.onChangeText}
                            onItemDelete={ctx.onItemDelete} />
  }
]

export default class hbtimer extends Component {
  storageKey = 'hbtimer-hangs';

  componentDidMount() {
    AsyncStorage.getItem(this.storageKey).then((value) => {
      if (value) {
        this.setState({hangs: JSON.parse(value)})
      }
    })
  }

  componentDidUpdate() {
    AsyncStorage.setItem(this.storageKey, JSON.stringify(this.state.hangs));
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      hangs: [
        { text: "Small edge half-crimp", weight: "-10lbs" },
      ]
    }
  }

  onChangeText = (index, attr, text) => {
    this.setState({
      hangs: this.state.hangs.map((hang, idx) => {
        if (idx === index) {
          return { ...hang, [attr]: text }
        } else {
          return hang;
        }
      })
    })
  }

  onItemDelete = (index) => {
    this.setState({
      hangs: this.state.hangs.filter((hang, idx) => idx !== index)
    })
  }

  removeBlankHangs () {
    this.setState({
      hangs: this.state.hangs.filter(hang => {
        return hang.text.trim().length > 0
      })
    })
  }

  handleEdit = () => {
    this.navigator.replace(routes[1])
    this.setState({isEditing: true})
  }

  handleDone = () => {
    this.navigator.replace(routes[0])
    this.setState({isEditing: false})
    this.removeBlankHangs()
  }

  handleAdd = () => {
    if (!this.state.isEditing){
      this.handleEdit();
    }

    this.setState({
      hangs: [
        ...this.state.hangs,
        { text: "", weight: "" }
      ]
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={routes[0]}
          renderScene={route => route.renderScene(this)}
          ref={(node) => { this.navigator = node }}
          navigationBar={

            <NavigationBar
              title={{ title: "HBTimer" }}
              leftButton={
                this.state.isEditing ?
                  { title: "Done", handler: this.handleDone } :
                  { title: "Edit", handler: this.handleEdit }
              }
              rightButton={
                <TouchableOpacity onPress={this.handleAdd}>
                  <Icon name="plus" size={32} color="#0076ff" style={{marginTop: 6, marginRight: 8}} />
                </TouchableOpacity>
              }
              containerStyle={{
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />

          }
          sceneStyle={{paddingTop: 65}}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },
};

AppRegistry.registerComponent('hbtimer', () => hbtimer);
