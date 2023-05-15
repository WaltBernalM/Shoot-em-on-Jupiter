// @ts-nocheck
class TargetSpawnArea {
  constructor(world) {
    this.ratio = world.ratio
    this.spawnW = sight.width //* this.ratio
    this.spawnH = sight.height * this.ratio
    this.spawnX = 0//sight.width / 2 - this.spawnW / 2
    this.spawnY = sight.height / 2 - this.spawnH / 2
    
    this.img = new Image()
    this.img.src = "./Images/background.jpg"
    this.img.onload = () => { this.draw() }
    
    this.backgroundW = sight.width + sight.width / (1 - this.ratio)
    this.backgroundH = sight.height + sight.height / (1 - this.ratio)
    this.backgroundX = sight.width / 2 - this.backgroundW / 2

    this.zoom = -0.452 * this.ratio**3 + 0.0943* this.ratio**2 + 0.3511 * this.ratio + 1.2743
    this.backgroundY = (sight.height / 2) - this.backgroundH / (this.zoom)
  }

  draw() {
    ctx.drawImage(
      this.img,
      this.backgroundX,
      this.backgroundY,
      this.backgroundW,
      this.backgroundH
    )

    
    switch (true) {
      case world.name === "Earth":
        ctx.globalAlpha = 0.3
        ctx.fillStyle = "yellow"
        break
      case world.name === "Saturn":
        ctx.globalAlpha = 0.4
        ctx.fillStyle = "yellow"
        break
      case world.name === "Neptune":
        ctx.globalAlpha = 0.4
        ctx.fillStyle = "white"
        break
      case world.name === "Jupiter":
        ctx.globalAlpha = 0.5
        ctx.fillStyle = "red"
        break
    }
    ctx.fillRect(0, 0, sight.width, sight.height)
    ctx.globalAlpha = 1

    /*
    ctx.globalAlpha = 0.1
    ctx.fillStyle = "black"
    ctx.fillRect(
      sight.width / 2 - (sight.width * this.ratio) / 2,
      this.spawnY,
      sight.width * this.ratio,
      this.spawnH
    )
    ctx.globalAlpha = 1
    */
  }
}

class SniperGun {
  constructor() {
    this.arsenal = [
      {
        name: "SIG SSG 3000",
        range: 900,
        bulletSpeed: 800,
        bulletCaliber: "7.62x51mm",
        bulletFrontalArea: 0.000048,
        bulletMass: 0.0098,
      },
      {
        name: "Dragunov SVU",
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
        bulletMass: 0.042,
      },
    ]
  }

  switchRifle(pos) {
    pos < 0
      ? pos = 0
      : pos > 2
        ? pos = 2
        : void (0)
    this.name = this.arsenal[pos].name
    this.range = this.arsenal[pos].range
    this.bulletSpeed = this.arsenal[pos].bulletSpeed
    this.bulletCaliber = this.arsenal[pos].bulletCaliber
    this.bulletFrontalArea = this.arsenal[pos].bulletFrontalArea
    this.bulletMass = this.arsenal[pos].bulletMass
  }
}

class Duck {
  constructor(spawnArea) {
    this.distance = 0 // m, distance to the Duck from the sniper position (z axis)
    this.height = spawnArea.spawnH / 4
    this.width = spawnArea.spawnW / (8 / world.ratio)
    this.x = 0 // m, lateral position of the Duck
    this.y = 0 // m, height of the Duck
    this.animate = 0 // Animation sequence value
    this.position = 0 // select position of the sprite
    this.flyDuck = new Image()
    this.flyDuck.src = "./Images/duckhunt.png" // 375 x 267
    this.flyDuck.onload = () => {
      this.draw()
    }
    this.reverse = false
  }

  randomSpawn() {
    this.reverse = Math.floor(Math.random() * 10) % 2 === 0 ? true : false

    if (!this.reverse) { // Spawn tuck to fly from left to right
      this.x = -this.width * 2
      this.y = Math.floor(
        Math.random() * (spawnArea.spawnH - this.height) + spawnArea.spawnY
      )
    } else if (this.reverse) { //
      this.x = sight.width  + this.width
      this.y = Math.floor(
        Math.random() * (spawnArea.spawnH - this.height) + spawnArea.spawnY
      )
    }
  }


