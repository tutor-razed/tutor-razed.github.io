document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("multiplication-table");
  const themeColorInput = document.getElementById("themeColor");

  function generateTable() {
    table.innerHTML = "";

    const headerRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.textContent = "×";
    headerRow.appendChild(corner);

    for (let c = 1; c <= 12; c++) {
      const th = document.createElement("th");
      th.textContent = c;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let r = 1; r <= 12; r++) {
      const row = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = r;
      row.appendChild(th);

      for (let c = 1; c <= 12; c++) {
        const td = document.createElement("td");
        td.textContent = r * c;
        td.dataset.row = r;
        td.dataset.col = c;
        row.appendChild(td);
      }
      table.appendChild(row);
    }

    addHoverEffects();
    resizeCells();
  }

  function addHoverEffects() {
    table.querySelectorAll("td").forEach(cell => {
      cell.addEventListener("mouseenter", () => highlightCell(cell));
      cell.addEventListener("mouseleave", clearHighlights);
    });
  }

  function highlightCell(cell) {
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    table.querySelectorAll(`tr:nth-child(${parseInt(row)+1}) td, tr:nth-child(${parseInt(row)+1}) th`)
      .forEach(td => td.classList.add("highlight-row"));

    table.querySelectorAll(`td[data-col="${col}"], th:nth-child(${parseInt(col)+1})`)
      .forEach(td => td.classList.add("highlight-col"));

    cell.classList.add("highlight-cell");
  }

  function clearHighlights() {
    table.querySelectorAll(".highlight-row, .highlight-col, .highlight-cell")
      .forEach(td => td.classList.remove("highlight-row", "highlight-col", "highlight-cell"));
  }

  function resizeCells() {
    const totalCells = 13;
    const containerWidth = window.innerWidth * 0.95;
    const containerHeight = window.innerHeight - 150;

    const cellSize = Math.floor(Math.min(containerWidth, containerHeight) / totalCells);

    table.querySelectorAll("th, td").forEach(cell => {
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.fontSize = `${Math.max(12, cellSize * 0.35)}px`;
    });
  }

  function applyThemeColor(color) {
    document.documentElement.style.setProperty('--theme-color', color);
  }

  generateTable();
  applyThemeColor(themeColorInput.value);

  themeColorInput.addEventListener("input", e => applyThemeColor(e.target.value));
  window.addEventListener("resize", resizeCells);
});
