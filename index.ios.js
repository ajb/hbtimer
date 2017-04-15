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
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Navigator,
  ActionSheetIOS,
  AsyncStorage,
  StatusBar
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import Timer from 'react-native-timer'

import Icon from 'react-native-vector-icons/Entypo';

import * as routes from './routes'

let navigator;

const defaultHangs = [
  { text: "Small edge half-crimp", weight: "-10lbs" },
]

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
      borderTopColor: "#444",
      paddingLeft: 20,
      paddingRight: 20
    }}>
      <TouchableHighlight style={{
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: "#333",
        opacity: props.workoutStatus === 'stopped' ? 0.7 : 1
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
        props.workoutStatus === 'started' ? (
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
          onPress={props.workoutStatus === 'paused' ? props.onResume : props.onStart}
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
              <Text style={{fontSize: 16, color: "#cbe6c4", backgroundColor: "transparent"}}>
                {props.workoutStatus === 'paused' ? 'Resume' : 'Start'}
              </Text>
            </View>
          </TouchableHighlight>
        )
      }
    </View>
  )
}

export default class hbtimer extends Component {
  storageKey = 'hbtimer-hangs'
  defaultRoute = 'list'

  componentDidMount() {
    this.setState({
      currentRoute: routes[this.defaultRoute],
      currentRouteUsesNavbar: routes[this.defaultRoute].usesNavbar
    })

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
      workoutStatus: 'stopped',
      hangs: defaultHangs
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

  removeBlankHangs (cb) {
    let newHangs = this.state.hangs.filter(hang => {
      return hang.text.trim().length > 0
    })

    if (newHangs.length > 0){
      this.setState({hangs: newHangs}, cb)
    } else {
      cb()
    }
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
    this.removeBlankHangs(() => {
      this.configureWorkout()
      this.navigate('workout')
      this.startWorkout()
    })
  }

  onResume = () => {
    this.startWorkout()
  }

  onCancel = () => {
    this.stopWorkout()
    this.navigate('list')
  }

  getFirstItemFromNextSet(tryAdd = 1) {
    let currentHangIndex = this.state.workout.items[this.state.workout.activeIndex].hangIndex;

    let nextItem = this.state.workout.items[this.state.workout.activeIndex + tryAdd];

    if (!nextItem) {
      return;
    } else if (nextItem.hangIndex !== undefined && (currentHangIndex === undefined || (nextItem.hangIndex > currentHangIndex))) {
      return nextItem;
    } else {
      return this.getFirstItemFromNextSet(tryAdd + 1)
    }
  }

  configureWorkout() {
    let items = [
      { type: 'initialRest', seconds: 10 }
    ]

    this.state.hangs.forEach((hang, hangIndex) => {
      let hangsPerSet = 7;
      let oneThruSeven = new Array(hangsPerSet).fill(0).map((v, k) => k + 1)

      oneThruSeven.forEach((num) => {
        items.push({ type: 'hang', seconds: 7, rep: num, hangIndex: hangIndex, ...hang })

        if (num === hangsPerSet) {
          if (hangIndex + 1 < this.state.hangs.length) {
            items.push({ type: 'longRest', seconds: 180 })
          }
        } else {
          items.push({ type: 'rest', seconds: 3, rep: num, hangIndex: hangIndex, ...hang })
        }
      });
    });


    this.setState({
      workout: {
        items: items,
        activeIndex: 0,
        timeRemaining: items[0].seconds
      }
    })
  }

  startWorkout() {
    this.setState({ workoutStatus: 'started' })
    Timer.setInterval('workoutTimer', this.workoutTick, 1000)
  }

  workoutTick = () => {
    let newTimeRemaining = this.state.workout.timeRemaining - 1;

    if (newTimeRemaining > 0) {
      this.setState({workout: { ...this.state.workout, timeRemaining: newTimeRemaining }})
    } else if (this.state.workout.activeIndex + 1 === this.state.workout.items.length) {
      this.workoutDone()
    } else {
      let newIndex = this.state.workout.activeIndex + 1;

      this.setState({
        workout: {
          ...this.state.workout,
          activeIndex: newIndex,
          timeRemaining: this.state.workout.items[newIndex].seconds
        }
      })
    }
  }

  clearTimer() {
    Timer.clearInterval('workoutTimer')
  }

  workoutDone() {
    this.clearTimer()
    this.navigate('done')
    this.setState({ workoutStatus: 'stopped', workout: {} })
  }

  stopWorkout() {
    this.navigate('list')
    this.setState({ workoutStatus: 'stopped', workout: {} })
    this.clearTimer()
  }

  onPause = () => {
    this.setState({ workoutStatus: 'paused' })
    this.clearTimer()
  }

  navigate (routeName) {
    if (this.state.currentRoute !== routeName) {
      this.navigator.replace(routes[routeName])
    }

    this.setState({currentRoute: routeName, currentRouteUsesNavbar: routes[routeName].usesNavbar})
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={routes.list}
          renderScene={route => route.render(this)}
          ref={(node) => { this.navigator = node }}
          navigationBar={
            this.state.currentRouteUsesNavbar ?
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
            /> : null
          }
          sceneStyle={{paddingTop: this.state.currentRouteUsesNavbar ? 65 : 0}}
        />

        { this.state.currentRoute === 'done' ? null :
          <StartBar
            onStart={this.onStart}
            onCancel={this.onCancel}
            onPause={this.onPause}
            onResume={this.onResume}
            workoutStatus={this.state.workoutStatus}
          />
        }
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
