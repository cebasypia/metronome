//デフォルト
let tempo = 100; //テンポを120に設定
let isPlaying = false; //再生中かどうか
let time = 4; //拍子

let timeOutIDs = [];
const gainValue = 0.1;

//Tempo++ボタンイベント
const tempoUp = document.getElementById("tempoup");
addLongTouchEvent(tempoUp, function () {
    tempo++;
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("tempo_range").value = tempo;
});

//Tempo--ボタンクリックでTempo-1
document.getElementById("tempodown").onclick = function () {
    tempo--;
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("tempo_range").value = tempo;
};

//Tempoスライダーで数値変化
var elem = document.getElementById("tempo_range");
var target = document.getElementById("tempo");
var rangeValue = function (elem, target) {
    return function () {
        tempo = elem.value;
        target.innerHTML = tempo;
    };
};
elem.addEventListener("input", rangeValue(elem, target));

//Timeで拍子変更
document.getElementById("timeplus").onclick = function () {
    time++;
    document.getElementById("time").innerText = time;
};

document.getElementById("timedown").onclick = function () {
    time--;
    document.getElementById("time").innerText = time;
};

//Playボタンクリックで再生開始
document.getElementById("play_stop").onclick = function () {
    if (!isPlaying) {
        console.log("start metronome");
        startMetronome();

        //再生中に表示変更
        document.getElementById("play_stop").innerText = "■";
        isPlaying = true;
    } else {
        console.log("stop metronome");
        stopMetronome();
        //停止中に表示変更
        document.getElementById("play_stop").innerText = "▶";
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
    let count = 0;
    let nTime = 0;

    gain.gain.setValueAtTime(gainValue, 0);
    gain.gain.linearRampToValueAtTime(0, 0.05);

    document.getElementById("n_times").innerText = 1;

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
                console.log((count % time) + ":1500");
            } else {
                osc.frequency.setValueAtTime(1200, nextClickTime);
                console.log((count % time) + ":1200");
            }

            setTimeout(function () {
                if (isPlaying) {
                    nTime++;
                    document.getElementById("n_times").innerText = (nTime % time) + 1;
                }
            }, nextClickTimeStamp - now);
            console.log(nextClickTimeStamp - performance.now());
            // 変換した時刻を使ってクリックを予約
            gain.gain.setValueAtTime(gainValue, nextClickTime);
            gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);

            // setTimeout(function () {
            //     j++;
            //     document.getElementById("n_times").innerText = (j - 1) % time + 1;
            // }, nextClickTimeStamp - now);

            // スケジュール済みクリックの時刻を更新
            lastClickTimeStamp = nextClickTimeStamp;
        }
        if (isPlaying) {
            setTimeout(main, 700);
        }
    }, 0);
    console.log("endpoint");
}
function stopMetronome() {
    osc.stop();
    document.getElementById("n_times").innerText = 0;
}
