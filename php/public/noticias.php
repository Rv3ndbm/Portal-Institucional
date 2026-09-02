<?php
// ============================================================
// VISTA PÚBLICA DE NOTICIAS DINÁMICA
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../config/database.php';

$stmt = $pdo->query('SELECT * FROM noticias ORDER BY created_at DESC');
$news = $stmt->fetchAll();

function getCardBackgroundStyle(?string $imageUrl): string {
    $img = trim((string) $imageUrl);
    if ($img === '') {
        return 'background-image: linear-gradient(135deg, #1e3c72, #2e7ce3); background-size: cover; background-position: center;';
    }
    if (str_starts_with($img, 'linear-gradient') || str_starts_with($img, 'url(')) {
        return "background-image: {$img}; background-size: cover; background-position: center;";
    }
    if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://')) {
        return "background-image: url('{$img}'); background-size: cover; background-position: center;";
    }
    $clean = ltrim($img, '/');
    return "background-image: url('../../{$clean}'); background-size: cover; background-position: center;";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noticias - I.E. Gilberto Alzate Avendaño</title>
    <link rel="icon" type="image/png" href="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    
    <!-- CSS Institucional -->
    <link rel="stylesheet" href="../../css/styles.css?v=2.5">
    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/modern-theme.css">
    <link rel="stylesheet" href="../../css/noticias.css">
    <link rel="stylesheet" href="../../css/accessibility.css">
    <link rel="stylesheet" href="../../css/search.css">
    
    <!-- Fuentes y Librerías -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body data-news-page>

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

    <!-- HERO NOTICIAS -->
    <section class="news-hero">
        <div class="news-hero-content">
            <span class="hero-badge">Actualidad Institucional</span>
            <h1 class="news-hero-title">Noticias y Novedades</h1>
            <p class="news-hero-description">Mantente informado con los últimos acontecimientos, logros y comunicados oficiales de nuestra comunidad educativa.</p>
        </div>
        <div class="news-hero-overlay"></div>
    </section>

    <!-- NOTICIA DESTACADA -->
    <?php if (!empty($news)): ?>
        <?php $featured = $news[0]; ?>
        <section class="featured-news container">
            <div class="section-header">
                <h2 class="section-title">Noticia Destacada</h2>
                <div class="title-underline"></div>
            </div>

            <article class="featured-card" id="featuredNews">
                <div class="featured-image-container">
                    <div class="featured-image-placeholder card-image-placeholder" style="<?= getCardBackgroundStyle($featured['image_url']) ?>"></div>
                </div>
                <div class="featured-content">
                    <div class="meta-tags">
                        <span class="category category-<?= htmlspecialchars((string) $featured['category'], ENT_QUOTES, 'UTF-8') ?>">
                            <?= htmlspecialchars(ucfirst((string) $featured['category']), ENT_QUOTES, 'UTF-8') ?>
                        </span>
                        <span class="card-date"><i class="far fa-calendar-alt"></i> <?= htmlspecialchars((string) $featured['date_label'], ENT_QUOTES, 'UTF-8') ?></span>
                    </div>
                    <h3 class="featured-title card-title"><?= htmlspecialchars((string) $featured['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                    <p class="featured-excerpt"><?= htmlspecialchars((string) $featured['excerpt'], ENT_QUOTES, 'UTF-8') ?></p>
                    <button class="btn-read-more btn-open-modal-featured" style="background: none; border: none; cursor: pointer; padding: 0;">
                        Leer Noticia Completa <i class="fas fa-arrow-right"></i>
                    </button>
                    <div class="full-content" style="display: none;">
                        <?= nl2br(htmlspecialchars((string) $featured['content'], ENT_QUOTES, 'UTF-8')) ?>
                    </div>
                </div>
            </article>
        </section>
    <?php endif; ?>

    <!-- FILTROS DE CATEGORÍA -->
    <div class="news-filters container">
        <button class="filter-btn active">Todas</button>
        <button class="filter-btn">Culturales</button>
        <button class="filter-btn">Deportivas</button>
        <button class="filter-btn">Parroquiales</button>
        <button class="filter-btn">Sedes</button>
    </div>

    <!-- LISTADO DE NOTICIAS -->
    <section class="news-list container">
        <?php if (empty($news)): ?>
            <div style="text-align:center; padding: 60px 20px; color: #64748b;">
                <i class="far fa-newspaper" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                <h2>No hay noticias publicadas aún</h2>
                <p>Las novedades y comunicados del colegio aparecerán aquí una vez sean publicadas.</p>
            </div>
        <?php else: ?>
            <div class="news-grid" id="newsGrid">
                <?php foreach ($news as $item): ?>
                    <article class="news-card" data-category="<?= htmlspecialchars((string) $item['category'], ENT_QUOTES, 'UTF-8') ?>" id="noticia-<?= (int) $item['id'] ?>">
                        <div class="card-image">
                            <div class="card-image-placeholder" style="<?= getCardBackgroundStyle($item['image_url']) ?>"></div>
                        </div>
                        <div class="card-content">
                            <div class="card-meta">
                                <span class="category category-<?= htmlspecialchars((string) $item['category'], ENT_QUOTES, 'UTF-8') ?>">
                                    <?= htmlspecialchars(ucfirst((string) $item['category']), ENT_QUOTES, 'UTF-8') ?>
                                </span>
                                <span class="card-date"><i class="far fa-calendar-alt"></i> <?= htmlspecialchars((string) $item['date_label'], ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <h3 class="card-title"><?= htmlspecialchars((string) $item['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                            <p class="card-excerpt"><?= htmlspecialchars((string) $item['excerpt'], ENT_QUOTES, 'UTF-8') ?></p>
                            <button class="card-link btn-read-more-card">Leer más <i class="fas fa-arrow-right"></i></button>
                            <div class="full-content" style="display: none;">
                                <?= nl2br(htmlspecialchars((string) $item['content'], ENT_QUOTES, 'UTF-8')) ?>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>

    <!-- MODAL DE LECTURA COMPLETA -->
    <div id="newsModal" class="news-modal" role="dialog" aria-modal="true">
        <div class="news-modal-overlay"></div>
        <div class="news-modal-content">
            <button class="news-modal-close" aria-label="Cerrar modal">&times;</button>
            <div class="news-modal-image">
                <div id="modalImageDisplay" class="modal-image-placeholder"></div>
            </div>
            <div class="news-modal-body">
                <div class="news-modal-meta">
                    <span id="modalCategoryBadge" class="category"></span>
                    <span id="modalDateText" class="card-date"></span>
                </div>
                <h2 id="modalTitleText" class="news-modal-title"></h2>
                <div id="modalFullContent" class="news-modal-text"></div>
            </div>
        </div>
    </div>

    <!-- FOOTER INSTITUCIONAL COMPLETO -->
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-section">
                <h3 class="footer-title">Sobre Nosotros</h3>
                <p class="footer-text">Institución educativa comprometida con la excelencia académica y la formación integral de nuestros estudiantes.</p>
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
                    <li><a href="../../html/pre.html">Pre-Inscripción</a></li>
                    <li><a href="https://www.youtube.com/@alzatevirtual8374/videos" target="_blank" rel="noopener noreferrer">Alzate Virtual</a></li>
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
    <script src="../../js/noticias.js"></script>
    <script src="../../js/accessibility.js" defer></script>
</body>
</html>
