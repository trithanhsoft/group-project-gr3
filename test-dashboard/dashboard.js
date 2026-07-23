document.addEventListener("DOMContentLoaded", () => {
  // Fetch dynamic results
  fetch("test-results.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load test-results.json");
      return res.json();
    })
    .then((data) => {
      renderDashboard(data);
    })
    .catch((err) => {
      console.error("Error loading dashboard data:", err);
    });
});

function renderDashboard(data) {
  // 1. Render Overview
  document.getElementById("stat-total").textContent = data.overview.total;
  document.getElementById("stat-passed").textContent = data.overview.passed;
  document.getElementById("stat-failed").textContent = data.overview.failed;
  document.getElementById("stat-rate").textContent = data.overview.passRate;
  document.getElementById("stat-time").textContent = data.overview.executionTime;

  // 2. Render Coverage Rings
  updateRing("ring-statements", "pct-statements", data.coverage.statements);
  updateRing("ring-branches", "pct-branches", data.coverage.branches);
  updateRing("ring-functions", "pct-functions", data.coverage.functions);
  updateRing("ring-lines", "pct-lines", data.coverage.lines);

  // 3. Render Test Types
  const totalTypes = data.overview.total;
  updateBar("bar-unit", "count-unit", data.testTypes.unit, totalTypes);
  updateBar("bar-api", "count-api", data.testTypes.api, totalTypes);
  updateBar("bar-ui", "count-ui", data.testTypes.ui, totalTypes);

  // 4. Render Module Breakdown Grid
  const moduleGrid = document.getElementById("module-grid-container");
  moduleGrid.innerHTML = "";
  Object.keys(data.modules).forEach((mod) => {
    const card = document.createElement("div");
    card.className = "module-item";
    card.innerHTML = `
      <span class="module-name">${mod}</span>
      <span class="module-val">${data.modules[mod]}</span>
    `;
    moduleGrid.appendChild(card);
  });

  // 5. Render Defects
  document.getElementById("defect-total").textContent = data.defects.total;
  document.getElementById("defect-crit").textContent = data.defects.critical;
  document.getElementById("defect-high").textContent = data.defects.high;
  document.getElementById("defect-med").textContent = data.defects.medium;
  document.getElementById("defect-low").textContent = data.defects.low;

  // 6. Render Executions Table
  const tbody = document.getElementById("executions-tbody");
  tbody.innerHTML = "";
  data.recentExecutions.forEach((exe) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${exe.tcId}</strong></td>
      <td>${exe.module}</td>
      <td>${exe.scenario}</td>
      <td>${exe.expected}</td>
      <td>${exe.actual}</td>
      <td><span class="status-tag ${exe.status.toLowerCase()}">${exe.status}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function updateRing(ringId, textId, pct) {
  const ring = document.getElementById(ringId);
  const text = document.getElementById(textId);
  if (!ring || !text) return;

  const percentage = parseFloat(pct);
  text.textContent = `${percentage.toFixed(1)}%`;

  // Circumference = 2 * PI * R = 2 * PI * 40 = 251.2
  const circ = 251.2;
  const offset = circ - (percentage / 100) * circ;
  
  // Set stroke attributes
  ring.style.strokeDasharray = `${circ}`;
  ring.style.strokeDashoffset = `${offset}`;
}

function updateBar(barId, countId, count, total) {
  const bar = document.getElementById(barId);
  const countSpan = document.getElementById(countId);
  if (!bar || !countSpan) return;

  countSpan.textContent = count;
  const pct = total > 0 ? (count / total) * 100 : 0;
  bar.style.width = `${pct}%`;
}
