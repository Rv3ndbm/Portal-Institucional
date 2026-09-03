// === PWA SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const path = (window.location?.pathname || '').replace(/\\/g, '/');
        let swPath = 'sw.js';
        if (path.includes('/php/public/') || path.includes('/html/tecnicas/')) {
            swPath = '../../sw.js';
        } else if (path.includes('/html/') || path.includes('/manuales/')) {
            swPath = '../sw.js';
        }
        navigator.serviceWorker.register(swPath).catch(() => {});
    });
}

// === LOADING SCREEN ===
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// Ocultar loading screen cuando la página carga completamente
window.addEventListener('load', hideLoadingScreen);

// También ocultar si el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoadingScreen, 300);
    initLazyLoading();
    updateManualConvivenciaLinks();
    initUrgentAnnouncementTicker();
});

// === AVISO URGENTE: INFINITE MARQUEE TICKER ===
function initUrgentAnnouncementTicker() {
    const path = (window.location?.pathname || '').replace(/\\/g, '/');
    let apiUrl = 'php/public/api_aviso.php';
    if (path.includes('/php/public/')) {
        apiUrl = 'api_aviso.php';
    } else if (path.includes('/html/tecnicas/')) {
        apiUrl = '../../php/public/api_aviso.php';
    } else if (path.includes('/html/') || path.includes('/manuales/')) {
        apiUrl = '../php/public/api_aviso.php';
    }

    fetch(apiUrl, { cache: 'no-store' })
        .then(response => {
            if (!response.ok) return { active: false };
            return response.json();
        })
        .then(data => {
            if (!data || !data.active) return;

            const dismissKey = `gaa_dismiss_aviso_${data.id}_${data.expires_at || 'perm'}`;
            if (sessionStorage.getItem(dismissKey) === 'true') {
                return;
            }

            const tickerSection = document.createElement('section');
            tickerSection.className = 'urgent-ticker-section';
            tickerSection.setAttribute('aria-label', 'Comunicado oficial institucional');

            const tipoClass = `ticker-${data.tipo || 'warning'}`;
            const tipoLabel = (data.tipo === 'danger') ? '🚨 Urgente' :
                              (data.tipo === 'info')   ? 'ℹ️ Comunicado' :
                              (data.tipo === 'success')? '✅ Institucional' : '⚠️ Importante';

            let linkHtml = '';
            if (data.enlace && data.enlace.trim() !== '') {
                let cleanLink = data.enlace.trim();
                if (!cleanLink.startsWith('http')) {
                    if (path.includes('/php/public/')) {
                        cleanLink = cleanLink.replace('../public/', '');
                    } else if (path.includes('/html/tecnicas/')) {
                        cleanLink = '../../' + cleanLink.replace('../../', '').replace('../', '');
                    } else if (path.includes('/html/') || path.includes('/manuales/')) {
                        cleanLink = '../' + cleanLink.replace('../', '');
                    }
                }
                const linkText = data.texto_enlace || 'Ver más';
                linkHtml = `<a href="${cleanLink}" class="ticker-item-link">${linkText} <i class="fas fa-arrow-right" style="font-size:0.75rem;"></i></a>`;
            }

            const itemHtml = `
                <span class="ticker-item">
                    <strong>${data.titulo}:</strong> ${data.mensaje}
                    ${linkHtml}
                </span>
                <span class="ticker-separator">✦</span>
            `;

            const blockContent = itemHtml.repeat(3);

            tickerSection.innerHTML = `
                <div class="urgent-ticker-wrapper ${tipoClass}">
                    <div class="ticker-badge">
                        <span class="ticker-pulse-dot"></span>
                        <span>${tipoLabel}</span>
                    </div>
                    <div class="ticker-viewport">
                        <div class="ticker-track">
                            <div class="ticker-content">${blockContent}</div>
                            <div class="ticker-content" aria-hidden="true">${blockContent}</div>
                        </div>
                    </div>
                    <button type="button" class="ticker-close-btn" title="Cerrar aviso" aria-label="Cerrar aviso">&times;</button>
                </div>
            `;

            // Insertar justo arriba de la galería 3D en index.html o en main
            const cylinderSection = document.querySelector('.cylinder-gallery-wrapper');
            if (cylinderSection && cylinderSection.parentNode) {
                cylinderSection.parentNode.insertBefore(tickerSection, cylinderSection);
            } else {
                const mainEl = document.querySelector('main');
                if (mainEl && mainEl.firstChild) {
                    mainEl.insertBefore(tickerSection, mainEl.firstChild);
                }
            }

            const closeBtn = tickerSection.querySelector('.ticker-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    tickerSection.style.opacity = '0';
                    tickerSection.style.transform = 'translateY(-10px)';
                    tickerSection.style.transition = 'all 0.3s ease';
                    sessionStorage.setItem(dismissKey, 'true');
                    setTimeout(() => {
                        tickerSection.remove();
                    }, 300);
                });
            }
        })
        .catch(() => {});
}

function updateManualConvivenciaLinks() {
    const file = 'MANUAL%20DE%20CONVIVENCIA%202026_IEGAA.docx.pdf';
    const path = (window.location?.pathname || '').replace(/\\/g, '/');

    let href = `media/${file}`;
    if (path.includes('/html/tecnicas/')) {
        href = `../../media/${file}`;
    } else if (path.includes('/html/') || path.includes('/manuales/')) {
        href = `../media/${file}`;
    }

    document.querySelectorAll('a').forEach(a => {
        const text = (a.textContent || '').trim();
        if (!text) return;
        if (/manual\s+de\s+convivencia/i.test(text)) {
            a.setAttribute('href', href);
        }
    });
}

