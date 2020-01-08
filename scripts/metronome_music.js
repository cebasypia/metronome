//Constant definition
const DEFAULT_N_BEAT = 0;
const TRUE_ICON = "album";
const FALSE_ICON = "library_music"

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
    musicElement.innerText = boolean ? TRUE_ICON : FALSE_ICON;
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

        //Define
        let nBeat = 1;

        //First note
        this.gain.gain.setValueAtTime(this.gainValue, 0);
        this.gain.gain.linearRampToValueAtTime(0, 0.05);
        nBeatElement.innerText = 1;
        setTempoElements(this.rhythm[bar].tempo);

        // スケジュール済みのクリックのタイミングを覚えておきます。
        // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
        let lastClickTimeStamp = this.context.currentTime * 1000;

        //Loop function
        const clickScheduler = () => {
            const now = this.context.currentTime * 1000;

            for (
                let nextClickTimeStamp = lastClickTimeStamp + this.rhythm[bar].tick;
                nextClickTimeStamp < now + 1000;
                nextClickTimeStamp += this.rhythm[bar].tick
            ) {
                if (nextClickTimeStamp - now < 0) {
                    continue;
                }
                nBeat++;
                if (nBeat > this.rhythm[bar].beats.value) {
                    assignmentToBar(bar + 1);
                    nBeat = 1;
                    this.rhythm[bar].count++;
                    if (this.rhythm[bar].symbol.event !== "") {
                        console.log(bar);
                        symbolEvent();
                    }
                }

                //Fin.
                if (bar >= this.rhythm.length - 1) {
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
                const createElementsUpdater = () => {
                    const tmpNBeat = nBeat;
                    const tmpBar = bar;

                    const elementsUpdate = () => {
                        const beatCountTimeOutID = setTimeout(() => {
                            if (isPlaying) {
                                console.log(tmpBar + "小節: " + tmpNBeat + "拍目");
                                nBeatElement.innerText = (tmpNBeat);
                                setTempoElements(this.rhythm[tmpBar].tempo);
                                setBarElements(tmpBar);
                                setBeatsElements(this.rhythm[tmpBar].beats)
                            }
                        }, nextClickTimeStamp - now);
                        this.beatCountTimeOutIDs.push(beatCountTimeOutID);
                    }
                    return elementsUpdate;
                }
                let updateElements = createElementsUpdater();
                updateElements();

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

        const symbolEvent = () => {
            if (this.rhythm[bar].symbol.args[1] === this.rhythm[bar].count) {
                assignmentToBar(this.rhythm[bar].symbol.args[0]);
                nBeat = 1;
            }
        };
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

export function addMusicEvent() {
    musicElement.addEventListener("click", () => {
        if (isMusicMode) {
            setIsMusicModeTo(false);
            if (isPlaying) {
                music.stop();
            }
        } else {
            setIsMusicModeTo(true);
            if (isPlaying) {
                metronome.stop();
            }
        }
    });
}