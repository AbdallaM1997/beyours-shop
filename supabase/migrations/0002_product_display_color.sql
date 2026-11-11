-- Colour used for the product thumbnail on cards (one of the variant colour names).
alter table public.products
  add column display_color text not null default 'white'
  check (display_color in ('white', 'blue', 'pink', 'yellow', 'lime', 'black'));