// === MANEJO DE CONTACTOS POR EMAIL ===
/**
 * Detecta si el dispositivo es móvil y redirecciona al email apropiadamente.
 * - Desktop/Web: Abre Gmail web
 * - Móvil: Abre la app de Gmail (mediante mailto)
 */
function initEmailContacts() {
    // Función para detectar si es dispositivo móvil
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    };

    // Obtener todos los enlaces de email con la clase email-contact-link
    const emailLinks = document.querySelectorAll('.email-contact-link');

    emailLinks.forEach(link => {
        const email = link.getAttribute('data-email');
        if (!email) return;

        // Manejar el click
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isMobileDevice()) {
                // En móvil: usar mailto para abrir la app de Gmail
                window.location.href = `mailto:${email}`;
            } else {
                // En desktop: abrir Gmail web
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
            }
        });

        // Cambiar el href a # para que sea válido pero no navegue
        link.href = '#';
        link.style.cursor = 'pointer';
    });
}

// === LAZY LOADING DE IMÁGENES ===
function initLazyLoading() {
    // Si el navegador soporta Intersection Observer (más eficiente)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Fallback para navegadores antiguos: cargar todas las imágenes inmediatamente
    document.querySelectorAll('img[data-src]').forEach(img => {
        if (!img.src) {
            img.src = img.dataset.src;
        }
    });
}

// === CONFIGURACIÓN GLOBAL ===
const BREAKPOINT_TABLET = 1024;
const SCROLL_THRESHOLD = 50;

// Imágenes de fondo para cada sección del menú
const backgroundImages = {
    inicio: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200")',
    sedes: 'url("https://images.unsplash.com/photo-1562774053-701939374585?w=1200")',
    dependencias: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200")',
    departamentos: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200")',
    medias: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200")',
    academico: 'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200")'
};

// Obtener elementos del DOM
const navItems = document.querySelectorAll('.nav-item');
const headerBackground = document.getElementById('headerBackground');
const mainHeader = document.getElementById('mainHeader');
const mainNav = document.getElementById('mainNav');

// === MENÚ HAMBURGUESA ===
let hamburgerButton = null;
let isMenuOpen = false;

// Crear botón hamburguesa dinámicamente
function createHamburgerButton() {
    // Verificar si ya existe
    if (document.querySelector('.hamburger-button')) return;

    hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'hamburger-button';
    hamburgerButton.setAttribute('aria-label', 'Menú de navegación');
    hamburgerButton.setAttribute('aria-expanded', 'false');

    // Crear las 3 líneas del hamburguesa
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'hamburger-line';
        hamburgerButton.appendChild(line);
    }

    // Insertar en el header-top
    const headerTop = document.querySelector('.header-top');
    if (headerTop) {
        headerTop.insertBefore(hamburgerButton, headerTop.firstChild);
    }

    // Event listener
    hamburgerButton.addEventListener('click', toggleMenu);
}

// Toggle del menú
function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        openMenu();
    } else {
        closeMenu();
    }
}

// Abrir menú
function openMenu() {
    isMenuOpen = true;
    hamburgerButton?.classList.add('active');
    mainNav?.classList.add('active');
    document.body.classList.add('menu-open');
    hamburgerButton?.setAttribute('aria-expanded', 'true');

    // Cerrar al hacer click en el overlay
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);
}

// Cerrar menú
function closeMenu() {
    isMenuOpen = false;
    hamburgerButton?.classList.remove('active');
    mainNav?.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburgerButton?.setAttribute('aria-expanded', 'false');

    // Cerrar todos los dropdowns
    document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
        item.classList.remove('dropdown-open');
    });

    document.removeEventListener('click', handleOutsideClick);
}

// Cerrar al hacer click fuera del menú
function handleOutsideClick(e) {
    if (!mainNav?.contains(e.target) && !hamburgerButton?.contains(e.target)) {
        closeMenu();
    }
}

// Manejar dropdowns en móvil
function handleMobileDropdowns() {
    if (window.innerWidth <= BREAKPOINT_TABLET) {
        navItems.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');

            if (dropdown && dropdown.children.length > 0) {
                // Crear o actualizar el botón de toggle
                let toggleBtn = item.querySelector('.dropdown-toggle');

                if (!toggleBtn) {
                    toggleBtn = document.createElement('button');
                    toggleBtn.className = 'dropdown-toggle';
                    toggleBtn.setAttribute('aria-label', 'Expandir submenu');
                    toggleBtn.innerHTML = '<span class="toggle-arrow">▼</span>';
                    item.appendChild(toggleBtn);

                    toggleBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Cerrar otros dropdowns
                        document.querySelectorAll('.nav-item.dropdown-open').forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('dropdown-open');
                            }
                        });

                        // Toggle este dropdown
                        item.classList.toggle('dropdown-open');
                    });
                }
            }
        });
    }
}

// Cerrar menú al cambiar a desktop
function handleResize() {
    if (window.innerWidth > BREAKPOINT_TABLET && isMenuOpen) {
        closeMenu();
    }

    handleMobileDropdowns();
}

// Inicializar menú hamburguesa
function initHamburgerMenu() {
    createHamburgerButton();
    handleMobileDropdowns();

    window.addEventListener('resize', handleResize);
}

