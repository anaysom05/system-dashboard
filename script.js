const metrics = [
  { label: "Workforce Sustainability Index", value: "78", suffix: "/100", change: "▲ 4 pts from Apr", tone: "up", icon: "chart-column", iconClass: "ring" },
  { label: "Burnout Risk (Next 90 Days)", value: "24", suffix: "%", change: "▼ 3 pp from Apr", tone: "up", icon: "user-round", iconClass: "red fill" },
  { label: "Retention Risk", value: "15", suffix: "%", change: "▲ 2 pp from Apr", tone: "down", icon: "users-round", iconClass: "orange" },
  { label: "Sleep Recovery Score", value: "71", suffix: "/100", change: "▲ 5 pts from Apr", tone: "up", icon: "moon", iconClass: "violet fill" },
  { label: "Patient Experience (Press Ganey)", value: "88", suffix: "%", change: "▲ 1 pt from Apr", tone: "up", icon: "heart-pulse", iconClass: "teal" },
  { label: "Est. Annual Turnover Exposure", value: "$3.2", suffix: "M", change: "▲ $420K from Apr", tone: "down", icon: "dollar-sign", iconClass: "green" }
];

const stress = [
  ["Sleep Deficit", 37, "var(--red)"],
  ["Overtime Burden", 24, "var(--orange)"],
  ["Night Shift Frequency", 18, "var(--yellow)"],
  ["Staffing Shortages", 12, "var(--teal)"],
  ["Moral Distress", 9, "var(--violet)"]
];

const staffing = [
  ["Avg Weekly Hours", "58", "<55", "bad"],
  ["Avg Overtime Hours", "8.4", "<5", "bad"],
  ["Night Shifts / Month", "7.2", "<6", "bad"],
  ["Sick Calls (unplanned)", "31", "<20", ""],
  ["Vacancy Rate", "11%", "<8%", "bad"]
];

const stability = [
  ["Turnover Rate (YTD)", "14%", "bad"],
  ["Retention Rate (YTD)", "86%", "good"],
  ["Transfer Requests (YTD)", "9", ""],
  ["FMLA Requests (YTD)", "12", ""],
  ["Open Positions", "41", "bad"]
];

const forecast = [
  ["Residents", 28, "graduation-cap"],
  ["Fellows", 19, "award"],
  ["Nursing", 32, "stethoscope"],
  ["Entire Organization", 26, "users-round"]
];

const heat = [
  ["Emergency Medicine Residents", "High", 5, "red"],
  ["ICU Nursing", "High", 5, "red"],
  ["Surgical Residents", "High", 4, "red"],
  ["Internal Medicine Residents", "Moderate", 3, "orange"],
  ["NICU Nursing", "Moderate", 3, "orange"],
  ["Family Medicine Residents", "Low", 1, "green"],
  ["Outpatient Nursing", "Low", 1, "green"]
];

const programs = [
  ["Family Medicine", 88, "up", "good"],
  ["Pediatrics", 84, "up", "good"],
  ["Internal Medicine", 79, "up", "good"],
  ["Surgery", 71, "down", "bad"],
  ["Emergency Medicine", 66, "down", "bad"]
];

const nurses = [
  ["Oncology", 85, "up", "good"],
  ["Pediatrics", 83, "up", "good"],
  ["Med Surg", 80, "up", "good"],
  ["ICU", 68, "down", "bad"],
  ["Emergency Department", 65, "down", "bad"]
];

const fatigue = [
  ["ICU", 9.1, "var(--red)"],
  ["Trauma", 8.4, "var(--red)"],
  ["Night Float", 7.2, "var(--orange)"],
  ["Inpatient Wards", 5.1, "var(--yellow)"],
  ["Clinic / Ambulatory", 2.8, "var(--green)"]
];

