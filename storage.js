const tbody = document.querySelector("#recordTable tbody");

// CSV UPLOAD
document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    tbody.innerHTML = "";

    const lines = reader.result.split(/\r?\n/);

    lines.forEach((line, i) => {
      if (!line.trim()) return;

      const cols = line.split(",").map(v => v.trim());
      if (cols.length < 6) return;

      const tr = document.createElement("tr");

      // Week column
      const weekTd = document.createElement("td");
      weekTd.innerText = "W" + (i + 1);
      tr.appendChild(weekTd);

      // Mon–Sat
      for (let j = 0; j < 6; j++) {
        const td = document.createElement("td");
        td.innerText = normalize(cols[j]);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

    saveData();
  };

  reader.readAsText(file);
});

// EDIT
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) td.contentEditable = true;
  });
}

// SAVE
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [];
    [...tr.children].slice(1).forEach(td => row.push(td.innerText.trim()));
    data.push(row);
  });
  localStorage.setItem("record", JSON.stringify(data));
}

// LOAD ON PAGE OPEN
(function load() {
  const saved = JSON.parse(localStorage.getItem("record") || "null");
  if (!saved) return;

  tbody.innerHTML = "";
  saved.forEach((row, i) => {
    const tr = document.createElement("tr");

    const w = document.createElement("td");
    w.innerText = "W" + (i + 1);
    tr.appendChild(w);

    row.forEach(v => {
      const td = document.createElement("td");
      td.innerText = normalize(v);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
})();
