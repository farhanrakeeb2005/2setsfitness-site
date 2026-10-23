// Page motion (GSAP + ScrollTrigger). Everything is visible without this file:
// it only animates things in from where the CSS already puts them, and does
// nothing for people who ask their system for reduced motion.
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var $ = function (s, root) { return [].slice.call((root || document).querySelectorAll(s)); };
    var hero = document.querySelector('.hero');
    document.documentElement.classList.add('anim');

    // ---------- hero: headline rises line by line, the clips fly in, badges pop ----------
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.nav .brand, .nav li, .nav .btn', { y: -16, opacity: 0, stagger: 0.04, duration: 0.6 }, 0)
      .from('.hero .pill', { y: -20, opacity: 0, duration: 0.6 }, 0.1)
      .from('.hero h1 span', { yPercent: 60, opacity: 0, stagger: 0.12, duration: 0.9 }, 0.2)
      .from('.hero .lede', { y: 24, opacity: 0, duration: 0.8 }, 0.55)
      .from('.hero .cta > *, .hero .facts li', { y: 18, opacity: 0, stagger: 0.07, duration: 0.6 }, 0.7)
      .from('.f1', { y: 160, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.6)
      .from('.f2', { x: 140, y: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.8)
      .from('.f3', { x: -140, y: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.8)
      .from('.badge', { scale: 0, opacity: 0, stagger: 0.18, duration: 0.6, ease: 'back.out(2)' }, 1.3);

    // the badges bob gently; the side clips drift up at different speeds as you scroll
    $('.badge').forEach(function (b, i) {
      gsap.to(b, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    });
    [['.f1', -8], ['.f2', -25], ['.f3', -40]].forEach(function (p) {
      gsap.to(p[0], { yPercent: p[1], ease: 'none', scrollTrigger: { trigger: '.stage', start: 'top 60%', end: 'bottom top', scrub: true } });
    });
    // the clips lean toward the pointer
    if (window.matchMedia('(pointer: fine)').matches) {
      var stage = document.querySelector('.stage');
      var tilt = $('.float').map(function (f) {
        gsap.set(f, { transformPerspective: 900 });
        return [gsap.quickTo(f, 'rotationY', { duration: 0.8, ease: 'power3' }), gsap.quickTo(f, 'rotationX', { duration: 0.8, ease: 'power3' })];
      });
      hero.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        tilt.forEach(function (t) { t[0](x * 14); t[1](-y * 10); });
      });
      hero.addEventListener('pointerleave', function () { tilt.forEach(function (t) { t[0](0); t[1](0); }); });
    }

    // the bar under the nav shows once the page has moved
    var nav = document.querySelector('.nav');
    ScrollTrigger.create({ start: 10, onToggle: function (st) { nav.classList.toggle('scrolled', st.isActive); } });

    // ---------- a red progress line across the top as you read ----------
    var prog = document.createElement('div');
    prog.className = 'scroll-prog';
    document.body.appendChild(prog);
    gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // ---------- section headings ----------
    $('.sec-head').forEach(function (h) {
      gsap.from(h.children, {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 85%' },
      });
    });

    // ---------- feature tiles: rise in groups, then their insides come alive ----------
    ScrollTrigger.batch('.grid .tile', {
      start: 'top 88%',
      onEnter: function (els) {
        gsap.from(els, { y: 70, opacity: 0, scale: 0.96, stagger: 0.12, duration: 0.9, ease: 'power3.out', overwrite: true });
      },
    });
    function onView(el, fn, start) {
      if (el) ScrollTrigger.create({ trigger: el, start: start || 'top 80%', once: true, onEnter: fn });
    }
    // rings fill from empty (they read their --p value from the CSS)
    $('.ring, .kcal').forEach(function (r) {
      var p = parseFloat(getComputedStyle(r).getPropertyValue('--p')) || 0;
      gsap.set(r, { '--p': 0 });
      onView(r, function () { gsap.to(r, { '--p': p, duration: 1.6, ease: 'power2.out' }); });
    });
    $('.macros dd i, .ccard .bar i').forEach(function (b) {
      gsap.set(b, { scaleX: 0, transformOrigin: 'left center' });
      onView(b, function () { gsap.to(b, { scaleX: 1, duration: 1.3, ease: 'power3.out', delay: 0.2 }); });
    });
    onView(document.querySelector('.form-side'), function () {
      gsap.from('.form-side .chip', { scale: 0.6, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(2)', delay: 0.4 });
    });
    onView(document.querySelector('.qa'), function () {
      gsap.from('.qa li', { y: 24, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(1.6)' });
    });
    onView(document.querySelector('.glasses'), function () {
      gsap.from('.glasses i.on', { scaleY: 0, transformOrigin: 'bottom center', stagger: 0.08, duration: 0.5, ease: 'back.out(2)' });
    });
    $('.tile .steps').forEach(function (ul) {
      onView(ul, function () { gsap.from(ul.children, { x: -20, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }); }, 'top 88%');
    });
    $('.mm img, .painmap').forEach(function (img) {
      onView(img, function () { gsap.from(img, { scale: 0.85, opacity: 0, rotateY: -25, duration: 1, ease: 'power3.out' }); });
    });

    // ---------- why us: cards and the comparison table ----------
    ScrollTrigger.batch('.why-grid > div', {
      start: 'top 88%',
      onEnter: function (els) { gsap.from(els, { y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', overwrite: true }); },
    });
    onView(document.querySelector('.compare'), function () {
      gsap.from('.compare tbody tr', { x: -30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' });
      gsap.from('.compare td.y', { color: '#ffffff', duration: 0.8, stagger: 0.08, delay: 0.3 });
    });

    // ---------- compete: points count up, the ladder grows, the board slides in ----------
    var pts = document.querySelector('.ccard .pts');
    if (pts && pts.firstChild && pts.firstChild.nodeType === 3) {
      var node = pts.firstChild, target = parseInt(node.nodeValue.replace(/\D/g, ''), 10) || 0, n = { v: 0 };
      node.nodeValue = '0';
      onView(pts, function () {
        gsap.to(n, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: function () { node.nodeValue = Math.round(n.v).toLocaleString('en-GB'); } });
      });
    }
    ScrollTrigger.batch('.cgrid .ccard', {
      start: 'top 85%',
      onEnter: function (els) { gsap.from(els, { y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', overwrite: true }); },
    });
    onView(document.querySelector('.ladder ol'), function () {
      gsap.from('.ladder li', { scaleY: 0, transformOrigin: 'bottom center', stagger: 0.09, duration: 0.9, ease: 'back.out(1.4)' });
      gsap.from('.ladder li > *', { opacity: 0, stagger: 0.09, duration: 0.4, delay: 0.5 });
    });
    onView(document.querySelector('.ccard.board table'), function () {
      gsap.from('.ccard.board tr', { x: 40, opacity: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo('.ccard.board tr.me', { backgroundColor: 'rgba(227,30,36,0.55)' }, { backgroundColor: 'rgba(227,30,36,0)', clearProps: 'backgroundColor', duration: 1.6, delay: 0.7 });
    });

    // ---------- see it: the phone video slides in from the side ----------
    onView(document.querySelector('.try'), function () {
      gsap.from('.try-copy > *', { x: -40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
      gsap.from('.try-phone', { x: 80, rotate: -6, opacity: 0, duration: 1.1, ease: 'expo.out' });
    }, 'top 75%');

    // ---------- how it works: the three steps come in one after another ----------
    onView(document.querySelector('.how ol'), function () {
      gsap.from('.how li', { y: 60, opacity: 0, rotateX: -30, transformPerspective: 800, stagger: 0.18, duration: 0.9, ease: 'power3.out' });
    });

    // ---------- the exercise wall: tiles flip up in a wave ----------
    ScrollTrigger.batch('.wall figure', {
      start: 'top 92%',
      onEnter: function (els) {
        gsap.from(els, { y: 50, opacity: 0, scale: 0.9, rotateX: -35, transformPerspective: 700, stagger: 0.06, duration: 0.8, ease: 'power3.out', overwrite: true });
      },
    });

    // ---------- privacy strip, questions, contact ----------
    [['.strip > div', 'top 88%'], ['.faq details', 'top 92%'], ['.cform > *', 'top 90%']].forEach(function (p) {
      ScrollTrigger.batch(p[0], {
        start: p[1],
        onEnter: function (els) { gsap.from(els, { y: 30, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'power2.out', overwrite: true }); },
      });
    });

    // ---------- the closing line slams in ----------
    onView(document.querySelector('.closing'), function () {
      gsap.timeline()
        .from('.closing h2', { scale: 1.4, opacity: 0, duration: 0.8, ease: 'expo.out' })
        .from('.closing h2 span', { x: 60, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.35)
        .from('.closing p, .closing .cta > *', { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.5);
    }, 'top 85%');

    // buttons give a little when you press
    $('.btn:not(.soon)').forEach(function (b) {
      b.addEventListener('pointerdown', function () { gsap.to(b, { scale: 0.95, duration: 0.12 }); });
      ['pointerup', 'pointerleave'].forEach(function (ev) { b.addEventListener(ev, function () { gsap.to(b, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); }); });
    });

    // videos and images change the page height as they load
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    return function () { document.documentElement.classList.remove('anim'); if (prog.parentNode) prog.remove(); };
  });
})();
