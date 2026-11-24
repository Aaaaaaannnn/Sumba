create function sumba_private.remove_registration_bi_from_identity()
returns trigger language plpgsql set search_path=''
as $$
begin
 new.identity_data:=new.identity_data-'sumba_registration_bi';
 return new;
end
$$;
revoke all on function sumba_private.remove_registration_bi_from_identity() from public,anon,authenticated;
create trigger sumba_strip_registration_bi_from_identity before insert or update of identity_data on auth.identities
 for each row when (new.identity_data ? 'sumba_registration_bi')
 execute function sumba_private.remove_registration_bi_from_identity();
grant insert(contact_phone) on public.zunga_profiles to authenticated;
