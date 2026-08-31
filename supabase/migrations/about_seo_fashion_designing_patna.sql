-- Add about page SEO meta + on-page copy (jsonb_set — does not replace other pages/about keys).
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
                          coalesce(pages, '{}'::jsonb),
                          '{about,meta_title}',
                          to_jsonb('Best Fashion Designing in Patna | Shreya Creation'::text),
                          true
                        ),
                        '{about,meta_description}',
                        to_jsonb(
                          'Discover Shreya Creation for the best fashion designing in Patna, with practical training, boutique skills, bridal wear, designer stitching and hands-on learning.'::text
                        ),
                        true
                      ),
                      '{about,header_eyebrow}',
                      to_jsonb('Our Story'::text),
                      true
                    ),
                    '{about,header_title}',
                    to_jsonb('About Shreya Creation'::text),
                    true
                  ),
                  '{about,header_tagline}',
                  to_jsonb(
                    'Where Fashion Becomes Skill, Skill Becomes Confidence & Confidence Becomes Business.'::text
                  ),
                  true
                ),
                '{about,story_block_1}',
                to_jsonb(
                  'Founded in 2012 by Sanjay Kumar Mishra and Shreya, Shreya Creation, today prominent for the best fashion designing in Patna, began with a powerful vision – to empower women through fashion, practical skills, and entrepreneurship.'::text
                ),
                true
              ),
              '{about,story_block_2}',
              to_jsonb(
                'Situated on Boring Road, Patna, Shreya Creation is a reliable source of designer blouses, bridal collections, elegant Aari & Zari embroidery, and innovative saree re-designs, where every dress is made according to your personality and occasion.'::text
              ),
              true
            ),
            '{about,story_block_3}',
            to_jsonb(
              'Our fashion design institute and best ladies tailor in Patna help you convert your creativity into a profession through intensive training in fashion design techniques and boutique management practices.'::text
            ),
            true
          ),
          '{about,boutique_eyebrow}',
          to_jsonb('Boutique & Institute'::text),
          true
        ),
        '{about,boutique_body}',
        to_jsonb(
          'Shreya Creation – The best fashion designing classes in Patna, offering bespoke stitching, bridal couture, and 50+ job-oriented fashion designing courses in Patna. Here, you get a stitched outfit in just 24 hours.'::text
        ),
        true
      ),
      '{about,header_eyebrow_hi}',
      to_jsonb('हमारी कहानी'::text),
      true
    ),
    '{about,header_title_hi}',
    to_jsonb('श्रेया क्रिएशन के बारे में'::text),
    true
  ),
  updated_at = now()
WHERE id = 1;
