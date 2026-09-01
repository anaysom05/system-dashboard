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
        <div class="value">${item.value}<small style="display:inline; white-space:nowrap">${item.suffix}</small></div>
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

/* ---- Secondary chart cards: extra graphs for the sidebar tabs -------------
   These derive additional visuals from the same working data the primary
   cards above use — bar comparisons and donuts — so every tab gets more
   than a single table/chart without inventing new datasets. Deliberately
   kept to 2 extra cards per tab (4 total, or 2 total for the single-card
   tabs) so no tab approaches the density of the Executive Overview. */

function donutHTML(items) {
  const total = items.reduce((sum, [, value]) => sum + value, 0) || 1;
  let acc = 0;
  const stops = items.map(([, value, color]) => {
    const start = (acc / total) * 100;
    acc += value;
    const end = (acc / total) * 100;
    return `${color} ${start}% ${end}%`;
  }).join(", ");
  const legend = items.map(([label, value, color]) => `
    <li><span class="dot" style="background:${color}"></span><span>${label}</span><strong>${Math.round((value / total) * 100)}%</strong></li>
  `).join("");
  return `
    <div class="stress-body">
      <div class="donut" style="background:conic-gradient(${stops})"></div>
      <ul class="legend">${legend}</ul>
    </div>`;
}

function barListHTML(rows, maxValue, unit = "") {
  return rows.map(([name, value, color]) => `
    <div class="nurse-row">
      <span>${name}</span>
      <strong>${value}${unit}</strong>
      <div class="bar"><span style="width:${Math.min(100, (parseFloat(value) / maxValue) * 100)}%; background:${color}"></span></div>
    </div>`).join("");
}

function barListCard(title, subtitle, bodyHTML) {
  return `
    <article class="card">
      <div class="head"><div><h2>${title}</h2><p>${subtitle}</p></div></div>
      <div class="bars">${bodyHTML}</div>
    </article>`;
}

/* Workforce Risk tab — risk-level mix, plus the lowest-scoring programs/units */
function riskDistributionCard() {
  const counts = {};
  heat.forEach(([, level]) => { counts[level] = (counts[level] || 0) + 1; });
  const items = [
    ["High Risk Areas", counts.High || 0, "var(--red)"],
    ["Moderate Risk Areas", counts.Moderate || 0, "var(--orange)"],
    ["Low Risk Areas", counts.Low || 0, "var(--green)"]
  ].filter(([, value]) => value > 0);
  return `
    <article class="card">
      <div class="head"><div><h2>Risk Level Distribution</h2><p>Share of Clinical Areas</p></div></div>
      ${donutHTML(items)}
    </article>`;
}

function topRiskCard() {
  const combined = [
    ...programs.map(([name, score]) => [`${name} (Program)`, score]),
    ...nurses.map(([name, score]) => [`${name} (Unit)`, score])
  ].sort((a, b) => a[1] - b[1]).slice(0, 5);
  const rows = combined.map(([name, score]) => [name, score, score < 70 ? "var(--red)" : score < 80 ? "var(--orange)" : "var(--green)"]);
  return barListCard("Lowest Sustainability Scores", "Programs & Units Needing Attention", barListHTML(rows, 100));
}

/* Workforce Drivers tab — retention/turnover split, staffing load vs target */
function stabilitySplitCard() {
  const turnover = stability.find(row => /turnover/i.test(row[0]));
  const retention = stability.find(row => /retention/i.test(row[0]));
  const items = [
    [retention ? retention[0] : "Retention Rate", parseFloat(retention ? retention[1] : 0), "var(--green)"],
    [turnover ? turnover[0] : "Turnover Rate", parseFloat(turnover ? turnover[1] : 0), "var(--red)"]
  ];
  return `
    <article class="card">
      <div class="head"><div><h2>Workforce Stability Split</h2><p>Retention vs. Turnover (YTD)</p></div></div>
      ${donutHTML(items)}
    </article>`;
}

function staffingLoadCard() {
  const rows = staffing
    .filter(([, , target]) => target && /\d/.test(target))
    .map(([label, current, target]) => {
      const currentNum = parseFloat(current);
      const targetNum = parseFloat(target.replace(/[^0-9.]/g, "")) || 1;
      const pct = (currentNum / targetNum) * 100;
      const display = String(current).includes("%") ? current : currentNum;
      const color = currentNum > targetNum ? "var(--red)" : "var(--green)";
      return [label, display, pct, color];
    });
  const body = rows.map(([label, display, pct, color]) => `
    <div class="nurse-row">
      <span>${label}</span>
      <strong>${display}</strong>
      <div class="bar"><span style="width:${Math.min(100, pct)}%; background:${color}"></span></div>
    </div>`).join("");
  return barListCard("Staffing Load vs. Target", "Current Value as % of Target Threshold", body);
}

/* Residents & Fellows tab — score comparison bars, resident/fellow forecast */
function programsBarCard() {
  const rows = programs.map(([name, score, trend]) => [name, score, trend === "up" ? "var(--green)" : "var(--red)"]);
  return barListCard("Program Sustainability Scores", "Current Month", barListHTML(rows, 100));
}

