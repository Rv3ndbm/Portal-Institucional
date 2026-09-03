(function(){
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

const DESKTOP_BREAKPOINT = 1024;

function syncDesktopHeaderOffset() {
    if (!mainHeader) return;

    if (window.innerWidth > DESKTOP_BREAKPOINT) {
        const headerHeight = mainHeader.offsetHeight;
        document.body.style.paddingTop = headerHeight ? `${headerHeight}px` : '';
        return;
    }

    document.body.style.paddingTop = '';
}

window.requestAnimationFrame(syncDesktopHeaderOffset);
window.addEventListener('resize', () => window.requestAnimationFrame(syncDesktopHeaderOffset));

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

// AQUÍ CONFIGURAS TUS LINKS
const antiguosLink = document.getElementById('antiguos-link');
const nuevosLink = document.getElementById('nuevos-link');

// Link para estudiantes antiguos
antiguosLink.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'https://estudiante.alzate.edu.co/';
});

// Link para pre-inscripción (nuevos)
nuevosLink.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'https://inscripcion.alzate.edu.co/';
});

// ===== SISTEMA DE PARTÍCULAS ANIMADAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// Configurar tamaño del canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Clase Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebotar en los bordes
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Crear array de partículas
const particlesArray = [];
const numberOfParticles = 80;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

// Conectar partículas cercanas
function connectParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 600})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animar partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Animación de entrada para las tarjetas
const opcionCards = document.querySelectorAll('.opcion-card');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const cardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
                entry.target.style.transition = 'all 0.8s ease';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        }
    });
}, observerOptions);

opcionCards.forEach(card => {
    cardsObserver.observe(card);
});

// Efecto de hover mejorado en las carpetas
opcionCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        const icon = this.querySelector('.folder-icon');
        icon.style.transform = 'scale(1.15) translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
        const icon = this.querySelector('.folder-icon');
        icon.style.transform = 'scale(1) translateY(0)';
    });
});

// Interacción del mouse con partículas
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    particlesArray.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            particle.x -= dx / 20;
            particle.y -= dy / 20;
        }
    });
});

console.log('🎨 Página de Pre-Inscripción cargada con animaciones CHIMBA - I.E. Gilberto Alzate Avendaño');
})();
