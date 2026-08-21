import Lenis from 'lenis';
import { setupLayout } from './layout.js';

setupLayout();

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

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
  window.clearTimeout(closeDesktopTimer);
  closeDesktopTimer = window.setTimeout(closeDesktopMenu, 260);
}

function setupDesktopMenu() {
  desktopTriggers.forEach((trigger) => {
    const key = trigger.dataset.desktopTrigger;
    trigger.addEventListener('mouseenter', () => openDesktopMenu(key));
    trigger.addEventListener('focus', () => openDesktopMenu(key));
    trigger.addEventListener('click', () => {
      if (trigger.dataset.navHref) {
        window.location.href = trigger.dataset.navHref;
        return;
      }
      if (trigger.getAttribute('aria-expanded') === 'true') closeDesktopMenu();
      else openDesktopMenu(key);
    });
  });

  header?.addEventListener('mouseenter', () => window.clearTimeout(closeDesktopTimer));
  header?.addEventListener('mouseleave', scheduleDesktopClose);
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

function getAnchorOffset() {
  if (!header) return 0;
  if (window.matchMedia('(min-width: 821px)').matches) return -86;
  return -header.offsetHeight;
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
    lenis?.scrollTo(target, { offset: getAnchorOffset() });
  });
}

function isRoutableLink(link) {
  if (!(link instanceof HTMLAnchorElement)) return false;
  if (link.target || link.hasAttribute('download')) return false;
  if (!link.href || link.protocol !== window.location.protocol || link.origin !== window.location.origin) return false;
  if (link.pathname === window.location.pathname && link.hash) return false;

  const pageName = link.pathname.replace(/\/$/, '').split('/').pop() || '';
  return [
    '',
    'about-us',
    'eapl-in-numbers',
    'corporate-history',
    'corporate-governance',
    'leadership-team',
    'policies',
    'disclosures',
    'our-businesses',
    'last-mile-e-mobility-solutions',
    'residential-solar-with-storage',
    'continued-energy-solutions',
    'advanced-electronics-manufacturing',
    'partner-with-us',
    'contact-us',
    'manufacturing-infrastructure',
    'lithium-batteries',
    'power-electronics',
    'solar-panels',
    'conventional-tubular-batteries',
    'life-at-eastman',
    'shareholders-information',
    'terms-and-conditions',
  ].includes(pageName);
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
  if (target) lenis?.scrollTo(target, { offset: getAnchorOffset(), immediate: true });
  else {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }
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

function formatCounter(value, decimals, suffix, prefix = '', pad = 0, wrapSuffix = false) {
  let formatted = value.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  if (pad > 0 && decimals === 0) {
    formatted = formatted.padStart(pad, '0');
  }

  if (suffix === 'GWh') {
    return `${prefix}${formatted}<span>GWh</span>`;
  }

  return `${prefix}${formatted}${wrapSuffix && suffix ? ` <span>${suffix}</span>` : suffix}`;
}

function animateCounter(counter) {
  if (counter.dataset.animated === 'true') return;
  counter.dataset.animated = 'true';

  const target = Number(counter.dataset.value || 0);
  const decimals = Number(counter.dataset.decimals || 0);
  const suffix = counter.dataset.suffix || '';
  const prefix = counter.dataset.prefix || '';
  const pad = Number(counter.dataset.pad || 0);
  const wrapSuffix = counter.hasAttribute('data-wrap-suffix');
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    counter.innerHTML = formatCounter(current, decimals, suffix, prefix, pad, wrapSuffix);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.innerHTML = formatCounter(target, decimals, suffix, prefix, pad, wrapSuffix);
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
      counter.dataset.animated = 'false';
      counter.innerHTML = formatCounter(
        0,
        Number(counter.dataset.decimals || 0),
        counter.dataset.suffix || '',
        counter.dataset.prefix || '',
        Number(counter.dataset.pad || 0),
        counter.hasAttribute('data-wrap-suffix'),
      );
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

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    section.classList.add('reveal-section');

    if (isInitiallyVisible) {
      section.classList.add('is-visible');
      return;
    }

    observer.observe(section);
  });
}

