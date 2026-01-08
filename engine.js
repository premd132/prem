function clearDraw() {
  document.querySelectorAll("td").forEach(td => {
    td.classList.remove("circle", "line");
  });
}

function getRows() {
  return [...document.querySelectorAll("#recordTable tbody tr")];
}

/* =========================
   STEP 1: BUILD FLOW TEMPLATE
   ========================= */
function buildFlowTemplate() {
  const rows = getRows();
  const last = rows.slice(-7);
  const template = [];

  last.forEach((row, i) => {
    for (let col = 1; col <= 6; col++) {
      const val = row.children[col].innerText.trim();
      const fam = getFamily(val);
      if (fam) {
        template.push({
          step: i,
          col,
          fam
        });
        break; // ✅ ek row se sirf ek value
      }
    }
  });

  return template.length >= 4 ? template : null;
}

/* =========================
   STEP 2: SCAN FULL RECORD
   ========================= */
function scanFullRecord(template) {
  const rows = getRows();
  const matches = [];

  for (let r = 0; r <= rows.length - template.length; r++) {
    let ok = true;
    const steps = [];

    template.forEach((t, i) => {
      const td = rows[r + i].children[t.col];
      const fam = getFamily(td.innerText.trim());
      if (!fam || fam !== t.fam) {
        ok = false;
      } else {
        steps.push({ row: r + i, col: t.col });
      }
    });

    if (ok) matches.push(steps);
  }

  return matches;
}

/* =========================
   STEP 3: DRAW
   ========================= */
function drawMatch(steps) {
  clearDraw();
  steps.forEach((s, i) => {
    const td = getRows()[s.row].children[s.col];
    td.classList.add("circle");
    if (i > 0) td.classList.add("line");
  });
}

/* =========================
   STEP 4: RUN ANALYSIS
   ========================= */
function runAnalysis() {
  clearDraw();
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  const template = buildFlowTemplate();
  if (!template) {
    box.innerHTML = "<i>No base pattern in last rows</i>";
    return;
  }

  const matches = scanFullRecord(template);
  if (!matches.length) {
    box.innerHTML = "<i>No matching pattern found</i>";
    return;
  }

  matches.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "check-line";
    div.innerText = `Pattern ${i + 1} | Family Flow`;
    div.onclick = () => {
      drawMatch(m);
      div.classList.toggle("active");
    };
    box.appendChild(div);
  });
}
