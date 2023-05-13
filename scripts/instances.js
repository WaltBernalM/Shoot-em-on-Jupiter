const world = new World()
// world.level = 20
world.createWorld()

let spawnArea = new TargetSpawnArea(world)

const rifle = new SniperGun()
const sniper = new Sniper(rifle)

let duck = new Duck(spawnArea)
duck.randomSpawn()
duck.distance = world.distance

const wind = new Wind() // z-axis affects y-axis
wind.randomWind()

const bang = new Bang(click)
const hit = new Hit(shot)

const windRose = new WindRose()

const gunSight = new Sight()