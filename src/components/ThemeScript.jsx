export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("sc-theme");var d=t==="dark";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
