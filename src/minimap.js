export default class Minimap {
  constructor (map, player, camera) {
    this.map = map
    this.player = player
    this.charSet = {
      player: 'P',
      wall: '#',
      floor: '.',
      sight: ' '
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

  update () {
    const { x: playerX, y: playerY } = this.getPlayerPos()
    const buffer = this.map.walls.map((row, rowIndex) => {
      return row.split('').map((col, colIndex) => {
        // player
        if (colIndex === playerX && rowIndex === playerY) {
          return this.charSet.player
        }

        // wall
        if (col === this.map.charSet.wall) {
          return this.charSet.wall
        }

        // eyesight
        if (this.map.eyeshot[rowIndex] && this.map.eyeshot[rowIndex][colIndex]) {
          return this.charSet.sight
        }
        
        // floor
        return this.charSet.floor
      }).join('')
    }).join('\n')

    this.el.innerHTML = buffer
  }
}
