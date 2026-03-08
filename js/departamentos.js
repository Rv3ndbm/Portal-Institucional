(function () {
    // Imágenes de fondo para cada sección del menú
    const backgroundImages = {
        inicio: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200")',
        sedes: 'url("https://images.unsplash.com/photo-1562774053-701939374585?w=1200")',
        departamentos: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200")',
        medias: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200")',
        academico: 'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200")'
    };

    // Obtener elementos del DOM
    const navItems = document.querySelectorAll('.nav-item');
    const headerBackground = document.getElementById('headerBackground');
    const mainHeader = document.getElementById('mainHeader');

    // Event listeners para mostrar fondos en el header
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const bgType = this.getAttribute('data-bg');
            if (backgroundImages[bgType]) {
                headerBackground.style.backgroundImage = backgroundImages[bgType];
                headerBackground.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', function () {
            headerBackground.classList.remove('active');
        });
    });

    // Animación de scroll - Header minimizado
    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener('scroll', function () {
        lastScrollTop = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        const scrollPosition = lastScrollTop;

        if (scrollPosition > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }

    // Smooth scroll para navegación rápida
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 150;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación Scroll Reveal ligera
    const revealSections = () => {
        const sections = document.querySelectorAll('.scroll-reveal');
        const triggerBottom = window.innerHeight * 0.85;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealSections);
    revealSections(); // Ejecutar una vez al cargar

    // Logo de carga
    console.log('🏛️ Página de Departamentos cargada con éxito - I.E. Gilberto Alzate Avendaño');
})();
