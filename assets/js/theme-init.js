/* =====================================================
   THEME INIT
   Runs in <head> before the page paints, so there is no
   flash of the wrong theme. Kept tiny on purpose.

   Order of preference:
   1. The theme the visitor picked last time (saved in localStorage)
   2. Their device setting (light or dark)
   3. Dark
===================================================== */

(function () {
  var root = document.documentElement;
  var theme = null;

  try {
    theme = localStorage.getItem('theme');
  } catch (error) {
    /* Storage can be blocked in private windows; fall through. */
  }

  if (theme !== 'light' && theme !== 'dark') {
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    theme = prefersLight ? 'light' : 'dark';
  }

  root.setAttribute('data-theme', theme);

  /* Tells the CSS that JavaScript is running (enables scroll reveal). */
  root.classList.add('js');
})();
