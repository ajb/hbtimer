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

import Icon from 'react-native-vector-icons/Entypo';

let navigator;

const defaultHangs = [
  { text: "Small edge half-crimp", weight: "-10lbs" },
]

function ListItem(props) {
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
      <Text style={{color: "white"}}>{"Time remaining:"} {props.timeRemaining}</Text>
      <Text style={{color: "white"}}>{"Active item:"} {formatItem(props.activeItem)}</Text>

      { props.nextItem && <Text style={{color: "white"}}>{"Next item:"} {formatItem(props.nextItem)}</Text> }
    </View>
  )
}

function DoneScreen (props) {
  return (
    <TouchableWithoutFeedback onPress={props.onClear}>
      <View style={{flex: 1, backgroundColor: "#222", paddingTop: 20}} >
        <Text style={{color: "#fff"}}>Nice job! Touch anywhere to dismiss.</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

function formatItem(item) {
  return `${item.text} ${item.weight || ''} (Rep ${item.rep}) (${item.type})`
}

const routes = {
  list: {
    usesNavbar: true,
    render: (ctx) => <MainScreen hangs={ctx.state.hangs} />
  },
  edit: {
    usesNavbar: true,
    render: (ctx) => <EditScreen
                            hangs={ctx.state.hangs}
                            onChangeText={ctx.onChangeText}
                            onItemDelete={ctx.onItemDelete} />
  },
  workout: {
    render: (ctx) => <WorkoutScreen
                        timeRemaining={ctx.state.workout.timeRemaining}
                        activeItem={ctx.state.workout.items[ctx.state.workout.activeIndex]}
                        nextItem={ctx.state.workout.items[ctx.state.workout.activeIndex + 1]}
                        />
  },
  done: {
    render: (ctx) => <DoneScreen onClear={() => ctx.navigate('list')} />
  }
}

export default class hbtimer extends Component {
  storageKey = 'hbtimer-hangs';

  componentDidMount() {
    this.setState({ currentRoute: 'list', currentRouteUsesNavbar: true })

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

  removeBlankHangs () {
    let newHangs = this.state.hangs.filter(hang => {
      return hang.text.trim().length > 0
    })

    if (newHangs.length > 0){
      this.setState({hangs: newHangs})
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
    this.configureWorkout()
    this.navigate('workout')
    this.startWorkout()
  }

  onResume = () => {
    this.startWorkout()
  }

  onCancel = () => {
    this.stopWorkout()
    this.navigate('list')
  }

  configureWorkout() {
    let items = [
      { type: 'rest', seconds: 10, text: 'Get ready…' }
    ]

    this.state.hangs.forEach((hang, hangIndex) => {
      let hangsPerSet = 7;
      let oneThruSeven = new Array(hangsPerSet).fill(0).map((v, k) => k + 1)

      oneThruSeven.forEach((num) => {
        items.push({ type: 'hang', seconds: 7, rep: num, ...hang })

        if (num === hangsPerSet) {
          if (hangIndex + 1 < this.state.hangs.seconds) {
            items.push({ type: 'longrest', seconds: 180 })
          }
        } else {
          items.push({ type: 'rest', seconds: 3, rep: num, ...hang })
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
    this.workoutInterval = setInterval(this.workoutTick, 1000);
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

  workoutDone() {
    clearInterval(this.workoutInterval);
    this.navigate('done')
    this.setState({ workoutStatus: 'stopped', workout: {} })
  }

  stopWorkout() {
    this.navigate('list')
    this.setState({ workoutStatus: 'stopped', workout: {} })
    clearInterval(this.workoutInterval);
  }

  onPause = () => {
    this.setState({ workoutStatus: 'paused' })
    clearInterval(this.workoutInterval);
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
