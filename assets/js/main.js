/* ==========================================================================
   SALES GOSSES — Deauville
   Scripts du site. Aucune dépendance externe.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. En-tête : passe en fond opaque dès que la page défile
     ------------------------------------------------------------------ */
  var entete = document.querySelector('.entete');

  function majEntete() {
    if (!entete) return;
    entete.classList.toggle('est-collee', window.scrollY > 40);
  }

  window.addEventListener('scroll', majEntete, { passive: true });
  majEntete();

  /* ------------------------------------------------------------------
     2. Menu mobile
     ------------------------------------------------------------------ */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('est-ouvert');
      burger.setAttribute('aria-expanded', String(ouvert));
      document.body.style.overflow = ouvert ? 'hidden' : '';
    });

    // Referme le menu quand on clique un lien
    nav.querySelectorAll('a').forEach(function (lien) {
      lien.addEventListener('click', function () {
        nav.classList.remove('est-ouvert');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Referme le menu avec la touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('est-ouvert')) {
        burger.click();
        burger.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Apparition des blocs au défilement
     ------------------------------------------------------------------ */
  var aReveler = document.querySelectorAll('.apparait');

  if ('IntersectionObserver' in window && aReveler.length) {
    var observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add('est-visible');
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    aReveler.forEach(function (el) {
      observateur.observe(el);
    });
  } else {
    aReveler.forEach(function (el) {
      el.classList.add('est-visible');
    });
  }

  /* ------------------------------------------------------------------
     4. Pastille « ouvert / fermé »
     Horaires : tous les jours, 17h → 1h du matin.
     À ajuster ici si les horaires d'été diffèrent.
     ------------------------------------------------------------------ */
  var OUVERTURE = 17; // 17h
  var FERMETURE = 1;  // 1h du matin

  var pastilles = document.querySelectorAll('[data-pastille]');

  function majPastilles() {
    if (!pastilles.length) return;

    var maintenant = new Date();
    var h = maintenant.getHours();
    var ouvert = h >= OUVERTURE || h < FERMETURE;

    pastilles.forEach(function (el) {
      el.dataset.etat = ouvert ? 'ouvert' : 'ferme';
      el.textContent = ouvert ? 'Ouvert maintenant' : 'Ouvre à 17h';
    });
  }

  majPastilles();
  setInterval(majPastilles, 60000);

  /* ------------------------------------------------------------------
     5. Page carte : surligne la famille en cours de lecture
     ------------------------------------------------------------------ */
  var liensFamilles = document.querySelectorAll('.familles a');

  if (liensFamilles.length && 'IntersectionObserver' in window) {
    var suivi = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;

          var id = entree.target.id;
          liensFamilles.forEach(function (lien) {
            lien.classList.toggle(
              'est-active',
              lien.getAttribute('href') === '#' + id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    document.querySelectorAll('.famille').forEach(function (section) {
      suivi.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     6. Vidéo du hero : repli propre si le fichier est absent ou refusé
     ------------------------------------------------------------------ */
  var video = document.querySelector('.hero__video');

  if (video) {
    video.addEventListener('error', function () {
      video.style.display = 'none';
    });

    // Certains navigateurs mobiles bloquent la lecture automatique.
    var lecture = video.play();
    if (lecture && typeof lecture.catch === 'function') {
      lecture.catch(function () {
        /* Le poster prend le relais, rien à faire. */
      });
    }
  }
})();
