import Lenis from 'lenis';
import '../css/style.css';
import '../css/desktop.css';
import '../css/mobile.css';

const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-mobile-menu]');
const header = document.querySelector('[data-header]');
let lenis;

function setupLenis() {
  lenis = new Lenis({
    duration: 1.15,
    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    smoothWheel: true,
  });

  function animate(time) {
    lenis.raf(time);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
}

function setupMenu() {
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu?.classList.toggle('is-open', !expanded);
  });

  menu?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });
}

function setHeaderState() {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
}

function setupAnchorScroll() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    lenis?.scrollTo(target, { offset: -(header?.offsetHeight || 0) });
  });
}

function formatCounter(value, decimals, suffix) {
  const formatted = value.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  if (suffix === 'GWh') {
    return `${formatted}<span>GWh</span>`;
  }

  return `${formatted}${suffix}`;
}

function animateCounter(counter) {
  const target = Number(counter.dataset.value || 0);
  const decimals = Number(counter.dataset.decimals || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    counter.innerHTML = formatCounter(current, decimals, suffix);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.innerHTML = formatCounter(target, decimals, suffix);
    }
  }

  requestAnimationFrame(tick);
}

function setupCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const groups = new Map();

  counters.forEach((counter) => {
    const section = counter.closest('section') || counter.parentElement;
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(counter);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        groups.get(entry.target)?.forEach((counter) => animateCounter(counter));
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.2,
    },
  );

  groups.forEach((groupCounters, section) => {
    groupCounters.forEach((counter) => {
      counter.innerHTML = formatCounter(0, Number(counter.dataset.decimals || 0), counter.dataset.suffix || '');
    });
    observer.observe(section);
  });
}

function setupSectionReveals() {
  const sections = document.querySelectorAll('main > section, .site-footer');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  sections.forEach((section) => section.classList.add('reveal-section'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupPage() {
  setupLenis();
  setupMenu();
  setupAnchorScroll();
  setupSectionReveals();
  setupCounters();
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

setupPage();
