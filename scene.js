/* The mountain behind the page, and the climber on it.
 *
 * Both are driven by one number: how far down the page you are, 0 to 1.
 * Everything is written to a transform on a fixed element, so it never
 * reflows anything -- and it is all read and written inside one rAF, so a
 * fast scroll cannot queue up a hundred layout reads.
 *
 * Reduce motion: the mountain stops drifting and the climber stands still
 * at the foot of the ridge, rather than being removed -- it is part of the
 * picture, not decoration on top of it.
 */
(() => {
  const scene = document.querySelector('.scene');
  const photo = scene && scene.querySelector('.photo');
  const climber = document.querySelector('.climber');
  if (!photo && !climber) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // where the climber walks: up the ridge, in viewport percentages. The
  // ridge in summit.jpg runs from the bottom left to the peak at the top
  // right, so these follow it rather than a straight line.
  const PATH = [
    { x: 72, y: 96 },
    { x: 78, y: 86 },
    { x: 83, y: 74 },
    { x: 87, y: 61 },
    { x: 90, y: 47 },
    { x: 93, y: 34 },
    { x: 95, y: 23 },
  ];
  const at = (t) => {
    const u = Math.max(0, Math.min(1, t)) * (PATH.length - 1);
    const i = Math.min(PATH.length - 2, Math.floor(u));
    const f = u - i;
    return {
      x: PATH[i].x + (PATH[i + 1].x - PATH[i].x) * f,
      y: PATH[i].y + (PATH[i + 1].y - PATH[i].y) * f,
    };
  };

  let ticking = false;
  const draw = () => {
    ticking = false;
    const doc = document.documentElement;
    const span = Math.max(1, doc.scrollHeight - window.innerHeight);
    const t = Math.max(0, Math.min(1, window.scrollY / span));
    const still = reduce.matches;

    // the mountain sinks a little as the page goes down, so the picture
    // moves with you instead of being a flat backdrop pinned behind glass
    if (photo) photo.style.transform = still ? '' : `translate3d(0, ${(t * 7).toFixed(2)}%, 0) scale(1.1)`;

    if (climber) {
      const p = at(still ? 0 : t);
      // a small bob, so the walk reads as a walk and not a slide
      const bob = still ? 0 : Math.sin(t * Math.PI * 14) * 3;
      climber.style.transform =
        `translate3d(calc(${p.x.toFixed(2)}vw - 50%), calc(${p.y.toFixed(2)}vh - 100% + ${bob.toFixed(1)}px), 0)`;
      climber.style.opacity = t > 0.985 ? '0' : '1';   // out of the way of the footer
    }
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
