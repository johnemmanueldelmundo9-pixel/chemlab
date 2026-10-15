// Floating AI tutor launcher. For now it reports Ollama status and setup steps;
// the real chat UI comes in a later step.
import { icon } from '../lib/icons.js';
import { checkOllama, getOllamaUrl } from '../ai/status.js';

export function mountChat(app) {
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.type = 'button';
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = `${icon('chat')}<span>Ask ChemBot</span>`;

  const panel = document.createElement('section');
  panel.className = 'chat-panel';
  panel.setAttribute('aria-label', 'ChemBot AI tutor');
  panel.innerHTML = `
    <div class="chat-head"><span>ChemBot · AI tutor</span><button type="button" aria-label="Close">×</button></div>
    <div class="chat-body">
      <div class="status-row"><span class="dot"></span><span class="status-text">Checking for Ollama…</span></div>
      <p class="detail"></p>
    </div>`;
  app.append(panel, fab);

  const dot = panel.querySelector('.dot');
  const text = panel.querySelector('.status-text');
  const detail = panel.querySelector('.detail');

  async function refresh() {
    dot.className = 'dot'; text.textContent = 'Checking for Ollama…';
    const r = await checkOllama();
    if (r.ok) {
      dot.className = 'dot ok';
      text.textContent = 'Ollama connected';
      detail.textContent = r.models.length
        ? `Models available: ${r.models.slice(0, 4).join(', ')}. The chat itself is coming in the next step.`
        : 'Connected, but no models are installed yet. Run: ollama pull llama3.2';
    } else {
      dot.className = 'dot no';
      text.textContent = 'Ollama not detected';
      detail.innerHTML = `ChemBot runs on your own computer through Ollama (looking at <code>${getOllamaUrl()}</code>). To enable it:
        <pre>ollama pull llama3.2\nOLLAMA_ORIGINS="*" ollama serve</pre>
        The rest of ChemLab works without it.`;
    }
  }

  const open = (state) => {
    panel.classList.toggle('open', state);
    fab.setAttribute('aria-expanded', String(state));
    if (state) refresh();
  };
  fab.addEventListener('click', () => open(!panel.classList.contains('open')));
  panel.querySelector('.chat-head button').addEventListener('click', () => open(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
  addEventListener('chemlab:open-chat', () => open(true));
}
