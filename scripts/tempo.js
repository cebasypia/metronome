import { addLongTouchEvent } from "./touch_action.js";

export let tempo = 100;
export function addTempoEvents() {
    const tempoElement = document.getElementById("tempo");
    const tempoUp = document.getElementById("tempo--up");
    const tempoDown = document.getElementById("tempo--down");
    const tempoRange = document.getElementById("tempo--range");

    //Tempo add touch events
    addLongTouchEvent(tempoUp, () => {
        if (tempo < 220) {
            tempo++;
            tempoElement.innerText = tempo;
            document.getElementById("tempo--range").value = tempo;
        }
    });

    addLongTouchEvent(tempoDown, () => {
        if (tempo > 20) {
            tempo--;
            tempoElement.innerText = tempo;
            document.getElementById("tempo--range").value = tempo;
        }
    });

    //Tempo add input event to range
    tempoRange.addEventListener("input", () => {
        tempo = tempoRange.value;
        tempoElement.innerText = tempo;
    });
}