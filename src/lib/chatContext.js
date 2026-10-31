// Tells ChemBot which page the student is on, so answers match the module and topic.
// Module pages can call setTopic('Boyle\'s law') for finer detail; it resets when the page changes.
import { MODULES } from '../data/modules.js';

let topic = '';
const announce = () => dispatchEvent(new CustomEvent('chemlab:context'));

export function setTopic(text) {
  topic = String(text || '').slice(0, 80);
  announce();
}
addEventListener('hashchange', () => { topic = ''; announce(); });

export function getContext() {
  const [head, arg] = location.hash.replace(/^#\/?/, '').split('/');
  let module = 'home';
  if (head === 'module' && MODULES.some((m) => m.id === arg)) module = arg;
  else if (head === 'periodic-table') module = 'periodic-table';
  return { module, topic };
}

export function describeContext(ctx = getContext()) {
  const m = MODULES.find((x) => x.id === ctx.module);
  if (m) return `Module ${m.num} · ${m.title}`;
  return ctx.module === 'periodic-table' ? 'Periodic table' : 'ChemLab home';
}

export function starterQuestions(ctx = getContext()) {
  const m = MODULES.find((x) => x.id === ctx.module);
  if (m) return m.topics.slice(0, 3).map((t) => `Explain ${t} simply`);
  if (ctx.module === 'periodic-table') return ['What are oxidation states?', 'How do I read an electron configuration?', 'What are periodic trends?'];
  return ['What is the mole?', 'How do I balance a chemical equation?', 'Atom vs molecule: what is the difference?'];
}
