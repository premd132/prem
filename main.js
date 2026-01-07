function runAnalysis(){
 clearMarks();
 const trs=[...document.querySelectorAll("#recordTable tbody tr")];
 const rows=trs.map(tr=>[...tr.children].slice(1).map(td=>({
   val:normalize(td.innerText), td
 })));

 const out=document.getElementById("checkLines");
 out.innerHTML="";

 if(rows.length<10){alert("Need 10 rows");return;}

 const patterns=extractPatterns(rows.map(r=>r.map(c=>c.val)));

 patterns.forEach((p,i)=>{
  for(let r=0;r<=rows.length-p.base.length;r++){
   let ok=true;
   for(let k=0;k<p.base.length;k++){
    const a=p.base[k];
    const b=rows[r+k][p.type==="column"?p.col:
                     p.type==="diagonal"?p.col+k:
                     (k%2?p.col-1:p.col)].val;
    if(a&&b&&!sameFamily(a,b)){ok=false;break;}
   }
   if(ok){
    const d=document.createElement("div");
    d.className="check-line";
    d.innerText=`Pattern ${i+1} (${p.type}) @ W${r+1}`;
    d.onclick=()=>drawMatch(rows,r,p);
    out.appendChild(d);
   }
  }
 });
}
