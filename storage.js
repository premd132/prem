const tableBody = document.querySelector("#recordTable tbody");
const TOTAL_WEEKS = 25;

function loadData() {
  let saved = JSON.parse(localStorage.getItem("recordData"));

  tableBody.innerHTML = "";

  if (!saved || saved.length === 0) {
    // Auto create empty weeks
    for (let i = 0; i < TOTAL_WEEKS; i++) {
      addRow(["","","","","",""], i + 1);
    }
  } else {
    saved.forEach((row, i) => addRow(row, i + 1));
  }
}

function saveData() {
  const data = [];
  tableBody.querySelectorAll("tr").forEach(tr => {
    const cells = [...tr.querySelectorAll("td")].slice(1);
    data.push(cells.map(td => td.innerText.trim()));
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved Successfully");
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td contenteditable="false">${v}</td>`).join("");
  tableBody.appendChild(tr);
}

function enableEdit() {
  tableBody.querySelectorAll("td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

loadData();
