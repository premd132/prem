function clearMarks(){
 document.querySelectorAll(".circle,.connect")
  .forEach(td=>td.classList.remove("circle","connect"));
}

function drawMatch(rows,start,p){
 clearMarks();
 for(let i=0;i<p.base.length;i++){
  let col=p.type==="column"?p.col:
          p.type==="diagonal"?p.col+i:
          (i%2?p.col-1:p.col);
  const td=rows[start+i][col].td;
  td.classList.add("circle");
  if(i>0) td.classList.add("connect");
 }
}
