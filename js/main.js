import Lenis from 'lenis';
import '../css/style.css';
import '../css/header.css';
import '../css/footer.css';
import '../css/home.css';
import '../css/about.css';
import '../css/desktop.css';
import '../css/mobile.css';
import { setupLayout } from './layout.js';

setupLayout();

const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-mobile-menu]');
const header = document.querySelector('[data-header]');
const desktopMenu = document.querySelector('[data-desktop-menu]');
const desktopTriggers = [...document.querySelectorAll('[data-desktop-trigger]')];
const desktopPanels = [...document.querySelectorAll('[data-desktop-panel]')];
const mobileTriggers = [...document.querySelectorAll('.mobile-nav-trigger')];
let lenis;
let closeDesktopTimer;
let panelTransitionTimer;
let activeDesktopKey = '';
let activeSolutionCard;
let floatingSolutionLabel;

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
  const wasOpen = toggle?.getAttribute('aria-expanded') === 'true';
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open menu');
  menu?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  mobileTriggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.parentElement?.classList.remove('is-expanded');
  });
  if (wasOpen) lenis?.start();
}

function setupMenu() {
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    menu?.classList.toggle('is-open', !expanded);
    document.body.classList.toggle('menu-open', !expanded);
    if (!expanded) lenis?.stop();
    else lenis?.start();
  });

  menu?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  mobileTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const willExpand = trigger.getAttribute('aria-expanded') !== 'true';

      mobileTriggers.forEach((otherTrigger) => {
        if (otherTrigger === trigger) return;
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherTrigger.parentElement?.classList.remove('is-expanded');
      });

      trigger.setAttribute('aria-expanded', String(willExpand));
      item?.classList.toggle('is-expanded', willExpand);
    });
  });
}

function closeDesktopMenu() {
  window.clearTimeout(closeDesktopTimer);
  window.clearTimeout(panelTransitionTimer);
  desktopMenu?.classList.remove('is-open');
  desktopTriggers.forEach((trigger) => {
    trigger.classList.remove('is-active');
    trigger.setAttribute('aria-expanded', 'false');
  });
  desktopPanels.forEach((panel) => panel.classList.remove('is-active', 'is-leaving'));
  activeDesktopKey = '';
}

function openDesktopMenu(key) {
  window.clearTimeout(closeDesktopTimer);
  window.clearTimeout(panelTransitionTimer);
  const activePanel = desktopPanels.find((panel) => panel.dataset.desktopPanel === key);
  if (!activePanel) return;

  if (activePanel.classList.contains('mega-panel--card')) {
    const trigger = desktopTriggers.find((item) => item.dataset.desktopTrigger === key);
    const triggerBox = trigger?.getBoundingClientRect();
    const panelWidth = activePanel.getBoundingClientRect().width || 306;
    const desiredLeft = triggerBox?.left || 0;
    const maximumLeft = window.innerWidth - panelWidth - 56;
    activePanel.style.left = `${Math.round(Math.min(desiredLeft, maximumLeft))}px`;
  }

  desktopMenu?.classList.add('is-open');
  desktopTriggers.forEach((trigger) => {
    const isActive = trigger.dataset.desktopTrigger === key;
    trigger.classList.toggle('is-active', isActive);
    trigger.setAttribute('aria-expanded', String(isActive));
  });
  const previousPanel = desktopPanels.find((panel) => panel.classList.contains('is-active'));

  if (previousPanel && previousPanel !== activePanel) {
    previousPanel.classList.remove('is-active');
    previousPanel.classList.add('is-leaving');
    panelTransitionTimer = window.setTimeout(() => previousPanel.classList.remove('is-leaving'), 240);
  }

  desktopPanels.forEach((panel) => {
    if (panel !== activePanel && panel !== previousPanel) panel.classList.remove('is-active', 'is-leaving');
  });

  if (activeDesktopKey !== key) {
    activePanel.classList.remove('is-leaving');
    requestAnimationFrame(() => activePanel.classList.add('is-active'));
  }

  activeDesktopKey = key;
}

function scheduleDesktopClose() {
  closeDesktopTimer = window.setTimeout(closeDesktopMenu, 130);
}

