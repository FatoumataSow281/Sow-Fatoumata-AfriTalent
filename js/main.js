/* AFRITALENT - SCRIPT PRINCIPAL (COMMIT 6) */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. GESTION DU MODE SOMBRE / CLAIR (DARK & LIGHT MODE)*/
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Récupération du thème sauvegardé ou détection de la préférence système
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Fonction globale pour appliquer le thème
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Sauvegarde locale persistante 
        
        // Mise à jour de l'icône Bootstrap Icons [cite: 104]
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'bi bi-sun-fill';
            } else {
                themeIcon.className = 'bi bi-moon-fill';
            }
        }
    }

    // Application immédiate du thème au chargement de la page [cite: 184]
    applyTheme(initialTheme);

    // Écouteur de clic sur le bouton de bascule [cite: 183]
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    /* 2. COMPORTEMENTS AU SCROLL (NAVBAR & BOUTON RETOUR EN HAUT) */
    const navbar = document.querySelector('.navbar'); // Assure-toi que cette classe correspond à ton HTML [cite: 37]
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Gestion de la navbar dynamique au défilement (> 50 pixels) 
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Gestion de la visibilité du bouton de retour en haut (> 300 pixels) 
        if (backToTopBtn) {
            if (scrollPosition > 300) {
                backToTopBtn.classList.remove('d-none'); // d-none est une classe Bootstrap utile [cite: 103]
            } else {
                backToTopBtn.classList.add('d-none');
            }
        }
    });

    // Remontée fluide (Smooth Scroll) au clic sur le bouton [cite: 95]
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /*3. FOOTER - ANNÉE DYNAMIQUE*/
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear(); // 
    }
});

// 1. Sélectionner tous les éléments de compteur (ceux avec la classe .num)
const compteurs = document.querySelectorAll('---METS_ICI_TON_SELECTEUR_CSS---');

// 2. Fonction qui va faire grimper le chiffre d'un compteur spécifique
function animerUnCompteur(compteur) {
    // Récupérer la valeur cible écrite dans le HTML (ex: 2500)
    const cible = parseInt(compteur.innerText);
    let valeurInitiale = 0;
    
    // Définir une vitesse ou un pas d'incrémentation
    const nbrEtapes = 50; 
    const pas = cible / nbrEtapes;

    // Créer un timer (setInterval) qui s'exécute en boucle
    const timer = setInterval(() => {
        // À chaque étape, on augmente la valeur initiale
        valeurInitiale += pas;
        
        // Si on a atteint ou dépassé la cible, on arrête le timer
        if (valeurInitiale >= cible) {
            compteur.innerText = cible; // On affiche le chiffre exact pile
            clearInterval(timer);       // On stoppe le setInterval
        } else {
            // Sinon, on affiche la valeur arrondie actuelle
            compteur.innerText = Math.floor(valeurInitiale);
        }
    }, 20); // S'exécute toutes les 20 millisecondes
}

// 3. Créer l'IntersectionObserver pour lancer l'animation au bon moment
const optionsCompteurs = {
    threshold: 0.5 // Déclenche quand 50% de la section est visible
};

const observateurCompteurs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Si l'élément devient visible à l'écran
        if (entry.isIntersecting) {
            // Appeler la fonction d'animation sur cet élément précis
            animerUnCompteur(entry.target);
            
            // C'est bon, le compteur est lancé ! On arrête de l'observer [consigne commit 7]
            observer.unobserve(entry.target);
        }
    });
}, optionsCompteurs);

// 4. Dire à l'observateur de surveiller chaque compteur
compteurs.forEach(compteur => {
    observateurCompteurs.observe(compteur);
});

/**
 * AFRITALENT - Script Principal (js/main.js)
 * Conforme aux exigences du Commit 7 : Animations sur index.html et about.html
 */

document.addEventListener('DOMContentLoaded', () => {
    initCompteursAnimes();
    initSectionsFadeIn();
});

/**
 * FEATURE 1 : Compteurs de Statistiques (Scroll)
 */
