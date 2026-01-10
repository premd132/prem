const tbody=document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    tbody.innerHTML="";
    r.result.split(/\r?\n/).forEach(l=>{
      if(!l.trim()) return;
      const c=l.split(",");
      const tr=document.createElement("tr");
      tr.innerHTML=c.map(v=>`<td>${normalize(v.trim())||""}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  r.readAsText(file);
});

function enableEdit(){
  document.querySelectorAll("#recordTable td")
    .forEach(td=>{td.contentEditable=true;td.classList.add("editable")});
}

function saveData(){
  const data=[];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
    data.push([...tr.children].map(td=>td.innerText.trim()));
  });
  localStorage.setItem("record",JSON.stringify(data));
  alert("Saved");
}

(function load(){
  const d=JSON.parse(localStorage.getItem("record")||"null");
  if(!d) return;
  tbody.innerHTML="";
  d.forEach(r=>{
    const tr=document.createElement("tr");
    tr.innerHTML=r.map(v=>`<td>${v}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
