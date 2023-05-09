// @ts-nocheck
// Shooting Range

const sight = document.getElementById("sight")
const sightW = sight.getAttribute("width")
const sightH = sight.getAttribute("height")
const ctx = sight.getContext("2d")
const ratio = 0.4

let click = []
let shot = []

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

const Difficulty = [
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

const bulb = new Image()
bulb.src = "./bulb.png"
bulb.onload = () => ctx.drawImage(img, 60, 60, 40, 40)

const spawnArea = new TargetSpawnArea(ratio)
spawnArea.draw()

// function to get actual position to canvas
const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x, y]
}

const drawClick = () => {
  const img = new Image()
  img.src = "./bang-icon.jpg"
  img.onload = () => ctx.drawImage(img, click[0] - 20, click[1] - 20, 40, 40)
}

const print = (arr, color, perfect) => {
  if (perfect) {
    ctx.fillStyle = color
    ctx.fillRect(arr[0], arr[1], 5, 5)
  } else {
    const img = new Image()
    img.src = "./bullet-hole.png"
    img.onload = () => ctx.drawImage(img, arr[0] - 7, arr[1] - 7, 14, 14)
  }
}

const translateShotPos = (cursorPos) => {
  const x = cursorPos[0] * 0.4 + 240
  const y = cursorPos[1] * 0.4 + 120
  const z = cursorPos[2]
  const shotPos = [x, y, z]
  return shotPos
}

const rifle = new SniperGun()
const sniper = new Sniper(rifle)

// rifle.bulletSpeed = 800

const tar = new Target()
tar.x = 350
tar.y = 200
tar.w = 20
tar.l = 20
tar.distance = 1200
tar.drawTarget()

const wind = new Wind() // z-axis affects y-axis
wind.randomWind()

// wind.xSpeed = 20
// wind.ySpeed = 0
// wind.zSpeed = 0

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
    ).innerHTML = `User click coord = [${sniper.x}, ${sniper.y}]`
}

printData()

// Event listener to get the mouse position
sight.addEventListener("mousedown", function (e) {
  click = getCursorPosition(sight, e)
  drawClick()
  sniper.x = click[0]
  sniper.y = click[1]

  printData()

  const tShot = translateShotPos(click)
  sniper.x = Number(tShot[0].toFixed())
  sniper.y = Number(tShot[1].toFixed())
  ctx.globalAlpha = 0.2
  print(tShot, "blue", true) // Perfect shot
  ctx.globalAlpha = 1

  document.querySelector(
    "#sniper-data-trans"
  ).innerHTML = `Ideal shot = [${sniper.x}, ${sniper.y}]`

  shot = sniper.shot(wind, tar)
  print(shot, "black", false) // Shot

  document.querySelector(
    "#shot-data"
  ).innerHTML = `End shot = [${shot[0].toFixed()}, ${shot[1].toFixed()}, ${shot[2].toFixed()}] @ t = ${shot[3].toFixed(3)}s`
})
