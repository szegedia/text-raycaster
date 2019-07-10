import controls from './controls'
import Player from './player'
import Map from './map'
import Camera from './camera'
import Minimap from './minimap'

function Game () {
  const map = new Map()
  const player = new Player(2, 1, Math.PI * 0.5)
  const camera = new Camera(map, player)
  const minimap = new Minimap(map, player, camera)
  const fps = 30
  
  function loop () {
    let lastTime = null

    requestAnimationFrame(function animate (time) {
      requestAnimationFrame(animate)
      const delta = time - lastTime
      const tick = (time - lastTime) / 1000
      lastTime = time
  
      if (delta > lastTime % (1000 / fps)) {
        player.update(controls, map, tick)
        camera.render(player, map)
        minimap.update()
      }
    })
  }
  
  loop()
}

document.addEventListener('DOMContentLoaded', () => new Game())
