export default class Ray {
  constructor (map, screen, origin, angle) {
    this.map = map
    this.origin = origin
    this.angle = angle
    this.gridHeight = screen.height / this.map.height
    this.isUp = this.angle > 0 && angle < Math.PI
    this.isRight = this.angle < ((Math.PI) * 0.25) || this.angle > ((Math.PI) * 0.75)
    this.distance = this.cast()
  }

  cast () {
    const horizontal = this.castHorizontal()
    const vertical = this.castVertical()
    const dist = Math.min(horizontal, vertical)

    return dist * Math.cos(this.angle - this.origin.direction)
  }

  castHorizontal () {
    const intersectY = Math.floor(this.origin.y / this.gridHeight) * this.gridHeight + (this.isUp ? -0.1 : this.gridHeight)
    const intersectX = this.origin.x + (this.origin.y - intersectY) / Math.tan(this.angle)

    const deltaY = this.isUp ? -this.gridHeight : this.gridHeight
    const deltaX = Math.abs(this.gridHeight / Math.tan(this.angle)) * (!this.isRight ? 1 : -1)

    const wall = this.findWall(intersectX, intersectY, deltaX, deltaY)
    return wall
  }

  castVertical () {
    const intersectX = Math.floor(this.origin.x / this.gridHeight) * this.gridHeight + (!this.isRight ? this.gridHeight : -0.01)
    const intersectY = this.origin.y + (this.origin.y - intersectX) / Math.tan(this.angle)

    const deltaX = !this.isRight ? this.gridHeight : -this.gridHeight
    const deltaY = Math.abs(this.gridHeight * Math.tan(this.angle)) * (this.isUp ? -1 : 1)

    const wall = this.findWall(intersectX, intersectY, deltaX, deltaY)
    return wall
  }

  findWall (x, y, dx, dy) {
    const cell = this.map.get(x, y)

    if (cell < 0) {
      return Infinity
    }

    if (cell === 1) {
      return Math.hypot(x - this.origin.x, y - this.origin.y)
    }

    return this.findWall(x + dx, y + dy, dx, dy)
  }
}