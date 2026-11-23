
create function public.sumba_admin_accounts_page(term text, account_type text, ordering text, page_number integer)
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare answer jsonb;
begin
 if not public.sumba_is_admin() or not public.sumba_account_allowed() then
  raise exception 'Acesso reservado à administração.' using errcode='42501';
 end if;
 with matched as materialized (
  select u.id, p.display_name as name, u.email, coalesce(nullif(p.contact_phone,''),u.phone) as phone,
    coalesce(p.role,'unassigned') as role, p.city, p.province,
    u.created_at as "createdAt", u.last_sign_in_at as "lastSignIn",
    case when s.state='blocked' or (s.state='suspended' and (s.until_at is null or s.until_at>now())) then s.state else 'active' end as state,
    lower(coalesce(nullif(p.display_name,''),u.email,u.phone,'')) as sort_name
  from auth.users u left join public.zunga_profiles p on p.user_id=u.id
  left join sumba_private.user_status s on s.user_id=u.id
  where (account_type='all' or coalesce(p.role,'unassigned')=account_type)
    and strpos(lower(concat_ws(' ',p.display_name,u.email,u.phone,p.contact_phone,p.city,p.province)),lower(btrim(coalesce(term,''))))>0
 ), page as (
  select * from matched order by
   case when ordering='name' then sort_name end,
   case when ordering='reverse' then sort_name end desc,
   case when ordering='oldest' then "createdAt" end,
   case when ordering not in ('name','reverse','oldest') then "createdAt" end desc,
   id
  offset (greatest(coalesce(page_number,1),1)::bigint-1)*100 limit 100
 )
 select jsonb_build_object('total',(select count(*) from matched),'users',
   coalesce((select jsonb_agg(to_jsonb(page)-'sort_name' order by
     case when ordering='name' then sort_name end,
     case when ordering='reverse' then sort_name end desc,
     case when ordering='oldest' then "createdAt" end,
     case when ordering not in ('name','reverse','oldest') then "createdAt" end desc,id) from page),'[]'::jsonb)) into answer;
 return answer;
end
$$;

create function public.sumba_admin_activity_page(target uuid, page_number integer)
returns table(event_type text,occurred_at timestamptz)
language plpgsql stable security definer set search_path=''
as $$
begin
 if not public.sumba_is_admin() or not public.sumba_account_allowed() then
  raise exception 'Acesso reservado à administração.' using errcode='42501';
 end if;
 return query select a.event_type,a.created_at from public.sumba_user_activity a
 where a.user_id=target order by a.created_at desc
 offset (greatest(coalesce(page_number,1),1)::bigint-1)*40 limit 41;
end
$$;
revoke all on function public.sumba_admin_accounts_page(text,text,text,integer),public.sumba_admin_activity_page(uuid,integer) from public,anon;
grant execute on function public.sumba_admin_accounts_page(text,text,text,integer),public.sumba_admin_activity_page(uuid,integer) to authenticated;
