create table public.sumba_support_threads (
 account_id uuid primary key references auth.users(id) on delete cascade,
 assigned_to uuid references auth.users(id) on delete set null,
 updated_at timestamptz not null default now()
);
create index sumba_support_recent on public.sumba_support_threads(updated_at desc, account_id);
create table public.sumba_support_messages (
 id bigint generated always as identity primary key,
 account_id uuid not null references public.sumba_support_threads(account_id) on delete cascade,
 author_id uuid references auth.users(id) on delete set null,
 from_support boolean not null,
 body text not null check (length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default now()
);
create index sumba_support_history on public.sumba_support_messages(account_id, id desc);
alter table public.sumba_support_threads enable row level security;
alter table public.sumba_support_messages enable row level security;
revoke all on public.sumba_support_threads, public.sumba_support_messages from anon, authenticated;
grant select on public.sumba_support_threads, public.sumba_support_messages to authenticated;
create policy support_threads_read on public.sumba_support_threads for select to authenticated
 using ((select public.sumba_account_allowed()) and (account_id=(select auth.uid()) or (select public.sumba_is_admin())));
create policy support_messages_read on public.sumba_support_messages for select to authenticated
 using ((select public.sumba_account_allowed()) and (account_id=(select auth.uid()) or (select public.sumba_is_admin())));

create function public.sumba_support_inbox()
returns table(account_id uuid, assigned_to uuid, updated_at timestamptz, account_name text, last_message text)
language sql stable security definer set search_path=''
as $$
 select t.account_id,t.assigned_to,t.updated_at,
 coalesce(nullif(p.display_name,''),u.email,u.phone,'Conta sem nome'),
 left((select m.body from public.sumba_support_messages m where m.account_id=t.account_id order by m.id desc limit 1),100)
 from public.sumba_support_threads t join auth.users u on u.id=t.account_id
 left join public.zunga_profiles p on p.user_id=t.account_id
 where public.sumba_is_admin() and public.sumba_account_allowed()
 order by t.updated_at desc,t.account_id
$$;

create function public.sumba_support_claim(target uuid)
returns void language plpgsql security definer set search_path=''
as $$
begin
 if target is null or not public.sumba_is_admin() or not public.sumba_account_allowed() then
  raise exception 'Acesso reservado à administração.' using errcode='42501';
 end if;
 insert into public.sumba_support_threads as t(account_id,assigned_to) values(target,auth.uid())
 on conflict(account_id) do update set assigned_to=auth.uid()
 where t.assigned_to is null or t.assigned_to=auth.uid();
 if not found then raise exception 'Outro operador já assumiu esta conversa.'; end if;
end
$$;

create function public.sumba_support_send(target uuid, message text)
returns void language plpgsql security definer set search_path=''
as $$
declare actor uuid:=auth.uid(); operator boolean:=target is distinct from actor;
begin
 if actor is null or target is null or not public.sumba_account_allowed() or not exists (
  select 1 from auth.users u where u.id=actor and (u.email_confirmed_at is not null or u.phone_confirmed_at is not null)
 ) then raise exception 'Sessão sem acesso ao atendimento.' using errcode='42501'; end if;
 if operator then
  if not public.sumba_is_admin() then raise exception 'Acesso reservado à administração.' using errcode='42501'; end if;
  update public.sumba_support_threads set updated_at=clock_timestamp() where account_id=target and assigned_to=actor;
  if not found then raise exception 'Assume a conversa antes de responder.'; end if;
 else
  insert into public.sumba_support_threads(account_id) values(actor)
  on conflict(account_id) do update set updated_at=clock_timestamp();
 end if;
 insert into public.sumba_support_messages(account_id,author_id,from_support,body) values(target,actor,operator,btrim(message));
end
$$;
revoke all on function public.sumba_support_inbox(), public.sumba_support_claim(uuid), public.sumba_support_send(uuid,text) from public, anon;
grant execute on function public.sumba_support_inbox(), public.sumba_support_claim(uuid), public.sumba_support_send(uuid,text) to authenticated;
