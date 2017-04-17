import React from 'react'
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native'
import * as workoutStatuses from '../constants/workoutStatuses'
import styles from '../styles'

function CircleButton (props) {
  return (
    <TouchableHighlight
      style={StyleSheet.flatten([
        props.styles,
        styles.circleButton,
        { backgroundColor: props.backgroundColor }
      ])}
      underlayColor={props.underlayColor}
      onPress={props.onPress}
    >
      <View style={styles.circleButtonInner}>
        <Text style={StyleSheet.flatten([styles.circleButtonText, { color: props.textColor }])}>{props.children}</Text>
      </View>
    </TouchableHighlight>
  )
}

export default function StartBar (props) {
  return (
    <View style={styles.startBar}>
      <CircleButton
        backgroundColor="#333"
        underlayColor="#222"
        textColor="#eee"
        styles={{opacity: props.workoutStatus === workoutStatuses.STOPPED ? 0.7 : 1}}
        onPress={props.onCancel}
      >Cancel</CircleButton>

      {
        props.workoutStatus === workoutStatuses.STARTED ?
          <CircleButton
            backgroundColor="#b36909"
            underlayColor="#774709"
            textColor="#decab6"
            onPress={props.onPause}
          >Pause</CircleButton>
          :
          <CircleButton
            backgroundColor="#007100"
            underlayColor="#004f00"
            textColor="#cbe6c4"
            onPress={props.workoutStatus === workoutStatuses.PAUSED ? props.onResume : props.onStart}
          >{props.workoutStatus === workoutStatuses.PAUSED ? 'Resume' : 'Start'}</CircleButton>
      }
    </View>
  )
}
