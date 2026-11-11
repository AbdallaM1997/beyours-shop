-- BeYours initial schema. Prices are integers in piasters (EGP x 100).

create type public.user_role as enum ('customer', 'owner', 'fulfilment', 'designer');
create type public.order_status as enum ('new', 'design_check', 'printing', 'ready', 'shipped', 'delivered', 'cancelled', 'returned');
create type public.payment_method as enum ('cod', 'card', 'wallet');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.design_status as enum ('draft', 'design_check', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  category text not null check (category in ('boys', 'girls', 'baby', 'unisex')),
  base_price integer not null check (base_price >= 0),
  is_customizable boolean not null default true,
  is_active boolean not null default true,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products on delete cascade,
  age_size text not null check (age_size in ('2-3', '4-5', '6-7', '8-9', '10-11', '12-14')),
  color text not null,
  stock integer not null default 0 check (stock >= 0),
  sku text unique not null
);

create table public.shipping_zones (
  id serial primary key,
  governorate_en text unique not null,
  governorate_ar text not null,
  fee integer not null check (fee >= 0),
  days text not null default '2-4'
);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete set null,
  visitor_id text,
  canvas_json jsonb not null,
  prompt text,
  preview_url text,
  print_file_url text,
  status public.design_status not null default 'draft',
  review_note text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity (start with 1001) unique,
  customer_id uuid references auth.users on delete set null,
  status public.order_status not null default 'new',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  paymob_order_id text,
  subtotal integer not null,
  shipping_fee integer not null,
  total integer not null,
  customer_name text not null,
  phone text not null,
  address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  variant_id uuid not null references public.product_variants,
  qty integer not null check (qty > 0),
  unit_price integer not null,
  custom_print_price integer not null default 0,
  design_id uuid references public.designs
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  visitor_id text,
  prompt text not null,
  model text not null,
  cost_usd numeric(8, 4) not null default 0,
  result_url text,
  blocked boolean not null default false,
  created_at timestamptz not null default now()
);
create index generations_daily_idx on public.generations (coalesce(user_id::text, visitor_id), created_at);

-- Helper: is the current user staff?
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role <> 'customer');
$$;

-- Row-level security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.designs enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.generations enable row level security;

create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (role = (select role from public.profiles where id = auth.uid()));

create policy "public reads active products" on public.products for select using (is_active or public.is_staff());
create policy "staff manage products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "public reads variants" on public.product_variants for select using (true);
create policy "staff manage variants" on public.product_variants for all using (public.is_staff()) with check (public.is_staff());
create policy "public reads zones" on public.shipping_zones for select using (true);
create policy "staff manage zones" on public.shipping_zones for all using (public.is_staff()) with check (public.is_staff());

create policy "own designs" on public.designs for select using (owner_id = auth.uid() or public.is_staff());
create policy "create own designs" on public.designs for insert with check (owner_id = auth.uid());
create policy "staff review designs" on public.designs for update using (public.is_staff());

-- Orders are created by the server (service role) after recalculating prices; customers can only read theirs.
create policy "own orders" on public.orders for select using (customer_id = auth.uid() or public.is_staff());
create policy "staff update orders" on public.orders for update using (public.is_staff());
create policy "own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_staff()))
);
create policy "staff read generations" on public.generations for select using (public.is_staff());

-- New users get a customer profile
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone) values (new.id, new.phone);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Private storage buckets
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('uploads', 'uploads', false),
  ('print-files', 'print-files', false)
on conflict (id) do nothing;
