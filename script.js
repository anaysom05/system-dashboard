/* =========================================================================
   Data model
   -------------------------------------------------------------------------
   Two independent axes drive every visual on the Executive Overview:

   1. FILTER (site scope) — "All Sites", "Main Campus", "North Satellite
      Clinic". Each holds a complete parallel dataset (KPI base values,
      heat map, tables, charts) for that scope.

   2. COMPARE-TO (baseline period) — which prior period this month is being
      measured against. Each holds only the delta/annotation layer (the
      "▲ 4 pts from Apr" style change text + tone, plus the header label
      used in "Trend (vs Apr)").

   `applyState()` merges the active filter's base data with the active
   compare option's deltas into the working `let` variables the render
   functions already read, then re-runs every render function.
   ========================================================================= */

const compareOptions = [
  { id: "apr2024", pillLabel: "Compare to: Apr 1 – Apr 30, 2024", short: "Apr" },
  { id: "mar2024", pillLabel: "Compare to: Mar 1 – Mar 31, 2024", short: "Mar" },
  { id: "may2023", pillLabel: "Compare to: May 1 – May 31, 2023 (YoY)", short: "May '23" }
];

const filterOptions = [
  { id: "all", label: "All Sites (Org-wide)" },
  { id: "main", label: "Main Campus" },
  { id: "north", label: "North Satellite Clinic" }
];

let activeCompareId = "apr2024";
let activeFilterId = "all";

/* ---- Compare-to deltas: metrics/wellbeing change text + tone, per option ---- */

const compareDeltas = {
  apr2024: {
    metrics: [
      { change: "▲ 4 pts from Apr", tone: "up" },
      { change: "▼ 3 pp from Apr", tone: "up" },
      { change: "▲ 2 pp from Apr", tone: "down" },
      { change: "▲ 5 pts from Apr", tone: "up" },
      { change: "▲ 1 pt from Apr", tone: "up" },
      { change: "▲ $420K from Apr", tone: "down" }
    ],
    wellbeing: [
      { change: "▼ 0.3 from Apr", trend: "down" },
      { change: "▼ 4 from Apr", trend: "down" },
      { change: "▲ 5 from Apr", trend: "up" },
      { change: "▼ 3 from Apr", trend: "up" }
    ]
  },
  mar2024: {
    metrics: [
      { change: "▲ 7 pts from Mar", tone: "up" },
      { change: "▼ 6 pp from Mar", tone: "up" },
      { change: "▲ 4 pp from Mar", tone: "down" },
      { change: "▲ 9 pts from Mar", tone: "up" },
      { change: "▲ 2 pts from Mar", tone: "up" },
      { change: "▲ $610K from Mar", tone: "down" }
    ],
    wellbeing: [
      { change: "▼ 0.6 from Mar", trend: "down" },
      { change: "▼ 7 from Mar", trend: "down" },
      { change: "▲ 9 from Mar", trend: "up" },
      { change: "▼ 6 from Mar", trend: "down" }
    ]
  },
  may2023: {
    metrics: [
      { change: "▲ 11 pts from May '23", tone: "up" },
      { change: "▼ 9 pp from May '23", tone: "up" },
      { change: "▼ 3 pp from May '23", tone: "up" },
      { change: "▲ 14 pts from May '23", tone: "up" },
      { change: "▲ 3 pts from May '23", tone: "up" },
      { change: "▼ $180K from May '23", tone: "up" }
    ],
    wellbeing: [
      { change: "▲ 0.4 from May '23", trend: "up" },
      { change: "▼ 11 from May '23", trend: "down" },
      { change: "▲ 13 from May '23", trend: "up" },
      { change: "▼ 10 from May '23", trend: "down" }
    ]
  }
};

/* ---- Filter datasets: full base data per site scope ---------------------- */

