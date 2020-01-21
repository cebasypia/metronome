import { setBarsElements } from './bar.js'
import { setIsMusicModeTo, refreshMusicElements } from './music.js'

const BAR = 'bar'
const NOTE = 'note'
const BEATS = 'beats'
const TEMPO = 'tempo'
const JUMP = 'jump'
const TO = 'to'
const TIME = 'time'
const BARS = 'bars'

const RHYTHM_FILE_ID = 'rhythm--file'

export let rhythm = {}

export const addRhythmFileEvent = () => {
  document.getElementById(RHYTHM_FILE_ID).addEventListener('change', (e) => {
    const result = e.target.files[0]
    const reader = new FileReader()
    const index = result.name.indexOf('.')
    reader.fileName = result.name.substring(0, index)
    reader.readAsText(result)

    // test Arrow function
    reader.addEventListener('load', () => {
      csvToJSON(reader.result)
      localStorage.setItem(this.fileName, JSON.stringify(rhythm))
      setBarsElements(rhythm[BARS])
      refreshMusicElements(this.fileName)
      setIsMusicModeTo(true)
    })
  })
}

export const setRhythmTo = (obj) => {
  rhythm = obj
}

const csvToJSON = (csvText) => {
  csvText = csvText.split(/\r\n|\n/)
  csvText = csvText.map((i) => i.split(','))
  for (let column = 0; column <= csvText[0].length - 1; column++) {
    const prop = csvText[0][column]
    for (let row = 1; row < csvText.length; row++) {
      const value = csvText[row][column]
      if (value) {
        switch (prop) {
          case BAR:
            if (!rhythm[value]) {
              rhythm[value] = { count: 0 }
              rhythm[BARS] = value
            }
            break
          case NOTE: {
            const molecule = convertToNumber(value.split('/')[0])
            const denominator = convertToNumber(value.split('/')[1])
            rhythm[csvText[row][0]][prop] = molecule / denominator
            break
          }
          case BEATS:
            rhythm[csvText[row][0]][prop] = value
            break
          case TEMPO:
            rhythm[csvText[row][0]][prop] = convertToNumber(value)
            break
          case TO:
          case TIME:
            if (!(JUMP in rhythm[csvText[row][0]])) {
              rhythm[csvText[row][0]][JUMP] = {}
            }
            rhythm[csvText[row][0]][JUMP][prop] = convertToNumber(value)
            break
          default:
        }
      }
    }
  }
}

const convertToNumber = (str) => {
  return parseInt(str) | (parseInt(str) === 0) ? parseInt(str) : str
}
