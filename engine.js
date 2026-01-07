function clearDraw(){
  document.querySelectorAll("td")
    .forEach(td=>td.classList.remove("circle","v-line"));
}

function runEngine(){
  clearDraw();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  if(rows.length<7){ alert("Min 7 rows"); return; }

  const last=rows.slice(-7);
  const patterns=[];

  for(let col=1;col<=6;col++){
    let famSeq=[];
    last.forEach(r=>{
      const v=normalize(r.children[col].innerText);
      if(v) famSeq.push(getFamily(v));
    });
    if(famSeq.length>=3){
      patterns.push({type:"Column",col,fam:famSeq});
    }
  }

  const out=document.getElementById("checkLines");
  out.innerHTML="";

  patterns.forEach((p,i)=>{
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Pattern ${i+1} (Column ${p.col})`;
    div.onclick=()=>drawPattern(p);
    out.appendChild(div);
  });
}

function drawPattern(p){
  clearDraw();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  rows.forEach((r,i)=>{
    if(i===0) return;
    const td=r.children[p.col];
    const prev=rows[i-1].children[p.col];
    if(td.innerText!=="**"){
      td.classList.add("circle");
      prev.classList.add("v-line");
    }
  });
}
