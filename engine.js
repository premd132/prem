// ================= HELPER =================

function getLastRows(n=7){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  return rows.slice(-n);
}

function safeCell(row,col){
  return row && row.children[col+1] ? row.children[col+1] : null;
}

// ================= STEP 1: BUILD PATTERNS =================

function buildPatternTemplates(){
  const lastRows = getLastRows(7);
  const templates = [];

  // ---- COLUMN PATTERNS ----
  for(let col=0; col<6; col++){
    let steps=[];
    lastRows.forEach((r,i)=>{
      const td = safeCell(r,col);
      if(!td) return;
      const v = normalizeJodi(td.innerText);
      const fam = getFamily(v);
      if(fam){
        steps.push({row:i,col,fam});
      }
    });
    if(steps.length>=3){
      templates.push({
        type:"column",
        family:steps[0].fam,
        steps
      });
    }
  }

  // ---- DIAGONAL PATTERNS ----
  for(let col=0; col<4; col++){
    let steps=[];
    lastRows.forEach((r,i)=>{
      const td = safeCell(r,col+i);
      if(!td) return;
      const v = normalizeJodi(td.innerText);
      const fam = getFamily(v);
      if(fam){
        steps.push({row:i,col:col+i,fam});
      }
    });
    if(steps.length>=3){
      templates.push({
        type:"diagonal",
        family:steps[0].fam,
        steps
      });
    }
  }

  return templates;
}

// ================= STEP 2: SCAN FULL RECORD =================

function scanFullRecord(templates){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const results=[];

  templates.forEach(tpl=>{
    const matches=[];

    rows.forEach((_,start)=>{
      let found=[];
      let ok=true;

      tpl.steps.forEach(st=>{
        const r = rows[start+st.row];
        if(!r){ ok=false; return; }

        const td = safeCell(r,st.col);
        if(!td){ ok=false; return; }

        const v = normalizeJodi(td.innerText);
        const fam = getFamily(v);
        if(fam!==tpl.family) ok=false;
        else found.push({row:start+st.row,col:st.col});
      });

      if(ok && found.length>=3){
        matches.push({steps:found});
      }
    });

    if(matches.length){
      results.push({
        type:tpl.type,
        family:tpl.family,
        matches
      });
    }
  });

  return results;
}

// ================= STEP 3: UI CHECK LINES =================

function runStep4(){
  const out=document.getElementById("checkLines");
  out.innerHTML="";

  const templates = buildPatternTemplates();
  const results = scanFullRecord(templates);

  if(!results.length){
    out.innerHTML="<i>No pattern found</i>";
    return;
  }

  results.forEach((res,i)=>{
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Pattern ${i+1} (${res.type}) | Family ${res.family} | Matches ${res.matches.length}`;

    div.onclick=()=>{
      const active=div.classList.toggle("active");
      clearDrawing();
      if(active){
        res.matches.forEach(m=>{
          drawMatch(m.steps);
        });
      }
    };
    out.appendChild(div);
  });
}

// ================= STEP 4: DRAW =================

function clearDrawing(){
  document.querySelectorAll("#recordTable td").forEach(td=>{
    td.classList.remove("circle","v-line","d-line");
  });
}

function drawMatch(steps){
  steps.forEach((s,i)=>{
    const td=document.querySelectorAll("#recordTable tbody tr")[s.row]
      .children[s.col+1];
    td.classList.add("circle");
    if(i>0){
      td.classList.add("v-line");
    }
  });
}
