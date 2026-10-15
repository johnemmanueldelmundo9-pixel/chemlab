// Optional accounts. Everything here is a no-op until Supabase is configured.
// Progress stays in localStorage; when signed in it is also synced to the `progress` table.
import { getClient, isConfigured } from './supabase.js';
import { getAll, setAll, resetProgress } from './progress.js';

export { isConfigured };

let user = null;
const listeners = new Set();

export const getUser = () => user;
export function onAuthChange(fn) { listeners.add(fn); fn(user); return () => listeners.delete(fn); }
const emit = () => listeners.forEach((fn) => fn(user));

/* ---------- friendly errors ---------- */
function friendly(err) {
  const m = String(err?.message || '').toLowerCase();
  if (m.includes('invalid login')) return 'Wrong email or password.';
  if (m.includes('not confirmed')) return 'Please confirm your email first. Check your inbox.';
  if (m.includes('already registered')) return 'That email already has an account. Try signing in.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Wait a minute and try again.';
  if (m.includes('password')) return 'Choose a stronger password (at least 8 characters).';
  if (m.includes('fetch') || m.includes('network')) return 'Could not reach the server. Check your connection.';
  return 'Something went wrong. Please try again.';
}
async function client() {
  const sb = await getClient();
  if (!sb) throw new Error('Accounts are not available right now.');
  return sb;
}

/* ---------- session ---------- */
export async function initAuth() {
  const sb = await getClient();
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  await setUser(data.session?.user ?? null);
  // Don't call Supabase inside this callback (can deadlock); defer instead.
  sb.auth.onAuthStateChange((_event, session) => {
    const next = session?.user ?? null;
    if ((next?.id ?? null) !== (user?.id ?? null)) setTimeout(() => setUser(next), 0);
  });
}

async function setUser(next) {
  user = next;
  emit();
  if (user) await syncDown();
}

export async function signUp(email, password) {
  try {
    const sb = await client();
    const { data, error } = await sb.auth.signUp({
      email, password, options: { emailRedirectTo: location.origin + location.pathname },
    });
    if (error) throw error;
    return { needsConfirm: !data.session };
  } catch (err) { throw new Error(friendly(err)); }
}

export async function signIn(email, password) {
  try {
    const sb = await client();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  } catch (err) { throw new Error(friendly(err)); }
}

export async function signOut() {
  const sb = await getClient();
  if (sb) await sb.auth.signOut();
  // Clear this device so the next person to sign in here doesn't inherit these results.
  resetProgress();
  user = null;
  emit();
  dispatchEvent(new CustomEvent('chemlab:progress-synced'));
}

/* ---------- progress sync ---------- */
export function mergeProgress(a, b) {
  const out = {};
  for (const src of [a, b]) {
    for (const [mod, items] of Object.entries(src || {})) {
      out[mod] = [...new Set([...(out[mod] || []), ...(Array.isArray(items) ? items : [])])];
    }
  }
  return out;
}

async function syncDown() {
  const sb = await getClient();
  if (!sb || !user) return;
  const { data, error } = await sb.from('progress').select('module_id, items');
  if (error) return;
  const remote = {};
  for (const row of data || []) remote[row.module_id] = row.items || [];
  setAll(mergeProgress(getAll(), remote));
  await push();
}

async function push() {
  const sb = await getClient();
  if (!sb || !user) return;
  const rows = Object.entries(getAll())
    .filter(([, items]) => items.length)
    .map(([module_id, items]) => ({ user_id: user.id, module_id, items, updated_at: new Date().toISOString() }));
  if (rows.length) await sb.from('progress').upsert(rows, { onConflict: 'user_id,module_id' });
}

let timer = null;
addEventListener('chemlab:progress', () => {
  if (!user) return;
  clearTimeout(timer);
  timer = setTimeout(push, 800);
});

export async function clearRemoteProgress() {
  const sb = await getClient();
  if (sb && user) await sb.from('progress').delete().eq('user_id', user.id);
}
