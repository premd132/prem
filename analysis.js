function runAnalysis() {
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  const rows = document.querySelectorAll("#recordTable tbody tr");
  if (rows.length < 10) {
    box.innerHTML = "Not enough data";
    return;
  }

  const div = document.createElement("div");
  div.innerText = "Analysis Ready (Next step: pattern logic)";
  box.appendChild(div);
}