const actions = [
  {
    title: "Emergency Medicine Residency",
    items: ["Burnout risk 39% (High)", "Sleep deficit worsening", "Excessive night shift burden"],
    rec: "Recommended: Schedule review and targeted coaching",
    badge: "circle-alert",
    tone: "red"
  },
  {
    title: "ICU Nursing",
    items: ["Compassion fatigue elevated", "Overtime increased 22%"],
    rec: "Recommended: Additional staffing support",
    badge: "triangle-alert",
    tone: "orange"
  },
  {
    title: "Family Medicine Residency",
    items: ["Strong recovery trends", "Lowest burnout risk"],
    rec: "Recommended: Identify best practices for system-wide adoption",
    badge: "circle-check",
    tone: "green"
  }
];

const patient = [
  ["HCAHPS Score", "91%", "82%", "-9 pts"],
  ["Safety Events (per 1k pt days)", "4", "11", "+175%"],
  ["Medication Errors (per 1k pt days)", "2", "7", "+250%"],
  ["Patient Complaints (per 1k pt days)", "3", "12", "+300%"]
];

const finance = [
  ["Nurse Turnover", "$1,800,000"],
  ["Resident / Fellow Attrition", "$450,000"],
  ["Overtime Expense", "$650,000"],
  ["Vacancy Impact", "$300,000"]
];

const nursingBars = [
  ["Compassion Fatigue Risk", 29, "var(--red)"],
  ["Moral Distress Risk", 22, "var(--orange)"],
  ["Burnout Risk", 31, "var(--red)"],
  ["High Overtime Utilization", 18, "var(--orange)"]
];

const wellbeing = [
  ["Avg Sleep (hours)", "6.1", "▼ 0.3 from Apr", "down", "bed", "violet"],
  ["Stress Index (0–100)", "62", "▼ 4 from Apr", "down", "brain", "orange"],
  ["Recovery Index (0–100)", "71", "▲ 5 from Apr", "up", "heart-pulse", "green"],
  ["Burnout Risk Score (0–100)", "59", "▼ 3 from Apr", "up", "gauge", "red"]
];

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/* Swaps the leading ▲/▼ of a change string for a caret from the icon set, so the
   delta markers stop depending on whatever glyph the system font happens to have. */
function trendText(text) {
  if (text.startsWith("▲")) return icon("caret-up", "solid xs") + text.slice(1);
  if (text.startsWith("▼")) return icon("caret-down", "solid xs") + text.slice(1);
  return text;
}

function renderMetrics() {
  const host = document.querySelector("#metrics");
  host.innerHTML = metrics.map(item => `
    <article class="metric">
      <h2>${item.label}</h2>
      <div class="metric-body">
        <div class="icon ${item.iconClass}">${icon(item.icon)}</div>
        <div>
        <div class="value">${item.value}<small style="display:inline">${item.suffix}</small></div>
        <small class="${item.tone}">${trendText(item.change)}</small>
        </div>
      </div>
    </article>
  `).join("");
}

function renderLegend() {
  const host = document.querySelector("#stressList");
  host.innerHTML = stress.map(([name, value, color]) => `
    <li><span class="dot" style="background:${color}"></span><span>${name}</span><strong>${value}%</strong></li>
  `).join("");
}

/* A row may carry one extra element past the headings: a class ("good"/"bad")
   applied to its value cells. `markFrom` is the first column index that class
   reaches — 1 by default, so every column except the label. Tables where only
   one column carries the signal pass a higher index. */
function renderTable(id, headings, rows, markFrom = 1) {
  const head = `<thead><tr>${headings.map(label => `<th>${label}</th>`).join("")}</tr></thead>`;
  const body = rows.map(row => {
    const marker = row.length > headings.length ? row[headings.length] : "";
    const cells = row.slice(0, headings.length);
    return `<tr>${cells.map((cell, i) => `<td class="${i >= markFrom ? marker : ""}">${cell}</td>`).join("")}</tr>`;
  }).join("");
  document.querySelector(id).innerHTML = head + `<tbody>${body}</tbody>`;
}

function renderForecast() {
  document.querySelector("#forecast").innerHTML = forecast.map(([name, value, iconName]) => `
    <div class="forecast-row">
      <span class="f-name"><span class="f-icon">${icon(iconName)}</span><span>${name}</span></span>
      <div class="bar"><span style="width:${value * 2.4}%"></span></div>
      <strong>${value}%</strong>
    </div>
  `).join("");
}

