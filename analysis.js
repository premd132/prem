function normalizeJodi(val) {
  if (!val) return null;
  if (val === "**") return null;

  val = val.toString().trim();

  // single digit → add 0
  if (/^\d$/.test(val)) {
    return "0" + val;
  }

  // already 2 digit
  if (/^\d{2}$/.test(val)) {
    return val;
  }

  return null; // invalid ignore
}
console.log("FINAL FIX analysis.js loaded");

const FAMILIES = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

// ---------- HELPERS ----------
function normalize(v){
  if(!v || v==="**") return null;
  return v.toString().padStart(2,"0");
}

function familyKey(num){
  num = normalize(num);
  if(!num) return null;
  for(let i=0;i<FAMILIES.length;i++){
    if(FAMILIES[i].includes(num)) return "F"+i;
  }
  return null;
}

// ---------- MAIN ----------
function runAnalysis(){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const checkLines = document.getElementById("checkLines");
  checkLines.innerHTML = "";

  // clear old visuals
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","connect-top");
  });

  if(rows.length < 10){
    alert("Minimum 10 rows required");
    return;
  }

  // ===== BUILD LAST 10 PATTERN (Mon column) =====
  const last10Start = rows.length - 10;
  const basePattern = [];

  for(let i=0;i<10;i++){
    const td = rows[last10Start+i].children[1];
    const key = familyKey(td.innerText.trim());
    if(!key){
      alert("Invalid data in last 10 rows");
      return;
    }
    basePattern.push(key);
  }

  const patternString = basePattern.join("|");

  // ===== SEARCH FULL RECORD =====
  for(let r=0; r<=rows.length-10; r++){
    const seq = [];
    let ok = true;

    for(let i=0;i<10;i++){
      const td = rows[r+i].children[1];
      const key = familyKey(td.innerText.trim());
      if(!key){
        ok = false;
        break;
      }
      seq.push(key);
    }

    if(ok && seq.join("|") === patternString){
      createCheckLine(r);
    }
  }
}

// ---------- CHECK LINE ----------
function createCheckLine(startRow){
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = "MATCH @ W" + (startRow+1);

  let active = false;

  div.onclick = ()=>{
    active = !active;

    // remove all
    document.querySelectorAll("td").forEach(td=>{
      td.classList.remove("circle","connect-top");
    });

    if(!active) return;

    for(let i=0;i<10;i++){
      const td = document.querySelectorAll("#recordTable tbody tr")[startRow+i].children[1];
      td.classList.add("circle");
      if(i>0) td.classList.add("connect-top");
    }
  };

  document.getElementById("checkLines").appendChild(div);
}

window.runAnalysis = runAnalysis;
