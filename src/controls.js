const codes = { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' }
const state = { left: false, right: false, forward: false, backward: false }

function onKey (pressed, direction) {
  if (!direction) {
    return
  }

  state[direction] = pressed
}

document.addEventListener('keydown', ({ which }) => onKey(true, codes[which]))
document.addEventListener('keyup', ({ which }) => onKey(false, codes[which]))

export default state