// === MARCADOR DE PÁGINA ACTUAL ===
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        let isActive = false;

        if (link) {
            const href = link.getAttribute('href') || '';
            const hrefFile = href.split('/').pop().split('#')[0];
            // Comparar el archivo del href con la página actual
            if (hrefFile === currentPage || ((currentPage === '' || currentPage === 'index.html') && hrefFile === 'index.html')) {
                isActive = true;
            }
        }

        // Si no hay coincidencia exacta, buscar en el dropdown
        if (!isActive && dropdown) {
            const dropdownLinks = dropdown.querySelectorAll('a');
            for (let dropLink of dropdownLinks) {
                const href = dropLink.getAttribute('href');

                // Coincidencia exacta por nombre de archivo
                if (href === currentPage) {
                    isActive = true;
                    break;
                }

                // Coincidencia por ruta completa (para subdirectorios)
                // Verificar si el href contiene la ruta actual
                if (href && currentPath.includes(href)) {
                    isActive = true;
                    break;
                }

                // Verificar si estamos en un subdirectorio relacionado
                // Por ejemplo: si href es "tecnicas/ambiental.html" y estamos en ambiental.html
                if (href && href.includes('/')) {
                    const hrefPage = href.split('/').pop();
                    if (hrefPage === currentPage) {
                        isActive = true;
                        break;
                    }
                }
            }
        }

        // Verificar si estamos en un subdirectorio y el menú principal apunta a ese directorio
        // Ejemplo: estamos en /tecnicas/ambiental.html y el link principal es tecnicas.html
        if (!isActive && link) {
            const href = link.getAttribute('href');
            // Extraer la carpeta del href (ej: "tecnicas.html" -> "tecnicas")
            const hrefBase = href ? href.replace('.html', '') : '';
            // Verificar si la ruta actual contiene esa carpeta
            if (hrefBase && currentPath.includes('/' + hrefBase + '/')) {
                isActive = true;
            }
        }

        // Aplicar clase activa
        if (isActive) {
            item.classList.add('active-page');
        } else {
            item.classList.remove('active-page');
        }
    });
}

// Llamar cuando carga la página
document.addEventListener('DOMContentLoaded', highlightCurrentPage);

// También llamar después de cambios de hash (para SPAs)
window.addEventListener('hashchange', highlightCurrentPage);

// === FONDOS DINÁMICOS DEL HEADER ===
navItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        // Solo en desktop
        if (window.innerWidth > BREAKPOINT_TABLET) {
            const bgType = this.getAttribute('data-bg');
            if (backgroundImages[bgType]) {
                headerBackground.style.backgroundImage = backgroundImages[bgType];
                headerBackground.classList.add('active');
            }
        }
    });

    item.addEventListener('mouseleave', function () {
        if (window.innerWidth > BREAKPOINT_TABLET) {
            headerBackground.classList.remove('active');
        }
    });
});

// === SCROLL HANDLER ===
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', function () {
    lastScrollTop = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
});

function handleScroll() {
    if (!mainHeader) {
        ticking = false;
        return;
    }

    const scrollPosition = lastScrollTop;

    if (scrollPosition > 50) {
        if (!mainHeader.classList.contains('scrolled')) {
            mainHeader.classList.add('scrolled');
        }
    } else if (scrollPosition < 20) {
        if (mainHeader.classList.contains('scrolled')) {
            mainHeader.classList.remove('scrolled');
        }
    }

    ticking = false;
}

// === INTERSECTION OBSERVER ===
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// Aplicar animación a todas las cajas de contenido
document.querySelectorAll('.content-box').forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(40px)';
    box.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    box.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(box);
});

// === EFECTOS DE HOVER (OPTIMIZADOS) ===
// Delegación de eventos para hover en nav-links
const isDesktop = () => window.innerWidth > BREAKPOINT_TABLET;

document.addEventListener('mouseover', function (e) {
    if (e.target.matches('.nav-link') && isDesktop()) {
        e.target.style.transform = 'translateY(-3px)';
    }
    if (e.target.matches('.dropdown-menu a') && isDesktop()) {
        e.target.style.transform = 'scale(1.05) translateX(5px)';
        e.target.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
});

document.addEventListener('mouseout', function (e) {
    if (e.target.matches('.nav-link') && isDesktop()) {
        e.target.style.transform = 'translateY(0)';
    }
    if (e.target.matches('.dropdown-menu a') && isDesktop()) {
        e.target.style.transform = 'scale(1) translateX(0)';
    }
});

// === EFECTO DE ONDA EN BOTÓN CTA ===
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Añadir animación de ripple al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === ANIMACIÓN SUAVE PARA EL VIDEO ===
const videoContainer = document.querySelector('.video-container video');
if (videoContainer) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'scale(1)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.3 });

    videoContainer.style.transform = 'scale(0.95)';
    videoContainer.style.opacity = '0';
    videoContainer.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
    videoObserver.observe(videoContainer);
}



// === CERRAR MENÚ AL HACER CLICK EN UN ENLACE ===
document.addEventListener('click', function (e) {
    // Solo cerrar si es un link directo (no un toggle button)
    if (e.target.matches('.nav-link') &&
        window.innerWidth <= BREAKPOINT_TABLET) {
        // Verificar si el nav-item tiene dropdown con items
        const navItem = e.target.closest('.nav-item');
        const dropdown = navItem?.querySelector('.dropdown-menu');

        // Solo cerrar si no tiene dropdown o si es móvil
        if (!dropdown || dropdown.children.length === 0) {
            closeMenu();
        }
    }
});

