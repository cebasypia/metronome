//Constant definition
const DEFAULT_N_BEAT = 0;

//Get elements
const nBeatElement = document.getElementById("n--beat");

//Initialize elements
nBeatElement.innerText = DEFAULT_N_BEAT;

import { isPlaying, setIsPlayingTo } from "./play.js"
import { tempo } from "./tempo.js"
import { beats } from "./beat.js";

export let metronome;
export function newMetronome(gainValue, highTone, lowTone) {
    metronome = new Metronome(gainValue, highTone, lowTone);
}
export class Metronome {
    constructor(gainValue = 0.1, highTone = 1500, lowTone = 1200) {
        this.gainValue = gainValue;
        this.highTone = highTone;
        this.lowTone = lowTone;
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
        let nBeat = 0;
        let count = 0;

        //First note
        this.gain.gain.setValueAtTime(this.gainValue, 0);
        this.gain.gain.linearRampToValueAtTime(0, 0.05);
        nBeatElement.innerText = 1;

        // スケジュール済みのクリックのタイミングを覚えておきます。
        // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
        let lastClickTimeStamp = this.context.currentTime * 1000;

        //Loop function
        const clickScheduler = () => {
            const now = this.context.currentTime * 1000;

            // ♩=120における四分音符長（ミリ秒
            let tick = (60 * 1000) / tempo;

            for (
                let nextClickTimeStamp = lastClickTimeStamp + tick;
                nextClickTimeStamp < now + 1000;
                nextClickTimeStamp += tick
            ) {
                if (nextClickTimeStamp - now < 0) {
                    continue;
                }

                count++;

                // 予約時間をループで使っていたDOMHighResTimeStampからAudioContext向けに変換
                const nextClickTime = nextClickTimeStamp / 1000;

                //Hi & Low tone
                if (count % beats == 0) {
                    this.osc.frequency.setValueAtTime(this.highTone, nextClickTime);
                } else {
                    this.osc.frequency.setValueAtTime(this.lowTone, nextClickTime);
                }

                //Beat count update
                const beatCountTimeOutID = setTimeout(() => {
                    if (isPlaying) {
                        nBeat++;
                        nBeatElement.innerText = (nBeat % beats) + 1;
                    }
                }, nextClickTimeStamp - now);

                this.beatCountTimeOutIDs.push(beatCountTimeOutID);

                //Reserve next click
                this.gain.gain.setValueAtTime(this.gainValue, nextClickTime);
                this.gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

                //Update lastClickTimeStamp 
                lastClickTimeStamp = nextClickTimeStamp;
                console.log(lastClickTimeStamp);
            }
        };
        //Loop start
        clickScheduler();
        this.clickSchedulerTimerID = setInterval(clickScheduler, 700);
    }

    //Metronome stop
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
