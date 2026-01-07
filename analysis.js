/* FAMILY LOGIC */
const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function sameFamily(a, b) {
  return FAMILY.some(f => f.includes(a) && f.includes(b));
}

/* RUN ANALYSIS */
function runAnalysis() {
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  if (rows.length < 10) return alert("At least 10 rows required");

  const data = rows.map(r =>
    [...r.children].slice(1).map(td => td.innerText.trim())
  );

  const last10 = data.slice(-10);

  const patterns = [];

  /* COLUMN */
  for (let c = 0; c < 6; c++) {
    const seq = last10.map(r => r[c]).filter(v => v);
    if (seq.length >= 3) patterns.push({type:"Column", c, seq});
  }

  /* DIAGONAL */
  for (let c = 0; c < 5; c++) {
    const seq = last10.map((r,i)=> r[c+i] || "").filter(v=>v);
    if (seq.length >= 3) patterns.push({type:"Diagonal", c, seq});
  }

  /* FAMILY */
  for (let c = 0; c < 6; c++) {
    let fam = [];
    for (let i=1;i<last10.length;i++) {
      if (sameFamily(last10[i-1][c], last10[i][c])) {
        fam.push(last10[i][c]);
      }
    }
    if (fam.length>=2) patterns.push({type:"Family", c, seq:fam});
  }

  patterns.forEach((p,i)=>addCheckLine(p,i));
}

/* CHECK LINE */
function addCheckLine(p,i) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `Pattern ${i+1} (${p.type})`;
  div.onclick = ()=>togglePattern(p,div);
  document.getElementById("checkLines").appendChild(div);
}

/* TOGGLE */
function togglePattern(p, div) {
  div.classList.toggle("active");

  document.querySelectorAll("#recordTable tbody tr").forEach((tr,r)=>{
    const td = tr.children[p.c+1];
    if (!td) return;
    if (p.seq.includes(td.innerText)) {
      td.classList.toggle("circle");
      td.classList.toggle("connect");
    }
  });
}
