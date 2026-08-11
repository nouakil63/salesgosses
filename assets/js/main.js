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
     3. Menu déroulant « Le bar »
     Ouverture au clic, fermeture au clic extérieur, à Échap, et au
     départ du focus. Sur mobile, le tiroir se déplie dans le flux.
     ------------------------------------------------------------------ */
  var groupes = document.querySelectorAll('[data-groupe]');

  function fermerGroupes(sauf) {
    groupes.forEach(function (g) {
      if (g === sauf) return;
      g.dataset.ouvert = 'false';
      var b = g.querySelector('.nav__bouton');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  groupes.forEach(function (groupe) {
    var bouton = groupe.querySelector('.nav__bouton');
    if (!bouton) return;

    groupe.dataset.ouvert = 'false';

    bouton.addEventListener('click', function (e) {
      e.stopPropagation();
      var ouvert = groupe.dataset.ouvert === 'true';
      fermerGroupes(groupe);
      groupe.dataset.ouvert = String(!ouvert);
      bouton.setAttribute('aria-expanded', String(!ouvert));
    });

    // Le focus quitte le groupe : on referme
    groupe.addEventListener('focusout', function (e) {
      if (!groupe.contains(e.relatedTarget)) {
        groupe.dataset.ouvert = 'false';
        bouton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (groupes.length) {
    document.addEventListener('click', function () {
      fermerGroupes(null);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;

      var ouvert = document.querySelector('[data-groupe][data-ouvert="true"]');
      if (!ouvert) return;

      fermerGroupes(null);
      var b = ouvert.querySelector('.nav__bouton');
      if (b) b.focus();
    });
  }

  /* ------------------------------------------------------------------
     4. Apparition des blocs au défilement
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
     5. Pastille « ouvert / fermé »
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
     6. Page carte : surligne la famille en cours de lecture
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
     7. Les vidéos des moments de la nuit
     Trois vidéos qui tournent en même temps, ça chauffe un téléphone.
     On ne charge et ne lit que celles qui sont visibles à l'écran.
     ------------------------------------------------------------------ */
  var ecrans = document.querySelectorAll('.moment__ecran video');

  if (ecrans.length) {
    var mouvementReduit =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouvement réduit : on garde l'image d'attente, sans lecture.
    if (mouvementReduit) {
      ecrans.forEach(function (v) {
        v.removeAttribute('autoplay');
        v.pause();
      });
    } else if ('IntersectionObserver' in window) {
      var lecteur = new IntersectionObserver(
        function (entrees) {
          entrees.forEach(function (entree) {
            var v = entree.target;

            if (entree.isIntersecting) {
              if (v.preload === 'none') v.preload = 'auto';
              var p = v.play();
              if (p && typeof p.catch === 'function') {
                p.catch(function () {
                  /* Lecture automatique refusée : l'image d'attente suffit. */
                });
              }
            } else {
              v.pause();
            }
          });
        },
        { threshold: 0.25 }
      );

      ecrans.forEach(function (v) {
        lecteur.observe(v);

        // Fichier absent ou illisible : on laisse le poster en place.
        v.addEventListener('error', function () {
          v.style.visibility = 'hidden';
        });
      });
    }
  }
})();
