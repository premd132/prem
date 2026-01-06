const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change", loadCSV);

function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.trim().split(/\r?\n/);

    tbody.innerHTML = "";

    // 🔥 Header skip + Week column handle
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");

      // cols[0] = Week (ignore)
      const data = cols.slice(1, 7).map(v => v.trim());

      if (data.length === 6) {
        addRow(data, i);
      }
    }
  };
  reader.readAsText(file);
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${v}</td>`).join("");
  tbody.appendChild(tr);
}

// EDIT MODE
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

// SAVE
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

// LOAD SAVED
(function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;

  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();
