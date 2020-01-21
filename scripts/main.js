// Circle
import { initCircle } from './circle.js'

// Tempo
import { addTempoEvents } from './tempo.js'

// Beat
import { makeBeatsChoices, addBeatEvents } from './beat.js'

// Rhythm
import { addRhythmFileEvent } from './rhythm.js'

// Bar
import { addBarEvents } from './bar.js'

// Play
import { addPlayEvent } from './play.js'

// Music
import { addMusicEvent, refreshMusicElements } from './music.js'

// Window
import { addWindowEvents } from './window.js'
initCircle()
addTempoEvents()
makeBeatsChoices()
addBeatEvents()
addRhythmFileEvent()
addBarEvents()
addPlayEvent()
addMusicEvent()
refreshMusicElements()
addWindowEvents()
