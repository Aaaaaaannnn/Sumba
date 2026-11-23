-- SUMBA: funcionalidades comerciais persistentes de contas autenticadas.
-- Exclusivo ao projeto Supabase ligado à autenticação; NÃO cria pagamentos ou vendas.
-- As tabelas de demonstração / localStorage não são migradas nem modificadas.
create table if not exists public.sumba_products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
  stall_id uuid not null references public.zunga_stalls(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  category text not null default 'Outros' check (char_length(category) between 2 and 60),
  description text not null default '' check (char_length(description) <= 1000),
  unit text not null default 'kg' check (unit in ('kg','unidade','caixa','saco','litro','molho')),
  price_kz numeric(14,2) not null check (price_kz > 0 and price_kz <= 999999999999.99),
  available_qty numeric(12,2) not null default 0 check (available_qty >= 0),
  min_qty numeric(12,2) not null default 1 check (min_qty > 0),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sumba_products_stall_pub_idx on public.sumba_products(stall_id,published);
create index if not exists sumba_products_owner_idx on public.sumba_products(owner_id);
alter table public.sumba_products enable row level security;
drop policy if exists sumba_products_read on public.sumba_products;
create policy sumba_products_read on public.sumba_products for select to authenticated
using (
 owner_id=(select auth.uid())
 or (published and exists (
   select 1 from public.zunga_stalls s
   where s.id=stall_id and s.published=true
 ))
);
drop policy if exists sumba_products_insert on public.sumba_products;
create policy sumba_products_insert on public.sumba_products for insert to authenticated
with check (
 owner_id=(select auth.uid())
 and exists (select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role='producer')
 and exists (select 1 from public.zunga_stalls s where s.id=stall_id and s.owner_id=(select auth.uid()))
);
drop policy if exists sumba_products_modify on public.sumba_products;
create policy sumba_products_modify on public.sumba_products for update to authenticated
using (owner_id=(select auth.uid()))
with check (
 owner_id=(select auth.uid())
 and exists (select 1 from public.zunga_stalls s where s.id=stall_id and s.owner_id=(select auth.uid()))
);
drop policy if exists sumba_products_delete on public.sumba_products;
create policy sumba_products_delete on public.sumba_products for delete to authenticated
using (owner_id=(select auth.uid()));

create table if not exists public.sumba_cart_items (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 product_id uuid not null references public.sumba_products(id) on delete cascade,
 quantity numeric(12,2) not null check (quantity > 0 and quantity <= 1000000),
 updated_at timestamptz not null default now(),
 unique(user_id, product_id)
);
create index if not exists sumba_cart_user_idx on public.sumba_cart_items(user_id);
alter table public.sumba_cart_items enable row level security;
drop policy if exists sumba_cart_read on public.sumba_cart_items;
create policy sumba_cart_read on public.sumba_cart_items for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists sumba_cart_add on public.sumba_cart_items;
create policy sumba_cart_add on public.sumba_cart_items for insert to authenticated
with check (
 user_id=(select auth.uid())
 and exists (select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role in ('buyer','company'))
 and exists (select 1 from public.sumba_products x join public.zunga_stalls s on x.stall_id=s.id
  where x.id=product_id and x.published and x.available_qty>0 and s.published)
);
drop policy if exists sumba_cart_edit on public.sumba_cart_items;
create policy sumba_cart_edit on public.sumba_cart_items for update to authenticated
using (user_id=(select auth.uid()))
with check (
 user_id=(select auth.uid())
 and exists (select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role in ('buyer','company'))
);
drop policy if exists sumba_cart_remove on public.sumba_cart_items;
create policy sumba_cart_remove on public.sumba_cart_items for delete to authenticated
using (user_id=(select auth.uid()));

-- Pedidos ao fornecedor (contacto real entre contas, não autorização de compra).
create table if not exists public.sumba_inquiries (
 id uuid primary key default gen_random_uuid(),
 buyer_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 seller_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 product_id uuid not null references public.sumba_products(id) on delete cascade,
 quantity numeric(12,2) not null check (quantity > 0 and quantity <= 1000000),
 note text not null check (char_length(btrim(note)) between 2 and 1000),
 status text not null default 'open' check (status in ('open','answered','declined')),
 response text not null default '' check (char_length(response) <= 2000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (buyer_id<>seller_id)
);
create index if not exists sumba_inquiries_buyer_idx on public.sumba_inquiries(buyer_id,created_at desc);
create index if not exists sumba_inquiries_seller_idx on public.sumba_inquiries(seller_id,created_at desc);
alter table public.sumba_inquiries enable row level security;
drop policy if exists sumba_inquiries_participants on public.sumba_inquiries;
create policy sumba_inquiries_participants on public.sumba_inquiries for select to authenticated
using (buyer_id=(select auth.uid()) or seller_id=(select auth.uid()));
drop policy if exists sumba_inquiries_open on public.sumba_inquiries;
create policy sumba_inquiries_open on public.sumba_inquiries for insert to authenticated
with check (
 buyer_id=(select auth.uid()) and status='open' and response=''
 and exists(select 1 from public.zunga_profiles p where p.user_id=(select auth.uid()) and p.role in ('buyer','company'))
 and exists(
   select 1 from public.sumba_products x
   join public.zunga_stalls s on s.id=x.stall_id
   where x.id=product_id and x.owner_id=seller_id and x.published and s.published
    and x.available_qty>=quantity and x.min_qty<=quantity
 )
);
drop policy if exists sumba_inquiries_supplier_reply on public.sumba_inquiries;
create policy sumba_inquiries_supplier_reply on public.sumba_inquiries for update to authenticated
using (seller_id=(select auth.uid()))
with check (seller_id=(select auth.uid()));

-- Respostas/mensagens reais entre as duas partes de cada pedido.
create table if not exists public.sumba_inquiry_messages (
 id uuid primary key default gen_random_uuid(),
 inquiry_id uuid not null references public.sumba_inquiries(id) on delete cascade,
 sender_id uuid not null references public.zunga_profiles(user_id) on delete cascade,
 body text not null check (char_length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists sumba_inquiry_messages_thread_idx on public.sumba_inquiry_messages(inquiry_id,created_at);
alter table public.sumba_inquiry_messages enable row level security;
drop policy if exists sumba_messages_read on public.sumba_inquiry_messages;
create policy sumba_messages_read on public.sumba_inquiry_messages for select to authenticated
using (exists (
 select 1 from public.sumba_inquiries i
 where i.id=inquiry_id and (i.buyer_id=(select auth.uid()) or i.seller_id=(select auth.uid()))
));
drop policy if exists sumba_messages_send on public.sumba_inquiry_messages;
create policy sumba_messages_send on public.sumba_inquiry_messages for insert to authenticated
with check (
 sender_id=(select auth.uid())
 and exists (select 1 from public.sumba_inquiries i
  where i.id=inquiry_id and (i.buyer_id=(select auth.uid()) or i.seller_id=(select auth.uid())))
);

revoke all on public.sumba_products,public.sumba_cart_items,public.sumba_inquiries,public.sumba_inquiry_messages from anon;
grant select,insert,update,delete on public.sumba_products to authenticated;
grant select,insert,update,delete on public.sumba_cart_items to authenticated;
grant select,insert on public.sumba_inquiries to authenticated;
grant update (status,response) on public.sumba_inquiries to authenticated;
grant select,insert on public.sumba_inquiry_messages to authenticated;

comment on table public.sumba_products is 'Produtos verdadeiros publicados por bancadas autenticadas na SUMBA, sem dados demo.';
comment on table public.sumba_cart_items is 'Cestos privados e persistentes por utilizador autenticado.';
comment on table public.sumba_inquiries is 'Pedidos de informação ao fornecedor, sem pagamento ou compra.';
comment on table public.sumba_inquiry_messages is 'Mensagens persistentes entre comprador e fornecedor.';