const filterDatasets = {
  all: {
    metricsBase: [
      { label: "Workforce Sustainability Index", value: "78", suffix: "/100", icon: "chart-column", iconClass: "ring" },
      { label: "Burnout Risk (Next 90 Days)", value: "24", suffix: "%", icon: "user-round", iconClass: "red fill" },
      { label: "Retention Risk", value: "15", suffix: "%", icon: "users-round", iconClass: "orange" },
      { label: "Sleep Recovery Score", value: "71", suffix: "/100", icon: "moon", iconClass: "violet fill" },
      { label: "Patient Experience (Press Ganey)", value: "88", suffix: "%", icon: "heart-pulse", iconClass: "teal" },
      { label: "Est. Annual Turnover Exposure", value: "$3.2", suffix: "M", icon: "dollar-sign", iconClass: "green" }
    ],
    wellbeingBase: [
      { label: "Avg Sleep (hours)", value: "6.1", icon: "bed", tone: "violet" },
      { label: "Stress Index (0–100)", value: "62", icon: "brain", tone: "orange" },
      { label: "Recovery Index (0–100)", value: "71", icon: "heart-pulse", tone: "green" },
      { label: "Burnout Risk Score (0–100)", value: "59", icon: "gauge", tone: "red" }
    ],
    stress: [
      ["Sleep Deficit", 37, "var(--red)"],
      ["Overtime Burden", 24, "var(--orange)"],
      ["Night Shift Frequency", 18, "var(--yellow)"],
      ["Staffing Shortages", 12, "var(--teal)"],
      ["Moral Distress", 9, "var(--violet)"]
    ],
    staffing: [
      ["Avg Weekly Hours", "58", "<55", "bad"],
      ["Avg Overtime Hours", "8.4", "<5", "bad"],
      ["Night Shifts / Month", "7.2", "<6", "bad"],
      ["Sick Calls (unplanned)", "31", "<20", ""],
      ["Vacancy Rate", "11%", "<8%", "bad"]
    ],
    stability: [
      ["Turnover Rate (YTD)", "14%", "bad"],
      ["Retention Rate (YTD)", "86%", "good"],
      ["Transfer Requests (YTD)", "9", ""],
      ["FMLA Requests (YTD)", "12", ""],
      ["Open Positions", "41", "bad"]
    ],
    forecast: [
      ["Residents", 28, "graduation-cap"],
      ["Fellows", 19, "award"],
      ["Nursing", 32, "user-round"],
      ["Entire Organization", 26, "users-round"]
    ],
    heat: [
      ["Emergency Medicine Residents", "High", 5, "red"],
      ["ICU Nursing", "High", 5, "red"],
      ["Surgical Residents", "High", 4, "red"],
      ["Internal Medicine Residents", "Moderate", 3, "orange"],
      ["NICU Nursing", "Moderate", 3, "orange"],
      ["Family Medicine Residents", "Low", 1, "green"],
      ["Outpatient Nursing", "Low", 1, "green"]
    ],
    programs: [
      ["Family Medicine", 88, "up", "good"],
      ["Pediatrics", 84, "up", "good"],
      ["Internal Medicine", 79, "up", "good"],
      ["Surgery", 71, "down", "bad"],
      ["Emergency Medicine", 66, "down", "bad"]
    ],
    nurses: [
      ["Oncology", 85, "up", "good"],
      ["Pediatrics", 83, "up", "good"],
      ["Med Surg", 80, "up", "good"],
      ["ICU", 68, "down", "bad"],
      ["Emergency Department", 65, "down", "bad"]
    ],
    fatigue: [
      ["ICU", 9.1, "var(--red)"],
      ["Trauma", 8.4, "var(--red)"],
      ["Night Float", 7.2, "var(--orange)"],
      ["Inpatient Wards", 5.1, "var(--yellow)"],
      ["Clinic / Ambulatory", 2.8, "var(--green)"]
    ],
    actions: [
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
    ],
    patient: [
      ["HCAHPS Score", "91%", "82%", "-9 pts"],
      ["Safety Events (per 1k pt days)", "4", "11", "+175%"],
      ["Medication Errors (per 1k pt days)", "2", "7", "+250%"],
      ["Patient Complaints (per 1k pt days)", "3", "12", "+300%"]
    ],
    finance: [
      ["Nurse Turnover", "$1,800,000"],
      ["Resident / Fellow Attrition", "$450,000"],
      ["Overtime Expense", "$650,000"],
      ["Vacancy Impact", "$300,000"]
    ],
    nursingBars: [
      ["Compassion Fatigue Risk", 29, "var(--red)"],
      ["Moral Distress Risk", 22, "var(--orange)"],
      ["Burnout Risk", 31, "var(--red)"],
      ["High Overtime Utilization", 18, "var(--orange)"]
    ],
    recoveryPoints: [
      [80, 132, 62, "Dec '23"],
      [138, 120, 65, "Jan '24"],
      [196, 108, 68, "Feb '24"],
      [254, 96, 71, "Mar '24"],
      [312, 116, 66, "Apr '24"],
      [370, 84, 71, "May '24"]
    ]
  },

  main: {
    metricsBase: [
      { label: "Workforce Sustainability Index", value: "74", suffix: "/100", icon: "chart-column", iconClass: "ring" },
      { label: "Burnout Risk (Next 90 Days)", value: "29", suffix: "%", icon: "user-round", iconClass: "red fill" },
      { label: "Retention Risk", value: "17", suffix: "%", icon: "users-round", iconClass: "orange" },
      { label: "Sleep Recovery Score", value: "68", suffix: "/100", icon: "moon", iconClass: "violet fill" },
      { label: "Patient Experience (Press Ganey)", value: "86", suffix: "%", icon: "heart-pulse", iconClass: "teal" },
      { label: "Est. Annual Turnover Exposure", value: "$2.6", suffix: "M", icon: "dollar-sign", iconClass: "green" }
    ],
    wellbeingBase: [
      { label: "Avg Sleep (hours)", value: "5.8", icon: "bed", tone: "violet" },
      { label: "Stress Index (0–100)", value: "67", icon: "brain", tone: "orange" },
      { label: "Recovery Index (0–100)", value: "66", icon: "heart-pulse", tone: "green" },
      { label: "Burnout Risk Score (0–100)", value: "64", icon: "gauge", tone: "red" }
    ],
    stress: [
      ["Sleep Deficit", 41, "var(--red)"],
      ["Overtime Burden", 27, "var(--orange)"],
      ["Night Shift Frequency", 16, "var(--yellow)"],
      ["Staffing Shortages", 10, "var(--teal)"],
      ["Moral Distress", 6, "var(--violet)"]
    ],
    staffing: [
      ["Avg Weekly Hours", "61", "<55", "bad"],
      ["Avg Overtime Hours", "9.6", "<5", "bad"],
      ["Night Shifts / Month", "7.9", "<6", "bad"],
      ["Sick Calls (unplanned)", "38", "<20", "bad"],
      ["Vacancy Rate", "13%", "<8%", "bad"]
    ],
    stability: [
      ["Turnover Rate (YTD)", "16%", "bad"],
      ["Retention Rate (YTD)", "84%", "good"],
      ["Transfer Requests (YTD)", "12", ""],
      ["FMLA Requests (YTD)", "15", ""],
      ["Open Positions", "29", "bad"]
    ],
    forecast: [
      ["Residents", 33, "graduation-cap"],
      ["Fellows", 22, "award"],
      ["Nursing", 37, "user-round"],
      ["Entire Organization", 29, "users-round"]
    ],
    heat: [
      ["Emergency Medicine Residents", "High", 5, "red"],
      ["ICU Nursing", "High", 5, "red"],
      ["Surgical Residents", "High", 5, "red"],
      ["Internal Medicine Residents", "Moderate", 4, "orange"],
      ["NICU Nursing", "Moderate", 3, "orange"],
      ["Family Medicine Residents", "Moderate", 3, "orange"],
      ["Outpatient Nursing", "Low", 2, "green"]
    ],
    programs: [
      ["Family Medicine", 84, "up", "good"],
      ["Pediatrics", 80, "up", "good"],
      ["Internal Medicine", 74, "down", "bad"],
      ["Surgery", 65, "down", "bad"],
      ["Emergency Medicine", 59, "down", "bad"]
    ],
    nurses: [
      ["Oncology", 81, "up", "good"],
      ["Pediatrics", 78, "up", "good"],
      ["Med Surg", 75, "down", "bad"],
      ["ICU", 62, "down", "bad"],
      ["Emergency Department", 58, "down", "bad"]
    ],
    fatigue: [
      ["ICU", 9.5, "var(--red)"],
      ["Trauma", 9.0, "var(--red)"],
      ["Night Float", 7.8, "var(--orange)"],
      ["Inpatient Wards", 5.6, "var(--yellow)"],
      ["Clinic / Ambulatory", 3.2, "var(--green)"]
    ],
    actions: [
      {
        title: "Emergency Medicine Residency",
        items: ["Burnout risk 44% (High)", "Sleep deficit worsening", "Excessive night shift burden"],
        rec: "Recommended: Schedule review and targeted coaching",
        badge: "circle-alert",
        tone: "red"
      },
      {
        title: "ICU Nursing",
        items: ["Compassion fatigue elevated", "Overtime increased 28%"],
        rec: "Recommended: Additional staffing support",
        badge: "triangle-alert",
        tone: "orange"
      },
      {
        title: "Family Medicine Residency",
        items: ["Comparatively stable trends", "Lowest burnout among main campus programs"],
        rec: "Recommended: Monitor and reassess next cycle",
        badge: "circle-check",
        tone: "green"
      }
    ],
    patient: [
      ["HCAHPS Score", "89%", "78%", "-11 pts"],
      ["Safety Events (per 1k pt days)", "5", "13", "+160%"],
      ["Medication Errors (per 1k pt days)", "3", "8", "+167%"],
      ["Patient Complaints (per 1k pt days)", "4", "14", "+250%"]
    ],
    finance: [
      ["Nurse Turnover", "$1,450,000"],
      ["Resident / Fellow Attrition", "$380,000"],
      ["Overtime Expense", "$540,000"],
      ["Vacancy Impact", "$230,000"]
    ],
    nursingBars: [
      ["Compassion Fatigue Risk", 34, "var(--red)"],
      ["Moral Distress Risk", 25, "var(--orange)"],
      ["Burnout Risk", 36, "var(--red)"],
      ["High Overtime Utilization", 22, "var(--orange)"]
    ],
    recoveryPoints: [
      [80, 148, 58, "Dec '23"],
      [138, 140, 60, "Jan '24"],
      [196, 128, 63, "Feb '24"],
      [254, 120, 65, "Mar '24"],
      [312, 136, 61, "Apr '24"],
      [370, 116, 66, "May '24"]
    ]
  },

  north: {
    metricsBase: [
      { label: "Workforce Sustainability Index", value: "85", suffix: "/100", icon: "chart-column", iconClass: "ring" },
      { label: "Burnout Risk (Next 90 Days)", value: "14", suffix: "%", icon: "user-round", iconClass: "red fill" },
      { label: "Retention Risk", value: "9", suffix: "%", icon: "users-round", iconClass: "orange" },
      { label: "Sleep Recovery Score", value: "79", suffix: "/100", icon: "moon", iconClass: "violet fill" },
      { label: "Patient Experience (Press Ganey)", value: "93", suffix: "%", icon: "heart-pulse", iconClass: "teal" },
      { label: "Est. Annual Turnover Exposure", value: "$0.4", suffix: "M", icon: "dollar-sign", iconClass: "green" }
    ],
    wellbeingBase: [
      { label: "Avg Sleep (hours)", value: "7.0", icon: "bed", tone: "violet" },
      { label: "Stress Index (0–100)", value: "48", icon: "brain", tone: "orange" },
      { label: "Recovery Index (0–100)", value: "81", icon: "heart-pulse", tone: "green" },
      { label: "Burnout Risk Score (0–100)", value: "38", icon: "gauge", tone: "red" }
    ],
    stress: [
      ["Sleep Deficit", 26, "var(--red)"],
      ["Overtime Burden", 17, "var(--orange)"],
      ["Night Shift Frequency", 9, "var(--yellow)"],
      ["Staffing Shortages", 15, "var(--teal)"],
      ["Moral Distress", 5, "var(--violet)"]
    ],
    staffing: [
      ["Avg Weekly Hours", "51", "<55", ""],
      ["Avg Overtime Hours", "3.2", "<5", ""],
      ["Night Shifts / Month", "3.5", "<6", ""],
      ["Sick Calls (unplanned)", "9", "<20", ""],
      ["Vacancy Rate", "7%", "<8%", ""]
    ],
    stability: [
      ["Turnover Rate (YTD)", "8%", "good"],
      ["Retention Rate (YTD)", "92%", "good"],
      ["Transfer Requests (YTD)", "2", ""],
      ["FMLA Requests (YTD)", "3", ""],
      ["Open Positions", "5", ""]
    ],
    forecast: [
      ["Residents", 12, "graduation-cap"],
      ["Fellows", 8, "award"],
      ["Nursing", 17, "user-round"],
      ["Entire Organization", 14, "users-round"]
    ],
    heat: [
      ["Family Medicine Residents", "Low", 2, "green"],
      ["Outpatient Nursing", "Low", 1, "green"],
      ["Internal Medicine Residents", "Low", 2, "green"],
      ["Pediatrics Nursing", "Moderate", 3, "orange"],
      ["Urgent Care Nursing", "Moderate", 3, "orange"]
    ],
    programs: [
      ["Family Medicine", 92, "up", "good"],
      ["Internal Medicine", 88, "up", "good"],
      ["Pediatrics", 87, "up", "good"],
      ["Urgent Care", 81, "up", "good"],
      ["Behavioral Health", 77, "down", "bad"]
    ],
    nurses: [
      ["Outpatient", 90, "up", "good"],
      ["Urgent Care", 85, "up", "good"],
      ["Pediatrics", 84, "up", "good"],
      ["Behavioral Health", 76, "down", "bad"],
      ["Float Pool", 73, "down", "bad"]
    ],
    fatigue: [
      ["Urgent Care", 5.2, "var(--yellow)"],
      ["Float Pool", 4.8, "var(--yellow)"],
      ["Behavioral Health", 4.1, "var(--yellow)"],
      ["Outpatient Clinics", 2.3, "var(--green)"],
      ["Pediatrics", 2.0, "var(--green)"]
    ],
    actions: [
      {
        title: "Behavioral Health Program",
        items: ["Slight uptick in overtime", "Watch caseload growth"],
        rec: "Recommended: Monitor staffing ratios next cycle",
        badge: "triangle-alert",
        tone: "orange"
      },
      {
        title: "Float Pool Nursing",
        items: ["Coverage gaps on weekends"],
        rec: "Recommended: Cross-train 2 additional floats",
        badge: "triangle-alert",
        tone: "orange"
      },
      {
        title: "Family Medicine",
        items: ["Strongest sustainability score site-wide", "Low burnout, high retention"],
        rec: "Recommended: Use as a model for other sites",
        badge: "circle-check",
        tone: "green"
      }
    ],
    patient: [
      ["HCAHPS Score", "95%", "89%", "-6 pts"],
      ["Safety Events (per 1k pt days)", "1", "3", "+200%"],
      ["Medication Errors (per 1k pt days)", "1", "2", "+100%"],
      ["Patient Complaints (per 1k pt days)", "1", "4", "+300%"]
    ],
    finance: [
      ["Nurse Turnover", "$180,000"],
      ["Resident / Fellow Attrition", "$60,000"],
      ["Overtime Expense", "$95,000"],
      ["Vacancy Impact", "$65,000"]
    ],
    nursingBars: [
      ["Compassion Fatigue Risk", 14, "var(--orange)"],
      ["Moral Distress Risk", 9, "var(--teal)"],
      ["Burnout Risk", 15, "var(--orange)"],
      ["High Overtime Utilization", 7, "var(--teal)"]
    ],
    recoveryPoints: [
      [80, 100, 70, "Dec '23"],
      [138, 88, 73, "Jan '24"],
      [196, 80, 75, "Feb '24"],
      [254, 72, 77, "Mar '24"],
      [312, 76, 76, "Apr '24"],
      [370, 56, 81, "May '24"]
    ]
  }
};