// === PREVENCIÓN DE SCROLL EN MÓVIL CUANDO EL MENÚ ESTÁ ABIERTO ===
let scrollPosition = 0;

function preventScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function allowScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
}

// Observar cambios en la clase menu-open
let wasMenuOpen = false;
const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            const isMenuOpenNow = document.body.classList.contains('menu-open');
            if (isMenuOpenNow !== wasMenuOpen) {
                if (isMenuOpenNow) {
                    preventScroll();
                } else {
                    allowScroll();
                }
                wasMenuOpen = isMenuOpenNow;
            }
        }
    });
});

bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

// === SEARCH: inicio ===
// COMPONENTE DE BÚSQUEDA RESPONSIVO CON AUTOCOMPLETADO
// Arquitectura: un único componente con dos puntos de montaje controlado por CSS.
// - Desktop (>1024px): botón lupa en el nav + panel slide-down bajo el header.
// - Móvil (≤1024px): campo de búsqueda como primer ítem del menú hamburguesa.
// El dropdown es position:fixed y flota sobre cualquier contenido, incluso el menú móvil.

// ── UTILIDADES DE BÚSQUEDA ──────────────────────────────────────────────────

/**
 * Normaliza texto: minúsculas + quita tildes/diacríticos.
 * Permite búsqueda "musica" que encuentre "música", etc.
 */
function normalizeText(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Filtra SEARCH_INDEX con la query del usuario usando un algoritmo de relevancia multi-palabra (Google-like).
 * Busca en título, descripción y palabras clave, asignando puntuaciones para ordenar los mejores resultados primero.
 * @param {string} query
 * @returns {Array} hasta 6 resultados ordenados por relevancia
 */
function runSearch(query) {
    if (!query || !query.trim() || typeof SEARCH_INDEX === 'undefined') {
        console.warn('Search Index no definido o query vacía');
        return [];
    }
    const q = normalizeText(query.trim());
    if (q.length < 2) return [];

    // Dividimos la búsqueda en palabras individuales para permitir búsquedas cruzadas (ej: "sede central")
    const queryWords = q.split(/\s+/).filter(word => word.length > 0);
    if (queryWords.length === 0) return [];

    // Determinar la ruta base para ajustar las URLs de búsqueda
    const path = (window.location?.pathname || '').replace(/\\/g, '/');

    const scoredResults = SEARCH_INDEX.map(item => {
        // Clonar el item para no modificar el original
        const newItem = { ...item };
        
        // Ajustar la URL solo si es relativa (no empieza con http)
        if (!newItem.url.startsWith('http')) {
            const cleanUrl = newItem.url.replace('html/', '');
            const isIndex = (cleanUrl === 'index.html' || cleanUrl.startsWith('index.html#'));

            if (path.includes('/php/')) {
                newItem.url = isIndex ? '../../' + cleanUrl : '../../html/' + cleanUrl;
            } else if (path.includes('/html/tecnicas/')) {
                newItem.url = isIndex ? '../../' + cleanUrl : '../' + cleanUrl;
            } else if (path.includes('/html/')) {
                newItem.url = isIndex ? '../' + cleanUrl : cleanUrl;
            } else if (path.includes('/manuales/')) {
                newItem.url = isIndex ? '../' + cleanUrl : '../html/' + cleanUrl;
            } else {
                newItem.url = isIndex ? cleanUrl : 'html/' + cleanUrl;
            }
        }

        // Sistema inteligente de Scoring por relevancia
        let score = 0;
        const normTitle = normalizeText(newItem.titulo || '');
        const normDesc = normalizeText(newItem.descripcion || '');
        const normKeywords = Array.isArray(newItem.keywords) ? newItem.keywords.map(kw => normalizeText(kw)) : [];

        // 1. Coincidencia exacta de toda la query en el título (Prioridad máxima)
        if (normTitle === q) {
            score += 150;
        } else if (normTitle.includes(q)) {
            score += 80;
        }

        // 2. Coincidencia exacta de toda la query en palabras clave
        if (normKeywords.includes(q)) {
            score += 60;
        }

        // 3. Coincidencia palabra por palabra (Búsqueda flexible / multi-término)
        let matchedWordsCount = 0;
        queryWords.forEach(word => {
            let wordMatched = false;

            // Buscar en el título
            if (normTitle.includes(word)) {
                score += 25;
                wordMatched = true;
            }

            // Buscar en la descripción
            if (normDesc.includes(word)) {
                score += 10;
                wordMatched = true;
            }

            // Buscar en keywords
            normKeywords.forEach(kw => {
                if (kw === word) {
                    score += 20;
                    wordMatched = true;
                } else if (kw.includes(word)) {
                    score += 8;
                    wordMatched = true;
                }
            });

            if (wordMatched) {
                matchedWordsCount++;
            }
        });

        // 4. Bonus si el item contiene TODAS las palabras que el usuario buscó
        if (matchedWordsCount === queryWords.length) {
            score += 50;
        }

        newItem.score = score;
        return newItem;
    });

    // Filtrar resultados con coincidencia real (score > 0) y ordenar descendente
    return scoredResults
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
}

/**
 * Crea o actualiza el dropdown flotante de resultados bajo el input dado.
 * Muestra títulos y una descripción enriquecida con copywriting.
 * @param {Array}       results  — array de resultados de runSearch()
 * @param {HTMLElement} anchor   — el <input> bajo el cual se posiciona el dropdown
 * @param {Function}    onClose  — callback opcional para cerrar el buscador principal
 */
function renderDropdown(results, anchor, onClose) {
    // Reutilizar o crear el contenedor del dropdown
    let dropdown = document.getElementById('searchDropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'searchDropdown';
        dropdown.className = 'search-dropdown';
        dropdown.setAttribute('role', 'listbox');
        document.body.appendChild(dropdown);
    }

    // Vaciar contenido previo
    dropdown.innerHTML = '';

    if (results.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'search-dropdown-empty';
        empty.textContent = 'No se encontraron resultados';
        dropdown.appendChild(empty);
    } else {
        results.forEach((item) => {
            const el = document.createElement('a');
            el.className = 'search-dropdown-item';
            el.setAttribute('role', 'option');
            el.setAttribute('href', item.url);
            
            // Si es URL externa, abrir en nueva pestaña
            if (item.url.startsWith('http')) {
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }

            // Estructura HTML enriquecida para mostrar título y descripción descriptiva
            el.innerHTML = `
                <div class="search-item-header">
                    <span class="search-item-title">${item.titulo}</span>
                </div>
                <div class="search-item-desc">${item.descripcion || ''}</div>
            `;

            el.addEventListener('click', () => {
                closeDropdown();
                if (typeof onClose === 'function') onClose();
            });
            dropdown.appendChild(el);
        });
    }

    // Posicionar bajo el input
    positionDropdown(dropdown, anchor);
    dropdown.classList.add('search-dropdown--visible');
}

/**
 * Posiciona el dropdown bajo el input anchor usando getBoundingClientRect().
 */
function positionDropdown(dropdown, anchor) {
    const rect = anchor.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 4) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
}

