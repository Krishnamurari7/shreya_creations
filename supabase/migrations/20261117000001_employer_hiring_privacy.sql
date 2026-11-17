-- Limit admin roster access and extend the existing privacy notice without replacing prior copy.
revoke select on public.admins from anon;

update public.policy_pages
set body = body || E'\n\n6. Employer staffing requests\nWhen an employer submits a staffing request, we collect company and contact details, job location, roles, proposed salary, working conditions, consent choices and the time and version of accepted terms. Authorized team members use this information to review the inquiry, match consenting candidate records, arrange interviews and track outcomes. Candidate profiles and contact details are shared with an employer only with appropriate candidate permission. Recruitment records are kept for follow-up and business records; contact us to request correction or deletion, subject to applicable obligations.',
    body_hi = coalesce(body_hi, '') || E'\n\nनियोक्ता स्टाफ अनुरोध में हम व्यवसाय और संपर्क विवरण, कार्यस्थल, पद, प्रस्तावित वेतन, कार्य शर्तें और सहमति का रिकॉर्ड लेते हैं। अधिकृत टीम पूछताछ की समीक्षा, उम्मीदवार मिलान, इंटरव्यू और परिणाम के लिए इसका उपयोग करती है। उम्मीदवार की अनुमति के बाद ही उसकी प्रोफ़ाइल या संपर्क जानकारी नियोक्ता से साझा की जाती है। सुधार या हटाने का अनुरोध Contact पेज से करें।',
    updated_at = now()
where slug = 'privacy' and body not like '%Employer staffing requests%';
