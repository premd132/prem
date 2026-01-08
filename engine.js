function clearDraw() {
  document.querySelectorAll("td").forEach(td => {
    td.classList.remove("circle", "line");
  });
}

function rows() {
  return [...document.querySelectorAll("#recordTable tbody tr")];
}

/* =========================
   STEP 1: BUILD COLUMN PATTERNS
   ========================= */
function buildColumnTemplates() {
  const r = rows();
  const last = r.slice(-6);
  const templates = [];

  for (let col = 1; col <= 6; col++) {
    const famSeq = [];
    last.forEach(row => {
      const val = row.children[col].innerText.trim();
      const fam = getFamily(val);
      if (fam) famSeq.push(fam);
    });

    if (famSeq.length >= 4) {
      templates.push({ col, famSeq });
    }
  }
  return templates;
}

/* =========================
   STEP 2: SCAN FULL RECORD
   ========================= */
function scanAll(templates) {
  const r = rows();
  const results = [];

  templates.forEach(tpl => {
    for (let i = 0; i <= r.length - tpl.famSeq.length; i++) {
      let ok = true;
      const steps = [];

      tpl.famSeq.forEach((fam, j) => {
        const td = r[i + j].children[tpl.col];
        if (getFamily(td.innerText.trim()) !== fam) {
          ok = false;
        } else {
          steps.push({ row: i + j, col: tpl.col });
        }
      });

      if (ok) results.push({ col: tpl.col, steps });
    }
  });

  return results;
}

/* =========================
   STEP 3: DRAW
   ========================= */
function draw(steps) {
  clearDraw();
  steps.forEach((s, i) => {
    const td = rows()[s.row].children[s.col];
    td.classList.add("circle");
    if (i > 0) td.classList.add("line");
  });
}

/* =========================
   STEP 4: RUN
   ========================= */
function runAnalysis() {
  clearDraw();
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  const templates = buildColumnTemplates();
  const results = scanAll(templates);

  if (!results.length) {
    box.innerHTML = "<i>No family pattern found</i>";
    return;
  }

  results.forEach((res, i) => {
    const d = document.createElement("div");
    d.className = "check-line";
    d.innerText = `Pattern ${i + 1} | Column ${res.col}`;
    d.onclick = () => draw(res.steps);
    box.appendChild(d);
  });
}
