export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("sc-theme");var d=t==="dark";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#0a0710":"#FFF9F0")}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
