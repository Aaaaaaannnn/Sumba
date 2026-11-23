-- Applied to Supabase project asxyjhaujsowmdrpkcqc on 2026-11-23.
-- Per-user, per-role first-login guide completion. RLS prevents cross-user reads/writes.
create table if not exists public.sumba_tutorial_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check(role in ('buyer','producer','company','courier','admin')),
 completed_at timestamptz not null default now(),
 primary key (user_id,role)
);
alter table public.sumba_tutorial_progress enable row level security;
revoke all on public.sumba_tutorial_progress from public, anon;
grant select,insert,update on public.sumba_tutorial_progress to authenticated;
create policy sumba_tutorial_select_own on public.sumba_tutorial_progress for select to authenticated using (user_id=(select auth.uid()));
create policy sumba_tutorial_insert_own on public.sumba_tutorial_progress for insert to authenticated with check (user_id=(select auth.uid()));
create policy sumba_tutorial_update_own on public.sumba_tutorial_progress for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
