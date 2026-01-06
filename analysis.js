<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mon–Sat Record Pattern Analyzer</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body {
  font-family: Arial, sans-serif;
  padding: 10px;
  background: #f4f4f4;
}

h2, h3 {
  text-align: center;
}

.controls {
  text-align: center;
  margin-bottom: 10px;
}

button {
  padding: 6px 12px;
  margin: 4px;
}

.paste-box {
  text-align: center;
  margin-bottom: 10px;
}

#pasteArea {
  width: 100%;
  max-width: 520px;
  padding: 8px;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th, td {
  border: 1px solid #ccc;
  text-align: center;
  padding: 6px;
}

td.editable {
  background: #eef;
}

.niche {
  border: 3px solid #007bff;
  border-radius: 50%;
  font-weight: bold;
}

.check-line {
  margin: 6px 0;
  padding: 6px;
  background: #eaffea;
  border-left: 5px solid green;
  font-size: 14px;
}

.note {
  font-size: 12px;
  text-align: center;
  color: #555;
  margin-top: 12px;
}
</style>
</head>

<body>

<h2>Mon–Sat Record Pattern Analysis (1 Row = 1 Week)</h2>

<div class="controls">
  <button onclick="enableEdit()">Edit</button>
  <button onclick="saveData()">Save</button>
  <button onclick="runAnalysis()">Run Analysis</button>
</div>

<div class="paste-box">
  <textarea id="pasteArea" rows="6"
    placeholder="Yahan poora record paste karo (har line = 1 week, Mon–Sat)">
  </textarea><br>
  <button onclick="pasteRecord()">Paste Record</button>
</div>

<table id="recordTable">
  <thead>
    <tr>
      <th>Week</th>
      <th>Mon</th>
      <th>Tue</th>
      <th>Wed</th>
      <th>Thu</th>
      <th>Fri</th>
      <th>Sat</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<h3>✔ Check Lines</h3>
<div id="checkLines"></div>

<p class="note">
This tool is for historical record analysis only.  
No prediction or betting advice.
</p>

<script>
/* ================= STORAGE + TABLE ================= */

const tableBody = document.querySelector("#recordTable tbody");
const TOTAL_WEEKS = 300; // 5+ years

function loadData() {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  tableBody.innerHTML = "";

  if (!saved || saved.length === 0) {
    for (let i = 0; i < TOTAL_WEEKS; i++) {
      addRow(["","","","","",""], i + 1);
    }
  } else {
    saved.forEach((row, i) => addRow(row, i + 1));
    for (let i = saved.length; i < TOTAL_WEEKS; i++) {
      addRow(["","","","","",""], i + 1);
    }
  }
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td contenteditable="false">${v || ""}</td>`).join("");
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

function saveData() {
  const data = [];
  tableBody.querySelectorAll("tr").forEach(tr => {
    const cells = [...tr.querySelectorAll("td")].slice(1);
    data.push(cells.map(td => td.innerText.trim()));
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

loadData();

/* ================= ANALYSIS (UNCHANGED LOGIC) ================= */

function runAnalysis() {
  clearMarks();
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, week) => {
    [...tr.querySelectorAll("td")].slice(1).forEach(td => {
      const val = td.innerText.trim();
      if (val) history.push({ jodi: val, week, cell: td });
    });
  });

  const lastSeen = {};
  history.forEach(h => lastSeen[h.jodi] = h.week);

  const currentWeek = rows.length - 1;

  const nicheJodi = Object.keys(lastSeen).filter(j =>
    currentWeek - lastSeen[j] >= 6
  );

  nicheJodi.forEach(jodi => {
    history.forEach(h => {
      if (h.jodi === jodi) h.cell.classList.add("niche");
    });
    addCheckLine("NICHE BASE JODI: " + jodi);
  });
}

function addCheckLine(text) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = text;
  document.getElementById("checkLines").appendChild(div);
}

function clearMarks() {
  document.querySelectorAll(".niche").forEach(c =>
    c.classList.remove("niche")
  );
}

/* ================= DIRECT ALL RECORD PASTE ================= */

function pasteRecord() {
  const text = document.getElementById("pasteArea").value.trim();
  if (!text) return;

  const lines = text.split(/\n+/);
  const rows = document.querySelectorAll("#recordTable tbody tr");

  lines.forEach((line, i) => {
    if (!rows[i]) return;

    let values = line
      .replace(/\*/g, "00")
      .trim()
      .split(/\s+|,/)
      .map(v => v.padStart(2, "0"));

    const cells = rows[i].querySelectorAll("td");

    for (let d = 0; d < 6; d++) {
      cells[d + 1].innerText = values[d] || "";
    }
  });

  alert("All record pasted. Ab Save dabao.");
}
</script>

</body>
</html>
