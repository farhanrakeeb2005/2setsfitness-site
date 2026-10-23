// Page motion (GSAP), kept quiet: the top of the page fades in once and the
// hero's badges bob gently; everything below is still, as the CSS draws it.
// Nothing moves for people who ask their system for reduced motion.
(function () {
  if (!window.gsap) return;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } })
      .from('.hero-top > *', { y: 16, opacity: 0, stagger: 0.08 })
      .from('.float', { y: 30, opacity: 0, stagger: 0.1, duration: 1 }, 0.3)
      .from('.badge', { opacity: 0, duration: 0.6 }, 0.9);
    [].slice.call(document.querySelectorAll('.badge')).forEach(function (b, i) {
      gsap.to(b, { y: i % 2 ? 6 : -6, duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
    });
  });
  // the line under the menu shows once the page has moved
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
