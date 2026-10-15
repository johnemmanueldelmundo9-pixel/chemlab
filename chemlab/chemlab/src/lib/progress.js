// Learner progress, stored in the browser (no account needed).
// Shape: { [moduleId]: ["lesson-1", "sim-1", "calc-2", "quiz", ...] }
import { MODULES, totalItems } from '../data/modules.js';

const KEY = 'chemlab:progress:v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage blocked: progress just won't persist */ }
}

export function markDone(moduleId, itemId) {
  const data = read();
  const set = new Set(data[moduleId] || []);
  set.add(itemId);
  data[moduleId] = [...set];
  write(data);
}

export function moduleProgress(m) {
  const done = (read()[m.id] || []).length;
  const total = totalItems(m);
  return { done, total, pct: Math.min(100, Math.round((done / total) * 100)) };
}

export function overallProgress() {
  let done = 0, total = 0;
  for (const m of MODULES) { const p = moduleProgress(m); done += p.done; total += p.total; }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function resetProgress() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
