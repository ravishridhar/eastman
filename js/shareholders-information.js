import './main.js';

document.querySelectorAll('[data-year-filter]').forEach((select) => {
  const section = select.closest('.shareholder-section');
  select.addEventListener('change', () => {
    section.querySelectorAll('[data-year]').forEach((row) => {
      row.hidden = select.value !== 'all' && row.dataset.year !== select.value;
    });
  });
});
