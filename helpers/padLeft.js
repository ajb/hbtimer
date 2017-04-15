export default function padLeft(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length)
}
