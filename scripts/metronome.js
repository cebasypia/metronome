//デフォルト
let tempo = 100; //テンポを120に設定
let isPlaying = false; //再生中かどうか
let time = 4; //拍子
let mainTimeOutIDs = [];
let subTimeOutIDs = [];
const gainValue = 0.1;

//Tempo++ボタンイベント
const tempoUp = document.getElementById("tempo--up");
addLongTouchEvent(tempoUp, function () {
    tempo++;
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("tempo--range").value = tempo;
});
//Tempo--ボタンイベント
const tempoDown = document.getElementById("tempo--down");
addLongTouchEvent(tempoDown, function () {
    tempo--;
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("tempo--range").value = tempo;
});

//Tempoスライダーで数値変化
var elem = document.getElementById("tempo--range");
var target = document.getElementById("tempo");
var rangeValue = function (elem, target) {
    return function () {
        tempo = elem.value;
        target.innerHTML = tempo;
    };
};
elem.addEventListener("input", rangeValue(elem, target));

//Timeで拍子変更
document.getElementById("time--plus").onclick = function () {
    time++;
    stopMetronome();
    startMetronome();
    document.getElementById("time").innerText = time;
};

document.getElementById("time--down").onclick = function () {
    time--;
    stopMetronome();
    startMetronome();
    document.getElementById("time").innerText = time;
};

//Playボタンクリックで再生開始
document.getElementById("play").onclick = function () {
    if (!isPlaying) {
        console.log("start metronome");
        startMetronome();

        //再生中に表示変更
        document.getElementById("play").innerText = "■";
        isPlaying = true;
    } else {
        console.log("stop metronome");
        stopMetronome();
        //停止中に表示変更
        document.getElementById("play").innerText = "▶";
        isPlaying = false;
    }
};

function startMetronome() {
    // 事前準備
    context = new AudioContext();
    osc = context.createOscillator();
    gain = context.createGain();
    osc.frequency.value = 1500;
    gain.gain.value = 0;
    osc.connect(gain).connect(context.destination);
    osc.start();

    // DOMHighResTimeStampとcurrentTimeを相互変換する関数を用意します
    // currentTime=0に対応するDOMHighResTimeStampを覚えておきます
    const baseTimeStamp = performance.now() - context.currentTime * 1000;

    // currentTimeをDOMHighResTimeStampに変換して返す
    function currentTimeStamp() {
        return baseTimeStamp + context.currentTime * 1000;
    }

    // 逆にDOMHighResTimeStampをcurrentTime形式に変換して返す
    function timeStampToAudioContextTime(timeStamp) {
        return (timeStamp - baseTimeStamp) / 1000;
    }

    // スケジュール済みのクリックのタイミングを覚えておきます。
    // まだスケジュールしていませんが、次のクリックの起点として現在時刻を記録
    let lastClickTimeStamp = performance.now();
    let nTime = 0;
    let count = 0;

    gain.gain.setValueAtTime(gainValue, 0);
    gain.gain.linearRampToValueAtTime(0, 0.05);

    document.getElementById("n--times").innerText = 1;

    setTimeout(function main() {
        // DOMHighResTimeStampで考えながらループを回します
        // 未スケジュールのクリックのうち1.5秒後までに発生予定のものを予約
        const now = currentTimeStamp();

        // ♩=120における四分音符長（ミリ秒
        tick = (60 * 1000) / tempo;
        //tick = [0,1000,917,834,751,668,585,502];
        //tick = [1000,1000,1000,1000,500,500,500];

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
            const nextClickTime = timeStampToAudioContextTime(nextClickTimeStamp);

            //もし拍子の頭だったら
            if (count % time == 0) {
                osc.frequency.setValueAtTime(1500, nextClickTime);
            } else {
                osc.frequency.setValueAtTime(1200, nextClickTime);
            }

            const subTimeOutID = setTimeout(function () {
                if (isPlaying) {
                    nTime++;
                    document.getElementById("n--times").innerText = (nTime % time) + 1;
                }
            }, nextClickTimeStamp - now);

            subTimeOutIDs.push(subTimeOutID);

            // 変換した時刻を使ってクリックを予約
            gain.gain.setValueAtTime(gainValue, nextClickTime);
            gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

            // スケジュール済みクリックの時刻を更新
            lastClickTimeStamp = nextClickTimeStamp;
        }
        if (isPlaying) {
            let mainTimeOutID = setTimeout(main, 700);
            mainTimeOutIDs.push(mainTimeOutID);
        }
    }, 0);
}
function stopMetronome() {
    osc.stop();

    mainTimeOutIDs.forEach(function (timeOutID) {
        clearTimeout(timeOutID);
    });
    MainTimeOutIDs = [];

    subTimeOutIDs.forEach(function (timeOutID) {
        clearTimeout(timeOutID);
    });
    subTimeOutIDs = [];
    document.getElementById("n--times").innerText = 0;
}
