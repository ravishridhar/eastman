import './main.js';

document.querySelectorAll('.social-platform[data-social-url]').forEach((platform) => {
  const url = platform.dataset.socialUrl;
  platform.querySelectorAll('.social-view').forEach((link) => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
});
