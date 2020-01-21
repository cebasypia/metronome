import { addTempoEvents } from './tempo.js'
import { makeBeatsChoices, addBeatEvents } from './beat.js'
import { addRhythmFileEvent } from './rhythm.js'
import { addBarEvents } from './bar.js'
import { addPlayEvent } from './play.js'
import { addMusicEvent, refreshMusicElements } from './music.js'
import { addWindowEvents } from './window.js'
import { initCanvas } from './canvas.js'

addTempoEvents()
makeBeatsChoices()
addBeatEvents()
addRhythmFileEvent()
addBarEvents()
addPlayEvent()
addMusicEvent()
refreshMusicElements()
addWindowEvents()
initCanvas()