function residentForecastCard() {
  const rows = forecast
    .filter(([name]) => /resident|fellow/i.test(name))
    .map(([name, value]) => [name, value, "var(--red)"]);
  return barListCard("Burnout Risk Forecast", "Residents & Fellows — Next 90 Days", barListHTML(rows, 50, "%"));
}

/* Nursing Workforce tab — unit score comparison, nursing vs org-wide forecast */
function nursesBarCard() {
  const rows = nurses.map(([name, score, trend]) => [name, score, trend === "up" ? "var(--green)" : "var(--red)"]);
  return barListCard("Unit Sustainability Scores", "Current Month", barListHTML(rows, 100));
}

function nursingForecastCompareCard() {
  const nursing = forecast.find(row => /^nursing$/i.test(row[0]));
  const org = forecast.find(row => /organization/i.test(row[0]));
  const rows = [
    [nursing ? nursing[0] : "Nursing", nursing ? nursing[1] : 0, "var(--red)"],
    [org ? org[0] : "Entire Organization", org ? org[1] : 0, "var(--orange)"]
  ];
  return barListCard("Nursing vs. Org-Wide Forecast", "Burnout Risk — Next 90 Days", barListHTML(rows, 50, "%"));
}

/* Recovery & Wellbeing tab — normalized components, fatigue-band mix */
function wellbeingComponentsCard() {
  const rows = wellbeing.map(([name, value, , , , tone]) => {
    const num = parseFloat(value);
    const isSleep = name.includes("Sleep");
    const pct = isSleep ? Math.min(100, (num / 8) * 100) : num;
    return [name, isSleep ? `${value} hrs` : value, pct, `var(--${tone})`];
  });
  const body = rows.map(([label, display, pct, color]) => `
    <div class="nurse-row">
      <span>${label}</span>
      <strong>${display}</strong>
      <div class="bar"><span style="width:${pct}%; background:${color}"></span></div>
    </div>`).join("");
  return barListCard("Wellbeing Components", "Normalized to a 0–100 Scale", body);
}

function fatigueDistributionCard() {
  const bands = { High: 0, Moderate: 0, Low: 0 };
  fatigue.forEach(([, value]) => {
    if (value >= 7) bands.High += 1;
    else if (value >= 4) bands.Moderate += 1;
    else bands.Low += 1;
  });
  const items = [
    ["High Fatigue (7–10)", bands.High, "var(--red)"],
    ["Moderate Fatigue (4–7)", bands.Moderate, "var(--orange)"],
    ["Low Fatigue (0–4)", bands.Low, "var(--green)"]
  ].filter(([, value]) => value > 0);
  return `
    <article class="card">
      <div class="head"><div><h2>Fatigue Level Distribution</h2><p>Care Settings by Band</p></div></div>
      ${donutHTML(items)}
    </article>`;
}

/* Patient Impact tab — risk-adjusted % difference by metric */
function patientDifferenceCard() {
  const rows = patient.map(([label, , , diff]) => [label, diff]);
  const maxAbs = Math.max(...rows.map(([, diff]) => Math.abs(parseFloat(diff)))) || 1;
  const body = rows.map(([label, diff]) => {
    const pct = Math.min(100, (Math.abs(parseFloat(diff)) / maxAbs) * 100);
    const display = diff.replace("+", "").trim();
    return `
    <div class="nurse-row">
      <span>${label}</span>
      <strong>${display}</strong>
      <div class="bar"><span style="width:${pct}%; background:var(--red)"></span></div>
    </div>`;
  }).join("");
  return barListCard("Risk-Adjusted Impact", "% Difference, High- vs Low-Risk Units", body);
}

/* Financial Impact tab — cost breakdown donut */
function financeDonutCard() {
  const palette = ["var(--red)", "var(--orange)", "var(--yellow)", "var(--teal)", "var(--violet)"];
  const items = finance.map(([label, cost], i) => [label, parseCurrency(cost), palette[i % palette.length]]);
  return `
    <article class="card">
      <div class="head"><div><h2>Cost Breakdown</h2><p>Share of Total Exposure</p></div></div>
      ${donutHTML(items)}
    </article>`;
}

/* Interventions tab — ranked list of areas most needing attention */
function interventionPriorityCard() {
  const rows = [...heat].sort((a, b) => b[2] - a[2]).slice(0, 5);
  const body = rows.map(([area, , count, tone]) => `
    <div class="nurse-row">
      <span>${area}</span>
      <strong>${count}/5</strong>
      <div class="bar"><span style="width:${(count / 5) * 100}%; background:var(--${tone})"></span></div>
    </div>`).join("");
  return barListCard("Areas Needing Attention", "Ranked by Current Risk Score", body);
}

/* ---- Compose the tab views and wire in-place switching -------------------- */

function view(id, cols, cards) {
  return `<div class="view" id="${id}"><div class="page-grid ${cols}">${cards.join("")}</div></div>`;
}

