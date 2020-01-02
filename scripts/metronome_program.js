//Define common
let isPlaying = false; //再生中かどうか
let tempo = 100; //テンポを120に設定
let time = 4; //拍子

//Make tick array from rhythm (ms)
const rhythm = [60, 100, 60, 80, 120, 200, 100, 900];
const ticks = rhythm.map(function (t) {
    return (60 * 1000 / t)
});


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
    } else {
        stopMetronome();
        document.getElementById("play").innerText = "▶";
    }
});

//Metronome Define
let clickSchedulerTimerID;
let beatCountTimeOutIDs = [];

let context;
let osc;
let gain;

//Metronome Start
function startMetronome() {
    isPlaying = true;

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

    //Loop function
    function clickScheduler() {
        const now = context.currentTime * 1000;

        for (
            let nextClickTimeStamp = lastClickTimeStamp + ticks[count];
            nextClickTimeStamp < now + 1000;
            nextClickTimeStamp += ticks[count]
        ) {
            if (nextClickTimeStamp - now < 0) {
                continue;
            }

            count++;
            if (count < ticks.length) {

                // 予約時間をループで使っていたDOMHighResTimeStampからAudioContext向けに変換
                const nextClickTime = nextClickTimeStamp / 1000;

                //Hi & Low tone
                if (count % time == 0) {
                    osc.frequency.setValueAtTime(1500, nextClickTime);
                } else {
                    osc.frequency.setValueAtTime(1200, nextClickTime);
                }

                //Beat count update            
                const beatCountTimeOutID = setTimeout(function () {
                    if (isPlaying) {
                        beat++;
                        beatsElement.innerText = (beat % time) + 1;
                    }
                }, nextClickTimeStamp - now);

                beatCountTimeOutIDs.push(beatCountTimeOutID);

                //Reserve next click
                gain.gain.setValueAtTime(gainValue, nextClickTime);
                gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

                //Update lastClickTimeStamp 
                lastClickTimeStamp = nextClickTimeStamp;
                console.log(lastClickTimeStamp);

            } else {
                setTimeout(function () {
                    isPlaying = false;

                    osc.stop();

                    beatCountTimeOutIDs = [];

                    document.getElementById("play").innerText = "▶";
                    beatsElement.innerText = 0;

                    console.log("end");
                }, nextClickTimeStamp - now);
            }
        }
    };

    //Loop start
    clickScheduler();
    clickSchedulerTimerID = setInterval(clickScheduler, 700);
}

//Metronome stop
function stopMetronome() {
    isPlaying = false;

    osc.stop();

    //Cancel reservation
    clearInterval(clickSchedulerTimerID);

    beatCountTimeOutIDs.forEach(function (timeOutID) {
        clearTimeout(timeOutID);
    });
    beatCountTimeOutIDs = [];

    //Update Beat count
    beatsElement.innerText = 0;
}