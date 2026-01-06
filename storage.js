const tbody = document.querySelector("#recordTable tbody");

/* ================= CSV LOAD ================= */
function smartSplit(line){
  return line.split(/[,\t; ]+/).map(v=>v.trim()).filter(v=>v!=="");
}

function loadCSV(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);
    tbody.innerHTML = "";

    let week = 1;

    for(let i=1;i<lines.length;i++){ // header skip
      if(!lines[i].trim()) continue;

      const cols = smartSplit(lines[i]);

      // Expect: Week + 6 days OR only 6 days
      let data;
      if(cols.length >= 7){
        data = cols.slice(1,7);
      } else if(cols.length === 6){
        data = cols;
      } else {
        continue;
      }

      addRow(data, week++);
    }
  };
  reader.readAsText(file);
}

/* ================= TABLE ================= */
function addRow(values, week){
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v=>`<td>${v || ""}</td>`).join("");
  tbody.appendChild(tr);
}

/* ================= EDIT ================= */
function enableEdit(){
  document.querySelectorAll("#recordTable tbody td").forEach((td,i)=>{
    if(i % 7 !== 0){
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

/* ================= SAVE ================= */
function saveData(){
  const data=[];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
    data.push([...tr.children].slice(1).map(td=>td.innerText.trim()));
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

/* ================= LOAD SAVED ================= */
(function(){
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if(!saved || !saved.length) return;

  tbody.innerHTML="";
  saved.forEach((row,i)=>addRow(row,i+1));
})();

/* ================= EVENT BIND ================= */
document.addEventListener("DOMContentLoaded",()=>{
  const csvInput = document.getElementById("csvFile");
  if(csvInput){
    csvInput.addEventListener("change", loadCSV);
  }
});
