/**
 * CARRUSEL DE NOTICIAS DINÁMICO PARA INDEX
 * Conectado en tiempo real con la base de datos y panel de administración
 * I.E. Gilberto Alzate Avendaño
 */

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('newsCarouselTrack');
    const viewport = document.getElementById('newsCarouselViewport');
    const prevBtn = document.getElementById('newsPrevBtn');
    const nextBtn = document.getElementById('newsNextBtn');
    const dotsContainer = document.getElementById('newsCarouselDots');
    const modal = document.getElementById('homeNewsModal');
    const modalCloseBtn = document.getElementById('homeNewsModalClose');

    if (!track) return;

    let newsData = [];
    let currentIndex = 0;
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    // Categorías con etiquetas amigables
    const categoryLabels = {
        sedes: 'Sedes',
        culturales: 'Cultural',
        deportivas: 'Deportes',
        parroquiales: 'Comunidad'
    };

    // 1. Obtener noticias de la API
    async function loadNews() {
        try {
            const response = await fetch('php/public/api_noticias.php?limit=8');
            if (!response.ok) throw new Error('Error de red');
            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.noticias) && data.noticias.length > 0) {
                newsData = data.noticias;
                renderCarousel();
            } else {
                renderEmptyState();
            }
        } catch (error) {
            console.warn('No se pudieron cargar noticias dinámicas:', error);
            renderEmptyState();
        }
    }

    // 2. Renderizar tarjetas en el track
    function renderCarousel() {
        track.innerHTML = '';

        newsData.forEach((item, index) => {
            const cat = (item.category || 'sedes').toLowerCase();
            const catLabel = categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
            const imageSrc = item.image_url ? item.image_url : 'img/banner ce.JPG';

            const card = document.createElement('article');
            card.className = 'news-card-slide';
            card.setAttribute('role', 'group');
            card.setAttribute('aria-label', `${index + 1} de ${newsData.length}`);
            card.dataset.index = index;

            card.innerHTML = `
                <div class="news-card-img-wrap">
                    <img class="news-card-img" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='img/banner ce.JPG'">
                    <span class="news-category-badge cat-${escapeHtml(cat)}">${escapeHtml(catLabel)}</span>
                </div>
                <div class="news-card-body">
                    <div class="news-card-date">
                        <i class="far fa-calendar-alt"></i>
                        <span>${escapeHtml(item.date_label || 'Reciente')}</span>
                    </div>
                    <h3 class="news-card-title">${escapeHtml(item.title)}</h3>
                    <p class="news-card-excerpt">${escapeHtml(item.excerpt)}</p>
                    <span class="news-card-action">
                        Leer más <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            `;

            // Abrir modal de lectura completa
            card.addEventListener('click', () => openModal(item));

            track.appendChild(card);
        });

        setupDots();
        updateCarousel();
        startAutoplay();
    }

    function renderEmptyState() {
        track.innerHTML = `
            <div class="news-empty-notice">
                <i class="far fa-newspaper"></i>
                <p>Pronto publicaremos nuevas noticias y comunicados institucionales.</p>
                <a href="php/public/noticias.php" class="btn-read-more">Visitar sección de noticias →</a>
            </div>
        `;
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    // 3. Cantidad de tarjetas visibles por breakpoint
    function getCardsPerView() {
        const width = window.innerWidth;
        if (width > 1024) return 3;
        if (width > 640) return 2;
        return 1;
    }

    function getMaxIndex() {
        const perView = getCardsPerView();
        return Math.max(0, newsData.length - perView);
    }

    // 4. Configurar puntos de navegación (dots)
    function setupDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxIdx = getMaxIndex();
        const numDots = maxIdx + 1;

        if (numDots <= 1) {
            dotsContainer.style.display = 'none';
            return;
        }

        dotsContainer.style.display = 'flex';

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir a página ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // 5. Actualizar desplazamiento y controles
    function updateCarousel() {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const firstCard = track.querySelector('.news-card-slide');
        if (!firstCard) return;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = 24; // Espacio entre tarjetas
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Actualizar dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        // Actualizar estado de botones
        if (prevBtn) prevBtn.disabled = (currentIndex === 0);
        if (nextBtn) nextBtn.disabled = (currentIndex >= maxIdx);
    }

    function nextSlide() {
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
            currentIndex++;
        } else {
            currentIndex = 0; // Bucle suave al inicio
        }
        updateCarousel();
    }

    function prevSlide() {
        const maxIdx = getMaxIndex();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIdx; // Bucle al final
        }
        updateCarousel();
    }

    // Eventos de botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoplay();
        });
    }

    // 6. Autoplay
    function startAutoplay() {
        stopAutoplay();
        if (newsData.length > getCardsPerView()) {
            autoplayTimer = setInterval(nextSlide, 5000);
        }
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pausar en hover
    if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoplay);
        viewport.addEventListener('mouseleave', startAutoplay);

        // Soporte táctil / swipe
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Resize listener
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupDots();
            updateCarousel();
        }, 150);
    });

    // 7. Modal de lectura completa
    function openModal(item) {
        if (!modal) return;
        const cat = (item.category || 'sedes').toLowerCase();
        const catLabel = categoryLabels[cat] || cat;
        const imageSrc = item.image_url ? item.image_url : 'img/banner ce.JPG';

        const modalImg = modal.querySelector('#homeModalImg');
        const modalCat = modal.querySelector('#homeModalCategory');
        const modalDate = modal.querySelector('#homeModalDate');
        const modalTitle = modal.querySelector('#homeModalTitle');
        const modalText = modal.querySelector('#homeModalText');
        const modalFullLink = modal.querySelector('#homeModalFullLink');

        if (modalImg) modalImg.src = imageSrc;
        if (modalCat) {
            modalCat.textContent = catLabel;
            modalCat.className = `news-category-badge cat-${cat}`;
        }
        if (modalDate) modalDate.textContent = item.date_label || 'Noticia reciente';
        if (modalTitle) modalTitle.textContent = item.title;
        if (modalText) modalText.textContent = item.content || item.excerpt;
        if (modalFullLink) modalFullLink.href = item.url || 'php/public/noticias.php';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('home-news-modal-overlay') || e.target.classList.contains('news-modal-overlay') || e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Iniciar carga
    loadNews();
});
