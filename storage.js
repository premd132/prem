function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.trim().split(/\r?\n/);

    tbody.innerHTML = "";

    // 🔥 FIRST ROW (HEADER) SKIP
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      addRow(cols, i);
    }
  };
  reader.readAsText(file);
}