  draw() {
    if (!this.reverse) { // Draw tuck to fly from left to right
      ctx.globalAlpha = 1
      ctx.drawImage(
        this.flyDuck,
        (this.animate * 375) / 9,
        (this.position * 267) / 9.2068965,
        35,
        35,
        this.x,
        this.y,
        this.width,
        this.height
      )
    } else if (this.reverse) { // Draw tuck to fly from right to left
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(
        this.flyDuck,
        (this.animate * 375) / 9,
        (this.position * 267) / 9.2068965,
        35,
        35,
        -this.x - this.width, // Adjust x and width to match the negative scale
        this.y,
        this.width,
        this.height
      )
      ctx.restore()
    }

  }
}

class Wind {
  constructor() {
    this.xSpeed = 0 // wind speed
    this.ySpeed = 0 // wind speed
    this.zSpeed = 0 // wind speed
    this.Cd = 0.4 // Coefficient of drag
    this.rho = 1.225 // kg/m^3, air density
  }

  randomWind = () => {
    const negRand = () => (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
    const rand = () => Math.floor((Math.random() * 5) + 0.1) * negRand()
    this.xSpeed = rand()
    this.ySpeed = rand()
    this.zSpeed = rand()
  }
}

class WindRose {
  constructor() { 
    this.offset = sight.width * 0.07
    this.x0 = sight.width - this.offset * 1.2
    this.y0 = sight.height - this.offset * 1.5
    this.theta = 0
    this.mult = this.offset * 0.1875
    this.rad = this.offset + this.offset * 0.1
  }

  draw(wind, spawnArea) {
    this.xSpeed = wind.xSpeed
    this.ySpeed = wind.ySpeed
    this.zSpeed = wind.zSpeed

    this.theta = Math.tanh(
      sight.width - spawnArea.spawnH - spawnArea.spawnX,
      sight.height - spawnArea.spawnH - spawnArea.spawnY
    )

    //Skull
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "orange"
    ctx.beginPath()
    ctx.arc(this.x0, this.y0, this.rad, 0, Math.PI * 2)
    ctx.fillRect(this.x0 - this.rad, this.y0, this.x0, this.y0)
    ctx.fillRect(this.x0, this.y0 - this.rad, this.x0, this.y0)
    ctx.closePath()
    ctx.fill()
    
    ctx.globalAlpha = 0.6
    ctx.strokeStyle = "black"
    ctx.lineWidth = 6
    ctx.beginPath()
    // x-axis
    ctx.moveTo(this.x0 - this.offset * 0.98, this.y0)
    ctx.lineTo(this.x0 + this.offset * 0.98, this.y0)
    // y-axis
    ctx.moveTo(this.x0, this.y0 - this.offset * 0.98)
    ctx.lineTo(this.x0, this.y0 + this.offset * 0.98)
    // z-axis
    ctx.moveTo(
      this.x0 - this.offset / 1.5,
      this.y0 - this.offset / 2.5
    )
    ctx.lineTo(this.x0 + this.offset / 1.5, this.y0 + this.offset / 2.5)
    ctx.closePath()
    ctx.stroke()
    ctx.globalAlpha = 1

    // Axis
    ctx.strokeStyle = "white"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(this.x0, this.y0)
    ctx.lineTo(this.x0 + wind.xSpeed * this.mult, this.y0)
    ctx.moveTo(this.x0, this.y0)
    ctx.lineTo(this.x0, this.y0 + -wind.ySpeed * this.mult)
    ctx.moveTo(this.x0, this.y0)
    ctx.lineTo(
      this.x0 + Math.sin(this.theta) * -this.zSpeed * this.mult * 0.66,
      this.y0 + Math.cos(this.theta) * -this.zSpeed * this.mult * 0.66
    )
    ctx.closePath()
    ctx.stroke()

    const windTitle = "WIND"
    const windVectors = "[x, y, z]"
    const windInfo = `[${wind.xSpeed}, ${wind.ySpeed}, ${wind.zSpeed}]`
    ctx.font = "10px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText(
      windTitle,
      this.x0 + (sight.width - this.x0) / 2 - ctx.measureText(windTitle).width / 2 + ctx.lineWidth,
      this.y0 - this.rad + 12
    )
    ctx.fillText(
      windInfo,
      this.x0 - ctx.measureText(windInfo).width / 2,
      this.y0 + this.rad + 10
    )
    ctx.font = "9px Verdana"
    ctx.fillText(
      windVectors,
      this.x0 +
        (sight.width - this.x0) / 2 -
        ctx.measureText(windTitle).width / 2 - ctx.lineWidth,
      this.y0 - this.rad + 24
    )
  }
}

class Sniper {
  constructor(sniperGun) {
    this.x = 0 // m, position in x
    this.y = 0 // m, position in y
    this.z = 0
    this.rifle = sniperGun
    this.shotAngle = 90
    this.ammo = 5
    
    this.img = new Image()
    this.imgW = 70
    this.imgH = 100
    this.imgX = sight.width - this.imgW
    this.imgY = 0
    this.img.src = "./Images/ammo-8-bit-sprite.png"
    this.img.onload = () => {
      this.drawAmmo()
    }
  }

