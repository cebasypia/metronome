// Constant definition
import { isPlaying, setIsPlayingTo } from './play.js'
import { addLongTouchEvent } from './touch_action.js'
import { rhythm } from './rhythm.js'
import { metronome } from './metronome.js'
import { isMusicMode } from './music.js'

const DEFAULT_COUNT = 0
const MIN_COUNT = 0

// Get elements
const barElement = document.getElementById('bar')
const countElement = document.getElementById('count')
const barPlus = document.getElementById('bar--plus')
const barDown = document.getElementById('bar--down')

// Initialize elements

export let count = DEFAULT_COUNT
export function addBarEvents() {
  addLongTouchEvent(barPlus, () => {
    if (!isMusicMode) return
    if (count < rhythm.length - 1) {
      count++
      changeBar()
    }
  })

  addLongTouchEvent(barDown, () => {
    if (!isMusicMode) return
    if (count > MIN_COUNT) {
      count--
      changeBar()
    }
  })

  function changeBar() {
    refreshBarElements(count)
    if (isPlaying) {
      metronome.stop()
      setIsPlayingTo(false)
    }
  }
}
export function refreshBarElements(count) {
  barElement.innerText = rhythm[count].bar
  countElement.innerText = rhythm[count].bar
}
export function setBarsElements(bars) {
  barsElement.innerText = bars
}
export function setCount(num) {
  count = num
}
