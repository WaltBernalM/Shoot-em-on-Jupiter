// @ts-nocheck
class TargetSpawnArea {
  constructor(ratio) {
    this.ratio = ratio
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
    ctx.globalAlpha = 0.3
    ctx.fillStyle = 'yellow'
    ctx.fillRect(0, 0, sight.width, sight.height)
    ctx.globalAlpha = 1

    ctx.globalAlpha = 0.3
    ctx.fillStyle = "black"
    ctx.fillRect(
      sight.width / 2 - (sight.width * this.ratio) / 2,
      this.spawnY,
      sight.width * this.ratio,
      this.spawnH
    )
    ctx.globalAlpha = 1
  }
}

class SniperGun {
  constructor() {
    this.name = "OTs-03 Dragunov SVU"
    this.range = 1300 // maximum range or rifle
    this.bulletSpeed = 800 // m/s
    this.bulletCaliber = 311 // inches
    this.bulletFrontalArea = 0.000048967
    this.bulletMass = 0.00972 // kg
  }
}

class Duck {
  constructor(spawnArea) {
    this.distance = 0 // m, distance to the Duck from the sniper position (z axis)
    this.height = spawnArea.spawnH / 3
    this.width = spawnArea.spawnW / (8 / world.ratio)
    this.x = 0//Math.floor(Math.random() * spawnArea.spawnW + spawnArea.spawnX) // m, lateral position of the Duck
    this.y = 0//spawnArea.spawnY + spawnArea.spawnH - this.height * 1 // m, height of the Duck
    this.animate = 0 // Animation sequence value
    this.position = 0 // select position of the sprite
    this.flyDuck = new Image()
    this.flyDuck.src = "./Images/duckhunt.png" // 375 x 267
    this.flyDuck.onload = () => {
      this.draw()
    }

    this.shotDuck = new Image()
    this.shotDuck.src = "./Images/duckhunt.png" // 375 x 267
  }

  randomSpawn() {
    this.x = -this.width
    this.y = Math.floor(
      (Math.random() * (spawnArea.spawnH - this.height)) + (spawnArea.spawnY)
    )
  }


  // Mirror Duck
  // ctx.save();
  // ctx.scale(-1, 1);
  // ctx.drawImage(
  // this.flyDuck,
  // (this.animate * 375) / 9,
  // (this.position * 267) / 9.2068965,
  // 35,
  // 35,
  // -this.x - this.width, // Adjust x and width to match the negative scale
  // this.y,
  // this.width,
  // this.height
  // );
  // ctx.restore();

  draw() {
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
    this.offset = 50
    this.x0 = sight.width - this.offset
    this.y0 = sight.height - this.offset
    this.theta = 0
    this.mult = this.offset * 0.1875
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
    ctx.strokeStyle = "black"
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(this.x0 - this.offset * 0.93, this.y0)
    ctx.lineTo(this.x0 + this.offset * 0.93, this.y0)
    ctx.moveTo(this.x0, this.y0 - this.offset * 0.93)
    ctx.lineTo(this.x0, this.y0 + this.offset * 0.93)
    ctx.moveTo(
      this.x0 + Math.sin(this.theta) * -(this.mult / 3) * this.mult * 1,
      this.y0 + Math.cos(this.theta) * -(this.mult / 3) * this.mult * 1
    )
    ctx.lineTo(
      this.x0 + Math.sin(this.theta) * (this.mult / 3) * this.mult * 1,
      this.y0 + Math.cos(this.theta) * (this.mult / 3) * this.mult * 1
    )
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

  }
}

class Sniper {
  constructor(rifle) {
    this.x = 0 // m, position in x
    this.y = 0 // m, position in y
    this.z = 0
    this.rifle = rifle
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

  // 3D Parabolic shot engine 
  shot(wind, Duck) {
    const g = 9.81 // acceleration due to gravity
    const rho = wind.rho // air density
    const Cd = wind.Cd // air drag coefficient
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

    let endPos = [x, y, z] // projectile end position

    const negRand = () => (Math.floor(Math.random() * 10) % 2 === 0 ? 1 : -1)
    const rand = () => Math.floor(Math.random() * 0.2) * negRand()

    // Simulation loop
    while (z < Duck.distance) {
      // Calculate wind variables
      const v = Math.sqrt(
        wind.xSpeed ** 2 + wind.ySpeed ** 2 + wind.zSpeed ** 2
      )
      const Fd = v === 0 ? 0 : 0.5 * rho * v ** 2 * Cd * A
      const axr = v === 0 ? 0 : (-Fd * vx + wind.xSpeed) / (m * v)
      const ayr = v === 0 ? 0 : (-Fd * vy + wind.ySpeed) / (m * v)
      const azr = v === 0 ? 0 : (-Fd * vz + wind.zSpeed) / (m * v)

      // Calculate acceleration
      ax += axr * dt
      ay += (-ayr + g) * dt
      az += azr * dt

      // Update velocity and position
      vx += ax * dt
      vy += ay * dt
      vz += az * dt
      x += vx * dt
      y += vy * dt
      z += vz * dt
      t += dt

      endPos = [
        Number(x.toFixed(2)),
        Number(y.toFixed(2)),
        Number(z.toFixed(2)),
      ]

      if (y <= 0 || x <= 0) break //  if the projectile exit the plane break the loop
      if (y >= sight.height || x >= sight.width) break
    }

    if (
      x.toFixed() === Duck.x.toFixed() &&
      y.toFixed() === Duck.y.toFixed() &&
      z.toFixed() === Duck.distance.toFixed()
    ) {
      console.log("Duck down!")
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
    ctx.drawImage(
      this.img,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    )
  }
}

class World {
  constructor() { 
    this.level = 0
    this.distance = 0
    this.ratio = 0
    this.distance = 0
    // this.gravity = 0
  }

  createWorld() {
    const randomRatio = (min, max) =>  Math.random() * (max- min) +min
    const distancePerRatio = (r) => -2000 * r + 2000

    switch (this.level) {
      case 0:
        this.ratio = randomRatio(0.75, 0.8)
        this.distance = distancePerRatio(this.ratio)
        return
      case 1:
        this.ratio = randomRatio(0.7, 0.75)
        this.distance = distancePerRatio(this.ratio)
        return
      case 2:
        this.ratio = randomRatio(0.65, 0.7)
        this.distance = distancePerRatio(this.ratio)
        return
      case 3:
        this.ratio = randomRatio(0.6, 0.65)
        this.distance = distancePerRatio(this.ratio)
        return
      case 4:
        this.ratio = randomRatio(0.55, 0.6)
        this.distance = distancePerRatio(this.ratio)
        return
      case 5:
        this.ratio = randomRatio(0.4, 0.55)
        this.distance = distancePerRatio(this.ratio)
        return
      case 6:
        this.ratio = randomRatio(0.35, 0.4)
        this.distance = distancePerRatio(this.ratio)
        return
      case 7:
        this.ratio = randomRatio(0.30, 0.35)
        this.distance = distancePerRatio(this.ratio)
        return
    }
  }

  // planetG = [
  //   {
  //     planet: "Earth",
  //     gravity: 9.807,
  //   },
  //   {
  //     planet: "Saturn",
  //     gravity: 10.44,
  //   },
  //   {
  //     planet: "Neptune",
  //     gravity: 11.15,
  //   },
  //   {
  //     planet: "Jupiter",
  //     gravity: 24.79,
  //   },
  //   {
  //     planet: "Sun",
  //     gravity: 274.0,
  //   },
  // ]
}
