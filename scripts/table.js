const RHYTHM_EDITING_TABLE_ID = "rhythmEditingTable";
const table = document.getElementById(RHYTHM_EDITING_TABLE_ID);

function addRow(num) {
    rows = Array.from(table.rows);
    rows.push(table.insertRow(-1));
    console.log(rows[0]);
    for (i = 0; i < rows[0].cells.length; i++) {
        let cell = rows[rows.length - 1].insertCell();
        cell.appendChild(document.createTextNode(num));
    }
    makeEditable(rows[rows.length - 1]);
}

function makeEditable(tableRow) {
    console.log(tableRow);
    for (let i = 0; i < tableRow.cells.length; i++) {
        tableRow.cells[i].setAttribute("contenteditable", true);
        tableRow.cells[i].addEventListener("input", function () {
            console.log(this.innerHTML);
        });
    }
};

// Initialize 
Array.from(table.tBodies[0].rows).forEach((e) => makeEditable(e));