/** Oculta y vacía el dropdown */
function closeDropdown() {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) {
        dropdown.classList.remove('search-dropdown--visible');
        dropdown.innerHTML = '';
    }
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

function initSearchComponent() {
    const header = document.getElementById('mainHeader');
    const nav = document.getElementById('mainNav');
    if (!header || !nav) return;

    const navContainer = nav.querySelector('.nav-container');
    if (!navContainer) return;

    // Evitar doble inicialización
    if (document.querySelector('.search-bar-panel')) return;

    // ── 1. BOTÓN LUPA (desktop nav) ──────────────────────────────────────────
    const searchToggleBtn = document.createElement('button');
    searchToggleBtn.className = 'search-toggle-btn';
    searchToggleBtn.setAttribute('aria-label', 'Abrir buscador');
    searchToggleBtn.setAttribute('aria-expanded', 'false');
    searchToggleBtn.setAttribute('aria-controls', 'searchBarPanel');
    searchToggleBtn.innerHTML = '<i class="fas fa-magnifying-glass"></i>';
    navContainer.appendChild(searchToggleBtn);

    // ── 2. PANEL DESKTOP (slide down bajo el header) ─────────────────────────
    const searchBarPanel = document.createElement('div');
    searchBarPanel.className = 'search-bar-panel';
    searchBarPanel.id = 'searchBarPanel';
    searchBarPanel.setAttribute('role', 'search');
    searchBarPanel.innerHTML = `
        <div class="search-bar-inner">
            <input
                type="search"
                class="search-input"
                id="searchInputDesktop"
                placeholder="Buscar en el sitio…"
                aria-label="Buscar en el sitio"
                autocomplete="off"
            >
            <button class="search-submit-btn" type="button" aria-label="Realizar búsqueda">
                <i class="fas fa-magnifying-glass"></i>
                Buscar
            </button>
        </div>
    `;
    header.appendChild(searchBarPanel);

    // ── 3. BUSCADOR MÓVIL (primer hijo del nav-container) ────────────────────
    const mobileSearchWrapper = document.createElement('div');
    mobileSearchWrapper.className = 'mobile-search-wrapper';
    mobileSearchWrapper.setAttribute('role', 'search');
    mobileSearchWrapper.innerHTML = `
        <form class="mobile-search-form" autocomplete="off">
            <label for="searchInputMobile" aria-label="Buscar">
                <i class="fas fa-magnifying-glass"></i>
            </label>
            <input
                type="search"
                class="mobile-search-input"
                id="searchInputMobile"
                placeholder="Buscar en el sitio…"
                aria-label="Buscar en el sitio"
            >
            <button class="mobile-search-submit" type="submit" aria-label="Realizar búsqueda">
                <i class="fas fa-arrow-right"></i>
            </button>
        </form>
    `;
    navContainer.insertBefore(mobileSearchWrapper, navContainer.firstChild);

    // ── ESTADO ───────────────────────────────────────────────────────────────
    let isSearchOpen = false;

    function openSearch() {
        isSearchOpen = true;
        searchBarPanel.classList.add('search-open');
        searchToggleBtn.classList.add('active');
        searchToggleBtn.setAttribute('aria-expanded', 'true');
        searchToggleBtn.setAttribute('aria-label', 'Cerrar buscador');
        const input = document.getElementById('searchInputDesktop');
        if (input) setTimeout(() => input.focus(), 50);
        setTimeout(() => {
            document.addEventListener('click', handleSearchOutsideClick);
        }, 50);
    }

    function closeSearch() {
        isSearchOpen = false;
        searchBarPanel.classList.remove('search-open');
        searchToggleBtn.classList.remove('active');
        searchToggleBtn.setAttribute('aria-expanded', 'false');
        searchToggleBtn.setAttribute('aria-label', 'Abrir buscador');
        closeDropdown();
        document.removeEventListener('click', handleSearchOutsideClick);
    }

    function handleSearchOutsideClick(e) {
        const dropdown = document.getElementById('searchDropdown');
        const isInPanel = searchBarPanel.contains(e.target);
        const isInToggle = searchToggleBtn.contains(e.target);
        const isInDropdown = dropdown && dropdown.contains(e.target);
        if (!isInPanel && !isInToggle && !isInDropdown) {
            closeSearch();
            closeDropdown();
        }
    }

    // Toggle botón lupa
    searchToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSearchOpen) closeSearch(); else openSearch();
    });

    // Cerrar con Escape (desktop)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isSearchOpen) {
                closeSearch();
                searchToggleBtn.focus();
            }
            closeDropdown();
        }
    });

    // Cerrar panel al cambiar a móvil
    window.addEventListener('resize', () => {
        if (window.innerWidth <= BREAKPOINT_TABLET && isSearchOpen) closeSearch();
        // Reposicionar dropdown si está visible
        const desktopInput = document.getElementById('searchInputDesktop');
        const mobileInput = document.getElementById('searchInputMobile');
        const dropdown = document.getElementById('searchDropdown');
        if (dropdown && dropdown.classList.contains('search-dropdown--visible')) {
            const activeInput = document.activeElement;
            if (activeInput === desktopInput || activeInput === mobileInput) {
                positionDropdown(dropdown, activeInput);
            }
        }
    });

    // ── AUTOCOMPLETADO — DESKTOP ─────────────────────────────────────────────
    const desktopInput = document.getElementById('searchInputDesktop');
    const desktopSubmitBtn = searchBarPanel.querySelector('.search-submit-btn');

    if (desktopInput) {
        // Mostrar dropdown mientras el usuario escribe
        desktopInput.addEventListener('input', () => {
            const q = desktopInput.value.trim();
            if (q.length < 2) { closeDropdown(); return; }
            const results = runSearch(q);
            renderDropdown(results, desktopInput, closeSearch);
        });

        // Enter navega al primer resultado (o no hace nada si está vacío)
        desktopInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const first = document.querySelector('.search-dropdown-item');
                if (first) first.click();
            }
        });
    }

    if (desktopSubmitBtn) {
        desktopSubmitBtn.addEventListener('click', () => {
            const first = document.querySelector('.search-dropdown-item');
            if (first) first.click();
        });
    }

    // ── AUTOCOMPLETADO — MÓVIL ───────────────────────────────────────────────
    const mobileForm = mobileSearchWrapper.querySelector('.mobile-search-form');
    const mobileInput = document.getElementById('searchInputMobile');

    if (mobileInput) {
        mobileInput.addEventListener('input', () => {
            const q = mobileInput.value.trim();
            if (q.length < 2) { closeDropdown(); return; }
            const results = runSearch(q);
            renderDropdown(results, mobileInput, null);
        });
    }

    if (mobileForm) {
        mobileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const first = document.querySelector('.search-dropdown-item');
            if (first) { first.click(); closeDropdown(); }
        });
    }

    // Cerrar dropdown global al hacer clic fuera (también para móvil)
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('searchDropdown');
        if (!dropdown) return;
        const activeInput = document.getElementById('searchInputMobile') ||
            document.getElementById('searchInputDesktop');
        if (
            dropdown.classList.contains('search-dropdown--visible') &&
            !dropdown.contains(e.target) &&
            e.target !== desktopInput &&
            e.target !== mobileInput
        ) {
            closeDropdown();
        }
    });
}
// === SEARCH: fin ===

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initSearchComponent();
    console.log('🎯 Página web del I.E. Gilberto Alzate Avendaño cargada con éxito!');
    console.log('📱 Menú hamburguesa activado para móviles y tablets');
    console.log('🔍 Componente de búsqueda responsivo activado');
});

