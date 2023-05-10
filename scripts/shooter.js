// @ts-nocheck
// Shooting Range

const sight = document.getElementById("sight")
const ctx = sight.getContext("2d")

let ratio = 0.5
let click = []
let shot = []
let requestId 
let gameFrames = 0
let level = 0

let animeFlag = true
let targetDown = false

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

const Level = [
  {
    planet: "Earth",
    gravity: 9.807,
  },
  {
    planet: "Saturn",
    gravity: 10.44,
  },
  {
    planet: "Neptune",
    gravity: 11.15,
  },
  {
    planet: "Jupiter",
    gravity: 24.79,
  },
  {
    planet: "Sun",
    gravity: 274.0,
  },
]

function clearCanvas() {
  const clearWidth = sight.width * ratio
  const clearHeight = sight.height * ratio
  const clearX = sight.width / 2 - clearWidth / 2
  const clearY = sight.height / 2 - clearHeight / 2
  // ctx.clearRect(0, 0, sight.width, sight.height)
  ctx.clearRect(clearX, clearY, clearWidth, clearHeight)
}

const printData = () => { 
  document.querySelector(
    "#wind-data"
  ).innerHTML = `Wind = [${wind.xSpeed}m/s, ${wind.ySpeed}m/s, ${wind.zSpeed}m/s]; Cd = ${wind.Cd}; Rho = ${wind.rho}kg/m^3`

  document.querySelector(
    "#target-data"
  ).innerHTML = `Target = [${tar.x}, ${tar.y} ,${tar.distance}]`

  document.querySelector(
    "#rifle-data"
  ).innerHTML = `Bullet: Speed = ${sniper.rifle.bulletSpeed}m/s; Mass = ${sniper.rifle.bulletMass}kg; Front Area = ${sniper.rifle.bulletFrontalArea} m^2`

  document.querySelector(
    "#sniper-data"
  ).innerHTML = `User click coord = [${sniper.x}, ${sniper.y}]; ammo = ${sniper.ammo}`

  document.querySelector(
      "#frames"
  ).innerHTML = `game frames = ${gameFrames}
    target down = ${targetDown}`
}

function targetHitted() {
  if (shot[0] > tar.x && shot[0] < tar.x + tar.width && shot[1] > tar.y && shot[1] < tar.y + tar.height) {
    targetDown = true
    return true
  } else {
    targetDown = false
    return false
  }
  
}

function duckAnimation() {
  if (!targetHitted() && !targetDown) {
    tar.position = 4
    if (animeFlag && gameFrames % 8 === 0) {
      tar.animate++
    }
    if (tar.animate === 3) {
      animeFlag = false
    }
    if (!animeFlag && gameFrames % 8 === 0) {
      tar.animate--
    }
    if (!animeFlag && tar.animate === 0) {
      animeFlag = true
    }
    tar.x += ratio * 10
  } else if (targetHitted() && targetDown) {
    tar.x = tar.x
    tar.position = 8
    tar.animate = 0
    tar.draw()
    if (tar.y < sight.height) {
      tar.y++
      shot[1] += 1
    } else {
      targetDown = false
      tar.x = -tar.width
      tar.randomSpawn()
      tar.draw()
    }
  }

  if (tar.x > sight.width) {
    tar.randomSpawn()
  }

}

function gameEngine() {
  gameFrames++
  // console.log("gameFrames", gameFrames)

  clearCanvas()
  spawnArea.draw()
  tar.draw()

  duckAnimation()

  printData()

  hit.draw()
  bang.draw()

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