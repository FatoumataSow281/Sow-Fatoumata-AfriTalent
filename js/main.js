/**
 * AFRITALENT - SCRIPT PRINCIPAL UNIFIÉ
 * Regroupe les fonctionnalités des Commits 6 et 7
 * Testé et optimisé pour index.html et about.html
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GESTION DU MODE SOMBRE / CLAIR (DARK & LIGHT MODE) [Commit 6]
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); 
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'bi bi-sun-fill'; // [cite: 104]
            } else {
                themeIcon.className = 'bi bi-moon-fill'; // [cite: 104]
            }
        }
    }

    applyTheme(initialTheme); // [cite: 184]

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            applyTheme(newTheme); // [cite: 183]
        });
    }

    /* ==========================================================================
       2. COMPORTEMENTS AU SCROLL (NAVBAR & BOUTON RETOUR EN HAUT) [Commit 6]
       ========================================================================== */
    const navbar = document.querySelector('.navbar'); // [cite: 37]
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Gestion de la navbar dynamique au défilement (> 50 pixels) [cite: 185]
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Gestion de la visibilité du bouton de retour en haut (> 300 pixels) [cite: 186]
        if (backToTopBtn) {
            if (scrollPosition > 300) {
                backToTopBtn.classList.remove('d-none'); // [cite: 103]
            } else {
                backToTopBtn.classList.add('d-none');
            }
        }
    });

    // Remontée fluide (Smooth Scroll) au clic [cite: 95]
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       3. FOOTER - ANNÉE DYNAMIQUE [Commit 2]
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear(); // [cite: 58]
    }

    /* ==========================================================================
       4. INITIALISATION DES ANIMATIONS INTERSECTION OBSERVER [Commit 7]
       ========================================================================== */
    initCompteursAnimes();
    initSectionsFadeIn();
});

/* ==========================================================================
   FEATURE 1 : Compteurs de Statistiques (Scroll) [Commit 7]
   ========================================================================== */
function initCompteursAnimes() {
    // Sélection hybride : .num (index.html) et .counter-value (about.html)
    const cibleCompteurs = document.querySelectorAll('.num, .counter-value');
    
    if (cibleCompteurs.length === 0) return;

    const lancerAnimation = (elementCompteur) => {
        // Lecture de la cible : soit via l'attribut data-target (about), soit via le texte direct (index)
        const cibleAttribut = elementCompteur.getAttribute('data-target');
        const valeurCible = cibleAttribut ? parseInt(cibleAttribut, 10) : parseInt(elementCompteur.innerText, 10);
        
        // Sécurité : si la valeur n'est pas un nombre valide, on arrête
        if (isNaN(valeurCible)) return;

        let valeurActuelle = 0;
        const totalEtapes = 50; 
        const increment = valeurCible / totalEtapes;

        const intervalle = setInterval(() => {
            valeurActuelle += increment;
            
            if (valeurActuelle >= valeurCible) {
                elementCompteur.innerText = valeurCible;
                clearInterval(intervalle);
            } else {
                elementCompteur.innerText = Math.floor(valeurActuelle);
            }
        }, 20); 
    };

    const optionsCompteurs = {
        threshold: 0.1 // Déclenche dès que 10% du bloc des statistiques apparaît à l'écran
    };

    const observateur = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lancerAnimation(entry.target);
                // Arrêt de l'observation pour ne jouer l'animation qu'une seule fois [cite: 194]
                observer.unobserve(entry.target);
            }
        });
    }, optionsCompteurs);

    cibleCompteurs.forEach(compteur => observateur.observe(compteur));
}

/* ==========================================================================
   FEATURE 2 : Apparition en fondu des sections (Fade-In) [Commit 7]
   ========================================================================== */
function initSectionsFadeIn() {
    const sections = document.querySelectorAll('main section');
    
    if (sections.length === 0) return;

    const optionsFade = {
        threshold: 0.15 // Déclenche dès que 15% de la section entre dans l'écran
    };

    const observateurFade = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajout de la classe CSS pour déclencher la transition
                entry.target.classList.add('is-visible');
                // Désactivation pour figer la section affichée [cite: 194]
                observer.unobserve(entry.target);
            }
        });
    }, optionsFade);

    sections.forEach(section => observateurFade.observe(section));
}