(() => {
  const footer = document.querySelector('[data-arcade-footer]');
  if (!footer) return;

  const actTitle = footer.getAttribute('data-act-title') || '';
  footer.textContent = actTitle
    ? `Amazing Grace Home Living · Nexus Arcade · ${actTitle}`
    : 'Amazing Grace Home Living · Nexus Arcade';
})();
