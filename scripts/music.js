// Constant definition
import { metronome } from './metronome.js'
import { isPlaying } from './play.js'
import { assignmentToBar } from './bar.js'
import { setRhythmTo } from './rhythm.js'
import { hideAllSubWindow, setControl } from './window.js'

const METRONOME = 'Metronome'
const musicElement = document.getElementById('music')

export let isMusicMode = false

export function setIsMusicModeTo(boolean) {
  isMusicMode = boolean
}

export function addMusicEvent() {
  musicElement.addEventListener('change', (event) => {
    if (isPlaying) metronome.stop()
    hideAllSubWindow()
    if (event.target.value === METRONOME) {
      setControl('tempo')
      setIsMusicModeTo(false)
    } else if (localStorage.getItem(event.target.value)) {
      const buf = localStorage.getItem(event.target.value)
      setRhythmTo(JSON.parse(buf))
      assignmentToBar(1)
      setControl('bar')
      setIsMusicModeTo(true)
    }
  })
}

export function refreshMusicElements(value) {
  while (musicElement.lastChild) {
    musicElement.removeChild(musicElement.lastChild)
  }
  const option = document.createElement('option')
  option.text = option.value = METRONOME
  if (option.value === value) option.selected = true
  musicElement.appendChild(option)
  for (let i = 0; i < localStorage.length; i++) {
    const option = document.createElement('option')
    option.text = option.value = localStorage.key(i)
    if (option.value === value) option.selected = true
    musicElement.appendChild(option)
  }
}
