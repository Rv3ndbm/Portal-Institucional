/* ============================================
   NOTICIAS SECTION SCRIPTS
   I.E. Gilberto Alzate Avendaño
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Noticias section loaded');

    // === Filter Button Logic ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.textContent.trim().toLowerCase();
            console.log('Filtering by:', category);

            // Mock filtering logic
            if (category === 'todas') {
                newsCards.forEach(card => card.style.display = 'flex');
            } else {
                newsCards.forEach(card => {
                    const cardCategory = card.querySelector('.category').textContent.trim().toLowerCase();
                    if (cardCategory === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // === Load More Logic (Mock) ===
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const originalText = this.textContent;
            this.textContent = 'Cargando...';
            this.disabled = true;

            setTimeout(() => {
                alert('Esta es una demostración. En una versión completa, esto cargaría más noticias del servidor.');
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    }

    // === Hover Effects for Cards (Optional JS enhancement) ===
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            // You could add dynamic effects here if CSS hover isn't enough
        });
    });

    // === Modal Logic ===
    const modal = document.getElementById('newsModal');
    const modalClose = document.querySelector('.news-modal-close');
    const modalOverlay = document.querySelector('.news-modal-overlay');

    const modalImageDisplay = document.getElementById('modalImageDisplay');
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalDateText = document.getElementById('modalDateText');
    const modalTitleText = document.getElementById('modalTitleText');
    const modalFullContent = document.getElementById('modalFullContent');

    const readMoreBtns = document.querySelectorAll('.btn-read-more-card');

    function openModal(card) {
        // Extract data from card
        const categoryBadge = card.querySelector('.category');
        const date = card.querySelector('.card-date').textContent;
        const title = card.querySelector('.card-title').textContent;
        const imagePlaceholder = card.querySelector('.card-image-placeholder');
        const fullContent = card.querySelector('.full-content').innerHTML;

        // Populate modal
        modalImageDisplay.style.background = imagePlaceholder.style.background;
        modalImageDisplay.innerHTML = imagePlaceholder.innerHTML;

        modalCategoryBadge.className = categoryBadge.className;
        modalCategoryBadge.textContent = categoryBadge.textContent;

        modalDateText.textContent = date;
        modalTitleText.textContent = title;
        modalFullContent.innerHTML = fullContent;

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    newsCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Si el clic viene de otro enlace diferente al botón de leer más, no abrir modal
            if (e.target.tagName.toLowerCase() === 'a' && !e.target.classList.contains('card-link')) {
                return;
            }
            e.preventDefault();
            openModal(this);
        });
    });

    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Modificar lógica de filtrado para que use data-attribute
    filterBtns.forEach(btn => {
        // re-atado en caso de limpiar evento previo (opcional ya que se corre arriba, pero mejoramos la original)
        btn.onclick = function (e) {
            e.preventDefault();
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.textContent.trim().toLowerCase();

            if (category === 'todas') {
                newsCards.forEach(card => card.style.display = 'flex');
            } else {
                newsCards.forEach(card => {
                    // Usamos data-category en vez de re-buscar el texto de la category
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        };
    });
});
