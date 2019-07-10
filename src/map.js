export default class Map {
  constructor () {
    this.walls = [
      '###############',
      '#.............#',
      '#.............#',
      '#.............#',
      '#..........####',
      '#.............#',
      '#.............#',
      '#.............#',
      '#.............#',
      '#.......###...#',
      '#.............#',
      '#.............#',
      '#.............#',
      '###############'
    ]

    this.width = this.walls[0].length
    this.height = this.walls.length
    this.eyeshot = []
    this.charSet = {
      wall: '#',
      floor: '.'
    }
  }

  get (x, y) {
    x = Math.floor(x)
    y = Math.floor(y)

    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
      return -1
    }

    return this.walls[y][x]
  }

  isWall (x, y) {
    const char = this.get(x, y)
    return char === this.charSet.wall
  }

  cast (player, angle, depth) {
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    let distance = 0
    let hitWall = false
    let boundary = false

    while (!hitWall && distance < depth) {
      distance += 1
      const nTestX = Math.floor(player.x + cos * distance)
      const nTestY = Math.floor(player.y + sin * distance)

      this.eyeshot[nTestY] = this.eyeshot[nTestY] || []
      this.eyeshot[nTestY][nTestX] = true

      if (nTestX < 0 || nTestX >= this.width || nTestY < 0 || nTestY >= this.height) {
        distance = depth
        hitWall = true
      } else {
        if (this.walls[nTestY][nTestX] === this.charSet.wall) {
          hitWall = true

          const p = []

          for (let tx = 0; tx < 2; tx++) {
            for (let ty = 0; ty < 2; ty++) {
              const vy = nTestX + tx - player.x
              const vx = nTestY + ty - player.y
              const d = Math.hypot(vx, vy)
              const dot = (sin * vx / d) + (cos * vy / d)
              p.push([d, dot])
            }
          }

          const bound = 0.01
          const sorted = p.sort((a, b) => a[0] < b[0])

          if (Math.acos(sorted[0][1]) < bound) boundary = true
          if (Math.acos(sorted[1][1]) < bound) boundary = true
          if (Math.acos(sorted[2][1]) < bound) boundary = true
        }
      }
    }

    // remove fisheye effect
    distance *= Math.cos(angle - player.direction)

    return { distance, boundary }
  }
}