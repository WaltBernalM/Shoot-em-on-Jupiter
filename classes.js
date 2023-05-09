// @ts-nocheck
class TargetSpawnArea {
  constructor(ratio) {
    this.ratio = ratio
    this.spawnW = sight.width * this.ratio
    this.spawnH = sight.height * this.ratio
    this.spawnX = sight.width / 2 - this.spawnW / 2
    this.spawnY = sight.height / 2 - this.spawnH / 2
  }

  draw() {
    ctx.globalAlpha = 0.2
    ctx.fillStyle = "yellow"
    ctx.fillRect(this.spawnX, this.spawnY, this.spawnW, this.spawnH)
    
    ctx.globalAlpha = 0.3
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(this.spawnX, this.spawnY)
    ctx.moveTo(sight.width, 0)
    ctx.lineTo(this.spawnX + this.spawnW, this.spawnY)
    ctx.moveTo(0, sight.height)
    ctx.lineTo(this.spawnX, this.spawnY + this.spawnH)
    ctx.moveTo(sight.width, sight.height)
    ctx.lineTo(this.spawnX + this.spawnW, this.spawnY + this.spawnH)
    ctx.stroke()
    ctx.closePath()
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

class Target {
  constructor() {
    this.x = 0 // m, lateral position of the target
    this.y = 0 // m, height of the target
    this.distance = 20 // m, distance to the target from the sniper position (z axis)

    this.l = 20
    this.w = 20
  }

  drawTarget = () => {
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.fillRect(this.x, this.y, this.w, this.l)
    ctx.closePath()
  }
}

// wind.randomWind() // Creates random wind conditions (limited to axis 20m/s => vector 34m/s)
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
    const rand = () => Math.floor((Math.random() * 20) + 1) * negRand()

    this.xSpeed = rand()
    this.ySpeed = rand()
    this.zSpeed = rand()
  }
}

class Sniper {
  constructor(rifle) {
    this.x = 0 // m, position in x
    this.y = 0 // m, position in y
    this.rifle = rifle
    this.shotAngle = 90
  }
  z = 0

  shot = (wind, target) => {
    const g = 9.81 // acceleration due to gravity
    const rho = wind.rho // air density
    const Cd = wind.Cd // air drag coefficient
    const A = this.rifle.bulletFrontalArea // projectile forntal area
    const m = this.rifle.bulletMass // projectile mass
    const v0 = this.rifle.bulletSpeed // m/s, initial velocity of the bullet
    const x0 = sniper.x // initial x position
    const y0 = sniper.y // initial y position
    const z0 = sniper.z // initial z position
    const theta = (sniper.shotAngle * Math.PI) / 180 // Launch angle (radians)
    const dt = 0.000001 // s, time step

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
    while (z < target.distance) {
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
      if (y >= sightH || x >= sightW) break
    }

    if (
      x.toFixed() === target.x.toFixed() &&
      y.toFixed() === target.y.toFixed() &&
      z.toFixed() === target.distance.toFixed()
    ) {
      console.log("Target down!")
    }

    return [x, y, z, t]
  }
}