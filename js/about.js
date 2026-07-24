import './main.js';
import '../css/about.css';

const initHistoryTimeline = () => {
  const timeline = document.querySelector('.timeline');

  if (!timeline) return;

  const items = [...timeline.querySelectorAll('.timeline-item')];
  const timelineEnd = timeline.querySelector('.timeline-end');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  timeline.classList.add('timeline--enhanced');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    timelineEnd?.classList.add('is-visible');
    timeline.style.setProperty('--timeline-progress', '1');
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -14% 0px', threshold: 0.16 },
  );

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 35, 140)}ms`);
    revealObserver.observe(item);
  });
  if (timelineEnd) revealObserver.observe(timelineEnd);

  let ticking = false;
  const updateProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const start = window.innerHeight * 0.72;
    const travel = Math.max(rect.height - window.innerHeight * 0.34, 1);
    const progress = Math.min(Math.max((start - rect.top) / travel, 0), 1);
    timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
    ticking = false;
  };

  const requestProgressUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate, { passive: true });
};

initHistoryTimeline();
