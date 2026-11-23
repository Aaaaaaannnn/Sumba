-- SUMBA V0.12 — run ONLY on a dedicated SUMBA project.
-- Initial schema, not a migration applied to an existing project.
begin;
create table public.zunga_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer','producer','company','courier','admin')),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  province text not null default '' check (char_length(province)<=80),
  city text not null default '' check (char_length(city)<=80),
  bio text not null default '' check (char_length(bio)<=600),
  avatar_path text check (avatar_path is null or avatar_path = user_id::text || '/avatar'),
  terms_version text not null check (terms_version='pilot-1'),
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.zunga_stalls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.zunga_profiles(user_id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  province text not null check (char_length(btrim(province)) between 2 and 80),
  city text not null check (char_length(btrim(city)) between 2 and 80),
  description text not null default '' check (char_length(description)<=1000),
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.zunga_companies (
  owner_id uuid primary key references public.zunga_profiles(user_id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  sector text not null default '' check (char_length(sector)<=100),
  province text not null default '' check (char_length(province)<=80),
  city text not null default '' check (char_length(city)<=80),
  created_at timestamptz not null default now()
);
alter table public.zunga_profiles enable row level security;
alter table public.zunga_stalls enable row level security;
alter table public.zunga_companies enable row level security;
revoke all on public.zunga_profiles,public.zunga_stalls,public.zunga_companies from public,anon,authenticated;
grant select on public.zunga_profiles to authenticated;
grant insert(user_id,role,display_name,province,city,bio,terms_version) on public.zunga_profiles to authenticated;
grant update(display_name,province,city,bio,avatar_path) on public.zunga_profiles to authenticated;
grant select on public.zunga_stalls to anon,authenticated;
grant insert(owner_id,name,province,city,description,published) on public.zunga_stalls to authenticated;
grant update(name,province,city,description,published) on public.zunga_stalls to authenticated;
grant select on public.zunga_companies to authenticated;
grant insert(owner_id,name,sector,province,city) on public.zunga_companies to authenticated;
grant update(name,sector,province,city) on public.zunga_companies to authenticated;
create policy profile_read_self on public.zunga_profiles for select to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy profile_create_self on public.zunga_profiles for insert to authenticated with check ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and role in ('buyer','producer','company') and terms_version='pilot-1');
create policy profile_edit_self on public.zunga_profiles for update to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)) with check ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy stall_public_read on public.zunga_stalls for select to anon,authenticated using (published);
create policy stall_owner_read on public.zunga_stalls for select to authenticated using ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy stall_create_owner on public.zunga_stalls for insert to authenticated with check ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='producer'));
create policy stall_edit_owner on public.zunga_stalls for update to authenticated using ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='producer')) with check ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='producer'));
create policy company_read_owner on public.zunga_companies for select to authenticated using ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy company_create_owner on public.zunga_companies for insert to authenticated with check ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='company'));
create policy company_edit_owner on public.zunga_companies for update to authenticated using ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='company')) with check ((select auth.uid())=owner_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='company'));
-- Private avatars only, no listing or editing another account's files.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('zunga-avatars','zunga-avatars',false,2097152,array['image/jpeg','image/png','image/webp']);
create policy zunga_avatar_read on storage.objects for select to authenticated using (bucket_id='zunga-avatars' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and name=(select auth.uid())::text || '/avatar');
create policy zunga_avatar_create on storage.objects for insert to authenticated with check (bucket_id='zunga-avatars' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and name=(select auth.uid())::text || '/avatar');
create policy zunga_avatar_update on storage.objects for update to authenticated using (bucket_id='zunga-avatars' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and name=(select auth.uid())::text || '/avatar') with check (bucket_id='zunga-avatars' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and name=(select auth.uid())::text || '/avatar');
create policy zunga_avatar_remove on storage.objects for delete to authenticated using (bucket_id='zunga-avatars' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false) and name=(select auth.uid())::text || '/avatar');
commit;

alter table public.zunga_profiles add column if not exists contact_phone text check (length(contact_phone) <= 32);
grant update(contact_phone) on public.zunga_profiles to authenticated;
update storage.buckets set file_size_limit=2097152 where id='zunga-avatars';
