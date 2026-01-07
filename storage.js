const tbody = document.querySelector("#recordTable tbody");

function pad(v){
  if(v==="**" || v==="") return null;
  v = v.trim();
  if(v.length===1) return "0"+v;
  return v;
}

document.getElementById("csvFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    const lines = reader.result.split(/\r?\n/);
    tbody.innerHTML="";
    for(let i=1;i<lines.length;i++){
      if(!lines[i].trim()) continue;
      const cols = lines[i].split(",");
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>W${i}</td>`+
        cols.slice(0,6).map(v=>`<td>${pad(v)??""}</td>`).join("");
      tbody.appendChild(tr);
    }
  };
  reader.readAsText(file);
});

function enableEdit(){
  document.querySelectorAll("#recordTable td")
    .forEach((td,i)=>{
      if(i%7!==0){
        td.contentEditable=true;
        td.classList.add("editable");
      }
    });
}

function saveData(){
  const data=[];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
    data.push([...tr.children].slice(1).map(td=>td.innerText.trim()));
  });
  localStorage.setItem("recordData",JSON.stringify(data));
  alert("Saved");
}

(function(){
  const saved=JSON.parse(localStorage.getItem("recordData"));
  if(!saved) return;
  tbody.innerHTML="";
  saved.forEach((row,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>W${i+1}</td>`+row.map(v=>`<td>${v}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
