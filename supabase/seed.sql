-- Sample data for local development.
insert into public.products (slug, name_ar, name_en, category, base_price) values
  ('thunder-kid-tee', 'تيشيرت ثاندر كيد', 'Thunder Kid Tee', 'boys', 45000),
  ('big-mouth-tee', 'تيشيرت بيج ماوث', 'Big Mouth Tee', 'unisex', 48000),
  ('peace-out-tee', 'تيشيرت بيس أوت', 'Peace Out Tee', 'girls', 42000),
  ('electric-blue-tee', 'تيشيرت إلكتريك بلو', 'Electric Blue Tee', 'boys', 49000);

insert into public.product_variants (product_id, age_size, color, stock, sku)
select p.id, s.size, c.color, 20, upper(p.slug) || '-' || s.size || '-' || c.color
from public.products p
cross join (values ('2-3'), ('4-5'), ('6-7'), ('8-9'), ('10-11'), ('12-14')) as s(size)
cross join (values ('white'), ('blue'), ('pink'), ('yellow')) as c(color);

-- Placeholder fees (piasters) — replace with your courier's real prices.
insert into public.shipping_zones (governorate_en, governorate_ar, fee) values
  ('Cairo', 'القاهرة', 6000), ('Giza', 'الجيزة', 6000), ('Alexandria', 'الإسكندرية', 7000),
  ('Qalyubia', 'القليوبية', 6500), ('Sharqia', 'الشرقية', 7000), ('Dakahlia', 'الدقهلية', 7000),
  ('Gharbia', 'الغربية', 7000), ('Monufia', 'المنوفية', 7000), ('Beheira', 'البحيرة', 7500),
  ('Kafr El Sheikh', 'كفر الشيخ', 7500), ('Damietta', 'دمياط', 7500), ('Port Said', 'بورسعيد', 7500),
  ('Ismailia', 'الإسماعيلية', 7500), ('Suez', 'السويس', 7500), ('Faiyum', 'الفيوم', 8000),
  ('Beni Suef', 'بني سويف', 8000), ('Minya', 'المنيا', 8500), ('Asyut', 'أسيوط', 9000),
  ('Sohag', 'سوهاج', 9000), ('Qena', 'قنا', 9500), ('Luxor', 'الأقصر', 9500), ('Aswan', 'أسوان', 10000),
  ('Red Sea', 'البحر الأحمر', 10000), ('Matrouh', 'مطروح', 10000), ('New Valley', 'الوادي الجديد', 11000),
  ('North Sinai', 'شمال سيناء', 11000), ('South Sinai', 'جنوب سيناء', 11000);
