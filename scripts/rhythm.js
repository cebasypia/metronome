const BEATS_OBJECT = {
    value: 0,
    name: "",
    note: 0
};
const SYMBOL_OBJECT = {
    event: "",
    args: []
};
const BAR_OBJECT = {
    beats: JSON.parse(JSON.stringify(BEATS_OBJECT)),
    tempo: 0,
    tick: 0,
    symbol: JSON.parse(JSON.stringify(SYMBOL_OBJECT)),
    count: 0
};

const BEATS_NAMES = [
    { name: "oneFour", str: "1/4", number: 0.25 },
    { name: "twoFour", str: "2/4", number: 0.50 },
    { name: "threeFour", str: "3/4", number: 0.75 },
    { name: "fourFour", str: "4/4", number: 1 }
];

export let rhythm = [JSON.parse(JSON.stringify(BAR_OBJECT))];
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

function convertCsv(csvText) {
    csvText = csvText.split(/\r\n|\n/);
    csvText = csvText.map(i => i.split(","));
    for (let i = 0; i <= csvText[0][csvText[0].length - 1]; i++) {
        rhythm[i] = JSON.parse(JSON.stringify(BAR_OBJECT));
    }
    for (let bar = 0; bar < csvText[0].length; bar++) {
        for (let prop = 0; prop < csvText.length; prop++) {
            if (csvText[prop][bar] !== "") {
                switch (prop) {
                    case 0:
                        break;
                    case 1:
                        rhythm[csvText[0][bar]].beats.note = beatsNoteFrom(csvText[prop][bar]);
                        console.log(rhythm[csvText[0][bar]].beats);
                        break;
                    case 2:
                        rhythm[csvText[0][bar]].beats.name = beatsNameFrom(csvText[prop][bar]);
                        rhythm[csvText[0][bar]].beats.value = beatsValueFrom(csvText[prop][bar]);
                        break;
                    case 3:
                        rhythm[csvText[0][bar]].tempo = csvText[prop][bar];
                        rhythm[csvText[0][bar]].tick = 60 * 1000 / csvText[prop][bar];
                        break;
                    case 4:
                        rhythm[csvText[0][bar]].symbol = symbolObjectFrom(csvText[prop][bar]);
                        break;
                    default:
                }
            }
        }
    }
    for (let i = 1; i < rhythm.length; i++) {
        if (rhythm[i].beats.value === 0) {
            rhythm[i].beats.value = rhythm[i - 1].beats.value;
        }
        if (rhythm[i].beats.name === "") {
            rhythm[i].beats.name = rhythm[i - 1].beats.name;
        }
        if (rhythm[i].beats.note === 0) {
            rhythm[i].beats.note = rhythm[i - 1].beats.note;
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

function beatsValueFrom(beatsValueText) {
    return convertToNumber(beatsValueText.split("/")[0]);
};

function beatsNameFrom(beatsNameText) {
    let result;
    BEATS_NAMES.forEach((obj) => {
        if (obj.str === beatsNameText) {
            result = obj.name;
        }
    })
    return result;
};

function beatsNoteFrom(beatsNoteText) {
    let molecule = convertToNumber(beatsNoteText.split("/")[0]);
    let denominator = convertToNumber(beatsNoteText.split("/")[1]);
    return (molecule / denominator);
};

function symbolObjectFrom(symbolText) {
    let symbolObject = JSON.parse(JSON.stringify(SYMBOL_OBJECT));
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