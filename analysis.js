const tbody = document.querySelector("#recordTable tbody");
const checkLinesBox = document.getElementById("checkLines");

const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function getFamily(v){
  for (let f of FAMILY) if (f.includes(v)) return f;
  return null;
}

function runAnalysis(){
  clearAll();
  const rows = [...tbody.querySelectorAll("tr")];
  if (rows.length < 10) return alert("Minimum 10 rows required");

  const base = rows.slice(-10).map(r =>
    [...r.children].slice(1).map(td => td.innerText.trim())
  );

  for (let col = 0; col < 6; col++){
    const baseCol = base.map(r => r[col]).filter(Boolean);
    const famSeq = baseCol.map(v => getFamily(v));
    if (famSeq.includes(null)) continue;

    for (let r = 0; r <= rows.length - 10; r++){
      let points = [];
      let ok = true;

      for (let i = 0; i < 10; i++){
        const td = rows[r+i]?.children[col+1];
        if (!td) { ok=false; break; }

        const v = td.innerText.trim();
        if (!getFamily(v) || !famSeq[i].includes(v)){
          ok=false; break;
        }
        points.push(td);
      }

      if (ok){
        createCheckLine(points, col);
      }
    }
  }
}

function createCheckLine(cells, col){
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `PATTERN FOUND | Column ${["Mon","Tue","Wed","Thu","Fri","Sat"][col]}`;

  div.onclick = () => toggleHighlight(cells);
  checkLinesBox.appendChild(div);
}

function toggleHighlight(cells){
  const active = cells[0].classList.contains("circle");

  clearVisuals();

  if (!active){
    cells.forEach((td,i)=>{
      td.classList.add("circle");
      if (i > 0) td.classList.add("connect-top");
    });
  }
}

function clearVisuals(){
  document.querySelectorAll(".circle,.connect-top")
    .forEach(el=>el.classList.remove("circle","connect-top"));
}

function clearAll(){
  checkLinesBox.innerHTML="";
  clearVisuals();
}
