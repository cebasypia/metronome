let symbol;

export let rhythm = [[1, 60, 60, 60, 60]];
export function addSubmitRhythm() {
    document.getElementById("submit--rhythm").addEventListener("click", () => {
        csvConvert(document.getElementById("rhythm--text").value)
    })
}
export function addRhythmFileEvent() {
    document.getElementById("rhythm--file").addEventListener("change", (e) => {
        let result = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener('load', function () {
            csvConvert(reader.result);
        });
    });
}
function csvConvert(csvText) {
    csvText = csvText.split(/\r\n|\n/);
    csvText = csvText.map(i => i.split(","));
    csvText = csvText.map(i => i.map(i => convertToNumber(i)));
    csvText[3] = csvText[3].map((i) => {
        if (i) {
            i = i.split("-");
            i.push(0);
            i = i.map(i => convertToNumber(i));
        }
        return i;
    });
    console.log(csvText[3]);
    setRhythm(csvText[0], csvText[1], csvText[2], csvText[3]);
};
function symbolFormatter() {
    symbol = csvSymbol.split(",");
    symbol = symbol.map(i => i.replace(/"/g, ""));
    symbol = symbol.map(i => i.replace(" ", ""));
    symbol = symbol.map((i) => {
        if (Array.isArray(i)) {
            i = i.map(j => convertToNumber(j));
            i.push(0);
        }
        return i;
    });
};

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
function makeRhythmBuffer(bars, beats, tempo, symbol) {
    console.log(symbol);
    for (let iList = 0; iList < bars.length; iList++) {

        //Symbol process
        switch (true) {
            case /repeat/g.test(symbol[iList]):
            case /goto/g.test(symbol[iList]):
                rhythmBuffer.push(symbol[iList]);

            default:
                //同じ拍子とテンポ区間の処理
                for (let iBar = bars[iList]; iBar < bars[iList + 1]; iBar++) {
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

function setRhythm(bars, beats, tempo, symbol) {
    rhythmBuffer = []
    rhythm = [];
    bars = bars;
    beats = beats;
    tempo = tempo;
    symbol = symbol;

    // symbolFormatter();
    makeRhythmBuffer(bars, beats, tempo, symbol);
    makeRhythm();
    console.log(rhythm);
}
