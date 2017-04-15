import React from 'react';
import { View, Text } from 'react-native';
import padLeft from '../helpers/padLeft'

const stylesByType = {
  initialRest: {
    backgroundColor: "#222"
  },
  longRest: {
    backgroundColor: "#222"
  },
  hang: {
    backgroundColor: "#083506"
  },
  rest: {
    backgroundColor: "#7e1b12"
  }
}

function formatTime (seconds) {
  let minutes = Math.floor(seconds / 60)
  let remainingSeconds = seconds - minutes * 60
  return `${minutes}:${padLeft(remainingSeconds, '0', 2)}`
}

function formatWorkoutItem (item) {
  switch (item.type) {
    case 'initialRest':
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
      <View style={Object.assign({}, {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 30
      }, stylesByType[activeItem.type])}>
        <Text style={{color: "white", fontSize: 50, position: 'absolute', top: 40}}>{formatTime(timeRemaining)}</Text>
        <Text style={{color: "white", fontSize: 60}}>
          {formatWorkoutItem(activeItem).text}
          {activeItem.rep ? ` #${activeItem.rep}` : ''}
        </Text>
        <Text style={{color: "white", fontSize: 20}}>{formatWorkoutItem(activeItem).subtext}</Text>

        { nextText &&
          <Text style={{color: "white", position: 'absolute', bottom: 20}}>
            {"Next: "}
            <Text style={{fontWeight: 'bold'}}>{nextText}</Text>
          </Text> }
      </View>
    )
  }
}
