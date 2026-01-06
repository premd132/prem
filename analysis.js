function runAnalysis() {
  clearMarks();
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, week) => {
    [...tr.querySelectorAll("td")].slice(1).forEach((td, day) => {
      const val = td.innerText.trim();
      if (val) {
        history.push({
          jodi: val,
          week,
          cell: td
        });
      }
    });
  });

  const lastSeen = {};
  history.forEach(h => lastSeen[h.jodi] = h.week);

  const currentWeek = rows.length - 1;

  // 🔵 NICHE JODI (6–7 week gap)
  const nicheJodi = Object.keys(lastSeen).filter(j =>
    currentWeek - lastSeen[j] >= 6
  );

  nicheJodi.forEach(jodi => {
    history.forEach(h => {
      if (h.jodi === jodi) {
        markNiche(h.cell);
      }
    });
    addCheckLine(`NICHE BASE JODI FOUND: ${jodi}`);
  });
}

function markNiche(cell) {
  cell.classList.add("niche");
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
                                              function pasteRecord() {
  const text = document.getElementById("pasteArea").value.trim();
  if (!text) return;

  const lines = text.split(/\n+/);
  const rows = document.querySelectorAll("#recordTable tbody tr");

  lines.forEach((line, i) => {
    if (!rows[i]) return;
    const values = line.trim().split(/\s+|,/);
    const cells = rows[i].querySelectorAll("td");

    for (let d = 0; d < 6; d++) {
      if (values[d]) {
        cells[d + 1].innerText = values[d];
      }
    }
  });

  alert("Record pasted successfully. Ab Save dabao.");
  }
  );
}
