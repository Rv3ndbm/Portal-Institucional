// ============================================
// CONTACTO.JS — Página Contáctanos
// I.E. Gilberto Alzate Avendaño
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initContactForm();
    // Ensure all elements are visible after 500ms timeout
    setTimeout(() => {
        const elements = document.querySelectorAll('[data-contact-animate]');
        elements.forEach(el => {
            if (!el.classList.contains('animated')) {
                el.classList.add('animated');
            }
        });
    }, 500);
});

// === ANIMACIONES DE SCROLL ===
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-contact-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// === VALIDACIÓN Y ENVÍO DEL FORMULARIO ===
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successMessage = document.getElementById('formSuccessMessage');
    const submitBtn = form.querySelector('.form-submit-btn');
    const btnIcon = submitBtn?.querySelector('i');
    const btnText = submitBtn?.querySelector('span');

    // Validar campo individual
    function validateField(input) {
        const group = input.closest('.form-group');
        const errorEl = group?.querySelector('.form-error');
        let isValid = true;
        let errorMsg = '';

        const value = input.value.trim();

        if (input.required && !value) {
            isValid = false;
            errorMsg = 'Este campo es obligatorio.';
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMsg = 'Por favor ingresa un email válido.';
            }
        }

        if (group) {
            group.classList.toggle('has-error', !isValid);
            input.classList.toggle('error', !isValid);
            input.classList.toggle('success', isValid && value !== '');
        }

        if (errorEl) errorEl.textContent = errorMsg;

        return isValid;
    }

    // Validar en tiempo real (al salir del campo)
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });

    // Submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos los campos
        let allValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) allValid = false;
        });

        if (!allValid) return;

        // Estado "enviando..."
        submitBtn.classList.add('sending');
        if (btnText) btnText.textContent = 'Enviando...';
        if (btnIcon) { btnIcon.className = 'fas fa-spinner fa-spin'; }

        // Simular envío (timeout — sin backend real)
        await new Promise(resolve => setTimeout(resolve, 1800));

        // Mostrar mensaje de éxito
        form.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => {
            form.style.display = 'none';
            if (successMessage) {
                successMessage.classList.add('visible');
            }
        }, 400);
    });
}

// Animación de salida del formulario
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
