-- Course + NRI copy from the 4-tab web content doc.
-- Safe to re-run. Does not change syllabus.
-- service_role was missing table privileges (PostgREST 42501), so app
-- scripts could read courses but not update them.

grant select, insert, update, delete on public.courses to service_role;
grant select, insert, update, delete on public.faqs to service_role;
grant select, insert, update on public.settings to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Titles and SEO are applied by the sync script because the long copy
-- lives in src/lib/course-landings.mjs. This file records the fee/title
-- corrections that must match the document.

update public.courses
set
  title = 'Boutique Master Basic Course in Patna',
  title_hi = 'पटना में बुटीक मास्टर बेसिक कोर्स',
  meta_title = 'Boutique Master Basic Course in Patna | Shreya Creation',
  meta_description = 'Join Shreya Creation’s Boutique Master Basic Course in Patna for ₹15,000. Learn stitching and boutique basics. Enquire today for course details and admission!',
  focus_keyword = 'boutique master basic course in patna',
  price = 15000
where slug = 'basic-boutique-course';

update public.courses
set
  title = 'Advanced Boutique Course in Patna',
  title_hi = 'पटना में एडवांस्ड बुटीक कोर्स',
  meta_title = 'Advanced Boutique Course in Patna | Shreya Creation',
  meta_description = 'Explore the Advanced Boutique Course in Patna at Shreya Creation for ₹32,000. Develop advanced stitching, professional designing, and pattern-making skills. Enquire today!',
  focus_keyword = 'advanced boutique course in patna',
  price = 32000
where slug = 'advanced-boutique-course';

update public.courses
set
  title = 'Boutique Master Commando Training in Patna',
  title_hi = 'पटना में बुटीक मास्टर कमांडो ट्रेनिंग',
  meta_title = 'Boutique Master Commando Training in Patna | Shreya Creation',
  meta_description = 'Build your fashion future with Boutique Master Commando Training in Patna at Shreya Creation. Explore 9-month professional training for ₹55,000. Enquire today!',
  focus_keyword = 'boutique master commando training in patna',
  price = 55000,
  duration = '9 months'
where slug = 'boutique-master-commando-training';
