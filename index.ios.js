/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  View,
  Navigator,
  AsyncStorage
} from 'react-native'
import Timer from 'react-native-timer'
import NavBar from './components/NavBar'
import StartBar from './components/StartBar'
import * as routes from './routes'
import * as workoutStatuses from './constants/workoutStatuses'

const INITIAL_COUNTDOWN_SECONDS = 10
const HANGS_PER_SET = 7
const HANG_SECONDS = 7
const REST_SECONDS = 3
const LONG_REST_SECONDS = 180
const DEFAULT_ROUTE = 'list'
const DEFAULT_HANGS = [{ text: "Small edge half-crimp", weight: "-10lbs" }]
const STORAGE_KEY = 'hbtimer-hangs';

export default class hbtimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workoutStatus: workoutStatuses.STOPPED,
      hangs: DEFAULT_HANGS,
      currentRoute: DEFAULT_ROUTE,
      currentRouteData: routes[DEFAULT_ROUTE]
    }
  }

  // Restore saved data
  componentDidMount() {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        this.setState({hangs: JSON.parse(value)})
      }
    })
  }

  // Persist all state changes to localstorage
  componentDidUpdate() {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.hangs));
  }

  onChangeText = (index, attr, text) => {
    this.setState({
      hangs: this.state.hangs.map((hang, idx) =>
        idx === index ?
          { ...hang, [attr]: text } :
          hang
      )
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
    this.handleEdit()

    this.setState({
      hangs: [
        ...this.state.hangs,
        { text: '', weight: '' }
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
      { type: 'initialCountdown', seconds: INITIAL_COUNTDOWN_SECONDS }
    ]

    this.state.hangs.forEach((hang, hangIndex) => {
      let reps = new Array(HANGS_PER_SET).fill(0).map((v, k) => k + 1)

      reps.forEach((num) => {
        items.push({ type: 'hang', seconds: HANG_SECONDS, rep: num, hangIndex: hangIndex, ...hang })

        if (num === HANGS_PER_SET) {
          if (hangIndex + 1 < this.state.hangs.length) {
            items.push({ type: 'longRest', seconds: LONG_REST_SECONDS })
          }
        } else {
          items.push({ type: 'rest', seconds: REST_SECONDS, rep: num, hangIndex: hangIndex, ...hang })
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
    this.setState({ workoutStatus: workoutStatuses.STARTED })
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
    this.setState({ workoutStatus: workoutStatuses.STOPPED, workout: {} })
  }

  stopWorkout() {
    this.navigate('list')
    this.setState({ workoutStatus: workoutStatuses.STOPPED, workout: {} })
    this.clearTimer()
  }

  onPause = () => {
    this.setState({ workoutStatus: workoutStatuses.PAUSED })
    this.clearTimer()
  }

  navigate (routeName) {
    if (this.state.currentRoute !== routeName) {
      this.navigator.replace(routes[routeName])
    }

    this.setState({
      currentRoute: routeName,
      currentRouteData: routes[routeName]
    })
  }

  render() {
    return (
      <View style={{flex: 1,
          flexDirection: "column",
          backgroundColor: "white"
      }}>
        <Navigator
          initialRoute={routes[DEFAULT_ROUTE]}
          renderScene={route => route.render(this)}
          ref={(node) => { this.navigator = node }}
          navigationBar={this.state.currentRouteData.usesNavbar &&
            <NavBar
              currentRoute={this.state.currentRoute}
              handleDone={this.handleDone}
              handleEdit={this.handleEdit}
              handleAdd={this.handleAdd}
              />
          }
          sceneStyle={{paddingTop: this.state.currentRouteData.usesNavbar ? 65 : 0}}
        />

        { this.state.currentRouteData.hideStartBar ||
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

AppRegistry.registerComponent('hbtimer', () => hbtimer);
