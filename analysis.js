function runAnalysis() {
  clearMarks();
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, w) => {
    [...tr.querySelectorAll("td")].slice(1).forEach((td, d) => {
      if (td.innerText.trim()) {
        history.push({
          week: w,
          day: d,
          jodi: td.innerText.trim(),
          cell: td
        });
      }
    });
  });

  const lastSeen = {};
  history.forEach(h => lastSeen[h.jodi] = h.week);

  const niche = Object.keys(lastSeen)
    .filter(j => (rows.length - 1 - lastSeen[j]) >= 6);

  niche.forEach(base => {
    const template = history.filter(h => h.jodi === base);
    searchPattern(template, history);
  });
}

function searchPattern(template, history) {
  history.forEach(h => {
    template.forEach(t => {
      if (isFamily(h.jodi, t.jodi)) {
        markCell(h.cell, h.jodi === t.jodi);
        drawCheckLine(t.jodi, h.jodi, h.week);
      }
    });
  });
}

function isFamily(a, b) {
  return a === b || a.split("").reverse().join("") === b;
}

function markCell(cell, exact) {
  cell.classList.add("circle");
  if (!exact) cell.classList.add("family");
}

function drawCheckLine(base, found, week) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `Base Jodi ${base} → Match ${found} at Week ${week+1}`;
  document.getElementById("checkLines").appendChild(div);
}

function clearMarks() {
  document.querySelectorAll(".circle").forEach(c => {
    c.classList.remove("circle", "family");
  });
}