function positionFloatingSolutionLabel() {
  if (!activeSolutionCard || !floatingSolutionLabel) return;

  const label = activeSolutionCard.querySelector('.solution-label');
  if (!label) return;

  const rect = activeSolutionCard.getBoundingClientRect();
  const isWide = activeSolutionCard.classList.contains('wide');
  floatingSolutionLabel.textContent = label.textContent || '';
  floatingSolutionLabel.style.left = `${rect.left + rect.width / 2}px`;
  floatingSolutionLabel.style.top = `${isWide ? rect.bottom + 34 : rect.top - 24}px`;
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

function setupPartnerVideoSlider() {
  const slider = document.querySelector('[data-partner-video-slider]');
  const track = slider?.querySelector('[data-partner-video-track]');
  const previous = slider?.querySelector('[data-partner-video-prev]');
  const next = slider?.querySelector('[data-partner-video-next]');
  if (!track || !previous || !next) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector('.partner-video-card');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  previous.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
}

function setupSnapshotSliders() {
  document.querySelectorAll('.manufacturing-snapshots .snapshot-grid').forEach((track, sliderIndex) => {
    if (track.dataset.sliderReady === 'true') return;
    track.dataset.sliderReady = 'true';

    const slider = document.createElement('div');
    const headingRow = document.createElement('div');
    const controls = document.createElement('div');
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const section = track.closest('.manufacturing-snapshots');
    const heading = section?.querySelector('h2');
    const title = heading?.textContent.trim() || 'Plant snapshots';

    slider.className = 'snapshot-slider';
    headingRow.className = 'snapshot-slider__heading';
    controls.className = 'snapshot-slider__controls';
    previous.className = 'snapshot-slider__arrow snapshot-slider__arrow--previous';
    next.className = 'snapshot-slider__arrow snapshot-slider__arrow--next';
    previous.type = 'button';
    next.type = 'button';
    previous.setAttribute('aria-label', `Previous ${title}`);
    next.setAttribute('aria-label', `Next ${title}`);
    previous.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7"/></svg>';
    next.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></svg>';
    track.id = track.id || `snapshot-slider-${sliderIndex + 1}`;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', title);
    track.setAttribute('tabindex', '0');
    previous.setAttribute('aria-controls', track.id);
    next.setAttribute('aria-controls', track.id);

    if (heading) {
      heading.parentNode.insertBefore(headingRow, heading);
      headingRow.append(heading, controls);
    }
    track.parentNode.insertBefore(slider, track);
    slider.append(track);
    controls.append(previous, next);

    const scrollBySlide = (direction) => {
      const slide = track.querySelector('img');
      if (!slide) return;
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      track.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };

    const updateArrows = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      controls.classList.toggle('is-hidden', maxScroll <= 2);
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll - 2;
    };

    previous.addEventListener('click', () => scrollBySlide(-1));
    next.addEventListener('click', () => scrollBySlide(1));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    let dragStartX = 0;
    let dragStartScroll = 0;
    let isDragging = false;
    let didDrag = false;

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      isDragging = true;
      didDrag = false;
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const distance = event.clientX - dragStartX;
      if (Math.abs(distance) > 5) didDrag = true;
      track.scrollLeft = dragStartScroll - distance;
    });
    const stopDragging = (event) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
    };
    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('dragstart', (event) => event.preventDefault());

    const images = [...track.querySelectorAll('img')];
    const dialog = document.createElement('dialog');
    const dialogImage = document.createElement('img');
    const close = document.createElement('button');
    const lightboxPrevious = document.createElement('button');
    const lightboxNext = document.createElement('button');
    const zoomControls = document.createElement('div');
    const zoomOut = document.createElement('button');
    const zoomReset = document.createElement('button');
    const zoomIn = document.createElement('button');
    let activeIndex = 0;
    let zoomLevel = 1;

    dialog.className = 'snapshot-lightbox';
    dialog.setAttribute('aria-label', `${title} image viewer`);
    dialogImage.className = 'snapshot-lightbox__image';
    close.className = 'snapshot-lightbox__close';
    lightboxPrevious.className = 'snapshot-lightbox__nav snapshot-lightbox__nav--previous';
    lightboxNext.className = 'snapshot-lightbox__nav snapshot-lightbox__nav--next';
    zoomControls.className = 'snapshot-lightbox__zoom';
    zoomOut.className = zoomReset.className = zoomIn.className = 'snapshot-lightbox__zoom-button';
    close.type = lightboxPrevious.type = lightboxNext.type = zoomOut.type = zoomReset.type = zoomIn.type = 'button';
    close.setAttribute('aria-label', 'Close image viewer');
    lightboxPrevious.setAttribute('aria-label', 'Previous image');
    lightboxNext.setAttribute('aria-label', 'Next image');
    zoomOut.setAttribute('aria-label', 'Zoom out');
    zoomReset.setAttribute('aria-label', 'Reset zoom');
    zoomIn.setAttribute('aria-label', 'Zoom in');
    close.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    lightboxPrevious.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7"/></svg>';
    lightboxNext.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 5 7 7-7 7"/></svg>';
    zoomOut.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M7.5 10.5h6"/></svg>';
    zoomReset.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5"/></svg>';
    zoomIn.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M7.5 10.5h6M10.5 7.5v6"/></svg>';
    zoomControls.append(zoomOut, zoomReset, zoomIn);
    dialog.append(dialogImage, close, lightboxPrevious, lightboxNext, zoomControls);
    document.body.append(dialog);

    const showLightboxImage = (index) => {
      activeIndex = (index + images.length) % images.length;
      dialogImage.src = images[activeIndex].currentSrc || images[activeIndex].src;
      dialogImage.alt = images[activeIndex].alt;
      setZoom(1);
    };

    const setZoom = (value) => {
      zoomLevel = Math.min(4, Math.max(1, value));
      dialogImage.style.transform = `scale(${zoomLevel})`;
      zoomOut.disabled = zoomLevel <= 1;
      zoomIn.disabled = zoomLevel >= 4;
    };

    images.forEach((image, index) => {
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `${image.alt}. Open larger image`);
      const openLightbox = () => {
        if (didDrag) {
          didDrag = false;
          return;
        }
        showLightboxImage(index);
        dialog.showModal();
        document.body.classList.add('has-open-dialog');
      };
      image.addEventListener('click', openLightbox);
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    const closeLightbox = () => {
      dialog.close();
      document.body.classList.remove('has-open-dialog');
    };
    close.addEventListener('click', closeLightbox);
    lightboxPrevious.addEventListener('click', () => showLightboxImage(activeIndex - 1));
    lightboxNext.addEventListener('click', () => showLightboxImage(activeIndex + 1));
    zoomOut.addEventListener('click', () => setZoom(zoomLevel - 0.5));
    zoomReset.addEventListener('click', () => setZoom(1));
    zoomIn.addEventListener('click', () => setZoom(zoomLevel + 0.5));
    dialogImage.addEventListener('dblclick', () => setZoom(zoomLevel > 1 ? 1 : 2));
    dialogImage.addEventListener('wheel', (event) => {
      event.preventDefault();
      setZoom(zoomLevel + (event.deltaY < 0 ? 0.25 : -0.25));
    }, { passive: false });
    dialog.addEventListener('cancel', () => document.body.classList.remove('has-open-dialog'));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeLightbox();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showLightboxImage(activeIndex - 1);
      if (event.key === 'ArrowRight') showLightboxImage(activeIndex + 1);
    });
  });
}

