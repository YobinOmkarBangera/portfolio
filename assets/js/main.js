/* =====================================================
   MAIN SCRIPT
   1. Theme toggle (light / dark)
   2. Mobile menu
   3. Header border on scroll
   4. Scroll reveal animations
   5. Highlight the current section in the nav
   6. Footer year

   No libraries, no inline scripts, and nothing is ever
   written into the page as HTML, which keeps the strict
   Content-Security-Policy in vercel.json intact.
===================================================== */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 1. Theme toggle ---------- */

  var themeToggle = document.getElementById('themeToggle');
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#0b1020');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        /* Storage unavailable: the choice just won't be remembered. */
      }
    });
  }

  /* ---------- 2. Mobile menu ---------- */

  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');

  function setMenu(open) {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    /* Close after choosing a link, on Escape, or on a click outside. */
    siteNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.site-header')) setMenu(false);
    });
  }

  /* ---------- 3. Header border on scroll ---------- */

  var header = document.getElementById('siteHeader');

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- 4. Scroll reveal ---------- */

  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (item) {
      /* Anything already on screen at load shows straight away;
         everything further down waits until it is scrolled to. */
      if (item.getBoundingClientRect().top < window.innerHeight) {
        item.classList.add('is-visible');
      } else {
        revealObserver.observe(item);
      }
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ---------- 5. Current section in the nav ---------- */

  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  var linkBySection = {};

  navLinks.forEach(function (link) {
    linkBySection[link.getAttribute('href').slice(1)] = link;
  });

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        });
        var active = linkBySection[entry.target.id];
        if (active) {
          active.classList.add('is-active');
          active.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- 6. Footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
