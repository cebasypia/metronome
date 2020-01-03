import { metronome, newMetronome } from "./metronome.js"

export let isPlaying = false;
export function setisPlayingTo(boolean) {
    isPlaying = boolean;
}
export function addPlayEvent() {
    document.getElementById("play").addEventListener("click", () => {
        if (!isPlaying) {
            newMetronome(0.1, 1500, 1200);
            metronome.start();
            document.getElementById("play").innerText = "■";
        } else {
            metronome.stop();
            document.getElementById("play").innerText = "▶";
        }
    });
}