import { setControl } from './window.js'
import { setIsMusicModeTo, refreshMusicElements } from './music.js'

const BAR = 'bar'
const BEATS = 'beats'
const TEMPO = 'tempo'
const NOTE = 'note'
const EVENTS = 'events'
const JUMP = 'jump'
const TO = 'to'
const FINE = 'fine'
const DEFAULTS = [TEMPO, BEATS, NOTE]

const RHYTHM_FILE_ID = 'rhythm--file'

export let rhythm = {}

export const addRhythmFileEvent = () => {
  document.getElementById(RHYTHM_FILE_ID).addEventListener('change', (e) => {
    const result = e.target.files[0]
    const reader = new FileReader()
    const index = result.name.indexOf('.')
    reader.fileName = result.name.substring(0, index)
    reader.readAsText(result)

    reader.addEventListener('load', () => {
      const obj = csvToJSON(reader.result)
      localStorage.setItem(reader.fileName, JSON.stringify(obj))
      setRhythmTo(obj)
      // setBarsElements(rhythm[BARS])
      refreshMusicElements(reader.fileName)
      setControl('bar')
      setIsMusicModeTo(true)
    })
  })
}

export const setRhythmTo = (obj) => {
  const array = []
  const counts = []
  const bars = parseInt(
    Object.keys(obj).reduce((a, b) => {
      a = parseInt(a)
      b = parseInt(b)
      return a > b ? a : b
    })
  )
  for (let bar = 1; bar <= bars; bar++) {
    const buf = {}

    counts[bar] ? counts[bar]++ : (counts[bar] = 1)

    buf.bar = bar
    buf.time = counts[bar]

    DEFAULTS.forEach((str) => {
      buf[str] = searchBackward(obj, bar, str)
    })
    array.push(buf)

    if (bar in obj) {
      'time' in obj[bar] ? obj[bar].time++ : (obj[bar].time = 1)

      if ('events' in obj[bar]) {
        Object.keys(obj[bar].events).forEach((key) => {
          switch (key) {
            case 'fine':
              if (obj[bar].time === obj[bar].events.fine) {
                bar = bars
              }
              break
            case 'jump':
              if (obj[bar].time in obj[bar].events.jump)
                bar = obj[bar].events.jump[obj[bar].time].to - 1
              break
            case 'accel':
              break
            default:
          }
        })
      }
    }
  }
  rhythm = array
  console.log(rhythm)
}

const searchBackward = (obj, bar, str) => {
  for (let i = bar; i > 0; i--) {
    if (i in obj && str in obj[i]) return obj[i][str]
  }
}

const csvToJSON = (csvText) => {
  const result = {}
  csvText = csvText.split(/\r\n|\n/)
  csvText = csvText.map((i) => i.split(','))
  for (let column = 0; column <= csvText[0].length - 1; column++) {
    const prop = csvText[0][column]
    for (let row = 1; row < csvText.length; row++) {
      const value = csvText[row][column]
      const bar = csvText[row][0]
      if (value) {
        switch (prop) {
          case BAR:
            if (!result[value]) {
              result[value] = {}
            }
            break
          case NOTE: {
            result[bar][prop] = convertToNumber(value)
            break
          }
          case BEATS:
            result[bar][prop] = value
            break
          case TEMPO:
            result[bar][prop] = convertToNumber(value)
            break
          case JUMP: {
            if (!(EVENTS in result[bar])) {
              result[bar][EVENTS] = {}
            }
            if (!(JUMP in result[bar][EVENTS])) {
              result[bar][EVENTS][JUMP] = {}
            }
            const molecule = convertToNumber(value.split('/')[0])
            const denominator = convertToNumber(value.split('/')[1])

            result[bar][EVENTS][JUMP][molecule] = {}
            result[bar][EVENTS][JUMP][molecule][TO] = denominator
            break
          }
          case FINE:
            if (!(EVENTS in result[bar])) {
              result[bar][EVENTS] = {}
            }
            result[bar][EVENTS][FINE] = convertToNumber(value)
            break
          default:
        }
      }
    }
  }
  return result
}

const convertToNumber = (str) => {
  return Number(str) || Number(str) === 0 ? Number(str) : str
}
