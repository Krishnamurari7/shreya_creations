-- Split contact phones for click-to-call (primary + secondary).
-- Legacy `phone` stayed as a combined display string which breaks tel: links.

UPDATE public.settings
SET
  phone_primary = coalesce(nullif(phone_primary, ''), '+919031105666'),
  phone_secondary = coalesce(nullif(phone_secondary, ''), '+917903155125'),
  phone = coalesce(
    nullif(phone, ''),
    '+91 90311 05666 / 79031 55125'
  ),
  whatsapp = coalesce(nullif(whatsapp, ''), '919031105666'),
  whatsapp_number = coalesce(nullif(whatsapp_number, ''), coalesce(nullif(whatsapp, ''), '919031105666')),
  email = coalesce(nullif(email, ''), 'hello@shreyacreation.com'),
  updated_at = now()
WHERE id = 1;
