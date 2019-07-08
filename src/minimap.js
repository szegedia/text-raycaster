export default class Minimap {
  constructor (el, map, player, camera) {
    this.el = el
    this.map = map
    this.player = player
    this.camera = camera

    this.miniPlayer = document.querySelector('#minimapPlayer')

    this.draw()
  }

  draw () {
    this.el.style.width = `${this.map.width * 10}px`
    this.el.style.height = `${this.map.height * 10}px`
  }

  update () {
    const angle = this.player.direction * (180/Math.PI)
    const pX = this.player.x * 10
    const pY = this.player.y * 10
    this.miniPlayer.style.transform = `rotate(${angle}deg)`
    this.miniPlayer.style.top = `${pY}px`
    this.miniPlayer.style.left = `${pX}px`
  }
}
