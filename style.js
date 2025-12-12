// style.js - adds dynamic behaviour: smooth scroll, reveal-on-scroll, theme toggle

// Smooth scrolling for in-page links
document.addEventListener('click', function (e) {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href.startsWith('#') && href.length > 1) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update hash without jumping
      history.replaceState(null, '', href);
    }
  }
});

// Reveal on scroll using IntersectionObserver
(function () {
  const sections = document.querySelectorAll('.content-section');
  if (!('IntersectionObserver' in window)) {
    // fallback: show all
    sections.forEach(s => s.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // optionally unobserve to save work
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(s => io.observe(s));
})();

// Theme toggle (light/dark) persisted to localStorage
(function () {
  const key = 'site-theme';
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀';
    } else {
      root.removeAttribute('data-theme');
      toggle.textContent = '🌙';
    }
  }

  // initialize
  const saved = localStorage.getItem(key) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(key, next);
    });
  }
})();

// Optional: small accessibility improvement - focus visible outline for keyboard users
document.addEventListener('keydown', function (e) {
  if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
});

// Expose a simple API for debugging (optional)
window.__portfolio = {
  revealNow: () => document.querySelectorAll('.content-section').forEach(s => s.classList.add('in-view'))
};

// Header scroll styling: add/remove .scrolled on the top nav
(function () {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // initialize
  onScroll();
})();

// Scrollspy: highlight nav link for section in view
(function () {
  const sections = document.querySelectorAll('main .content-section[id]');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  if (!sections.length || !navLinks.length) return;

  const idToLink = {};
  navLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) idToLink[href.slice(1)] = a;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // remove active from all
        navLinks.forEach(l => l.classList.remove('active'));
        const link = idToLink[id];
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.56 });

  sections.forEach(s => observer.observe(s));
})();
