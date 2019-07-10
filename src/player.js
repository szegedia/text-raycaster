const circle = Math.PI * 2

export default class Player {
  constructor (x, y, direction) {
    this.x = x
    this.y = y
    this.speed = 10
    this.rotateSpeed = Math.PI * 2
    this.direction = direction

    this.init()
  }

  init () {
    this.info = document.createElement('div')
    this.info.classList.add('player-info')

    document.body.appendChild(this.info)
  }

  rotate (angle) {
    this.direction = (this.direction + angle + circle) % circle
  }

  move (distance, map) {
    const dx = Math.cos(this.direction) * distance
    const dy = Math.sin(this.direction) * distance

    if (!map.isWall(this.x + dx, this.y)) this.x += dx
    if (!map.isWall(this.x, this.y + dy)) this.y += dy
  }

  update (controls, map, tick) {
    if (controls.left) this.rotate(-this.rotateSpeed * tick)
    if (controls.right) this.rotate(this.rotateSpeed * tick)
    if (controls.forward) this.move((this.speed * tick), map)
    if (controls.backward) this.move(-(this.speed * tick), map)

    this.updateInfo(controls)
  }

  updateInfo ({ left, right, forward, backward }) {
    this.info.innerHTML = `
      x: ${this.x.toFixed(2)};
      y: ${this.y.toFixed(2)};
      r: ${this.direction.toFixed(2)}rad;
      L: ${left};
      R: ${right};
      F: ${forward};
      B: ${backward}
    `
  }
}
