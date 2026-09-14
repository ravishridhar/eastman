import './main.js';

document.querySelectorAll('[data-year-filter]').forEach((select) => {
  const section = select.closest('[data-document-group]');
  select.addEventListener('change', () => {
    section.querySelectorAll('[data-year]').forEach((row) => {
      row.hidden = select.value !== 'all' && row.dataset.year !== select.value;
    });
  });
});

function setupTabs(selector) {
  const tabs = [...document.querySelectorAll(selector)];
  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(next, true);
    });
  });
  return (direction) => {
    const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    activate((current + direction + tabs.length) % tabs.length);
  };
}

setupTabs('[data-main-tab]');
const stepMeetingTab = setupTabs('[data-meeting-tab]');
document.querySelectorAll('[data-tab-step]').forEach((button) => {
  button.addEventListener('click', () => stepMeetingTab(Number(button.dataset.tabStep)));
});
