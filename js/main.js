// === Mobile Nav Toggle ===
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(d => {
      d.querySelector('.dropdown-toggle')?.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          d.classList.toggle('open');
        }
      });
    });

    // Close nav when clicking a link on mobile
    links.querySelectorAll('a:not(.dropdown-toggle)').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 768) links.classList.remove('open');
      });
    });
  }
});
