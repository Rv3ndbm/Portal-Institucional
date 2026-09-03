// ============================================
// CONTACTO.JS — Gestión de Formulario de Contacto
// I.E. Gilberto Alzate Avendaño
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFormTime();
    initCharCounter();
    initContactForm();
});

// 1. Inicializar timestamp para prevención de bots
function initFormTime() {
    const timeInput = document.getElementById('form_time');
    if (timeInput) {
        timeInput.value = Math.floor(Date.now() / 1000);
    }
}

// 2. Contador dinámico de caracteres en el mensaje
function initCharCounter() {
    const messageInput = document.getElementById('frmMessage');
    const charCountDisplay = document.getElementById('charCount');
    if (!messageInput || !charCountDisplay) return;

    messageInput.addEventListener('input', () => {
        const len = messageInput.value.length;
        charCountDisplay.textContent = `${len} / 4000`;
        if (len > 3800) {
            charCountDisplay.style.color = '#dc2626';
        } else {
            charCountDisplay.style.color = '';
        }
    });
}

// 3. Inicialización, validación y envío del formulario
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const alertBox = document.getElementById('formAlert');
    const alertText = document.getElementById('formAlertText');
    const successBox = document.getElementById('formSuccessMessage');
    const radicadoDisplay = document.getElementById('radicadoCode');
    const summaryDisplay = document.getElementById('successSummary');
    const submitBtn = document.getElementById('btnSubmitContact');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnIcon = submitBtn?.querySelector('.btn-icon');
    const btnNewMsg = document.getElementById('btnNewMessage');

    // Validar un campo específico
    function validateField(input) {
        const id = input.id;
        const val = input.value.trim();
        let isValid = true;
        let message = '';

        if (id === 'frmName') {
            if (!val) {
                isValid = false;
                message = 'Por favor ingresa tu nombre completo.';
            } else if (val.length < 3) {
                isValid = false;
                message = 'El nombre debe tener al menos 3 caracteres.';
            }
        } else if (id === 'frmEmail') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) {
                isValid = false;
                message = 'El correo electrónico es obligatorio.';
            } else if (!emailRegex.test(val)) {
                isValid = false;
                message = 'Ingresa un correo electrónico válido (ejemplo@correo.com).';
            }
        } else if (id === 'frmPhone') {
            if (val) {
                const phoneRegex = /^[0-9+\s().-]{7,25}$/;
                if (!phoneRegex.test(val)) {
                    isValid = false;
                    message = 'Ingresa un número telefónico válido (mínimo 7 dígitos).';
                }
            }
        } else if (id === 'frmSubject') {
            if (!val) {
                isValid = false;
                message = 'Por favor selecciona el motivo o asunto de tu mensaje.';
            }
        } else if (id === 'frmMessage') {
            if (!val) {
                isValid = false;
                message = 'Por favor escribe el detalle de tu consulta.';
            } else if (val.length < 10) {
                isValid = false;
                message = 'El mensaje debe contener al menos 10 caracteres.';
            }
        } else if (id === 'frmHabeas') {
            if (!input.checked) {
                isValid = false;
                message = 'Debes aceptar la autorización de tratamiento de datos personales.';
            }
        }

        const group = input.closest('.form-group');
        const errSpan = group?.querySelector('.form-error');

        if (group) {
            group.classList.toggle('has-error', !isValid);
            group.classList.toggle('is-valid', isValid && (input.type === 'checkbox' ? input.checked : val !== ''));
        }
        if (errSpan) {
            errSpan.textContent = message;
        }

        return isValid;
    }

    // Escuchar eventos de validación interactiva
    const inputs = form.querySelectorAll('.form-control, #frmHabeas');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group?.classList.contains('has-error')) {
                validateField(input);
            }
        });
        if (input.tagName === 'SELECT' || input.type === 'checkbox') {
            input.addEventListener('change', () => validateField(input));
        }
    });

    // Envío del formulario con AJAX (Fetch API)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar alertas previas
        if (alertBox) alertBox.style.display = 'none';

        // Validar todos los campos
        let formValid = true;
        let firstInvalidInput = null;

        inputs.forEach(input => {
            const isOk = validateField(input);
            if (!isOk) {
                formValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
            }
        });

        if (!formValid) {
            if (firstInvalidInput) {
                firstInvalidInput.focus();
                firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Estado: Enviando...
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('sending');
            if (btnText) btnText.textContent = 'Enviando Mensaje...';
            if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        }

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action || '../php/public/enviar_contacto.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Éxito en el envío
                form.style.display = 'none';

                if (radicadoDisplay) {
                    radicadoDisplay.textContent = data.data?.radicado || 'GAA-' + Math.floor(Math.random() * 90000 + 10000);
                }

                if (summaryDisplay && data.data) {
                    summaryDisplay.innerHTML = `
                        <strong>Resumen de tu mensaje:</strong><br>
                        • <strong>Remitente:</strong> ${escapeHtml(data.data.nombre)}<br>
                        • <strong>Correo:</strong> ${escapeHtml(data.data.email)}<br>
                        • <strong>Asunto:</strong> ${escapeHtml(data.data.asunto)}
                    `;
                }

                if (successBox) {
                    successBox.style.display = 'block';
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                form.reset();
                const charCountDisplay = document.getElementById('charCount');
                if (charCountDisplay) charCountDisplay.textContent = '0 / 4000';
            } else {
                // Errores reportados por el servidor
                let errorMsg = data.message || 'Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.';

                if (data.errors && typeof data.errors === 'object') {
                    // Marcar campos específicos con error
                    for (const [key, msg] of Object.entries(data.errors)) {
                        const fieldMap = {
                            nombre: 'frmName',
                            email: 'frmEmail',
                            telefono: 'frmPhone',
                            sede: 'frmSede',
                            asunto: 'frmSubject',
                            mensaje: 'frmMessage',
                            habeas_data: 'frmHabeas'
                        };
                        const inputId = fieldMap[key];
                        if (inputId) {
                            const errInput = document.getElementById(inputId);
                            const grp = errInput?.closest('.form-group');
                            const errSpan = grp?.querySelector('.form-error');
                            if (grp) grp.classList.add('has-error');
                            if (errSpan) errSpan.textContent = msg;
                        }
                    }
                }

                showFormError(errorMsg);
            }
        } catch (error) {
            console.error('Error enviando formulario:', error);
            showFormError('No pudimos conectar con el servidor. Por favor verifica tu conexión a internet o contáctanos directamente a nuestro correo institucional.');
        } finally {
            // Restaurar estado del botón
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('sending');
                if (btnText) btnText.textContent = 'Enviar Mensaje';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane btn-icon';
            }
        }
    });

    // Mostrar alerta de error
    function showFormError(msg) {
        if (alertBox && alertText) {
            alertText.textContent = msg;
            alertBox.style.display = 'flex';
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Botón "Enviar otra consulta"
    if (btnNewMsg) {
        btnNewMsg.addEventListener('click', () => {
            if (successBox) successBox.style.display = 'none';
            if (alertBox) alertBox.style.display = 'none';
            if (form) {
                form.style.display = 'block';
                initFormTime();
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// Utilidad para escapar HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
