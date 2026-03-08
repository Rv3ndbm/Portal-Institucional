// ============================================
// CALENDARIO.JS - LÓGICA DE PÁGINA CALENDARIO
// I.E. Gilberto Alzate Avendaño
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initCalendarPage();
});

function initCalendarPage() {
    renderNews();
    renderSports();
    animateElements();
}

/* === DATOS MOCKUP (NOTICIAS) === */
const newsData = [
    {
        id: 1,
        date: '15 Feb, 2026',
        title: 'Inicio de Clases - Periodo 1',
        snippet: 'Damos la bienvenida a toda la comunidad estudiantil al nuevo año lectivo con entusiasmo.'
    },
    {
        id: 2,
        date: '20 Feb, 2026',
        title: 'Reunión de Padres de Familia',
        snippet: 'Primer encuentro del año para socializar las metas académicas y convivenciales.'
    },
    {
        id: 3,
        date: '28 Feb, 2026',
        title: 'Feria de la Ciencia',
        snippet: 'Invitamos a los estudiantes a inscribir sus proyectos innovadores antes del cierre de mes.'
    },
    {
        id: 4,
        date: '05 Mar, 2026',
        title: 'Día de la Excelencia',
        snippet: 'Reconocimiento a los mejores promedios y deportistas destacados del semestre anterior.'
    }
];

/* === DATOS MOCKUP (DEPORTES) === */
const sportsData = [
    {
        id: 1,
        date: '18 FEB - 3:00 PM',
        match: 'Grado 10° vs Grado 11°',
        category: 'Fútbol',
        image: '../img/deporte tc.jpg' // Usando imagen existente
    },
    {
        id: 2,
        date: '22 FEB - 10:00 AM',
        match: 'Torneo de Voleibol Mixto',
        category: 'Voleibol',
        image: '../img/deporte ce.webp' // Usando imagen existente
    },
    {
        id: 3,
        date: '25 FEB - 4:00 PM',
        match: 'Selección GAA vs I.E. Concejo',
        category: 'Baloncesto',
        image: '../img/deportes si.jpg' // Usando imagen existente
    },
    {
        id: 4,
        date: '28 FEB - 9:00 AM',
        match: 'Torneo Relámpago Microfútbol',
        category: 'Microfútbol',
        image: '../img/deporta cv.jpg'
    }
];

/* === RENDERIZADO DE NOTICIAS === */
function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    container.innerHTML = '';

    newsData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'news-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <span class="news-date">${item.date}</span>
            <h4 class="news-headline">${item.title}</h4>
            <p class="news-snippet">${item.snippet}</p>
        `;

        container.appendChild(card);
    });
}

/* === RENDERIZADO DE DEPORTES === */
function renderSports() {
    const container = document.getElementById('sports-container');
    if (!container) return;

    container.innerHTML = '';

    sportsData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'sport-card fade-in';
        card.style.animationDelay = `${(index * 0.1) + 0.3}s`; // Un poco de retraso respecto a noticias

        // Fallback por si la imagen no carga o no existe
        const imgStyle = item.image ? `background-image: url('${item.image}');` : `background-color: var(--color-primary);`;

        card.innerHTML = `
            <div class="sport-bg" style="${imgStyle}"></div>
            <span class="sport-tag">${item.category}</span>
            <div class="sport-info">
                <div class="sport-date">${item.date}</div>
                <div class="sport-match">${item.match}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

/* === ANIMACIONES EXTRA === */
function animateElements() {
    const calendarWrapper = document.querySelector('.calendar-wrapper-large');
    if (calendarWrapper) {
        calendarWrapper.classList.add('fade-in');
        calendarWrapper.style.animationDelay = '0.2s';
    }
}
