//Constant definition
const PLAY_ICON = "▶";
const STOP_ICON = "■"

//Get elements
const playElement = document.getElementById("play");

//Initialize elements
playElement.innerText = PLAY_ICON;

import { metronome, newMetronome } from "./metronome.js"
import { rhythm } from "./rhythm.js"

export let isPlaying = false;
export function setIsPlayingTo(boolean) {
    isPlaying = boolean;
    playElement.innerText = boolean ? STOP_ICON : PLAY_ICON;
}
export function addPlayEvent() {
    playElement.addEventListener("click", () => {
        if (!isPlaying) {
            newMetronome(rhythm);
            metronome.start();
        } else {
            metronome.stop();
        }
    });
}