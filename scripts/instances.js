
const spawnArea = new TargetSpawnArea(ratio)
const rifle = new SniperGun()
const sniper = new Sniper(rifle)

const tar = new Target(spawnArea)
tar.distance = 1000

const wind = new Wind() // z-axis affects y-axis
wind.randomWind()
// wind.xSpeed = 10
// wind.ySpeed = 10
// wind.zSpeed = 10

const bulletHole = new BulletHole(shot)

const bang = new Bang(click)