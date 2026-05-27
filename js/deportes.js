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
    // GALERÍA DE IMÁGENES Y LIGHTBOX
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    let currentIndex = 0;
    const images = Array.from(document.querySelectorAll('.lazy-gallery-img')).map(img => ({
        src: img.getAttribute('data-src'),
        alt: img.alt
    }));



    // 1. Lazy Loading de imágenes de la galería (adaptado a scroll horizontal)
    const galleryImgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1, rootMargin: '200px' });

    document.querySelectorAll('.lazy-gallery-img').forEach(img => {
        galleryImgObserver.observe(img);
    });

    // 2. Funciones del Lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    function updateLightboxImage(direction = 'next') {
        const { src, alt } = images[currentIndex];

        // Animación de salida/entrada suave
        lightboxImg.classList.add('switching');
        if (direction === 'prev') lightboxImg.classList.add('switching-prev');

        setTimeout(() => {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightboxCaption.textContent = alt;
            lightboxImg.classList.remove('switching', 'switching-prev');
        }, 200);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage('next');
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage('prev');
    }

    // 3. Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

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
        '.facility-card, .team-card, .sport-team-row, .value-card, .achievement-card, .complement-image, .complement-content, .comp-feature-item, .icfes-card'
    );
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

});


