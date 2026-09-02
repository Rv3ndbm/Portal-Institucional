(function(){

// ============================================================
// TOGGLE PARA ACCORDION DE HISTORIA
// ============================================================
const historiaToggle = document.getElementById('historiaToggle');
const historiaAccordion = document.getElementById('historiaAccordion');

if (historiaToggle && historiaAccordion) {
    historiaToggle.addEventListener('click', function() {
        const isActive = historiaAccordion.classList.contains('active');
        
        if (isActive) {
            historiaAccordion.classList.remove('active');
            historiaToggle.classList.remove('active');
            historiaToggle.innerHTML = '<span>Mostrar Historia Completa</span><span class="toggle-icon">▼</span>';
        } else {
            historiaAccordion.classList.add('active');
            historiaToggle.classList.add('active');
            historiaToggle.innerHTML = '<span>Ocultar Historia</span><span class="toggle-icon">▼</span>';
        }
    });
}

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
const headerTop = document.getElementById('headerTop');

// Event listeners para mostrar fondos en el header al pasar mouse por el menú
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

// Animación de scroll - Header minimizado con menú separado
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

    // Si el scroll es mayor a 50px, minimizar el header
    if (scrollPosition > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
}

// Smooth scroll con offset para los quick-nav items
const quickNavItems = document.querySelectorAll('.quick-nav-item');

quickNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = mainHeader ? mainHeader.offsetHeight : 120;
                const offset = 30; // espacio extra entre header y sección
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});


// ANIMACIÓN DESHABILITADA - Los párrafos ahora se muestran directamente sin animación
// const historiaParagraphs = document.querySelectorAll('.historia-paragraph');
// 
// const historiaObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry, index) => {
//         if (entry.isIntersecting) {
//             setTimeout(() => {
//                 entry.target.classList.add('visible');
//             }, index * 200); // Cada párrafo aparece con delay
//         }
//     });
// }, {
//     threshold: 0.2,
//     rootMargin: '0px 0px -100px 0px'
// });
// 
// historiaParagraphs.forEach(paragraph => {
//     historiaObserver.observe(paragraph);
// });

// ANIMACIÓN DESHABILITADA - Misión y Visión ahora se muestran directamente
// const mvBoxes = document.querySelectorAll('.mv-box');
// 
// const mvObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry, index) => {
//         if (entry.isIntersecting) {
//             setTimeout(() => {
//                 entry.target.classList.add('visible');
//             }, index * 300);
//         }
//     });
// }, {
//     threshold: 0.3
// });
// 
// mvBoxes.forEach(box => {
//     mvObserver.observe(box);
// });

// ANIMACIÓN DESHABILITADA - Himno ahora se muestra directamente
// const himnoElements = document.querySelectorAll('.himno-estrofa, .himno-coro');
// 
// const himnoObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry, index) => {
//         if (entry.isIntersecting) {
//             setTimeout(() => {
//                 entry.target.classList.add('visible');
//             }, index * 150);
//         }
//     });
// }, {
//     threshold: 0.2
// });
// 
// himnoElements.forEach(element => {
//     himnoObserver.observe(element);
// });

// Efecto de opacidad entre estrofas al hacer hover
const estrofas = document.querySelectorAll('.himno-estrofa');

estrofas.forEach(estrofa => {
    estrofa.addEventListener('mouseenter', function () {
        estrofas.forEach(e => {
            if (e !== this) {
                e.style.opacity = '0.4';
                e.style.filter = 'blur(2px)';
            }
        });
        // También afectar al coro
        const coro = document.querySelector('.himno-coro');
        if (coro) {
            coro.style.opacity = '0.4';
            coro.style.filter = 'blur(2px)';
        }
    });

    estrofa.addEventListener('mouseleave', function () {
        estrofas.forEach(e => {
            e.style.opacity = '1';
            e.style.filter = 'blur(0)';
        });
        const coro = document.querySelector('.himno-coro');
        if (coro) {
            coro.style.opacity = '1';
            coro.style.filter = 'blur(0)';
        }
    });
});

// Efecto especial para el coro
const coro = document.querySelector('.himno-coro');
if (coro) {
    coro.addEventListener('mouseenter', function () {
        estrofas.forEach(e => {
            e.style.opacity = '0.4';
            e.style.filter = 'blur(2px)';
        });
    });

    coro.addEventListener('mouseleave', function () {
        estrofas.forEach(e => {
            e.style.opacity = '1';
            e.style.filter = 'blur(0)';
        });
    });
}

// ANIMACIÓN DESHABILITADA - Símbolos ahora se muestran directamente
// const simboloBoxes = document.querySelectorAll('.simbolo-box');
// 
// const simboloObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry, index) => {
//         if (entry.isIntersecting) {
//             setTimeout(() => {
//                 entry.target.classList.add('visible');
//             }, index * 400);
//         }
//     });
// }, {
//     threshold: 0.2,
//     rootMargin: '0px 0px -50px 0px'
// });
// 
// simboloBoxes.forEach(box => {
//     simboloObserver.observe(box);
// });

// Efecto de hover en símbolos - opaca los demás
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

// Efecto parallax suave en el cuadro de historia
let lastScrollTop = 0;
const historiaBox = document.querySelector('.historia-text-box');

window.addEventListener('scroll', function () {
    if (historiaBox) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const boxRect = historiaBox.getBoundingClientRect();

        if (boxRect.top < window.innerHeight && boxRect.bottom > 0) {
            const speed = 0.3;
            const yPos = -(scrollTop * speed);
            historiaBox.style.backgroundPosition = `center ${yPos}px`;
        }
    }
});

// Efecto de escritura antigua - Cambia el color del texto gradualmente
const paragraphs = document.querySelectorAll('.historia-paragraph p');

paragraphs.forEach(p => {
    p.addEventListener('mouseenter', function () {
        this.style.color = '#1e3c72';
        this.style.transition = 'color 0.5s ease';
    });

    p.addEventListener('mouseleave', function () {
        this.style.color = '#2c2416';
    });
});

// Contador de scroll para mostrar progreso de lectura (opcional)
const historiaContainer = document.querySelector('.historia-text-box');

if (historiaContainer) {
    window.addEventListener('scroll', function () {
        const rect = historiaContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const totalHeight = rect.height;
            const percentVisible = (visibleHeight / totalHeight) * 100;

            // Puedes usar este porcentaje para crear una barra de progreso si quieres
            // console.log(`Visible: ${percentVisible}%`);
        }
    });
}

// Animación de entrada para el título de cada sección
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
        }
    });
}, {
    threshold: 0.5
});

sectionTitles.forEach(title => {
    titleObserver.observe(title);
});

// Efecto de brillo en los iconos de misión y visión
const mvIcons = document.querySelectorAll('.mv-icon');

mvIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))';
    });

    icon.addEventListener('mouseleave', function () {
        this.style.filter = 'brightness(0) invert(1)';
    });
});

// Efecto de ondulación en el pergamino al hacer clic
if (historiaBox) {
    historiaBox.addEventListener('click', function (e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(139, 69, 19, 0.3)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleHistory 1s ease-out';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });

    // Añadir animación de ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleHistory {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('📜 Página de Historia cargada con éxito - I.E. Gilberto Alzate Avendaño');
})();