function renderViews() {
  /* renderViews() fully replaces #view-host's contents, so whichever tab was
     on screen before this call loses its "active" class in the process
     (the freshly generated markup never carries it). Capture it first and
     re-apply afterward, so changing Compare-to/Filters while looking at a
     subpanel keeps that subpanel visible — with freshly updated data —
     instead of it silently going blank. */
  const currentlyActive = document.querySelector(".view.active");
  const activeId = currentlyActive ? currentlyActive.id : "v-overview";

  document.querySelector("#view-host").innerHTML =
    view("v-risk", "cols-2", [heatCard(), forecastCard(), riskDistributionCard(), topRiskCard()]) +
    view("v-drivers", "cols-2", [driversCard(), opsCard(), stabilitySplitCard(), staffingLoadCard()]) +
    view("v-residents", "cols-2", [programsCard(), fatigueCard(), programsBarCard(), residentForecastCard()]) +
    view("v-nursing", "cols-2", [nurseRankCard(), nursingIndicatorsCard(), nursesBarCard(), nursingForecastCompareCard()]) +
    view("v-recovery", "cols-2", [recoveryTrendCard(), wellbeingCard(), wellbeingComponentsCard(), fatigueDistributionCard()]) +
    view("v-patient", "cols-2", [patientCard(), patientDifferenceCard()]) +
    view("v-finance", "cols-2", [financeCard(), financeDonutCard()]) +
    view("v-interventions", "cols-2", [actionsCard(), interventionPriorityCard()]);

  setActiveView(activeId);
}

/* Toggles which .view is shown and which nav item is highlighted, without
   touching scroll position — used both by real navigation (switchView,
   below) and to silently re-apply whichever tab was already open after
   renderViews() rebuilds the tab markup from scratch. */
function setActiveView(id) {
  const target = id && document.getElementById(id);
  if (!target) return;
  document.querySelectorAll(".view").forEach(section => section.classList.toggle("active", section === target));
  document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === id));
}