function renderHeat() {
  document.querySelector("#heat").innerHTML = heat.map(([area, level, count, tone]) => {
    const cells = Array.from({ length: 5 }, (_, i) => `<span class="cell ${i < count ? tone : ""}"></span>`).join("");
    return `<div class="risk-row"><span>${area}</span><span>${level}</span>${cells}</div>`;
  }).join("");
}

function renderRank(id, label, rows) {
  renderTable(
    id,
    [label, "Sustainability Score", "Trend (vs Apr)"],
    rows.map(([name, score, trend, cls]) => [name, score, icon(trend === "up" ? "caret-up" : "caret-down", "solid sm"), cls])
  );
}

function renderFatigue() {
  const rows = fatigue.map(([name, value, color]) => `
    <div class="fat-row">
      <span>${name}</span>
      <div class="bar"><span style="width:${value * 10}%; background:${color}"></span></div>
      <strong>${value}</strong>
    </div>
  `).join("");
  document.querySelector("#fatigueBars").innerHTML = rows + `
    <div class="fat-axis">
      <span></span><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
    </div>
    <div class="fat-scale">
      <span>Low Fatigue</span>
      <span>High Fatigue</span>
    </div>
  `;
}

function renderActions() {
  document.querySelector("#actions").innerHTML = actions.map(item => `
    <section class="action ${item.tone === "orange" ? "warn" : item.tone === "green" ? "ok" : ""}">
      <div>
        <h3>${item.title}</h3>
        <ul>${item.items.map(text => `<li>${text}</li>`).join("")}</ul>
      </div>
      <span class="badge ${item.tone}">${icon(item.badge)}</span>
      <p>${item.rec}</p>
    </section>
  `).join("");
}

function renderTrend() {
  const points = [
    [80, 132, 62, "Dec '23"],
    [138, 120, 65, "Jan '24"],
    [196, 108, 68, "Feb '24"],
    [254, 96, 71, "Mar '24"],
    [312, 116, 66, "Apr '24"],
    [370, 84, 71, "May '24"]
  ];
  document.querySelector("#trendDots").innerHTML = points.map(([x, y, val, label], i) => `
    <circle class="point" cx="${x}" cy="${y}" r="${i === 5 ? 20 : 6}"></circle>
    <text class="label" x="${x - 8}" y="${i === 5 ? y + 5 : y - 13}">${val}</text>
    <text class="label" x="${x - 20}" y="215" style="font-size:10px">${label}</text>
  `).join("");
}

function renderNursing() {
  document.querySelector("#nursingBars").innerHTML = nursingBars.map(([name, value, color]) => `
    <div class="nurse-row">
      <span>${name}</span>
      <strong>${value}%</strong>
      <div class="bar"><span style="width:${value * 2.3}%; background:${color}"></span></div>
    </div>
  `).join("");
}

function renderWellbeing() {
  document.querySelector("#wellbeing").innerHTML = wellbeing.map(([name, value, change, trend, iconName, tone]) => `
    <section class="well">
      <div class="icon soft ${tone}">${icon(iconName)}</div>
      <div>
        <h3>${name}</h3>
        <strong>${value}</strong>
        <small class="${trend}">${trendText(change)}</small>
      </div>
    </section>
  `).join("");
}

renderMetrics();
renderLegend();
renderTable("#staffTable", ["Metric", "Current", "Target"], staffing);
renderTable("#stabilityTable", ["Metric", "Current"], stability);
renderForecast();
renderHeat();
renderRank("#programTable", "Program", programs);
renderRank("#nurseTable", "Unit", nurses);
renderFatigue();
renderActions();
renderTrend();
/* Only the Difference column carries the red signal here — the Low/High Risk
   counts are plain figures. */
renderTable("#patientTable", ["Metric", "Low Risk Units", "High Risk Units", "Difference"], patient.map(row => [...row, "bad"]), 3);
renderTable("#financeTable", ["Category", "Annual Cost"], finance.map(row => [...row, ""]));
renderNursing();
renderWellbeing();
