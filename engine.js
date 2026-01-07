/* ===== STEP 3: BUILD PATTERN TEMPLATES ===== */

function getLastRows(count=7){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  return rows.slice(-count);
}

function extractFamilyGrid(lastRows){
  return lastRows.map(tr=>{
    return [...tr.children].slice(1).map(td=>{
      const v=td.innerText.trim();
      return v ? getFamily(v) : null;
    });
  });
}

function buildPatternTemplates(){
  const lastRows=getLastRows(7);
  if(lastRows.length<6) return [];

  const grid=extractFamilyGrid(lastRows);
  const ROWS=grid.length;
  const COLS=6;
  const templates=[];

  // vertical
  for(let c=0;c<COLS;c++){
    let fam=null, steps=[];
    for(let r=0;r<ROWS;r++){
      const f=grid[r][c];
      if(f===null) continue;
      if(fam===null) fam=f;
      if(f===fam) steps.push({row:r,col:c,family:f});
    }
    if(steps.length>=3){
      templates.push({type:"vertical",family:fam,steps});
    }
  }

  // diagonal ↘
  for(let c=0;c<=COLS-3;c++){
    let fam=null, steps=[];
    for(let r=0;r<ROWS && c+r<COLS;r++){
      const f=grid[r][c+r];
      if(f===null) continue;
      if(fam===null) fam=f;
      if(f===fam) steps.push({row:r,col:c+r,family:f});
    }
    if(steps.length>=3){
      templates.push({type:"diagonal",family:fam,steps});
    }
  }

  // zig-zag
  for(let c=0;c<=COLS-2;c++){
    let fam=null, steps=[];
    for(let r=0;r<ROWS;r++){
      const col=(r%2===0)?c:c+1;
      const f=grid[r][col];
      if(f===null) continue;
      if(fam===null) fam=f;
      if(f===fam) steps.push({row:r,col,family:f});
    }
    if(steps.length>=3){
      templates.push({type:"zigzag",family:fam,steps});
    }
  }

  return templates;
}

/* ===== STEP 4: FULL RECORD SCAN ===== */

function scanFullRecord(templates){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const results=[];

  templates.forEach(tpl=>{
    const matches=[];
    rows.forEach((_,startRow)=>{
      let ok=true;
      const found=[];
      tpl.steps.forEach(step=>{
        const r=startRow+step.row;
        if(r>=rows.length){ ok=false; return; }
        const td=rows[r].children[step.col+1];
        const fam=td && td.innerText ? getFamily(td.innerText.trim()) : null;
        if(fam!==tpl.family) ok=false;
        else found.push({row:r,col:step.col});
      });
      if(ok && found.length>=3){
        matches.push({startRow,steps:found});
      }
    });
    if(matches.length){
      results.push({
        type:tpl.type,
        family:tpl.family,
        matchCount:matches.length,
        matches
      });
    }
  });

  return results;
}

/* ===== CHECK LINES UI ===== */

function runStep4(){
  const templates=buildPatternTemplates();
  const results=scanFullRecord(templates);

  const out=document.getElementById("checkLines");
  out.innerHTML="";

  if(results.length===0){
    out.innerHTML="<i>No pattern found</i>";
    return;
  }

  results.forEach((res,i)=>{
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=
      `Pattern ${i+1}: ${res.type} | Family ${res.family} | Matches ${res.matchCount}`;
    div.onclick=()=>div.classList.toggle("active");
    out.appendChild(div);
  });

  console.log("STEP-4 RESULTS:", results);
}
