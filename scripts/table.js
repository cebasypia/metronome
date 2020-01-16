const TABLE_BUTTON_ID = "table--button";
const TABLE_WINDOW_ID = "table--window";
const RHYTHM_EDITING_TABLE_ID = "rhythm--editing--table";
const RHYTHM_EDITING_TABLE_BODY_ID = "rhythm--editing--table--body";
const tableButton = document.getElementById(TABLE_BUTTON_ID);
const tableWindow = document.getElementById(TABLE_WINDOW_ID);
const tableElement = document.getElementById(RHYTHM_EDITING_TABLE_ID);
const tBodyElement = document.getElementById(RHYTHM_EDITING_TABLE_BODY_ID);

// Initialize 
// Array.from(tBodyElement.tBodies[0].rows).forEach((e) => makeEditable(e));

const addTableWindowEvent = () => {
    tableButton.addEventListener("click", () => {
        tableWindow.style.visibility = "visible";
    });
};
addTableWindowEvent();

function addRow(obj = {}, bar) {
    rows = Array.from(tBodyElement.rows);
    tHead = Array.from(tableElement.rows);
    console.log(rows);
    rows.push(tBodyElement.insertRow(-1));

    for (i = 0; i < tHead[0].cells.length; i++) {
        let cell = rows[rows.length - 1].insertCell();
        let value = "";
        switch (tHead[0].cells[i].firstChild.data) {
            case "小節番号":
                if (bar) value = bar;
                break;
            case "拍子":
                if (obj.beats) value = obj.beats;
                break;
            case "テンポ":
                if (obj.tempo) value = obj.tempo;
                break;
            case "ジャンプ":
                if (obj.jump) {
                    value = obj.jump.time;
                    cell.appendChild(document.createTextNode(obj.jump.to));
                }
                break;
            default:

        }
        cell.appendChild(document.createTextNode(value));
    }
    makeEditable(rows[rows.length - 1]);
}

function makeEditable(tableRow) {
    for (let i = 0; i < tableRow.cells.length; i++) {
        tableRow.cells[i].setAttribute("contenteditable", true);
        tableRow.cells[i].addEventListener("input", function () {
        });
    }
};

const makeTableFromJSON = (json) => {
    while (tBodyElement.rows[0]) tBodyElement.deleteRow(0);
    json = (typeof json === 'string') ? JSON.parse(json) : json;
    Object.keys(json).forEach(key => {
        if (Number(key)) addRow(json[key], key);
    })
};
const makeJSONFromTable = () => {
    let json = {};
    const rows = tBodyElement.rows;
    for (let row = 0; row < rows.length; row++) {
        let bar
        for (let column = 0; column < tableElement.rows[0].cells.length; column++) {
            let data = rows[row].cells[column].firstChild.data;
            data = (parseInt(data) | parseInt(data) === 0 ? parseInt(data) : data);
            if (data === "") continue;
            switch (column) {
                case 0:
                    json[data] = {};
                    bar = data
                    break;
                case 1:
                    json[bar].beats = data;
                    break;
                case 2:
                    json[bar].tempo = data;
                    break;
                case 3:
                    // json[rows[row].cells[0]].beats = rows[row].cells[column];
                    break;
                default:
            }
        }
    }
    console.log(json);
};