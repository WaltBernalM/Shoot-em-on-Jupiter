// @ts-nocheck
// Shooting Range

const sight = document.getElementById("sight")
const ctx = sight.getContext("2d")

let ratio = 0.4
let click = []
let shot = []
let requestId 
let gameFrames = 0

let level = 0
let animeFlag = true
let targetDown = false
let huntCount = 0
let duckSpawns = 0

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
    world data = ${world.ratio}`
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
    duck.x += world.ratio * 10
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

    duck.draw()
    hit.draw()

    if (duck.y < sight.height) { // falldown of the duck after being shot
      duck.y += 3
      hit.y += 3
    } else { // if the target falls down away from sight appears randomly at the left
      targetDown = false
      wind.randomWind()
      duck.randomSpawn()
    }
  }

  // Re-spawn duck if it exits the spawn area width
  if (duck.x > sight.width) {
    duck.randomSpawn()
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

function gameEngine() {
  gameFrames++
  // console.log("gameFrames", gameFrames)

  clearCanvas()
  spawnArea.draw()
  
  printData()
  hit.draw()
  duck.draw()
  duckAnimation()
  bang.draw()
  sniper.drawAmmo()
  ammoAnimation()

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