import Ray from './ray'

export default class Camera {
  constructor (map, player) {
    this.map = map
    this.width = 36
    this.height = 20
    this.player = player
    this.depth = 18
    this.fov = 0.8
    this.screen = new Array(this.width * this.height)

    this.init()
  }

  init () {
    this.canvas = document.createElement('pre')
    this.canvas.classList.add('game-screen')

    document.body.append(this.canvas)
  }

  render () {
    for (let x = 0; x < this.width; x++) {
      const angle = (this.player.direction - this.fov / 2) + (x / this.width) * this.fov
      const ray = new Ray(this.map, {width: this.width, height: this.height}, this.player, angle)
      const distance = ray.distance
      // const distance = this.map.cast(this.player, this.player.direction + angle, this.depth)

      const wallheight = Math.min(this.map.height / distance * 255, this.height)
      const ceiling = this.map.height / this.height * distance
      const floor = this.height - ceiling

      for (let y = 0; y < this.height; y++) {
        const point = y * this.width + x
        if (y < ceiling) {
          // ceiling
          this.screen[point] = ' '
          
        } else if (y > ceiling && y <= floor) {
          // wall
          let shade = ' '
          const d = Math.floor(distance)
          //console.log(`col: ${x} || cell: ${y} || distance: ${d} || very close: ${this.depth / 4}, ${this.depth / 3}, ${this.depth / 2}, ${this.depth}`)
          if (d <= this.depth / 4) shade = '░'
          else if (d < this.depth / 3) shade = '▒'
          else if (d < this.depth / 2) shade = '▓'
          else if (d < this.depth) shade = '█'
          else shade = ' '

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
      if (index % this.width === 0) {
        str += `<br>`
      }

      str += el
    })

    canvas.innerHTML = str
  }
}