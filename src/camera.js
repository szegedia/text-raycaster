export default class Camera {
  constructor (canvas, player, map) {
    this.canvas = canvas
    this.map = map
    this.resolution = 320
    this.spacing = this.map.width / this.resolution;
    this.depth = 14
    this.fov = 0.8
    this.screen = new Array(this.map.width * this.map.height)

    this.debugger = document.querySelector('#debugger')
    this.canvas = document.querySelector('#hitbox')
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#ff0000'
  }

  render (player) {
    for (let x = 0; x < this.map.width; x++) {
      const angle = (player.direction - this.fov / 2) + (x / this.map.width) * this.fov
      
      let hitWall = false
      let distance = 0

      const eyeX = Math.cos(angle)
      const eyeY = Math.sin(angle)

      this.ctx.clearRect(0, 0, 400, 300)
      this.ctx.beginPath()

      while (!hitWall && distance < this.depth) {
        distance += 0.1

        const testX = Math.floor(player.x + eyeX * distance)
        const testY = Math.floor(player.y + eyeY * distance)

        if (testX < 0 || testX >= this.map.width || testY < 0 || testY >= this.map.height) {
          hitWall = true
          distance = this.depth
        } else {
          if (this.map.walls[testY * this.map.width + testX] !== 0) {
            hitWall = true
          }
        }

        const posx = player.x * 10 + 10
        const posy = player.y * 10 + 10

        this.debugger.innerHTML = `${angle}, ${angle + this.fov / 2}, ${angle - this.fov / 2}`

        this.ctx.arc(posx, posy, 50, angle + this.fov / 2, angle - this.fov / 2, true);
        this.ctx.fillRect(testX * 10, testY * 10, 1, 1)
      }

      this.ctx.stroke()
      distance *= Math.cos(angle)
      const ceiling = (this.map.height / 2) - (this.map.height / distance)
      const floor = this.map.height - ceiling

      for (let y = 0; y < this.map.height; y++) {
        const point = y * this.map.width + x
        if (y < ceiling) {
          // ceiling
          this.screen[point] = ' '
          
        } else if (y > ceiling && y <= floor) {
          let shade = ' '
          // wall
          if (distance < this.depth / 4) shade = '█'
          else if (distance < this.depth / 3) shade = '▓'
          else if (distance < this.depth / 2) shade = '▒'
          else if (distance < this.depth) shade = '░'

          this.screen[point] = shade
        } else {
          // floor
          this.screen[point] = ' '
        }
      }
    }

    this.draw()
  }

  draw () {
    let str = ``
    this.screen.forEach((el, index) => {
      if (index % this.map.width === 0) {
        str += `<br>`
      }

      str += el
    })

    canvas.innerHTML = str
  }
}