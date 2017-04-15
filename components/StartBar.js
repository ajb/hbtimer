import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'

import * as workoutStatuses from '../constants/workoutStatuses'


export default function StartBar (props) {
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
        opacity: props.workoutStatus === workoutStatuses.STOPPED ? 0.7 : 1
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
        props.workoutStatus === workoutStatuses.STARTED ? (
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
          onPress={props.workoutStatus === workoutStatuses.PAUSED ? props.onResume : props.onStart}
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
                {props.workoutStatus === workoutStatuses.PAUSED ? 'Resume' : 'Start'}
              </Text>
            </View>
          </TouchableHighlight>
        )
      }
    </View>
  )
}
