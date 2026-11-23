alter table public.zunga_profiles add column if not exists contact_phone text check (length(contact_phone) <= 32);
grant update(contact_phone) on public.zunga_profiles to authenticated;
update storage.buckets set file_size_limit=2097152 where id='zunga-avatars';
