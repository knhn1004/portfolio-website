// Static inline script to restore theme/accent before first paint.
// Logic:
//   1. If the user has explicitly toggled (localStorage "oc:theme"), use that.
//   2. Otherwise, detect OS preference via prefers-color-scheme.
//   3. Dark OS → "space" theme; light OS → "rock" theme.
const script = `(function(){
  try {
    var stored = localStorage.getItem("oc:theme");
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var t = stored || (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", t);
    var defaultAccent = t === "dark" ? "steel" : "moss";
    var a = localStorage.getItem("oc:accent:" + t) || defaultAccent;
    if (a !== "steel") document.documentElement.setAttribute("data-accent", a);
  } catch(e) {}
})();`;

export function ThemeInit() {
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
