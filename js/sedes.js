(function(){
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

// Intersection Observer para animaciones de aparición
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observar elementos de información general
const infoText = document.querySelector('.info-text');
const infoImage = document.querySelector('.info-image');

if (infoText) fadeInObserver.observe(infoText);
if (infoImage) fadeInObserver.observe(infoImage);

// Observar tarjetas de instalaciones
const instalacionCards = document.querySelectorAll('.instalacion-card');
instalacionCards.forEach((card, index) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, observerOptions);

    observer.observe(card);
});

// Observar programas
const programaBoxes = document.querySelectorAll('.programa-box');
programaBoxes.forEach((box, index) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    observer.observe(box);
});

// Observar items de contacto
const contactoItems = document.querySelectorAll('.contacto-item');
contactoItems.forEach((item, index) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, observerOptions);

    observer.observe(item);
});

// Observar mapa
const contactoMapa = document.querySelector('.contacto-mapa');
if (contactoMapa) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    observer.observe(contactoMapa);
}

// Observar galería
const galeriaItems = document.querySelectorAll('.galeria-item');
galeriaItems.forEach((item, index) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    observer.observe(item);
});

// Efecto parallax en el banner
const banner = document.querySelector('.sede-banner');
const bannerImage = document.querySelector('.banner-image');

if (banner && bannerImage) {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (scrolled < banner.offsetHeight) {
            bannerImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Click en items de galería para expandir (opcional - lightbox simple)
galeriaItems.forEach(item => {
    item.addEventListener('click', function () {
        const img = this.querySelector('img');
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Cerrar lightbox
        const closeBtn = overlay.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', function () {
            overlay.remove();
            document.body.style.overflow = 'auto';
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                document.body.style.overflow = 'auto';
            }
        });
    });
});

// Añadir estilos del lightbox dinámicamente
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox-overlay {
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
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90vh;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 40px;
        color: #ffffff;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .lightbox-close:hover {
        transform: scale(1.2) rotate(90deg);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(lightboxStyles);

// Efecto hover en highlights
const highlightItems = document.querySelectorAll('.highlight-item');
highlightItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        highlightItems.forEach(i => {
            if (i !== this) {
                i.style.opacity = '0.6';
            }
        });
    });

    item.addEventListener('mouseleave', function () {
        highlightItems.forEach(i => {
            i.style.opacity = '1';
        });
    });
});

// Animación de números contadores (si hay estadísticas)
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Smooth scroll para enlaces internos
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

// Efecto de typing en el subtítulo del banner (opcional)
const subtitle = document.querySelector('.sede-subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;

    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }, 1000);
}


// Animación para los símbolos (escudo y bandera)
const simboloBoxes = document.querySelectorAll('.simbolo-box');

const simboloObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 400);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

simboloBoxes.forEach(box => {
    simboloObserver.observe(box);
});

simboloBoxes.forEach(box => {
    box.addEventListener('mouseenter', function () {
        simboloBoxes.forEach(b => {
            if (b !== this) {
                b.style.opacity = '0.5';
                b.style.filter = 'blur(2px)';
            }
        });
    });

    box.addEventListener('mouseleave', function () {
        simboloBoxes.forEach(b => {
            b.style.opacity = '1';
            b.style.filter = 'blur(0)';
        });
    });
});

console.log('🏫 Página de Sede cargada con éxito - I.E. Gilberto Alzate Avendaño');
})();