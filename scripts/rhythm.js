import { setBarsElements } from "./bar.js";

export function addRhythmFileEvent() {
    document.getElementById("rhythm--file").addEventListener("change", (e) => {
        let result = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener('load', function () {
            convertCsv(reader.result);
        });
    });
}

export let rhythm = [{
    beats: 0,
    tempo: 0,
    tick: 0,
    symbol: { event: "", args: [] },
    count: 0
}];
function convertCsv(csvText) {
    csvText = csvText.split(/\r\n|\n/);
    csvText = csvText.map(i => i.split(","));
    for (let i = 0; i <= csvText[0][csvText[0].length - 1]; i++) {
        rhythm[i] = {
            beats: 0,
            tempo: 0,
            tick: 0,
            symbol: { event: "", args: [] },
            count: 0
        }
    }
    for (let bar = 0; bar < csvText[0].length; bar++) {
        for (let prop = 0; prop < csvText.length; prop++) {
            if (csvText[prop][bar] !== "") {
                switch (prop) {
                    case 0:
                        break;
                    case 1:
                        rhythm[csvText[0][bar]].beats = csvText[prop][bar];
                        break;
                    case 2:
                        rhythm[csvText[0][bar]].tempo = csvText[prop][bar];
                        rhythm[csvText[0][bar]].tick = 60 * 1000 / csvText[prop][bar];
                        break;
                    case 3:
                        rhythm[csvText[0][bar]].symbol = symbolObjectFrom(csvText[prop][bar]);
                        break;
                    default:
                }
            }
        }
    }
    for (let i = 1; i < rhythm.length; i++) {
        if (rhythm[i].beats === 0) {
            rhythm[i].beats = rhythm[i - 1].beats;
        }
        if (rhythm[i].tempo === 0) {
            rhythm[i].tempo = rhythm[i - 1].tempo;
        }
        if (rhythm[i].tick === 0) {
            rhythm[i].tick = rhythm[i - 1].tick;
        }
    }
    console.log(rhythm);
    setBarsElements(rhythm.length - 1);
};

function symbolObjectFrom(symbolText) {
    let symbolObject = { event: "", args: [] };
    let tempSymbol = symbolText.split("-");
    tempSymbol = tempSymbol.map(i => convertToNumber(i));
    for (let i = 0; i < tempSymbol.length; i++) {
        switch (i) {
            case 0:
                symbolObject.event = tempSymbol[i];
                break;
            default:
                symbolObject.args.push(tempSymbol[i]);
        }
    }
    return symbolObject;
};

function convertToNumber(str) {
    return (parseInt(str) | parseInt(str) === 0 ? parseInt(str) : str);
};