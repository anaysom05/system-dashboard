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
     applyRolePermissions() — even if one of these views were reached some
     other way, a session without the matching role never actually shows it.
     roleRestrictedViews is declared further down (with the rest of the
     login/role logic), but that's fine: switchView() is only ever invoked
     from event handlers or from initLogin() itself, both of which run only
     after the whole script — including that later declaration — has
     already finished evaluating top to bottom. */
  const restrictedRole = roleRestrictedViews[id];
  if (restrictedRole && currentRole !== restrictedRole) return;
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
  },

  /* ---- Resident Scheduling queries — appended as their own set of
     categories rather than folded into the existing ones above, since
     they're a distinct operational layer (day-to-day resident scheduling)
     under the same broader workforce umbrella. Answers are grounded in the
     actual 15-resident roster on the Scheduling tab (3 top performers at
     24–36h/week, 3 burnt-out residents at 72–84h/week, 9 standard-tier
     residents at 48h/week) so references to specific residents and hours
     stay consistent with what that tab shows. */

  {
    id: "daily-ops",
    title: "Daily Operations",
    questions: [
      {
        q: "Which residents are scheduled to work today in the ICU?",
        a: `<strong>Today's ICU Coverage</strong><br><br>Dr. J. Okafor (Emergency Medicine) and Dr. T. Alvarez (Internal Medicine) are covering ICU overnight; daytime ICU coverage rotates among Internal Medicine and Surgery residents.<br><br>Full shift-by-shift detail is on the Scheduling tab.`
      },
      {
        q: "Who is currently on night float this week?",
        a: `<strong>Night Float — This Week</strong><br><br>Dr. J. Okafor, Dr. L. Petrova, and Dr. T. Alvarez are carrying the heaviest night/call load this week, with 2–3 Night or 24h Call shifts each.<br><br>Together they account for the bulk of this week's overnight coverage.`
      },
      {
        q: "Show me next month's emergency medicine coverage schedule.",
        a: `<strong>Emergency Medicine — Next Month</strong><br><br>Draft coverage is built but not yet finalized. Dr. J. Okafor and Dr. B. Kowalski anchor EM night coverage; daytime EM slots remain to be confirmed pending the upcoming resident rotation change.<br><br>Recommended: Finalize by the 20th to allow two weeks' notice.`
      },
      {
        q: "Which shifts remain unfilled over the next 30 days?",
        a: `<strong>Unfilled Shifts — Next 30 Days</strong><br><br>3 Night shifts and 1 24h Call shift are currently unassigned, concentrated in the second week of the period.<br><br>⚠ Two of the open Night shifts fall on the same weekend — recommend filling those first to avoid a coverage gap.`
      },
      {
        q: "Who is covering Dr. Smith's vacation next week?",
        a: `<strong>Coverage Plan — Dr. Smith's Vacation</strong><br><br>Dr. C. Adeyemi and Dr. P. Ibrahim are absorbing Dr. Smith's Day shifts next week, adding roughly 12 hours each to their weekly total.<br><br>Neither exceeds 60 hours for the week with this coverage in place.`
      },
      {
        q: "Which residents are scheduled for consecutive weekend assignments?",
        a: `<strong>Consecutive Weekend Assignments</strong><br><br>Dr. T. Alvarez and Dr. L. Petrova are each scheduled for back-to-back weekend Call/Night shifts this rotation block.<br><br>Recommended: Insert a recovery weekend before their next assignment block.`
      }
    ]
  },
  {
    id: "schedule-adjustments",
    title: "Schedule Adjustments",
    questions: [
      {
        q: "If Resident A calls in sick tonight, who is the best replacement?",
        a: `<strong>Best Replacement — Tonight</strong><br><br>Dr. C. Adeyemi is the best fit: currently at 48h this week, nothing scheduled tonight, and no duty-hour conflict from picking up a single Night shift.<br><br>Backup option: Dr. H. Suzuki, also under 60h for the week.`
      },
      {
        q: "Generate a revised schedule that accommodates three residents attending a conference.",
        a: `<strong>Revised Schedule — Conference Coverage</strong><br><br>Removing Dr. Reyes, Dr. Larsen, and Dr. Osei for the conference window requires redistributing 6 shifts. The revised draft keeps every remaining resident under 65h for the week by spreading coverage across 5 colleagues rather than 2.<br><br>✓ No duty-hour violations introduced.`
      },
      {
        q: "How can I redistribute shifts to maintain coverage while minimizing overtime?",
        a: `<strong>Overtime-Minimizing Redistribution</strong><br><br>Shifting 2 Night shifts from Dr. Alvarez (currently 84h) to Dr. Kowalski and Dr. Dubois (currently 48h each) maintains full coverage while cutting projected overtime by roughly 18 hours this week.<br><br>Recommended: Apply via the Scheduling tab's balance-workload action.`
      },
      {
        q: "Which residents can swap shifts without violating duty hour rules?",
        a: `<strong>Eligible Shift Swaps</strong><br><br>Dr. Adeyemi ↔ Dr. Ibrahim and Dr. Suzuki ↔ Dr. Dubois can swap any single shift this week without breaching the 80-hour rule or minimum rest requirements.<br><br>Dr. Alvarez is not eligible to take on additional shifts until their weekly total drops below 72h.`
      }
    ]
  },
  {
    id: "individual-workload",
    title: "Individual Resident Workload",
    questions: [
      {
        q: "How many hours has Resident A worked this week?",
        a: `<strong>Weekly Hours — Individual Lookup</strong><br><br>Hours range from 24h (lightest, top-performing residents) to 84h (Dr. T. Alvarez, this week's highest) across the 15-resident roster.<br><br>Open the Scheduling tab and select a resident's row for their exact weekly total.`
      },
      {
        q: "Which residents are approaching the 80-hour duty limit?",
        a: `<strong>Approaching the 80-Hour Limit</strong><br><br>Dr. T. Alvarez is currently at <strong>84h</strong> this week — already over the ACGME weekly average threshold if sustained.<br>Dr. L. Petrova and Dr. J. Okafor are both at <strong>72h</strong>, within range but trending upward.<br><br>⚠ Recommend a schedule review for all three before next week's rotation.`
      },
      {
        q: "How many overnight calls has each PGY-2 completed this month?",
        a: `<strong>PGY-2 Overnight Call Volume — This Month</strong><br><br>PGY-2s are averaging 5.4 overnight calls this month, roughly 30% above the program-wide PGY average of 4.2.<br><br>Dr. Okafor and Dr. Petrova account for the highest individual counts.`
      },
      {
        q: "Compare workload among all senior residents.",
        a: `<strong>Senior Resident Workload Comparison</strong><br><br>Senior (PGY-3+) residents average 56h/week, ranging from 36h (Dr. Nakamura) to 84h (Dr. Alvarez) — a 48-hour spread.<br><br>That's the widest spread of any PGY cohort, suggesting uneven senior-level shift distribution.`
      },
      {
        q: "Which resident has had the fewest days off in the last six weeks?",
        a: `<strong>Fewest Days Off — Last 6 Weeks</strong><br><br>Dr. T. Alvarez has had the fewest full days off, averaging just under 1 per week versus a program target of 1.5.<br><br>Dr. Petrova and Dr. Okafor follow closely behind.`
      }
    ]
  },
  {
    id: "resident-burnout-risk",
    title: "Resident Burnout Risk Assessment",
    questions: [
      {
        q: "Identify residents at high risk for fatigue based on recent schedules.",
        a: `<strong>High Fatigue-Risk Residents</strong><br><br>Dr. T. Alvarez, Dr. L. Petrova, and Dr. J. Okafor are flagged High fatigue risk — each carrying 72–84h this week with multiple Night/Call shifts and minimal recovery time between them.<br><br>These three match the "most burnt-out" cohort already surfaced on the Scheduling tab.`
      },
      {
        q: "Which residents have worked more than four overnight shifts in the last two weeks?",
        a: `<strong>4+ Overnight Shifts — Last 2 Weeks</strong><br><br>Dr. Okafor (5), Dr. Alvarez (5), and Dr. Petrova (4) exceed the threshold.<br><br>No other resident in the current roster crosses 4 overnight shifts in the trailing two-week window.`
      },
      {
        q: "Show residents with the highest workload variance this quarter.",
        a: `<strong>Highest Workload Variance — This Quarter</strong><br><br>Dr. Alvarez shows the largest week-to-week swing (as low as 48h, as high as 84h), followed by Dr. Petrova and Dr. Okafor.<br><br>High variance is itself a burnout signal — sudden spikes are harder to recover from than a consistently higher baseline.`
      },
      {
        q: "What percentage of residents are exceeding wellness risk thresholds?",
        a: `<strong>Residents Exceeding Wellness Risk Thresholds</strong><br><br><strong>20%</strong> of the 15-resident roster (3 residents) currently exceed the program's wellness risk threshold, matching the "burnt-out" tier on the Scheduling tab.<br><br>All 3 are concentrated in Emergency Medicine, Surgery, and Internal Medicine.`
      },
      {
        q: "Who has had the longest continuous stretch of clinical days?",
        a: `<strong>Longest Continuous Clinical Stretch</strong><br><br>Dr. T. Alvarez has the longest current stretch — 6 consecutive clinical days without a full day off.<br><br>Program guideline recommends intervention at 6+ consecutive days; this resident is at that threshold now.`
      }
    ]
  },
  {
    id: "schedule-equity",
    title: "Schedule Equity",
    questions: [
      {
        q: "Are night shifts distributed equally across residents?",
        a: `<strong>Night Shift Distribution</strong><br><br>No — night shifts are concentrated in 3 of 15 residents (Okafor, Petrova, Alvarez), who together carry roughly 45% of all Night/Call shifts program-wide despite being 20% of the roster.<br><br>Recommended: Redistribute 1–2 night shifts per week from this group to the 9 standard-tier residents.`
      },
      {
        q: "Which residents have carried the highest call burden this year?",
        a: `<strong>Highest Call Burden — Year to Date</strong><br><br>Dr. L. Petrova and Dr. T. Alvarez lead year-to-date call volume, each roughly 35% above the program average.<br><br>Dr. J. Okafor is close behind in third place.`
      },
      {
        q: "Compare weekend coverage assignments by resident and PGY level.",
        a: `<strong>Weekend Coverage by PGY Level</strong><br><br>PGY-2s carry the heaviest weekend load (2.1 weekend shifts/month average), compared to 1.4 for PGY-1s and 1.6 for PGY-3+.<br><br>Within PGY-2, Dr. Okafor and Dr. Alvarez sit above their own cohort's average.`
      },
      {
        q: "Are moonlighting opportunities being distributed fairly?",
        a: `<strong>Moonlighting Distribution</strong><br><br>Moonlighting slots currently skew toward the 3 top-performing residents (Whitfield, Mensah, Nakamura), who have the most duty-hour headroom to take them.<br><br>Expected given their lighter base schedules, but worth confirming access isn't informally restricted for others.`
      },
      {
        q: "Identify scheduling inequities across resident cohorts.",
        a: `<strong>Scheduling Inequities Across Cohorts</strong><br><br>The clearest inequity: 3 residents (Emergency Medicine, Surgery, Internal Medicine) carry 72–84h weeks while 3 others carry 24h weeks — a 60-hour spread within the same 15-person roster.<br><br>Standardizing toward the "balanced workload" pattern on the Scheduling tab would close most of this gap.`
      }
    ]
  },
  {
    id: "rotation-equity",
    title: "Rotation Equity",
    questions: [
      {
        q: "Which residents have received fewer elective opportunities?",
        a: `<strong>Fewer Elective Opportunities</strong><br><br>Dr. Okafor, Dr. Petrova, and Dr. Alvarez have had the fewest elective slots this year — a direct consequence of their heavier core-service load leaving less rotation flexibility.<br><br>Reducing their service burden would likely free up elective capacity.`
      },
      {
        q: "Compare ICU and inpatient service exposure across residents.",
        a: `<strong>ICU vs. Inpatient Exposure</strong><br><br>ICU exposure is concentrated in Internal Medicine and Surgery residents (Alvarez, Petrova, Suzuki, Dubois), while inpatient service exposure is more evenly spread across the full roster.<br><br>No resident is currently below the minimum required ICU weeks for their PGY level.`
      },
      {
        q: "Are procedural opportunities distributed evenly among residents?",
        a: `<strong>Procedural Opportunity Distribution</strong><br><br>Not evenly — Surgery and Emergency Medicine residents (Suzuki, Kowalski, Okafor) log roughly 2.5x the procedural volume of Psychiatry or Family Medicine residents. Expected by specialty, but worth tracking against each resident's own graduation requirements.`
      }
    ]
  },
  {
    id: "duty-hour-compliance",
    title: "Duty Hour Compliance (ACGME)",
    questions: [
      {
        q: "Which residents are currently at risk of duty hour violations?",
        a: `<strong>Duty Hour Violation Risk</strong><br><br>Dr. T. Alvarez (84h this week) is the immediate concern — one more heavy week would push their 4-week rolling average over the 80-hour ACGME limit.<br><br>Dr. Petrova and Dr. Okafor (72h each) are trending the same direction.`
      },
      {
        q: "Show all actual or potential ACGME violations from the past month.",
        a: `<strong>ACGME Violations — Past Month</strong><br><br>No confirmed violations. 1 potential violation was flagged and resolved: Dr. Alvarez's 4-week average briefly touched 79.5h before a schedule adjustment brought it back under threshold.<br><br>Recommend continued monitoring for this resident.`
      },
      {
        q: "How many 24+ hour shifts occurred last quarter?",
        a: `<strong>24+ Hour Shifts — Last Quarter</strong><br><br>14 24-hour Call shifts occurred across the roster last quarter, concentrated in Surgery and Internal Medicine.<br><br>Dr. Petrova and Dr. Alvarez each accounted for roughly a quarter of the total.`
      },
      {
        q: "Which rotations generate the most duty hour exceptions?",
        a: `<strong>Rotations Generating the Most Exceptions</strong><br><br>Surgery and Internal Medicine generate the most duty-hour exceptions, together accounting for over half of all flagged instances this year.<br><br>Emergency Medicine is third, driven mainly by night-shift clustering rather than raw hour totals.`
      },
      {
        q: "Predict residents likely to exceed duty hour limits next month.",
        a: `<strong>Predicted Duty Hour Risk — Next Month</strong><br><br>Based on current trajectory, Dr. Alvarez has a <strong>78%</strong> likelihood of exceeding the 80-hour rolling average next month absent intervention. Dr. Petrova and Dr. Okafor are each estimated at roughly 40%.<br><br>Recommended: Apply the "retain most burnt-out residents" optimization on the Scheduling tab now, before the risk materializes.`
      }
    ]
  },
  {
    id: "accreditation-readiness",
    title: "Accreditation Readiness",
    questions: [
      {
        q: "Generate a report of workload metrics for the Clinical Competency Committee.",
        a: `<strong>CCC Workload Report — Summary</strong><br><br>Program-wide average: 52h/week. Range: 24h–84h. 3 residents (20%) currently exceed the program's internal wellness threshold.<br><br>Full per-resident detail is exportable from the Scheduling tab for the committee packet.`
      },
      {
        q: "Summarize duty hour compliance trends for our Annual Program Evaluation.",
        a: `<strong>Duty Hour Compliance — APE Summary</strong><br><br>Zero confirmed ACGME violations this cycle; 1 near-miss identified and corrected proactively. Compliance trend is stable, with a slight uptick in near-misses tied to a temporary Surgery staffing shortage.<br><br>Recommend citing the proactive correction as evidence of effective monitoring.`
      },
      {
        q: "Which services contribute most to compliance concerns?",
        a: `<strong>Services Contributing Most to Compliance Concerns</strong><br><br>Surgery and Internal Medicine together account for roughly 65% of all duty-hour near-misses this year, driven by 24-hour call frequency rather than total rotation length.`
      }
    ]
  },
  {
    id: "coverage-forecasting",
    title: "Coverage Forecasting",
    questions: [
      {
        q: "Do we have sufficient resident coverage during the upcoming holiday schedule?",
        a: `<strong>Holiday Coverage Forecast</strong><br><br>Projected coverage is adequate but thin: 2 fewer residents than a typical week are available due to approved time off, concentrated on the two holiday weekends.<br><br>Recommend confirming backup coverage for those two weekends now rather than closer to the date.`
      },
      {
        q: "What is the projected staffing gap during graduation season?",
        a: `<strong>Graduation Season Staffing Gap</strong><br><br>Projected gap: roughly 3 resident-weeks of coverage in the two-week transition window between outgoing PGY-3s graduating and incoming PGY-1s onboarding.<br><br>Bridging typically relies on moonlighting and senior resident overtime — plan for a temporary hours increase in that window.`
      },
      {
        q: "How will maternity leave affect service coverage next quarter?",
        a: `<strong>Maternity Leave Coverage Impact — Next Quarter</strong><br><br>One resident's upcoming leave removes roughly 48h/week of capacity for 12 weeks. Absorbing this without violating duty-hour limits requires redistributing across at least 4 other residents rather than 1–2.<br><br>Recommend starting the redistribution plan 3–4 weeks before the leave begins.`
      },
      {
        q: "Forecast coverage needs based on historical patient census.",
        a: `<strong>Coverage Forecast — Historical Census Basis</strong><br><br>Based on historical patterns, patient census typically rises 12–15% in Q1, which would require roughly 1 additional resident-equivalent of coverage during that window if current staffing holds flat.`
      }
    ]
  },
  {
    id: "service-demand-matching",
    title: "Service Demand Matching",
    questions: [
      {
        q: "Are resident staffing levels aligned with patient volumes?",
        a: `<strong>Staffing-to-Volume Alignment</strong><br><br>Broadly aligned, with one exception: Emergency Medicine patient volume has grown faster than EM resident staffing over the past two quarters, contributing to the elevated hours seen for Dr. Okafor and Dr. Kowalski.`
      },
      {
        q: "Which rotations are understaffed relative to workload?",
        a: `<strong>Understaffed Rotations</strong><br><br>Emergency Medicine and Surgery show the clearest staffing-to-workload mismatch, each running roughly 15–20% above the resident hours their current census would predict under a balanced model.`
      },
      {
        q: "How should we adjust scheduling if ER volume increases by 20%?",
        a: `<strong>Scheduling Adjustment — +20% ER Volume Scenario</strong><br><br>A 20% ER volume increase would require roughly 1.5 additional resident-equivalents of EM coverage to hold current hours flat. Without that addition, projected EM resident hours would rise from the current ~50h average toward 60h+.<br><br>Recommended: Model this scenario on the Scenario Simulator before committing to a coverage plan.`
      }
    ]
  },
  {
    id: "education-service-balance",
    title: "Education vs. Service Balance",
    questions: [
      {
        q: "Which residents are spending excessive time on service compared with educational activities?",
        a: `<strong>Service-Heavy, Education-Light Residents</strong><br><br>Dr. Alvarez, Dr. Petrova, and Dr. Okafor show the lowest ratio of educational to service time this quarter — largely a byproduct of their heavier clinical hours leaving less room for didactics.`
      },
      {
        q: "How many clinic sessions has each resident completed this quarter?",
        a: `<strong>Clinic Sessions Completed — This Quarter</strong><br><br>Program average is 8 sessions/resident this quarter. The 3 highest-hour residents (Alvarez, Petrova, Okafor) are each running 2–3 sessions behind that average.`
      },
      {
        q: "Are procedural opportunities meeting graduation requirements?",
        a: `<strong>Procedural Requirements vs. Current Pace</strong><br><br>13 of 15 residents are on pace to meet procedural graduation requirements. 2 residents in lower-procedure-volume specialties are trending slightly behind and should be flagged for a targeted opportunity in the next rotation block.`
      },
      {
        q: "Which residents may be falling behind on training milestones due to workload?",
        a: `<strong>Training Milestones at Risk from Workload</strong><br><br>Dr. Alvarez is the primary concern — sustained 70–84h weeks are displacing the didactic and procedural time needed to stay on pace for their current milestone set.<br><br>Recommended: Address the workload issue first; the milestone gap is a downstream effect, not the root cause.`
      }
    ]
  },
  {
    id: "learning-opportunities",
    title: "Learning Opportunities",
    questions: [
      {
        q: "Identify residents needing additional ICU exposure.",
        a: `<strong>Residents Needing More ICU Exposure</strong><br><br>3 residents in lower-acuity specialties (Family Medicine, Psychiatry) are below the program's recommended ICU exposure benchmark for their PGY level and would benefit from an added ICU block.`
      },
      {
        q: "Which residents require more continuity clinic sessions?",
        a: `<strong>Residents Needing More Continuity Clinic</strong><br><br>Dr. Alvarez and Dr. Petrova are furthest behind on continuity clinic session targets this year, again tracing back to their heavier inpatient/call load leaving less outpatient time.`
      },
      {
        q: "Who needs additional procedural experience before graduation?",
        a: `<strong>Additional Procedural Experience Needed</strong><br><br>2 residents in their final year are trending slightly below their procedural graduation targets. Both are in specialties where procedure volume depends heavily on rotation assignment — prioritizing them for high-volume blocks in the coming months should close the gap.`
      }
    ]
  },
  {
    id: "resident-wellness-monitoring",
    title: "Resident Wellness Monitoring",
    questions: [
      {
        q: "Which residents show signs of workload-related burnout?",
        a: `<strong>Signs of Workload-Related Burnout</strong><br><br>Dr. T. Alvarez, Dr. L. Petrova, and Dr. J. Okafor show the clearest signs — elevated hours, high night/call frequency, and reduced days off, consistent with the "most burnt-out" cohort already flagged on the Scheduling tab.`
      },
      {
        q: "Correlate schedule intensity with wellbeing survey responses.",
        a: `<strong>Schedule Intensity vs. Wellbeing Survey Scores</strong><br><br>Residents averaging 65h+/week score roughly 30% lower on the wellbeing survey's exhaustion subscale than those under 50h/week. The correlation is strongest for night/call frequency specifically, more than raw weekly hours.`
      },
      {
        q: "How many residents have had fewer than two full weekends off this month?",
        a: `<strong>Fewer Than 2 Full Weekends Off — This Month</strong><br><br><strong>4 residents</strong> have had fewer than two full weekends off this month, led by Dr. Alvarez and Dr. Petrova, who have each had just one.`
      },
      {
        q: "Identify residents with increasing fatigue risk trends.",
        a: `<strong>Increasing Fatigue Risk Trends</strong><br><br>Dr. Alvarez's fatigue risk trend is rising fastest — up over the last 3 rotation blocks, driven by consecutive Call/Night assignments. Dr. Petrova shows a similar but slower upward trend.`
      }
    ]
  },
  {
    id: "resident-retention-signals",
    title: "Resident Retention Signals",
    questions: [
      {
        q: "Which scheduling patterns correlate with resident dissatisfaction?",
        a: `<strong>Scheduling Patterns Linked to Dissatisfaction</strong><br><br>Consecutive Call shifts with no recovery day between them show the strongest correlation with lower satisfaction scores — stronger than total weekly hours alone.`
      },
      {
        q: "Are certain rotations associated with increased wellness concerns?",
        a: `<strong>Rotations Associated with Wellness Concerns</strong><br><br>Emergency Medicine, Surgery, and Internal Medicine — the same three services carrying this year's heaviest call burden — show the highest wellness-concern flag rates.`
      },
      {
        q: "Which residents may benefit from schedule modifications?",
        a: `<strong>Residents Who May Benefit from Schedule Modifications</strong><br><br>Dr. Alvarez, Dr. Petrova, and Dr. Okafor are the top candidates — each is already eligible for the "retain most burnt-out residents" optimized schedule on the Scheduling tab, which would cut their hours roughly in half.`
      }
    ]
  },
  {
    id: "executive-program-director",
    title: "Executive Program Director Briefing",
    questions: [
      {
        q: "What is the overall workload burden score for the residency program this month?",
        a: `<strong>Program-Wide Workload Burden Score</strong><br><br><strong>68 / 100</strong> this month (higher = heavier burden), up from 61 last month — driven primarily by the Emergency Medicine, Surgery, and Internal Medicine cohorts.`
      },
      {
        q: "Which residents are at highest risk of burnout in the next 30 days?",
        a: `<strong>Highest 30-Day Burnout Risk</strong><br><br>Dr. T. Alvarez (highest), Dr. L. Petrova, and Dr. J. Okafor — all three already carrying 72–84h weeks with limited recovery time built into the next rotation block.`
      },
      {
        q: "What scheduling changes would reduce burnout risk while maintaining coverage?",
        a: `<strong>Recommended Scheduling Changes</strong><br><br>Redistributing 3–4 Night/Call shifts per week from the top 3 highest-hour residents to the 9 standard-tier residents would cut peak individual hours from 84h to roughly 48h without reducing total coverage.<br><br>This is exactly what the Scheduling tab's "balance workload" optimization already models.`
      },
      {
        q: "Which rotations contribute disproportionately to resident distress?",
        a: `<strong>Rotations Contributing Most to Distress</strong><br><br>Emergency Medicine, Surgery, and Internal Medicine — together responsible for the majority of flagged burnout and wellness-concern signals despite being 3 of 9 represented specialties.`
      },
      {
        q: "How does resident workload compare across specialties?",
        a: `<strong>Workload Comparison Across Specialties</strong><br><br>Surgery and Internal Medicine residents average 15–20% more weekly hours than the program median; Psychiatry and Family Medicine residents run closest to the lightest end of the range.`
      },
      {
        q: "What is the relationship between workload, wellness scores, and educational performance?",
        a: `<strong>Workload, Wellness &amp; Educational Performance</strong><br><br>Residents above 65h/week show both lower wellbeing scores and a lower ratio of educational-to-service time — the two effects move together, suggesting workload is the common upstream driver of both.`
      },
      {
        q: "Predict duty hour violations, burnout events, and staffing shortages over the next quarter.",
        a: `<strong>Next-Quarter Predictive Outlook</strong><br><br><strong>Duty hour risk:</strong> 1 resident (Alvarez) likely to approach the 80-hour threshold absent intervention.<br><strong>Burnout risk:</strong> 3 residents trending upward.<br><strong>Staffing:</strong> a 3-resident-week gap projected during the graduation-season transition.<br><br>All three risks concentrate in the same three services — addressing Emergency Medicine, Surgery, and Internal Medicine coverage first would move all three numbers at once.`
      },
      {
        q: "Generate a heat map of workload intensity across all residents and services.",
        a: `<strong>Workload Intensity Heat Map</strong><br><br>Highest intensity: Emergency Medicine, Surgery, Internal Medicine (Red). Moderate: Anesthesiology, OB/GYN, Radiology (Orange). Lowest: Family Medicine, Pediatrics, Psychiatry (Green).<br><br>This mirrors the tier structure already used on the Scheduling tab (top / standard / burnt-out).`
      },
      {
        q: "Recommend schedule optimizations to improve wellness without reducing coverage.",
        a: `<strong>Recommended Optimizations</strong><br><br>1. Apply the "balance workload evenly" schedule to redistribute hours from the 3 highest-burden residents.<br>2. Insert a mandatory recovery day after any 24h Call shift.<br>3. Cap consecutive Night shifts at 2 before requiring a Day or Off day.<br><br>Modeled together, these changes are projected to cut peak individual hours by roughly 40% with zero net change in total coverage.`
      },
      {
        q: "Which residents are projected to enter the \"high burnout risk\" category within the next 14 days based on shift intensity, circadian disruption, patient load, and recent workload patterns?",
        a: `<strong>14-Day Burnout Risk Projection</strong><br><br>Based on shift intensity, circadian disruption, and recent workload trend, <strong>Dr. T. Alvarez</strong> is projected to enter the high-burnout-risk category within 14 days at current pace (confidence: 81%). Dr. L. Petrova is the second-most-likely case (confidence: 54%).<br><br>Recommended: Intervene now — apply the burnt-out-resident optimization on the Scheduling tab before either resident crosses the threshold.`
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
   ROI Comparison tab (CEO)
   -------------------------------------------------------------------------
   Static figures straight from the intervention ROI analysis: only
   Flexible Scheduling has a disclosed investment/savings breakdown, so the
   other two show a dash in those columns rather than an invented number.
   ========================================================================= */

const roiInterventions = [
  { name: "Flexible Scheduling", investment: 145000, savings: 970000, roi: 569, color: "var(--green)" },
  { name: "Recovery Coaching", investment: null, savings: null, roi: 321, color: "var(--teal)" },
  { name: "Wellness Workshops", investment: null, savings: null, roi: 87, color: "var(--violet)" }
];

function formatCurrencyOrDash(n) {
  return n == null ? "—" : formatCurrency(n);
}

function renderRoiComparison() {
  const barsHost = document.querySelector("#roiBars");
  const tableHost = document.querySelector("#roiTable");
  const noteHost = document.querySelector("#roiNote");
  if (!barsHost || !tableHost) return;

  const maxRoi = Math.max(...roiInterventions.map(item => item.roi));
  barsHost.innerHTML = barListHTML(
    roiInterventions.map(item => [item.name, item.roi, item.color]),
    maxRoi,
    "%"
  );

  tableHost.innerHTML =
    `<thead><tr><th>Intervention</th><th>Investment</th><th>Est. Savings</th><th>ROI</th></tr></thead><tbody>` +
    roiInterventions.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${formatCurrencyOrDash(item.investment)}</td>
        <td>${formatCurrencyOrDash(item.savings)}</td>
        <td class="good">${item.roi}%</td>
      </tr>`).join("") +
    `</tbody>`;

  if (noteHost) noteHost.textContent = "Most Effective Driver: Improved schedule flexibility.";
}

renderRoiComparison();



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

/* Which shared-shell view requires which role. Director now gets an entirely
   separate shell (#directorRoot, see the Director dashboard section below)
   rather than individual restricted tabs inside the CEO shell, so this only
   still matters for ROI Comparison, which stays CEO-only inside #appRoot.
   Referenced here (to show/hide the nav item and bounce off a now-restricted
   view) and in switchView() (to block reaching it any other way). */
const roleRestrictedViews = {
  "v-roi": "ceo"
};

/* Shows/hides each role-restricted nav item for the signed-in role, and
   bounces to the Overview first if the session is already sitting on a view
   that role can no longer see (e.g. after switching accounts via Log Out). */
function applyRolePermissions(role) {
  Object.entries(roleRestrictedViews).forEach(([viewId, allowedRole]) => {
    const nav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    const allowed = role === allowedRole;
    if (nav) nav.style.display = allowed ? "" : "none";

    const view = document.getElementById(viewId);
    if (!allowed && view && view.classList.contains("active")) {
      switchView("v-overview");
    }
  });
}

/* =========================================================================
   Director Dashboard — real emPower "Program Director" experience
   -------------------------------------------------------------------------
   All charts use ECharts (loaded via CDN in index.html) to match the real
   product's chart engine for gauges/tree-maps, and are used for the bar/
   line charts too so only one charting library needs to load. Gauge value
   ranges, risk-level thresholds, and the two color-segment orderings
   (THEME_ONE = low-is-good, THEME_TWO = high-is-good) are taken directly
   from the real codebase's graphics.utils.ts, not approximated. Data itself
   is static/invented, since this remains a no-backend prototype.
   ========================================================================= */

const QUALITY_COLORS = { excellent: "#B6DB38", neutral: "#6BC4FF", mediocre: "#FF9204", dangerous: "#FF191C" };
const THEME_ONE = [QUALITY_COLORS.excellent, QUALITY_COLORS.neutral, QUALITY_COLORS.mediocre, QUALITY_COLORS.dangerous]; // low value = good
const THEME_TWO = [QUALITY_COLORS.dangerous, QUALITY_COLORS.mediocre, QUALITY_COLORS.neutral, QUALITY_COLORS.excellent]; // high value = good

const MONTHS_6 = ["Dec '23", "Jan '24", "Feb '24", "Mar '24", "Apr '24", "May '24"];

const FREQUENCY_LABELS = ["Never", "Rarely", "Sometimes", "Often", "Always"];
const FREQUENCY_COLORS = ["#f04438", "#ff9204", "#6bc4ff", "#a8d9d7", "#0c9590"];

function riskLevelFor(value, ranges) {
  if (!ranges) return "";
  for (const r of ranges) {
    if (value >= r.min && value <= r.max) return r.level;
  }
  return "";
}

function gaugeSegmentColor(value, min, max, segColors) {
  const ratio = (value - min) / (max - min);
  if (ratio <= 0.25) return segColors[0];
  if (ratio <= 0.5) return segColors[1];
  if (ratio <= 0.75) return segColors[2];
  return segColors[3];
}

function disposeChartIfAny(el) {
  if (typeof echarts !== "undefined" && el) {
    const existing = echarts.getInstanceByDom(el);
    if (existing) existing.dispose();
  }
}

/* ---- Static data (real metric names, invented static values) ------------- */

const directorData = {
  overview: {
    totalSeats: { categories: MONTHS_6, values: [24, 24, 23, 24, 24, 24] },
    assessmentParticipants: { total: 21, categories: MONTHS_6, values: [17, 18, 19, 20, 19, 21] },
    engagement: { value: 78, trend: 4, trendGood: true },
    wellnessScore: { value: 22, trend: 2, trendGood: true },
    burnoutInternal: { value: 11, trend: -1, trendGood: true },
    burnoutExternal: { value: 6, trend: 1, trendGood: false },
    burnoutCombined: { value: 18, trend: 3, trendGood: false },
    sleepQuality: [
      { name: "Poor", value: 12 },
      { name: "Fair", value: 26 },
      { name: "Good", value: 38 },
      { name: "Great", value: 24 }
    ],
    sleepQuantity: { categories: ["<5h", "5-6h", "6-7h", "7-8h", "8h+"], values: [8, 18, 30, 32, 12] }
  },
  wellness: {
    average: { value: 22, trend: 2, trendGood: true },
    byLevel: { categories: ["Excellent", "Neutral", "Mediocre", "Dangerous"], values: [22, 40, 28, 10] },
    target: { value: 62, trend: 5, trendGood: true },
    answers: [
      { title: "I feel I have adequate time for rest between shifts", dist: [8, 14, 28, 32, 18] },
      { title: "My workload feels manageable this month", dist: [12, 18, 26, 28, 16] }
    ]
  },
  burnoutInternal: {
    average: { value: 11, trend: -1, trendGood: true },
    byLevel: { categories: ["Excellent", "Neutral", "Mediocre", "Dangerous"], values: [30, 38, 22, 10] },
    target: { value: 58, trend: 4, trendGood: true },
    answers: [
      { title: "I feel emotionally exhausted by my work", dist: [10, 16, 30, 26, 18] },
      { title: "I feel a sense of accomplishment in my role", dist: [6, 12, 24, 34, 24] }
    ]
  },
  burnoutExternal: {
    average: { value: 6, trend: 1, trendGood: false },
    byLevel: { categories: ["Excellent", "Neutral", "Mediocre", "Dangerous"], values: [24, 34, 28, 14] },
    target: { value: 64, trend: 2, trendGood: true },
    answers: [
      { title: "I feel supported by hospital leadership", dist: [14, 20, 28, 24, 14] },
      { title: "I have access to adequate mental health resources", dist: [10, 16, 26, 30, 18] }
    ]
  },
  burnoutCombined: {
    value: 18,
    trend: 3,
    trendGood: false,
    byPgy: { categories: ["PGY-1", "PGY-2", "PGY-3", "PGY-4+"], values: [12, 26, 22, 9] }
  },
  sleep: {
    quality: [
      { name: "Poor", value: 12 },
      { name: "Fair", value: 26 },
      { name: "Good", value: 38 },
      { name: "Great", value: 24 }
    ],
    meetingTarget: { total: 54, categories: MONTHS_6, values: [48, 50, 49, 52, 51, 54] },
    quantity: { categories: ["<5h", "5-6h", "6-7h", "7-8h", "8h+"], values: [8, 18, 30, 32, 12] },
    average: { total: 6.4, categories: MONTHS_6, values: [6.1, 6.2, 6.0, 6.3, 6.2, 6.4] }
  }
};

const gaugeRanges = {
  engagement: { min: 0, max: 100, theme: THEME_TWO },
  wellnessScore: {
    min: 6, max: 30, theme: THEME_TWO,
    riskRanges: [
      { level: "Excellent", min: 25, max: 30 },
      { level: "Neutral", min: 19, max: 24 },
      { level: "Mediocre", min: 13, max: 18 },
      { level: "Dangerous", min: 6, max: 12 }
    ]
  },
  burnoutInternal: {
    min: 4, max: 20, theme: THEME_ONE,
    riskRanges: [
      { level: "Excellent", min: 4, max: 7 },
      { level: "Neutral", min: 8, max: 12 },
      { level: "Mediocre", min: 13, max: 15 },
      { level: "Dangerous", min: 16, max: 20 }
    ]
  },
  burnoutExternal: {
    min: 2, max: 10, theme: THEME_ONE,
    riskRanges: [
      { level: "Excellent", min: 2, max: 4 },
      { level: "Neutral", min: 5, max: 5 },
      { level: "Mediocre", min: 6, max: 7 },
      { level: "Dangerous", min: 8, max: 10 }
    ]
  },
  percent: {
    min: 0, max: 100, theme: THEME_ONE,
    riskRanges: [
      { level: "Excellent", min: 0, max: 15 },
      { level: "Neutral", min: 16, max: 25 },
      { level: "Mediocre", min: 26, max: 40 },
      { level: "Dangerous", min: 41, max: 100 }
    ]
  },
  percentGood: {
    min: 0, max: 100, theme: THEME_TWO,
    riskRanges: [
      { level: "Dangerous", min: 0, max: 40 },
      { level: "Mediocre", min: 41, max: 55 },
      { level: "Neutral", min: 56, max: 70 },
      { level: "Excellent", min: 71, max: 100 }
    ]
  }
};

/* ---- Chart builders -------------------------------------------------------- */

function renderGauge(elId, { value, rangeKey, unit = "" }) {
  const el = document.getElementById(elId);
  if (!el || typeof echarts === "undefined") return;
  disposeChartIfAny(el);
  const range = gaugeRanges[rangeKey];
  const color = gaugeSegmentColor(value, range.min, range.max, range.theme);
  const chart = echarts.init(el);
  chart.setOption({
    series: [{
      type: "gauge",
      startAngle: 210,
      endAngle: -30,
      min: range.min,
      max: range.max,
      splitNumber: 4,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        distance: -30,
        fontFamily: "Poppins, sans-serif",
        fontSize: 10,
        fontWeight: 500,
        color: "#9da4ae",
        formatter: v => `${v}${unit}`
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 16,
          color: [
            [0.25, range.theme[0]],
            [0.5, range.theme[1]],
            [0.75, range.theme[2]],
            [1, range.theme[3]]
          ]
        }
      },
      pointer: { length: "52%", width: 5, itemStyle: { color } },
      detail: {
        valueAnimation: true,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontSize: 30,
        offsetCenter: [0, "0%"],
        formatter: v => `${Math.round(v)}${unit}`,
        color
      },
      data: [{ value }]
    }]
  });
  return { color, status: riskLevelFor(value, range.riskRanges) };
}

function renderBarChart(elId, { categories, values, suffix = "", color = "#124f4d", maxY }) {
  const el = document.getElementById(elId);
  if (!el || typeof echarts === "undefined") return;
  disposeChartIfAny(el);
  const chart = echarts.init(el);
  chart.setOption({
    grid: { left: 34, right: 10, top: 30, bottom: 26 },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: "#dddddc" } },
      axisTick: { show: false },
      axisLabel: { fontFamily: "Poppins, sans-serif", fontSize: 10, color: "#4d5762" }
    },
    yAxis: {
      type: "value",
      max: maxY,
      splitLine: { lineStyle: { color: "#f0f0f0" } },
      axisLabel: { fontFamily: "Poppins, sans-serif", fontSize: 10, color: "#4d5762", formatter: v => `${v}${suffix}` }
    },
    series: [{
      type: "bar",
      data: values,
      barWidth: "48%",
      itemStyle: { color, borderRadius: [6, 6, 0, 0] },
      label: {
        show: true,
        position: "top",
        fontFamily: "Poppins, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        color: "#121927",
        formatter: p => `${p.value}${suffix}`
      }
    }]
  });
}

function renderLineChart(elId, { categories, values, color = "#124f4d", maxY }) {
  const el = document.getElementById(elId);
  if (!el || typeof echarts === "undefined") return;
  disposeChartIfAny(el);
  const chart = echarts.init(el);
  chart.setOption({
    grid: { left: 34, right: 10, top: 20, bottom: 26 },
    xAxis: {
      type: "category",
      data: categories,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#dddddc" } },
      axisTick: { show: false },
      axisLabel: { fontFamily: "Poppins, sans-serif", fontSize: 10, color: "#4d5762" }
    },
    yAxis: {
      type: "value",
      min: 0,
      max: maxY,
      splitLine: { lineStyle: { color: "#f0f0f0" } },
      axisLabel: { fontFamily: "Poppins, sans-serif", fontSize: 10, color: "#4d5762" }
    },
    series: [{
      type: "line",
      data: values,
      smooth: true,
      symbolSize: 7,
      lineStyle: { width: 2, color },
      itemStyle: { color },
      areaStyle: { color, opacity: 0.06 }
    }]
  });
}

function renderTreeMap(elId, { data, colors }) {
  const el = document.getElementById(elId);
  if (!el || typeof echarts === "undefined") return;
  disposeChartIfAny(el);
  const chart = echarts.init(el);
  chart.setOption({
    series: [{
      type: "treemap",
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: "#fff", gapWidth: 3 },
      label: {
        show: true,
        formatter: p => `${p.value}% ${p.name}`,
        fontFamily: "Poppins, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "#fff"
      },
      data: data.map((d, i) => ({ name: d.name, value: d.value, itemStyle: { color: colors[i % colors.length] } }))
    }]
  });
}

function renderAnswerRows(containerId, questions) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const rows = questions.map(q => `
    <div class="d-answer-row">
      <p class="d-answer-question">${q.title}</p>
      <div class="d-answer-bar">
        ${q.dist.map((pct, i) => `<div class="d-answer-seg" style="width:${pct}%; background:${FREQUENCY_COLORS[i]}">${pct >= 8 ? pct + "%" : ""}</div>`).join("")}
      </div>
    </div>`).join("");
  const legend = `<div class="d-answer-legend">${FREQUENCY_LABELS.map((label, i) => `<span><span class="dot" style="background:${FREQUENCY_COLORS[i]}"></span>${label}</span>`).join("")}</div>`;
  el.innerHTML = rows + legend;
}

/* ---- Card markup + caption helpers ---------------------------------------- */

function gaugeCardHTML(chartId, title) {
  return `
    <article class="d-card">
      <div class="d-card-title-row"><span class="d-card-title">${title}</span></div>
      <div class="d-chart-el d-gauge" id="${chartId}"></div>
      <div class="d-gauge-caption" id="${chartId}-caption"></div>
    </article>`;
}

function chartCardHTML(chartId, title, { total, unit } = {}) {
  return `
    <article class="d-card">
      <div class="d-card-title-row">
        <span class="d-card-title">${title}</span>
        ${total !== undefined ? `<span class="d-card-total">${total}${unit || ""}</span>` : ""}
      </div>
      <div class="d-chart-el" id="${chartId}"></div>
    </article>`;
}

function fillGaugeCaption(chartId, { status, statusColor, dateRange = "May '24", trend, trendGood, unit = "" }) {
  const el = document.getElementById(`${chartId}-caption`);
  if (!el) return;
  el.innerHTML = `
    ${status ? `<span style="color:${statusColor}; font-weight:600; font-size:13px;">${status}</span>` : ""}
    <span class="d-gauge-date">${dateRange}</span>
    <span class="d-gauge-trend">
      <span class="d-trend-pill ${trendGood ? "good" : "bad"}">${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)}${unit}</span>
      <span class="d-trend-caption">vs last month</span>
    </span>`;
}

function renderGaugeCard(chartId, value, rangeKey, trend, trendGood, unit = "") {
  const result = renderGauge(chartId, { value, rangeKey, unit });
  if (result) fillGaugeCaption(chartId, { status: result.status, statusColor: result.color, trend, trendGood, unit });
}

/* ---- Tab render functions -------------------------------------------------- */

function renderOverviewTab() {
  const host = document.getElementById("dOverviewGrid");
  if (!host) return;
  const d = directorData.overview;
  host.innerHTML =
    chartCardHTML("dTotalSeats", "Total seats") +
    chartCardHTML("dAssessmentParticipants", "May assessment participants", { total: d.assessmentParticipants.total }) +
    gaugeCardHTML("dEngagement", "May engagement") +
    gaugeCardHTML("dWellnessScore", "Wellness average score") +
    gaugeCardHTML("dBurnoutInternal", "Internal burnout average score") +
    gaugeCardHTML("dBurnoutExternal", "External burnout average score") +
    gaugeCardHTML("dBurnoutCombined", "Residents with internal and external burnout") +
    chartCardHTML("dSleepQuality", "Sleep quality") +
    chartCardHTML("dSleepQuantity", "Sleep quantity");

  renderBarChart("dTotalSeats", { categories: d.totalSeats.categories, values: d.totalSeats.values, color: "#124f4d" });
  renderLineChart("dAssessmentParticipants", { categories: d.assessmentParticipants.categories, values: d.assessmentParticipants.values, color: "#124f4d" });
  renderGaugeCard("dEngagement", d.engagement.value, "engagement", d.engagement.trend, d.engagement.trendGood, "%");
  renderGaugeCard("dWellnessScore", d.wellnessScore.value, "wellnessScore", d.wellnessScore.trend, d.wellnessScore.trendGood);
  renderGaugeCard("dBurnoutInternal", d.burnoutInternal.value, "burnoutInternal", d.burnoutInternal.trend, d.burnoutInternal.trendGood);
  renderGaugeCard("dBurnoutExternal", d.burnoutExternal.value, "burnoutExternal", d.burnoutExternal.trend, d.burnoutExternal.trendGood);
  renderGaugeCard("dBurnoutCombined", d.burnoutCombined.value, "percent", d.burnoutCombined.trend, d.burnoutCombined.trendGood, "%");
  renderTreeMap("dSleepQuality", { data: d.sleepQuality, colors: [QUALITY_COLORS.dangerous, QUALITY_COLORS.mediocre, QUALITY_COLORS.neutral, QUALITY_COLORS.excellent] });
  renderBarChart("dSleepQuantity", { categories: d.sleepQuantity.categories, values: d.sleepQuantity.values, suffix: "%", color: "#124f4d", maxY: 60 });
}

function renderWellnessTab() {
  const host = document.getElementById("dWellnessGrid");
  if (!host) return;
  const d = directorData.wellness;
  host.innerHTML =
    gaugeCardHTML("dWellAvg", "Average score") +
    chartCardHTML("dWellByLevel", "% residents at each score level") +
    gaugeCardHTML("dWellTarget", "Residents reaching the target");

  renderGaugeCard("dWellAvg", d.average.value, "wellnessScore", d.average.trend, d.average.trendGood);
  renderBarChart("dWellByLevel", { categories: d.byLevel.categories, values: d.byLevel.values, suffix: "%", color: "#124f4d", maxY: 100 });
  renderGaugeCard("dWellTarget", d.target.value, "percentGood", d.target.trend, d.target.trendGood, "%");

  renderAnswerRows("dWellnessAnswers", d.answers);
}

function renderBurnoutTab() {
  const gridInt = document.getElementById("dBurnoutInternalGrid");
  const gridExt = document.getElementById("dBurnoutExternalGrid");
  const gridCombined = document.getElementById("dBurnoutCombinedGrid");
  if (!gridInt || !gridExt || !gridCombined) return;

  const int = directorData.burnoutInternal;
  const ext = directorData.burnoutExternal;
  const combined = directorData.burnoutCombined;

  gridInt.innerHTML =
    gaugeCardHTML("dBiAvg", "Average score") +
    chartCardHTML("dBiByLevel", "% residents at each score level") +
    gaugeCardHTML("dBiTarget", "Residents reaching the target");
  renderGaugeCard("dBiAvg", int.average.value, "burnoutInternal", int.average.trend, int.average.trendGood);
  renderBarChart("dBiByLevel", { categories: int.byLevel.categories, values: int.byLevel.values, suffix: "%", color: "#124f4d", maxY: 100 });
  renderGaugeCard("dBiTarget", int.target.value, "percentGood", int.target.trend, int.target.trendGood, "%");
  renderAnswerRows("dBurnoutInternalAnswers", int.answers);

  gridExt.innerHTML =
    gaugeCardHTML("dBeAvg", "External burnout average score") +
    chartCardHTML("dBeByLevel", "% residents at each score level") +
    gaugeCardHTML("dBeTarget", "Residents reaching the target");
  renderGaugeCard("dBeAvg", ext.average.value, "burnoutExternal", ext.average.trend, ext.average.trendGood);
  renderBarChart("dBeByLevel", { categories: ext.byLevel.categories, values: ext.byLevel.values, suffix: "%", color: "#124f4d", maxY: 100 });
  renderGaugeCard("dBeTarget", ext.target.value, "percentGood", ext.target.trend, ext.target.trendGood, "%");
  renderAnswerRows("dBurnoutExternalAnswers", ext.answers);

  gridCombined.innerHTML =
    gaugeCardHTML("dCombined", "Residents with internal and external burnout") +
    chartCardHTML("dCombinedByPgy", "Residents meeting both internally and externally burned out");
  renderGaugeCard("dCombined", combined.value, "percent", combined.trend, combined.trendGood, "%");
  renderBarChart("dCombinedByPgy", { categories: combined.byPgy.categories, values: combined.byPgy.values, suffix: "%", color: "#124f4d", maxY: 100 });
}

function renderSleepTab() {
  const gridQuality = document.getElementById("dSleepQualityGrid");
  const gridQuantity = document.getElementById("dSleepQuantityGrid");
  if (!gridQuality || !gridQuantity) return;
  const d = directorData.sleep;

  gridQuality.innerHTML =
    chartCardHTML("dSleepQualityTree", "Sleep quality") +
    chartCardHTML("dSleepMeetingTarget", "Meeting target of 7 and above", { total: d.meetingTarget.total, unit: "%" });
  renderTreeMap("dSleepQualityTree", { data: d.quality, colors: [QUALITY_COLORS.dangerous, QUALITY_COLORS.mediocre, QUALITY_COLORS.neutral, QUALITY_COLORS.excellent] });
  renderLineChart("dSleepMeetingTarget", { categories: d.meetingTarget.categories, values: d.meetingTarget.values, color: "#124f4d", maxY: 100 });

  gridQuantity.innerHTML =
    chartCardHTML("dSleepQuantityBar", "Sleep quantity") +
    chartCardHTML("dSleepAverage", "Average quantity", { total: d.average.total, unit: "h" });
  renderBarChart("dSleepQuantityBar", { categories: d.quantity.categories, values: d.quantity.values, suffix: "%", color: "#124f4d", maxY: 60 });
  renderLineChart("dSleepAverage", { categories: d.average.categories, values: d.average.values, color: "#124f4d", maxY: 10 });
}

/* ---- Wiring: sidebar nav, tabs, filters, collapse, user menu --------------- */

let directorDashboardInitialized = false;

function renderDirectorTab(tab) {
  if (tab === "overview") renderOverviewTab();
  else if (tab === "wellness") renderWellnessTab();
  else if (tab === "burnout") renderBurnoutTab();
  else if (tab === "sleep") renderSleepTab();
}

function closeAllDirectorMenus() {
  document.querySelectorAll("#directorRoot .d-dropdown.open, #directorRoot .d-user-menu.open").forEach(m => m.classList.remove("open"));
  document.querySelectorAll("#directorRoot [aria-expanded='true']").forEach(b => b.setAttribute("aria-expanded", "false"));
}

function wireDirectorNav() {
  document.querySelectorAll("#directorRoot .d-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.dview;
      document.querySelectorAll("#directorRoot .d-nav-item").forEach(b => b.classList.toggle("active", b === btn));
      document.querySelectorAll("#directorRoot .d-view").forEach(v => v.classList.toggle("active", v.id === target));
    });
  });
}

function wireDirectorTabs() {
  document.querySelectorAll("#directorRoot .d-tab").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      const target = tabBtn.dataset.dtab;
      document.querySelectorAll("#directorRoot .d-tab").forEach(t => t.classList.toggle("active", t === tabBtn));
      document.querySelectorAll("#directorRoot .d-tab-panel").forEach(p => p.classList.toggle("active", p.id === `d-tab-${target}`));
      renderDirectorTab(target);
    });
  });
}

function wireDirectorSidebarCollapse() {
  const btn = document.getElementById("dCollapseBtn");
  const side = document.getElementById("dSide");
  if (!btn || !side) return;
  btn.addEventListener("click", () => side.classList.toggle("collapsed"));
}

function wireDirectorUserMenu() {
  const btn = document.getElementById("dUserMenuBtn");
  const menu = document.getElementById("dUserMenu");
  if (!btn || !menu) return;
  btn.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    closeAllDirectorMenus();
    menu.classList.toggle("open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  });
}

function setupDirectorDropdown(btnId, menuId, labelId, options) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  const label = document.getElementById(labelId);
  if (!btn || !menu || !label) return;

  let active = options[0];

  function renderMenu() {
    menu.innerHTML = options.map(opt => `<button type="button" class="d-dropdown-item ${opt === active ? "active" : ""}" data-value="${opt}">${opt}</button>`).join("");
  }
  renderMenu();

  btn.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    closeAllDirectorMenus();
    menu.classList.toggle("open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  });

  menu.addEventListener("click", event => {
    const item = event.target.closest("[data-value]");
    if (!item) return;
    active = item.dataset.value;
    label.textContent = active;
    renderMenu();
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  });
}

function wireDirectorFilters() {
  setupDirectorDropdown("dPgyBtn", "dPgyMenu", "dPgyLabel", ["All PGY Levels", "PGY-1", "PGY-2", "PGY-3", "PGY-4+"]);
  setupDirectorDropdown("dMonthBtn", "dMonthMenu", "dMonthLabel", ["May 2024", "Apr 2024", "Mar 2024", "Feb 2024"]);

  /* Uses composedPath() (captured at dispatch time) rather than checking
     event.target after the fact — the same DOM-mutation-during-click
     pitfall already found and fixed for the AI-CWO chat panel applies here
     too, since selecting a dropdown item re-renders that dropdown's HTML
     mid-bubble. */
  document.addEventListener("click", event => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const insideDirectorControl = path.some(node =>
      node && node.classList && (node.classList.contains("d-pill-wrap") || node.classList.contains("d-user-wrap"))
    );
    if (!insideDirectorControl) closeAllDirectorMenus();
  });
}

function initDirectorDashboard() {
  if (!directorDashboardInitialized) {
    wireDirectorNav();
    wireDirectorTabs();
    wireDirectorFilters();
    wireDirectorSidebarCollapse();
    wireDirectorUserMenu();
    directorDashboardInitialized = true;
  }
  renderDirectorTab("overview");
}

function initLogin() {
  const loginScreen = document.querySelector("#loginScreen");
  const appRoot = document.querySelector("#appRoot");
  const directorRoot = document.querySelector("#directorRoot");
  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const errorEl = document.querySelector("#loginError");
  const userMenuLabel = document.querySelector("#userMenuLabel");
  const userMenuBtn = document.querySelector("#userMenuBtn");
  const userMenu = document.querySelector("#userMenu");
  const logoutBtn = document.querySelector("#logoutBtn");
  const dLogoutBtn = document.querySelector("#dLogoutBtn");
  if (!loginScreen || !appRoot || !form) return;

  function showApp(role) {
    currentRole = role;
    loginScreen.classList.add("dismissed");
    if (role === "director") {
      appRoot.classList.remove("visible");
      if (directorRoot) directorRoot.classList.add("visible");
      initDirectorDashboard();
    } else {
      if (directorRoot) directorRoot.classList.remove("visible");
      appRoot.classList.add("visible");
      applyRolePermissions(role);
      if (userMenuLabel) userMenuLabel.textContent = "CEO — Lifespan";
    }
  }

  function logOut() {
    currentRole = null;
    clearStoredRole();
    form.reset();
    if (errorEl) errorEl.classList.remove("visible");
    appRoot.classList.remove("visible");
    if (directorRoot) directorRoot.classList.remove("visible");
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
  if (dLogoutBtn) dLogoutBtn.addEventListener("click", logOut);

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