// === ACCESIBILIDAD - NAVEGACIÓN CON TECLADO ===
document.addEventListener('keydown', (e) => {
    // Cerrar menú con ESC
    if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
    }

    // Toggle menú con Space o Enter cuando el botón tiene focus
    if ((e.key === ' ' || e.key === 'Enter') && document.activeElement === hamburgerButton) {
        e.preventDefault();
        toggleMenu();
    }
});

// === MEJORA PARA TÁCTIL ===
let touchStartX = 0;
let touchEndX = 0;

if (mainNav) {
    mainNav.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainNav.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    // Swipe hacia la izquierda para cerrar
    if (touchStartX - touchEndX > 50 && isMenuOpen) {
        closeMenu();
    }
}

// ============================================
// NAVEGACIÓN DINÁMICA - OCULTAR PÁGINA ACTUAL
// ============================================

/**
 * DESACTIVADA - El usuario quiere todos los botones del header siempre visibles
 * Oculta el botón de navegación de la página actual en el header
 * Excepción: SEDES siempre se muestra
 */
function hideCurrentPageNav() {
    // Función desactivada - todos los botones permanecen visibles
    return;

    /* CÓDIGO ORIGINAL COMENTADO
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Mapeo de páginas a data-bg attributes
    const pageNavMap = {
        'index.html': 'inicio',
        'historia.html': 'inicio',
        'deportes.html': null, // Deportes no tiene botón principal, está en dropdown
        'dependencias.html': 'dependencias',
        'departamentos.html': 'dependencias',
        'tecnicas.html': 'medias',
        'sedes.html': 'sedes',
        // Páginas de sedes individuales
        'sede-san-isidro.html': 'sedes',
        'sede-seguros-bolivar.html': 'sedes',
        'sede-tomas-carrasquilla.html': 'sedes',
        'sede-carlos-villa.html': 'sedes',
        'sede-central.html': 'sedes'
    };

    const navBg = pageNavMap[currentPage];

    // No ocultar SEDES nunca, ni ACADÉMICO, ni OTROS SERVICIOS
    if (navBg && navBg !== 'sedes' && navBg !== 'academico') {
        navItems.forEach(item => {
            if (item.dataset.bg === navBg) {
                item.style.display = 'none';
            }
        });
    }
    */
}