function switchView(id) {
  /* Belt-and-suspenders alongside hiding the nav button itself in
     applyRolePermissions() — even if this view were reached some other
     way, a CEO session never actually shows Scheduling. */
  if (id === "v-scheduling" && currentRole === "ceo") return;
  const target = id && document.getElementById(id);
  if (!target) return;
  setActiveView(id);
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
    if (filterBadge) filterBadge.classList.toggle("visible", activeFilterId !== "all");
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
   AI Chief Wellness Officer (chatbot)
   A ChatGPT-style widget scoped to the Executive Overview. Ten topic
   categories are shown as chips (top 3 first, the rest behind a "+N more"
   toggle); picking a category either asks its one sample question directly,
   or — for categories with more than one — reveals those questions as a
   second level of chips first. Every sample question returns the same
   hard-coded, pre-written answer. Any freeform question — regardless of
   content — cycles through three fixed fallback responses on Enter/Send.
   ========================================================================= */

const chwoCategories = [
  {
    id: "workforce-risk",
    title: "Workforce Risk Intelligence",
    questions: [
      {
        q: "Which departments need my attention today?",
        a: "<strong>Priority Workforce Risk Summary</strong><br><br>" +
           "<strong>1. Emergency Medicine</strong> — Risk Level: <strong>HIGH ▲</strong><br>" +
           "• Burnout risk increased 18% over the last 14 days<br>" +
           "• Sleep debt has increased 22%<br>" +
           "• Night shift physicians account for 80% of elevated risk<br>" +
           "• Risk of turnover estimated at 2.4x baseline<br><br>" +
           "<strong>Recommended Actions:</strong><br>" +
           "✓ Review upcoming shift schedule<br>" +
           "✓ Add recovery day after overnight blocks<br>" +
           "✓ Conduct leadership listening session"
      },
      {
        q: "What emerging problems have appeared this week?",
        a: "<strong>New Workforce Trends Detected</strong><br><br>" +
           "<strong>Anesthesia Department</strong><br>" +
           "• Stress levels increased 12%<br>" +
           "• HRV declined across 63% of staff<br>" +
           "• EHR documentation burden increased 27%<br>" +
           "• Pattern first emerged 9 days ago<br><br>" +
           "<strong>Likely Root Cause:</strong> Recent staffing shortages have increased schedule compression.<br>" +
           "<strong>Confidence:</strong> 86%<br><br>" +
           "<strong>Recommended Intervention:</strong> Temporary schedule adjustments and supplemental coverage."
      }
    ]
  },
  {
    id: "retention-risk",
    title: "Retention Risk Prediction",
    questions: [
      {
        q: "Who is most likely to leave in the next 6 months?",
        a: "<strong>Retention Risk Forecast</strong><br><br>" +
           "<strong>Current High-Risk Population:</strong> 14 clinicians<br>" +
           "<strong>Projected Departure Risk:</strong> 22% within 6 months<br><br>" +
           "<strong>Primary Drivers:</strong><br>" +
           "• Consecutive night shifts<br>" +
           "• Reduced PTO usage<br>" +
           "• Rising emotional exhaustion<br>" +
           "• Persistent after-hours documentation<br><br>" +
           "<strong>Potential Financial Exposure:</strong> $2.3M replacement cost<br><br>" +
           "<em>Individual names are withheld here — an authorized leader can drill down to employee-level access.</em>"
      },
      {
        q: "What factors are driving retention risk?",
        a: "<strong>Top Retention Drivers</strong><br><br>" +
           "1. Schedule Instability — 31%<br>" +
           "2. Documentation Burden — 24%<br>" +
           "3. Sleep Deficiency — 18%<br>" +
           "4. Staffing Shortages — 16%<br>" +
           "5. Work-Life Conflict — 11%<br><br>" +
           "<strong>Biggest Opportunity:</strong> Reducing last-minute schedule changes by 20% may decrease turnover risk by approximately 9%."
      }
    ]
  },
  {
    id: "exec-summary",
    title: "Executive Workforce Summary",
    questions: [
      {
        q: "Give me a five-minute executive briefing.",
        a: "<strong>Weekly Healthcare Workforce Briefing</strong><br><br>" +
           "<strong>Overall Workforce Sustainability Score:</strong> 83/100<br><br>" +
           "<strong>Positive Trends</strong><br>" +
           "✓ Nurse engagement improved 6%<br>" +
           "✓ Resident recovery scores improved 8%<br>" +
           "✓ PTO utilization increased<br><br>" +
           "<strong>Areas Requiring Attention</strong><br>" +
           "⚠ Emergency Medicine burnout rising<br>" +
           "⚠ ICU sleep quality declining<br>" +
           "⚠ Overtime increased 14%<br><br>" +
           "<strong>Predicted Next 30 Days</strong><br>" +
           "• Stable nursing workforce<br>" +
           "• Moderate physician workload concerns<br>" +
           "• Elevated risk in critical care<br><br>" +
           "<strong>Top Recommendation:</strong> Implement additional ICU coverage for weekends."
      }
    ]
  },
  {
    id: "root-cause",
    title: "Root Cause Analysis",
    questions: [
      {
        q: "Why is ICU burnout increasing?",
        a: "<strong>ICU Burnout Root Cause Analysis</strong><br><br>" +
           "<strong>Primary Factors:</strong><br>" +
           "Schedule Compression — 34%<br>" +
           "Sleep Deficiency — 26%<br>" +
           "Understaffing — 19%<br>" +
           "Documentation Burden — 12%<br>" +
           "Other Factors — 9%<br><br>" +
           "<strong>Supporting Evidence</strong><br>" +
           "• Consecutive shifts increased 22%<br>" +
           "• Sleep duration decreased 48 minutes/night<br>" +
           "• PTO utilization decreased 14%<br><br>" +
           "<strong>Confidence:</strong> High"
      }
    ]
  },
  {
    id: "financial-roi",
    title: "Financial ROI Questions",
    questions: [
      {
        q: "How much is burnout costing us?",
        a: "<strong>Estimated Annual Burnout Cost</strong><br><br>" +
           "Turnover Costs — $4.1M<br>" +
           "Agency Staffing — $1.8M<br>" +
           "Lost Productivity — $2.3M<br>" +
           "Absenteeism — $0.6M<br><br>" +
           "<strong>Total Estimated Impact:</strong> $8.8M annually<br>" +
           "<strong>Equivalent:</strong> $24,110 per day"
      },
      {
        q: "Which intervention delivered the highest ROI?",
        a: "<strong>Well-being ROI Analysis</strong><br><br>" +
           "<strong>1. Flexible Scheduling</strong><br>" +
           "Investment: $145,000 · Savings: $970,000 · <strong>ROI: 569%</strong><br><br>" +
           "<strong>2. Recovery Coaching</strong> — ROI: 321%<br><br>" +
           "<strong>3. Wellness Workshops</strong> — ROI: 87%<br><br>" +
           "<strong>Most Effective Driver:</strong> Improved schedule flexibility."
      }
    ]
  },
  {
    id: "predictive-planning",
    title: "Predictive Workforce Planning",
    questions: [
      {
        q: "What problems should I expect next month?",
        a: "<strong>30-Day Workforce Forecast</strong><br><br>" +
           "<strong>High Probability Risks</strong><br>" +
           "Emergency Medicine — Burnout Increase Expected: +11%<br>" +
           "Critical Care — Turnover Risk Increase: +7%<br>" +
           "Residents — Recovery Score Decline Expected: +9%<br><br>" +
           "<strong>Drivers</strong><br>" +
           "• Upcoming vacation shortages<br>" +
           "• Increased patient census<br>" +
           "• Holiday staffing constraints<br><br>" +
           "Recommended preventive actions are available on request."
      }
    ]
  },
  {
    id: "scenario-modeling",
    title: "\"What If\" Scenario Modeling",
    questions: [
      {
        q: "What happens if we hire two APPs for the emergency department?",
        a: "<strong>Simulated Workforce Impact — Adding 2 APPs</strong><br><br>" +
           "<strong>Expected Effects</strong><br>" +
           "Physician Workload ↓ 11%<br>" +
           "Burnout Risk ↓ 15%<br>" +
           "After-Hours Documentation ↓ 21%<br>" +
           "Retention Risk ↓ 9%<br><br>" +
           "<strong>Estimated Annual Savings:</strong> $1.6M<br>" +
           "<strong>Payback Period:</strong> 7 months<br>" +
           "<strong>Confidence:</strong> 78%"
      },
      {
        q: "What if we eliminate 24-hour call shifts?",
        a: "<strong>Simulation Results — 24-Hour Call Elimination</strong><br><br>" +
           "<strong>Predicted Outcomes</strong><br>" +
           "Average Sleep +53 minutes<br>" +
           "Recovery Scores +18%<br>" +
           "Burnout Risk −22%<br>" +
           "Turnover Risk −11%<br><br>" +
           "Cost Increase: $640,000<br>" +
           "Estimated Savings: $2.1M<br>" +
           "<strong>Net Benefit: +$1.46M</strong>"
      }
    ]
  },
  {
    id: "residency-intelligence",
    title: "Residency Program Intelligence",
    questions: [
      {
        q: "Which residency program is most at risk?",
        a: "<strong>Residency Sustainability Rankings</strong><br><br>" +
           "<strong>Highest Risk</strong><br>" +
           "1. Emergency Medicine<br>" +
           "2. General Surgery<br>" +
           "3. Internal Medicine<br><br>" +
           "<strong>Primary Driver:</strong> Sleep deprivation<br>" +
           "<strong>Greatest Improvement Opportunity:</strong> Reduce consecutive overnight assignments."
      },
      {
        q: "What should residency leadership do this month?",
        a: "<strong>Top 3 Recommended Actions</strong><br><br>" +
           "1. Increase post-call recovery time — Expected Burnout Reduction: 8%<br>" +
           "2. Expand peer support participation — Expected Burnout Reduction: 4%<br>" +
           "3. Reduce last-minute schedule changes — Expected Burnout Reduction: 11%<br><br>" +
           "<strong>Combined Estimated Impact:</strong> 18–22% risk reduction."
      }
    ]
  },
  {
    id: "board-level",
    title: "Board-Level Queries",
    questions: [
      {
        q: "Is our workforce healthier than last quarter?",
        a: "<strong>Quarterly Workforce Health Review</strong><br><br>" +
           "<strong>Overall Sustainability Score</strong><br>" +
           "Q1: 74 &nbsp; Q2: 79 &nbsp; Q3: 84<br>" +
           "<strong>Change: +13.5%</strong><br><br>" +
           "<strong>Key Improvements</strong><br>" +
           "✓ Better sleep recovery<br>" +
           "✓ Reduced overtime<br>" +
           "✓ Increased engagement<br><br>" +
           "<strong>Remaining Risks</strong><br>" +
           "• Emergency Medicine<br>" +
           "• Critical Care"
      }
    ]
  },
  {
    id: "visionary",
    title: "The Visionary Query",
    questions: [
      {
        q: "If I could only do one thing this quarter to improve workforce sustainability, what should it be?",
        a: "<strong>Highest Impact Leadership Action</strong><br><br>" +
           "<strong>Recommendation:</strong> Reduce schedule compression in Emergency Medicine.<br><br>" +
           "<strong>Why</strong><br>" +
           "• Largest burnout driver system-wide<br>" +
           "• Affects 142 clinicians<br>" +
           "• Highest turnover risk population<br><br>" +
           "<strong>Estimated Outcomes</strong><br>" +
           "Burnout Reduction: 18%<br>" +
           "Turnover Reduction: 9%<br>" +
           "Annual Savings: $2.8M<br>" +
           "Implementation Difficulty: Moderate<br>" +
           "Expected Time to Impact: 6–8 weeks"
      }
    ]
  }
];

const chatFallbacks = [
  "Based on this month's data, Emergency Medicine Residents and ICU Nursing remain the two highest-risk areas, both flagged High on the heat map.",
  "The Workforce Sustainability Index is currently 78/100, up 4 points from April, while burnout risk over the next 90 days sits at 24%.",
  "I can speak to workforce risk, retention, ROI, and strategic planning — try one of the topics above, or ask about a specific department."
];

let chatFallbackIndex = 0;
let chwoExpanded = false;
let chwoActiveCategory = null;

function addChatMessage(text, sender) {
  const host = document.querySelector("#chatMessages");
  if (!host) return null;
  const node = el("div", `chat-msg ${sender}`, text);
  host.appendChild(node);
  host.scrollTop = host.scrollHeight;
  return node;
}

/* Shows a transient "The Officer is thinking…" bubble, then swaps it for the
   real answer after a couple of seconds — so pre-written answers don't feel
   instant/canned. Delay is randomized a bit (1.6–2.4s) so repeated questions
   don't all resolve on an identical, obviously-fake timer. */
function respondAfterThinking(answerHTML) {
  const thinkingNode = addChatMessage(
    `<span class="chat-thinking">The Officer is thinking<span class="chat-dots"><span>.</span><span>.</span><span>.</span></span></span>`,
    "bot"
  );
  const delay = 1600 + Math.random() * 800;
  window.setTimeout(() => {
    if (thinkingNode) thinkingNode.remove();
    addChatMessage(answerHTML, "bot");
  }, delay);
}

function askChwoQuestion(question) {
  addChatMessage(question.q, "user");
  respondAfterThinking(question.a);
  chwoActiveCategory = null;
  renderChatSuggestions();
}

function renderChatSuggestions() {
  const host = document.querySelector("#chatSuggestions");
  if (!host) return;

  if (chwoActiveCategory) {
    const backChip = `<button type="button" class="chat-chip" data-back="1">← All Topics</button>`;
    const questionChips = chwoActiveCategory.questions
      .map((question, i) => `<button type="button" class="chat-chip" data-cat="${chwoActiveCategory.id}" data-q="${i}">${question.q}</button>`)
      .join("");
    host.innerHTML = backChip + questionChips;
    return;
  }

  const visible = chwoExpanded ? chwoCategories : chwoCategories.slice(0, 3);
  const categoryChips = visible
    .map(cat => `<button type="button" class="chat-chip" data-cat="${cat.id}">${cat.title}</button>`)
    .join("");
  const toggleChip = chwoCategories.length > 3
    ? `<button type="button" class="chat-chip" data-toggle-more="1">${chwoExpanded ? "Show fewer topics" : `+${chwoCategories.length - 3} more topics`}</button>`
    : "";
  host.innerHTML = categoryChips + toggleChip;
}

/* Single delegated listener on the (repeatedly re-rendered) suggestions
   container, rather than re-binding per-button on every render. */
function initChwoSuggestions() {
  const host = document.querySelector("#chatSuggestions");
  if (!host) return;

  /* This handler re-renders the chip list (see renderChatSuggestions calls
     below), which detaches the clicked button from the DOM mid-bubble.
     These clicks never need to reach `document`, so stop them here as a
     second guard against the outside-click-to-close listener misfiring
     (belt-and-suspenders alongside the composedPath() fix there). */
  host.addEventListener("click", event => {
    event.stopPropagation();

    if (event.target.closest("[data-back]")) {
      chwoActiveCategory = null;
      renderChatSuggestions();
      return;
    }

    if (event.target.closest("[data-toggle-more]")) {
      chwoExpanded = !chwoExpanded;
      renderChatSuggestions();
      return;
    }

    const questionBtn = event.target.closest("[data-q]");
    if (questionBtn) {
      const category = chwoCategories.find(cat => cat.id === questionBtn.dataset.cat);
      askChwoQuestion(category.questions[Number(questionBtn.dataset.q)]);
      return;
    }

    const categoryBtn = event.target.closest("[data-cat]");
    if (categoryBtn) {
      const category = chwoCategories.find(cat => cat.id === categoryBtn.dataset.cat);
      if (category.questions.length === 1) {
        askChwoQuestion(category.questions[0]);
      } else {
        chwoActiveCategory = category;
        renderChatSuggestions();
      }
    }
  });
}

function initChatbot() {
  const input = document.querySelector("#chatInput");
  const send = document.querySelector("#chatSend");
  const fab = document.querySelector("#chatFab");
  const panel = document.querySelector("#chatPanel");
  const closeBtn = document.querySelector("#chatPanelClose");
  if (!input || !send || !fab || !panel) return;

  addChatMessage("Hi, I'm your AI Chief Wellness Officer. Choose a topic below, or ask me anything about workforce risk, retention, or ROI.", "bot");
  initChwoSuggestions();
  renderChatSuggestions();

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, "user");
    input.value = "";
    const reply = chatFallbacks[chatFallbackIndex % chatFallbacks.length];
    chatFallbackIndex += 1;
    respondAfterThinking(reply);
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

  /* Clicking a topic chip re-renders #chatSuggestions (its innerHTML gets
     replaced to show sub-questions, or the answer). If that happens while
     the click event is still bubbling, the clicked button — now detached
     from the DOM — makes `panel.contains(event.target)` below return false,
     which wrongly reads as "clicked outside the panel" and closes it.
     composedPath() captures the propagation path at dispatch time, before
     any of that mutation, so it stays accurate even once the target is
     removed. */
  document.addEventListener("click", event => {
    if (!panel.classList.contains("open")) return;
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (path.includes(panel) || path.includes(fab)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && panel.classList.contains("open")) setOpen(false);
  });
}

