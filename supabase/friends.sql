-- Harlo: friends and a friends-only weekly XP leaderboard.
-- Everything goes through the hs_* functions below (security definer); the tables have row-level security on
-- with no direct policies, so nobody can read another person's row except through these functions.
create table if not exists public.friend_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 24),
  code text not null unique default substr(md5(random()::text || clock_timestamp()::text), 1, 8),
  created_at timestamptz not null default now()
);
create table if not exists public.friendships (
  a uuid not null references auth.users (id) on delete cascade,
  b uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a <> b)
);
create index if not exists friendships_b on public.friendships (b);
create table if not exists public.weekly_xp (
  user_id uuid not null references auth.users (id) on delete cascade,
  week text not null check (week ~ '^\d{4}-W\d{2}$'),
  xp integer not null default 0 check (xp between 0 and 100000),
  updated_at timestamptz not null default now(),
  primary key (user_id, week)
);
alter table public.friend_profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.weekly_xp enable row level security;
revoke all on public.friend_profiles, public.friendships, public.weekly_xp from anon, authenticated;
grant all on public.friend_profiles, public.friendships, public.weekly_xp to service_role;

-- My name and invite code (null if not set up yet)
create or replace function public.hs_me()
returns table (name text, code text, friends integer)
language sql security definer set search_path = '' stable as $$
  select p.name, p.code, (select count(*)::int from public.friendships f where f.a = auth.uid())
  from public.friend_profiles p where p.user_id = auth.uid();
$$;

-- Set or change my display name (creates my invite code the first time)
create or replace function public.hs_set_name(n text)
returns text language plpgsql security definer set search_path = '' as $$
declare c text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  n := btrim(regexp_replace(coalesce(n, ''), '[[:cntrl:]<>]', '', 'g'));
  if char_length(n) < 1 or char_length(n) > 24 then raise exception 'bad name'; end if;
  insert into public.friend_profiles (user_id, name) values (auth.uid(), n)
    on conflict (user_id) do update set name = excluded.name
    returning code into c;
  return c;
end $$;

-- Accept an invite code: we become friends both ways. Returns the friend's name.
create or replace function public.hs_accept(c text)
returns text language plpgsql security definer set search_path = '' as $$
declare fid uuid; fname text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select user_id, name into fid, fname from public.friend_profiles where code = lower(btrim(c));
  if fid is null then raise exception 'no such code'; end if;
  if fid = auth.uid() then raise exception 'own code'; end if;
  if (select count(*) from public.friendships where a = auth.uid()) >= 50 then raise exception 'too many friends'; end if;
  insert into public.friendships (a, b) values (auth.uid(), fid), (fid, auth.uid()) on conflict do nothing;
  return fname;
end $$;

create or replace function public.hs_remove_friend(fid uuid)
returns void language sql security definer set search_path = '' as $$
  delete from public.friendships where (a = auth.uid() and b = fid) or (a = fid and b = auth.uid());
$$;

-- My XP for a week (the app sends its own total for the week)
create or replace function public.hs_push_xp(wk text, n integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return; end if;
  if wk !~ '^\d{4}-W\d{2}$' then raise exception 'bad week'; end if;
  insert into public.weekly_xp (user_id, week, xp) values (auth.uid(), wk, greatest(0, least(n, 100000)))
    on conflict (user_id, week) do update set xp = excluded.xp, updated_at = now();
end $$;

-- The leaderboard: me and my friends, for one week
create or replace function public.hs_board(wk text)
returns table (id uuid, name text, xp integer, me boolean)
language sql security definer set search_path = '' stable as $$
  with people as (
    select auth.uid() as uid union select f.b from public.friendships f where f.a = auth.uid()
  )
  select p.uid, coalesce(fp.name, '?'), coalesce(w.xp, 0), p.uid = auth.uid()
  from people p
  left join public.friend_profiles fp on fp.user_id = p.uid
  left join public.weekly_xp w on w.user_id = p.uid and w.week = wk
  where auth.uid() is not null
  order by 3 desc, 2;
$$;

revoke execute on function public.hs_me(), public.hs_set_name(text), public.hs_accept(text), public.hs_remove_friend(uuid), public.hs_push_xp(text, integer), public.hs_board(text) from public, anon;
grant execute on function public.hs_me(), public.hs_set_name(text), public.hs_accept(text), public.hs_remove_friend(uuid), public.hs_push_xp(text, integer), public.hs_board(text) to authenticated;
