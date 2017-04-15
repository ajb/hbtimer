const HANGS_PER_SET = 7
const INITIAL_COUNTDOWN_SECONDS = 10
const HANG_SECONDS = 7
const REST_SECONDS = 3
const LONG_REST_SECONDS = 180
const INITIAL_COUNTDOWN = { type: 'initialCountdown', seconds: INITIAL_COUNTDOWN_SECONDS }

export default function calculateWorkoutItems(hangs) {
  let items = [INITIAL_COUNTDOWN]

  hangs.forEach((hang, hangIndex) => {
    let reps = new Array(HANGS_PER_SET).fill(0).map((v, k) => k + 1)

    reps.forEach((num) => {
      items.push({ type: 'hang', seconds: HANG_SECONDS, rep: num, hangIndex: hangIndex, ...hang })

      if (num === HANGS_PER_SET) {
        if (hangIndex + 1 < hangs.length) {
          items.push({ type: 'longRest', seconds: LONG_REST_SECONDS })
        }
      } else {
        items.push({ type: 'rest', seconds: REST_SECONDS, rep: num, hangIndex: hangIndex, ...hang })

      }
    });
  });

  return items;
}
