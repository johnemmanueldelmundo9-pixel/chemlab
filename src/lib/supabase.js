// Lazy Supabase client. The library loads from a CDN only when accounts are configured,
// so the site keeps working (no build step, no npm) with or without Supabase.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

export function isConfigured() {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;
}

let clientPromise = null;
export function getClient() {
  if (!isConfigured()) return Promise.resolve(null);
  clientPromise ??= import(LIB)
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }))
    .catch(() => null);
  return clientPromise;
}
