const tbody = document.querySelector("#recordTable tbody");
const checkLines = document.getElementById("checkLines");

const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function familyOf(v){
  return FAMILY.find(f => f.includes(v)) || null;
}

function runAnalysis(){
  checkLines.innerHTML = "";
  clearMarks();

  const rows = [...tbody.querySelectorAll("tr")];
  if(rows.length < 10){
    alert("कम से कम 10 rows चाहिए");
    return;
  }

  // 🔹 base = last 10 rows
  const base = rows.slice(-10);

  // 🔹 column wise
  for(let col = 1; col <= 6; col++){
    const baseFamilies = base.map(r => {
      const v = r.children[col].innerText.trim();
      return familyOf(v);
    });

    if(baseFamilies.includes(null)) continue;

    // 🔍 full record search
    for(let start = 0; start <= rows.length - 10; start++){
      let cells = [];
      let ok = true;

      for(let i = 0; i < 10; i++){
        const td = rows[start + i].children[col];
        const val = td.innerText.trim();
        const fam = familyOf(val);

        if(!fam || fam !== baseFamilies[i]){
          ok = false;
          break;
        }
        cells.push(td);
      }

      if(ok){
        addCheckLine(col, start, cells);
      }
    }
  }
}

function addCheckLine(col, start, cells){
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `Pattern → Column ${["Mon","Tue","Wed","Thu","Fri","Sat"][col-1]} Rows ${start+1}-${start+10}`;

  let active = false;
  div.onclick = () => {
    if(active){
      clearMarks();
      active = false;
    }else{
      clearMarks();
      highlight(cells);
      active = true;
    }
  };

  checkLines.appendChild(div);
}

function highlight(cells){
  cells.forEach((td,i)=>{
    td.classList.add("circle");
    if(i > 0) td.classList.add("connect-top");
  });
}

function clearMarks(){
  document.querySelectorAll(".circle,.connect-top")
    .forEach(el => el.classList.remove("circle","connect-top"));
}
