// Tempo
import { addTempoEvents } from "./tempo.js"
addTempoEvents();

//Beat
import { makeBeatsChoices, addBeatEvents } from "./beat.js"
makeBeatsChoices();
addBeatEvents();

//Rhythm
import { addRhythmFileEvent } from "./rhythm.js"
addRhythmFileEvent();

//Bar
import { addBarEvents } from "./bar.js"
addBarEvents();

//Play
import { addPlayEvent } from "./play.js"
addPlayEvent();

//Music
import { addMusicEvent, refreshMusicElements } from "./music.js"
addMusicEvent();
refreshMusicElements();