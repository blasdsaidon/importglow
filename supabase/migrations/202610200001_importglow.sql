create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('Vapers', 'Perfumes')),
  eyebrow text not null default '',
  description text not null default '',
  badge text,
  art text not null default 'vape-blue',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id text not null,
  product_id text not null references public.products(id) on delete cascade,
  label text not null,
  price integer not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  primary key (product_id, id)
);

create table if not exists public.product_images (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  object_key text not null,
  alt text not null default '',
  sort_order integer not null default 0
);

create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
create index if not exists product_images_product_id_idx on public.product_images(product_id);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The application server uses the service-role key. No browser has direct
-- write access to these tables or to the storage bucket.
