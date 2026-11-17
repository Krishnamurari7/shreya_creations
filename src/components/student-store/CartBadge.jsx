"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function CartBadge({ lang = "en" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    const update = () => fetch("/api/student-store/cart").then(r => r.ok ? r.json() : null).then(data => { if (active) setCount((data?.items || []).reduce((n, item) => n + item.quantity, 0)); }).catch(() => {});
    update(); window.addEventListener("student-store:cart", update);
    return () => { active = false; window.removeEventListener("student-store:cart", update); };
  }, []);
  return <Link href="/student-store/cart">{lang === "hi" ? "कार्ट" : "Cart"}{count > 0 && <span className="ml-1 rounded-full bg-[#c9632e] px-2 py-0.5 text-white" aria-label={`${count} items in cart`}>{count}</span>}</Link>;
}