initChatbot();

/* =========================================================================
   Scheduling tab
   -------------------------------------------------------------------------
   15 hardcoded residents, each with a Mon–Sun shift pattern (Off/Day/Night/
   24h Call) and a computed weekly-hours total. Three of them are tagged
   "top" performers and three "burnt" (most burnt-out) — each of those six
   also carries a hand-authored `optimized` schedule that's visibly lighter
   than their current one. The three action buttons below the roster each
   generate a new result card: the two named ones pull their tagged subset's
   optimized schedule, and the third (balance) applies one uniform, moderate
   pattern across all 15 residents. Every action shows a 2-second "Wellness
   Officer is working" state first, to read as an agentic action rather than
   an instant lookup.
   ========================================================================= */

const shiftHours = { Off: 0, Day: 12, Night: 12, Call: 24 };
const shiftClass = { Off: "sched-off", Day: "sched-day", Night: "sched-night", Call: "sched-call" };
const shiftLabel = { Off: "Off", Day: "Day Shift", Night: "Night Shift", Call: "24h Call" };
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const balancedSchedule = ["Day", "Off", "Day", "Off", "Night", "Off", "Off"];

const residents = [
  {
    name: "Dr. A. Whitfield", program: "Family Medicine", tier: "top",
    schedule: ["Day", "Off", "Day", "Off", "Day", "Off", "Off"],
    optimized: ["Day", "Off", "Off", "Day", "Off", "Off", "Off"]
  },
  {
    name: "Dr. R. Mensah", program: "Pediatrics", tier: "top",
    schedule: ["Day", "Off", "Night", "Off", "Day", "Off", "Off"],
    optimized: ["Day", "Off", "Off", "Off", "Day", "Off", "Off"]
  },
  {
    name: "Dr. K. Nakamura", program: "Psychiatry", tier: "top",
    schedule: ["Day", "Off", "Day", "Off", "Off", "Day", "Off"],
    optimized: ["Day", "Off", "Off", "Off", "Off", "Day", "Off"]
  },
  {
    name: "Dr. J. Okafor", program: "Emergency Medicine", tier: "burnt",
    schedule: ["Night", "Night", "Call", "Off", "Night", "Night", "Off"],
    optimized: ["Day", "Off", "Day", "Off", "Off", "Day", "Off"]
  },
  {
    name: "Dr. L. Petrova", program: "Surgery", tier: "burnt",
    schedule: ["Call", "Off", "Night", "Night", "Off", "Call", "Off"],
    optimized: ["Day", "Off", "Day", "Off", "Day", "Off", "Off"]
  },
  {
    name: "Dr. T. Alvarez", program: "Internal Medicine", tier: "burnt",
    schedule: ["Night", "Call", "Off", "Night", "Call", "Off", "Night"],
    optimized: ["Day", "Off", "Day", "Off", "Off", "Day", "Off"]
  },
  { name: "Dr. M. Reyes", program: "Anesthesiology", tier: "standard", schedule: ["Day", "Night", "Off", "Day", "Off", "Night", "Off"] },
  { name: "Dr. E. Larsen", program: "OB/GYN", tier: "standard", schedule: ["Day", "Off", "Night", "Day", "Off", "Off", "Night"] },
  { name: "Dr. N. Osei", program: "Radiology", tier: "standard", schedule: ["Day", "Day", "Off", "Night", "Off", "Day", "Off"] },
  { name: "Dr. B. Kowalski", program: "Emergency Medicine", tier: "standard", schedule: ["Night", "Off", "Day", "Night", "Off", "Day", "Off"] },
  { name: "Dr. H. Suzuki", program: "Surgery", tier: "standard", schedule: ["Day", "Night", "Off", "Day", "Night", "Off", "Off"] },
  { name: "Dr. F. Dubois", program: "Internal Medicine", tier: "standard", schedule: ["Day", "Off", "Day", "Night", "Off", "Day", "Off"] },
  { name: "Dr. C. Adeyemi", program: "Family Medicine", tier: "standard", schedule: ["Day", "Off", "Day", "Off", "Day", "Off", "Day"] },
  { name: "Dr. P. Ibrahim", program: "Pediatrics", tier: "standard", schedule: ["Day", "Day", "Off", "Off", "Night", "Off", "Day"] },
  { name: "Dr. V. Romano", program: "Psychiatry", tier: "standard", schedule: ["Day", "Off", "Night", "Off", "Day", "Off", "Day"] }
];

