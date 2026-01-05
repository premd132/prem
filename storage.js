const tableBody = document.querySelector("#recordTable tbody");

function loadData() {
  const saved = JSON.parse(localStorage.getItem("recordData")) || [];
  tableBody.innerHTML = "";

  saved.forEach((row, i) => addRow(row, i + 1));
}

function saveData() {
  const data = [];
  tableBody.querySelectorAll("tr").forEach(tr => {
    const cells = [...tr.querySelectorAll("td")].slice(1);
    data.push(cells.map(td => td.innerText.trim()));
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

function addRow(values = ["","","","","",""], week) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>W${week}</td>` +
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
