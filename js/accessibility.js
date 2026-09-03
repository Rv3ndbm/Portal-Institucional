// ============================================================
// WIDGET DE ACCESIBILIDAD — JS ROBUSTO Y FLUIDO
// I.E. Gilberto Alzate Avendaño
// ============================================================

(function() {
    'use strict';

    class AccessibilityWidget {
        constructor() {
            this.toggle = document.querySelector('.accessibility-toggle');
            this.panel = document.querySelector('.accessibility-panel');
            this.increaseTextBtn = document.getElementById('increaseTextBtn');
            this.decreaseTextBtn = document.getElementById('decreaseTextBtn');
            this.currentFontSize = 100;
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
            this.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });

            this.increaseTextBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.adjustFontSize(10);
            });

            this.decreaseTextBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.adjustFontSize(-10);
            });

            this.highContrastCheckbox?.addEventListener('change', (e) => {
                this.toggleHighContrast(e.target.checked);
            });

            this.negativeContrastCheckbox?.addEventListener('change', (e) => {
                this.toggleNegativeContrast(e.target.checked);
            });

            this.grayscaleCheckbox?.addEventListener('change', (e) => {
                this.toggleGrayscale(e.target.checked);
            });

            this.dyslexiaFriendlyCheckbox?.addEventListener('change', (e) => {
                this.toggleDyslexiaFriendly(e.target.checked);
            });

            this.underlineLinksCheckbox?.addEventListener('change', (e) => {
                this.toggleUnderlineLinks(e.target.checked);
            });

            this.resetButton?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetSettings();
            });

            // Evitar que clics dentro del panel lo cierren
            this.panel?.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Cargar configuración guardada
            this.loadSettings();

            // Cerrar panel al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (this.panel && !this.panel.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.closePanel();
                }
            });
        }

        togglePanel() {
            if (this.panel?.classList.contains('active')) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        }

        openPanel() {
            this.panel?.classList.add('active');
            this.toggle?.classList.add('active');
        }

        closePanel() {
            this.panel?.classList.remove('active');
            this.toggle?.classList.remove('active');
        }

        adjustFontSize(delta) {
            // Rango de 80% a 180%
            this.currentFontSize = Math.max(80, Math.min(180, this.currentFontSize + delta));
            this.setFontSize(this.currentFontSize);
        }

        setFontSize(value) {
            document.documentElement.style.fontSize = value === 100 ? '' : `${value}%`;
            localStorage.setItem('a11y-font-size', value);
        }

        toggleHighContrast(enabled) {
            document.documentElement.classList.toggle('high-contrast', enabled);
            document.body?.classList.toggle('high-contrast', enabled);
            localStorage.setItem('a11y-high-contrast', enabled ? 'true' : 'false');
        }

        toggleNegativeContrast(enabled) {
            document.documentElement.classList.toggle('negative-contrast', enabled);
            document.body?.classList.toggle('negative-contrast', enabled);
            localStorage.setItem('a11y-negative-contrast', enabled ? 'true' : 'false');
        }

        toggleGrayscale(enabled) {
            document.documentElement.classList.toggle('grayscale', enabled);
            document.body?.classList.toggle('grayscale', enabled);
            localStorage.setItem('a11y-grayscale', enabled ? 'true' : 'false');
        }

        toggleDyslexiaFriendly(enabled) {
            document.documentElement.classList.toggle('dyslexia-friendly', enabled);
            document.body?.classList.toggle('dyslexia-friendly', enabled);
            localStorage.setItem('a11y-dyslexia', enabled ? 'true' : 'false');
        }

        toggleUnderlineLinks(enabled) {
            document.documentElement.classList.toggle('underline-links', enabled);
            document.body?.classList.toggle('underline-links', enabled);
            localStorage.setItem('a11y-underline-links', enabled ? 'true' : 'false');
        }

        resetSettings() {
            // Limpiar clases en html y body
            const classes = ['high-contrast', 'negative-contrast', 'grayscale', 'dyslexia-friendly', 'underline-links'];
            document.documentElement.classList.remove(...classes);
            document.body?.classList.remove(...classes);
            
            // Resetear estilos de fuente
            document.documentElement.style.fontSize = '';
            this.currentFontSize = 100;

            // Resetear checkboxes
            if (this.highContrastCheckbox) this.highContrastCheckbox.checked = false;
            if (this.negativeContrastCheckbox) this.negativeContrastCheckbox.checked = false;
            if (this.grayscaleCheckbox) this.grayscaleCheckbox.checked = false;
            if (this.dyslexiaFriendlyCheckbox) this.dyslexiaFriendlyCheckbox.checked = false;
            if (this.underlineLinksCheckbox) this.underlineLinksCheckbox.checked = false;

            // Limpiar localStorage
            localStorage.removeItem('a11y-font-size');
            localStorage.removeItem('a11y-high-contrast');
            localStorage.removeItem('a11y-negative-contrast');
            localStorage.removeItem('a11y-grayscale');
            localStorage.removeItem('a11y-dyslexia');
            localStorage.removeItem('a11y-underline-links');
        }

        loadSettings() {
            try {
                // Tamaño de fuente
                const savedFontSize = localStorage.getItem('a11y-font-size');
                if (savedFontSize) {
                    this.currentFontSize = parseInt(savedFontSize, 10) || 100;
                    if (this.currentFontSize !== 100) {
                        this.setFontSize(this.currentFontSize);
                    }
                }

                // Alto contraste
                if (localStorage.getItem('a11y-high-contrast') === 'true') {
                    if (this.highContrastCheckbox) this.highContrastCheckbox.checked = true;
                    this.toggleHighContrast(true);
                }

                // Contraste negativo
                if (localStorage.getItem('a11y-negative-contrast') === 'true') {
                    if (this.negativeContrastCheckbox) this.negativeContrastCheckbox.checked = true;
                    this.toggleNegativeContrast(true);
                }

                // Escala de grises
                if (localStorage.getItem('a11y-grayscale') === 'true') {
                    if (this.grayscaleCheckbox) this.grayscaleCheckbox.checked = true;
                    this.toggleGrayscale(true);
                }

                // Fuente dislexia
                if (localStorage.getItem('a11y-dyslexia') === 'true') {
                    if (this.dyslexiaFriendlyCheckbox) this.dyslexiaFriendlyCheckbox.checked = true;
                    this.toggleDyslexiaFriendly(true);
                }

                // Subrayar enlaces
                if (localStorage.getItem('a11y-underline-links') === 'true') {
                    if (this.underlineLinksCheckbox) this.underlineLinksCheckbox.checked = true;
                    this.toggleUnderlineLinks(true);
                }
            } catch (err) {
                console.warn('No se pudieron cargar los ajustes de accesibilidad de localStorage:', err);
            }
        }
    }

    // Inicialización al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AccessibilityWidget());
    } else {
        new AccessibilityWidget();
    }
})();
