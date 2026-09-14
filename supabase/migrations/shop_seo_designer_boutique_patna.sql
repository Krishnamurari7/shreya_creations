-- Restore service_role write (scripts/apply-shop-seo.mjs) + boutique/shop SEO copy.
-- Run in Supabase SQL Editor: Dashboard → SQL → New query → paste → Run.
-- Source of truth for these fields: src/lib/cms/defaults.js → PAGE_DEFAULTS.shop

GRANT SELECT, INSERT, UPDATE ON public.settings TO service_role;

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
                                    coalesce(pages, '{}'::jsonb),
                                    '{shop,meta_title}',
                                    to_jsonb('Best Designer Boutique in Patna | Shreya Creation'::text),
                                    true
                                  ),
                                  '{shop,meta_description}',
                                  to_jsonb(
                                    'Discover Shreya Creation, the best designer boutique in Patna for bridal wear, designer blouses, lehengas, custom stitching, Aari-Zari handwork, & a perfect fit.'::text
                                  ),
                                  true
                                ),
                                '{shop,header_eyebrow}',
                                to_jsonb('Boutique'::text),
                                true
                              ),
                              '{shop,header_title}',
                              to_jsonb('Boutique'::text),
                              true
                            ),
                            '{shop,header_tagline}',
                            to_jsonb('Where Your Imagination Takes Shape in Fashion'::text),
                            true
                          ),
                          '{shop,header_subtitle}',
                          to_jsonb(
                            'Your attire should never look ordinary. At Shreya Creation, the best designer boutique in Patna, we transform your imagination into unique fashion with the help of our signature bridal tops, designer lehengas, designer suits, designer gowns, and other customized dresses with a perfect fit and fine details.'::text
                          ),
                          true
                        ),
                        '{shop,intro_body}',
                        to_jsonb(
                          'Being the best designer boutique in Patna, we combine the trendiest styles with our exquisite designs to produce a remarkable fashion line for you.'::text
                        ),
                        true
                      ),
                      '{shop,hero_cta_primary_label}',
                      to_jsonb('Explore our Creations'::text),
                      true
                    ),
                    '{shop,hero_cta_primary_href}',
                    to_jsonb('/portfolio'::text),
                    true
                  ),
                  '{shop,hero_cta_secondary_label}',
                  to_jsonb('Chat on WhatsApp'::text),
                  true
                ),
                '{shop,about_title}',
                to_jsonb('About Our Boutique'::text),
                true
              ),
              '{shop,about_body}',
              to_jsonb(
                'At Shreya Creation, we understand that an ideal outfit does not just come out of a stitch but is made keeping your needs in mind. Whether it is bridal blouses, designer lehengas, or even suits and gowns, each of our creations is a combination of your imagination and our skill. As the best designer boutique in Patna, we have always specialized in personalized designs, fine fitting, Aari & Zari hand embroidery, and finishing.'::text
              ),
              true
            ),
            '{shop,process_title}',
            to_jsonb('From First Sketch to Final Stitch – Your Look, Your Way'::text),
            true
          ),
          '{shop,process_features}',
          '[
            {"icon":"design","title":"Personalised Designs"},
            {"icon":"measure","title":"Precision Fitting"},
            {"icon":"bridal","title":"Bridal & Designer Expertise"},
            {"icon":"hand","title":"Fine Handwork"},
            {"icon":"check","title":"Thoughtful Finishing"}
          ]'::jsonb,
          true
        ),
        '{shop,closing_tagline}',
        to_jsonb('We Don''t Just Stitch Outfits. We Create the Look You''ll Remember.'::text),
        true
      ),
      '{shop,header_eyebrow_hi}',
      to_jsonb('बुटीक'::text),
      true
    ),
    '{shop,header_title_hi}',
    to_jsonb('बुटीक'::text),
    true
  ),
  updated_at = now()
WHERE id = 1;
