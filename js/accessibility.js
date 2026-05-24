// ============================================================
// WIDGET DE ACCESIBILIDAD
// I.E. Gilberto Alzate Avendaño
// ============================================================

(function() {
    'use strict';

    class AccessibilityWidget {
        constructor() {
            this.toggle = document.querySelector('.accessibility-toggle');
            this.panel = document.querySelector('.accessibility-panel');
            this.fontSizeSlider = document.getElementById('fontSizeSlider');
            this.highContrastCheckbox = document.getElementById('highContrast');
            this.negativeContrastCheckbox = document.getElementById('negativeContrast');
            this.grayscaleCheckbox = document.getElementById('grayscale');
            this.dyslexiaFriendlyCheckbox = document.getElementById('dyslexiaFriendly');
            this.underlineLinksCheckbox = document.getElementById('underlineLinks');
            this.resetButton = document.querySelector('.accessibility-reset');

            this.init();
        }

        init() {
            if (!this.toggle) return;

            // Event listeners
            this.toggle.addEventListener('click', () => this.togglePanel());
            this.fontSizeSlider?.addEventListener('input', (e) => this.setFontSize(e.target.value));
            this.highContrastCheckbox?.addEventListener('change', (e) => this.toggleHighContrast(e.target.checked));
            this.negativeContrastCheckbox?.addEventListener('change', (e) => this.toggleNegativeContrast(e.target.checked));
            this.grayscaleCheckbox?.addEventListener('change', (e) => this.toggleGrayscale(e.target.checked));
            this.dyslexiaFriendlyCheckbox?.addEventListener('change', (e) => this.toggleDyslexiaFriendly(e.target.checked));
            this.underlineLinksCheckbox?.addEventListener('change', (e) => this.toggleUnderlineLinks(e.target.checked));
            this.resetButton?.addEventListener('click', () => this.resetSettings());

            // Cargar configuración guardada
            this.loadSettings();

            // Cerrar panel al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.accessibility-widget')) {
                    this.closePanel();
                }
            });
        }

        togglePanel() {
            if (this.panel.classList.contains('active')) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        }

        openPanel() {
            this.panel.classList.add('active');
            this.toggle.classList.add('active');
        }

        closePanel() {
            this.panel.classList.remove('active');
            this.toggle.classList.remove('active');
        }

        setFontSize(value) {
            const percentage = value / 100;
            document.body.style.fontSize = `${16 * percentage}px`;
            localStorage.setItem('a11y-font-size', value);
        }

        toggleHighContrast(enabled) {
            if (enabled) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
            localStorage.setItem('a11y-high-contrast', enabled);
        }

        toggleNegativeContrast(enabled) {
            if (enabled) {
                document.body.classList.add('negative-contrast');
            } else {
                document.body.classList.remove('negative-contrast');
            }
            localStorage.setItem('a11y-negative-contrast', enabled);
        }

        toggleGrayscale(enabled) {
            if (enabled) {
                document.body.classList.add('grayscale');
            } else {
                document.body.classList.remove('grayscale');
            }
            localStorage.setItem('a11y-grayscale', enabled);
        }

        toggleDyslexiaFriendly(enabled) {
            if (enabled) {
                document.body.classList.add('dyslexia-friendly');
            } else {
                document.body.classList.remove('dyslexia-friendly');
            }
            localStorage.setItem('a11y-dyslexia', enabled);
        }

        toggleUnderlineLinks(enabled) {
            if (enabled) {
                document.body.classList.add('underline-links');
            } else {
                document.body.classList.remove('underline-links');
            }
            localStorage.setItem('a11y-underline-links', enabled);
        }

        resetSettings() {
            // Limpiar clases
            document.body.classList.remove('high-contrast', 'negative-contrast', 'grayscale', 'dyslexia-friendly', 'underline-links');
            
            // Resetear estilos
            document.body.style.fontSize = '';

            // Resetear checkboxes
            if (this.highContrastCheckbox) this.highContrastCheckbox.checked = false;
            if (this.negativeContrastCheckbox) this.negativeContrastCheckbox.checked = false;
            if (this.grayscaleCheckbox) this.grayscaleCheckbox.checked = false;
            if (this.dyslexiaFriendlyCheckbox) this.dyslexiaFriendlyCheckbox.checked = false;
            if (this.underlineLinksCheckbox) this.underlineLinksCheckbox.checked = false;

            // Resetear slider
            if (this.fontSizeSlider) this.fontSizeSlider.value = 100;

            // Limpiar localStorage
            localStorage.removeItem('a11y-font-size');
            localStorage.removeItem('a11y-high-contrast');
            localStorage.removeItem('a11y-negative-contrast');
            localStorage.removeItem('a11y-grayscale');
            localStorage.removeItem('a11y-dyslexia');
            localStorage.removeItem('a11y-underline-links');
        }

        loadSettings() {
            // Cargar tamaño de fuente
            const savedFontSize = localStorage.getItem('a11y-font-size');
            if (savedFontSize && this.fontSizeSlider) {
                this.fontSizeSlider.value = savedFontSize;
                this.setFontSize(savedFontSize);
            }

            // Cargar alto contraste
            const savedHighContrast = localStorage.getItem('a11y-high-contrast');
            if (savedHighContrast === 'true') {
                if (this.highContrastCheckbox) this.highContrastCheckbox.checked = true;
                this.toggleHighContrast(true);
            }

            // Cargar contraste negativo
            const savedNegativeContrast = localStorage.getItem('a11y-negative-contrast');
            if (savedNegativeContrast === 'true') {
                if (this.negativeContrastCheckbox) this.negativeContrastCheckbox.checked = true;
                this.toggleNegativeContrast(true);
            }

            // Cargar escala de grises
            const savedGrayscale = localStorage.getItem('a11y-grayscale');
            if (savedGrayscale === 'true') {
                if (this.grayscaleCheckbox) this.grayscaleCheckbox.checked = true;
                this.toggleGrayscale(true);
            }

            // Cargar fuente amigable
            const savedDyslexia = localStorage.getItem('a11y-dyslexia');
            if (savedDyslexia === 'true') {
                if (this.dyslexiaFriendlyCheckbox) this.dyslexiaFriendlyCheckbox.checked = true;
                this.toggleDyslexiaFriendly(true);
            }

            // Cargar subrayar enlaces
            const savedUnderlineLinks = localStorage.getItem('a11y-underline-links');
            if (savedUnderlineLinks === 'true') {
                if (this.underlineLinksCheckbox) this.underlineLinksCheckbox.checked = true;
                this.toggleUnderlineLinks(true);
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AccessibilityWidget();
        });
    } else {
        new AccessibilityWidget();
    }
})();
