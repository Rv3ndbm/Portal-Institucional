<?php
// ============================================================
// VISTA PÚBLICA DE DOCUMENTOS Y CIRCULARES DINÁMICA
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../config/database.php';

$stmt = $pdo->query('SELECT * FROM documentos ORDER BY created_at DESC');
$docs = $stmt->fetchAll();

function resolveDocAsset(?string $path): string {
    $p = trim((string) $path);
    if ($p === '') return '#';
    if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
        return $p;
    }
    return '../../' . ltrim($p, '/');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Circulares y Documentos - I.E. Gilberto Alzate Avendaño</title>
    <link rel="icon" type="image/png" href="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    
    <!-- PWA Manifest & Theme -->
    <link rel="manifest" href="../../manifest.json">
    <meta name="theme-color" content="#1e3c72">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="I.E. GAA">

    <!-- Open Graph / Redes Sociales & WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Circulares y Documentos Oficiales - I.E. Gilberto Alzate Avendaño">
    <meta property="og:description" content="Consulta y descarga circulares de rectoría, formatos de matrícula, guías curriculares y comunicados oficiales.">
    <meta property="og:image" content="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- CSS Institucional -->
    <link rel="stylesheet" href="../../css/styles.css?v=2.5">
    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/modern-theme.css">
    <link rel="stylesheet" href="../../css/documentos.css">
    <link rel="stylesheet" href="../../css/accessibility.css">
    <link rel="stylesheet" href="../../css/search.css">
    
    <!-- Fuentes y Librerías -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body data-doc-page>

    <!-- Header Principal Institucional -->
    <header class="main-header" id="mainHeader">
        <div class="header-background" id="headerBackground"></div>

        <div class="header-content">
            <div class="header-top" id="headerTop">
                <div class="logo-title-container">
                    <div class="logo-container">
                        <a href="../../index.html">
                            <img loading="lazy" src="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png" alt="Logo Institución" class="logo">
                        </a>
                    </div>
                    <div class="institution-name">
                        <h1>I.E. GILBERTO ALZATE AVENDAÑO</h1>
                    </div>
                </div>
            </div>

            <!-- Menú de Navegación Completo -->
            <nav class="main-nav" id="mainNav">
                <div class="nav-container">
                    <ul class="nav-menu nav-menu-left">
                        <li class="nav-item" data-bg="inicio">
                            <a href="../../index.html" class="nav-link">INICIO</a>
                            <ul class="dropdown-menu">
                                <li><a href="../../html/historia.html">Historia</a></li>
                                <li><a href="../../html/calendario.html">Eventos</a></li>
                                <li><a href="../../html/deportes.html">Deportes</a></li>
                                <li><a href="noticias.php">Noticias</a></li>
                                <li><a href="documentos.php" class="active-page" aria-current="page">Documentos</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="sedes">
                            <a href="../../html/sedes.html" class="nav-link">SEDES</a>
                            <ul class="dropdown-menu">
                                <li><a href="../../html/sede-san-isidro.html">Sede san isidro</a></li>
                                <li><a href="../../html/sede-seguros-bolivar.html">Sede seguros bolívar</a></li>
                                <li><a href="../../html/sede-tomas-carrasquilla.html">Sede tomás carrasquilla</a></li>
                                <li><a href="../../html/sede-carlos-villa.html">Sede carlos villa</a></li>
                                <li><a href="../../html/sede-central.html">Sede central</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul class="nav-menu nav-menu-right">
                        <li class="nav-item" data-bg="dependencias">
                            <a href="../../html/dependencias.html" class="nav-link">DEPENDENCIAS</a>
                            <ul class="dropdown-menu">
                                <li><a href="../../html/dependencias.html#coordinacion">Coordinación</a></li>
                                <li><a href="../../html/dependencias.html#rectoria">Rectoría</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="medias">
                            <a href="../../html/tecnicas.html" class="nav-link">MEDIAS TÉCNICAS</a>
                            <ul class="dropdown-menu">
                                <li><a href="../../html/tecnicas/pascual.html">Desarrollo de software - Pascual Bravo</a></li>
                                <li><a href="../../html/tecnicas/musica.html">Música</a></li>
                                <li><a href="../../html/tecnicas/ambiental.html">Gestión ambiental</a></li>
                                <li><a href="../../html/tecnicas/contenidos.html">Contenidos digitales</a></li>
                                <li><a href="../../html/tecnicas/sena.html">Programación de software - SENA</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="academico">
                            <a href="../../html/academico.html" class="nav-link">ACADÉMICO</a>
                            <ul class="dropdown-menu">
                                <li><a href="https://docente.alzate.edu.co/" target="_blank" rel="noopener noreferrer">Sistema docente</a></li>
                                <li><a href="https://estudiante.alzate.edu.co/" target="_blank" rel="noopener noreferrer">Sistema estudiante</a></li>
                                <li><a href="../../html/planes-area.html">Planes de Área</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="servicios">
                            <a href="../../html/otros-servicios.html" class="nav-link">OTROS SERVICIOS</a>
                            <ul class="dropdown-menu">
                                <li><a href="https://luisarango64.wixsite.com/bibliositio" target="_blank" rel="noopener noreferrer">Biblioteca</a></li>
                                <li><a href="https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf" target="_blank" rel="noopener noreferrer">Manual de convivencia</a></li>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform" target="_blank" rel="noopener noreferrer">Formulario PQRSF</a></li>
                                <li><a href="https://www.youtube.com/@alzatevirtual8374/videos" target="_blank" rel="noopener noreferrer">Alzate virtual</a></li>
                                <li><a href="../../html/pre.html">Preinscripción</a></li>
                                <li><a href="https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508" target="_blank" rel="noopener noreferrer">Canal institucional</a></li>
                                <li><a href="../../manuales/MANUALES.html">Manuales de Usuario</a></li>
                                <li><a href="../../html/contacto.html">Contáctanos</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>

    <!-- HERO DOCUMENTOS -->
    <section class="doc-hero">
        <div class="doc-hero-content">
            <span class="hero-badge"><i class="fas fa-folder-open"></i> Repositorio Oficial</span>
            <h1 class="doc-hero-title">Documentos y Circulares</h1>
            <p class="doc-hero-description">Accede, consulta y descarga fácilmente las circulares de rectoría, formatos de matrícula, resoluciones y documentos curriculares de la institución.</p>
        </div>
        <div class="doc-hero-overlay"></div>
    </section>

    <!-- SECCIÓN PRINCIPAL DE DOCUMENTOS -->
    <main class="doc-main-container">
        <!-- BARRA DE HERRAMIENTAS: BÚSQUEDA Y FILTROS -->
        <div class="doc-toolbar">
            <!-- Buscador en tiempo real -->
            <div class="doc-search-box">
                <i class="fas fa-search doc-search-icon"></i>
                <input type="text" id="docSearchInput" placeholder="Buscar documento por título o palabra clave..." autocomplete="off">
                <button type="button" id="docSearchClear" class="doc-search-clear" title="Limpiar búsqueda" style="display:none;">&times;</button>
            </div>

            <!-- Filtros por Categoría -->
            <div class="doc-categories-wrapper" role="tablist">
                <button type="button" class="doc-filter-btn active" data-category="todas">
                    <i class="fas fa-layer-group"></i> Todas (<?= count($docs) ?>)
                </button>
                <button type="button" class="doc-filter-btn" data-category="circulares">
                    <i class="fas fa-bullhorn"></i> Circulares
                </button>
                <button type="button" class="doc-filter-btn" data-category="matriculas">
                    <i class="fas fa-user-plus"></i> Matrículas
                </button>
                <button type="button" class="doc-filter-btn" data-category="formatos">
                    <i class="fas fa-file-signature"></i> Formatos
                </button>
                <button type="button" class="doc-filter-btn" data-category="academico">
                    <i class="fas fa-graduation-cap"></i> Académico
                </button>
                <button type="button" class="doc-filter-btn" data-category="resoluciones">
                    <i class="fas fa-stamp"></i> Resoluciones
                </button>
            </div>
        </div>

        <!-- CUADRÍCULA DE DOCUMENTOS -->
        <?php if (empty($docs)): ?>
            <div class="doc-empty-state">
                <div class="empty-icon-circle">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h2>Aún no hay documentos publicados</h2>
                <p>Próximamente la administración institucional compartirá las circulares y formatos en esta sección.</p>
            </div>
        <?php else: ?>
            <div class="doc-grid" id="docGrid">
                <?php foreach ($docs as $doc): 
                    $cat = strtolower((string) $doc['category']);
                    $filePath = resolveDocAsset($doc['file_path']);
                    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $isPdf = ($ext === 'pdf');
                    $dateFormatted = date('d/m/Y', strtotime((string)$doc['created_at']));
                ?>
                    <article class="doc-card" data-category="<?= htmlspecialchars($cat, ENT_QUOTES, 'UTF-8') ?>" data-title="<?= htmlspecialchars(strtolower((string) $doc['title']), ENT_QUOTES, 'UTF-8') ?>" data-desc="<?= htmlspecialchars(strtolower((string) ($doc['description'] ?? '')), ENT_QUOTES, 'UTF-8') ?>">
                        <div class="doc-card-badge-row">
                            <span class="doc-badge doc-badge-<?= htmlspecialchars($cat, ENT_QUOTES, 'UTF-8') ?>">
                                <?= htmlspecialchars(ucfirst($cat), ENT_QUOTES, 'UTF-8') ?>
                            </span>
                            <span class="doc-size-badge">
                                <i class="fas fa-file-alt"></i> <?= htmlspecialchars((string) ($doc['file_size'] ?? strtoupper($ext)), ENT_QUOTES, 'UTF-8') ?>
                            </span>
                        </div>

                        <div class="doc-card-main">
                            <div class="doc-file-icon <?= $isPdf ? 'pdf' : 'word' ?>">
                                <i class="fas <?= $isPdf ? 'fa-file-pdf' : 'fa-file-word' ?>"></i>
                            </div>
                            <div class="doc-card-details">
                                <h3 class="doc-title"><?= htmlspecialchars((string) $doc['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                                <?php if (!empty($doc['description'])): ?>
                                    <p class="doc-desc"><?= htmlspecialchars((string) $doc['description'], ENT_QUOTES, 'UTF-8') ?></p>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="doc-card-footer">
                            <span class="doc-date"><i class="far fa-calendar-alt"></i> <?= $dateFormatted ?></span>
                            <div class="doc-actions">
                                <a href="<?= htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer" class="doc-btn preview" title="Previsualizar en pestaña nueva">
                                    <i class="fas fa-eye"></i> Visualizar
                                </a>
                                <a href="<?= htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8') ?>" download class="doc-btn download" title="Descargar archivo a tu dispositivo">
                                    <i class="fas fa-download"></i> Descargar
                                </a>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>

            <!-- Estado de búsqueda sin resultados -->
            <div id="docNoSearchResults" class="doc-no-results" style="display:none;">
                <i class="fas fa-search-minus"></i>
                <h3>No se encontraron documentos que coincidan</h3>
                <p>Intenta con otros términos de búsqueda o selecciona la categoría "Todas".</p>
                <button type="button" class="doc-reset-search-btn" id="docResetSearchBtn">Restablecer filtros</button>
            </div>
        <?php endif; ?>
    </main>

    <!-- FOOTER INSTITUCIONAL -->
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-section">
                <h3 class="footer-title">Sobre Nosotros</h3>
                <p class="footer-text">Institución educativa comprometida con la excelencia académica, la formación integral y la transparencia en la comunicación institucional.</p>
                <div class="footer-logo">
                    <img loading="lazy" src="../../img/logo del colegio.jpg" alt="Logo Institución">
                </div>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Nuestras Sedes</h3>
                <ul class="footer-links">
                    <li><a href="../../html/sede-san-isidro.html">Sede San Isidro</a></li>
                    <li><a href="../../html/sede-seguros-bolivar.html">Sede Seguros Bolívar</a></li>
                    <li><a href="../../html/sede-tomas-carrasquilla.html">Sede Tomás Carrasquilla</a></li>
                    <li><a href="../../html/sede-carlos-villa.html">Sede Carlos Villa</a></li>
                    <li><a href="../../html/sede-central.html">Sede Central</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Enlaces Rápidos</h3>
                <ul class="footer-links">
                    <li><a href="../../index.html">Inicio</a></li>
                    <li><a href="../../html/historia.html">Nuestra Historia</a></li>
                    <li><a href="../../html/dependencias.html">Dependencias</a></li>
                    <li><a href="../../html/tecnicas.html">Medias Técnicas</a></li>
                    <li><a href="../../html/sedes.html">Nuestras Sedes</a></li>
                    <li><a href="../../html/deportes.html">Deportes</a></li>
                    <li><a href="noticias.php">Noticias</a></li>
                    <li><a href="documentos.php">Documentos</a></li>
                    <li><a href="../../html/pre.html">Pre-Inscripción</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Contacto</h3>
                <div class="footer-contact">
                    <div class="contact-item">
                        <span class="contact-label">📞 Teléfono:</span>
                        <p>+57 1 (555) 1234</p>
                    </div>
                    <div class="contact-item">
                        <span class="contact-label">📧 Email:</span>
                        <p><a href="mailto:ie.gilbertoalzate@medellin.gov.co" class="email-contact-link" data-email="ie.gilbertoalzate@medellin.gov.co">ie.gilbertoalzate@medellin.gov.co</a></p>
                    </div>
                </div>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Síguenos</h3>
                <div class="social-links">
                    <a href="https://www.facebook.com/gilbertoalzate.tarde" target="_blank" class="social-icon facebook" rel="noopener noreferrer" aria-label="Facebook"><img src="../../img/facebook.png" alt="Facebook"></a>
                    <a href="https://www.instagram.com/elalzateviveporvos/" target="_blank" class="social-icon instagram" rel="noopener noreferrer" aria-label="Instagram"><img src="../../img/ig.png" alt="Instagram"></a>
                    <a href="https://www.youtube.com/@alzatevirtual8374" target="_blank" class="social-icon youtube" rel="noopener noreferrer" aria-label="YouTube"><img src="../../img/yt.png" alt="YouTube"></a>
                    <a href="https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508" target="_blank" class="social-icon whatsapp" rel="noopener noreferrer" aria-label="WhatsApp"><img src="../../img/whatsap.png" alt="WhatsApp"></a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p>&copy; 2026 I.E. Gilberto Alzate Avendaño. Todos los derechos reservados.</p>
                <div class="footer-bottom-links">
                    <a href="https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf" target="_blank" rel="noopener noreferrer">Manual de Convivencia</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform" target="_blank" rel="noopener noreferrer">Formulario PQRSF</a>
                    <a href="https://luisarango64.wixsite.com/bibliositio" target="_blank" rel="noopener noreferrer">Biblioteca</a>
                    <!-- Acceso administrativo protegido en footer -->
                    <a href="../admin/login.php" title="Acceso Administrativo" style="opacity: 0.4; font-size: 0.8rem; margin-left: 8px;">
                        <i class="fas fa-shield-alt"></i> Admin
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- WIDGET ACCESIBILIDAD -->
    <div class="accessibility-widget">
        <button class="accessibility-toggle" title="Opciones de accesibilidad" aria-label="Accesibilidad">
            <i class="fas fa-universal-access"></i>
        </button>
        <div class="accessibility-panel">
            <div class="accessibility-title">
                <i class="fas fa-sliders-h"></i> Herramientas
            </div>
            <div class="accessibility-option">
                <button type="button" id="increaseTextBtn" class="accessibility-action-btn">
                    <i class="fas fa-search-plus"></i> <span>Aumentar texto</span>
                </button>
            </div>
            <div class="accessibility-option">
                <button type="button" id="decreaseTextBtn" class="accessibility-action-btn">
                    <i class="fas fa-search-minus"></i> <span>Disminuir texto</span>
                </button>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="highContrast">
                    <i class="fas fa-adjust"></i> <span>Alto contraste</span>
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="negativeContrast">
                    <i class="fas fa-eye"></i> <span>Contraste negativo</span>
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="grayscale">
                    <i class="fas fa-palette"></i> <span>Escala de grises</span>
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="dyslexiaFriendly">
                    <i class="fas fa-font"></i> <span>Fuente legible</span>
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="underlineLinks">
                    <i class="fas fa-link"></i> <span>Subrayar enlaces</span>
                </label>
            </div>
            <div class="accessibility-reset-wrapper">
                <button type="button" class="accessibility-reset">
                    <i class="fas fa-undo" style="margin-right: 6px;"></i> Restablecer
                </button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../../js/search-data.js" defer></script>
    <script src="../../js/script.js"></script>
    <script src="../../js/accessibility.js" defer></script>

    <!-- Script interactivo de filtrado y búsqueda de documentos -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('docSearchInput');
            const searchClear = document.getElementById('docSearchClear');
            const filterBtns = document.querySelectorAll('.doc-filter-btn');
            const docCards = document.querySelectorAll('.doc-card');
            const noResults = document.getElementById('docNoSearchResults');
            const resetBtn = document.getElementById('docResetSearchBtn');

            let currentCategory = 'todas';
            let currentSearch = '';

            function applyFilters() {
                let visibleCount = 0;
                const query = currentSearch.toLowerCase().trim();

                docCards.forEach(card => {
                    const category = card.getAttribute('data-category') || '';
                    const title = card.getAttribute('data-title') || '';
                    const desc = card.getAttribute('data-desc') || '';

                    const matchesCategory = (currentCategory === 'todas' || category === currentCategory);
                    const matchesSearch = (!query || title.includes(query) || desc.includes(query));

                    if (matchesCategory && matchesSearch) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (noResults) {
                    noResults.style.display = (visibleCount === 0 && docCards.length > 0) ? 'block' : 'none';
                }
            }

            // Filtrado por botones de categoría
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentCategory = this.getAttribute('data-category') || 'todas';
                    applyFilters();
                });
            });

            // Búsqueda en tiempo real
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    currentSearch = this.value;
                    if (searchClear) {
                        searchClear.style.display = currentSearch.length > 0 ? 'block' : 'none';
                    }
                    applyFilters();
                });
            }

            if (searchClear) {
                searchClear.addEventListener('click', function() {
                    if (searchInput) {
                        searchInput.value = '';
                        currentSearch = '';
                        this.style.display = 'none';
                        applyFilters();
                        searchInput.focus();
                    }
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    if (searchInput) searchInput.value = '';
                    currentSearch = '';
                    if (searchClear) searchClear.style.display = 'none';
                    
                    filterBtns.forEach(b => b.classList.remove('active'));
                    const allBtn = document.querySelector('.doc-filter-btn[data-category="todas"]');
                    if (allBtn) allBtn.classList.add('active');
                    currentCategory = 'todas';
                    applyFilters();
                });
            }
        });
    </script>
</body>
</html>
