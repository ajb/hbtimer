import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import padLeft from '../helpers/padLeft'
import styles from '../styles'

function formatTime (seconds) {
  let minutes = Math.floor(seconds / 60)
  let remainingSeconds = seconds - minutes * 60
  return `${minutes}:${padLeft(remainingSeconds, '0', 2)}`
}

function formatWorkoutItem (item) {
  switch (item.type) {
    case 'initialCountdown':
      return {
        text: "Get ready…"
      }
    case 'longRest':
      return {
        text: "Rest"
      }
    case 'rest':
      return {
        text: "Rest",
        subtext: `${item.text} (${item.weight || ''})`
      }
    case 'hang':
      return {
        text: "Hang",
        subtext: `${item.text} (${item.weight || ''})`
      }
  }
}

export default {
  render: (ctx) => {
    let activeItem = ctx.state.workout.items[ctx.state.workout.activeIndex];
    let timeRemaining = ctx.state.workout.timeRemaining;
    let nextText = ctx.getFirstItemFromNextSet() && formatWorkoutItem(ctx.getFirstItemFromNextSet()).subtext;

    return (
      <View style={StyleSheet.flatten([styles.workoutContainer, styles["workoutContainer-" + activeItem.type]])}>
        <Text style={styles.workoutTime}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.workoutTitle}>
          {formatWorkoutItem(activeItem).text}
          {activeItem.rep ? ` #${activeItem.rep}` : ''}
        </Text>
        <Text style={styles.workoutSubtext}>{formatWorkoutItem(activeItem).subtext}</Text>

        { nextText &&
          <Text style={styles.workoutNext}>
            {"Next: "}
            <Text style={{fontWeight: 'bold'}}>{nextText}</Text>
          </Text> }
      </View>
    )
  }
}