const schedActions = {
  top: {
    title: "Optimized Schedule — Retaining Top 3 Residents",
    subtitle: "Lighter rotations for your highest-performing residents, to keep them engaged and reduce flight risk.",
    residents: () => residents.filter(r => r.tier === "top").map(r => ({ name: r.name, program: r.program, schedule: r.optimized }))
  },
  burnt: {
    title: "Optimized Schedule — Supporting Most Burnt-Out Residents",
    subtitle: "Reduced night/call load for the residents showing the highest burnout signals, to protect retention.",
    residents: () => residents.filter(r => r.tier === "burnt").map(r => ({ name: r.name, program: r.program, schedule: r.optimized }))
  },
  balance: {
    title: "Optimized Schedule — Balanced Workload (All 15 Residents)",
    subtitle: "One evenly distributed rotation applied across the full roster, so no resident is carrying a disproportionate share.",
    residents: () => residents.map(r => ({ name: r.name, program: r.program, schedule: balancedSchedule }))
  }
};

function scheduleLegendHTML() {
  return `
    <div class="sched-legend">
      <span><span class="day-cell sched-off"></span>Off</span>
      <span><span class="day-cell sched-day"></span>Day</span>
      <span><span class="day-cell sched-night"></span>Night</span>
      <span><span class="day-cell sched-call"></span>24h Call</span>
    </div>`;
}