function setupDesktopMenu() {
  desktopTriggers.forEach((trigger) => {
    const key = trigger.dataset.desktopTrigger;
    trigger.addEventListener('mouseenter', () => openDesktopMenu(key));
    trigger.addEventListener('focus', () => openDesktopMenu(key));
    trigger.addEventListener('click', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') closeDesktopMenu();
      else openDesktopMenu(key);
    });
    trigger.addEventListener('mouseleave', scheduleDesktopClose);
  });

  desktopMenu?.addEventListener('mouseenter', () => window.clearTimeout(closeDesktopTimer));
  desktopMenu?.addEventListener('mouseleave', scheduleDesktopClose);

  document.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Node) || header?.contains(event.target)) return;
    closeDesktopMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDesktopMenu();
    closeMenu();
    lenis?.start();
    toggle?.focus();
  });

  window.addEventListener('resize', () => {
    if (activeDesktopKey) openDesktopMenu(activeDesktopKey);
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

function isRoutableLink(link) {
  if (!(link instanceof HTMLAnchorElement)) return false;
  if (link.target || link.hasAttribute('download')) return false;
  if (!link.href || link.protocol !== window.location.protocol || link.origin !== window.location.origin) return false;
  if (link.pathname === window.location.pathname && link.hash) return false;
  return link.pathname.startsWith('/eastman/');
}

async function loadPage(url, { push = true } = {}) {
  const response = await fetch(url, { headers: { 'X-Requested-With': 'fetch' } });
  if (!response.ok) throw new Error(`Unable to load ${url}`);

  const html = await response.text();
  const nextDoc = new DOMParser().parseFromString(html, 'text/html');
  const nextMain = nextDoc.querySelector('main');
  const currentMain = document.querySelector('main');
  if (!nextMain || !currentMain) {
    window.location.href = url;
    return;
  }

  currentMain.replaceWith(nextMain);
  document.title = nextDoc.title || document.title;
  document.body.className = nextDoc.body.className;
  closeMenu();
  closeDesktopMenu();

  if (push) window.history.pushState({}, document.title, url);
  setupDynamicContent();

  const target = window.location.hash ? document.querySelector(window.location.hash) : null;
  if (target) lenis?.scrollTo(target, { offset: -(header?.offsetHeight || 0), immediate: true });
  else lenis?.scrollTo(0, { immediate: true });
}

function setupPageTransitions() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a');
    if (!isRoutableLink(link)) return;

    event.preventDefault();
    loadPage(link.href).catch(() => {
      window.location.href = link.href;
    });
  });

  window.addEventListener('popstate', () => {
    loadPage(window.location.href, { push: false }).catch(() => window.location.reload());
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

function positionFloatingSolutionLabel() {
  if (!activeSolutionCard || !floatingSolutionLabel) return;

  const label = activeSolutionCard.querySelector('.solution-label');
  if (!label) return;

  const rect = activeSolutionCard.getBoundingClientRect();
  const isWide = activeSolutionCard.classList.contains('wide');
  floatingSolutionLabel.textContent = label.textContent || '';
  floatingSolutionLabel.style.left = `${rect.left + rect.width / 2}px`;
  floatingSolutionLabel.style.top = `${isWide ? rect.bottom + 50 : rect.top - 35}px`;
}

function hideFloatingSolutionLabel() {
  floatingSolutionLabel?.classList.remove('is-visible');
  activeSolutionCard = undefined;
}

function showFloatingSolutionLabel(card) {
  if (!window.matchMedia('(min-width: 821px)').matches) return;

  if (!floatingSolutionLabel) {
    floatingSolutionLabel = document.createElement('span');
    floatingSolutionLabel.className = 'floating-solution-label';
    document.body.appendChild(floatingSolutionLabel);
  }

  activeSolutionCard = card;
  positionFloatingSolutionLabel();
  requestAnimationFrame(() => floatingSolutionLabel?.classList.add('is-visible'));
}

function setupSolutionLabels() {
  const solutionCards = [...document.querySelectorAll('.solution-card')];
  solutionCards.forEach((card) => {
    card.addEventListener('mouseenter', () => showFloatingSolutionLabel(card));
    card.addEventListener('focusin', () => showFloatingSolutionLabel(card));
    card.addEventListener('mouseleave', hideFloatingSolutionLabel);
    card.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
      hideFloatingSolutionLabel();
    });
  });

  window.addEventListener('resize', positionFloatingSolutionLabel);
  window.addEventListener('scroll', positionFloatingSolutionLabel, { passive: true });
}

function setupDynamicContent() {
  setupSolutionLabels();
  setupSectionReveals();
  setupCounters();
  setHeaderState();
}

function setupPage() {
  setupLenis();
  setupMenu();
  setupDesktopMenu();
  setupAnchorScroll();
  setupPageTransitions();
  setupDynamicContent();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

setupPage();
