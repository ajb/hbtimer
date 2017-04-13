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
  AsyncStorage,
  StatusBar
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
      borderBottomColor: "#666",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    }}>
      <Text style={{fontSize: 16.5, color: "#ccc"}}>{props.item.text}</Text>
      <Text style={{fontSize: 16.5, color: "#999", marginLeft: 10}}>{props.item.weight}</Text>
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
          style={{fontSize: 16.5, flex: 1, color: "#ccc"}}
          value={this.props.item.text}
          autoFocus={this.props.isLast}
          onChangeText={(text) => this.props.onChangeText('text', text)}
          returnKeyType="next"
          onSubmitEditing={() => this.weightInput.focus()}
        />
        <TextInput
          style={{minWidth: 60, fontSize: 16.5, color: "#999", marginLeft: 10, alignContent: "flex-end"}}
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

function StartBar (props) {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 100,
      padding: 1,
      backgroundColor: "#000",
      borderTopWidth: 1,
      borderTopColor: "#666",
      paddingLeft: 20,
      paddingRight: 20
    }}>
      <TouchableHighlight style={{
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: "#333",
        opacity: props.timerStarted ? 1 : 0.7
      }} underlayColor="#222"
      onPress={props.onCancel}
      >
        <View style={{
          borderColor: "#000",
          borderWidth: 1,
          height: 76,
          width: 76,
          marginTop: 2,
          marginLeft: 2,
          borderRadius: 76/2,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{fontSize: 16, color: "#eee", backgroundColor: "transparent"}}>Cancel</Text>
        </View>
      </TouchableHighlight>

      {
        props.timerStarted ? (
          <TouchableHighlight style={{
            height: 80,
            width: 80,
            borderRadius: 50,
            backgroundColor: "#b36909"
          }} underlayColor="#774709"
          onPress={props.onPause}
          >
            <View style={{
              borderColor: "#000",
              borderWidth: 1,
              height: 76,
              width: 76,
              marginTop: 2,
              marginLeft: 2,
              borderRadius: 76/2,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={{fontSize: 16, color: "#decab6", backgroundColor: "transparent"}}>Pause</Text>
            </View>
          </TouchableHighlight>
        ) : (
          <TouchableHighlight style={{
            height: 80,
            width: 80,
            borderRadius: 50,
            backgroundColor: "#007100"
          }} underlayColor="#004f00"
          onPress={props.onStart}
          >
            <View style={{
              borderColor: "#000",
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
        )
      }
    </View>
  )
}

function MainScreen (props) {
  return (
    <View style={{flex: 1, backgroundColor: "#222"}}>
      <View style={{flex: 1}}>
        {props.hangs.map((item, index) => <ListItem key={index} item={item} />)}
      </View>
    </View>
  )
}

function EditScreen (props) {
  return (
    <View style={{flex: 1, backgroundColor: "#222"}}>
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
    </View>
  )
}

function WorkoutScreen (props) {
  return (
    <View style={{flex: 1, backgroundColor: "#222", paddingTop: 20}}>
      <Text style={{color: "white"}}>Go Get em</Text>
    </View>
  )
}

const routes = {
  list: {
    render: (ctx) => <MainScreen hangs={ctx.state.hangs} />
  },
  edit: {
    render: (ctx) => <EditScreen
                            hangs={ctx.state.hangs}
                            onChangeText={ctx.onChangeText}
                            onItemDelete={ctx.onItemDelete} />
  },
  workout: {
    render: (ctx) => <WorkoutScreen />
  }
}

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
      timerStarted: false,
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
    this.navigate('edit')
  }

  handleDone = () => {
    this.navigate('list')
    this.removeBlankHangs()
  }

  handleAdd = () => {
    if (this.state.currentRoute !== 'edit'){
      this.handleEdit();
    }

    this.setState({
      hangs: [
        ...this.state.hangs,
        { text: "", weight: "" }
      ]
    })
  }

  onStart = () => {
    this.navigate('workout')
    this.setState({timerStarted: true})
  }

  onCancel = () => {
    this.navigate('list')
  }

  onPause = () => {

  }

  navigate (routeName) {
    this.navigator.replace(routes[routeName])
    this.setState({currentRoute: routeName})
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={routes.list}
          renderScene={(route => route.render(this))}
          ref={(node) => { this.navigator = node }}
          navigationBar={
            this.state.currentRoute === 'workout' ? null :
            <NavigationBar
              title={{ title: "HBTimer", style: { color: "#fff"} }}
              leftButton={
                this.state.currentRoute === 'edit' ?
                  { title: "Done", handler: this.handleDone, tintColor: "#ff9600" } :
                  { title: "Edit", handler: this.handleEdit, tintColor: "#ff9600" }
              }
              rightButton={
                <TouchableOpacity onPress={this.handleAdd}>
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

          }
          sceneStyle={{paddingTop: this.state.currentRoute === 'workout' ? 0 : 65}}
        />

        <StartBar
          onStart={this.onStart}
          onCancel={this.onCancel}
          onPause={this.onPause}
          timerStarted={this.state.timerStarted}
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
