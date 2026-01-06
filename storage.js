// ==============================
// STORAGE + CSV HANDLER SCRIPT
// ==============================

// 🔹 Table body selector
const tbody = document.querySelector("#recordTable tbody");

// 🔹 Utility function — smart split for CSV lines
function smartSplit(line) {
  // comma | semicolon | tab | multiple spaces
  return line.split(/[,;\t ]+/).map(v => v.trim()).filter(v => v !== "");
}

// 🔹 Load CSV file
function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result.trim();
    const lines = text.split(/\r?\n/);

    // Clear previous data
    tbody.innerHTML = "";

    // 🔥 Skip header (first line)
    for (let i = 1; i < lines.length; i++) {
      const cols = smartSplit(lines[i]);
      if (cols.length < 6) continue;

      // Handle Week label + data
      let data;
      if (cols.length === 7) {
        data = cols.slice(1, 7); // if Week is already present
      } else {
        data = cols; // if no Week in CSV
      }

      addRow(data, i);
    }
  };

  reader.readAsText(file);
}

// 🔹 Add one row to table
function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${v}</td>`).join("");
  tbody.appendChild(tr);
}

// 🔹 Enable editing
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) { // skip Week column
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

// 🔹 Save table to LocalStorage
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("✅ Data Saved Successfully!");
}

// 🔹 Load saved data on page load
(function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;
  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();

// 🔹 CSV Upload Event Bind (VERY IMPORTANT)
document.addEventListener("DOMContentLoaded", () => {
  const csvInput = document.getElementById("csvFile");
  if (csvInput) {
    csvInput.addEventListener("change", loadCSV);
  }
});
