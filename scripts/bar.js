// Constant definition
import { isPlaying, setIsPlayingTo } from './play.js'
import { addLongTouchEvent } from './touch_action.js'
import { rhythm } from './rhythm.js'
import { metronome } from './metronome.js'
import { isMusicMode } from './music.js'

const DEFAULT_BAR = 1
const MIN_BAR = 1

// Get elements
const barElement = document.getElementById('bar')
const countElement = document.getElementById('count')
const barPlus = document.getElementById('bar--plus')
const barDown = document.getElementById('bar--down')

// Initialize elements
barElement.innerText = DEFAULT_BAR

export let bar = DEFAULT_BAR
export function addBarEvents() {
  addLongTouchEvent(barPlus, () => {
    if (!isMusicMode) return
    if (bar < rhythm.length - 1) {
      bar++
      changeBar()
    }
  })

  addLongTouchEvent(barDown, () => {
    if (!isMusicMode) return
    if (bar > MIN_BAR) {
      bar--
      changeBar()
    }
  })

  function changeBar() {
    barElement.innerText = bar
    countElement.innerText = bar
    if (isPlaying) {
      metronome.stop()
      setIsPlayingTo(false)
    }
  }
}
export function setBarElements(bar) {
  barElement.innerText = bar
  countElement.innerText = bar
}
export function setBarsElements(bars) {
  barsElement.innerText = bars
}
export function assignmentToBar(num) {
  bar = num
}
