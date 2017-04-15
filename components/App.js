import React, { Component } from 'react'
import { View, Navigator, AsyncStorage } from 'react-native'
import Timer from 'react-native-timer'
import NavBar from '../components/NavBar'
import StartBar from '../components/StartBar'
import * as routes from '../routes'
import * as workoutStatuses from '../constants/workoutStatuses'
import calculateWorkoutItems from '../helpers/calculateWorkoutItems'

const DEFAULT_ROUTE = 'list'
const DEFAULT_HANGS = [{ text: 'Small edge half-crimp', weight: '-10lbs' }]
const STORAGE_KEY = 'hbtimer-hangs';

export default class App extends Component {
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
      let items = calculateWorkoutItems(this.state.hangs)

      this.setState({
        workout: {
          items: items,
          activeIndex: 0,
          timeRemaining: items[0].seconds
        }
      })

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

  getFirstItemFromNextSet() {
    const currentItemIndex = this.state.workout.activeIndex
    const currentHangIndex = this.state.workout.items[currentItemIndex].hangIndex
    let increment = 1

    while (true) {
      let nextItem = this.state.workout.items[currentItemIndex + increment];

      if (!nextItem) {
        return
      } else if (nextItem.hangIndex !== undefined && (currentHangIndex === undefined || (nextItem.hangIndex > currentHangIndex))) {
        return nextItem
      } else {
        increment++
      }
    }
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
