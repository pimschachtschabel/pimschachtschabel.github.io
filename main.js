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

  // --- Scroll reveal: focus pull ---
  // Browsers with scroll-driven animation handle this in CSS, off the main
  // thread, and scrub focus with the scroll position. Only when that is
  // unavailable do we opt into the JS path by setting .js-reveal, which is
  // what switches the blur on at all; without it everything rests sharp.
  (function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()')) return;
    if (!('IntersectionObserver' in window)) return;

    document.body.classList.add('js-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(reveals, function (el) {
      observer.observe(el);
    });
  })();

  // --- Pointer-lit grid ---
  // The drafting grid brightens only under the pointer, so the structure of
  // the page is visible where attention is and nowhere else. Coordinates go
  // in as custom properties and the mask does the rest in CSS; one rAF per
  // frame at most, and nothing runs on touch or under reduced motion.
  (function initLitGrid() {
    var bands = document.querySelectorAll('.band--grid');
    if (!bands.length) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    Array.prototype.forEach.call(bands, function (band) {
      var queued = false, px = 0, py = 0;

      band.addEventListener('pointermove', function (e) {
        var r = band.getBoundingClientRect();
        px = e.clientX - r.left;
        py = e.clientY - r.top;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          band.style.setProperty('--px', px + 'px');
          band.style.setProperty('--py', py + 'px');
          band.classList.add('is-lit');
          queued = false;
        });
      }, { passive: true });

      band.addEventListener('pointerleave', function () {
        band.classList.remove('is-lit');
      });
    });
  })();
})();
