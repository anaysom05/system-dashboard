/*
 * Icon set for the emPower+ dashboard.
 *
 * Artwork is Lucide (https://lucide.dev, ISC License) on a 24x24 grid, plus a
 * few marks drawn here for things Lucide does not cover (the brand mark and the
 * solid trend carets).
 *
 * Only geometry lives here. Stroke weight, size and colour are set in CSS on
 * the .ico class so every icon inherits currentColor from its container.
 *
 * This is a .js file rather than a standalone assets/icons/sprite.svg because
 * <use href="sprite.svg#id"> is blocked as a cross-origin request when
 * index.html is opened straight off disk over file://, which leaves every icon
 * as a silent blank gap. Injecting the symbols at runtime works both from disk
 * and over http (GitHub Pages), with no build step either way.
 */

const ICONS = {
  /* Sidebar navigation */
  "layout-dashboard":
    '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  "shield-alert":
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  network:
    '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  "graduation-cap":
    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  stethoscope:
    '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  "heart-handshake":
    '<path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"/>',
  bed:
    '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  "circle-dollar-sign":
    '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  "clipboard-check":
    '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  "file-text":
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',

  /* Header toolbar */
  calendar:
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "list-filter": '<path d="M2 5h20"/><path d="M6 12h12"/><path d="M9 19h6"/>',
  "circle-help":
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',

  /* KPI tiles */
  "chart-column":
    '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  "user-round": '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  "users-round":
    '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
  moon:
    '<path d="M18.8 13.6A7.1 7.1 0 1 1 10.4 5.2a5.1 5.1 0 0 0 8.4 8.4Z"/>',
  "heart-pulse":
    '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  "dollar-sign":
    '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',

  /* Callout banner */
  "shield-user":
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M6.376 18.91a6 6 0 0 1 11.249.003"/><circle cx="12" cy="11" r="4"/>',

  /* Forecast rows + wellbeing tiles */
  award:
    '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  brain:
    '<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',

  /* Recommended-action badges + card affordances */
  "circle-alert":
    '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  "triangle-alert":
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',

  /* Drawn here, not from Lucide: solid trend carets for the ranking tables */
  "caret-up": '<path d="M12 7.5 20 17H4z"/>',
  "caret-down": '<path d="M12 16.5 4 7h16z"/>',

  /* Drawn here, not from Lucide: the emPower+ brand mark */
  "empower-mark":
    '<rect x="7.4" y="6.6" width="5.2" height="14.8" rx="2.6"/><rect x="2.6" y="11.4" width="14.8" height="5.2" rx="2.6"/><path d="M21.6 2.4a7.6 7.6 0 0 1-7.6 7.6 7.6 7.6 0 0 1 7.6-7.6z"/>'
};

/*
 * Builds the hidden <symbol> sprite. Runs on load; every icon in the page is a
 * reference to one of these, so an icon is defined exactly once no matter how
 * many places use it.
 */
function mountIconSprite() {
  if (document.querySelector("#icon-sprite")) return;

  const symbols = Object.keys(ICONS)
    .map(name => `<symbol id="i-${name}" viewBox="0 0 24 24">${ICONS[name]}</symbol>`)
    .join("");

  const sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sprite.id = "icon-sprite";
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  sprite.innerHTML = symbols;
  document.body.prepend(sprite);
}

/*
 * Markup for one icon. `extra` takes modifier classes — "solid" to fill instead
 * of stroke, or any sizing class. Icons are decorative here because every one
 * of them sits next to its own text label.
 */
function icon(name, extra) {
  return `<svg class="ico${extra ? " " + extra : ""}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

/*
 * Swaps any <i data-icon="name"> placeholder in the static HTML for real icon
 * markup, so index.html stays readable instead of carrying <svg><use> noise.
 */
function hydrateIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach(node => {
    node.outerHTML = icon(node.dataset.icon, node.dataset.iconClass);
  });
}

mountIconSprite();
hydrateIcons();
