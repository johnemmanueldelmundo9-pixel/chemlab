// Supabase Edge Function: delete-account
// Deletes the signed-in user, but ONLY if they just proved they own the email by clicking the
// confirmation link we emailed them (a recent email-link ("otp") sign-in). Progress rows are
// removed automatically (progress.user_id references auth.users on delete cascade).
// The service-role key is provided by Supabase to the function; it never touches the website code.
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Please sign in first.' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return json({ error: 'Your session expired. Please sign in again.' }, 401);

  // Require a sign-in via the emailed link within the last 15 minutes.
  let amr: Array<{ method: string; timestamp: number }> = [];
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    amr = JSON.parse(atob(part)).amr || [];
  } catch { /* fall through: treated as not confirmed */ }
  const now = Date.now() / 1000;
  const confirmed = amr.some((a) => ['otp', 'magiclink'].includes(a.method) && now - a.timestamp < 900);
  if (!confirmed) return json({ error: 'Please use the confirmation link from your email first.' }, 403);

  const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
  if (delErr) return json({ error: 'Could not delete the account. Please try again.' }, 500);
  return json({ ok: true });
});
