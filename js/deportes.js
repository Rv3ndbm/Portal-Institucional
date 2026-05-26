/* =========================================
   DEPORTES.JS - Interactividad y Animaciones MEJORADA
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // HERO DINÁMICO - Efecto parallax SUAVE (Solo CSS preferiblemente, pero JS ligero aquí)
    // ========================================
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        // Usar requestAnimationFrame para suavizar y no saturar el evento mousemove
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const xPercent = (e.clientX / window.innerWidth) * 100;
                    const yPercent = (e.clientY / window.innerHeight) * 100;

                    // Movimiento mucho más sutil y performante
                    heroContent.style.transform = `
                        perspective(1000px)
                        rotateX(${(yPercent - 50) * 0.01}deg)
                        rotateY(${(xPercent - 50) * 0.01}deg)
                    `;
                    ticking = false;
                });
                ticking = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // ========================================
    // ANIMACIONES AL HACER SCROLL - OPTIMIZADO
    // ========================================
    const observerOptions = {
        threshold: 0.1, // Reducido para que aparezca antes
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // SIN DELAY ARTIFICIAL - Aparición inmediata
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    const elementsToAnimate = document.querySelectorAll(
        '.facility-card, .team-card, .value-card, .curtain-item, .achievement-card, .complement-image, .complement-content, .comp-feature-item, .icfes-card'
    );
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // ========================================
    // GALERÍA CORTINA - LÓGICA ULTRA SIMPLE
    // ========================================
    const curtainItems = document.querySelectorAll('.curtain-item');

    curtainItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            curtainItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        }, { passive: true });
    });
});


