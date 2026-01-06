console.log("analysis.js loaded");

/* FAMILY GROUPS */
const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function familyOf(val) {
  if (!val) return null;
  val = val.trim();
  for (const f of FAMILY) {
    if (f.includes(val)) return f.join("-");
  }
  return null;
}

function runAnalysis() {
  clearMarks();
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];

  if (rows.length < 10) {
    box.innerHTML = "<div class='check-line'>❌ At least 10 rows required</div>";
    return;
  }

  const last10 = rows.slice(-10);
  let found = 0;

  for (let col = 1; col <= 6; col++) {
    const pattern = last10.map(r => familyOf(r.children[col].innerText));

    if (pattern.some(v => v === null)) continue;

    for (let start = 0; start <= rows.length - 10; start++) {
      if (start >= rows.length - 10) continue;

      let match = true;
      for (let k = 0; k < 10; k++) {
        const f = familyOf(rows[start + k].children[col].innerText);
        if (f !== pattern[k]) {
          match = false;
          break;
        }
      }

      if (match) {
        found++;
        createCheckLine({ col, start, len: 10 }, found);
      }
    }
  }

  if (found === 0) {
    box.innerHTML = "<div class='check-line'>⚠ No matching pattern found</div>";
  }
}

/* CHECK LINE */
function createCheckLine(p, idx) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `Pattern ${idx} | Column ${p.col}`;

  let active = false;
  div.onclick = () => {
    active = !active;
    if (active) drawPattern(p);
    else clearMarks();
  };

  document.getElementById("checkLines").appendChild(div);
}

/* DRAW */
function drawPattern(p) {
  clearMarks();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];

  for (let i = 0; i < p.len; i++) {
    const td = rows[p.start + i].children[p.col];
    td.classList.add("circle");
    if (i > 0) td.classList.add("connect-top");
  }
}

/* CLEAR */
function clearMarks() {
  document.querySelectorAll(".circle,.connect-top")
    .forEach(td => td.classList.remove("circle","connect-top"));
}

window.runAnalysis = runAnalysis;