/**
 * Oculta los enlaces del footer que corresponden a la página actual
 */
function hideCurrentPageFooter() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const footerLinks = document.querySelectorAll('.footer-links a');

    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Comparar nombre de archivo
            const linkPage = href.split('/').pop().split('#')[0];
            if (linkPage === currentPage) {
                link.parentElement.style.display = 'none';
            }
        }
    });
}

/**
 * Oculta "Nuestras Sedes" en el footer solo cuando estamos en sedes.html
 */
function hideSedesInFooter() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'sedes.html') {
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === 'sedes.html') {
                link.parentElement.style.display = 'none';
            }
        });
    }
}

// Ejecutar las funciones cuando la página carga
document.addEventListener('DOMContentLoaded', function () {
    hideCurrentPageFooter();
    hideSedesInFooter();
    initCoverflow3D();
    initScrollAnimations();
});

// === 3D CYLINDER CAROUSEL - GALERÍA INFINITA ===
class CylinderCarousel3D {
    constructor() {
        this.gallery = document.getElementById('scene3D');
        this.track = document.getElementById('cylinderTrack');
        this.prevBtn = document.getElementById('cylinderPrevBtn');
        this.nextBtn = document.getElementById('cylinderNextBtn');

        if (!this.gallery || !this.track) return;

        this.cards = Array.from(this.track.querySelectorAll('.cylinder-card'));
        this.numCards = this.cards.length;
        this.theta = 360 / this.numCards; // Ángulo entre cada tarjeta
        this.radius = 0;
        this.currentAngle = 0; // Ángulo total girado
        this.currentIndex = 0; // Índice visual actual

        // Variables para arrastrar
        this.isDragging = false;
        this.hasDragged = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragSensitivity = 0.7; // Aumentado ligeramente para mejor respuesta
        this.startAngle = 0;
        this.dragThreshold = 10; // Umbral para considerar que se ha arrastrado

        this.init();
    }

    init() {
        this.calculateRadius();
        this.positionCards();
        this.attachEventListeners();
        this.updateActiveCard();
        this.rotateCarousel(false);
    }

    calculateRadius() {
        // Tarjeta tiene ancho móvil de 260px o desktop de 520px (CSS)
        const isMobile = window.innerWidth <= 768;
        const CARD_WIDTH = isMobile ? 260 : 520;
        // Radio correcto para que las tarjetas no se solapen ni queden muy separadas
        this.radius = Math.round((CARD_WIDTH / 2) / Math.tan(Math.PI / this.numCards)) + (isMobile ? 50 : 100);
    }

    positionCards() {
        this.cards.forEach((card, i) => {
            const cardAngle = this.theta * i;
            /*
             * Posición 3D correcta:
             * 1. Rotamos la tarjeta alrededor del eje Y del track
             * 2. La desplazamos hacia afuera (translateZ) por el radio
             * El track es un nodo 0x0 en el centro => cada tarjeta queda
             * en su posición orbitando alrededor de ese punto central.
             */
            card.style.transform = `rotateY(${cardAngle}deg) translateZ(${this.radius}px)`;
        });
        /*
         * No necesitamos transformOrigin en el track:
         * su tamaño es 0x0, el origen ya es su centro.
         */
    }

