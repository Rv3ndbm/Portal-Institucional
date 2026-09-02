const ADMIN_SECRET = 'alzatista-admin-2026';
const ADMIN_PASSWORD = 'alzate2026';
const NEWS_STORAGE_KEY = 'gaaNoticias';

const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const backToNoticias = document.getElementById('backToNoticias');

const newsForm = document.getElementById('newsForm');
const adminNewsList = document.getElementById('adminNewsList');
const noNewsMessage = document.getElementById('noNewsMessage');
const saveMessage = document.getElementById('saveMessage');
const formTitle = document.getElementById('formTitle');

function getUrlSecret() {
    const params = new URLSearchParams(window.location.search);
    return params.get('secret');
}

function isAuthenticated() {
    return sessionStorage.getItem('gaaAdminAuth') === 'true';
}

function requireSecret() {
    return getUrlSecret() === ADMIN_SECRET;
}

function showLogin() {
    loginSection.style.display = 'block';
    adminPanel.classList.remove('visible');
}

function showPanel() {
    loginSection.style.display = 'none';
    adminPanel.classList.add('visible');
    renderNewsList();
}

function handleLogin(event) {
    event.preventDefault();

    const secret = getUrlSecret();
    const password = document.getElementById('adminPassword').value.trim();

    if (!secret || secret !== ADMIN_SECRET) {
        loginError.textContent = 'Ruta de acceso no válida.';
        loginError.classList.add('show');
        return;
    }

    if (password !== ADMIN_PASSWORD) {
        loginError.textContent = 'Contraseña incorrecta.';
        loginError.classList.add('show');
        return;
    }

    sessionStorage.setItem('gaaAdminAuth', 'true');
    loginError.textContent = '';
    loginError.classList.remove('show');
    showPanel();
}

function logout() {
    sessionStorage.removeItem('gaaAdminAuth');
    window.location.href = `admin.html?secret=${ADMIN_SECRET}`;
}

function loadNews() {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('No se pudo leer noticias del almacenamiento local:', error);
        return [];
    }
}

function saveNews(data) {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(data));
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'noticia';
}

function createNewsItem(news) {
    const li = document.createElement('li');
    li.className = 'admin-news-item';
    li.innerHTML = `
        <div>
            <strong>${news.title}</strong>
            <div class="admin-news-meta">${news.category} • ${news.date}</div>
        </div>
        <div class="admin-news-actions">
            <button type="button" class="edit" data-id="${news.id}">Editar</button>
            <button type="button" class="delete" data-id="${news.id}">Eliminar</button>
        </div>
    `;

    return li;
}

function renderNewsList() {
    const news = loadNews();
    adminNewsList.innerHTML = '';

    if (!news.length) {
        noNewsMessage.hidden = false;
        return;
    }

    noNewsMessage.hidden = true;
    news.forEach((item) => {
        adminNewsList.appendChild(createNewsItem(item));
    });

    adminNewsList.querySelectorAll('.edit').forEach((button) => {
        button.addEventListener('click', () => populateForm(button.dataset.id));
    });

    adminNewsList.querySelectorAll('.delete').forEach((button) => {
        button.addEventListener('click', () => deleteNews(button.dataset.id));
    });
}

function resetForm() {
    formTitle.textContent = 'Nueva noticia';
    newsForm.reset();
    document.getElementById('newsId').value = '';
    document.getElementById('newsCategory').value = 'sedes';
    saveMessage.textContent = '';
    saveMessage.classList.remove('show');
}

function populateForm(id) {
    const news = loadNews().find((item) => item.id === id);
    if (!news) return;

    formTitle.textContent = 'Editar noticia';
    document.getElementById('newsId').value = news.id;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsCategory').value = news.category;
    document.getElementById('newsDate').value = news.date;
    document.getElementById('newsImage').value = news.image || '';
    document.getElementById('newsExcerpt').value = news.excerpt;
    document.getElementById('newsContent').value = news.content;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSave(event) {
    event.preventDefault();

    const id = document.getElementById('newsId').value || slugify(document.getElementById('newsTitle').value.trim());
    const title = document.getElementById('newsTitle').value.trim();
    const category = document.getElementById('newsCategory').value;
    const date = document.getElementById('newsDate').value.trim();
    const image = document.getElementById('newsImage').value.trim();
    const excerpt = document.getElementById('newsExcerpt').value.trim();
    const content = document.getElementById('newsContent').value.trim();

    if (!title || !date || !excerpt || !content) {
        saveMessage.textContent = 'Completa todos los campos obligatorios.';
        saveMessage.classList.add('show', 'error');
        return;
    }

    const news = loadNews();
    const existingIndex = news.findIndex((item) => item.id === id);
    const item = {
        id,
        title,
        category,
        date,
        image,
        excerpt,
        content
    };

    if (existingIndex >= 0) {
        news[existingIndex] = item;
    } else {
        news.unshift(item);
    }

    saveNews(news);
    renderNewsList();
    resetForm();
    saveMessage.textContent = 'Noticia guardada correctamente.';
    saveMessage.classList.remove('error');
    saveMessage.classList.add('show');
}

function deleteNews(id) {
    const news = loadNews().filter((item) => item.id !== id);
    saveNews(news);
    renderNewsList();
    if (document.getElementById('newsId').value === id) {
        resetForm();
    }
}

adminLoginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', logout);
backToNoticias.addEventListener('click', () => {
    window.location.href = 'noticias.html';
});
newsForm.addEventListener('submit', handleSave);
document.getElementById('resetFormBtn').addEventListener('click', resetForm);

if (!requireSecret() && !isAuthenticated()) {
    showLogin();
} else if (requireSecret() || isAuthenticated()) {
    showPanel();
}

if (!requireSecret() && isAuthenticated()) {
    showPanel();
}

if (requireSecret() && !isAuthenticated()) {
    adminLoginForm.addEventListener('submit', handleLogin, { once: true });
}
