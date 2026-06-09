/**
 * Manual de Usuario - Navegación y scroll
 * Compatible con navegadores sin scroll-behavior
 */
(function () {
    'use strict';

    var supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    function smoothScrollTo(target) {
        if (!target) return;

        if (supportsSmoothScroll) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            target.scrollIntoView(true);
        }
    }

    function initBackToTop() {
        var backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;

        function toggleVisibility() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        backToTopButton.addEventListener('click', function (e) {
            e.preventDefault();
            var top = document.getElementById('inicio') || document.body;
            smoothScrollTo(top);
        });
    }

    function initAnchorLinks() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = anchor.getAttribute('href');
                if (!href || href === '#') return;

                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target);
                    if (history.pushState) {
                        history.pushState(null, '', href);
                    }
                }
            });
        });
    }

    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.manual-toc-nav a[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        function updateActiveLink() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            var current = '';

            sections.forEach(function (section) {
                var sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initBackToTop();
        initAnchorLinks();
        initActiveNav();
    });
})();
