-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- One row per user per module. Row Level Security means a user can only touch their own rows.
create table if not exists public.progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  module_id  text not null check (char_length(module_id) <= 60),
  items      text[] not null default '{}' check (cardinality(items) <= 200),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.progress enable row level security;

create policy "read own progress"   on public.progress for select using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.progress for insert with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.progress for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own progress" on public.progress for delete using ((select auth.uid()) = user_id);
