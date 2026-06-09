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