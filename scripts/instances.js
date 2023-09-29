let world = new World()
world.createWorld()

let spawnArea = new TargetSpawnArea(world)

let rifle = new SniperGun()
rifle.switchRifle(0)

let sniper = new Sniper(rifle)

let duck = new Duck(spawnArea)
duck.randomSpawn()
duck.distance = world.distance

let wind = new Wind() // z-axis affects y-axis
wind.randomWind()

let bang = new Bang(click)
let hit = new Hit(shot)

let windRose = new WindRose()

let gunSight = new Sight()