function initCompteursAnimes() {
    // Sélection hybride pour index.html (.num) et about.html (.counter-value)
    const cibleCompteurs = document.querySelectorAll('.num, .counter-value');
    
    if (cibleCompteurs.length === 0) return;

    const lancerAnimation = (elementCompteur) => {
        // Lecture de la cible : soit via data-target (about), soit via le texte direct (index)
        const cibleAttribut = elementCompteur.getAttribute('data-target');
        const valeurCible = cibleAttribut ? parseInt(cibleAttribut, 10) : parseInt(elementCompteur.innerText, 10);
        
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
                // Arrêt de l'observation pour ne jouer l'animation qu'une seule fois
                observer.unobserve(entry.target);
            }
        });
    }, optionsCompteurs);

    cibleCompteurs.forEach(compteur => observateur.observe(compteur));
}

/**
 * FEATURE 2 : Apparition en fondu des sections (Fade-In)
 */
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
                // Désactivation pour figer la section affichée
                observer.unobserve(entry.target);
            }
        });
    }, optionsFade);

    sections.forEach(section => observateurFade.observe(section));
}

// ==========================================================================
// FILTRAGE DYNAMIQUE DES FREELANCES (SÉCURISÉ POUR LE TEXTE DU HTML)
// ==========================================================================
// On cible la classe exacte de tes boutons HTML : ".filter-btn"
const boutonsFiltre = document.querySelectorAll('.filter-btn');

// On cible les colonnes qui contiennent l'attribut "data-category"
const colonnesFreelances = document.querySelectorAll('[data-category]');

if (boutonsFiltre.length > 0 && colonnesFreelances.length > 0) {
    
    boutonsFiltre.forEach(function(bouton) {
        bouton.addEventListener('click', function() {
            
            // 1. Gestion visuelle des boutons (enlever la classe 'active' partout, l'ajouter sur le cliqué)
            boutonsFiltre.forEach(function(btn) {
                btn.classList.remove('active');
            });
            bouton.classList.add('active');
            
            // 2. Récupérer la valeur du filtre cliqué (all, web, design, data, devops)
            const filtreCible = bouton.getAttribute('data-filter');
            
            // 3. Parcourir chaque colonne de freelance pour l'afficher ou la masquer
            colonnesFreelances.forEach(function(colonne) {
                const categorieFreelance = colonne.getAttribute('data-category');
                
                // Si on clique sur "all" (Tous), ou si la catégorie correspond exactement
                if (filtreCible === 'all' || filtreCible === categorieFreelance) {
                    // On utilise setProperty avec 'important' pour écraser les styles de la grille Bootstrap
                    colonne.style.setProperty('display', 'block', 'important');
                } else {
                    colonne.style.setProperty('important', 'none', 'important');
                    colonne.style.setProperty('display', 'none', 'important');
                }
            });
        });
    });
}

// ==========================================================================
// CODE COMPLEMENTAIRE ET SYNCHRONISÉ POUR LE COMMIT 8
// Fonctions : Filtrage des freelances, Validation de formulaire et Retour en haut
// ==========================================================================