/* ---- Working state (populated by applyState) ------------------------------ */

let metrics = [];
let wellbeing = [];
let stress = [];
let staffing = [];
let stability = [];
let forecast = [];
let heat = [];
let programs = [];
let nurses = [];
let fatigue = [];
let actions = [];
let patient = [];
let finance = [];
let nursingBars = [];
let recoveryPoints = [];
let rankTrendLabel = "Apr";

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

function parseCurrency(str) {
  return Number(String(str).replace(/[^0-9.-]/g, "")) || 0;
}

function formatCurrency(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function sumFinance(rows) {
  return rows.reduce((sum, [, cost]) => sum + parseCurrency(cost), 0);
}

/* Builds the alert banner's driver sentence from whichever stress factors and
   heat-map areas are currently highest, so it stays consistent with the rest
   of the page under every filter/compare combination. */
function buildAlertSummary(stressData, heatData) {
  const topStress = [...stressData].sort((a, b) => b[1] - a[1]).slice(0, 3).map(s => s[0].toLowerCase());
  const topHeat = [...heatData].sort((a, b) => b[2] - a[2]).slice(0, 2).map(h => h[0]);
  const driverText = topStress.length > 1
    ? `${topStress.slice(0, -1).join(", ")}, and ${topStress[topStress.length - 1]}`
    : topStress[0];
  const areaText = topHeat.length > 1 ? topHeat.join(" and ") : topHeat[0];
  return `Primary drivers are ${driverText}, concentrated in ${areaText}.`;
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
      <div class="bar"><span style="width:${value * 1.55}%"></span></div>
      <strong>${value}%</strong>
    </div>
  `).join("");
}

function renderHeat() {
  document.querySelector("#heat").innerHTML = heat.map(([area, level, count, tone]) => {
    const cells = Array.from({ length: 5 }, (_, i) => `<span class="cell ${i < count ? tone : ""}"></span>`).join("");
    return `<div class="risk-row"><span>${area}</span><span></span>${cells}</div>`;
  }).join("");
}

function renderRank(id, label, rows) {
  renderTable(
    id,
    [label, "Sustainability Score", `Trend (vs ${rankTrendLabel})`],
    rows.map(([name, score, trend, cls]) => [name, score, icon(trend === "up" ? "caret-up" : "caret-down", "solid sm"), cls])
  );
}

function renderFatigue() {
  const rows = fatigue.map(([name, value, color]) => `
    <div class="fat-row">
      <span>${name}</span>
      <div class="bar"><span style="width:${value * 10}%; background:${color}"></span><strong style="left:${value * 10}%">${value}</strong></div>
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
  document.querySelector("#trendDots").innerHTML = recoveryPoints.map(([x, y, val, label], i) => {
    const final = i === recoveryPoints.length - 1;
    return `
    <circle class="point ${final ? "final" : ""}" cx="${x}" cy="${y}" r="${final ? 20 : 6}"></circle>
    <text class="label ${final ? "final" : ""}" x="${x - 8}" y="${final ? y + 5 : y - 13}">${val}</text>
    <text class="label" x="${x - 20}" y="215" style="font-size:10px">${label}</text>
  `;
  }).join("");
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

function renderFinanceTotal() {
  const target = document.querySelector("#financeTotal");
  if (target) target.textContent = formatCurrency(sumFinance(finance));
}

function renderAlertSummary() {
  const burnout = metrics[1];
  const exposure = metrics[5];
  const pctEl = document.querySelector("#alertBurnoutPct");
  const expEl = document.querySelector("#alertExposure");
  const driversEl = document.querySelector("#alertDrivers");
  if (pctEl && burnout) pctEl.textContent = `${burnout.value}${burnout.suffix}`;
  if (expEl && exposure) expEl.textContent = `${exposure.value}${exposure.suffix}`;
  if (driversEl) driversEl.textContent = buildAlertSummary(stress, heat);
}

/* =========================================================================
   Sidebar tab views
   Each tab regroups the Executive Overview's own boxes by theme and swaps
   them into place — no new content. The builders below rebuild those exact
   boxes as standalone cards from the same working data the Overview uses,
   so they stay in sync whenever applyState() runs.
   ========================================================================= */

function legendInner() {
  return stress.map(([name, value, color]) =>
    `<li><span class="dot" style="background:${color}"></span><span>${name}</span><strong>${value}%</strong></li>`
  ).join("");
}

function tableInner(headings, rows, markFrom = 1) {
  const head = `<thead><tr>${headings.map(label => `<th>${label}</th>`).join("")}</tr></thead>`;
  const body = rows.map(row => {
    const marker = row.length > headings.length ? row[headings.length] : "";
    const cells = row.slice(0, headings.length);
    return `<tr>${cells.map((cell, i) => `<td class="${i >= markFrom ? marker : ""}">${cell}</td>`).join("")}</tr>`;
  }).join("");
  return head + `<tbody>${body}</tbody>`;
}

function rankInner(label, rows) {
  return tableInner(
    [label, "Sustainability Score", `Trend (vs ${rankTrendLabel})`],
    rows.map(([name, score, trend, cls]) => [name, score, icon(trend === "up" ? "caret-up" : "caret-down", "solid sm"), cls])
  );
}

function forecastInner() {
  return forecast.map(([name, value, iconName]) => `
    <div class="forecast-row">
      <span class="f-name"><span class="f-icon">${icon(iconName)}</span><span>${name}</span></span>
      <div class="bar"><span style="width:${value * 1.55}%"></span></div>
      <strong>${value}%</strong>
    </div>`).join("");
}

function heatInner() {
  return heat.map(([area, level, count, tone]) => {
    const cells = Array.from({ length: 5 }, (_, i) => `<span class="cell ${i < count ? tone : ""}"></span>`).join("");
    return `<div class="risk-row"><span>${area}</span><span></span>${cells}</div>`;
  }).join("");
}

function fatigueInner() {
  const rows = fatigue.map(([name, value, color]) => `
    <div class="fat-row">
      <span>${name}</span>
      <div class="bar"><span style="width:${value * 10}%; background:${color}"></span><strong style="left:${value * 10}%">${value}</strong></div>
    </div>`).join("");
  return rows + `
    <div class="fat-axis">
      <span></span><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
    </div>
    <div class="fat-scale">
      <span>Low Fatigue</span>
      <span>High Fatigue</span>
    </div>`;
}

function actionsInner() {
  return actions.map(item => `
    <section class="action ${item.tone === "orange" ? "warn" : item.tone === "green" ? "ok" : ""}">
      <div>
        <h3>${item.title}</h3>
        <ul>${item.items.map(text => `<li>${text}</li>`).join("")}</ul>
      </div>
      <span class="badge ${item.tone}">${icon(item.badge)}</span>
      <p>${item.rec}</p>
    </section>`).join("");
}

function nursingInner() {
  return nursingBars.map(([name, value, color]) => `
    <div class="nurse-row">
      <span>${name}</span>
      <strong>${value}%</strong>
      <div class="bar"><span style="width:${value * 2.3}%; background:${color}"></span></div>
    </div>`).join("");
}

function wellbeingInner() {
  return wellbeing.map(([name, value, change, trend, iconName, tone]) => `
    <section class="well">
      <div class="icon soft ${tone}">${icon(iconName)}</div>
      <div>
        <h3>${name}</h3>
        <strong>${value}</strong>
        <small class="${trend}">${trendText(change)}</small>
      </div>
    </section>`).join("");
}

function trendChartHTML(points) {
  const dots = points.map(([x, y, val, label], i) => {
    const final = i === points.length - 1 ? " final" : "";
    return `
    <circle class="point${final}" cx="${x}" cy="${y}" r="${i === points.length - 1 ? 20 : 6}"></circle>
    <text class="label${final}" x="${x - 8}" y="${i === points.length - 1 ? y + 5 : y - 13}">${val}</text>
    <text class="label" x="${x - 20}" y="215" style="font-size:10px">${label}</text>`;
  }).join("");
  const line = "M" + points.map(([x, y]) => `${x} ${y}`).join(" L ");
  return `
    <svg class="trend-chart" viewBox="0 0 430 230" role="img" aria-label="Recovery trend line chart">
      <path class="axis" d="M50 20V180H410" />
      <path class="gridline" d="M50 20H410M50 60H410M50 100H410M50 140H410M50 180H410" />
      <text class="y-label" x="12" y="25">90</text>
      <text class="y-label" x="12" y="65">80</text>
      <text class="y-label" x="12" y="105">70</text>
      <text class="y-label" x="12" y="145">60</text>
      <text class="y-label" x="12" y="185">50</text>
      <path class="line" d="${line}" />
      <g>${dots}</g>
    </svg>`;
}

/* ---- Standalone cards (same boxes the Overview shows) --------------------- */

function heatCard() {
  return `
    <article class="card heat">
      <div class="head"><div><h2>Workforce Risk Heat Map</h2></div>${icon("info", "info")}</div>
      <div class="heat-key">
        <span>Clinical Area</span><span>Risk Level</span><span>Low</span><span>Moderate</span><span>High</span>
      </div>
      <div>${heatInner()}</div>
      <a href="#">View all units ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function forecastCard() {
  return `
    <article class="card forecast">
      <div class="head"><div><h2>Burnout Risk Forecast</h2><p>Next 90 Days</p></div></div>
      <div>${forecastInner()}</div>
      <a href="#">View detailed forecast ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function driversCard() {
  return `
    <article class="card stress">
      <div class="head"><div><h2>Key Drivers of Workforce Stress</h2><p>Current Month</p></div></div>
      <div class="stress-body">
        <div class="donut" aria-label="Stress driver breakdown"></div>
        <ul class="legend">${legendInner()}</ul>
      </div>
    </article>`;
}

function opsCard() {
  return `
    <article class="card ops">
      <div class="head"><div><h2>Operational Workforce Metrics</h2></div></div>
      <div class="split">
        <div><h3>Staffing &amp; Workload</h3><table>${tableInner(["Metric", "Current", "Target"], staffing)}</table></div>
        <div><h3>Workforce Stability</h3><table>${tableInner(["Metric", "Current"], stability)}</table></div>
      </div>
    </article>`;
}

function programsCard() {
  return `
    <article class="card ranks programs">
      <div class="head"><div><h2>Residents &amp; Fellows</h2><p>Program Sustainability Ranking</p></div></div>
      <table>${rankInner("Program", programs)}</table>
      <a href="#">View all programs ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function fatigueCard() {
  return `
    <article class="card fatigue">
      <div class="head"><div><h2>Rotation Fatigue Analysis</h2><p>Average Fatigue Score</p></div></div>
      <div class="bars">${fatigueInner()}</div>
    </article>`;
}

function nurseRankCard() {
  return `
    <article class="card ranks nurse-rank">
      <div class="head"><div><h2>Nursing Workforce</h2><p>Unit Sustainability Ranking</p></div></div>
      <table>${rankInner("Unit", nurses)}</table>
      <a href="#">View all units ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function nursingIndicatorsCard() {
  return `
    <article class="card nursing">
      <div class="head"><div><h2>Nursing Workforce Indicators</h2><p>Current</p></div></div>
      <div>${nursingInner()}</div>
      <a href="#">View full nursing report ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function recoveryTrendCard() {
  return `
    <article class="card trend">
      <div class="head"><div><h2>Organizational Recovery Trends</h2><p>Recovery Index (0–100)</p></div></div>
      ${trendChartHTML(recoveryPoints)}
    </article>`;
}

function wellbeingCard() {
  return `
    <article class="card wellbeing">
      <div class="head"><div><h2>Wellbeing Snapshot</h2><p>from emPower+</p></div>${icon("info", "info")}</div>
      <div class="well-grid">${wellbeingInner()}</div>
      <a href="#">View wellbeing analytics ${icon("arrow-right", "sm")}</a>
    </article>`;
}

function patientCard() {
  return `
    <article class="card patient">
      <div class="head"><div><h2>Patient Care Impact</h2><p>Higher risk areas compared to lower risk areas</p></div></div>
      <table>${tableInner(["Metric", "Low Risk Units", "High Risk Units", "Difference"], patient.map(row => [...row, "bad"]), 3)}</table>
    </article>`;
}

function financeCard() {
  return `
    <article class="card finance">
      <div class="head"><div><h2>Financial Impact</h2><p>Estimated Annual Workforce Exposure</p></div>${icon("info", "info")}</div>
      <table>${tableInner(["Category", "Annual Cost"], finance.map(row => [...row, ""]))}</table>
      <div class="total"><span>Total Estimated Exposure</span><strong>${formatCurrency(sumFinance(finance))}</strong></div>
    </article>`;
}

function actionsCard() {
  return `
    <article class="card actions">
      <div class="head"><div><h2>Recommended Actions</h2></div>${icon("info", "info")}</div>
      <div>${actionsInner()}</div>
      <a href="#">View all interventions ${icon("arrow-right", "sm")}</a>
    </article>`;
}

/* ---- Compose the tab views and wire in-place switching -------------------- */

function view(id, cols, cards) {
  return `<div class="view" id="${id}"><div class="page-grid ${cols}">${cards.join("")}</div></div>`;
}

function renderViews() {
  document.querySelector("#view-host").innerHTML =
    view("v-risk", "cols-2", [heatCard(), forecastCard()]) +
    view("v-drivers", "cols-2", [driversCard(), opsCard()]) +
    view("v-residents", "cols-2", [programsCard(), fatigueCard()]) +
    view("v-nursing", "cols-2", [nurseRankCard(), nursingIndicatorsCard()]) +
    view("v-recovery", "cols-2", [recoveryTrendCard(), wellbeingCard()]) +
    view("v-patient", "cols-1", [patientCard()]) +
    view("v-finance", "cols-1", [financeCard()]) +
    view("v-interventions", "cols-1", [actionsCard()]);
}

function switchView(id) {
  const target = id && document.getElementById(id);
  if (!target) return;
  document.querySelectorAll(".view").forEach(section => section.classList.toggle("active", section === target));
  document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === id));
  window.scrollTo(0, 0);
}

document.querySelector(".nav").addEventListener("click", event => {
  const button = event.target.closest(".nav-item");
  if (button) switchView(button.dataset.view);
});

/* =========================================================================
   applyState()
   Merges the active filter's base data with the active compare option's
   deltas into the working variables above, then re-runs every render
   function so the entire Executive Overview (plus every sidebar tab)
   reflects the current selection.
   ========================================================================= */

function applyState() {
  const filterData = filterDatasets[activeFilterId];
  const compareData = compareDeltas[activeCompareId];
  const compareMeta = compareOptions.find(o => o.id === activeCompareId);

  metrics = filterData.metricsBase.map((m, i) => ({
    ...m,
    change: compareData.metrics[i].change,
    tone: compareData.metrics[i].tone
  }));
  wellbeing = filterData.wellbeingBase.map((w, i) => [
    w.label,
    w.value,
    compareData.wellbeing[i].change,
    compareData.wellbeing[i].trend,
    w.icon,
    w.tone
  ]);
  stress = filterData.stress;
  staffing = filterData.staffing;
  stability = filterData.stability;
  forecast = filterData.forecast;
  heat = filterData.heat;
  programs = filterData.programs;
  nurses = filterData.nurses;
  fatigue = filterData.fatigue;
  actions = filterData.actions;
  patient = filterData.patient;
  finance = filterData.finance;
  nursingBars = filterData.nursingBars;
  recoveryPoints = filterData.recoveryPoints;
  rankTrendLabel = compareMeta.short;

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
  renderFinanceTotal();
  renderNursing();
  renderWellbeing();
  renderAlertSummary();
  renderViews();
}

/* =========================================================================
   Toolbar controls — Compare-to and Filters dropdowns
   ========================================================================= */

function closeAllMenus() {
  document.querySelectorAll(".dropdown-menu.open").forEach(menu => menu.classList.remove("open"));
  document.querySelectorAll('.pill[aria-expanded="true"]').forEach(button => button.setAttribute("aria-expanded", "false"));
}

function renderCompareMenu() {
  const host = document.querySelector("#compareMenu");
  if (!host) return;
  host.innerHTML = compareOptions.map(opt => `
    <button type="button" class="dropdown-item ${opt.id === activeCompareId ? "active" : ""}" data-compare="${opt.id}">
      <span>${opt.pillLabel.replace("Compare to: ", "")}</span><span class="check">✓</span>
    </button>
  `).join("");
}

function renderFilterMenu() {
  const host = document.querySelector("#filterMenu");
  if (!host) return;
  host.innerHTML = filterOptions.map(opt => `
    <button type="button" class="dropdown-item ${opt.id === activeFilterId ? "active" : ""}" data-filter="${opt.id}">
      <span>${opt.label}</span><span class="check">✓</span>
    </button>
  `).join("");
}

function initToolbarControls() {
  const compareBtn = document.querySelector("#compareBtn");
  const compareMenu = document.querySelector("#compareMenu");
  const compareLabel = document.querySelector("#compareLabel");
  const filterBtn = document.querySelector("#filterBtn");
  const filterMenu = document.querySelector("#filterMenu");
  const filterBadge = document.querySelector("#filterBadge");
  if (!compareBtn || !compareMenu || !filterBtn || !filterMenu) return;

  renderCompareMenu();
  renderFilterMenu();

  compareBtn.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = !compareMenu.classList.contains("open");
    closeAllMenus();
    compareMenu.classList.toggle("open", willOpen);
    compareBtn.setAttribute("aria-expanded", String(willOpen));
  });

  filterBtn.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = !filterMenu.classList.contains("open");
    closeAllMenus();
    filterMenu.classList.toggle("open", willOpen);
    filterBtn.setAttribute("aria-expanded", String(willOpen));
  });

  compareMenu.addEventListener("click", event => {
    const item = event.target.closest("[data-compare]");
    if (!item) return;
    activeCompareId = item.dataset.compare;
    const opt = compareOptions.find(o => o.id === activeCompareId);
    if (compareLabel) compareLabel.textContent = opt.pillLabel;
    renderCompareMenu();
    closeAllMenus();
    applyState();
  });

  filterMenu.addEventListener("click", event => {
    const item = event.target.closest("[data-filter]");
    if (!item) return;
    activeFilterId = item.dataset.filter;
    renderFilterMenu();
    if (filterBadge) filterBadge.hidden = activeFilterId === "all";
    closeAllMenus();
    applyState();
  });

  document.addEventListener("click", () => closeAllMenus());
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAllMenus();
  });
}

initToolbarControls();
applyState();

/* =========================================================================
   Workforce Assistant (chatbot)
   A ChatGPT-style widget scoped to the Executive Overview. The three
   suggested prompts are picked from the month's most notable figures
   (burnout risk areas, top stress driver, financial exposure) and always
   return the same hard-coded answer. Any freeform question — regardless of
   content — cycles through three fixed fallback responses on Enter/Send.
   ========================================================================= */

const chatSuggestions = [
  {
    q: "Which areas are at highest burnout risk?",
    a: "Emergency Medicine Residents and ICU Nursing are both flagged High risk (5/5) on this month's heat map, with Surgical Residents close behind at 4/5. These three areas are the main contributors to the 26% elevated burnout figure org-wide."
  },
  {
    q: "What's driving workforce stress this month?",
    a: "Sleep Deficit is the top driver at 37%, followed by Overtime Burden at 24% and Night Shift Frequency at 18%. Together those three account for nearly 80% of reported stress this month."
  },
  {
    q: "What's the estimated financial exposure?",
    a: "Total estimated annual exposure is $3.2M: $1.8M from nurse turnover, $650K in overtime expense, $450K in resident/fellow attrition, and $300K from vacancy impact — up $420K from April."
  }
];

const chatFallbacks = [
  "Based on this month's data, Emergency Medicine Residents and ICU Nursing remain the two highest-risk areas, both flagged High on the heat map.",
  "The Workforce Sustainability Index is currently 78/100, up 4 points from April, while burnout risk over the next 90 days sits at 24%.",
  "I can speak to workforce risk, stress drivers, staffing, financial exposure, and wellbeing trends from this month's report — try one of the suggestions above, or ask about a specific unit."
];

let chatFallbackIndex = 0;

function addChatMessage(text, sender) {
  const host = document.querySelector("#chatMessages");
  if (!host) return;
  host.appendChild(el("div", `chat-msg ${sender}`, text));
  host.scrollTop = host.scrollHeight;
}

function renderChatSuggestions() {
  const host = document.querySelector("#chatSuggestions");
  if (!host) return;
  host.innerHTML = chatSuggestions.map((item, i) => `<button type="button" class="chat-chip" data-chip="${i}">${item.q}</button>`).join("");
  host.querySelectorAll(".chat-chip").forEach(button => {
    button.addEventListener("click", () => {
      const item = chatSuggestions[Number(button.dataset.chip)];
      addChatMessage(item.q, "user");
      window.setTimeout(() => addChatMessage(item.a, "bot"), 280);
    });
  });
}

function initChatbot() {
  const input = document.querySelector("#chatInput");
  const send = document.querySelector("#chatSend");
  const fab = document.querySelector("#chatFab");
  const panel = document.querySelector("#chatPanel");
  const closeBtn = document.querySelector("#chatPanelClose");
  if (!input || !send || !fab || !panel) return;

  addChatMessage("Hi, I'm your Workforce Assistant. Ask me about this month's data, or tap a suggestion below.", "bot");
  renderChatSuggestions();

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, "user");
    input.value = "";
    const reply = chatFallbacks[chatFallbackIndex % chatFallbacks.length];
    chatFallbackIndex += 1;
    window.setTimeout(() => addChatMessage(reply, "bot"), 280);
  }

  send.addEventListener("click", handleSend);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  });

  /* Floating launcher: toggles the panel open/closed without affecting page
     layout, since both are position:fixed and sit outside the document flow. */
  function setOpen(isOpen) {
    panel.classList.toggle("open", isOpen);
    fab.classList.toggle("open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) window.setTimeout(() => input.focus(), 160);
  }

  fab.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));

  document.addEventListener("click", event => {
    if (!panel.classList.contains("open")) return;
    if (panel.contains(event.target) || fab.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && panel.classList.contains("open")) setOpen(false);
  });
}

initChatbot();
