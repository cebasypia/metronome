import { beats } from './beat.js'

const BASE_COLOR = (a) => {
  return `rgba(51,195,240,${a})`
}
const ACCENT_COLOR = (a) => {
  return `rgba(255,170,118,${a})`
}
const baseCanvas = document.getElementById('base')
const baseContext = baseCanvas.getContext('2d')

const animationCanvas = document.getElementById('animation')
const animationContext = animationCanvas.getContext('2d')

const SIZE = (baseCanvas.width = animationCanvas.width = baseCanvas.height = animationCanvas.height =
  document.querySelector('body').clientWidth * 0.8)

class Circle {
  constructor(lineWidth, size) {
    this.lineWidth = lineWidth
    this.size = size
  }
  draw() {
    baseContext.beginPath()
    baseContext.strokeStyle = BASE_COLOR(0.5)
    baseContext.lineWidth = this.lineWidth
    baseContext.arc(
      SIZE / 2,
      SIZE / 2,
      this.size,
      (0 * Math.PI) / 180,
      (360 * Math.PI) / 180,
      false
    )
    baseContext.stroke()
  }
}

class Pulsator extends Circle {
  constructor(lineWidth, size, tick, timeStamp) {
    super(lineWidth, size)
    this.radius = size
    this.tick = tick
    this.timeStamp = timeStamp
  }
  draw() {
    animationContext.beginPath()
    animationContext.fillStyle = BASE_COLOR(0.1)
    animationContext.arc(
      SIZE / 2,
      SIZE / 2,
      this.radius,
      (0 * Math.PI) / 180,
      (360 * Math.PI) / 180,
      false
    )
    animationContext.fill()
  }

  update(time) {
    const degree = (time / this.tick) * Math.PI
    this.radius = (this.size * (1 - Math.sin(degree)) * 2) / 3 + (this.size * 1) / 3
  }
}

class Spinner extends Pulsator {
  constructor(lineWidth, size, tick, timeStamp, beats, nBeat) {
    super(lineWidth, size, tick, timeStamp)
    this.beats = beats
    this.degree = 0
    this.count = 1
    this.beats = beats
    this.nBeat = nBeat
  }
  draw() {
    animationContext.beginPath()
    animationContext.fillStyle = ACCENT_COLOR(1)
    animationContext.arc(
      SIZE / 2 + (SIZE / 2 - 5) * Math.cos(this.degree),
      SIZE / 2 + (SIZE / 2 - 5) * Math.sin(this.degree),
      this.size,
      (0 * Math.PI) / 180,
      (360 * Math.PI) / 180,
      false
    )
    animationContext.fill()
  }

  update(time) {
    this.degree =
      (time / (this.tick * this.beats) + (this.nBeat - 1) / this.beats - 1 / 4) * 2 * Math.PI
  }
}

const drawPolygon = (n) => {
  const getXPoint = (deg) => {
    return SIZE / 2 + (SIZE / 2 - 5) * Math.sin(deg)
  }
  const getYPoint = (deg) => {
    return SIZE / 2 - (SIZE / 2 - 5) * Math.cos(deg)
  }

  baseContext.beginPath()
  baseContext.strokeStyle = BASE_COLOR(0.5)
  for (let deg = 0; deg < 2 * Math.PI; deg += (2 * Math.PI) / n) {
    baseContext.lineTo(getXPoint(deg), getYPoint(deg))
  }
  baseContext.closePath()
  baseContext.stroke()
}

export const startAnimation = (tempo, beats, nBeat) => {
  const timeStamp = performance.now()
  const tick = (60 / tempo) * 1000
  const pulsator = new Pulsator(1, SIZE / 2 - 5, tick, timeStamp)
  const spinner = new Spinner(2, 5, tick, timeStamp, beats, nBeat)
  initCanvas()
  let time = performance.now() - pulsator.timeStamp
  const loop = () => {
    animationContext.clearRect(0, 0, SIZE, SIZE)

    pulsator.update(time)
    spinner.update(time)
    pulsator.draw()
    spinner.draw()

    time = performance.now() - pulsator.timeStamp
    if (nBeat > beats) {
      return
    } else if (time === pulsator.tick) {
      return
    } else if (time < pulsator.tick) {
      requestAnimationFrame(loop)
    } else if (time > pulsator.tick) {
      time = pulsator.tick
      requestAnimationFrame(loop)
    }
  }
  loop()
}

export const initCanvas = () => {
  baseContext.clearRect(0, 0, SIZE, SIZE)
  const circle = new Circle(2, SIZE / 2 - 5)
  circle.draw()
  drawPolygon(beats.value)
}
