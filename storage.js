const tbody = document.querySelector("#recordTable tbody");

/* normalize values */
function normalize(v){
  if(!v) return "";
  v = v.trim();
  if(v === "**") return "";
  if(/^\d$/.test(v)) return "0" + v;
  return v;
}

/* CSV upload */
document.getElementById("csvFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    tbody.innerHTML="";
    const lines = reader.result.split(/\r?\n/);

    lines.slice(1).forEach((line,i)=>{
      if(!line.trim()) return;
      const cols = line.split(",");
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>W${i+1}</td>` +
        cols.slice(0,6).map(v=>`<td>${normalize(v)}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  reader.readAsText(file);
});

/* enable edit */
function enableEdit(){
  document.querySelectorAll("#recordTable td").forEach((td,i)=>{
    if(i % 7 !== 0){
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

/* save data */
function saveData(){
  const data=[];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
    data.push(
      [...tr.children].slice(1).map(td=>normalize(td.innerText))
    );
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

/* load saved */
(function loadSaved(){
  const saved = JSON.parse(localStorage.getItem("recordData") || "null");
  if(!saved) return;
  tbody.innerHTML="";
  saved.forEach((row,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>W${i+1}</td>` +
      row.map(v=>`<td>${v}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
