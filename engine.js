const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => loadCSV(r.result);
  r.readAsText(file);
});

function loadCSV(text){
  tbody.innerHTML = "";
  text.split(/\r?\n/).forEach(line=>{
    if(!line.trim()) return;
    const cols = line.split(",");
    const tr = document.createElement("tr");
    cols.forEach(c=>{
      const td = document.createElement("td");
      td.textContent = c.trim();
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function getFamily(v){
  if(v=="**") return null;
  v = v.padStart(2,"0");
  const map = {
    "0":["00","05","50","55"],
    "1":["11","16","61","66"],
    "2":["22","27","72","77"],
    "3":["33","38","83","88"],
    "4":["44","49","94","99"]
  };
  for(let k in map){
    if(map[k].includes(v)) return k;
  }
  return null;
}

function clearDraw(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","v-line");
  });
}

function runAnalysis(){
  clearDraw();
  const rows = [...tbody.querySelectorAll("tr")];
  if(rows.length<5) return;

  let found=false;
  let last5 = rows.slice(-5);

  for(let col=1;col<=6;col++){
    const fams = last5.map(r=>{
      const td=r.children[col];
      return getFamily(td.textContent.trim());
    });

    if(fams.every(f=>f!==null && f===fams[0])){
      found=true;
      last5.forEach((r,i)=>{
        const td=r.children[col];
        td.classList.add("circle");
        if(i>0) td.classList.add("v-line");
      });
      document.getElementById("result").innerHTML =
        "Pattern Found in Column "+col+" | Family "+fams[0];
      break;
    }
  }

  if(!found){
    document.getElementById("result").innerHTML="No pattern found";
  }
}
