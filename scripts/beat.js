//Constant definition
const DEFAULT_BEATS = "4/4";
const BEATS = {
    "1/4": { src: "./images/1_4.png", value: 1 },
    "2/4": { src: "./images/2_4.png", value: 2 },
    "3/4": { src: "./images/3_4.png", value: 3 },
    "4/4": { src: "./images/4_4.png", value: 4 }
};

//Get elements
const beatsElement = document.getElementById("beats");
const beatsWindow = document.getElementById("beats--window");
const beatsChange = document.getElementById("beats--change");

//Initialize elements
// beatsElement.innerText = DEFAULT_BEATS;

import { isPlaying } from "./play.js"
import { metronome, newMetronome } from "./metronome.js"
import { isMusicMode } from "./music.js"

export let beats = BEATS[DEFAULT_BEATS];
export function addBeatEvents() {
    beatsElement.addEventListener("click", () => {
        if (isMusicMode) return;
        beatsWindow.style.visibility = "visible";
    });
    beatsChange.addEventListener("click", () => {
        if (isMusicMode) return;
        beatsWindow.style.visibility = "hidden";
    });
    const beatsImages = document.getElementsByClassName("circle");
    for (let i = 0; i < beatsImages.length; i++) {
        beatsImages[i].addEventListener("click", function () {
            // MODIFY children
            beatsElement.children[0].src = BEATS[this.getAttribute("value")].src;
            beats = BEATS[this.getAttribute("value")];
            changeBeats();
        });
    }
};

export function setBeats(getBeats) {
    beats = BEATS[getBeats];
}
export function refreshBeatsElements(getBeats) {
    beatsElement.children[0].src = getBeats.src;
}
function changeBeats() {
    if (isPlaying) {
        metronome.stop();
        newMetronome();
        metronome.start();
    }
};