export function setupVideoLibrary() {
  const root = document.querySelector('[data-video-library]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const tabs = [...root.querySelectorAll('[data-video-tab]')];
  const panels = [...root.querySelectorAll('[data-video-panel]')];
  root.querySelector('[role="tablist"]').hidden = false;

  function activate(key) {
    const selected = tabs.find((tab) => tab.dataset.videoTab === key) || tabs[0];
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.videoPanel !== selected.dataset.videoTab;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `${panel.id}-tab`);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.videoTab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next].dataset.videoTab);
      tabs[next].focus();
    });
  });
  activate(window.location.hash.replace(/^#(?:video-)?/, ''));

  const dialog = root.querySelector('[data-video-dialog]');
  const frame = root.querySelector('[data-video-frame]');
  const title = root.querySelector('#video-player-title');
  const watch = root.querySelector('[data-video-watch]');
  let trigger;

  root.addEventListener('click', (event) => {
    const link = event.target.closest('[data-video-play]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    const url = new URL(link.dataset.videoEmbed);
    if (url.hostname !== 'www.youtube.com' || !/^\/embed\/[\w-]{11}$/.test(url.pathname)) return;
    url.searchParams.set('autoplay', '1');
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = link.dataset.videoTitle;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(iframe);
    title.textContent = link.dataset.videoTitle;
    watch.href = link.href;
    trigger = link;
    dialog.showModal();
    document.body.classList.add('video-player-open');
  });
  root.querySelector('[data-video-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    frame.replaceChildren();
    document.body.classList.remove('video-player-open');
    trigger?.focus({ preventScroll: true });
  });
}
