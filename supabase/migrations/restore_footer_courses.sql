-- Restore footer-linked courses that exist in seed but were missing from admin.
-- Safe to re-run: inserts only when slug is absent. Does not overwrite owner edits.
-- Owner should review coming_soon / fees / PDFs in Admin → Courses after apply.

insert into public.courses (
  slug, title, title_hi, category, price, duration, language,
  description, syllabus, preview_video, image, published, coming_soon
)
select * from (values
  (
    'kids-wear-course',
    'Kids Wear Course',
    'किड्स वियर कोर्स',
    'Stitching',
    12000::numeric,
    '6 months',
    'Hindi',
    'Learn to stitch adorable, comfortable kids'' outfits — frocks, ethnic sets, western wear, and seasonal styles with safe finishing for children.',
    '["Kids measurement & sizing basics","Frocks, frock suits & ethnic sets","Kids kurti, salwar & ethnic wear","Western tops, shorts & casual wear","Fabric selection, comfort & finishing"]'::jsonb,
    '',
    '/slider1.webp',
    true,
    true
  ),
  (
    'fashion-designing-course',
    'Fashion Designing Course',
    'फैशन डिज़ाइनिंग कोर्स',
    'Fashion Design',
    55000::numeric,
    '1.5 years',
    'Hindi & English',
    'Our flagship fashion design programme — sketching, draping, pattern making, garment construction, embroidery, and portfolio building for a career in fashion.',
    '["Fashion illustration & design fundamentals","Fabric science, draping & pattern making","Ethnic, western & fusion garment construction","Embroidery, surface ornamentation & detailing","Portfolio, boutique internship & career guidance"]'::jsonb,
    '',
    '/boutique.webp',
    true,
    true
  )
) as v(slug, title, title_hi, category, price, duration, language, description, syllabus, preview_video, image, published, coming_soon)
where not exists (
  select 1 from public.courses c where c.slug = v.slug
);
