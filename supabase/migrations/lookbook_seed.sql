-- Blog/lookbook bilingual fields + seed posts when table is empty.
-- Run in Supabase SQL Editor if Blog page still shows no posts.

alter table public.lookbook_posts
  add column if not exists title_hi text,
  add column if not exists excerpt_hi text;

insert into public.lookbook_posts (title, title_hi, slug, excerpt, excerpt_hi, image, published, created_at)
select * from (values
  (
    'Bridal blouse necklines that photograph beautifully',
    'ब्राइडल ब्लाउज नेकलाइन जो फोटो में खूबसूरत लगें',
    'bridal-blouse-necklines',
    'From deep V to illusion net — neckline ideas we stitch most for Patna weddings, with tips on what flatters different saree drapes.',
    'डीप V से इल्यूज़न नेट तक — पटना की शादियों में सबसे ज़्यादा सिली जाने वाली नेकलाइन, और अलग-अलग साड़ी ड्रेप के लिए टिप्स।',
    '/slider3.webp',
    true,
    '2026-06-01T10:00:00Z'::timestamptz
  ),
  (
    'How we take NRI measurements on WhatsApp',
    'NRI क्लाइंट्स के माप WhatsApp पर कैसे लेते हैं',
    'nri-whatsapp-measurements',
    'A simple photo + tape guide so families abroad can order bridal and festive wear from our Boring Road atelier with confidence.',
    'सरल फोटो और टेप गाइड — विदेश में परिवार बोरिंग रोड एटेलियर से ब्राइडल और फेस्टिव वियर आत्मविश्वास से ऑर्डर कर सकें।',
    '/slider1.webp',
    true,
    '2026-05-18T10:00:00Z'::timestamptz
  ),
  (
    '24-hour express stitching: what qualifies',
    '24 घंटे एक्सप्रेस सिलाई: किन स्टाइल पर लागू',
    '24-hour-express-stitching',
    'Which blouse, suit and lehenga styles we can often finish in a day — and when you should allow extra time for heavy embroidery.',
    'कौन से ब्लाउज, सूट और लहंगा अक्सर एक दिन में तैयार — और भारी कढ़ाई के लिए कब अतिरिक्त समय रखें।',
    '/slider2.webp',
    true,
    '2026-05-02T10:00:00Z'::timestamptz
  ),
  (
    'Reception gown silhouettes for Indian weddings',
    'भारतीय शादियों के लिए रिसेप्शन गाउन सिल्हूट',
    'reception-gown-silhouettes',
    'Floor-length, cape, and Indo-western fusion options we craft for reception nights — fabric picks that move well on the dance floor.',
    'फ्लोर-लेंथ, केप और इंडो-वेस्टर्न फ़्यूज़न — रिसेप्शन के लिए गाउन, और डांस फ्लोर पर अच्छे लगने वाले कपड़े।',
    '/hero_studio_banner.webp',
    true,
    '2026-04-12T10:00:00Z'::timestamptz
  ),
  (
    'From first stitch to first client: student stories',
    'पहली सिलाई से पहले क्लाइंट तक: छात्राओं की कहानियाँ',
    'student-success-stories',
    'How boutique course graduates turn practice pieces into paid orders — and the mentorship path we follow at the institute.',
    'बुटीक कोर्स ग्रेजुएट प्रैक्टिस पीस से पेड ऑर्डर तक कैसे पहुँचते हैं — और संस्थान में मेंटरशिप का रास्ता।',
    '/boutique.webp',
    true,
    '2026-03-28T10:00:00Z'::timestamptz
  ),
  (
    'Zardozi vs aari: choosing embroidery for bridal wear',
    'ज़रदोज़ी बनाम आरी: ब्राइडल कढ़ाई कैसे चुनें',
    'zardozi-vs-aari-embroidery',
    'Weight, shine and timeline differences — so you pick the right handwork for lehenga panels, blouses and dupattas.',
    'वज़न, चमक और टाइमलाइन का फर्क — लहंगा पैनल, ब्लाउज और दुपट्टे के लिए सही हैंडवर्क चुनें।',
    '/institute.webp',
    true,
    '2026-03-10T10:00:00Z'::timestamptz
  )
) as v(title, title_hi, slug, excerpt, excerpt_hi, image, published, created_at)
where not exists (select 1 from public.lookbook_posts limit 1);
