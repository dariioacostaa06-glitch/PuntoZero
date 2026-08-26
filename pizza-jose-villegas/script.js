(function () {
  'use strict';

  // Header sólido al hacer scroll
  var header = document.getElementById('site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Selector de estrellas
  var picker = document.getElementById('star-picker');
  var ratingInput = document.getElementById('rf-rating');
  if (picker) {
    var buttons = Array.prototype.slice.call(picker.querySelectorAll('.star-btn'));
    var setRating = function (value) {
      ratingInput.value = value;
      buttons.forEach(function (btn) {
        var active = Number(btn.dataset.value) <= value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    };
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setRating(Number(btn.dataset.value));
      });
    });
  }

  // Formulario de reseña -> mailto (PVM sin backend)
  var form = document.getElementById('review-form');
  var note = document.getElementById('review-form-note');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rf-name').value.trim();
      var comment = document.getElementById('rf-comment').value.trim();
      var rating = ratingInput.value;

      if (!name || !comment || rating === '0') {
        note.textContent = 'Rellena tu nombre, una puntuación y tu opinión antes de enviar.';
        return;
      }

      var subject = 'Nueva reseña de ' + name + ' (' + rating + '/5)';
      var body = 'Nombre: ' + name + '\nPuntuación: ' + rating + ' de 5\n\n' + comment;
      var mailto =
        'mailto:resenas@pizzajosevillegas.example?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body);

      window.location.href = mailto;
      note.textContent = 'Abriendo tu cliente de correo para enviar la reseña...';
    });
  }
})();
