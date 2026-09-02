<?php
// ============================================================
// DASHBOARD ADMINISTRATIVO MULTISECCIÓN
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../config/database.php';
requireAdmin();

// Control de inactividad de sesión (30 minutos)
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
    header('Location: logout.php');
    exit;
}
$_SESSION['last_activity'] = time();

$csrfToken = generateCsrfToken();
$message = '';
$messageType = 'success';
$activeTab = $_GET['tab'] ?? 'noticias';

function resolveAdminAsset(?string $path): string {
    $p = trim((string) $path);
    if ($p === '') return '';
    if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
        return $p;
    }
    return '../../' . ltrim($p, '/');
}

// ------------------------------------------------------------
// PROCESAMIENTO DE FORMULARIOS (POST)
// ------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = (string) ($_POST['csrf_token'] ?? '');
    
    if (!validateCsrfToken($submittedToken)) {
        $message = 'Error de seguridad (Token CSRF inválido o expirado). Por favor recarga e intenta de nuevo.';
        $messageType = 'error';
    } else {
        $section = $_POST['form_section'] ?? 'noticias';
        $activeTab = $section;

        // --------------------------------------------------------
        // 1. SECCIÓN: NOTICIAS
        // --------------------------------------------------------
        if ($section === 'noticias') {
            $action = $_POST['action'] ?? 'save';

            if ($action === 'delete') {
                $id = (int) ($_POST['id'] ?? 0);
                if ($id > 0) {
                    $stmtImg = $pdo->prepare('SELECT image_url FROM noticias WHERE id = :id');
                    $stmtImg->execute([':id' => $id]);
                    $oldImg = $stmtImg->fetchColumn();

                    $stmt = $pdo->prepare('DELETE FROM noticias WHERE id = :id');
                    $stmt->execute([':id' => $id]);

                    if ($oldImg && (str_starts_with($oldImg, 'uploads/noticias/') || str_starts_with($oldImg, '/uploads/noticias/'))) {
                        $fullOldPath = __DIR__ . '/../../' . ltrim($oldImg, '/');
                        if (file_exists($fullOldPath)) {
                            @unlink($fullOldPath);
                        }
                    }

                    $message = 'Noticia eliminada correctamente.';
                }
            } else {
                $id = (int) ($_POST['id'] ?? 0);
                $title = trim((string) ($_POST['title'] ?? ''));
                $category = trim((string) ($_POST['category'] ?? 'sedes'));
                $dateLabel = trim((string) ($_POST['date_label'] ?? ''));
                $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
                $content = trim((string) ($_POST['content'] ?? ''));
                $existingImage = trim((string) ($_POST['existing_image'] ?? ''));
                $imageUrl = $existingImage;

                if ($dateLabel === '') {
                    $meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    $dateLabel = date('d') . ' ' . $meses[date('n') - 1] . ', ' . date('Y');
                }

                // Subida de nueva imagen
                if (!empty($_FILES['image_file']['name'])) {
                    $uploadResult = handleSecureUpload($_FILES['image_file'], 'noticias', ['jpg', 'jpeg', 'png', 'webp'], 5242880);
                    if ($uploadResult['success']) {
                        $imageUrl = $uploadResult['path'];
                    } else {
                        $message = 'Error en imagen: ' . $uploadResult['error'];
                        $messageType = 'error';
                    }
                }

                if ($messageType !== 'error') {
                    if ($title === '' || $excerpt === '' || $content === '') {
                        $message = 'Por favor completa todos los campos obligatorios.';
                        $messageType = 'error';
                    } else {
                        if ($id > 0) {
                            $stmt = $pdo->prepare('UPDATE noticias SET title = :title, category = :category, date_label = :date_label, image_url = :image_url, excerpt = :excerpt, content = :content WHERE id = :id');
                            $stmt->execute([
                                ':id'         => $id,
                                ':title'      => $title,
                                ':category'   => $category,
                                ':date_label' => $dateLabel,
                                ':image_url'  => $imageUrl,
                                ':excerpt'    => $excerpt,
                                ':content'    => $content,
                            ]);
                            $message = 'Noticia actualizada correctamente.';
                        } else {
                            $stmt = $pdo->prepare('INSERT INTO noticias (title, category, date_label, image_url, excerpt, content) VALUES (:title, :category, :date_label, :image_url, :excerpt, :content)');
                            $stmt->execute([
                                ':title'      => $title,
                                ':category'   => $category,
                                ':date_label' => $dateLabel,
                                ':image_url'  => $imageUrl,
                                ':excerpt'    => $excerpt,
                                ':content'    => $content,
                            ]);
                            $message = 'Noticia creada y publicada exitosamente.';
                        }
                    }
                }
            }
        }

        // --------------------------------------------------------
        // 2. SECCIÓN: DOCUMENTOS Y CIRCULARES
        // --------------------------------------------------------
        elseif ($section === 'documentos') {
            $action = $_POST['action'] ?? 'save';

            if ($action === 'delete') {
                $id = (int) ($_POST['id'] ?? 0);
                if ($id > 0) {
                    $stmtDoc = $pdo->prepare('SELECT file_path FROM documentos WHERE id = :id');
                    $stmtDoc->execute([':id' => $id]);
                    $filePath = $stmtDoc->fetchColumn();

                    $stmt = $pdo->prepare('DELETE FROM documentos WHERE id = :id');
                    $stmt->execute([':id' => $id]);

                    if ($filePath && (str_starts_with($filePath, 'uploads/documentos/') || str_starts_with($filePath, '/uploads/documentos/'))) {
                        $fullOldPath = __DIR__ . '/../../' . ltrim($filePath, '/');
                        if (file_exists($fullOldPath)) {
                            @unlink($fullOldPath);
                        }
                    }

                    $message = 'Documento eliminado correctamente.';
                }
            } else {
                $docTitle = trim((string) ($_POST['doc_title'] ?? ''));
                $docCategory = trim((string) ($_POST['doc_category'] ?? 'circulares'));
                $docDescription = trim((string) ($_POST['doc_description'] ?? ''));

                if ($docTitle === '') {
                    $message = 'El título del documento es obligatorio.';
                    $messageType = 'error';
                } elseif (empty($_FILES['doc_file']['name'])) {
                    $message = 'Debes seleccionar un archivo PDF o documento para subir.';
                    $messageType = 'error';
                } else {
                    $uploadResult = handleSecureUpload($_FILES['doc_file'], 'documentos', ['pdf', 'doc', 'docx'], 10485760);
                    if ($uploadResult['success']) {
                        $stmt = $pdo->prepare('INSERT INTO documentos (title, category, file_path, file_size, description) VALUES (:title, :category, :file_path, :file_size, :description)');
                        $stmt->execute([
                            ':title'       => $docTitle,
                            ':category'    => $docCategory,
                            ':file_path'   => $uploadResult['path'],
                            ':file_size'   => $uploadResult['size_formatted'],
                            ':description' => $docDescription,
                        ]);
                        $message = 'Documento subido y registrado exitosamente.';
                    } else {
                        $message = 'Error al subir documento: ' . $uploadResult['error'];
                        $messageType = 'error';
                    }
                }
            }
        }

        // --------------------------------------------------------
        // 3. SECCIÓN: SEGURIDAD Y PERFIL
        // --------------------------------------------------------
        elseif ($section === 'seguridad') {
            $adminId = (int) $_SESSION['admin_id'];
            $fullName = trim((string) ($_POST['full_name'] ?? ''));
            $newUsername = trim((string) ($_POST['username'] ?? ''));
            $currentPassword = (string) ($_POST['current_password'] ?? '');
            $newPassword = (string) ($_POST['new_password'] ?? '');
            $confirmPassword = (string) ($_POST['confirm_password'] ?? '');

            // Validar contraseña actual
            $stmt = $pdo->prepare('SELECT password_hash FROM admins WHERE id = :id LIMIT 1');
            $stmt->execute([':id' => $adminId]);
            $currentHash = $stmt->fetchColumn();

            if (!$currentHash || !password_verify($currentPassword, $currentHash)) {
                $message = 'La contraseña actual ingresada es incorrecta.';
                $messageType = 'error';
            } else {
                if ($newUsername === '') {
                    $message = 'El nombre de usuario no puede estar vacío.';
                    $messageType = 'error';
                } else {
                    if ($newPassword !== '') {
                        if (strlen($newPassword) < 6) {
                            $message = 'La nueva contraseña debe tener al menos 6 caracteres.';
                            $messageType = 'error';
                        } elseif ($newPassword !== $confirmPassword) {
                            $message = 'La nueva contraseña y su confirmación no coinciden.';
                            $messageType = 'error';
                        } else {
                            $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
                            $stmt = $pdo->prepare('UPDATE admins SET full_name = :full_name, username = :username, password_hash = :hash WHERE id = :id');
                            $stmt->execute([
                                ':full_name' => $fullName,
                                ':username'  => $newUsername,
                                ':hash'      => $newHash,
                                ':id'        => $adminId
                            ]);
                            $_SESSION['admin_username'] = $newUsername;
                            $_SESSION['admin_name'] = $fullName;
                            $message = 'Datos de acceso y contraseña actualizados correctamente.';
                        }
                    } else {
                        $stmt = $pdo->prepare('UPDATE admins SET full_name = :full_name, username = :username WHERE id = :id');
                        $stmt->execute([
                            ':full_name' => $fullName,
                            ':username'  => $newUsername,
                            ':id'        => $adminId
                        ]);
                        $_SESSION['admin_username'] = $newUsername;
                        $_SESSION['admin_name'] = $fullName;
                        $message = 'Datos del perfil actualizados correctamente.';
                    }
                }
            }
        }
    }
}

