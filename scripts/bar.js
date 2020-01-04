//Constant definition
const DEFAULT_BAR = 0;
const MIN_BAR = 0;

//Get elements
const barElement = document.getElementById("bar");
const countElement = document.getElementById("count");
const barsElement = document.getElementById("bars");
const barPlus = document.getElementById("bar--plus");
const barDown = document.getElementById("bar--down");

//Initialize elements
barElement.innerText = rhythm[DEFAULT_BAR][0];
barsElement.innerText = rhythm.length;

import { isPlaying, setIsPlayingTo } from "./play.js"
import { addLongTouchEvent } from "./touch_action.js";
import { rhythm } from "./rhythm.js"
import { isMusicMode, music, newMusic } from "./metronome_music.js"

export let bar = DEFAULT_BAR;
export function addBarEvents() {
    addLongTouchEvent(barPlus, () => {
        if (!isMusicMode) return;
        if (bar < rhythm.length - 1) {
            bar++;
            changeBar();
        }
    });

    addLongTouchEvent(barDown, () => {
        if (!isMusicMode) return;
        if (bar > MIN_BAR) {
            bar--;
            changeBar();
        }
    });

    function changeBar() {
        barElement.innerText = rhythm[bar][0];
        countElement.innerText = bar;
        if (isPlaying) {
            music.stop();
            setIsPlayingTo(false);
        }
    };
}
export function setBarElements(bar) {
    barElement.innerText = rhythm[bar][0];
}
export function incrementBar() {
    bar++;
}