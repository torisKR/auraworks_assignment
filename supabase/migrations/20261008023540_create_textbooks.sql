create table public.textbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 200),
  category text not null check (category in ('single', 'pass')),
  subject text not null,
  description text not null,
  image_path text not null check (image_path in (
    '/images/textbook-single.png', '/images/textbook-pass.png'
  )),
  price integer not null check (price >= 0),
  original_price integer check (original_price >= price),
  discount_percent integer not null default 0 check (discount_percent between 0 and 100),
  display_order integer not null unique check (display_order > 0)
);

alter table public.textbooks enable row level security;

-- The browser may read the public catalog, but cannot mutate it.
revoke all on public.textbooks from anon, authenticated;
grant select on public.textbooks to anon, authenticated;

create policy "Anyone can read the textbook catalog"
  on public.textbooks
  for select
  to anon, authenticated
  using (true);
