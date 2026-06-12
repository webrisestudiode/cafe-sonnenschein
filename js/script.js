/* ============================================================
   Café Sonnenschein — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. URL Parameter Replacements
     - ?stadt=  → replaces "Berlin" in visible text nodes
     - ?firma=  → replaces "Café Sonnenschein" in text nodes
  ---------------------------------------------------------- */
  function replaceTextInNode(node, search, replace) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.includes(search)) {
        node.nodeValue = node.nodeValue.split(search).join(replace);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(node.tagName)
    ) {
      node.childNodes.forEach(function (child) {
        replaceTextInNode(child, search, replace);
      });
    }
  }

  function applyUrlReplacements() {
    var params = new URLSearchParams(window.location.search);
    var stadt = params.get('stadt');
    var firma = params.get('firma');

    if (stadt) {
      replaceTextInNode(document.body, 'Berlin', decodeURIComponent(stadt));
    }
    if (firma) {
      replaceTextInNode(document.body, 'Café Sonnenschein', decodeURIComponent(firma));
    }
  }

  /* ----------------------------------------------------------
     2. Mobile Navigation Toggle
  ---------------------------------------------------------- */
  function initMobileNav() {
    var hamburger = document.querySelector('.nav-hamburger');
    var mobileNav = document.querySelector('.nav-mobile');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('is-open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     3. Active Nav Link Highlight
  ---------------------------------------------------------- */
  function setActiveNavLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     4. Scroll Reveal Animation
  ---------------------------------------------------------- */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ----------------------------------------------------------
     5. Cookie Banner (GDPR)
  ---------------------------------------------------------- */
  function initCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    var btn    = document.getElementById('cookie-accept');

    if (!banner || !btn) return;

    // Check if already accepted
    if (localStorage.getItem('cs_cookies_accepted') === '1') {
      banner.remove();
      return;
    }

    banner.style.display = 'flex';

    btn.addEventListener('click', function () {
      localStorage.setItem('cs_cookies_accepted', '1');
      banner.style.transition = 'transform .35s ease, opacity .35s ease';
      banner.style.transform  = 'translateY(100%)';
      banner.style.opacity    = '0';
      setTimeout(function () { banner.remove(); }, 380);
    });
  }

  /* ----------------------------------------------------------
     6. Smooth Header Shadow on Scroll
  ---------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(28,15,10,.1)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     7. Contact Form — simulated submit (no backend)
  ---------------------------------------------------------- */
  function initContactForm() {
    var form    = document.getElementById('contact-form');
    var success = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Wird gesendet…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        submitBtn.textContent = 'Nachricht senden';
        submitBtn.disabled = false;
        if (success) {
          success.classList.add('visible');
          setTimeout(function () { success.classList.remove('visible'); }, 5000);
        }
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     8. Menu Tab Navigation (karte.html)
  ---------------------------------------------------------- */
  function initMenuTabs() {
    var tabs = document.querySelectorAll('.menu-tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = tab.getAttribute('data-target');
        var targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        // Update active tab
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        // Smooth scroll to section (account for sticky header + menu nav)
        var offset = 140;
        var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    // Highlight tab on scroll
    var sections = document.querySelectorAll('.menu-section[id]');
    if (!sections.length) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 160;
      sections.forEach(function (section) {
        if (
          section.offsetTop <= scrollY &&
          section.offsetTop + section.offsetHeight > scrollY
        ) {
          tabs.forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-target') === section.id);
          });
        }
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9. Init All
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    setActiveNavLink();
    initScrollReveal();
    initCookieBanner();
    initHeaderScroll();
    initContactForm();
    initMenuTabs();
    applyUrlReplacements();
  });

})();


// Banner unter der Navbar positionieren – damit Hamburger immer erreichbar ist
(function () {
  function fixBannerPosition() {
    var banner = document.getElementById('personalized-banner');
    if (!banner) return;
    var isVisible = banner.style.display !== 'none' && banner.offsetHeight > 0;
    if (!isVisible) return;
    var navbar = document.querySelector('.site-header, nav.navbar, header.header, .header');
    if (!navbar) return;
    var navH = navbar.offsetHeight || 60;
    banner.style.top = navH + 'px';
    banner.style.position = 'fixed';
    banner.style.zIndex = '99998';
    // Spacer anpassen damit Inhalt nicht verdeckt wird
    var spacer = document.getElementById('ws-banner-spacer');
    if (spacer) {
      spacer.style.height = (navH + banner.offsetHeight) + 'px';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixBannerPosition);
  } else {
    fixBannerPosition();
  }
})();