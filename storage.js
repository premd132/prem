const tbody=document.querySelector("#recordTable tbody");

function smartSplit(l){
  return l.split(/[,\t ]+/).map(v=>v.trim());
}

document.getElementById("csvFile").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    tbody.innerHTML="";
    const lines=r.result.split(/\r?\n/);
    let w=1;
    for(let i=1;i<lines.length;i++){
      if(!lines[i]) continue;
      const c=smartSplit(lines[i]);
      addRow(c.slice(1,7),w++);
    }
  };
  r.readAsText(f);
});

function addRow(vals,w){
  const tr=document.createElement("tr");
  tr.innerHTML=`<td>W${w}</td>`+vals.map(v=>`<td>${normalize(v)||""}</td>`).join("");
  tbody.appendChild(tr);
}

function enableEdit(){
 document.querySelectorAll("#recordTable td").forEach((td,i)=>{
   if(i%7!==0){td.contentEditable=true;td.classList.add("editable");}
 });
}

function saveData(){
 const d=[];
 document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
  d.push([...tr.children].slice(1).map(td=>normalize(td.innerText)));
 });
 localStorage.setItem("data",JSON.stringify(d));
 alert("Saved");
}

(()=>{
 const s=JSON.parse(localStorage.getItem("data"));
 if(!s) return;
 tbody.innerHTML="";
 s.forEach((r,i)=>addRow(r,i+1));
})();
