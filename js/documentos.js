// ============================================
// DOCUMENTOS.JS - GESTIÓN DE DOCUMENTOS
// I.E. Gilberto Alzate Avendaño
// ============================================

// Mapeo de documentos con URLs
const documentMap = {
    'manual-convivencia': {
        view: 'https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf',
        download: 'https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf'
    },
    'pei': {
        view: '#',
        download: '#'
    },
    'plan-academico': {
        view: '#',
        download: '#'
    },
    'reglamento-estudiantes': {
        view: '#',
        download: '#'
    },
    'protocolos-seguridad': {
        view: '#',
        download: '#'
    },
    'evaluacion-desempeño': {
        view: '#',
        download: '#'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Manejo de botones "Ver en línea"
    const viewButtons = document.querySelectorAll('.btn-view-online');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.document-card');
            const docId = card.getAttribute('data-doc-id');
            
            if (documentMap[docId] && documentMap[docId].view !== '#') {
                // Abrir en nueva pestaña o modal
                window.open(documentMap[docId].view, '_blank');
            } else {
                console.log('Documento no configurado:', docId);
                showNotification('Este documento aún no está disponible', 'info');
            }
        });
    });
    
    // Manejo de botones "Descargar"
    const downloadButtons = document.querySelectorAll('.btn-download');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.document-card');
            const docId = card.getAttribute('data-doc-id');
            
            if (documentMap[docId] && documentMap[docId].download !== '#') {
                // Descargar documento
                const link = document.createElement('a');
                link.href = documentMap[docId].download;
                link.download = `${docId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('Descarga iniciada', 'success');
            } else {
                console.log('Descarga no disponible:', docId);
                showNotification('La descarga aún no está disponible', 'info');
            }
        });
    });
});

// Función auxiliar para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// === LAZY LOADING IMAGES ===
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Inicializar lazy loading cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}
