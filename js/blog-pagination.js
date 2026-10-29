export function setupBlogPagination() {
const grid = document.querySelector('.blog-grid');

if (grid && !grid.dataset.paginationReady) {
  grid.dataset.paginationReady = 'true';
  const cards = [...grid.querySelectorAll('.blog-card')];
  const pageSize = 9;
  const pageCount = Math.ceil(cards.length / pageSize);
  const summary = document.createElement('p');
  summary.className = 'blog-pagination-summary';
  summary.setAttribute('role', 'status');
  const navigation = document.createElement('nav');
  navigation.className = 'blog-pagination';
  navigation.setAttribute('aria-label', 'Blog pagination');
  grid.after(summary, navigation);

  function renderPage() {
    const requested = Number(new URL(window.location.href).searchParams.get('page'));
    const page = Number.isInteger(requested) && requested > 0
      ? Math.min(requested, Math.max(pageCount, 1)) : 1;
    const start = (page - 1) * pageSize;
    cards.forEach((card, index) => { card.hidden = index < start || index >= start + pageSize; });
    summary.textContent = cards.length
      ? `Showing ${start + 1}–${Math.min(start + pageSize, cards.length)} of ${cards.length} articles`
      : 'No articles available.';
    navigation.replaceChildren();
    navigation.hidden = pageCount <= 1;

    function addLink(label, target, { disabled = false, current = false } = {}) {
      const element = document.createElement(disabled ? 'span' : 'a');
      element.textContent = label;
      if (disabled) element.setAttribute('aria-disabled', 'true');
      else {
        const url = new URL(window.location.href);
        if (target === 1) url.searchParams.delete('page');
        else url.searchParams.set('page', String(target));
        element.href = url.href;
        if (current) element.setAttribute('aria-current', 'page');
        if (/^\d+$/.test(label)) element.setAttribute('aria-label', `Page ${target}`);
      }
      navigation.append(element);
    }

    addLink('Previous', page - 1, { disabled: page === 1 });
    for (let number = 1; number <= pageCount; number++) {
      addLink(String(number), number, { current: number === page });
    }
    addLink('Next', page + 1, { disabled: page === pageCount });
  }

  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, '', link.href);
    renderPage();
    const heading = document.querySelector('.blog-content h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  });

  renderPage();
}
}
