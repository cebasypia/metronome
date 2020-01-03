//Constant definition
const PLAY_ICON = "▶";
const STOP_ICON = "■"

//Get elements
const playElement = document.getElementById("play");

//Initialize elements
playElement.innerText = PLAY_ICON;

import { metronome, newMetronome } from "./metronome.js"
import { isMusicMode, music, newMusic } from "./metronome_music.js"

export let isPlaying = false;
export function setisPlayingTo(boolean) {
    isPlaying = boolean;
    playElement.innerText = boolean ? STOP_ICON : PLAY_ICON;
}
export function addPlayEvent() {
    playElement.addEventListener("click", () => {
        if (!isMusicMode) {
            if (!isPlaying) {
                newMetronome();
                metronome.start();
            } else {
                metronome.stop();
            }
        } else {
            if (!isPlaying) {
                newMusic([60, 60, 60, 60, 100, 100, 100, 100]);
                music.start();
            } else {
                music.stop();
            }
        }
    });
}