  drawAmmo() {
    const x = 1035
    const y = 241
    
    ctx.globalAlpha = 1
    ctx.drawImage( // 1035 x 41
      this.img,
      (this.animate * x) / 6,
      0,
      x / 6,
      y,
      this.imgX,
      this.imgY,
      this.imgW,
      this.imgH
    )
  }

  // Custom 3D Parabolic shot engine (where the magi happens)
  // Emulates part of a real life shot/
  shot(resistance, target, world) {
    let g = world.gravity // acceleration due to gravity
    const rho = resistance.rho // air density
    const Cd = resistance.Cd // air drag coefficient
    const A = this.rifle.bulletFrontalArea // projectile forntal area
    const m = this.rifle.bulletMass // projectile mass
    const v0 = this.rifle.bulletSpeed // m/s, initial velocity of the bullet
    const x0 = this.x // initial x position
    const y0 = this.y // initial y position
    const z0 = this.z // initial z position
    const theta = (this.shotAngle * Math.PI) / 180 // Launch angle (radians)
    const dt = 0.001 // s, time step

    // Variables
    let x = x0 // projectile x-axis position
    let y = y0 // projectile y-axis position
    let z = z0 // projectile z-axis position

    let vx = 0 // projectile x-axis velocity
    let vy = v0 * Math.cos(theta) // projectile y-axis velocity
    let vz = v0 * Math.sin(theta) // projectile z-axis velocity

    let ax = 0 // projectile x-axis acceleration
    let ay = 0 // projectile y-axis acceleration
    let az = 0 // projectile z-axis acceleration
    let t = 0 // projectile time elapsed

    // Simulation loop
    while (z < target.distance) {
      // Calculate wind variables
      const v = Math.sqrt(
        resistance.xSpeed ** 2 + resistance.ySpeed ** 2 + resistance.zSpeed ** 2
      )
      const Fd = v === 0 ? 0 : 0.5 * rho * v ** 2 * Cd * A
      const axr = v === 0 ? 0 : (-Fd * vx + resistance.xSpeed) / (m * v)
      const ayr = v === 0 ? 0 : (-Fd * vy + resistance.ySpeed) / (m * v)
      const azr = v === 0 ? 0 : (-Fd * vz + resistance.zSpeed) / (m * v)

      // Calculate acceleration
      ax += axr * dt
      ay += (-ayr + (g * 10)) * dt // g * 10 is an adjustment to approach reality values
      az += azr * dt

      // Update velocity and position
      vx += ax * dt
      vy += ay * dt
      vz += az * dt
      x += vx * dt
      y += vy * dt
      z += vz * dt
      t += dt

      if (y <= 0 || x <= 0) break //  if the projectile exit the plane break the loop
      if (y >= sight.height || x >= sight.width) break
    }

    return [x, y, z, t]
  }
}

class Hit {
  constructor(shot) {
    this.x = shot[0]
    this.y = shot[1]
    this.width = 20
    this.height = 20
    this.bulletHole = new Image()
    this.bulletHole.src = './Images/bullet-hole.png'
    this.bulletHole.onload = () => {
      this.draw()
    }
    this.hit = new Image()
    this.hit.src = './Images/shot-icon.jpg'
    this.hit.onload = () => {
      this.draw()
    }
  }

  draw() {
    if (this.y < spawnArea.spawnY + spawnArea.spawnH) { // only draws at "wall"
      if (targetDown) {
        this.width = 40
        this.height = 40
        ctx.drawImage(
          this.hit,
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        )
      } else {
        this.width = 20
        this.height = 20
        ctx.drawImage(
          this.bulletHole,
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        )
      }
    }
  }
}

class Bang {
  constructor(click) {
    this.x = click[0]
    this.y = click[1]
    this.width = sight.width * 0.075
    this.height = sight.height * 0.15
    this.img = new Image()
    this.img.src = './Images/bang-icon.png'
    this.img.onload = () => {
      this.draw()
    }
  }

  draw() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(
      this.img,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    )
    ctx.globalAlpha = 1
  }
}

class World {
  constructor() { 
    this.level = 1
    this.distance = 0
    this.ratio = 0
    this.distance = 0
    this.name = 'Earth'
    this.gravity = 9.8
    this.maxDis = 0.815
    this.minDis = 0.765
  }

