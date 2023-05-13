// @ts-nocheck
// Shooting Range

const sight = document.getElementById("sight")
const ctx = sight.getContext("2d")

let click = []
let shot = []
let pointer = []

let requestId 
let gameFrames = 0

let animeFlag = true
let targetDown = false
let huntCount = 0
let duckSpawns = 0
let score = 0

function clearCanvas() {
  ctx.clearRect(0, 0, sight.width, sight.length)
}

function printData() { 

  const scoreInfo = `Score: ${score}`
  ctx.font = "30px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(
    scoreInfo,
    (sight.width / 2) - (ctx.measureText(scoreInfo).width / 2),
    28
  )

  const levelInfo = `Level: ${world.level} 
  ${world.name} (${world.gravity}m/s^2)`
  ctx.font = "16px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(
    levelInfo,
    sight.width / 2 - ctx.measureText(levelInfo).width / 2,
    50
  )
  
  ctx.font = "16px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(`Rifle: ${sniper.rifle.name}`, 4, 16)
  ctx.fillText(`Cal: ${sniper.rifle.bulletCaliber}`, 4, 32)
}

function gameOver() {
  if (sniper.ammo <= 0 || (huntCount < 3 && duckSpawns === 10)) {
    ctx.fillStyle = "black"
    ctx.globalAlpha = 0.8
    ctx.fillRect(0, 0, sight.width, sight.height)

    const loseGame = 'Game Over'
    ctx.font = "80px Arial"
    ctx.fillStyle = "white"
    ctx.fillText(
      loseGame,
      sight.width / 2 - ctx.measureText(loseGame).width / 2,
      sight.height / 2
    )

    const finalScore = `Final score: ${score}`
    ctx.font = "30px Arial"
    ctx.fillText(
      finalScore,
      sight.width / 2 - ctx.measureText(finalScore).width / 2,
      sight.height / 2 + 40
    )
    requestId = cancelAnimationFrame(requestId)
  }
}

function levelControl() {
  if (world.level < 40) {
    if (sniper.ammo >= 0 && huntCount >= 3) {
      world.level += 1
      duckSpawns = 0
      huntCount = 0

      // Rifle switch per level
      switch (true) {
        case world.level <= 15:
          rifle.switchRifle(0)
          break
        case world.level <= 30:
          rifle.switchRifle(1)
          break
        default:
          rifle.switchRifle(2)
          break
      }

      sniper.ammo = 5
      world.createWorld()
      spawnArea = new TargetSpawnArea(world)
      spawnArea.draw()
      
      duck = new Duck(spawnArea)
      duck.distance = world.distance
      duck.randomSpawn()
      duck.draw()
    }
  } else if (world.level >= 40){
    world.level = 40
    duck.randomSpawn()
    duck.draw()
  } 
}

function duckAnimation() {
  if (!targetDown && duck.y < sight.height) {
    duck.position = 4
    if (animeFlag && gameFrames % 8 === 0) {
      duck.animate++
    }
    if (duck.animate === 3) {
      animeFlag = false
    }
    if (!animeFlag && gameFrames % 8 === 0) {
      // Bug fix - Duck not visible
      duck.animate <= 0 ? duck.animate = 0 : duck.animate--

    }
    if (!animeFlag && duck.animate === 0) {
      animeFlag = true
    }
    
    !duck.reverse ? duck.x += world.ratio * 5 : duck.x -= world.ratio * 5 // Duck x-axis movement
  }

  if (targetDown) {
    duck.x = duck.x
    duck.position = 8
    
    if (duck.y + duck.height < spawnArea.spawnH + spawnArea.spawnY) {
      duck.animate = 0
    } else {
      duck.animate = 1
      bang.x = - 30
      bang.y = - 30
    }

    if (duck.y < sight.height) { // falldown of the duck after being shot
      duck.y += (4 * world.gravity) / 10
      hit.y += (4 * world.gravity) / 10
    } else { // if the target falls down away from sight appears randomly at the left
      wind.randomWind()
      levelControl()
      targetDown = false
      duck.randomSpawn()
      duck.draw()
    }
  }

  // Re-spawn duck if it exits the spawn area width
  if (
    (duck.x > sight.width && !duck.reverse) ||
    (duck.x + duck.width < 0 && duck.reverse)
  ) {
    duck.randomSpawn()
    duck.draw()
    duckSpawns++ // Condition to lose
    wind.randomWind()
  } 
}

function ammoAnimation() {
  switch (sniper.ammo) {
    case 5:
      sniper.animate = 0
      return
    case 4:
      sniper.animate = 1
      return
    case 3:
      sniper.animate = 2
      return
    case 2:
      sniper.animate = 3
      return
    case 1:
      sniper.animate = 4
      return
    case 0:
      sniper.animate = 5
      return
    default:
      sniper.animate = 5
      return
  }
}

function animateDistance() {
  const touchPointX = (sight.width / 2 - (sight.width * world.ratio) / 2) / 1.7

  ctx.strokeStyle = "white"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, sight.height)
  ctx.lineTo(touchPointX, spawnArea.spawnY + spawnArea.spawnH)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(touchPointX, spawnArea.spawnY + spawnArea.spawnH)
  ctx.lineTo(touchPointX - 30, spawnArea.spawnY + spawnArea.spawnH + 17)
  ctx.lineTo(touchPointX - 5, spawnArea.spawnY + spawnArea.spawnH + 17)
  ctx.closePath()
  ctx.fillStyle = "white"
  ctx.fill()
  
  ctx.font = "14px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(`${duck.distance.toFixed()}m`, 20, sight.height - 5)
}

function gameEngine() {
  gameFrames++

  clearCanvas()
  duckAnimation()
  spawnArea.draw()
  hit.draw()
  duck.draw()
  animateDistance()
  bang.draw()

  gunSight.draw()
  sniper.drawAmmo()
  ammoAnimation()
  windRose.draw(wind, spawnArea)
  printData()

  gameOver()

  if (requestId) {
    requestAnimationFrame(gameEngine)
  }
}

function startGame() {
  if (!requestId) {
    requestId = requestAnimationFrame(gameEngine)
  }
}

window.onload = () => {
  startGame()
}