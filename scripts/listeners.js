// @ts-nocheck

sight.addEventListener("mousemove", function (e) {
  var rect = sight.getBoundingClientRect()
  var x = e.clientX - rect.left
  var y = e.clientY - rect.top
  pointer = [x, y]
})

// Event listener to get the mouse position
sight.addEventListener("mousedown", function (e) {
  const getCursorPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
  }

  const translateShotPos = (cursorPos) => {
    const x = cursorPos[0] * world.ratio + (sight.width * (1 - world.ratio)) / 2
    const y = cursorPos[1] * world.ratio + (sight.height * (1 - world.ratio)) / 2
    const z = cursorPos[2]
    const shotPos = [x, y, z]
    return shotPos
  }

  click = getCursorPosition(sight, e)
  sniper.x = click[0]
  sniper.y = click[1]

  const tShot = translateShotPos(click)
  sniper.x = Number(tShot[0].toFixed(2))
  sniper.y = Number(tShot[1].toFixed(2))

  document.querySelector(
    "#sniper-data-trans"
  ).innerHTML = `Ideal shot = [${sniper.x}, ${sniper.y}]`

  shot = sniper.shot(wind, duck, world) // runs the physics logic to  get the shot position
  
  // Animation control for missed target, prevents unwanted animations
  if (!targetDown) {
    
    if (sniper.ammo > 0)sniper.ammo-- // prevents the user from waisting bullets while the duck is falling
    bang.x = click[0] // Prevent user interaction while duck is falling
    bang.y = click[1]

    hit.x = shot[0] // helps to draw the endShot x
    hit.y = shot[1] // helps to draw the endShot y
  }
  
  // Detects if at the moment of the click, the target was hit
  if (
    shot[0] > duck.x + 0.25 * duck.width &&
    shot[0] < duck.x + 0.75 * duck.width &&
    shot[1] > duck.y &&
    shot[1] < duck.y + duck.height
  ) {
    targetDown = true
    huntCount += 1

    score += Number(
      ((2 ** (world.level % 8)) * (duck.distance / 100) * (world.gravity / 10)).toFixed()
    ) 
    
    if (sniper.ammo < 4) sniper.ammo += 1
  } else {
    // targetDown = false
  }

  document.querySelector(
    "#shot-data"
  ).innerHTML = `End shot = [${shot[0].toFixed(2)}, ${shot[1].toFixed(2)}, ${shot[2].toFixed()}] @ t = ${shot[3].toFixed(
    3
  )}s`
})