function scheduleHeaderHTML() {
  return `<div class="sched-days-head"><span></span>${weekDays.map(d => `<span>${d}</span>`).join("")}<span></span></div>`;
}

function scheduleRowHTML(name, program, schedule) {
  const hours = schedule.reduce((sum, s) => sum + shiftHours[s], 0);
  const cells = schedule.map((s, i) => `<span class="day-cell ${shiftClass[s]}" title="${weekDays[i]}: ${shiftLabel[s]}"></span>`).join("");
  return `
    <div class="sched-row">
      <div class="sched-info">
        <span class="sched-name">${name}</span>
        <span class="sched-program">${program}</span>
      </div>
      ${cells}
      <strong class="sched-hours">${hours}h</strong>
    </div>`;
}

function scheduleTableHTML(rows) {
  return scheduleHeaderHTML() + rows.map(r => scheduleRowHTML(r.name, r.program, r.schedule)).join("");
}

function renderCurrentSchedules() {
  const legendHost = document.querySelector("#schedCurrent");
  if (!legendHost) return;
  legendHost.innerHTML = scheduleLegendHTML() + scheduleTableHTML(residents.map(r => ({ name: r.name, program: r.program, schedule: r.schedule })));
}

function initScheduling() {
  renderCurrentSchedules();

  const optionsHost = document.querySelector(".sched-options");
  const working = document.querySelector("#schedWorking");
  const resultsHost = document.querySelector("#schedResults");
  if (!optionsHost || !working || !resultsHost) return;

  let busy = false;

  optionsHost.addEventListener("click", event => {
    const btn = event.target.closest("[data-sched-action]");
    if (!btn || busy) return;
    const action = schedActions[btn.dataset.schedAction];
    if (!action) return;

    busy = true;
    optionsHost.querySelectorAll(".sched-option-btn").forEach(b => { b.disabled = true; });
    working.classList.add("visible");

    window.setTimeout(() => {
      working.classList.remove("visible");

      try {
        const card = el("article", "card sched-card sched-result", `
          <div class="head">
            <div>
              <h2>${action.title}</h2>
              <p>${action.subtitle}</p>
            </div>
          </div>
          ${scheduleLegendHTML()}
          ${scheduleTableHTML(action.residents())}
        `);
        resultsHost.appendChild(card);
        if (typeof card.scrollIntoView === "function") card.scrollIntoView({ behavior: "smooth", block: "start" });
      } finally {
        /* Always re-enable, even if building/inserting the card above threw
           for some unforeseen reason — the alternative is a permanently
           disabled action row with no way to recover without a reload. */
        optionsHost.querySelectorAll(".sched-option-btn").forEach(b => { b.disabled = false; });
        busy = false;
      }
    }, 2000);
  });
}

