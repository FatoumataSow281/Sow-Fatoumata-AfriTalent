/**
 * AFRITALENT - SCRIPT PRINCIPAL UNIQUE (js/main.js)
 * Intègre et synchronise l'ensemble des fonctionnalités applicatives (Thèmes, Animations, Filtres, Validations).
 * 
 * Gestion de l'affichage adaptatif :
 * - Animations actives exclusivement sur index.html et about.html pour préserver le storytelling visuel.
 * - Désactivation sur contact.html et freelances.html pour privilégier l'accessibilité et la réactivité des composants métiers.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GESTION DU MODE SOMBRE / CLAIR (DARK & LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Récupération de l'état persistant dans le navigateur
    const savedTheme = localStorage.getItem('theme');
    // Détection des préférences système de l'utilisateur (Alternative fallback automatique)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Stratégie d'initialisation : priorité au stockage local, puis aux préférences système, puis mode clair par défaut
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    /**
     * Applique le thème sélectionné au document et met à jour les indicateurs graphiques.
     * @param {string} theme - Le thème à appliquer ('dark' ou 'light').
     */
    function applyTheme(theme) {
        // Injection d'un attribut de données sur la balise racine <html> pour déclencher les surcharges CSS
        document.documentElement.setAttribute('data-theme', theme);
        // Sauvegarde du choix utilisateur pour les futures sessions
        localStorage.setItem('theme', theme); 
        
        // Commutation des icônes de la librairie Bootstrap Icons
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'bi bi-sun-fill'; // Icône Soleil en mode sombre
            } else {
                themeIcon.className = 'bi bi-moon-fill'; // Icône Lune en mode clair
            }
        }
    }

    // Exécution immédiate au chargement pour éviter l'effet de flash visuel blanc (FOUC)
    applyTheme(initialTheme);

    // Écouteur d'événement sur le bouton de basculement du menu de navigation
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    /* ==========================================================================
       2. COMPORTEMENTS AU SCROLL (NAVBAR ET BOUTON RETOUR EN HAUT)
       ========================================================================== */
    const navbar = document.querySelector('.navbar') || document.querySelector('.custom-navbar'); 
    const backToTopBtn = document.getElementById('back-to-top');

    // Suivi de l'axe de défilement vertical (Y) pour les interactions contextuelles
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Effet de shrink sur la barre de navigation : se rétracte si scroll > 50px
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Affichage conditionnel du bouton "Retour en haut"
        if (backToTopBtn) {
            if (scrollPosition > 300) {
                backToTopBtn.classList.remove('d-none'); // Devient visible au-delà de 300px
            } else {
                backToTopBtn.classList.add('d-none'); // Masqué en haut de page
            }
        }
    });

    // Animation de défilement fluide vers le sommet de la page
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Défilement progressif natif du navigateur
            });
        });
    }
    

    /* ==========================================================================
       3. FOOTER - MISE À JOUR DYNAMIQUE DE L'ANNÉE DE COPYRIGHT
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        // Évite le hardcoding pour assurer la maintenance temporelle automatique du site
        yearSpan.textContent = new Date().getFullYear(); 
    }

    /* ==========================================================================
       4. COMPTEURS ANIMÉS AU SCROLL (Pages : index.html & about.html)
       ========================================================================== */
    // Sécurités structurelles : Détection sémantique de la page courante par la présence d'IDs uniques
    const estPageContact = document.getElementById('contact-form') !== null;
    const estPageFreelances = document.querySelector('#freelancers-grid') !== null;
    // Les animations ne s'exécutent que si l'utilisateur est sur l'index ou la page à propos
    const estPageAnimationActive = !estPageContact && !estPageFreelances;

    const cibleCompteurs = document.querySelectorAll('.num, .counter-value');
    
    if (cibleCompteurs.length > 0) {
        if (estPageAnimationActive) {
            /**
             * Anime l'incrémentation d'un chiffre de zéro jusqu'à sa valeur cible définie.
             * @param {HTMLElement} elementCompteur - L'élément DOM contenant le compteur.
             */
            const lancerAnimationCompteur = (elementCompteur) => {
                const cibleAttribut = elementCompteur.getAttribute('data-target');
                // Fallback de sécurité : prend le texte brut si l'attribut data-target est manquant
                const valeurCible = cibleAttribut ? parseInt(cibleAttribut, 10) : parseInt(elementCompteur.innerText, 10);
                
                if (isNaN(valeurCible)) return;

                let valeurActuelle = 0;
                const totalEtapes = 50; // Nombre total d'itérations d'incrément (définit la vitesse)
                const increment = valeurCible / totalEtapes;

                // Création d'une boucle temporelle asynchrone (Fréquence : 20ms)
                const intervalle = setInterval(() => {
                    valeurActuelle += increment;
                    
                    if (valeurActuelle >= valeurCible) {
                        elementCompteur.innerText = valeurCible; // Assure l'exactitude de la valeur finale
                        clearInterval(intervalle); // Destruction de l'intervalle pour libérer la mémoire (Garbage Collector)
                    } else {
                        elementCompteur.innerText = Math.floor(valeurActuelle);
                    }
                }, 20); 
            };

            // Configuration de l'IntersectionObserver : l'élément doit être visible à 10% sur l'écran
            const optionsCompteurs = { threshold: 0.1 };

            const observateurCompteurs = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        lancerAnimationCompteur(entry.target);
                        observer.unobserve(entry.target); // Désactive l'observation pour ne lancer l'animation qu'une seule fois
                    }
                });
            }, optionsCompteurs);

            cibleCompteurs.forEach(compteur => observateurCompteurs.observe(compteur));
        } else {
            // Fallback d'accessibilité : Si sur contact ou freelances, affichage immédiat des chiffres statiques
            cibleCompteurs.forEach(compteur => {
                const cibleAttribut = compteur.getAttribute('data-target');
                if (cibleAttribut) {
                    compteur.innerText = cibleAttribut;
                }
            });
        }
    }

    /* ==========================================================================
       5. APPARITION EN FONDU DES SECTIONS (Pages : index.html & about.html)
       ========================================================================== */
    const sectionsFade = document.querySelectorAll('main section, #hero, #how-it-works, #categories, #testimonials, #cta-home, #history, #team, #values');
    
    if (sectionsFade.length > 0) {
        if (estPageAnimationActive) {
            // Seuil de déclenchement fixé à 15% d'affichage de la section pour anticiper le défilement de l'utilisateur
            const optionsFade = { threshold: 0.15 };

            const observateurFade = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Injection de la classe qui bascule l'opacité CSS de 0 à 1 (voir style.css)
                        entry.target.classList.add('is-visible'); 
                        observer.unobserve(entry.target); // Libération du thread d'écoute d'intersection
                    }
                });
            }, optionsFade);

            sectionsFade.forEach(section => observateurFade.observe(section));
        } else {
            // Sur les pages de formulaires ou listes, neutralisation des animations pour une réactivité immédiate
            sectionsFade.forEach(section => {
                section.classList.add('is-visible');
                section.style.opacity = '1';
                section.style.transform = 'none';
                section.style.transition = 'none'; 
            });
        }
    }

    /* ==========================================================================
       6. FILTRAGE DYNAMIQUE DES FREELANCES (Page : freelances.html)
       ========================================================================== */
    const boutonsFiltre = document.querySelectorAll('.filter-btn');
    const colonnesFreelances = document.querySelectorAll('[data-category]');

    if (boutonsFiltre.length > 0 && colonnesFreelances.length > 0) {
        boutonsFiltre.forEach(function(bouton) {
            bouton.addEventListener('click', function() {
                
                // Gestion de l'état actif visuel sur le groupe de boutons de filtrage
                boutonsFiltre.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                bouton.classList.add('active');
                
                const filtreCible = bouton.getAttribute('data-filter');
                
                // Algorithme de tri par comparaison de jetons de données (Data-Attributes)
                colonnesFreelances.forEach(function(colonne) {
                    const categorieFreelance = colonne.getAttribute('data-category');
                    
                    // Si le filtre est global ou correspond exactement au tag de la carte freelance
                    if (filtreCible === 'all' || filtreCible === categorieFreelance) {
                        colonne.style.setProperty('display', 'block', 'important'); // Révèle l'élément
                    } else {
                        colonne.style.setProperty('display', 'none', 'important');  // Masque l'élément
                    }
                });
            });
        });
    }

    /* ==========================================================================
       7. VALIDATION STRICTE DU FORMULAIRE DE CONTACT (Page : contact.html)
       ========================================================================== */
    const formulaireContact = document.getElementById('contact-form');

    if (formulaireContact) {
        formulaireContact.addEventListener('submit', function(evenement) {
            
            evenement.preventDefault(); // Intercepte et bloque le rechargement natif de la page
            
            // Cartographie des nœuds du formulaire
            const nom = document.getElementById('nom');
            const prenom = document.getElementById('prenom');
            const email = document.getElementById('email');
            const sujet = document.getElementById('sujet');
            const message = document.getElementById('message');
            const blocSucces = document.getElementById('form-success-message');
            
            let formulaireValide = true;
            
            // Réinitialisation systématique des états d'erreurs Bootstrap (.is-invalid / .is-valid)
            const champs = [nom, prenom, email, sujet, message];
            champs.forEach(function(champ) {
                if (champ) champ.classList.remove('is-invalid', 'is-valid');
            });

            // Définition des expressions régulières (Regex) métiers
            // regexLettres : Autorise les lettres, accents, espaces, tirets et apostrophes (minimum 2 caractères)
            const regexLettres = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/; 
            // regexEmail : Structure standard d'une adresse email valide (chaîne + @ + domaine + .extension)
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            // Validation du champ Nom
            if (nom) {
                if (!regexLettres.test(nom.value.trim())) {
                    nom.classList.add('is-invalid');
                    formulaireValide = false;
                } else {
                    nom.classList.add('is-valid');
                }
            }
            
            // Validation du champ Prénom
            if (prenom) {
                if (!regexLettres.test(prenom.value.trim())) {
                    prenom.classList.add('is-invalid');
                    formulaireValide = false;
                } else {
                    prenom.classList.add('is-valid');
                }
            }
            
            // Validation du champ Email
            if (email) {
                if (!regexEmail.test(email.value.trim())) {
                    email.classList.add('is-invalid');
                    formulaireValide = false;
                } else {
                    email.classList.add('is-valid');
                }
            }
            
            // Validation de la liste de sélection du Sujet
            if (sujet) {
                if (sujet.value === "") {
                    sujet.classList.add('is-invalid');
                    formulaireValide = false;
                } else {
                    sujet.classList.add('is-valid');
                }
            }
            
            // Validation de la longueur du Message (Critère qualitatif : minimum 20 caractères)
            if (message) {
                if (message.value.trim().length < 20) {
                    message.classList.add('is-invalid');
                    formulaireValide = false;
                } else {
                    message.classList.add('is-valid');
                }
            }
            
            // Traitement final si l'ensemble des validations est au vert
            if (formulaireValide) {
                if (blocSucces) {
                    // Injection dynamique d'un composant d'alerte Bootstrap accessible
                    blocSucces.innerHTML = `
                        <div class="alert alert-success mt-3" role="alert">
                            <i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i> 
                            Merci ! Votre message a été validé et envoyé virtuellement avec succès.
                        </div>
                    `;
                }
                
                formulaireContact.reset(); // Remise à zéro complète des champs du formulaire
                
                // Nettoyage final des classes de succès de validation
                champs.forEach(function(champ) {
                    if (champ) champ.classList.remove('is-valid');
                });
            } else {
                // En cas d'erreur résiduelle, on vide l'encadré de notification de succès précédent
                if (blocSucces) blocSucces.innerHTML = ""; 
            }
        });
    }
});