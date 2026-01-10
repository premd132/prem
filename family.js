function normalize(v){
  if(!v || v==="**") return null;
  return v.toString().padStart(2,"0");
}

function getFamily(v){
  if(!v) return null;
  const fam = {
    "0":["00","05","50","55"],
    "1":["11","16","61","66"],
    "2":["22","27","72","77"],
    "3":["33","38","83","88"],
    "4":["44","49","94","99"]
  };
  return fam[v[0]] ? v[0] : null;
}