initScheduling();

/* =========================================================================
   Login / role gating
   -------------------------------------------------------------------------
   Two demo accounts, matched by email only — any non-empty password is
   accepted. The signed-in role is kept in `currentRole` (checked by the
   switchView() guard above) and mirrored to sessionStorage so a refresh
   mid-demo doesn't force signing in again. CEO hides the Scheduling tab
   entirely; Director sees the full app.
   ========================================================================= */

const validAccounts = {
  "ceo@lifespan.com": "ceo",
  "director@lifespan.com": "director"
};

const ROLE_STORAGE_KEY = "empowerSessionRole";

let currentRole = null;

function getStoredRole() {
  try {
    return window.sessionStorage.getItem(ROLE_STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

function storeRole(role) {
  try {
    window.sessionStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch (err) {
    /* sessionStorage unavailable (e.g. private browsing) — session just
       won't survive a refresh; login itself still works fine. */
  }
}

function clearStoredRole() {
  try {
    window.sessionStorage.removeItem(ROLE_STORAGE_KEY);
  } catch (err) {
    /* ignore */
  }
}

/* Shows/hides the Scheduling nav item for the signed-in role, and bounces
   off that view first if a CEO session is somehow already sitting on it. */
function applyRolePermissions(role) {
  const schedNav = document.querySelector('.nav-item[data-view="v-scheduling"]');
  const isCeo = role === "ceo";
  if (schedNav) schedNav.style.display = isCeo ? "none" : "";

  const schedView = document.querySelector("#v-scheduling");
  if (isCeo && schedView && schedView.classList.contains("active")) {
    switchView("v-overview");
  }
}

function initLogin() {
  const loginScreen = document.querySelector("#loginScreen");
  const appRoot = document.querySelector("#appRoot");
  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const errorEl = document.querySelector("#loginError");
  const userMenuLabel = document.querySelector("#userMenuLabel");
  const userMenuBtn = document.querySelector("#userMenuBtn");
  const userMenu = document.querySelector("#userMenu");
  const logoutBtn = document.querySelector("#logoutBtn");
  if (!loginScreen || !appRoot || !form) return;

  function showApp(role) {
    currentRole = role;
    loginScreen.classList.add("dismissed");
    appRoot.classList.add("visible");
    applyRolePermissions(role);
    if (userMenuLabel) userMenuLabel.textContent = role === "ceo" ? "CEO — Lifespan" : "Director — Lifespan";
  }

  function logOut() {
    currentRole = null;
    clearStoredRole();
    form.reset();
    if (errorEl) errorEl.classList.remove("visible");
    appRoot.classList.remove("visible");
    loginScreen.classList.remove("dismissed");
    closeAllMenus();
    if (emailInput) window.setTimeout(() => emailInput.focus(), 50);
  }

  const storedRole = getStoredRole();
  if (storedRole === "ceo" || storedRole === "director") showApp(storedRole);

  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = (emailInput.value || "").trim().toLowerCase();
    const password = passwordInput.value || "";
    const role = validAccounts[email];

    if (!role || !password) {
      if (errorEl) {
        errorEl.textContent = !role
          ? "That email isn't recognized. Use one of the demo accounts below."
          : "Enter a password (any value) to continue.";
        errorEl.classList.add("visible");
      }
      return;
    }

    if (errorEl) errorEl.classList.remove("visible");
    storeRole(role);
    showApp(role);
  });

  if (logoutBtn) logoutBtn.addEventListener("click", logOut);

  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener("click", event => {
      event.stopPropagation();
      const willOpen = !userMenu.classList.contains("open");
      closeAllMenus();
      userMenu.classList.toggle("open", willOpen);
      userMenuBtn.setAttribute("aria-expanded", String(willOpen));
    });
  }
}

initLogin();
