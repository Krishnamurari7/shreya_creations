"use client";

function text(lang, en, hi) {
  return lang === "hi" && hi ? hi : en || "";
}

export default function CourseLandingSections({ landing, lang }) {
  if (!landing?.sections?.length) return null;

  return (
    <>
      {landing.sections.map((section) => {
        const title = text(lang, section.title, section.titleHi);
        const paragraphs =
          lang === "hi" && section.paragraphsHi?.length ? section.paragraphsHi : section.paragraphs || [];
        const bullets = lang === "hi" && section.bulletsHi?.length ? section.bulletsHi : section.bullets || [];
        const items = section.items || [];
        return (
          <section key={title} className="course-detail__section">
            <h2 className="course-detail__section-title">{title}</h2>
            <div className="course-detail__about course-landing__copy">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {items.length > 0 && (
                <ol className="course-landing__people">
                  {items.map((item) => (
                    <li key={item.title}>
                      <h3>{text(lang, item.title, item.titleHi)}</h3>
                      <p>{text(lang, item.body, item.bodyHi)}</p>
                    </li>
                  ))}
                </ol>
              )}
              {bullets.length > 0 && (
                <ul className="course-landing__bullets">
                  {bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
