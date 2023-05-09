// @ts-nocheck

// Event listener to get the mouse position
sight.addEventListener("mousedown", function (e) {
  e.preventDefault()

  const getCursorPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
  }

  const translateShotPos = (cursorPos) => {
    const x = cursorPos[0] * ratio + (sight.width * (1 - ratio)) / 2
    const y = cursorPos[1] * ratio + (sight.height * (1 - ratio)) / 2
    const z = cursorPos[2]
    const shotPos = [x, y, z]
    return shotPos
  }

  click = getCursorPosition(sight, e)
  bang.x = click[0]
  bang.y = click[1]

  sniper.x = click[0]
  sniper.y = click[1]
  sniper.ammo--

  printData()

  const tShot = translateShotPos(click)
  sniper.x = Number(tShot[0].toFixed())
  sniper.y = Number(tShot[1].toFixed())

  document.querySelector(
    "#sniper-data-trans"
  ).innerHTML = `Ideal shot = [${sniper.x}, ${sniper.y}]`

  shot = sniper.shot(wind, tar)
  // print(shot, "black", false) // Shot
  bulletHole.x = shot[0]
  bulletHole.y = shot[1]

  document.querySelector(
    "#shot-data"
  ).innerHTML = `End shot = [${shot[0].toFixed()}, ${shot[1].toFixed()}, ${shot[2].toFixed()}] @ t = ${shot[3].toFixed(
    3
  )}s`
})
