// Netlify Function: GET /.netlify/functions/auth-config -> { url, key } for optional sign-in (Supabase).
// The publishable (anon) key is designed to be public: the database's row-level security keeps each person's data private.
// Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY) in Netlify. If they're missing, the Sign in button stays hidden.
export default async () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  const body = url && key ? { url: url.replace(/\/+$/, ''), key } : { url: null };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } });
};
