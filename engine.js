function clearDrawing(){
  document.querySelectorAll("#recordTable td").forEach(td=>{
    td.classList.remove("circle","highlight");
  });
}

function getValidRows(){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  return rows.filter(r=>{
    return [...r.children].slice(1).some(td=>td.innerText.trim()!=="");
  });
}

function runStep4(){
  clearDrawing();
  const rows=getValidRows();
  if(rows.length<4){
    alert("Kam se kam 4 rows chahiye");
    return;
  }

  const last4 = rows.slice(-4);
  let famCount={};
  let cellMap=[];

  last4.forEach((tr,ri)=>{
    [...tr.children].slice(1).forEach((td,ci)=>{
      const val=td.innerText.trim();
      if(val===""||val==="**") return;
      const fam=getFamily(val);
      if(!fam) return;
      famCount[fam]=(famCount[fam]||0)+1;
      cellMap.push({fam, td});
    });
  });

  const validFams = Object.keys(famCount).filter(f=>famCount[f]>=2);

  const box=document.getElementById("checkLines");
  box.innerHTML="";

  if(validFams.length===0){
    box.innerHTML="<i>No family repeat in last 4 rows</i>";
    return;
  }

  // Circle only matching in last 4 rows
  cellMap.forEach(o=>{
    if(validFams.includes(o.fam)){
      o.td.classList.add("circle");
    }
  });

  validFams.forEach((fam,i)=>{
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Check ${i+1} | Family ${fam}`;
    div.onclick=()=>highlightFamily(fam);
    box.appendChild(div);
  });
}

function highlightFamily(fam){
  clearDrawing();
  const rows=document.querySelectorAll("#recordTable tbody tr");
  rows.forEach(tr=>{
    [...tr.children].slice(1).forEach(td=>{
      const v=td.innerText.trim();
      if(v===""||v==="**") return;
      if(getFamily(v)===fam){
        td.classList.add("highlight");
      }
    });
  });
}
