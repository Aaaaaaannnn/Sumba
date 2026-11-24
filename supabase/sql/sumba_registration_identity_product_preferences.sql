create table sumba_private.registration_identity (
 user_id uuid primary key references auth.users(id) on delete cascade deferrable initially deferred,
 bi_number text not null check (bi_number ~ '^[0-9]{9}[A-Z]{2}[0-9]{3}$')
);
alter table sumba_private.registration_identity enable row level security;
revoke all on sumba_private.registration_identity from public,anon,authenticated;

create function sumba_private.store_registration_identity()
returns trigger language plpgsql security definer set search_path=''
as $$
declare document_number text;
begin
 if new.raw_user_meta_data ? 'sumba_registration_bi' then
  document_number:=upper(btrim(new.raw_user_meta_data->>'sumba_registration_bi'));
  new.raw_user_meta_data:=new.raw_user_meta_data-'sumba_registration_bi';
  if document_number is null or document_number !~ '^[0-9]{9}[A-Z]{2}[0-9]{3}$' then
   raise exception 'Número de BI inválido.';
  end if;
  insert into sumba_private.registration_identity(user_id,bi_number) values(new.id,document_number);
 end if;
 return new;
end
$$;
revoke all on function sumba_private.store_registration_identity() from public,anon,authenticated;
create trigger sumba_store_registration_identity before insert on auth.users
 for each row execute function sumba_private.store_registration_identity();

alter table public.zunga_profiles add column product_preferences text[];
alter table public.zunga_profiles add constraint sumba_product_preferences_valid check (
 cardinality(product_preferences)<=7 and array_position(product_preferences,null) is null
 and product_preferences <@ array['Cesta Básica','Cereais','Tubérculos','Hortícolas','Frutas','Leguminosas','Outros']::text[]
);
grant update(product_preferences) on public.zunga_profiles to authenticated;
