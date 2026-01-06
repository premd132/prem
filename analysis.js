const FAMILY = [
  ["11","16","66","61"],
  ["22","27","77","72"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function getFamily(n){
  n = n.padStart(2,"0");
  return FAMILY.find(f => f.includes(n)) || [];
}

function runAnalysis(){
  clearMarks();

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  if(rows.length < 10) return;

  const last10 = rows.slice(-10);

  for(let col=1; col<=6; col++){
    const basePattern = last10.map(r =>
      getFamily(r.children[col].innerText.trim())
    );

    for(let i=0; i<=rows.length-10; i++){
      let match = true;

      for(let k=0; k<10; k++){
        const cell = rows[i+k].children[col].innerText.trim();
        if(!basePattern[k].includes(cell)){
          match = false;
          break;
        }
      }

      if(match){
        const line = document.createElement("div");
        line.className = "check-line";
        line.innerText = `Pattern found → Column ${col} | Rows ${i+1}–${i+10}`;
        line.onclick = () => markPattern(rows, col, i);
        box.appendChild(line);
      }
    }
  }
}

function markPattern(rows, col, start){
  clearMarks();
  let prev = null;

  for(let i=0;i<10;i++){
    const td = rows[start+i].children[col];
    td.classList.add("circle");

    if(prev){
      td.classList.add("connect-top");
    }
    prev = td;
  }
}

function clearMarks(){
  document.querySelectorAll(".circle,.connect-top")
    .forEach(e=>{
      e.classList.remove("circle");
      e.classList.remove("connect-top");
    });
}
