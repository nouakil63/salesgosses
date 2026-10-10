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
    function definirEtatMenu(ouvert) {
      nav.classList.toggle('est-ouvert', ouvert);
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('menu-ouvert', ouvert);
    }

    burger.addEventListener('click', function () {
      definirEtatMenu(!nav.classList.contains('est-ouvert'));
    });

    // Referme le menu quand on clique un lien
    nav.querySelectorAll('a').forEach(function (lien) {
      lien.addEventListener('click', function () {
        definirEtatMenu(false);
      });
    });

    // Referme le menu avec la touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('est-ouvert')) {
        definirEtatMenu(false);
        burger.focus();
      }
    });

    // Évite de garder la page bloquée après une rotation ou un retour desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('est-ouvert')) {
        definirEtatMenu(false);
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
     6. Le triptyque
     Trois vidéos qui tournent en même temps, ça chauffe un téléphone.
     On ne lit que celles qui sont visibles à l'écran.
     ------------------------------------------------------------------ */
  var ecrans = document.querySelectorAll('.ecran video');

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

  /* ------------------------------------------------------------------
     7. Carte : composition au survol et au toucher
     Chaque ligne reste compacte, puis s'ouvre au clic sur téléphone.
     ------------------------------------------------------------------ */
  var lignesCarte = document.querySelectorAll('.famille .ligne');

  if (lignesCarte.length) {
    var carteTactile = window.matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)');
    var recettes = {
      'Bud': 'Lager américaine légère, fraîche et peu amère.',
      "Jack's IPA": 'India Pale Ale généreuse en houblon, aux notes fruitées et à l’amertume franche.',
      'NEIPA Jamaican': 'New England IPA trouble, très aromatique, avec une amertume douce.',
      'La Chouffe': 'Blonde belge forte, fruitée et légèrement épicée.',
      'Blanche de Namur': 'Bière blanche belge légère, fraîche, aux notes d’agrumes.',
      'Cuvée des Trolls': 'Blonde belge ronde, fruitée et peu amère.',
      'Kasteel Red': 'Bière rouge belge douce, marquée par la cerise.',
      'Triple Kannunik': 'Triple belge ample, maltée et épicée.',
      'Paix Dieu': 'Triple belge puissante, ronde et brassée les nuits de pleine lune.',
      'Mojito Sales Gosses': 'Rhum, citron vert, menthe, sucre et eau gazeuse. La recette de la maison.',
      'Sales Gosses': 'Le cocktail signature du bar. Demandez au comptoir pour découvrir la recette du moment.',
      'Mojito': 'Rhum, citron vert, menthe fraîche, sucre et eau gazeuse.',
      'Mojito fruits': 'La base du Mojito avec une purée de fruit au choix.',
      'Cuba libre': 'Rhum, Coca-Cola et citron vert.',
      'Caïpirinha': 'Cachaça, citron vert frais et sucre de canne.',
      'Caïpiroska': 'Vodka, citron vert frais et sucre de canne.',
      'Mai Tai': 'Rhums, orange, citron vert et sirop d’orgeat.',
      'Sex on the Beach': 'Vodka, liqueur de pêche, orange et cranberry.',
      'Piña Colada': 'Rhum, ananas et crème de coco.',
      'Tequila Sunrise': 'Tequila, jus d’orange et grenadine.',
      'Spritz': 'Apéritif italien, prosecco et eau gazeuse.',
      'Ti Punch': 'Rhum agricole, citron vert et sucre de canne.',
      'Long Island': 'Vodka, gin, rhum, tequila, triple sec, citron et Coca-Cola.',
      'Cosmopolitan': 'Vodka, triple sec, citron vert et cranberry.',
      'Margarita': 'Tequila, triple sec et citron vert.',
      'Daiquiri': 'Rhum, citron vert et sucre de canne.',
      'Zombie': 'Assemblage de rhums, fruits exotiques, citron et épices.',
      'Moscow Mule': 'Vodka, ginger beer et citron vert.',
      'London Mule': 'Gin, ginger beer et citron vert.',
      'Jamaican Mule': 'Rhum jamaïcain, ginger beer et citron vert.',
      'Porn Star Martini': 'Vodka, passion, vanille et un trait de pétillant servi à côté.',
      'Desperito': 'Tequila, citron vert et Desperados.',
      'St Germain': 'Liqueur de fleur de sureau, pétillant et eau gazeuse.',
      'Jack Apple Tonic': 'Jack Daniel’s Apple, tonic et citron.',
      'Virgin Mojito': 'Citron vert, menthe, sucre et eau gazeuse, sans alcool.',
      'Virgin Colada': 'Ananas et crème de coco, sans alcool.',
      'Negroni': 'Gin, vermouth rouge et Campari.',
      'Americano': 'Vermouth rouge, Campari et eau gazeuse.',
      'Moresque': 'Pastis et sirop d’orgeat.',
      'Perroquet': 'Pastis et sirop de menthe.',
      'Tomate': 'Pastis et grenadine.',
      'Kir': 'Vin blanc et crème de cassis.',
      'Kir royal': 'Vin pétillant et crème de cassis.',
      'Kiss Cool': 'Get 27 et Get 31, servi très frais.',
      'Jäger Bomb': 'Jägermeister et boisson énergisante.',
      'Fire Bomb': 'Jack Daniel’s Fire et boisson énergisante.',
      'Planche fromage': 'Une sélection de fromages à partager.',
      'Planche charcuterie': 'Un assortiment de charcuteries à partager.',
      'Planche mixte': 'Fromages et charcuteries réunis sur la même planche.',
      'Camembert fondu': 'Camembert chaud et coulant, servi à partager.',
      'Sticks de poulet': 'Aiguillettes de poulet panées, servies chaudes.',
      'Sticks de mozzarella': 'Mozzarella panée et fondante.',
      'Guacamole': 'Avocat assaisonné, servi avec de quoi tremper.',
      'Croque-monsieur': 'Pain toasté, jambon et fromage fondu.',
      'Chicken burger': 'Burger au poulet, servi chaud.'
    };

    var explicationsFamille = {
      'bieres': 'Une bière servie bien fraîche. Le style et la disponibilité peuvent varier selon les fûts.',
      'cocktails': 'Cocktail préparé à la commande. Demandez au bar si vous souhaitez ajuster le goût ou le dosage.',
      'sans-alcool': 'Cocktail sans alcool préparé à la commande avec jus, fruits ou sirops.',
      'spiritueux': 'Spiritueux servi seul ou avec un soft. Demandez conseil au bar pour choisir.',
      'aperitifs': 'Apéritif classique servi seul, allongé ou préparé selon la recette traditionnelle.',
      'vins': 'Vin sélectionné pour la carte, disponible au verre ou à la bouteille selon la référence.',
      'digestifs': 'Liqueur ou digestif à savourer en fin de soirée, généralement servi très frais.',
      'tapas': 'Préparé pour accompagner les verres et se poser au milieu de la table.',
      'softs': 'Boisson sans alcool servie fraîche, avec glaçons sur demande.'
    };

    function fermerDetails(sauf) {
      lignesCarte.forEach(function (ligne) {
        if (ligne === sauf) return;
        ligne.classList.remove('est-detaillee');
        ligne.setAttribute('aria-expanded', 'false');
      });
    }

    lignesCarte.forEach(function (ligne) {
      var nomEl = ligne.querySelector('.ligne__nom');
      var famille = ligne.closest('.famille');
      if (!nomEl || !famille) return;

      var detail = document.createElement('span');
      detail.className = 'ligne__explication';
      detail.textContent = recettes[nomEl.textContent.trim()] || explicationsFamille[famille.id] || 'Demandez-nous au comptoir pour en savoir plus.';
      ligne.appendChild(detail);
      ligne.tabIndex = 0;
      ligne.setAttribute('role', 'button');
      ligne.setAttribute('aria-expanded', 'false');

      ligne.addEventListener('click', function () {
        // Sur ordinateur, l'explication est une bulle de survol : le clic ne
        // doit pas figer une ligne ouverte ni faire recalculer les colonnes.
        if (!carteTactile.matches) return;
        var ouvrir = !ligne.classList.contains('est-detaillee');
        fermerDetails(ligne);
        ligne.classList.toggle('est-detaillee', ouvrir);
        ligne.setAttribute('aria-expanded', String(ouvrir));
      });

      ligne.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (!carteTactile.matches) return;
        e.preventDefault();
        ligne.click();
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.famille .ligne')) fermerDetails();
    });
  }

  /* ------------------------------------------------------------------
     8. Demande de groupe : prépare un message WhatsApp récapitulatif
     ------------------------------------------------------------------ */
  var formulaireGroupe = document.getElementById('formulaire-groupe');

  if (formulaireGroupe) {
    var dateGroupe = document.getElementById('date-groupe');
    if (dateGroupe) dateGroupe.min = new Date().toISOString().split('T')[0];

    formulaireGroupe.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!formulaireGroupe.reportValidity()) return;

      var donnees = new FormData(formulaireGroupe);
      var message = [
        'Bonjour Sales Gosses,',
        '',
        'Je souhaite organiser un événement :',
        'Type : ' + donnees.get('type'),
        'Nom : ' + donnees.get('nom'),
        'Téléphone : ' + donnees.get('telephone'),
        'E-mail : ' + (donnees.get('email') || 'Non renseigné'),
        'Date souhaitée : ' + donnees.get('date'),
        'Nombre de personnes : ' + donnees.get('invites'),
        '',
        'Message :',
        donnees.get('message')
      ].join('\n');

      window.open('https://wa.me/33642418167?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }
})();
