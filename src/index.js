import controls from './controls'
import Player from './player'
import Map from './map'
import Camera from './camera'
import Minimap from './minimap'

function Game () {
  const canvasEl = document.querySelector('#canvas')
  const minimapEl = document.querySelector('#minimap')

  const player = new Player(10, 5, Math.PI * 1.4)
  const map = new Map()
  const camera = new Camera(canvasEl, player, map)
  const minimap = new Minimap(minimapEl, map, player, camera)
  const fps = 30
  
  function loop () {
    let lastTime = null

    // requestAnimationFrame(function animate (time) {
    //   const tick = (time - lastTime) / 1000

    //   player.update(controls, map, tick)
    //   camera.render(player)
    //   minimap.update()
    // })
  
    requestAnimationFrame(function animate (time) {
      requestAnimationFrame(animate)
      const delta = time - lastTime
      const tick = (time - lastTime) / 1000
      lastTime = time
  
      if (delta > lastTime % (1000 / fps)) {
        player.update(controls, map, tick)
        camera.render(player)
        minimap.update()
      }
    })
  }
  
  loop()
}

document.addEventListener('DOMContentLoaded', () => new Game())
