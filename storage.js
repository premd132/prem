const tbody = document.querySelector("#recordTable tbody");

function normalize(v){
  if(!v || v==="**") return null;
  v=v.trim();
  if(v.length===1) return "0"+v;
  return v;
}

document.getElementById("csvFile").addEventListener("change",e=>{
  const f=e.target.files[0];
  if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    tbody.innerHTML="";
    r.result.split(/\r?\n/).slice(1).forEach((l,i)=>{
      if(!l.trim()) return;
      const c=l.split(",");
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>W${i+1}</td>`+
        c.slice(0,6).map(v=>`<td>${normalize(v)||""}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  r.readAsText(f);
});

function enableEdit(){
  document.querySelectorAll("#recordTable td")
  .forEach((td,i)=>{ if(i%7!==0){ td.contentEditable=true; td.classList.add("editable") }});
}

function saveData(){
  const data=[...tbody.querySelectorAll("tr")].map(tr=>
    [...tr.children].slice(1).map(td=>td.innerText)
  );
  localStorage.setItem("record",JSON.stringify(data));
  alert("Saved");
}

(function load(){
  const d=JSON.parse(localStorage.getItem("record")||"null");
  if(!d) return;
  tbody.innerHTML="";
  d.forEach((r,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>W${i+1}</td>`+
      r.map(v=>`<td>${v}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
