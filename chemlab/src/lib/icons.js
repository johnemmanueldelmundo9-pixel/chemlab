// Inline SVG icons (stroke style, 24x24). Keeps the site dependency-free.
const wrap = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ICONS = {
  flask: wrap('<path d="M9 3h6M10 3v6l-5.2 9.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9V3"/><path d="M7.5 15h9"/>'),
  atom: wrap('<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>'),
  molecule: wrap('<circle cx="6" cy="7" r="2.6"/><circle cx="18" cy="7" r="2.6"/><circle cx="12" cy="18" r="3"/><path d="M8.5 8l2.2 7M15.5 8l-2.2 7M8.6 7h6.8"/>'),
  balance: wrap('<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z"/>'),
  gas: wrap('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.2"/><circle cx="15" cy="8" r="1.2"/><circle cx="12" cy="13" r="1.2"/><circle cx="17" cy="15" r="1.2"/><circle cx="7" cy="16" r="1.2"/>'),
  flame: wrap('<path d="M12 2.5c.8 3.6 5.5 5 5.5 10a5.5 5.5 0 0 1-11 0c0-2 .9-3.4 2.2-4.6.2 1.7 1 2.6 2 2.9C10.3 7.5 10.4 5 12 2.5z"/>'),
  bolt: wrap('<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z"/>'),
  book: wrap('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>'),
  sliders: wrap('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  calc: wrap('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4"/>'),
  check: wrap('<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.5"/>'),
  sun: wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: wrap('<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>'),
  chat: wrap('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>'),
};

export const icon = (name) => ICONS[name] || '';