// On attend que le DOM (HTML) soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {

    // ----------------------------------------------------------------------
    // 1. FILTRAGE DYNAMIQUE DES FREELANCES (Page freelances.html)
    // ----------------------------------------------------------------------
    const boutonsFiltre = document.querySelectorAll('.filter-btn');
    const colonnesFreelances = document.querySelectorAll('[data-category]');

    if (boutonsFiltre.length > 0 && colonnesFreelances.length > 0) {
        boutonsFiltre.forEach(function(bouton) {
            bouton.addEventListener('click', function() {
                
                // Gestion visuelle de la classe active sur les boutons
                boutonsFiltre.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                bouton.classList.add('active');
                
                // Récupération de la catégorie ciblée via l'attribut data-filter
                const filtreCible = bouton.getAttribute('data-filter');
                
                // Parcours de toutes les colonnes de freelances
                colonnesFreelances.forEach(function(colonne) {
                    const categorieFreelance = colonne.getAttribute('data-category');
                    
                    // Si le filtre est "all" ou correspond à la catégorie de la carte
                    if (filtreCible === 'all' || filtreCible === categorieFreelance) {
                        colonne.style.setProperty('display', 'block', 'important');
                    } else {
                        colonne.style.setProperty('display', 'none', 'important');
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. VALIDATION STRICTE DU FORMULAIRE DE CONTACT (Page contact.html)
    // ----------------------------------------------------------------------
    const formulaireContact = document.getElementById('contact-form');

    if (formulaireContact) {
        formulaireContact.addEventListener('submit', function(evenement) {
            
            // Bloquer le rechargement automatique de la page
            evenement.preventDefault();
            
            // Récupération de tous les champs et de la zone de succès
            const nom = document.getElementById('nom');
            const prenom = document.getElementById('prenom');
            const email = document.getElementById('email');
            const sujet = document.getElementById('sujet');
            const message = document.getElementById('message');
            const blocSucces = document.getElementById('form-success-message');
            
            let formulaireValide = true;
            
            // Réinitialisation des classes d'état Bootstrap avant chaque vérification
            const champs = [nom, prenom, email, sujet, message];
            champs.forEach(function(champ) {
                champ.classList.remove('is-invalid', 'is-valid');
            });

            // --- EXPRESSIONS RÉGULIÈRES (REGEX) ---
            // regexLettres : Uniquement lettres (avec accents), espaces, tirets et apostrophes. Minimum 2 caractères.
            const regexLettres = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
            // regexEmail : Structure standard d'une adresse email (texte + @ + texte + . + texte)
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validation du Nom (Lettres uniquement + 2 caractères minimum)
            if (!regexLettres.test(nom.value.trim())) {
                nom.classList.add('is-invalid');
                formulaireValide = false;
            } else {
                nom.classList.add('is-valid');
            }
            
            // Validation du Prénom (Lettres uniquement + 2 caractères minimum)
            if (!regexLettres.test(prenom.value.trim())) {
                prenom.classList.add('is-invalid');
                formulaireValide = false;
            } else {
                prenom.classList.add('is-valid');
            }
            
            // Validation de l'Email
            if (!regexEmail.test(email.value.trim())) {
                email.classList.add('is-invalid');
                formulaireValide = false;
            } else {
                email.classList.add('is-valid');
            }
            
            // Validation du Sujet (Doit choisir une option valide différente du placeholder vide)
            if (sujet.value === "") {
                sujet.classList.add('is-invalid');
                formulaireValide = false;
            } else {
                sujet.classList.add('is-valid');
            }
            
            // Validation du Message (20 caractères minimum)
            if (message.value.trim().length < 20) {
                message.classList.add('is-invalid');
                formulaireValide = false;
            } else {
                message.classList.add('is-valid');
            }
            
            // --- ACTION FINALE SI LE FORMULAIRE EST VALIDE ---
            if (formulaireValide === true) {
                // Création dynamique d'un message d'alerte de succès Bootstrap
                blocSucces.innerHTML = `
                    <div class="alert alert-success mt-3" role="alert">
                        <i class="bi bi-check-circle-fill me-2"></i> 
                        Merci ! Votre message a été validé et envoyé virtuellement avec succès.
                    </div>
                `;
                
                // Vider complètement le formulaire
                formulaireContact.reset();
                
                // Retirer les contours verts de validation après réinitialisation
                champs.forEach(function(champ) {
                    champ.classList.remove('is-valid');
                });
            } else {
                // Si une erreur survient, on efface l'ancien bandeau de succès si existant
                blocSucces.innerHTML = "";
            }
        });
    }

    // ----------------------------------------------------------------------
    // 3. BOUTON RETOUR EN HAUT DE PAGE (Fonctionnalité transversale)
    // ----------------------------------------------------------------------
    const boutonRetourHaut = document.getElementById('back-to-top');
    
    if (boutonRetourHaut) {
        // Détecter le défilement de la page
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                boutonRetourHaut.classList.remove('d-none');
            } else {
                boutonRetourHaut.classList.add('d-none');
            }
        });

        // Remonter en haut de façon fluide lors du clic
        boutonRetourHaut.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});