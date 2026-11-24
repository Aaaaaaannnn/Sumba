create function public.sumba_chat_profile(conversation_type text, reference_id uuid)
returns jsonb
language plpgsql stable security definer set search_path=''
as $$
declare
 actor uuid := auth.uid();
 administrator boolean := public.sumba_is_admin();
 inquiry public.sumba_inquiries%rowtype;
 target uuid;
 result jsonb;
begin
 if actor is null or not public.sumba_account_allowed() then
  raise exception 'Perfil indisponível.' using errcode='42501';
 end if;
 if conversation_type='support' then
  if not administrator then
   if reference_id=actor then return jsonb_build_object('name','Apoio SUMBA','kind','support'); end if;
   raise exception 'Perfil indisponível.' using errcode='42501';
  end if;
  target:=reference_id;
 elsif conversation_type in ('market','market-client') then
  select * into inquiry from public.sumba_inquiries i where i.id=reference_id;
  if not found or (not administrator and actor not in (inquiry.buyer_id,inquiry.seller_id)) then
   raise exception 'Perfil indisponível.' using errcode='42501';
  end if;
  if (administrator and conversation_type='market') or (not administrator and actor=inquiry.buyer_id) then
   select jsonb_build_object('name',s.name,'kind','stall','city',s.city,'province',s.province,'description',s.description)
   into result from public.sumba_products p join public.zunga_stalls s on s.id=p.stall_id
   where p.id=inquiry.product_id and s.owner_id=inquiry.seller_id and (s.published or administrator);
   return result;
  end if;
  target:=inquiry.buyer_id;
 else
  raise exception 'Perfil indisponível.' using errcode='42501';
 end if;
 select jsonb_build_object('name',coalesce(nullif(p.display_name,''),'Conta sem nome'),'kind',p.role,
 'city',p.city,'province',p.province,'description',p.bio,
 'email',case when administrator then u.email end,
 'phone',case when administrator then coalesce(nullif(p.contact_phone,''),u.phone) end,
 'created',case when administrator then u.created_at end)
 into result from auth.users u left join public.zunga_profiles p on p.user_id=u.id where u.id=target;
 return result;
end
$$;
revoke all on function public.sumba_chat_profile(text,uuid) from public,anon;
grant execute on function public.sumba_chat_profile(text,uuid) to authenticated;
