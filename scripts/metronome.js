"use strict";

//Define common
let isPlaying = false; //再生中かどうか
let tempo = 100; //テンポを120に設定
let time = 4; //拍子

let metronome;

const gainValue = 0.1;

//Get element
const tempoElement = document.getElementById("tempo");
const timeElement = document.getElementById("time");
const beatsElement = document.getElementById("n--beats");

//Tempo
(function () {
    //Tempo add touch events
    const tempoUp = document.getElementById("tempo--up");
    addLongTouchEvent(tempoUp, () => {
        if (tempo < 200) {
            tempo++;
            tempoElement.innerText = tempo;
            document.getElementById("tempo--range").value = tempo;
        }
    });

    const tempoDown = document.getElementById("tempo--down");
    addLongTouchEvent(tempoDown, () => {
        if (tempo > 0) {
            tempo--;
            tempoElement.innerText = tempo;
            document.getElementById("tempo--range").value = tempo;
        }
    });

    //Tempo add input event to range
    const tempoRange = document.getElementById("tempo--range");
    tempoRange.addEventListener("input", () => {
        tempo = tempoRange.value;
        tempoElement.innerText = tempo;
    });
}());

//Time
(function () {
    //Time common
    const changeTime = () => {
        if (isPlaying) {
            metronome.stop();
            metronome = new Metronome(0.1, 1500, 1200);
            metronome.start();
        }
        timeElement.innerText = time;
    };

    //Time add click events
    document.getElementById("time--plus").addEventListener("click", () => {
        if (time < 6) {
            time++;
            changeTime();
        }
    });

    document.getElementById("time--down").addEventListener("click", () => {
        if (time > 1) {
            time--;
            changeTime();
        }
    });
}());


//Play
(function () {
    document.getElementById("play").addEventListener("click", () => {
        if (!isPlaying) {
            metronome = new Metronome(0.1, 1500, 1200);
            metronome.start();
            document.getElementById("play").innerText = "■";
        } else {
            metronome.stop();
            document.getElementById("play").innerText = "▶";
        }
    });
}());

class Metronome {
    constructor(gainValue, highTone, lowTone) {
        this.gainValue = gainValue;
        this.highTone = highTone;
        this.lowTone = lowTone;
        this.context = new AudioContext();
        this.osc = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.clickSchedulerTimerID = 0;
        this.beatCountTimeOutIDs = [];

        //Web audio api settings
        this.gain.gain.value = 0;
        this.osc.connect(this.gain).connect(this.context.destination);
        this.osc.frequency.value = this.highTone;
        this.osc.start();
    }

    start() {
        isPlaying = true;

        //Define
        let beat = 0;
        let count = 0;

        //First note
        this.gain.gain.setValueAtTime(this.gainValue, 0);
        this.gain.gain.linearRampToValueAtTime(0, 0.05);
        beatsElement.innerText = 1;

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
                if (count % time == 0) {
                    this.osc.frequency.setValueAtTime(this.highTone, nextClickTime);
                } else {
                    this.osc.frequency.setValueAtTime(this.lowTone, nextClickTime);
                }

                //Beat count update
                const beatCountTimeOutID = setTimeout(() => {
                    if (isPlaying) {
                        beat++;
                        beatsElement.innerText = (beat % time) + 1;
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
        isPlaying = false;

        this.context.close();

        //Cancel reservation
        clearInterval(this.clickSchedulerTimerID);

        this.beatCountTimeOutIDs.forEach((timeOutID) => {
            clearTimeout(timeOutID);
        });

        //Update Beat count
        beatsElement.innerText = 0;
    }
}
