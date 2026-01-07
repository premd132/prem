function runAnalysis() {
  const rows = Array.from(document.querySelectorAll("#recordTable tbody tr"));

  if (rows.length < 10) {
    alert("At least 10 rows required");
    return;
  }

  // ---- helper ----
  const isValid = v => /^\d{2}$/.test(v);

  // ---- last 10 rows data collect ----
  const last10 = rows.slice(-10).map(tr =>
    Array.from(tr.children)
      .slice(1)
      .map(td => td.innerText.trim())
  );

  // ---- check: at least ONE valid value per row ----
  const usable = last10.every(row =>
    row.some(v => isValid(v))
  );

  if (!usable) {
    alert("Invalid data in last 10 rows");
    return;
  }

  // ---- clear old lines ----
  document.getElementById("checkLines").innerHTML = "";

  // ---- build simple column pattern (base) ----
  const patterns = [];

  for (let col = 0; col < 6; col++) {
    const seq = last10
      .map(r => r[col])
      .filter(v => isValid(v));

    if (seq.length >= 3) {
      patterns.push({ col, seq });
    }
  }

  if (patterns.length === 0) {
    alert("No usable pattern found");
    return;
  }

  // ---- show check lines ----
  patterns.forEach((p, idx) => {
    const div = document.createElement("div");
    div.className = "check-line";
    div.innerText = `PATTERN ${idx + 1} | Column ${p.col + 1} | ${p.seq.join(" → ")}`;

    div.onclick = () => toggleHighlight(p.col, p.seq);
    document.getElementById("checkLines").appendChild(div);
  });
}

// ================= HIGHLIGHT =================
function toggleHighlight(col, seq) {
  const rows = Array.from(document.querySelectorAll("#recordTable tbody tr"));

  rows.forEach(tr => {
    const td = tr.children[col + 1];
    if (!td) return;

    if (seq.includes(td.innerText.trim())) {
      td.classList.toggle("circle");
      td.classList.toggle("connect-top");
    }
  });
}
