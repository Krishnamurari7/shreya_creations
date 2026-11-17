"use client";
import { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
export default function RecommendedForStudent({ lang = "en" }) {
  const [data, setData] = useState(null);
  useEffect(() => { let active = true; fetch("/api/student-store/recommendations").then(r => r.ok ? r.json() : null).then(x => { if (active) setData(x); }).catch(() => {}); return () => { active = false; }; }, []);
  if (!data) return null;
  if (!data.verified) return <p className="rounded-2xl border border-[#634637] p-5 text-sm text-[#ddc5b1]">{lang === "hi" ? "अपने कोर्स के सुझाव देखने के लिए संस्थान से अपना प्रवेश सत्यापित कराएं।" : "Your course recommendations will appear after the institute verifies your admitted registration."}</p>;
  return <section className="py-12" aria-label={lang === "hi" ? "आपके कोर्स के सुझाव" : "Recommendations for your courses"}>
    <p className="text-[#e68b53] text-xs uppercase tracking-[.24em]">{lang === "hi" ? "आपके लिए" : "For your course"}</p>
    <h2 className="font-serif text-3xl sm:text-4xl mt-2 mb-7">{lang === "hi" ? "आपके कोर्स के सुझाव" : "Recommended for your course"}</h2>
    {data.courses.map(course => <div key={course.id} className="mb-9"><h3 className="font-serif text-2xl mb-4">{course.title}</h3>{course.products.length || course.kits.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{course.kits.map(k => <StoreCard key={k.id} item={k} kind="kit" />)}{course.products.map(p => <StoreCard key={p.id} item={p} />)}</div> : <p className="text-[#d8bdab]">{lang === "hi" ? "इस कोर्स के लिए अभी कोई सामान प्रकाशित नहीं है।" : "No published items are linked to this course yet."}</p>}</div>)}
  </section>;
}