  createWorld() {
    const randomRatio = (min, max) =>  Math.random() * (max- min) +min
    const distancePerRatio = (r) => -2000 * r + 2000

    if (this.level <= 30) {
      switch (true) {
        case this.level % 3 === 1:
          this.name = "Earth"
          this.gravity = 9.8
          this.maxDis = Number((this.maxDis - 0.015).toFixed(3))
          this.minDis = Number((this.minDis - 0.015).toFixed(3))
          this.ratio = randomRatio(this.minDis, this.maxDis)
          this.distance = distancePerRatio(this.ratio)
          break
        case this.level % 3 === 2:
          this.name = "Saturn"
          this.gravity = 10.44
          this.maxDis = Number((this.maxDis - 0.015).toFixed(3))
          this.minDis = Number((this.minDis - 0.015).toFixed(3))
          this.ratio = randomRatio(this.minDis, this.maxDis)
          this.distance = distancePerRatio(this.ratio)
          break
        case this.level % 3 === 0:
          this.name = "Neptune"
          this.gravity = 11.15
          this.maxDis = Number((this.maxDis - 0.02).toFixed(3))
          this.minDis = Number((this.minDis - 0.02).toFixed(3))
          this.ratio = randomRatio(this.minDis, this.maxDis)
          this.distance = distancePerRatio(this.ratio)
          break
      }
    } else if (this.level === 31){
      this.name = "Jupiter"
      this.gravity = 24.79
      this.maxDis = 0.8
      this.minDis = 0.75
      this.ratio = randomRatio(this.minDis, this.maxDis)
      this.distance = distancePerRatio(this.ratio)
    } else {
      this.maxDis -= 0.05
      this.minDis -= 0.05
      this.ratio = randomRatio(this.minDis, this.maxDis)
      this.distance = distancePerRatio(this.ratio)
    }
  }
}

class Sight {
  constructor() {
    this.rad = sight.width * 0.05
    this.lineWidth = 5
  }

  draw() {
    const translateShotPos = (cursorPos) => {
      const x =
        cursorPos[0] * world.ratio + (sight.width * (1 - world.ratio)) / 2
      const y =
        cursorPos[1] * world.ratio + (sight.height * (1 - world.ratio)) / 2
      // const z = cursorPos[2]
      const shotPos = [x, y]
      return shotPos
    }

    const laser = translateShotPos(pointer)

    ctx.globalAlpha = 0.5

    // Laser sight 
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.arc(laser[0], laser[1], this.rad / 7, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    ctx.globalAlpha = 0.5

    ctx.beginPath()
    ctx.lineWidth = this.lineWidth / 3
    ctx.arc(pointer[0], pointer[1], this.rad - 3, 0, Math.PI * 2)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(pointer[0], pointer[1], this.rad + 3, 0, Math.PI * 2)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    // ctx.strokeStyle = "black"
    ctx.lineWidth = this.lineWidth * 2

    ctx.moveTo(pointer[0], pointer[1] + this.rad / 2 - this.lineWidth / 2)
    ctx.lineTo(pointer[0], pointer[1] + this.rad * 1.5 + this.lineWidth / 2)
    ctx.moveTo(pointer[0], pointer[1] - this.rad / 2 + this.lineWidth / 2)
    ctx.lineTo(pointer[0], pointer[1] - this.rad * 1.5 - this.lineWidth / 2)

    ctx.moveTo(pointer[0] + (this.rad / 2) - (this.lineWidth / 2), pointer[1])
    ctx.lineTo(pointer[0] + this.rad * 1.5 + this.lineWidth / 2, pointer[1])
    ctx.moveTo(pointer[0] - (this.rad / 2) + (this.lineWidth / 2), pointer[1])
    ctx.lineTo(pointer[0] - this.rad * 1.5 - this.lineWidth / 2, pointer[1])
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.lineWidth = this.lineWidth
    ctx.arc(pointer[0], pointer[1], this.rad, 0, Math.PI * 2)

    ctx.moveTo(pointer[0], pointer[1] + this.rad / 2)
    ctx.lineTo(pointer[0], pointer[1] + this.rad * 1.5)
    ctx.moveTo(pointer[0], pointer[1] - this.rad / 2)
    ctx.lineTo(pointer[0], pointer[1] - this.rad * 1.5)

    ctx.moveTo(pointer[0] + this.rad / 2, pointer[1])
    ctx.lineTo(pointer[0] + this.rad * 1.5, pointer[1])
    ctx.moveTo(pointer[0] - this.rad / 2, pointer[1])
    ctx.lineTo(pointer[0] - this.rad * 1.5, pointer[1])

    ctx.closePath()
    ctx.stroke()
    
    ctx.globalAlpha = 1
  }
}