export default class Minimap {
  constructor (map, player) {
    this.map = map
    this.player = player
    this.playerChar = 'P'
    this.cache = {
      x: null,
      y: null
    }
    this.shades = {
      0: '.',
      1: '#'
    }

    this.init()
  }

  init () {
    this.el = document.createElement('pre')
    this.el.classList.add('minimap')

    this.compass = document.createElement('div')
    this.compass.classList.add('compass')

    document.body.appendChild(this.el)
    document.body.appendChild(this.compass)
  }

  getPlayerPos () {
    return {
      x: Math.floor(this.player.x),
      y: Math.floor(this.player.y)
    }
  }

  updateCompass () {
    const angle = this.player.direction

    this.compass.style.transform = `rotate(${angle}rad)`
  }

  update () {
    this.updateCompass()
    const { x, y } = this.getPlayerPos()
    const buffer = this.map.walls.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (x === colIndex && y === rowIndex) {
          return this.playerChar
        }

        return this.shades[col]
      }).join('')
    }).join('\n')

    this.el.innerHTML = buffer
  }
}
