(function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav') || document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (window.matchMedia('(max-width: 767px)').matches) {
        if (open) {
          nav.classList.remove('hidden');
          nav.classList.add('flex');
        } else {
          nav.classList.add('hidden');
          nav.classList.remove('flex');
        }
      }
    });
  }

  function formatCount(value, el) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var formatted = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    if (el.getAttribute('data-comma') === 'true') {
      formatted = Number(formatted).toLocaleString('en-US');
    }
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    return prefix + formatted + suffix;
  }

  function setFinalCount(el) {
    var target = parseFloat(el.getAttribute('data-target'), 10);
    el.textContent = formatCount(target, el);
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target'), 10);
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(target * eased, el);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setFinalCount(el);
      }
    }

    requestAnimationFrame(step);
  }

  function initStatCounters() {
    var counters = document.querySelectorAll('[data-count][data-target]');
    if (!counters.length) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    counters.forEach(function (el) {
      if (el.getAttribute('data-comma') === null && el.getAttribute('data-target') === '1828') {
        el.setAttribute('data-comma', 'true');
      }
    });

    if (reducedMotion) {
      counters.forEach(setFinalCount);
      return;
    }

    var seen = new WeakSet();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  initStatCounters();
})();
