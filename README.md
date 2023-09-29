# Shoot-em-on-Jupiter

FPS Click & Bang, where you hunt (kind of) ducks... Against wind, air density and gravity; maybe in Jupiter... if you aren't good enough get stuck in Earth, I ain't mad at you

This game is based on the behavior of the parabollic shot, I had to make some adjustments in order to kind of work as the classic duck hunt game.
The model follows all the equations related to real world mechanics and ballistics, or at least a very good approach.

Game limitations:
There are some assumptions given, order to not create an impossible game for leveling:
- The air density and coeficient of drag remain constant, independently of the level.
- The wind is top random at 5 m/s.
- The coordinates of the user click are manages as if they were meters (e.g. If the user clicks in coord. 30, 60 in pixels, will be transalted to meters, also this means that the shot was made at such altitude.
- The angle of shot is fixed to 90deg in alpha and 0deg in beta, which means there'll always be straigh shots.

The levels: 
There is a total of 40 levels, every level is randomnly created on the conditions of wind and the distance of the ducks.
Every time a duck is spawned, the wind changes in all of it's 3 axis.
At some point of the game, there'll be impossible shots, however, the purpose for this is to give the user a really hard time.

The Scoring:
It follows a kind of werid algorithm:
(2 ** (world.level % 8)) * (duck.distance / 100) * (world.gravity / 10)).toFixed()
You'll tend to get higher scores at base 2, on every superior level.

How do you lose:
Very simple, if you have no bullets (5 max), if the game spawns 10 ducks (including the ones you've shoot down).

How do you level-up:
You have to kill 3 ducks, yes, with the 5 bullets you have... you'll get it once you try higher levels.

Future steps:
I have the intention to add scoring tables, by now is a pretty decent project.
The plan is that for the user in order to access to save his score, he must reach at least the first level where Jupiter appears (level 31). That's the 'why' of the name
