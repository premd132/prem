const TOTAL_WEEKS = 300;
const tbody = document.querySelector("#recordTable tbody");

/* 🔴 IMPORTANT:
   Page load par purana data use nahi hoga
   Sirf CSV upload se hi table bharegi
*/

// 🔥 FORCE CLEAR OLD DATA
localStorage.removeItem("recordData");

function loadData() {
  tbody.innerHTML = "";
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    addRow(["", "", "", "", "", ""], i + 1);
  }
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td contenteditable="false">${v}</td>`).join("");
  tbody.appendChild(tr);
}

function enableEdit() {
  tbody.querySelectorAll("td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

function saveData() {
  alert("CSV mode active. Local save disabled.");
}

// Page load
loadData();
