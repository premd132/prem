const FAMILY_MAP = {
  0:["00","05","50","55"],
  1:["11","16","61","66"],
  2:["22","27","72","77"],
  3:["33","38","83","88"],
  4:["44","49","94","99"],
  5:["55"],
  6:["06","60"],
  7:["07","70"],
  8:["08","80"],
  9:["09","90"]
};

function getFamily(jodi){
  if(!jodi) return null;
  for(const f in FAMILY_MAP){
    if(FAMILY_MAP[f].includes(jodi)) return Number(f);
  }
  return null;
}
