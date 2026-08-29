(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  // --- Mobile menu ---
  var hamburger = document.querySelector('.nav__hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // --- Nav background on scroll ---
  var nav = document.querySelector('.nav');
  if (nav) {
    var ticking = false;
    var syncNav = function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        syncNav();
        ticking = false;
      });
    }, { passive: true });
    syncNav(); // correct state on load / restored scroll position
  }

  // --- Scroll reveal ---
  // One observer for the whole page; each element is unobserved once revealed.
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var showAll = function () {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add('is-visible');
    });
  };

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  Array.prototype.forEach.call(reveals, function (el) {
    observer.observe(el);
  });
})();
