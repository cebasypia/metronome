let csvBarCount = "1, 7, 22, 24, 28, 30, 31, 32, 33, 34, 35, 47, 48, 70, 84, 86, 88, 92";
let csvBeats = "4, 3, 4, 3,, 4, 4, 2, 4, 2, 4, 2, 4, 3, 2, 4, 3";
let csvTempo = "144,,,,,,,,,,,,,,,, 72";
let csvSymbol = ',,,, "goto-31-2",, "repeat-24-1",,,,,,,,,,, fin';
let barCountList;
let beats;
let tempo;
let symbol;

function formatterSet() {
    barCountList = formatter(csvBarCount.split(","));
    beats = formatter(csvBeats.split(","));
    tempo = formatter(csvTempo.split(","));
    symbol = csvSymbol.split(",");
    symbol = symbol.map(i => i.replace(/"/g, ""));
    symbol = symbol.map(i => i.replace(" ", ""));
    symbol = symbol.map((i) => {
        return ((i !== "" ? i.split("-") : ""));
    });
    symbol = symbol.map((i) => {
        if (Array.isArray(i)) {
            i = i.map(j => convertToNumber(j));
            i.push(0);
        }
        return i;
    });
};
formatterSet();

function formatter(ary) {
    for (let i = 0; i < ary.length; i++) {
        ary[i] = (ary[i] ? Number(ary[i]) : Number(ary[i - 1]));
    }
    return ary;
}

function convertToNumber(str) {
    return (Number(str) | Number(str) === 0 ? Number(str) : str);
};

let rhythmBuffer = [];
function makeRhythmBuffer() {
    for (let iList = 0; iList < barCountList.length; iList++) {

        //Symbol process
        switch (true) {
            case /repeat/g.test(symbol[iList]):
            case /goto/g.test(symbol[iList]):
                rhythmBuffer.push(symbol[iList]);

            default:
                //同じ拍子とテンポ区間の処理
                for (let iBar = barCountList[iList]; iBar < barCountList[iList + 1]; iBar++) {
                    //countはリピート等を含んだ全体での最後のindex番号
                    let count = rhythmBuffer.push([iBar]) - 1;
                    // console.log(rhythmBuffer);

                    //1小節内の処理
                    for (let nBeat = 0; nBeat < beats[iList]; nBeat++) {
                        rhythmBuffer[count].push(tempo[iList]);
                    }
                }
        }
    }
};
makeRhythmBuffer();

export let rhythm = [];
function makeRhythm() {
    for (let i = 0; i < rhythmBuffer.length; i++) {
        switch (true) {
            case /repeat/g.test(rhythmBuffer[i]):
                rhythmBuffer[i][3]++;

                if (rhythmBuffer[i][3] === rhythmBuffer[i][2]) {
                    i = rhythmBuffer.findIndex(val => val[0] === rhythmBuffer[i][1] - 1);
                }
                break;

            case /goto/g.test(rhythmBuffer[i]):
                rhythmBuffer[i][3]++;
                if (rhythmBuffer[i][3] === rhythmBuffer[i][2]) {
                    i = rhythmBuffer.findIndex(val => val[0] === rhythmBuffer[i][1] - 1);
                }
                break;

            default:
                rhythm.push(rhythmBuffer[i]);
        }
    }
};
makeRhythm();

export function setRhythm(bar, beats, tempo, symbol) {
    rhythmBuffer = []
    rhythm = [];
    csvBarCount = bar;
    csvBeats = beats;
    csvTempo = tempo;
    csvSymbol = symbol;
    formatterSet();
    makeRhythmBuffer();
    makeRhythm();
    console.log(rhythm);
}