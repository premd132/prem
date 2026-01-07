function renderAI(patterns){
  const p=document.getElementById("aiPanel");
  const count=Object.keys(patterns).length;
  const strength=Math.min(100,count*15);
  const fam=Object.keys(patterns)[0]?.split("-")[1]||"N/A";

  p.innerHTML=`
  <div style="border:1px solid #ccc;padding:8px">
  <b>Prediction Strength:</b> ${strength}%<br>
  <b>Next Week Family Guess:</b> ${fam}<br>
  <small>AI is probability based</small>
  </div>`;
}
