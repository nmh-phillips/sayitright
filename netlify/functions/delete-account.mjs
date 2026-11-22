// Netlify Function: POST /.netlify/functions/delete-account  (Authorization: Bearer <the user's access token>)
// Deletes the signed-in person's account. Their saved progress is removed with it (the progress table cascades).
// Needs SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY) and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY, marked secret).
const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const pub = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !pub || !secret) return json({ error: 'Accounts not configured' }, 503);
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Not signed in' }, 401);

  // Who is asking? Supabase checks the token and tells us the user.
  const who = await fetch(`${base}/auth/v1/user`, { headers: { apikey: pub, Authorization: `Bearer ${token}` } });
  if (!who.ok) return json({ error: 'Not signed in' }, 401);
  const user = await who.json();
  if (!user || !user.id) return json({ error: 'Not signed in' }, 401);

  const del = await fetch(`${base}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
    method: 'DELETE', headers: { apikey: secret, Authorization: `Bearer ${secret}` }
  });
  if (!del.ok) return json({ error: `Delete failed (${del.status})` }, 502);
  return json({ ok: true });
};
