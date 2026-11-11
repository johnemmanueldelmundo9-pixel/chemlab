// ChemBot: floating chat panel. Talks to /api/chat (Vercel function), which holds the AI key.
// The page the student is on (module + topic) is sent with every question so answers match it.
import { icon } from '../lib/icons.js';
import { getContext, describeContext, starterQuestions } from '../lib/chatContext.js';
import { mdLite } from '../lib/mdLite.js';

const STORE = 'chemlab:chat:v1';
const MAX_KEEP = 20;
const MAX_LEN = 600;

const ERRORS = {
  not_configured: "ChemBot isn't switched on yet. Please try again later.",
  busy: 'ChemBot is busy right now. Give it a minute and ask again.',
  rate_limited: "You've asked a lot of questions in a short time. Take a short break and try again in a few minutes.",
  network: "Couldn't reach ChemBot. Check your connection and try again.",
  other: 'Something went wrong. Please try again.',
};

function load() {
  try { return JSON.parse(sessionStorage.getItem(STORE)) || []; } catch { return []; }
}
function save(list) {
  try { sessionStorage.setItem(STORE, JSON.stringify(list.slice(-MAX_KEEP))); } catch { /* ignore */ }
}

export function mountChat(app) {
  let history = load();          // [{role: 'user'|'assistant', content}]
  let controller = null;         // aborts the request in flight
  let lastQuestion = '';
  let epoch = 0;                 // bumps on "new chat" so a stale reply never lands in the new conversation

  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Ask ChemBot');
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'chembot-panel');
  fab.innerHTML = `${icon('chat')}<span>Ask ChemBot</span>`;

  const panel = document.createElement('section');
  panel.id = 'chembot-panel';
  panel.className = 'chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'ChemBot AI tutor');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="chat-head">
      <div class="chat-title"><strong>ChemBot</strong><span class="chat-ctx"></span></div>
      <button type="button" class="chat-new" aria-label="Start a new chat" title="New chat">${icon('refresh')}</button>
      <button type="button" class="chat-close" aria-label="Close ChemBot" title="Close">${icon('close')}</button>
    </div>
    <div class="chat-log" role="log" aria-live="polite"></div>
    <div class="chat-chips" aria-label="Suggested questions"></div>
    <form class="chat-form">
      <label class="sr-only" for="chat-input">Ask a chemistry question</label>
      <textarea id="chat-input" rows="1" maxlength="${MAX_LEN}" placeholder="Ask a chemistry question…"></textarea>
      <button type="submit" class="chat-send" aria-label="Send" disabled>${icon('send')}</button>
    </form>
    <p class="chat-foot">ChemBot can make mistakes—check numbers with the calculators. Messages are sent to an AI service (DeepSeek or Google Gemini); don’t share personal details. By sending a message you agree to the <a href="#/terms">Terms</a> and <a href="#/privacy">Privacy Policy</a>.</p>`;
  app.append(panel, fab);

  const log = panel.querySelector('.chat-log');
  const chips = panel.querySelector('.chat-chips');
  const form = panel.querySelector('.chat-form');
  const input = panel.querySelector('textarea');
  const send = panel.querySelector('.chat-send');
  const ctxLabel = panel.querySelector('.chat-ctx');

  /* ---------- rendering ---------- */
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function bubble(role, content) {
    const b = document.createElement('div');
    b.className = `msg ${role === 'user' ? 'you' : 'bot'}`;
    if (role === 'user') b.textContent = content; else b.innerHTML = mdLite(content);
    log.append(b);
    scroll();
    return b;
  }
  function renderChips() {
    const show = !history.length && !controller;
    chips.hidden = !show;
    chips.replaceChildren();
    if (!show) return;
    for (const question of starterQuestions()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip-q';
      button.textContent = question;
      button.title = question;
      chips.append(button);
    }
  }
  function renderContext() {
    const description = describeContext();
    ctxLabel.textContent = description;
    ctxLabel.title = description;
    renderChips();
  }
  function renderAll() {
    log.innerHTML = '';
    if (!history.length) {
      const hello = document.createElement('div');
      hello.className = 'msg bot';
      hello.innerHTML = `<p>Hi! I'm ChemBot. Ask me anything about chemistry. I'll tailor my answers to the page you're on.</p>`;
      log.append(hello);
    }
    history.forEach((m) => bubble(m.role, m.content));
    renderContext();
  }
  function setBusy(state) {
    send.innerHTML = icon(state ? 'stop' : 'send');
    send.setAttribute('aria-label', state ? 'Stop' : 'Send');
    send.classList.toggle('stop', state);
    send.disabled = state ? false : !input.value.trim();
    log.setAttribute('aria-busy', String(state));
    renderChips();
  }

  /* ---------- talking to the server ---------- */
  async function ask(text) {
    text = text.trim().slice(0, MAX_LEN);
    if (!text || controller) return;
    lastQuestion = text;
    history.push({ role: 'user', content: text });
    save(history);
    bubble('user', text);
    input.value = ''; autosize();
    const reply = bubble('assistant', '');
    reply.classList.add('typing');
    reply.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
    const mine = epoch;
    controller = new AbortController();
    setBusy(true);

    let answer = '';
    let failed = null;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ messages: history.slice(-8), context: getContext() }),
      });
      if (!res.ok) {
        let code = 'other';
        try { code = (await res.json()).error; } catch { /* not JSON */ }
        failed = res.status === 404 ? 'not_configured' : res.status === 429 ? (code === 'rate_limited' ? 'rate_limited' : 'busy') : res.status === 503 ? 'not_configured' : 'other';
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let queued = false;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          if (!queued) {
            queued = true;
            requestAnimationFrame(() => { queued = false; reply.classList.remove('typing'); reply.innerHTML = mdLite(answer); scroll(); });
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') failed = 'network';
    }

    if (mine !== epoch) return; // the chat was reset while this was in flight
    controller = null;
    reply.classList.remove('typing');
    if (answer) { reply.innerHTML = mdLite(answer); history.push({ role: 'assistant', content: answer }); save(history); }
    if (failed) {
      reply.classList.add('error');
      reply.innerHTML = `<p>${ERRORS[failed]}</p><button type="button" class="retry">Try again</button>`;
      history.pop(); save(history); // forget the unanswered question so it can be re-asked cleanly
    } else if (!answer) {
      // Stopped before any text arrived: take the question back so it can be edited and re-sent.
      reply.remove();
      log.querySelector('.msg.you:last-of-type')?.remove();
      history.pop(); save(history);
      input.value = text; autosize(); input.focus();
    }
    setBusy(false);
    scroll();
  }

  /* ---------- events ---------- */
  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }
  input.addEventListener('input', () => {
    autosize();
    if (!controller) send.disabled = !input.value.trim();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (controller) { controller.abort(); return; } // the button is "Stop" while answering
    ask(input.value);
  });
  chips.addEventListener('click', (e) => { const b = e.target.closest('.chip-q'); if (b) ask(b.textContent); });
  log.addEventListener('click', (e) => {
    if (!e.target.closest('.retry')) return;
    e.target.closest('.msg').remove();
    log.querySelector('.msg.you:last-of-type')?.remove();
    ask(lastQuestion);
  });
  panel.querySelector('.chat-new').addEventListener('click', () => {
    controller?.abort(); controller = null; epoch++;
    history = []; save(history); setBusy(false); renderAll(); input.focus();
  });

  const open = (state) => {
    panel.classList.toggle('open', state);
    panel.setAttribute('aria-hidden', String(!state));
    fab.setAttribute('aria-expanded', String(state));
    if (state) { renderContext(); input.focus(); scroll(); }
  };
  const close = () => {
    const restoreFocus = panel.contains(document.activeElement);
    open(false);
    if (restoreFocus) fab.focus();
  };
  fab.addEventListener('click', () => open(!panel.classList.contains('open')));
  panel.querySelector('.chat-close').addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open') && !document.querySelector('dialog[open]')) close(); });
  addEventListener('chemlab:open-chat', () => open(true));
  addEventListener('chemlab:context', renderContext);
  addEventListener('hashchange', renderContext);

  renderAll();
}
