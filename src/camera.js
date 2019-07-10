export default class Camera {
  constructor (map, player) {
    this.map = map
    this.player = player
    this.width = 250
    this.height = 80
    this.depth = 14
    this.fov = 45 * (Math.PI  / 180)
    this.screen = new Array(this.width * this.height)
    this.charSet = {
      ceiling: ' ',
      boundary: ' ',
      wall1: '█',
      wall2: '▓',
      wall3: '▒',
      wall4: '░',
      floor1: '#',
      floor2: 'x',
      floor3: '.',
      floor4: '-'
    }

    this.init()
  }

  init () {
    this.canvas = document.createElement('div')
    this.canvas.classList.add('camera')

    document.body.append(this.canvas)
  }

  // Big thanks to [Javidx9](https://github.com/OneLoneCoder) for this simple solution
  render () {
    // reset sight
    this.map.eyeshot = []

    for (let x = 0; x < this.width; x++) {
      const angle = (this.player.direction - this.fov / 2) + (x / this.width) * this.fov
      const { distance, boundary } = this.map.cast(this.player, angle, this.depth)

      // calc ceiling and floor height
      const ceiling = (this.height / 2) - this.height / distance
      const floor = this.height - ceiling

      for (let y = 0; y < this.height; y++) {
        const cell = y * this.width + x
        let paint = ' '

        if (y <= ceiling) {
          // ceiling
          paint = this.charSet.ceiling
        } else if (y > ceiling && y <= floor) {
          // wall
          if (distance <= this.depth / 4)     paint = this.charSet.wall1 // very close
          else if (distance < this.depth / 3) paint = this.charSet.wall2
          else if (distance < this.depth / 2) paint = this.charSet.wall3
          else if (distance < this.depth)     paint = this.charSet.wall4 // far
          else paint = ' '

          if (boundary) paint = this.charSet.boundary
        } else {
          // floot
          const b = 1 - (y - this.height / 2) / (this.height / 2)

					if (b < 0.25) paint = this.charSet.floor1
					else if (b < 0.5)	 paint = this.charSet.floor2
					else if (b < 0.75) paint = this.charSet.floor3
          else if (b < 0.9)	 paint = this.charSet.floor4
          else paint = ' '
        }

        this.screen[cell] = paint
      }
    }

    this.draw()
  }

  draw () {
    const chunk = (array = [], size) => array.length ? [array.slice(0, size), ...chunk(array.slice(size), size)] : []
    const chunks = chunk(this.screen, this.width)

    // draw buffer
    this.canvas.innerHTML = chunks.map(chunk => chunk.join('')).join('<br/>')
  }
}