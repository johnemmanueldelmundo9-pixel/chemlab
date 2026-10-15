// Checks whether an Ollama server is reachable. The URL is configurable so it can
// later point at a tunnel or a server instead of the visitor's own machine.
const KEY = 'chemlab:ollama-url';
export const DEFAULT_URL = 'http://localhost:11434';

export function getOllamaUrl() {
  try { return localStorage.getItem(KEY) || DEFAULT_URL; } catch { return DEFAULT_URL; }
}

export async function checkOllama(url = getOllamaUrl()) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(`${url}/api/tags`, { signal: ctrl.signal });
    if (!res.ok) return { ok: false, models: [] };
    const data = await res.json();
    return { ok: true, models: (data.models || []).map((m) => m.name) };
  } catch {
    return { ok: false, models: [] };
  } finally {
    clearTimeout(timer);
  }
}