    attachEventListeners() {
        // Controles de botones
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.rotateBy(-1));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.rotateBy(1));

        // Drag con mouse
        this.gallery.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.dragMove(e));
        document.addEventListener('mouseup', (e) => this.dragEnd(e));

        // Swipe con touch
        this.gallery.addEventListener('touchstart', (e) => this.dragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.dragMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.dragEnd(e));

        // Recalcular al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            this.calculateRadius();
            this.positionCards();
            this.rotateCarousel(false);
        });

        // Click en tarjetas específicas para navegar o traerlas al frente
        this.cards.forEach((card, i) => {
            // Prevent image drag
            card.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });

            card.addEventListener('click', (e) => {
                // Si se arrastró, no hacer nada
                if (this.hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (i === this.currentIndex) {
                    // Si ya está activa frente a mí, ir al link
                    const link = card.dataset.link;
                    if (link) window.location.href = link;
                } else {
                    // Si está al lado, girar hacia ella
                    let diff = i - this.currentIndex;
                    // Ajustar para el camino más corto
                    if (diff > this.numCards / 2) diff -= this.numCards;
                    if (diff < -this.numCards / 2) diff += this.numCards;
                    this.rotateBy(diff);
                }
            });

            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'link');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    rotateBy(direction) {
        this.currentIndex = (this.currentIndex + direction + this.numCards) % this.numCards;
        this.currentAngle -= direction * this.theta;
        this.rotateCarousel(true);
        this.updateActiveCard();
    }

    dragStart(e) {
        if (e.type.includes('mouse')) {
            e.preventDefault();
        }

        this.isDragging = true;
        this.hasDragged = false;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        this.startAngle = this.currentAngle;

        this.track.style.transition = 'none';
        this.gallery.style.cursor = 'grabbing';
    }

    dragMove(e) {
        if (!this.isDragging) return;

        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const diffX = currentX - this.startX;
        const diffY = currentY - this.startY;

        if (e.type.includes('touch')) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            } else {
                return;
            }
        } else {
            e.preventDefault();
        }

        if (Math.abs(diffX) > this.dragThreshold) {
            this.hasDragged = true;
        }

        this.currentAngle = this.startAngle + (diffX * this.dragSensitivity);
        this.track.style.transform = `translateZ(${-this.radius}px) rotateY(${this.currentAngle}deg)`;
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.gallery.style.cursor = 'grab';

        // Ajustar al ángulo (tarjeta) más cercano al soltar
        const exactIndex = Math.round(this.currentAngle / -this.theta);

        // Actualizar el índice garantizando valores positivos (módulo)
        this.currentIndex = ((exactIndex % this.numCards) + this.numCards) % this.numCards;

        // Fijar en una posición exacta
        this.currentAngle = exactIndex * -this.theta;

        this.rotateCarousel(true);
        this.updateActiveCard();
    }

    rotateCarousel(animate = true) {
        this.track.style.transition = animate ? 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
        this.track.style.transform = `translateZ(${-this.radius}px) rotateY(${this.currentAngle}deg)`;
    }

    updateActiveCard() {
        this.cards.forEach((card, i) => {
            if (i === this.currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
}

function initCoverflow3D() {
    new CylinderCarousel3D();
}

// === SCROLL ANIMATIONS - Elementos aparecen según scroll ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con data-scroll-animate
    document.querySelectorAll('[data-scroll-animate]').forEach(el => {
        observer.observe(el);
    });
}

// === INFINITE SLIDER (SMOOTH CONTINUOUS MARQUEE) ===
class ContinuousInfiniteSlider {
    constructor() {
        this.slider = document.getElementById('infiniteSlider');
        this.container = document.querySelector('.slider-container');
        if (!this.slider || !this.container) return;

        this.items = Array.from(this.slider.querySelectorAll('.slider-item'));
        if (this.items.length === 0) return;

        this.position = 0;
        this.speed = 0.8; // Velocidad del scroll automático
        this.isHovered = false;
        this.isDragging = false;
        this.dragStartX = 0;

        this.init();
    }

    init() {
        // Clonar elementos para crear el efecto infinito (2 copias extra = 3 sets en total)
        this.cloneItems();

        this.attachEventListeners();
        this.startAnimation();
    }

    cloneItems() {
        const clones1 = this.items.map(item => item.cloneNode(true));
        const clones2 = this.items.map(item => item.cloneNode(true));

        clones1.forEach(clone => this.slider.appendChild(clone));
        clones2.forEach(clone => this.slider.appendChild(clone));

        this.allItems = Array.from(this.slider.querySelectorAll('.slider-item'));
    }

    attachEventListeners() {
        // Pausar auto-scroll al pasar el mouse
        this.container.addEventListener('mouseenter', () => this.isHovered = true);
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.isDragging = false;
            this.container.style.cursor = 'grab';
        });

        // Control de Drag y Touch
        const startDrag = (e) => {
            if (e.target.tagName.toLowerCase() === 'img') e.preventDefault();
            this.isDragging = true;
            this.container.style.cursor = 'grabbing';
            this.dragStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        };

        const moveDrag = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diff = currentX - this.dragStartX;

            this.position -= diff;
            this.dragStartX = currentX;
            this.updateTransform();
        };

        const stopDrag = () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
        };

        this.container.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', stopDrag);

        this.container.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchmove', moveDrag, { passive: false });
        window.addEventListener('touchend', stopDrag);

        // Soporte para Trackpad (Gesto de dos dedos)
        this.container.addEventListener('wheel', (e) => {
            // Si el scroll horizontal es mayor al vertical, es un gesto de galería (prevenir scroll de página)
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
            }

            // Usar deltaX para scroll horizontal, sino usar deltaY si usan un ratón común sobre él
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            this.position += delta;
            this.updateTransform();
        }, { passive: false });
    }

    startAnimation() {
        const animate = () => {
            if (!this.isHovered && !this.isDragging) {
                this.position += this.speed;
            }
            this.updateTransform();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    updateTransform() {
        if (this.items.length === 0) return;

        // Medir ancho dinámicamente usando offset del primer clon vs original
        const firstItem = this.items[0];
        const firstClone = this.allItems[this.items.length];

        if (!firstItem || !firstClone) return;

        const setWidth = firstClone.offsetLeft - firstItem.offsetLeft;
        if (setWidth <= 0) return;

        // Logica de looping infinito
        if (this.position >= setWidth) {
            this.position -= setWidth;
        } else if (this.position < 0) {
            this.position += setWidth;
        }

        this.slider.style.transform = `translate3d(${-this.position}px, 0, 0)`;
    }
}

// Inicializar slider
document.addEventListener('DOMContentLoaded', () => {
    new ContinuousInfiniteSlider();
});
