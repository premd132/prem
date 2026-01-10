function runStep4() {
  const table = document.querySelector("#recordTable");
  const rows = [...table.querySelectorAll("tbody tr")];

  // ---- 1) Last valid rows (no **, no blank)
  const validRows = rows.filter(r => {
    return [...r.children].slice(1).some(td => {
      const v = td.innerText.trim();
      return v !== "" && v !== "**";
    });
  });

  if (validRows.length < 4) {
    document.getElementById("checkLines").innerHTML = "Not enough valid rows";
    return;
  }

  const last4 = validRows.slice(-4);

  // ---- 2) Read column wise values from last 4 rows
  const colCount = last4[0].children.length - 1; // skip week col
  let patterns = [];

  for (let c = 0; c < colCount; c++) {
    let vals = last4.map(r => r.children[c+1].innerText.trim());

    if (vals.some(v => v==="" || v==="**")) continue;

    // ---- 3) Convert to family
    let fams = vals.map(v => getFamily(v));

    // same jodi / same family / palti allowed
    let ok = false;
    for (let i=0;i<fams.length;i++){
      for (let j=i+1;j<fams.length;j++){
        if (fams[i] && fams[i]===fams[j]) ok=true;
      }
    }

    if (ok) {
      patterns.push({col:c, fams, vals});
    }
  }

  // ---- 4) Clear old marks
  table.querySelectorAll(".circle").forEach(td=>td.classList.remove("circle"));

  // ---- 5) Search same vertical pattern in whole table
  let results = [];
  patterns.forEach(p=>{
    for (let r=0;r<validRows.length-3;r++){
      let block = validRows.slice(r,r+4);
      let famBlock = block.map(row=>{
        let v = row.children[p.col+1].innerText.trim();
        if(v===""||v==="**") return null;
        return getFamily(v);
      });
      if(famBlock.some(x=>!x)) continue;

      let match=true;
      for(let i=0;i<4;i++){
        if(famBlock[i]!==p.fams[i]) match=false;
      }
      if(match){
        block.forEach(row=>{
          row.children[p.col+1].classList.add("circle");
        });
        results.push(`Column ${p.col+1} | Rows ${r+1}-${r+4}`);
      }
    }
  });

  // ---- 6) Show check lines
  const box = document.getElementById("checkLines");
  if(results.length===0){
    box.innerHTML = "No pattern found";
  } else {
    box.innerHTML = results.map((r,i)=>`Check ${i+1}: ${r}`).join("<br>");
  }
}
