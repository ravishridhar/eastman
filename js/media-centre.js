function setupLatestNewsSlider(root) {
  const track = root.querySelector('.media-latest-grid');
  if (!track) return;
  const slides = [...track.children];
  if (slides.length < 2) return;
  track.id = 'latest-news-slider';
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Latest News slides');
  const region = track.closest('.media-latest');
  region.setAttribute('aria-roledescription', 'carousel');
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
  });

  const controls = document.createElement('div');
  controls.className = 'media-slider-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  const dots = document.createElement('div');
  previous.type = next.type = 'button';
  previous.className = next.className = 'media-slider-arrow';
  const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M12 5l7 7-7 7" /></svg>';
  previous.innerHTML = arrowSvg;
  next.innerHTML = arrowSvg;
  previous.classList.add('media-slider-arrow--previous');
  previous.setAttribute('aria-label', 'Previous news slide');
  next.setAttribute('aria-label', 'Next news slide');
  previous.setAttribute('aria-controls', track.id);
  next.setAttribute('aria-controls', track.id);
  dots.className = 'media-slider-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Choose news slide');
  controls.append(previous, dots, next);
  track.after(controls);
  let stops = [];
  let active = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function move(index) {
    track.scrollTo({ left: stops[Math.max(0, Math.min(index, stops.length - 1))], behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  function sync() {
    active = stops.reduce((best, value, index) => Math.abs(value - track.scrollLeft) < Math.abs(stops[best] - track.scrollLeft) ? index : best, 0);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    [...dots.children].forEach((dot, index) => {
      if (index === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function resize() {
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    stops = [...new Set([0, ...slides.map((slide) => Math.min(max, slide.offsetLeft - slides[0].offsetLeft))].map((value) => Math.round(value)))];
    dots.replaceChildren();
    stops.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `News position ${index + 1}`);
      dot.setAttribute('aria-controls', track.id);
      dot.addEventListener('click', () => move(index));
      dots.append(dot);
    });
    controls.hidden = max <= 2;
    sync();
  }

  previous.addEventListener('click', () => move(active - 1));
  next.addEventListener('click', () => move(active + 1));
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'Home' ? 0 : event.key === 'End' ? stops.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
  });
  const observer = new ResizeObserver(() => {
    if (!track.isConnected) observer.disconnect();
    else resize();
  });
  observer.observe(track);
  resize();
}

export function setupMediaCentre() {
  const root = document.querySelector('[data-media-centre]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  setupLatestNewsSlider(root);
  const tabs = [...root.querySelectorAll('[data-media-tab]')];
  const panels = [...root.querySelectorAll('[data-media-panel]')];
  const pageSize = 12;
  root.querySelector('[role="tablist"]').hidden = false;
  root.querySelector('.media-library')?.classList.add('media-library--compact');

  panels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${panel.id}-tab`);
    const cards = [...panel.querySelectorAll('[data-media-card]')];
    const publisher = panel.querySelector('[data-media-publisher]');
    const period = panel.querySelector('[data-media-period]');
    const more = panel.querySelector('[data-media-more]');
    const status = panel.querySelector('[data-media-results]');
    if (publisher) publisher.options[0].textContent = 'Media House';
    period.options[0].textContent = 'All Dates';
    let limit = pageSize;

    function render() {
      const days = Number(period.value);
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - days);
      const matching = cards.filter((card) => {
        const matchesPublisher = !publisher?.value || publisher.value === card.dataset.publisher;
        const date = new Date(card.dataset.date);
        return matchesPublisher && (!days || (!Number.isNaN(date.getTime()) && date >= cutoff));
      });
      const visible = new Set(matching.slice(0, limit));
      cards.forEach((card) => { card.hidden = !visible.has(card); });
      more.hidden = limit >= matching.length;
      status.hidden = false;
      status.textContent = matching.length
        ? `Showing ${Math.min(limit, matching.length)} of ${matching.length}`
        : 'No items match the selected filters.';
    }

    [publisher, period].filter(Boolean).forEach((select) => {
      select.addEventListener('change', () => { limit = pageSize; render(); });
    });
    more.addEventListener('click', () => { limit += pageSize; render(); });
    render();
  });

  function activate(slug) {
    const selected = tabs.find((tab) => tab.dataset.mediaTab === slug) || tabs[0];
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.mediaPanel !== selected.dataset.mediaTab; });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { activate(tab.dataset.mediaTab); });
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next].dataset.mediaTab);
      tabs[next].focus();
    });
  });
  activate(window.location.hash.replace(/^#(?:media-)?/, ''));
}
