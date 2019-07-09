export default class Map {
  constructor () {
    // this.walls = new Uint8Array(this.width * this.height)
    this.walls = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    this.width = this.walls[0].length
    this.height = this.walls.length
  }

  get (x, y) {
    x = Math.floor(x)
    y = Math.floor(y)

    console.log('map get', x,y )

    // console.log(`map get x: ${x}, y: ${y} >> ${this.walls[y][x]}`)

    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
      return -1
    }

    return this.walls[y][x]
  }

  // cast ({ x, y }, angle, depth) {
  //   const sin = Math.sin(angle)
  //   const cos = Math.cos(angle)


  // }

  cast ({ x, y, direction }, angle, depth) {
    const eyeX = Math.cos(angle)
    const eyeY = Math.sin(angle)

    let wallHit = false
    let distance = 0

    while (!wallHit && distance < depth) {
      distance += 1

      const checkPosX = x + eyeX * distance
      const checkPosY = y + eyeY * distance
      const hitTest = this.get(checkPosX, checkPosY)


      if (hitTest === -1) {
        wallHit = true
        distance = depth
      } else  {
        if (hitTest !== 0) {
          wallHit = true
        }
      }
    }

    return distance * Math.cos(angle - direction)
  }
}