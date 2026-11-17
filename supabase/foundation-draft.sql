-- ZUNGA V0.12 — PROPOSTA de fundação; aplicar APENAS num projeto ZUNGA confirmado.
-- Não aplicar no Lume. Não importa dados fictícios. Executar uma única vez numa base dedicada.
begin;
create table public.zunga_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(trim(display_name)) between 2 and 80),
 province text not null default '' check (char_length(province)<=60),
 city text not null default '' check (char_length(city)<=80),
 bio text not null default '' check (char_length(bio)<=300),
 terms_version text not null check (terms_version='pilot-1'),
 terms_accepted_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
-- A autorização profissional está separada do perfil editável.
create table public.zunga_roles (
 user_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 role text not null check (role in ('producer','company','courier','admin')),
 granted_at timestamptz not null default now(),
 primary key (user_id,role)
);
create table public.zunga_role_requests (
 user_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 requested_role text not null check (requested_role in ('producer','company','courier')),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(),
 primary key (user_id,requested_role)
);
create table public.zunga_stalls (
 owner_id uuid primary key references public.zunga_profiles(user_id) on delete cascade,
 name text not null check (char_length(trim(name)) between 2 and 100),
 province text not null check (char_length(province) between 1 and 60),
 city text not null check (char_length(trim(city)) between 1 and 80),
 description text not null default '' check (char_length(description)<=1000),
 created_at timestamptz not null default now()
);
create table public.zunga_companies (
 owner_id uuid primary key references public.zunga_profiles(user_id) on delete cascade,
 name text not null check (char_length(trim(name)) between 2 and 100),
 sector text not null default '' check (char_length(sector)<=100),
 province text not null check (char_length(province) between 1 and 60),
 city text not null check (char_length(trim(city)) between 1 and 80),
 created_at timestamptz not null default now()
);
alter table public.zunga_profiles enable row level security;
alter table public.zunga_roles enable row level security;
alter table public.zunga_role_requests enable row level security;
alter table public.zunga_stalls enable row level security;
alter table public.zunga_companies enable row level security;
revoke all on public.zunga_profiles,public.zunga_roles,public.zunga_role_requests,public.zunga_stalls,public.zunga_companies from public,anon,authenticated;
grant select on public.zunga_profiles,public.zunga_roles,public.zunga_role_requests,public.zunga_stalls,public.zunga_companies to authenticated;
grant insert(user_id,display_name,province,city,bio,terms_version) on public.zunga_profiles to authenticated;
grant update(display_name,province,city,bio) on public.zunga_profiles to authenticated;
grant insert(user_id,requested_role) on public.zunga_role_requests to authenticated;
grant insert(owner_id,name,province,city,description), update(name,province,city,description) on public.zunga_stalls to authenticated;
grant insert(owner_id,name,sector,province,city), update(name,sector,province,city) on public.zunga_companies to authenticated;
create policy profile_read on public.zunga_profiles for select to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy profile_insert on public.zunga_profiles for insert to authenticated with check ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy profile_update on public.zunga_profiles for update to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)) with check ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy roles_read on public.zunga_roles for select to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy requests_read on public.zunga_role_requests for select to authenticated using ((select auth.uid())=user_id and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy requests_insert on public.zunga_role_requests for insert to authenticated with check ((select auth.uid())=user_id and status='pending' and not coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false));
create policy stalls_read on public.zunga_stalls for select to authenticated using ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='producer'));
create policy stalls_insert on public.zunga_stalls for insert to authenticated with check ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='producer'));
create policy stalls_update on public.zunga_stalls for update to authenticated using ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='producer')) with check ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='producer'));
create policy companies_read on public.zunga_companies for select to authenticated using ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='company'));
create policy companies_insert on public.zunga_companies for insert to authenticated with check ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='company'));
create policy companies_update on public.zunga_companies for update to authenticated using ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='company')) with check ((select auth.uid())=owner_id and exists(select 1 from public.zunga_roles r where r.user_id=owner_id and r.role='company'));
commit;
-- Sem políticas de escrita para roles. Aprovação exclusivamente por operador autorizado no SQL Editor.
-- Antes de promover: confirmar o UUID, identidade e pedido. Exemplo (substituir UUID):
-- begin;
-- insert into public.zunga_roles(user_id,role) values ('UUID','producer');
-- update public.zunga_role_requests set status='approved' where user_id='UUID' and requested_role='producer';
-- commit;
