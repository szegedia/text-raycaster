const circle = Math.PI * 2

export default class Player {
  constructor (x, y, direction) {
    this.x = x
    this.y = y
    this.speed = 10
    this.rotateSpeed = Math.PI * 2
    this.direction = direction
    this.debugPane = document.body.querySelector('#playerInfo')
  }

  rotate (angle) {
    this.direction = (this.direction + angle + circle) % circle
  }

  move (distance, map) {
    const dx = Math.cos(this.direction) * distance
    const dy = Math.sin(this.direction) * distance

    if (map.get(this.x + dx, this.y) <= 0) this.x += dx
    if (map.get(this.x, this.y + dy) <= 0) this.y += dy
  }

  update (controls, map, tick) {
    if (controls.left) this.rotate(-this.rotateSpeed * tick)
    if (controls.right) this.rotate(this.rotateSpeed * tick)
    if (controls.forward) this.move((this.speed * tick), map)
    if (controls.backward) this.move(-(this.speed * tick), map)

    this.debugPane.innerHTML =`
    <div>tick: ${tick}</div>
    <div>direction: ${this.direction}</div>
    <div>left: ${controls.left}</div>
    <div>up: ${controls.forward}</div>
    <div>right: ${controls.right}</div>
    <div>down: ${controls.backward}</div>
    <div>x: ${this.x}</div>
    <div>y: ${this.y}</div>`
  }
}
