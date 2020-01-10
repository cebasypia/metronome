//Constant definition
const DEFAULT_N_BEAT = 0;
const TRUE_ICON = "album";
const FALSE_ICON = "library_music";

const BEATS = {
    "1/4": { "str": "1/4", "num": 1 },
    "2/4": { "str": "2/4", "num": 2 },
    "3/4": { "str": "3/4", "num": 3 },
    "4/4": { "str": "4/4", "num": 4 }
};

//Get elements
const nBeatElement = document.getElementById("n--beat");
const musicElement = document.getElementById("music");

//Initialize elements
nBeatElement.innerText = DEFAULT_N_BEAT;
// musicElement.innerText = FALSE_ICON;

import { setTempoElements } from "./tempo.js"
import { bar, assignmentToBar, setBarElements } from "./bar.js"
import { isPlaying, setIsPlayingTo } from "./play.js"
import { setBeatsElements } from "./beat.js"

export let isMusicMode = false;
export function setIsMusicModeTo(boolean) {
    isMusicMode = boolean;
    // musicElement.innerText = boolean ? TRUE_ICON : FALSE_ICON;
}

export let music;
export function newMusic(gainValue, highTone, lowTone) {
    music = new Music(gainValue, highTone, lowTone);
}
export class Music {
    constructor(rhythm, gainValue = 0.1, highTone = 1500, lowTone = 1200) {
        this.gainValue = gainValue;
        this.highTone = highTone;
        this.lowTone = lowTone;
        this.rhythm = rhythm;

        this.clickSchedulerTimerID = 0;
        this.beatCountTimeOutIDs = [];

        //Web audio api settings
        this.context = new AudioContext();
        this.osc = this.context.createOscillator();
        this.gain = this.context.createGain();

        this.gain.gain.value = 0;
        this.osc.connect(this.gain).connect(this.context.destination);
        this.osc.frequency.value = this.highTone;
        this.osc.start();
    }
    start() {
        setIsPlayingTo(true);
        const test = (str) => {
            for (let i = bar; i >= 1; i--) {
                if (i in this.rhythm && str in this.rhythm[i]) {
                    return this.rhythm[i][str];
                }
            }
        };

        //Define
        let nBeat = 1;
        let tempo = test("tempo");
        let tick = (1000 * 60) / tempo;
        let beats = Object.assign({}, BEATS[test("beats")]);

        //First note
        this.gain.gain.setValueAtTime(this.gainValue, 0);
        this.gain.gain.linearRampToValueAtTime(0, 0.05);
        nBeatElement.innerText = 1;
        setTempoElements(tempo);

        // スケジュール済みのクリックのタイミングを覚えておきます。
        // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
        let lastClickTimeStamp = this.context.currentTime * 1000;

        //Loop function
        const clickScheduler = () => {
            const now = this.context.currentTime * 1000;

            for (
                let nextClickTimeStamp = lastClickTimeStamp + tick;
                nextClickTimeStamp < now + 1000;
                nextClickTimeStamp += tick
            ) {
                if (nextClickTimeStamp - now < 0) {
                    continue;
                }
                nBeat++;
                if (nBeat > beats.num) {
                    assignmentToBar(bar + 1);
                    nBeat = 1;
                    if (bar in this.rhythm) {
                        this.rhythm[bar].count++;
                        console.log(this.rhythm[bar].count);
                        if ("tempo" in this.rhythm[bar]) {
                            tick = (1000 * 60) / this.rhythm[bar].tempo;
                        }
                        if ("beats" in this.rhythm[bar]) {
                            beats = BEATS[this.rhythm[bar].beats];
                        }
                        if ("jump" in this.rhythm[bar]) {
                            console.log(this.rhythm[bar]);
                            if (this.rhythm[bar].jump.time === this.rhythm[bar].count) {
                                assignmentToBar(this.rhythm[bar].jump.to);
                            }
                        }
                    }
                }

                //Fin.
                if (bar >= this.rhythm.bars - 1) {
                    clearInterval(this.clickSchedulerTimerID);
                    setTimeout(() => {
                        this.stop();
                    }, nextClickTimeStamp - now);
                    return;
                }

                // 予約時間をループで使っていたDOMHighResTimeStampからAudioContext向けに変換
                const nextClickTime = nextClickTimeStamp / 1000;

                //Hi & Low tone
                if (nBeat === 1) {
                    this.osc.frequency.setValueAtTime(this.highTone, nextClickTime);
                } else {
                    this.osc.frequency.setValueAtTime(this.lowTone, nextClickTime);
                }

                //Elements update            
                const createElementsUpdater = (nBeat, bar, tempo, beats) => {
                    return setTimeout(() => {
                        if (isPlaying) {
                            nBeatElement.innerText = (nBeat);
                            setTempoElements(tempo);
                            setBarElements(bar);
                            setBeatsElements(beats)
                            console.log(`${bar}小節目`);
                        }
                    }, nextClickTimeStamp - now);
                }
                this.beatCountTimeOutIDs.push(createElementsUpdater(nBeat, bar, tempo, beats));

                //Reserve next click
                this.gain.gain.setValueAtTime(this.gainValue, nextClickTime);
                this.gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

                //Update lastClickTimeStamp 
                lastClickTimeStamp = nextClickTimeStamp;
            }
        };
        //Loop start
        clickScheduler();
        this.clickSchedulerTimerID = setInterval(clickScheduler, 700);
    }

    stop() {
        setIsPlayingTo(false);

        this.context.close();

        //Cancel reservation
        clearInterval(this.clickSchedulerTimerID);

        this.beatCountTimeOutIDs.forEach((timeOutID) => {
            clearTimeout(timeOutID);
        });

        //Update Beat count
        nBeatElement.innerText = 0;
    }
}

import { metronome } from "./metronome.js"
import { setRhythmTo } from "./rhythm.js"

export function addMusicEvent() {
    musicElement.addEventListener("change", (event) => {
        if (localStorage.getItem(event.target.value)) {
            const buf = localStorage.getItem(event.target.value);
            setRhythmTo(JSON.parse(buf))
            if (isMusicMode) {
                if (isPlaying) music.stop();
                assignmentToBar(1);
            } else {
                if (isPlaying) metronome.stop();
                setIsMusicModeTo(true);
            }
        } else {
            if (isMusicMode) {
                if (isPlaying) music.stop();
                setIsMusicModeTo(false);
            }
        }
    });
}
// export function addMusicEvent() {
//     musicElement.addEventListener("click", () => {
//         if (isMusicMode) {
//             setIsMusicModeTo(false);
//             if (isPlaying) {
//                 music.stop();
//             }
//         } else {
//             setIsMusicModeTo(true);
//             if (isPlaying) {
//                 metronome.stop();
//             }
//         }
//     });
// }