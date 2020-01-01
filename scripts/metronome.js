//Define common
let isPlaying = false; //再生中かどうか
let tempo = 100; //テンポを120に設定
let time = 4; //拍子

const gainValue = 0.1;

const beatsElement = document.getElementById("n--beats");

//Tempo common 
const tempoElement = document.getElementById("tempo");

//Tempo add touch events
const tempoUp = document.getElementById("tempo--up");
addLongTouchEvent(tempoUp, function () {
    if (tempo < 200) {
        tempo++;
        tempoElement.innerText = tempo;
        document.getElementById("tempo--range").value = tempo;
    }
});

const tempoDown = document.getElementById("tempo--down");
addLongTouchEvent(tempoDown, function () {
    if (tempo > 0) {
        tempo--;
        tempoElement.innerText = tempo;
        document.getElementById("tempo--range").value = tempo;
    }
});

//Tempo add input event to range
const tempoRange = document.getElementById("tempo--range");
tempoRange.addEventListener("input", function () {
    tempo = tempoRange.value;
    tempoElement.innerText = tempo;
});


//Time common
const timeElement = document.getElementById("time");
const changeTime = function () {
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
    timeElement.innerText = time;
};

//Time add click events
document.getElementById("time--plus").addEventListener("click", function () {
    if (time < 6) {
        time++;
        changeTime();
    }
});

document.getElementById("time--down").addEventListener("click", function () {
    if (time > 1) {
        time--;
        changeTime();
    }
});


//Play 
document.getElementById("play").addEventListener("click", function () {
    if (!isPlaying) {
        startMetronome();
        document.getElementById("play").innerText = "■";
        isPlaying = true;
    } else {
        stopMetronome();
        document.getElementById("play").innerText = "▶";
        isPlaying = false;
    }
});

//Metronome Define
let mainTimeOutIDs = [];
let subTimeOutIDs = [];

let context;
let osc;
let gain;

//Metronome Start
function startMetronome() {
    //Web audio api settings
    context = new AudioContext();
    osc = context.createOscillator();
    gain = context.createGain();
    osc.frequency.value = 1500;
    gain.gain.value = 0;
    osc.connect(gain).connect(context.destination);
    osc.start();

    //Define
    let beat = 0;
    let count = 0;

    //First note
    gain.gain.setValueAtTime(gainValue, 0);
    gain.gain.linearRampToValueAtTime(0, 0.05);
    beatsElement.innerText = 1;

    // スケジュール済みのクリックのタイミングを覚えておきます。
    // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
    let lastClickTimeStamp = context.currentTime * 1000;

    //Loop
    setTimeout(function main() {
        const now = context.currentTime * 1000;

        // ♩=120における四分音符長（ミリ秒
        tick = (60 * 1000) / tempo;

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
                osc.frequency.setValueAtTime(1500, nextClickTime);
            } else {
                osc.frequency.setValueAtTime(1200, nextClickTime);
            }

            //Beat count update
            const subTimeOutID = setTimeout(function () {
                if (isPlaying) {
                    beat++;
                    beatsElement.innerText = (beat % time) + 1;
                }
            }, nextClickTimeStamp - now);

            subTimeOutIDs.push(subTimeOutID);

            //Reserve next click
            gain.gain.setValueAtTime(gainValue, nextClickTime);
            gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

            //Update lastClickTimeStamp 
            lastClickTimeStamp = nextClickTimeStamp;
            console.log(lastClickTimeStamp);
        }

        //Next loop
        if (isPlaying) {
            let mainTimeOutID = setTimeout(main, 700);
            mainTimeOutIDs.push(mainTimeOutID);
        }

    }, 0);
}

//Metronome stop
function stopMetronome() {
    osc.stop();

    //Cancel reservation
    mainTimeOutIDs.forEach(function (timeOutID) {
        clearTimeout(timeOutID);
    });
    MainTimeOutIDs = [];

    subTimeOutIDs.forEach(function (timeOutID) {
        clearTimeout(timeOutID);
    });
    subTimeOutIDs = [];

    //Update Beat count
    beatsElement.innerText = 0;
}
