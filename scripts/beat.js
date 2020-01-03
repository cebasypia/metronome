//Constant definition
const DEFAULT_BEATS = 4;
const MAX_BEATS = 6;
const MIN_BEATS = 1;

//Get elements
const beatsElement = document.getElementById("beats");

//Initialize elements
beatsElement.innerText = DEFAULT_BEATS;

import { isPlaying } from "./play.js"
import { metronome, newMetronome } from "./metronome.js"
import { isMusicMode } from "./metronome_music.js"

export let beats = DEFAULT_BEATS;
export function addBeatEvents() {
    document.getElementById("beats--plus").addEventListener("click", () => {
        if (beats < MAX_BEATS) {
            if (isMusicMode) return;
            beats++;
            beatsElement.innerText = beats;
            changeBeats();
        }
    });

    document.getElementById("beats--down").addEventListener("click", () => {
        if (beats > MIN_BEATS) {
            if (isMusicMode) return;
            beats--;
            beatsElement.innerText = beats;
            changeBeats();
        }
    });

    function changeBeats() {
        if (isPlaying) {
            metronome.stop();
            newMetronome();
            metronome.start();
        }
    };
}