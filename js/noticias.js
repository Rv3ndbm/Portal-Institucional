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
});
