-- Add institute/courses page SEO meta + on-page copy (jsonb_set — does not replace other pages/courses keys).
-- Run in Supabase SQL Editor: Dashboard → SQL → New query → paste → Run.

UPDATE public.settings
SET
  pages = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    jsonb_set(
                      jsonb_set(
                        jsonb_set(
                          jsonb_set(
                            jsonb_set(
                              jsonb_set(
                                jsonb_set(
                                  jsonb_set(
                                    jsonb_set(
                                      jsonb_set(
                                        jsonb_set(
                                          jsonb_set(
                                            jsonb_set(
                                              jsonb_set(
                                                jsonb_set(
                                                  jsonb_set(
                                                    jsonb_set(
                                                      jsonb_set(
                                                        jsonb_set(
                                                          jsonb_set(
                                                            jsonb_set(
                                                              jsonb_set(
                                                                jsonb_set(
                                                                  coalesce(pages, '{}'::jsonb),
                                                                  '{courses,meta_title}',
                                                                  to_jsonb('Best Fashion Institute in Patna | Shreya Creation'::text),
                                                                  true
                                                                ),
                                                                '{courses,meta_description}',
                                                                to_jsonb(
                                                                  'Join the Best Fashion Institute in Patna for practical fashion designing, stitching, boutique management, blouse making, & career-focused training.'::text
                                                                ),
                                                                true
                                                              ),
                                                              '{courses,header_eyebrow}',
                                                              to_jsonb('Best Fashion Institute in Patna'::text),
                                                              true
                                                            ),
                                                            '{courses,header_title}',
                                                            to_jsonb(
                                                              'Turn Your Passion for Fashion Into a Skill, Career & Business'::text
                                                            ),
                                                            true
                                                          ),
                                                          '{courses,header_subtitle}',
                                                          to_jsonb(
                                                            'Fashion is not just about drawing pretty designs; it''s about knowing how to realize them. At Shreya Creation, we blend creativity, craftsmanship, and industry insights to assist emerging designers in turning their dreams into reality.'::text
                                                          ),
                                                          true
                                                        ),
                                                        '{courses,intro_body}',
                                                        to_jsonb(
                                                          'We, at the Best Fashion Institute in Patna, emphasize "learning through practice" and teach everything related to stitching, pattern making, embroidery, garment making, and boutique management.'::text
                                                        ),
                                                        true
                                                      ),
                                                      '{courses,intro_cta_primary}',
                                                      to_jsonb('Check Our Programs'::text),
                                                      true
                                                    ),
                                                    '{courses,intro_cta_secondary}',
                                                    to_jsonb('Schedule Your Free Demo'::text),
                                                    true
                                                  ),
                                                  '{courses,seo_practical_title}',
                                                  to_jsonb(
                                                    'A Fashion Design Institute in Patna Focused on Practical Training'::text
                                                  ),
                                                  true
                                                ),
                                                '{courses,seo_practical_body}',
                                                to_jsonb(
                                                  'Are you looking for the best fashion design institute in Patna that offers practical training to develop your skills? Then visit Shreya Creation, where you can learn from scratch to create professional garments using all practical methods.' || E'\n\n' ||
                                                  'We will teach you everything, right from understanding fabrics, measurements, cutting, and sewing to finishing and design development.'::text
                                                ),
                                                true
                                              ),
                                              '{courses,seo_practical_tagline}',
                                              to_jsonb('Learn. Practice. Master. Create.'::text),
                                              true
                                            ),
                                            '{courses,seo_practical_cta}',
                                            to_jsonb('Explore our Fashion Courses'::text),
                                            true
                                          ),
                                          '{courses,seo_classes_title}',
                                          to_jsonb(
                                            'Fashion Designing Classes in Patna That Will Teach You to Create'::text
                                          ),
                                          true
                                        ),
                                        '{courses,seo_classes_body}',
                                        to_jsonb(
                                          'Great designers are not created just by learning techniques – great designers are created by practicing them.' || E'\n\n' ||
                                          'Our Fashion Designing Courses in Patna are meant for those students who want real hands-on experience with various aspects of fashion designing.' || E'\n\n' ||
                                          'Be it learning a new skill or improving your existing skills, we make sure that you grow into a confident designer, piece by piece.'::text
                                        ),
                                        true
                                      ),
                                      '{courses,seo_classes_tagline}',
                                      to_jsonb('From Learning to Mastering – The Journey Begins Here'::text),
                                      true
                                    ),
                                    '{courses,seo_classes_cta}',
                                    to_jsonb('Book Your Free Demo Class'::text),
                                    true
                                  ),
                                  '{courses,seo_stitching_title}',
                                  to_jsonb('Master The Craft That Turns Fabric Into Fashion'::text),
                                  true
                                ),
                                '{courses,seo_stitching_body}',
                                to_jsonb(
                                  'The stitching classes in Patna revolve around garment making, measuring, cutting, stitching, and finishing skills.' || E'\n\n' ||
                                  'There is much more: learn specialised courses like Designer Blouse Stitching in Patna and get to learn about construction, designing, and finishing of garments.'::text
                                ),
                                true
                              ),
                              '{courses,seo_stitching_tagline}',
                              to_jsonb('Learn the Stitch. Master the Fit. Elevate the Finish.'::text),
                              true
                            ),
                            '{courses,seo_stitching_cta}',
                            to_jsonb('Stitching Program Courses'::text),
                            true
                          ),
                          '{courses,seo_boutique_title}',
                          to_jsonb('Boutique Management Course in Patna – From Skill to Business'::text),
                          true
                        ),
                        '{courses,seo_boutique_body}',
                        to_jsonb(
                          'Creating fashionable attire is one thing, while turning that skill into a profitable business is another thing altogether.' || E'\n\n' ||
                          'Our boutique management course in Patna is geared towards those interested in learning the basics of operating a fashion business, from product development to costing, pricing, dealing with customers, order processing, and operating boutiques.'::text
                        ),
                        true
                      ),
                      '{courses,seo_boutique_steps}',
                      to_jsonb(
                        'Learn The Skill → Gain Confidence → Take Orders → Generate Income → Run Your Boutique'::text
                      ),
                      true
                    ),
                    '{courses,seo_closing_title}',
                    to_jsonb('Your Fashion Journey Starts Here'::text),
                    true
                  ),
                  '{courses,seo_closing_body}',
                  to_jsonb(
                    'There is no need to wait for the "perfect moment" before starting on your fashion journey.' || E'\n\n' ||
                    'If you wish to be a professional designer, learn to stitch, master designer blouse designing, work in the fashion industry, or open your very own boutique, Shreya Creation has everything needed to take the first step.'::text
                  ),
                  true
                ),
                '{courses,header_eyebrow_hi}',
                to_jsonb('पटना का बेस्ट फैशन इंस्टिट्यूट'::text),
                true
              ),
              '{courses,header_title_hi}',
              to_jsonb('फैशन के प्रति अपने जुनून को कौशल, करियर और कारोबार में बदलें'::text),
              true
            ),
            '{courses,intro_cta_primary_hi}',
            to_jsonb('हमारे कोर्स देखें'::text),
            true
          ),
          '{courses,intro_cta_secondary_hi}',
          to_jsonb('मुफ़्त डेमो बुक करें'::text),
          true
        ),
        '{courses,seo_practical_cta_hi}',
        to_jsonb('हमारे फैशन कोर्स देखें'::text),
        true
      ),
      '{courses,seo_classes_cta_hi}',
      to_jsonb('मुफ़्त डेमो क्लास बुक करें'::text),
      true
  ),
  updated_at = now()
WHERE id = 1;
