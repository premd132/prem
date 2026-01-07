function clearDrawing(){
  document.querySelectorAll("#recordTable td")
    .forEach(td=>{
      td.classList.remove("circle","line");
    });
}

function getLastRows(count=6){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  return rows.slice(-count);
}

/* STEP 1: MASTER TEMPLATE */
function buildMasterTemplate(){
  const lastRows=getLastRows(6);
  const templates=[];

  for(let col=1;col<=6;col++){
    let seq=[];
    lastRows.forEach(r=>{
      const td=r.children[col];
      const fam=getFamily(td?.innerText.trim());
      if(fam) seq.push({fam,col});
    });

    if(seq.length>=4){
      templates.push({
        type:"column",
        familySeq:seq.map(x=>x.fam),
        steps:seq.map((x,i)=>({row:i,col}))
      });
    }
  }
  return templates;
}

/* STEP 2: FULL RECORD SCAN */
function scanRecord(templates){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const results=[];

  templates.forEach(tpl=>{
    const matches=[];

    for(let r=0;r<rows.length-tpl.familySeq.length;r++){
      let ok=true;
      const found=[];

      tpl.familySeq.forEach((fam,i)=>{
        const td=rows[r+i].children[tpl.steps[i].col];
        const f=getFamily(td?.innerText.trim());
        if(f!==fam) ok=false;
        else found.push({row:r+i,col:tpl.steps[i].col});
      });

      if(ok) matches.push(found);
    }

    if(matches.length){
      results.push({tpl,matches});
    }
  });
  return results;
}

/* STEP 3: DRAW */
function drawMatch(match){
  clearDrawing();
  match.forEach((step,i)=>{
    const td=document.querySelectorAll("#recordTable tbody tr")[step.row]
      .children[step.col];
    td.classList.add("circle");
    if(i>0) td.classList.add("line");
  });
}

/* STEP 4: CHECK LINE UI */
function runStep4(){
  const box=document.getElementById("checkLines");
  box.innerHTML="";

  const templates=buildMasterTemplate();
  const results=scanRecord(templates);

  if(!results.length){
    box.innerHTML="<i>No family pattern found</i>";
    return;
  }

  results.forEach((res,i)=>{
    res.matches.forEach((m,j)=>{
      const div=document.createElement("div");
      div.className="check-line";
      div.innerText=`Pattern ${i+1}.${j+1} | Family Flow`;
      div.onclick=()=>drawMatch(m);
      box.appendChild(div);
    });
  });
}
