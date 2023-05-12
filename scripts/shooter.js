// @ts-nocheck
// Shooting Range

const sight = document.getElementById("sight")
const ctx = sight.getContext("2d")

let click = []
let shot = []
let requestId 
let gameFrames = 0

let animeFlag = true
let targetDown = false
let huntCount = 0
let duckSpawns = 0
let score = 0

const rifles = [
  {
    name: "SIG SSG 3000",
    range: 900,
    bulletSpeed: 800,
    bulletCaliber: "7.62x51mm",
    bulletFrontalArea: 0.000048,
    buletMass: 0.0098,
  },
  {
    name: "OTs-03 Dragunov SVU",
    range: 1200, // maximum range or rifle
    bulletSpeed: 830, // m/s
    bulletCaliber: "7.62x51mm",
    bulletFrontalArea: 0.000048,
    bulletMass: 0.0098, // kg
  },
  {
    name: "Barrett M82",
    range: 1800,
    bulletSpeed: 853,
    bulletCaliber: "50 BMG",
    bulletFrontalArea: 0.000129,
    buletMass: 0.042,
  },
]

function clearCanvas() {
  ctx.clearRect(0, 0, sight.width, sight.length)
}

function printData() { 
  document.querySelector(
    "#wind-data"
  ).innerHTML = `Wind = [${wind.xSpeed}m/s, ${wind.ySpeed}m/s, ${wind.zSpeed}m/s]; Cd = ${wind.Cd}; Rho = ${wind.rho}kg/m^3`

  document.querySelector(
    "#target-data"
  ).innerHTML = `Target = [${duck.x.toFixed()}, ${duck.y} ,${duck.distance.toFixed()}]`

  document.querySelector(
    "#rifle-data"
  ).innerHTML = `Bullet: Speed = ${sniper.rifle.bulletSpeed}m/s; Mass = ${sniper.rifle.bulletMass}kg; Front Area = ${sniper.rifle.bulletFrontalArea} m^2`

  document.querySelector(
    "#sniper-data"
  ).innerHTML = `User click coord = [${sniper.x}, ${sniper.y}]; ammo = ${sniper.ammo}`

  document.querySelector(
      "#frames"
  ).innerHTML = `game frames = ${gameFrames};
    target down = ${targetDown};
    duck spawns = ${duckSpawns};
    hunt count = ${huntCount};
    world ratio = ${world.ratio.toFixed(2)}; level = ${world.level}`
  
  ctx.font = "20px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(`Score: ${score}`, sight.width / 2 - 40, 20)

  ctx.font = "14px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(`Level: ${world.level + 1}`, sight.width / 2 - 25, 40)
}

function gameOver() {
  if (sniper.ammo <= 0 || (huntCount < 3 && duckSpawns === 10)) {
    ctx.fillStyle = "black"
    ctx.globalAlpha = 0.8
    ctx.fillRect(0, 0, sight.width, sight.height)

    ctx.font = "80px Arial"
    ctx.fillStyle = "white"
    ctx.fillText('Game Over', sight.width / 2 - 200, sight.height / 2)

    ctx.font = "30px Arial"
    ctx.fillText(`Final score: ${score}`, sight.width / 2 - 90, sight.height / 2 + 40)
    requestId = cancelAnimationFrame(requestId)
  }
}

function levelControl() {
    if (world.level < 7) {
      if (sniper.ammo >= 0 && huntCount >= 3) {
        world.level += 1
        duckSpawns = 0
        huntCount = 0
        sniper.ammo = 5

        world.createWorld()
        spawnArea = new TargetSpawnArea(world.ratio)
        duck = new Duck(spawnArea)
        duck.distance = world.distance
        clearCanvas()
        spawnArea.draw()
        duck.randomSpawn()
        duck.draw()
      }
    } else {
      world.level = 7
    }
}

function duckAnimation() {
  if (!targetDown) {
    duck.position = 4
    if (animeFlag && gameFrames % 8 === 0) {
      duck.animate++
    }
    if (duck.animate === 3) {
      animeFlag = false
    }
    if (!animeFlag && gameFrames % 8 === 0) {
      duck.animate--
    }
    if (!animeFlag && duck.animate === 0) {
      animeFlag = true
    }
    duck.x += world.ratio * 5 // movement of duck
  } else if (targetDown) {
    duck.x = duck.x
    duck.position = 8
    
    if (duck.y + duck.height < spawnArea.spawnH + spawnArea.spawnY) {
      duck.animate = 0
    } else {
      duck.animate = 1
      bang.x = - 30
      bang.y = - 30
    }

    clearCanvas()
    duck.draw()
    hit.draw()

    if (duck.y < sight.height) { // falldown of the duck after being shot
      duck.y += 3
      hit.y += 3
    } else { // if the target falls down away from sight appears randomly at the left
      targetDown = false
      wind.randomWind()
      levelControl()
      duck.randomSpawn()
    }
  }

  // Re-spawn duck if it exits the spawn area width
  if (duck.x > sight.width) {
    duck.randomSpawn()
    duckSpawns++
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
  ctx.lineTo(touchPointX - 12, spawnArea.spawnY + spawnArea.spawnH + 17)
  ctx.closePath()
  ctx.fillStyle = "white"
  ctx.fill()
  
  ctx.font = "14px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(`${duck.distance.toFixed()}m`, 20, sight.height - 5)
}

function gameEngine() {
  gameFrames++

  duckAnimation()
  clearCanvas()
  spawnArea.draw()
  printData()

  sniper.drawAmmo()
  ammoAnimation()
  hit.draw()
  duck.draw()
  bang.draw()
  animateDistance()

  windRose.draw(wind, spawnArea)

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