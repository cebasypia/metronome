//Constant definition
const DEFAULT_N_BEAT = 0;
const TRUE_ICON = "Music MODE";
const FALSE_ICON = "Metronome"

//Get elements
const nBeatElement = document.getElementById("n--beat");
const musicElement = document.getElementById("music");

//Initialize elements
nBeatElement.innerText = DEFAULT_N_BEAT;
musicElement.innerText = FALSE_ICON;

import { setTempoElements } from "./tempo.js"
import { bar, incrementBar, setBarElements } from "./bar.js"
import { isPlaying, setIsPlayingTo } from "./play.js"

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
        this.ticks = rhythm.map(ary => ary.map(t => (60 * 1000 / t)));

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
        setTempoElements(this.rhythm[bar][nBeat]);


        // スケジュール済みのクリックのタイミングを覚えておきます。
        // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
        let lastClickTimeStamp = this.context.currentTime * 1000;

        //Loop function
        const clickScheduler = () => {
            const now = this.context.currentTime * 1000;

            for (
                let nextClickTimeStamp = lastClickTimeStamp + this.ticks[bar][nBeat];
                nextClickTimeStamp < now + 1000;
                nextClickTimeStamp += this.ticks[bar][nBeat]
            ) {
                if (nextClickTimeStamp - now < 0) {
                    continue;
                }

                nBeat++;
                if (nBeat >= this.ticks[bar].length) {
                    incrementBar();
                    nBeat = 1;
                }

                if (bar >= this.ticks.length) {
                    clearInterval(this.clickSchedulerTimerID);
                    setTimeout(() => {
                        this.stop();
                    }, nextClickTimeStamp - now);
                    return;
                }

                // 予約時間をループで使っていたDOMHighResTimeStampからAudioContext向けに変換
                const nextClickTime = nextClickTimeStamp / 1000;

                //Hi & Low tone
                if (nBeat % this.ticks[bar].length == 1) {
                    this.osc.frequency.setValueAtTime(this.highTone, nextClickTime);
                } else {
                    this.osc.frequency.setValueAtTime(this.lowTone, nextClickTime);
                }

                //Elements update            
                const createElementsUpdater = () => {
                    const n = nBeat;
                    const b = bar;
                    const elementsUpdate = () => {
                        const beatCountTimeOutID = setTimeout(() => {
                            if (isPlaying) {
                                console.log(this.rhythm[b][0] + "小節: " + n + "拍目");
                                nBeatElement.innerText = (n % this.ticks[b].length);
                                setTempoElements(this.rhythm[b][n]);
                                setBarElements(b)
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
                // console.log(lastClickTimeStamp);
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