(function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });
  }

  // Optional: update CTA href when you have a calendar link
  // document.getElementById('cta-link').href = 'https://calendly.com/your-link';
})();
