import { isPlaying } from "./play.js"
import { metronome, newMetronome } from "./metronome.js"

export let beats = 4;
export function addBeatEvents() {
    const beatsElement = document.getElementById("beats");

    //Time add click events
    document.getElementById("beats--plus").addEventListener("click", () => {
        if (beats < 6) {
            beats++;
            beatsElement.innerText = beats;
            changeTime();
        }
    });

    document.getElementById("beats--down").addEventListener("click", () => {
        if (beats > 1) {
            beats--;
            beatsElement.innerText = beats;
            changeTime();
        }
    });
    const changeTime = () => {
        if (isPlaying) {
            metronome.stop();
            newMetronome(0.1, 1500, 1200);
            metronome.start();
        }
    };
}