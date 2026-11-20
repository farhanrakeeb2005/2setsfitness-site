/* Light and dark for the whole site.
 *
 * The page's <head> has already read the saved choice before anything
 * painted (the one-liner there, which has to stay inline or the page
 * flashes the wrong colours). This file is only the button.
 *
 * Three states, not two: no data-theme means "follow the system", and the
 * stylesheet handles that with a prefers-color-scheme block. Pressing the
 * button writes an explicit choice, which from then on wins over the
 * system on this browser.
 */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var system = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : !!(system && system.matches);
  }
  function label() {
    var dark = isDark();
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = dark ? 'Light mode' : 'Dark mode';
  }

  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('2s-theme', next); } catch (e) { /* private window: this session only */ }
    label();
  });

  // someone who has never pressed the button keeps following their system
  if (system && system.addEventListener) system.addEventListener('change', label);
  label();
})();
