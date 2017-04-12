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
  View,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Navigator
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
const plusIcon = (
  <TouchableOpacity>
    <Icon name="plus" size={24} color="#037ac7" style={{marginTop: 8, marginRight: 10}} />
  </TouchableOpacity>
)

let navigator;

const dummyHangs = [
  { key: 0, text: "3 finger large edge", weight: "20" },
  { key: 1, text: "Sloper", weight: "30" }
]

function handleEdit() {
  navigator.replace(routes[1])
}

function handleDone() {
  navigator.replace(routes[0])
}

const mainScreen = (
  <View style={{flex: 1}}>
    <NavigationBar
      title={{ title: "HBTimer" }}
      leftButton={{ title: "Edit", handler: handleEdit }}
      rightButton={plusIcon}
      containerStyle={{borderBottomWidth: 1, borderBottomColor: "#ccc"}}
    />

    <View style={{flex: 1}}>
      {dummyHangs.map((item, index) => <Text key={index}>{item.text}</Text>)}
    </View>

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
  </View>
)

const editScreen = (
  <View style={{flex: 1}}>
    <NavigationBar
      title={{ title: "HBTimer" }}
      leftButton={{ title: "Done", handler: handleDone }}
      rightButton={plusIcon}
      containerStyle={{borderBottomWidth: 1, borderBottomColor: "#ccc"}}
    />
  </View>
)

const routes = [
  { title: 'Main', component: mainScreen },
  { title: 'Edit', component: editScreen }
]

export default class hbtimer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={routes[0]}
          renderScene={(route, navigator) => route.component}
          ref={(node) => navigator = node}
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