// ------------------------------------------------------------
// CONSULTAS PARA RENDERIZADO
// ------------------------------------------------------------

// Edición de noticia
$editingNews = null;
if (!empty($_GET['edit_news'])) {
    $stmt = $pdo->prepare('SELECT * FROM noticias WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => (int) $_GET['edit_news']]);
    $editingNews = $stmt->fetch();
    $activeTab = 'noticias';
}

// Listado de noticias
$stmtNews = $pdo->query('SELECT * FROM noticias ORDER BY created_at DESC');
$newsList = $stmtNews->fetchAll();

// Listado de documentos
$stmtDocs = $pdo->query('SELECT * FROM documentos ORDER BY created_at DESC');
$docsList = $stmtDocs->fetchAll();

// Datos del administrador actual
$stmtAdmin = $pdo->prepare('SELECT username, full_name FROM admins WHERE id = :id LIMIT 1');
$stmtAdmin->execute([':id' => (int) $_SESSION['admin_id']]);
$currentAdmin = $stmtAdmin->fetch();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Administrativo - I.E. GAA</title>
    <link rel="icon" type="image/png" href="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>
<body class="dashboard-body">

    <!-- BARRA SUPERIOR -->
    <header class="dashboard-navbar">
        <div class="dash-container nav-flex">
            <div class="dash-brand">
                <img src="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png" alt="Escudo" class="dash-logo">
                <div>
                    <h1 class="dash-title">Panel Institucional GAA</h1>
                    <span class="dash-admin-name">Sesión: <strong><?= htmlspecialchars((string) ($currentAdmin['full_name'] ?? 'Administrador'), ENT_QUOTES, 'UTF-8') ?></strong></span>
                </div>
            </div>

            <div class="dash-actions">
                <a class="dash-btn secondary" href="../public/noticias.php" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Ver Sitio Web
                </a>
                <a class="dash-btn danger" href="logout.php">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
            </div>
        </div>
    </header>

    <!-- CONTENEDOR PRINCIPAL -->
    <main class="dash-container dash-main-wrapper">

        <!-- MENSAJE DE ALERTA -->
        <?php if ($message !== ''): ?>
            <div class="dash-alert <?= $messageType === 'error' ? 'error' : 'success' ?>">
                <i class="fas <?= $messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle' ?>"></i>
                <span><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></span>
            </div>
        <?php endif; ?>

        <!-- PESTAÑAS DE NAVEGACIÓN -->
        <nav class="dash-tabs" role="tablist">
            <a href="?tab=noticias" class="dash-tab-link <?= $activeTab === 'noticias' ? 'active' : '' ?>">
                <i class="fas fa-newspaper"></i> <span>Noticias y Novedades</span>
                <span class="tab-badge"><?= count($newsList) ?></span>
            </a>
            <a href="?tab=documentos" class="dash-tab-link <?= $activeTab === 'documentos' ? 'active' : '' ?>">
                <i class="fas fa-file-pdf"></i> <span>Documentos y Circulares</span>
                <span class="tab-badge"><?= count($docsList) ?></span>
            </a>
            <a href="?tab=seguridad" class="dash-tab-link <?= $activeTab === 'seguridad' ? 'active' : '' ?>">
                <i class="fas fa-user-shield"></i> <span>Seguridad y Contraseña</span>
            </a>
        </nav>

        <!-- SECCIÓN 1: NOTICIAS -->
        <?php if ($activeTab === 'noticias'): ?>
            <section class="dash-section active">
                <div class="dash-grid-layout">
                    <!-- Formulario de Noticias -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas <?= $editingNews ? 'fa-edit' : 'fa-plus-circle' ?>"></i> <?= $editingNews ? 'Editar Noticia' : 'Publicar Nueva Noticia' ?></h2>
                            <?php if ($editingNews): ?>
                                <a href="index.php?tab=noticias" class="dash-btn-small secondary">Cancelar Edición</a>
                            <?php endif; ?>
                        </div>

                        <form class="dash-form" method="post" action="index.php?tab=noticias" enctype="multipart/form-data">
                            <input type="hidden" name="form_section" value="noticias">
                            <input type="hidden" name="action" value="save">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                            <input type="hidden" name="id" value="<?= htmlspecialchars((string) ($editingNews['id'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">
                            <input type="hidden" name="existing_image" value="<?= htmlspecialchars((string) ($editingNews['image_url'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">

                            <div class="form-group">
                                <label for="newsTitle">Título de la Noticia *</label>
                                <input type="text" id="newsTitle" name="title" value="<?= htmlspecialchars((string) ($editingNews['title'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" placeholder="Ej: Gran jornada cultural 2026" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="newsCategory">Categoría *</label>
                                    <select id="newsCategory" name="category" required>
                                        <option value="sedes" <?= (($editingNews['category'] ?? 'sedes') === 'sedes') ? 'selected' : '' ?>>Sedes</option>
                                        <option value="culturales" <?= (($editingNews['category'] ?? '') === 'culturales') ? 'selected' : '' ?>>Culturales</option>
                                        <option value="deportivas" <?= (($editingNews['category'] ?? '') === 'deportivas') ? 'selected' : '' ?>>Deportivas</option>
                                        <option value="parroquiales" <?= (($editingNews['category'] ?? '') === 'parroquiales') ? 'selected' : '' ?>>Parroquiales</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="newsDate">Fecha de Publicación</label>
                                    <input type="text" id="newsDate" name="date_label" value="<?= htmlspecialchars((string) ($editingNews['date_label'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" placeholder="Dejar vacío para fecha actual">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newsImage">Foto / Imagen de Portada</label>
                                <div class="file-upload-box">
                                    <input type="file" id="newsImage" name="image_file" accept="image/png, image/jpeg, image/webp" onchange="previewImage(this)">
                                    <div class="file-upload-placeholder" id="uploadPlaceholder">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span>Haz clic o arrastra una imagen aquí (JPG, PNG, WebP máx. 5MB)</span>
                                    </div>
                                    <div class="image-preview-container" id="imagePreviewContainer" style="<?= !empty($editingNews['image_url']) ? 'display:block;' : 'display:none;' ?>">
                                        <img id="imagePreview" src="<?= htmlspecialchars(resolveAdminAsset($editingNews['image_url'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" alt="Vista previa">
                                        <small class="preview-note">Imagen seleccionada actualmente</small>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newsExcerpt">Resumen Corto (Para tarjetas) *</label>
                                <textarea id="newsExcerpt" name="excerpt" rows="3" placeholder="Breve descripción que resume la noticia en pocas líneas..." required><?= htmlspecialchars((string) ($editingNews['excerpt'] ?? ''), ENT_QUOTES, 'UTF-8') ?></textarea>
                            </div>

                            <div class="form-group">
                                <label for="newsContent">Contenido Completo de la Noticia *</label>
                                <textarea id="newsContent" name="content" rows="6" placeholder="Redacta todo el texto detallado de la noticia aquí..." required><?= htmlspecialchars((string) ($editingNews['content'] ?? ''), ENT_QUOTES, 'UTF-8') ?></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="dash-btn primary">
                                    <i class="fas fa-save"></i> <?= $editingNews ? 'Guardar Cambios' : 'Publicar Noticia' ?>
                                </button>
                                <?php if ($editingNews): ?>
                                    <a href="index.php?tab=noticias" class="dash-btn secondary">Cancelar</a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>

                    <!-- Listado de Noticias -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-list"></i> Noticias Publicadas</h2>
                            <span class="badge-count"><?= count($newsList) ?> noticia(s)</span>
                        </div>

                        <?php if (empty($newsList)): ?>
                            <div class="dash-empty-state">
                                <i class="far fa-newspaper empty-icon"></i>
                                <p>Aún no has publicado noticias.</p>
                                <small>Usa el formulario para añadir la primera noticia del portal.</small>
                            </div>
                        <?php else: ?>
                            <div class="dash-items-list">
                                <?php foreach ($newsList as $item): ?>
                                    <article class="dash-item-card">
                                        <div class="item-thumbnail">
                                            <?php if (!empty($item['image_url'])): ?>
                                                <img src="<?= htmlspecialchars(resolveAdminAsset($item['image_url']), ENT_QUOTES, 'UTF-8') ?>" alt="Miniatura">
                                            <?php else: ?>
                                                <div class="thumbnail-placeholder"><i class="fas fa-image"></i></div>
                                            <?php endif; ?>
                                        </div>

                                        <div class="item-body">
                                            <div class="item-meta">
                                                <span class="category-badge category-<?= htmlspecialchars((string) $item['category'], ENT_QUOTES, 'UTF-8') ?>">
                                                    <?= htmlspecialchars(ucfirst((string) $item['category']), ENT_QUOTES, 'UTF-8') ?>
                                                </span>
                                                <span class="item-date"><i class="far fa-calendar-alt"></i> <?= htmlspecialchars((string) $item['date_label'], ENT_QUOTES, 'UTF-8') ?></span>
                                            </div>
                                            <h3 class="item-title"><?= htmlspecialchars((string) $item['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                                            <p class="item-excerpt"><?= htmlspecialchars(mb_strimwidth((string) $item['excerpt'], 0, 100, '...'), ENT_QUOTES, 'UTF-8') ?></p>
                                        </div>

                                        <div class="item-actions">
                                            <a class="action-btn edit" href="index.php?tab=noticias&edit_news=<?= (int) $item['id'] ?>" title="Editar">
                                                <i class="fas fa-pencil-alt"></i>
                                            </a>
                                            <form method="post" action="index.php?tab=noticias" onsubmit="return confirm('¿Estás seguro de que deseas eliminar permanentemente esta noticia?');">
                                                <input type="hidden" name="form_section" value="noticias">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                <input type="hidden" name="id" value="<?= (int) $item['id'] ?>">
                                                <button type="submit" class="action-btn delete" title="Eliminar">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- SECCIÓN 2: DOCUMENTOS Y CIRCULARES -->
        <?php if ($activeTab === 'documentos'): ?>
            <section class="dash-section active">
                <div class="dash-grid-layout">
                    <!-- Formulario de Subida de Documentos -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-upload"></i> Subir Documento / Circular</h2>
                        </div>

                        <form class="dash-form" method="post" action="index.php?tab=documentos" enctype="multipart/form-data">
                            <input type="hidden" name="form_section" value="documentos">
                            <input type="hidden" name="action" value="save">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                            <div class="form-group">
                                <label for="docTitle">Título del Documento *</label>
                                <input type="text" id="docTitle" name="doc_title" placeholder="Ej: Circular 04 - Horarios de Entrega de Notas" required>
                            </div>

                            <div class="form-group">
                                <label for="docCategory">Categoría *</label>
                                <select id="docCategory" name="doc_category" required>
                                    <option value="circulares">Circular Informativa</option>
                                    <option value="pae">Programa PAE / Alimentación</option>
                                    <option value="convivencia">Manual de Convivencia y Normas</option>
                                    <option value="academico">Planes Académicos y Guías</option>
                                    <option value="resoluciones">Resoluciones y Rectoría</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="docFile">Archivo PDF / Word *</label>
                                <div class="file-upload-box">
                                    <input type="file" id="docFile" name="doc_file" accept=".pdf, .doc, .docx" required>
                                    <div class="file-upload-placeholder">
                                        <i class="fas fa-file-pdf"></i>
                                        <span>Selecciona archivo PDF o DOCX (Máximo 10 MB)</span>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="docDescription">Descripción adicional</label>
                                <textarea id="docDescription" name="doc_description" rows="3" placeholder="Información opcional para la comunidad sobre este documento..."></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="dash-btn primary">
                                    <i class="fas fa-cloud-upload-alt"></i> Subir Documento
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Listado de Documentos -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-folder-open"></i> Documentos Registrados</h2>
                            <span class="badge-count"><?= count($docsList) ?> archivo(s)</span>
                        </div>

                        <?php if (empty($docsList)): ?>
                            <div class="dash-empty-state">
                                <i class="far fa-folder-open empty-icon"></i>
                                <p>No hay documentos registrados.</p>
                                <small>Sube circulares y manuales para que la comunidad pueda descargarlos.</small>
                            </div>
                        <?php else: ?>
                            <div class="dash-items-list">
                                <?php foreach ($docsList as $doc): ?>
                                    <article class="dash-item-card doc-item">
                                        <div class="doc-icon">
                                            <i class="fas fa-file-pdf"></i>
                                        </div>

                                        <div class="item-body">
                                            <div class="item-meta">
                                                <span class="category-badge category-doc">
                                                    <?= htmlspecialchars(strtoupper((string) $doc['category']), ENT_QUOTES, 'UTF-8') ?>
                                                </span>
                                                <span class="item-date"><?= htmlspecialchars((string) ($doc['file_size'] ?? 'PDF'), ENT_QUOTES, 'UTF-8') ?></span>
                                            </div>
                                            <h3 class="item-title"><?= htmlspecialchars((string) $doc['title'], ENT_QUOTES, 'UTF-8') ?></h3>
                                            <?php if (!empty($doc['description'])): ?>
                                                <p class="item-excerpt"><?= htmlspecialchars((string) $doc['description'], ENT_QUOTES, 'UTF-8') ?></p>
                                            <?php endif; ?>
                                        </div>

                                        <div class="item-actions">
                                            <a class="action-btn download" href="<?= htmlspecialchars(resolveAdminAsset($doc['file_path']), ENT_QUOTES, 'UTF-8') ?>" target="_blank" title="Ver / Descargar">
                                                <i class="fas fa-download"></i>
                                            </a>
                                            <form method="post" action="index.php?tab=documentos" onsubmit="return confirm('¿Deseas eliminar este documento?');">
                                                <input type="hidden" name="form_section" value="documentos">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                <input type="hidden" name="id" value="<?= (int) $doc['id'] ?>">
                                                <button type="submit" class="action-btn delete" title="Eliminar">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- SECCIÓN 3: SEGURIDAD Y PERFIL -->
        <?php if ($activeTab === 'seguridad'): ?>
            <section class="dash-section active">
                <div class="dash-single-card-wrapper">
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-user-shield"></i> Ajustes de Acceso y Seguridad</h2>
                        </div>

                        <form class="dash-form" method="post" action="index.php?tab=seguridad" autocomplete="off">
                            <input type="hidden" name="form_section" value="seguridad">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                            <div class="form-group">
                                <label for="adminFullName">Nombre del Administrador</label>
                                <input type="text" id="adminFullName" name="full_name" value="<?= htmlspecialchars((string) ($currentAdmin['full_name'] ?? 'Administrador'), ENT_QUOTES, 'UTF-8') ?>" required>
                            </div>

                            <div class="form-group">
                                <label for="adminUserField">Nombre de Usuario de Acceso</label>
                                <input type="text" id="adminUserField" name="username" value="<?= htmlspecialchars((string) ($currentAdmin['username'] ?? 'admin'), ENT_QUOTES, 'UTF-8') ?>" required>
                            </div>

                            <hr class="form-divider">
                            <p class="form-helper-text">Para cambiar tu contraseña o datos de acceso, ingresa tu contraseña actual para confirmar tu identidad.</p>

                            <div class="form-group">
                                <label for="currentPassword">Contraseña Actual *</label>
                                <input type="password" id="currentPassword" name="current_password" placeholder="Ingresa tu contraseña actual" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="newPassword">Nueva Contraseña (Opcional)</label>
                                    <input type="password" id="newPassword" name="new_password" placeholder="Mínimo 6 caracteres (o dejar en blanco)">
                                </div>

                                <div class="form-group">
                                    <label for="confirmPassword">Confirmar Nueva Contraseña</label>
                                    <input type="password" id="confirmPassword" name="confirm_password" placeholder="Repite la nueva contraseña">
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="dash-btn primary">
                                    <i class="fas fa-check-circle"></i> Actualizar Credenciales
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        <?php endif; ?>

    </main>

    <script>
        function previewImage(input) {
            const previewContainer = document.getElementById('imagePreviewContainer');
            const previewImage = document.getElementById('imagePreview');
            const placeholder = document.getElementById('uploadPlaceholder');

            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewContainer.style.display = 'block';
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>