function setupDirectorDialog() {
  const dialogs = [...document.querySelectorAll('[data-director-dialog]')];
  const profileDialogs = new Map();
  const profileBase = document.body.dataset.profileBase;

  const setProfileUrl = (slug = '') => {
    if (!profileBase) return;
    const nextPath = slug ? `/${profileBase}/${slug}` : `/${profileBase}`;
    if (window.location.pathname.replace(/\/$/, '') !== nextPath) {
      window.history.pushState({ leadershipProfile: slug || null }, '', nextPath);
    }
  };

  dialogs.forEach((dialog) => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    const dialogId = dialog.dataset.directorDialog;
    const openButton = document.querySelector(`[data-director-open="${dialogId}"]`);
    const closeButton = dialog.querySelector('[data-director-close]');
    const positions = dialog.querySelector('.director-positions');
    const positionsSummary = positions?.querySelector('summary');
    const profileSlug = dialog.dataset.profileSlug;
    if (!openButton || !closeButton) return;
    if (profileSlug) profileDialogs.set(profileSlug, dialog);

    const closeDialog = ({ updateUrl = true } = {}) => {
      if (dialog.open) dialog.close();
      document.body.classList.remove('has-open-dialog');
      if (updateUrl && profileSlug) {
        if (window.history.state?.leadershipProfile === profileSlug) {
          window.history.back();
        } else {
          window.history.replaceState({}, '', `/${profileBase}`);
        }
      }
    };

    openButton.addEventListener('click', () => {
      dialogs.forEach((otherDialog) => {
        if (otherDialog !== dialog && otherDialog.open) otherDialog.close();
      });
      dialog.showModal();
      document.body.classList.add('has-open-dialog');
      if (profileSlug) setProfileUrl(profileSlug);
    });
    closeButton.addEventListener('click', closeDialog);
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    positionsSummary?.addEventListener('click', (event) => {
      event.preventDefault();
      if (!(positions instanceof HTMLDetailsElement)) return;

      if (positions.open) {
        positions.classList.remove('is-open');
        window.setTimeout(() => {
          positions.open = false;
        }, 360);
        return;
      }

      positions.open = true;
      requestAnimationFrame(() => positions.classList.add('is-open'));
    });
  });

  if (profileDialogs.size) {
    const syncProfileDialog = () => {
      const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
      const slug = pathParts[0] === '' && pathParts[1] === profileBase ? pathParts[2] : '';
      const targetDialog = slug ? profileDialogs.get(slug) : null;

      profileDialogs.forEach((dialog) => {
        if (dialog !== targetDialog && dialog.open) dialog.close();
      });

      if (targetDialog && !targetDialog.open) targetDialog.showModal();
      document.body.classList.toggle('has-open-dialog', Boolean(targetDialog));
    };

    syncProfileDialog();
    window.addEventListener('popstate', syncProfileDialog);
  }
}

function setupDirectorCardActions() {
  document.querySelectorAll('.profile-card--board').forEach((card) => {
    const action = card.querySelector('[data-director-open]');
    if (!action) return;

    card.addEventListener('click', (event) => {
      if (event.target instanceof Node && action.contains(event.target)) return;
      action.click();
    });
  });
}

let cleanupHistoryTimeline = null;

function setupHistoryTimeline() {
  cleanupHistoryTimeline?.();
  cleanupHistoryTimeline = null;

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

  cleanupHistoryTimeline = () => {
    revealObserver.disconnect();
    window.removeEventListener('scroll', requestProgressUpdate);
    window.removeEventListener('resize', requestProgressUpdate);
  };
}

function setupDynamicContent() {
  setupSolutionLabels();
  setupPartnerVideoSlider();
  setupSnapshotSliders();
  setupDirectorDialog();
  setupDirectorCardActions();
  setupHistoryTimeline();
  setupSectionReveals();
  setupCounters();
  setHeaderState();
}

function setupPage() {
  setupLenis();
  setupMenu();
  setupDesktopMenu();
  setupAnchorScroll();
  setupDynamicContent();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

setupPage();
