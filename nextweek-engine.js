function nextWeekGuess(pattern, rows){
  const freq={};

  for(let i=0;i<rows.length-pattern.base.length;i++){
    let ok=true;
    for(let k=0;k<pattern.base.length-1;k++){
      const a = rows[i+k][pattern.col]?.val;
      const b = pattern.base[k];
      if(b && a && !sameFamily(a,b)){ ok=false; break; }
    }

    if(ok){
      const next = rows[i+pattern.base.length][pattern.col]?.val;
      if(next){
        freq[next]=(freq[next]||0)+1;
      }
    }
  }

  const sorted = Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,2);

  return sorted.map(s=>s[0]);
}
