/* The mountain behind the page.
 *
 * One number drives it: how far down the page you are, 0 to 1. It is
 * written to a transform on a fixed element, so it never reflows anything
 * -- and it is read and written inside one rAF, so a fast scroll cannot
 * queue up a hundred layout reads.
 *
 * Reduce motion: the mountain stops drifting and simply sits there.
 */
(() => {
  const scene = document.querySelector('.scene');
  const photo = scene && scene.querySelector('.photo');
  if (!photo) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let ticking = false;
  const draw = () => {
    ticking = false;
    const doc = document.documentElement;
    const span = Math.max(1, doc.scrollHeight - window.innerHeight);
    const t = Math.max(0, Math.min(1, window.scrollY / span));

    // the mountain sinks a little as the page goes down, so the picture
    // moves with you instead of being a flat backdrop pinned behind glass
    photo.style.transform = reduce.matches
      ? ''
      : `translate3d(0, ${(t * 2.5).toFixed(2)}%, 0)`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(draw);
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  reduce.addEventListener?.('change', onScroll);
  draw();
})();
