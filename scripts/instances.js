const world = new World()
world.level = 0
world.createWorld()
console.log(world)

const spawnArea = new TargetSpawnArea(world.ratio)

const rifle = new SniperGun()
const sniper = new Sniper(rifle)

const duck = new Duck(spawnArea)
duck.randomSpawn()
duck.distance = world.distance

const wind = new Wind() // z-axis affects y-axis
wind.randomWind()
// wind.xSpeed = 10
// wind.ySpeed = 10
// wind.zSpeed = 10

const bang = new Bang(click)
const hit = new Hit(shot)
