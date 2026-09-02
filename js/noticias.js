/* ============================================
   NOTICIAS SECTION SCRIPTS
   I.E. Gilberto Alzate Avendaño
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    // 1. FILTRADO POR CATEGORÍAS
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.textContent.trim().toLowerCase();

            newsCards.forEach(card => {
                const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
                if (category === 'todas' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. MODAL DE LECTURA COMPLETA
    const modal = document.getElementById('newsModal');
    const modalClose = document.querySelector('.news-modal-close');
    const modalOverlay = document.querySelector('.news-modal-overlay');
    const modalImageDisplay = document.getElementById('modalImageDisplay');
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalDateText = document.getElementById('modalDateText');
    const modalTitleText = document.getElementById('modalTitleText');
    const modalFullContent = document.getElementById('modalFullContent');

    function openModal(card) {
        if (!modal) return;

        const categoryBadge = card.querySelector('.category');
        const dateEl = card.querySelector('.card-date');
        const titleEl = card.querySelector('.card-title') || card.querySelector('.featured-title');
        const imagePlaceholder = card.querySelector('.card-image-placeholder');
        const fullContentEl = card.querySelector('.full-content');

        if (imagePlaceholder && modalImageDisplay) {
            modalImageDisplay.style.backgroundImage = imagePlaceholder.style.backgroundImage;
            modalImageDisplay.style.backgroundSize = 'cover';
            modalImageDisplay.style.backgroundPosition = 'center';
        }

        if (categoryBadge && modalCategoryBadge) {
            modalCategoryBadge.className = categoryBadge.className;
            modalCategoryBadge.textContent = categoryBadge.textContent;
        }

        if (dateEl && modalDateText) {
            modalDateText.innerHTML = dateEl.innerHTML;
        }

        if (titleEl && modalTitleText) {
            modalTitleText.textContent = titleEl.textContent;
        }

        if (fullContentEl && modalFullContent) {
            modalFullContent.innerHTML = fullContentEl.innerHTML;
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Click en tarjetas de noticias
    newsCards.forEach(card => {
        card.addEventListener('click', function (e) {
            openModal(this);
        });
    });

    // Click en Noticia Destacada
    const featuredCard = document.getElementById('featuredNews');
    const featuredBtn = document.querySelector('.btn-open-modal-featured');
    if (featuredCard && featuredBtn) {
        featuredBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(featuredCard);
        });

        featuredCard.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() !== 'a') {
                openModal(featuredCard);
            }
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
