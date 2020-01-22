// Constant definition
// Initialize elements
// beatsElement.innerText = DEFAULT_BEATS;

import { isPlaying } from './play.js'
import { metronome, newMetronome } from './metronome.js'
import { isMusicMode } from './music.js'
import { setVisibility } from './window.js'
import { initCanvas } from './canvas.js'

const DEFAULT_BEATS = '4/4'
const CHOICE_CLASS = 'two columns choices'
const BEATS = {
  '1/4': { src: './images/1_4.png', value: 1 },
  '2/4': { src: './images/2_4.png', value: 2 },
  '3/4': { src: './images/3_4.png', value: 3 },
  '4/4': { src: './images/4_4.png', value: 4 },
  '5/4': { src: './images/5_4.png', value: 5 },
  '6/4': { src: './images/6_4.png', value: 6 },
  '2/8': { src: './images/2_8.png', value: 2 },
  '3/8': { src: './images/3_8.png', value: 3 },
  '6/8': { src: './images/6_8.png', value: 6 },
  '9/8': { src: './images/9_8.png', value: 9 },
  '12/8': { src: './images/12_8.png', value: 12 },
  back: { value: 'back' }
}

// Get elements
const beatsElement = document.getElementById('beats')
const beatsWindow = document.getElementById('beats--window')

export let beats = BEATS[DEFAULT_BEATS]
export function addBeatEvents() {
  beatsElement.addEventListener('click', () => {
    if (isMusicMode) return
    setVisibility(beatsWindow, true)
  })
  const beatsChoices = document.getElementsByClassName('choices')
  for (let i = 0; i < beatsChoices.length; i++) {
    beatsChoices[i].addEventListener('click', function() {
      // MODIFY children
      if (this.getAttribute('value') !== 'back') {
        beatsElement.children[0].src = BEATS[this.getAttribute('value')].src
        setBeats(this.getAttribute('value'))
        initCanvas(beats.value)
        changeBeats()
      }
    })
  }
}
const changeBeats = () => {
  if (isPlaying) {
    metronome.stop()
    newMetronome()
    metronome.start()
  }
}

export function setBeats(getBeats) {
  beats = BEATS[getBeats]
}
export function refreshBeatsElements(getBeats) {
  beatsElement.children[0].src = getBeats.src
}

export const makeBeatsChoices = () => {
  Object.keys(BEATS).forEach((key, index) => {
    // const dom = index < 6 ? beatsChoices1 : beatsChoices2
    const dom = document.getElementById('beats--select')
    makeButtonElement(key, dom)
  })
}
const makeButtonElement = (value, dom) => {
  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('class', CHOICE_CLASS)
  button.setAttribute('value', value)
  const textNode = document.createTextNode(value)
  button.appendChild(textNode)
  dom.appendChild(button)
}
