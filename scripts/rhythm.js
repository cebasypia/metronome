const BAR = "bar";
const NOTE = "note";
const BEATS = "beats";
const TEMPO = "tempo";
const JUMP = "jump";
const TO = "to";
const TIME = "time";
const BARS = "bars";

const RHYTHM_FILE_ID = "rhythm--file";
const MUSIC_ELEMENT_ID = "music"

const musicElement = document.getElementById(MUSIC_ELEMENT_ID)

import { setBarsElements } from "./bar.js";

export let rhythm = {};

export function addRhythmFileEvent() {
    document.getElementById(RHYTHM_FILE_ID).addEventListener("change", (e) => {
        let result = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener('load', function () {
            csvToJSON(reader.result);
        });
    });
};

export function setRhythmTo(obj) {
    rhythm = obj;
};

function csvToJSON(csvText) {
    csvText = csvText.split(/\r\n|\n/);
    csvText = csvText.map(i => i.split(","));
    for (let column = 0; column <= csvText[0].length - 1; column++) {
        const prop = csvText[0][column];
        for (let row = 1; row < csvText.length; row++) {
            const value = csvText[row][column];
            if (value) {
                switch (prop) {
                    case BAR:
                        if (!rhythm[value]) {
                            rhythm[value] = { count: 0 };
                            rhythm[BARS] = value;
                        }
                        break;
                    case NOTE:
                        const molecule = convertToNumber(value.split("/")[0]);
                        const denominator = convertToNumber(value.split("/")[1]);
                        rhythm[csvText[row][0]][prop] = (molecule / denominator);
                        break;
                    case BEATS:
                        rhythm[csvText[row][0]][prop] = value;
                        break;
                    case TEMPO:
                        rhythm[csvText[row][0]][prop] = convertToNumber(value);
                        break;
                    case TO:
                    case TIME:
                        if (!(JUMP in rhythm[csvText[row][0]])) {
                            rhythm[csvText[row][0]][JUMP] = {};
                        }
                        rhythm[csvText[row][0]][JUMP][prop] = convertToNumber(value);
                        break;
                    default:
                }
            }
        }
    }
    console.log(rhythm);
    localStorage.setItem("loadFile", JSON.stringify(rhythm));
    setBarsElements(rhythm[BARS]);
};

function convertToNumber(str) {
    return (parseInt(str) | parseInt(str) === 0 ? parseInt(str) : str);
};

export function refreshRhythm() {
    while (musicElement.lastChild) {
        musicElement.removeChild(musicElement.lastChild);
    }
    for (let i = 0; i < localStorage.length; i++) {
        const option = document.createElement("option");
        option.text = option.value = localStorage.key(i);
        musicElement.appendChild(option);
    }
    const option = document.createElement("option");
    option.text = option.value = "戻る";
    musicElement.appendChild(option);
};