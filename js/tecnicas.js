(function () {
    // Imágenes de fondo para cada sección del menú
    const backgroundImages = {
        inicio: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200")',
        sedes: 'url("https://images.unsplash.com/photo-1562774053-701939374585?w=1200")',
        departamentos: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200")',
        medias: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200")',
        academico: 'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200")'
    };

    // Obtener elementos del DOM
    const navItems = document.querySelectorAll('.nav-item');
    const headerBackground = document.getElementById('headerBackground');
    const mainHeader = document.getElementById('mainHeader');

    // Población dinámica del menú "Medias Técnicas"
    (function populateMediasDropdown() {
        const mediasDropdown = document.querySelector('.nav-item[data-bg="medias"] .dropdown-menu');
        if (!mediasDropdown) return;
        // Evitar duplicados si ya tiene elementos
        if (mediasDropdown.children.length > 0) return;

        // Detectar si estamos dentro de la carpeta tecnicas
        const isTechniquePage = window.location.pathname.includes('/tecnicas/');
        const basePath = isTechniquePage ? '' : 'tecnicas/'; // Si estamos en html/tecnicas/ es directo, sino bajamos a tecnicas/

        const items = [
            { id: 'ambiental', label: 'Gestión Ambiental', url: basePath + 'ambiental.html' },
            { id: 'musica', label: 'Música y Producción Musical', url: basePath + 'musica.html' },
            { id: 'contenidos', label: 'Contenidos Digitales y Multimedia', url: basePath + 'contenidos.html' },
            { id: 'pascual', label: 'Programación (Pascual Bravo)', url: basePath + 'pascual.html' },
            { id: 'sena', label: 'Programación (SENA)', url: basePath + 'sena.html' }
        ];

        const currentPath = window.location.pathname;
        const currentId = currentPath.includes('/html/tecnicas/')
            ? currentPath.split('/').pop().replace('.html', '')
            : null;

        mediasDropdown.innerHTML = items
            .map(item => {
                const isCurrent = item.id === currentId;
                const aria = isCurrent ? ' aria-current="page"' : '';
                const cls = isCurrent ? ' class="active-page"' : '';
                return `<li><a href="${item.url}"${aria}${cls}>${item.label}</a></li>`;
            })
            .join('');

        // Marcar menú "Medias Técnicas" activo en técnica
        if (currentId) {
            const mediasNavItem = document.querySelector('.nav-item[data-bg="medias"]');
            if (mediasNavItem) mediasNavItem.classList.add('active-page');
        }

        // Sticky tabs guard para páginas sin tabs
        const tabs = document.querySelector('.tecnicas-tabs');
        if (tabs) {
            window.addEventListener('scroll', () => {
                const rect = tabs.getBoundingClientRect();
                tabs.classList.toggle('sticky', rect.top <= 0);
            });
        }
    })();
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

    // Sistema de Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Agregar active al seleccionado
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Scroll suave hacia el contenido
            setTimeout(() => {
                const targetPosition = document.querySelector('.tecnicas-content').offsetTop - 200;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        });
    });

    // Detectar hash en URL y activar tab correspondiente
    window.addEventListener('load', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const targetButton = document.querySelector(`[data-tab="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        }
    });

    // Smooth scroll para el indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const tabsNav = document.querySelector('.tabs-navigation');
            tabsNav.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Animación de números en hero stats
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const number = parseInt(text.replace('+', ''));
            let current = 0;
            const increment = number / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = hasPlus ? number + '+' : number;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos que necesitan animación
    document.querySelectorAll('.tecnica-info-box').forEach(box => {
        fadeInObserver.observe(box);
    });

    document.querySelectorAll('.galeria-item-tecnica').forEach(item => {
        fadeInObserver.observe(item);
    });

    // Animar stats cuando entran en viewport
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    // Lightbox para galería
    const galeriaItems = document.querySelectorAll('.galeria-item-tecnica');

    galeriaItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const label = this.querySelector('.galeria-label').textContent;

            // Crear lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-tecnica';
            lightbox.innerHTML = `
            <div class="lightbox-content-tecnica">
                <span class="lightbox-close-tecnica">&times;</span>
                <img src="${img.src}" alt="${label}">
                <div class="lightbox-caption">${label}</div>
            </div>
        `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Animar entrada
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);

            // Cerrar lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close-tecnica');
            closeBtn.addEventListener('click', () => closeLightbox(lightbox));

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox(lightbox);
                }
            });

            // Cerrar con ESC
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox(lightbox);
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    function closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Añadir estilos del lightbox dinámicamente
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
    .lightbox-tecnica {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox-content-tecnica {
        position: relative;
        max-width: 90%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .lightbox-content-tecnica img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-caption {
        color: #ffffff;
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
        font-weight: 600;
    }
    
    .lightbox-close-tecnica {
        position: absolute;
        top: -50px;
        right: 0;
        font-size: 48px;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 300;
    }
    
    .lightbox-close-tecnica:hover {
        transform: scale(1.2) rotate(90deg);
        color: #dc143c;
    }
`;
    document.head.appendChild(lightboxStyles);

    // Efecto parallax en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-tecnicas');

        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / hero.offsetHeight);
        }
    });

    // Efecto hover en tabs
    tabButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });

    // Animación de las info boxes al hacer hover
    document.querySelectorAll('.tecnica-info-box').forEach(box => {
        box.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        box.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Efecto de typing para subtítulo del hero (opcional)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;

        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    heroSubtitle.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 1500);
    }

    // Smooth scroll para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Detectar scroll y mostrar/ocultar tabs sticky
    let lastScroll = 0;
    const tabsNav = document.querySelector('.tabs-navigation');

    if (tabsNav) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                tabsNav.style.opacity = '1';
                tabsNav.style.pointerEvents = 'all';
            } else {
                tabsNav.style.opacity = '0.95';
            }

            lastScroll = currentScroll;
        });
    }

    // Añadir partículas flotantes al hero (opcional - decorativo)
    function createParticle() {
        const hero = document.querySelector('.hero-tecnicas');
        if (!hero) return;

        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = 'floatUp 6s linear';

        hero.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 6000);
    }

    // Crear partículas cada 500ms
    setInterval(createParticle, 500);

    // Añadir animación de partículas
    const particleAnimation = document.createElement('style');
    particleAnimation.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh);
            opacity: 0;
        }
    }
`;
    document.head.appendChild(particleAnimation);

    // Log de éxito
    console.log('🚀 Medias Técnicas cargadas exitosamente - I.E. Gilberto Alzate Avendaño');
})();