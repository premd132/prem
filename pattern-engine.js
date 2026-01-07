function extractPatterns(rows){
 const last10=rows.slice(-10);
 let patterns=[];

 // column
 for(let c=0;c<6;c++){
  let base=last10.map(r=>normalize(r[c]));
  patterns.push({type:"column",col:c,base});
 }

 // diagonal
 for(let c=0;c<4;c++){
  let base=[];
  for(let i=0;i<6;i++) base.push(normalize(last10[i][c+i]));
  patterns.push({type:"diagonal",col:c,base});
 }

 // zigzag
 for(let c=1;c<5;c++){
  let base=[];
  for(let i=0;i<6;i++){
    base.push(normalize(last10[i][i%2?c-1:c]));
  }
  patterns.push({type:"zigzag",col:c,base});
 }

 return patterns;
}
