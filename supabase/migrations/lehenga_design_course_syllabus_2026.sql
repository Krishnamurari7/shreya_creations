-- Fill Lehenga Design Course syllabus + includes from Lehenga Design Book 2026.
-- Course row already exists (slug: lehenga-design-course-patna) with PDF attached.

UPDATE public.courses
SET
  language = coalesce(nullif(trim(language), ''), 'Hindi'),
  about = $about$The Lehenga Design Course at Shreya Creation Boutique Institute is a practical training program for beginners, tailoring students, boutique owners and aspiring fashion designers.

Based on Shreya Creation's Lehenga Design Book 2026 — Grace. Heritage. Elegance. — students learn professional body measurement, pattern drafting, fabric selection, lehenga cutting, designer blouse/choli construction, stitching, fitting correction and premium finishing. Training covers bridal lehengas, party-wear lehengas, traditional styles, Indo-Western designs, layered and flared patterns, mermaid cuts, cape and jacket pairings, quilted velvet, mirror work, bandhani, and modern outfit combinations from our design collection.

Students receive step-by-step practical guidance to create stylish, well-fitted and professionally finished lehenga designs — including fabric combinations, colour coordination, design placement and garment presentation.

Suitable for anyone who wants to improve tailoring skills, start a boutique, create customised outfits or build a career in fashion designing.

Enroll now at Shreya Creation Boutique Institute, East Boring Canal Road, Patna.$about$,
  about_hi = $about_hi$श्रेय क्रिएशन बुटीक इंस्टीट्यूट का लहंगा डिजाइनिंग कोर्स शुरुआती विद्यार्थियों, सिलाई सीखने वालों, बुटीक संचालकों और फैशन डिजाइनिंग में करियर बनाने वालों के लिए एक प्रैक्टिकल ट्रेनिंग प्रोग्राम है।

श्रेया क्रिएशन के Lehenga Design Book 2026 — Grace. Heritage. Elegance. — के अनुसार प्रोफेशनल बॉडी मेजरमेंट, पैटर्न ड्राफ्टिंग, फैब्रिक चुनाव, लहंगा कटिंग, डिज़ाइनर ब्लाउज़/चोली निर्माण, सिलाई, फिटिंग सुधार और प्रीमियम फिनिशिंग सिखाई जाती है। ट्रेनिंग में ब्राइडल लहंगा, पार्टी-वियर, पारंपरिक और इंडो-वेस्टर्न स्टाइल, लेयर्ड/फ्लेयर्ड पैटर्न, मरमेड कट, केप और जैकेट पेयरिंग, क्विल्टेड वेल्वेट, मिरर वर्क, बांधनी और आधुनिक आउटफिट कॉम्बिनेशन शामिल हैं।

विद्यार्थियों को स्टाइलिश, अच्छी फिटिंग और प्रोफेशनल फिनिश वाले लहंगे तैयार करने का चरणबद्ध मार्गदर्शन मिलता है।

आज ही नामांकन करें — श्रेय क्रिएशन बुटीक इंस्टीट्यूट, ईस्ट बोरिंग कैनाल रोड, पटना।$about_hi$,
  includes = jsonb_build_array(
    '6-month professional lehenga design programme',
    '50+ styles from Lehenga Design Book 2026',
    'Measurement, pattern drafting & fabric selection',
    'Flared, panelled, mermaid, layered & A-line cuts',
    'Designer blouse/choli pairing for lehenga sets',
    'Can-can, lining, cape, jacket & heavy finishing',
    '100% hands-on practical training',
    'Certificate on course completion'
  ),
  includes_hi = jsonb_build_array(
    '6 महीने का प्रोफेशनल लहंगा डिज़ाइन प्रोग्राम',
    'Lehenga Design Book 2026 से 50+ स्टाइल',
    'मेजरमेंट, पैटर्न ड्राफ्टिंग और फैब्रिक चयन',
    'फ्लेयर्ड, पैनल्ड, मरमेड, लेयर्ड और ए-लाइन कट',
    'लहंगा सेट के लिए डिज़ाइनर ब्लाउज़/चोली पेयरिंग',
    'कैन-कैन, लाइनिंग, केप, जैकेट और हेवी फिनिशिंग',
    '100% हैंड्स-ऑन प्रैक्टिकल ट्रेनिंग',
    'कोर्स पूरा करने पर सर्टिफिकेट'
  ),
  syllabus = jsonb_build_array(
    'Module 1 — Lehenga fundamentals: measurement, fabric calculation, pattern drafting & style selection',
    'Module 2 — Basic flared & A-line lehenga cutting with waistband, can-can & lining',
    'Module 3 — Gather, panelled & kali lehenga construction with boutique finishing',
    'Module 4 — Mermaid / fishtail lehenga silhouette with heavy hem border',
    'Module 5 — Designer choli basics: crop fit, lining, padding & lehenga pairing',
    'Module 6 — Embroidered crop choli with cape / open dupatta coordination (heritage look)',
    'Module 7 — Jacket-style embroidered top with structured lapel for modern lehenga sets',
    'Module 8 — Boat-neck & off-shoulder modern choli with floral placement',
    'Module 9 — Asymmetrical split blouse: embroidery + velvet contrast, deep V & gold cuff',
    'Module 10 — One-shoulder cape blouse with ruched bodice, strap detail & latkan',
    'Module 11 — Quilted velvet V-neck full-sleeve blouse with pearl fringe finishing',
    'Module 12 — Mirror-work off-shoulder blouse & high-neck gold sequin halter choli',
    'Module 13 — Noodle-strap structured bodice & sweetheart scalloped choli with shrug/jacket',
    'Module 14 — Bandhani scoop-neck elbow-sleeve choli with gota border finishing',
    'Module 15 — Square-neck sheer embroidered full-sleeve blouse with waist belt',
    'Module 16 — Corset sweetheart with diagonal strap & 3D floral appliqué',
    'Module 17 — Beaded scalloped corset blouse with sheer cape draping',
    'Module 18 — Tiered, layered & dual-tone draped lehenga skirts',
    'Module 19 — Dupatta, latkan, piping, belt & potli finishing for complete sets',
    'Module 20 — Final bridal / festive lehenga project, fitting correction & assessment'
  ),
  updated_at = now()
WHERE slug = 'lehenga-design-course-patna';
