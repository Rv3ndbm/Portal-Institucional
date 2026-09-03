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

if (!function_exists('resolveAdminAsset')) {
    function resolveAdminAsset(?string $path): string {
        $p = trim((string) $path);
        if ($p === '') return '';
        if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
            return $p;
        }
        return '../../' . ltrim($p, '/');
    }
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

        // --------------------------------------------------------
        // 4. SECCIÓN: AVISOS URGENTES Y COMUNICADOS
        // --------------------------------------------------------
        elseif ($section === 'aviso') {
            $action = $_POST['action'] ?? 'save';
            $avisoId = (int) ($_POST['id'] ?? 0);

            if ($action === 'delete') {
                if ($avisoId > 0) {
                    $stmt = $pdo->prepare('DELETE FROM avisos WHERE id = :id');
                    $stmt->execute([':id' => $avisoId]);
                    $message = 'Aviso eliminado correctamente del sistema.';
                }
            } elseif ($action === 'toggle') {
                if ($avisoId > 0) {
                    $stmt = $pdo->prepare('UPDATE avisos SET activo = IF(activo = 1, 0, 1) WHERE id = :id');
                    $stmt->execute([':id' => $avisoId]);
                    $message = 'Estado de publicación del aviso actualizado.';
                }
            } else {
                $activo = isset($_POST['activo']) && $_POST['activo'] === '1' ? 1 : 0;
                $titulo = trim((string) ($_POST['titulo'] ?? ''));
                $mensaje = trim((string) ($_POST['mensaje'] ?? ''));
                $tipo = trim((string) ($_POST['tipo'] ?? 'warning'));
                $enlace = trim((string) ($_POST['enlace'] ?? ''));
                $textoEnlace = trim((string) ($_POST['texto_enlace'] ?? 'Ver más'));
                $duracionDias = (int) ($_POST['duracion_dias'] ?? 1);

                if ($titulo === '') {
                    $message = 'El título del aviso o comunicado es obligatorio.';
                    $messageType = 'error';
                } elseif ($mensaje === '') {
                    $message = 'El mensaje del aviso es obligatorio.';
                    $messageType = 'error';
                } else {
                    if ($duracionDias > 0) {
                        $expiresAt = date('Y-m-d H:i:s', strtotime("+{$duracionDias} days"));
                    } else {
                        $expiresAt = null; // Permanente
                    }

                    if ($avisoId > 0) {
                        $stmt = $pdo->prepare('UPDATE avisos SET titulo = :titulo, mensaje = :mensaje, tipo = :tipo, enlace = :enlace, texto_enlace = :texto_enlace, duracion_dias = :duracion_dias, activo = :activo, expires_at = :expires_at WHERE id = :id');
                        $stmt->execute([
                            ':titulo'        => $titulo,
                            ':mensaje'       => $mensaje,
                            ':tipo'          => $tipo,
                            ':enlace'        => $enlace,
                            ':texto_enlace'  => $textoEnlace,
                            ':duracion_dias' => $duracionDias,
                            ':activo'        => $activo,
                            ':expires_at'    => $expiresAt,
                            ':id'            => $avisoId
                        ]);
                        $message = 'Aviso actualizado correctamente.';
                    } else {
                        $stmt = $pdo->prepare('INSERT INTO avisos (titulo, mensaje, tipo, enlace, texto_enlace, duracion_dias, activo, expires_at) VALUES (:titulo, :mensaje, :tipo, :enlace, :texto_enlace, :duracion_dias, :activo, :expires_at)');
                        $stmt->execute([
                            ':titulo'        => $titulo,
                            ':mensaje'       => $mensaje,
                            ':tipo'          => $tipo,
                            ':enlace'        => $enlace,
                            ':texto_enlace'  => $textoEnlace,
                            ':duracion_dias' => $duracionDias,
                            ':activo'        => $activo,
                            ':expires_at'    => $expiresAt
                        ]);
                        $message = 'Nuevo aviso institucional publicado exitosamente.';
                    }
                }
            }
        }

        // --------------------------------------------------------
        // 5. SECCIÓN: MENSAJES Y PQRS (CONTACTO)
        // --------------------------------------------------------
        elseif ($section === 'mensajes') {
            $action = $_POST['action'] ?? '';

            if ($action === 'toggle_read') {
                $msgId = (int) ($_POST['id'] ?? 0);
                if ($msgId > 0) {
                    $stmt = $pdo->prepare('UPDATE mensajes_contacto SET leido = IF(leido = 1, 0, 1) WHERE id = :id');
                    $stmt->execute([':id' => $msgId]);
                    $message = 'Estado de lectura del mensaje actualizado correctamente.';
                }
            } elseif ($action === 'mark_all_read') {
                $pdo->exec('UPDATE mensajes_contacto SET leido = 1');
                $message = 'Todos los mensajes han sido marcados como leídos.';
            } elseif ($action === 'delete') {
                $msgId = (int) ($_POST['id'] ?? 0);
                if ($msgId > 0) {
                    $stmt = $pdo->prepare('DELETE FROM mensajes_contacto WHERE id = :id');
                    $stmt->execute([':id' => $msgId]);
                    $message = 'Mensaje eliminado del registro.';
                }
            } elseif ($action === 'save_mail_config') {
                $destEmail = trim((string) ($_POST['destinatario_email'] ?? ''));
                $remitEmail = trim((string) ($_POST['remitente_email'] ?? ''));
                $destNombre = trim((string) ($_POST['destinatario_nombre'] ?? ''));

                if ($destEmail === '' || !filter_var($destEmail, FILTER_VALIDATE_EMAIL)) {
                    $message = 'Por favor ingresa un correo de recepción válido.';
                    $messageType = 'error';
                } else {
                    $configFile = __DIR__ . '/../config/mail_config.php';
                    $cfg = file_exists($configFile) ? (include $configFile) : [];
                    $cfg['destinatario_email'] = $destEmail;
                    if ($destNombre !== '') $cfg['destinatario_nombre'] = $destNombre;
                    if ($remitEmail !== '' && filter_var($remitEmail, FILTER_VALIDATE_EMAIL)) {
                        $cfg['remitente_email'] = $remitEmail;
                    }

                    $exported = "<?php\n// Configuración generada desde el Panel de Administración GAA\nreturn " . var_export($cfg, true) . ";\n";
                    file_put_contents($configFile, $exported);
                    $message = 'Configuración de correo actualizada exitosamente.';
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

// Listado de mensajes de contacto y conteo de no leídos
$stmtMsg = $pdo->query('SELECT * FROM mensajes_contacto ORDER BY created_at DESC');
$mensajesList = $stmtMsg->fetchAll();
$unreadMessagesCount = 0;
foreach ($mensajesList as $m) {
    if (empty($m['leido'])) {
        $unreadMessagesCount++;
    }
}

// Configuración actual de correo
$mailConfig = file_exists(__DIR__ . '/../config/mail_config.php') ? (include __DIR__ . '/../config/mail_config.php') : [];
$currentDestEmail = $mailConfig['destinatario_email'] ?? 'ie.gilbertoalzate@medellin.gov.co';
$currentDestNombre = $mailConfig['destinatario_nombre'] ?? 'I.E. Gilberto Alzate Avendaño';
$currentRemitEmail = $mailConfig['remitente_email'] ?? 'no-reply@alzate.edu.co';

// Edición de aviso
$editingAviso = null;
if (!empty($_GET['edit_aviso'])) {
    $stmt = $pdo->prepare('SELECT * FROM avisos WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => (int) $_GET['edit_aviso']]);
    $editingAviso = $stmt->fetch();
    $activeTab = 'aviso';
}

// Listado completo de avisos y conteo de activos
$stmtAvisos = $pdo->query('SELECT * FROM avisos ORDER BY id DESC');
$avisosList = $stmtAvisos->fetchAll();
$activeAvisosList = getActiveAvisos($pdo);
$activeAvisosCount = count($activeAvisosList);

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
    <link rel="stylesheet" href="../../css/admin.css?v=<?= time() ?>">
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
            <a href="?tab=mensajes" class="dash-tab-link <?= $activeTab === 'mensajes' ? 'active' : '' ?>">
                <i class="fas fa-inbox"></i> <span>Mensajes de Contacto</span>
                <?php if ($unreadMessagesCount > 0): ?>
                    <span class="tab-badge" style="background: #dc2626; color: white; font-weight: 700;"><?= $unreadMessagesCount ?> nuevos</span>
                <?php else: ?>
                    <span class="tab-badge"><?= count($mensajesList) ?></span>
                <?php endif; ?>
            </a>
            <a href="?tab=noticias" class="dash-tab-link <?= $activeTab === 'noticias' ? 'active' : '' ?>">
                <i class="fas fa-newspaper"></i> <span>Noticias y Novedades</span>
                <span class="tab-badge"><?= count($newsList) ?></span>
            </a>
            <a href="?tab=documentos" class="dash-tab-link <?= $activeTab === 'documentos' ? 'active' : '' ?>">
                <i class="fas fa-file-pdf"></i> <span>Documentos y Circulares</span>
                <span class="tab-badge"><?= count($docsList) ?></span>
            </a>
            <a href="?tab=aviso" class="dash-tab-link <?= $activeTab === 'aviso' ? 'active' : '' ?>">
                <i class="fas fa-bullhorn"></i> <span>Avisos Urgentes</span>
                <?php if ($activeAvisosCount > 0): ?>
                    <span class="tab-badge" style="background: #16a34a; color: white;"><?= $activeAvisosCount ?> activos</span>
                <?php else: ?>
                    <span class="tab-badge"><?= count($avisosList) ?></span>
                <?php endif; ?>
            </a>
            <a href="?tab=seguridad" class="dash-tab-link <?= $activeTab === 'seguridad' ? 'active' : '' ?>">
                <i class="fas fa-user-shield"></i> <span>Seguridad y Contraseña</span>
            </a>
        </nav>

        <!-- SECCIÓN 0: MENSAJES DE CONTACTO Y PQRS -->
        <?php if ($activeTab === 'mensajes'): ?>
            <section class="dash-section active">
                <!-- Métricas KPI -->
                <div class="stat-cards-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <div class="stat-info">
                            <h3><?= count($mensajesList) ?></h3>
                            <p>Total Mensajes Recibidos</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon red">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="stat-info">
                            <h3><?= $unreadMessagesCount ?></h3>
                            <p>Nuevos (Sin Leer)</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="fas fa-envelope-open-text"></i>
                        </div>
                        <div class="stat-info">
                            <h3><?= count($mensajesList) - $unreadMessagesCount ?></h3>
                            <p>Mensajes Atendidos</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="fas fa-at"></i>
                        </div>
                        <div class="stat-info" style="min-width: 0;">
                            <h3 style="font-size: 1.05rem; word-break: break-all;"><?= htmlspecialchars((string)$currentDestEmail, ENT_QUOTES, 'UTF-8') ?></h3>
                            <p>Buzón Receptor Configurado</p>
                        </div>
                    </div>
                </div>

                <div class="dash-grid-layout" style="grid-template-columns: 1fr;">
                    <!-- Bandeja de Entrada -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-comments"></i> Bandeja de Solicitudes y Contacto</h2>
                            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                <?php if ($unreadMessagesCount > 0): ?>
                                    <form method="post" action="index.php?tab=mensajes" style="margin: 0;">
                                        <input type="hidden" name="form_section" value="mensajes">
                                        <input type="hidden" name="action" value="mark_all_read">
                                        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                        <button type="submit" class="dash-btn-small secondary" style="background:#e0e7ff; color:#3730a3;">
                                            <i class="fas fa-check-double"></i> Marcar todos como leídos
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>

                        <!-- Barra de Búsqueda y Filtros -->
                        <div class="dash-filter-bar">
                            <div class="search-bar-dash">
                                <i class="fas fa-search"></i>
                                <input type="text" id="msgSearchInput" placeholder="Buscar por radicado, nombre, email, sede, asunto..." onkeyup="filterMessagesTable()">
                            </div>

                            <div class="filter-pills">
                                <button type="button" class="filter-pill active" onclick="setMsgFilter('all', this)">Todos (<?= count($mensajesList) ?>)</button>
                                <button type="button" class="filter-pill" onclick="setMsgFilter('unread', this)">No leídos (<?= $unreadMessagesCount ?>)</button>
                                <button type="button" class="filter-pill" onclick="setMsgFilter('read', this)">Leídos (<?= count($mensajesList) - $unreadMessagesCount ?>)</button>
                            </div>
                        </div>

                        <!-- Tabla de Mensajes -->
                        <div class="dash-table-wrapper">
                            <?php if (empty($mensajesList)): ?>
                                <div class="dash-empty-state">
                                    <i class="fas fa-inbox empty-icon"></i>
                                    <p>Aún no se han recibido solicitudes o mensajes de contacto.</p>
                                </div>
                            <?php else: ?>
                                <table class="dash-table" id="messagesTable">
                                    <thead>
                                        <tr>
                                            <th>Radicado</th>
                                            <th>Estado</th>
                                            <th>Remitente</th>
                                            <th>Asunto / Sede</th>
                                            <th>Fecha y Hora</th>
                                            <th style="text-align: right;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($mensajesList as $msg): 
                                            $radicadoCode = !empty($msg['radicado']) ? $msg['radicado'] : ('GAA-' . str_pad((string)$msg['id'], 5, '0', STR_PAD_LEFT));
                                            $isUnread = empty($msg['leido']);
                                            $fechaFormatted = !empty($msg['created_at']) ? date('d M Y, h:i A', strtotime($msg['created_at'])) : 'Reciente';
                                        ?>
                                            <tr class="msg-row <?= $isUnread ? 'unread-row' : 'read-row' ?>" 
                                                data-status="<?= $isUnread ? 'unread' : 'read' ?>"
                                                data-search="<?= htmlspecialchars(strtolower($radicadoCode . ' ' . $msg['nombre'] . ' ' . $msg['email'] . ' ' . ($msg['telefono'] ?? '') . ' ' . $msg['asunto'] . ' ' . ($msg['sede'] ?? '') . ' ' . $msg['mensaje']), ENT_QUOTES, 'UTF-8') ?>">
                                                
                                                <td>
                                                    <span class="radicado-badge">#<?= htmlspecialchars($radicadoCode, ENT_QUOTES, 'UTF-8') ?></span>
                                                </td>

                                                <td>
                                                    <?php if ($isUnread): ?>
                                                        <span class="status-badge unread"><i class="fas fa-circle" style="font-size: 0.55rem;"></i> Nuevo</span>
                                                    <?php else: ?>
                                                        <span class="status-badge read"><i class="fas fa-check"></i> Leído</span>
                                                    <?php endif; ?>
                                                </td>

                                                <td>
                                                    <div class="sender-info">
                                                        <span class="sender-name"><?= htmlspecialchars($msg['nombre'], ENT_QUOTES, 'UTF-8') ?></span>
                                                        <div class="sender-links">
                                                            <a href="mailto:<?= htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8') ?>" title="Escribir a <?= htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8') ?>">
                                                                <i class="fas fa-envelope"></i> <?= htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8') ?>
                                                            </a>
                                                            <?php if (!empty($msg['telefono'])): ?>
                                                                <a href="https://wa.me/57<?= preg_replace('/\D/', '', $msg['telefono']) ?>" target="_blank" title="WhatsApp" style="color: #16a34a;">
                                                                    <i class="fab fa-whatsapp"></i> <?= htmlspecialchars($msg['telefono'], ENT_QUOTES, 'UTF-8') ?>
                                                                </a>
                                                            <?php endif; ?>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div style="display: flex; flex-direction: column; gap: 4px;">
                                                        <span class="asunto-pill"><?= htmlspecialchars($msg['asunto'], ENT_QUOTES, 'UTF-8') ?></span>
                                                        <?php if (!empty($msg['sede'])): ?>
                                                            <span class="sede-pill"><i class="fas fa-map-marker-alt"></i> <?= htmlspecialchars($msg['sede'], ENT_QUOTES, 'UTF-8') ?></span>
                                                        <?php endif; ?>
                                                    </div>
                                                </td>

                                                <td>
                                                    <small style="color: var(--dash-text-muted); white-space: nowrap; font-weight: 500;">
                                                        <i class="far fa-clock"></i> <?= htmlspecialchars($fechaFormatted, ENT_QUOTES, 'UTF-8') ?>
                                                    </small>
                                                </td>

                                                <td style="text-align: right;">
                                                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                                                        <!-- Ver Detalle -->
                                                        <button type="button" class="action-btn edit" title="Ver Detalle Completo" 
                                                                onclick="showMsgDetail(<?= htmlspecialchars(json_encode([
                                                                    'id'         => $msg['id'],
                                                                    'radicado'   => $radicadoCode,
                                                                    'nombre'     => $msg['nombre'],
                                                                    'email'      => $msg['email'],
                                                                    'telefono'   => $msg['telefono'] ?? '',
                                                                    'asunto'     => $msg['asunto'],
                                                                    'sede'       => $msg['sede'] ?? 'No especificada',
                                                                    'mensaje'    => $msg['mensaje'],
                                                                    'ip_origen'  => $msg['ip_origen'] ?? 'Desconocida',
                                                                    'fecha'      => $fechaFormatted,
                                                                    'leido'      => !empty($msg['leido']) ? 1 : 0
                                                                ]), ENT_QUOTES, 'UTF-8') ?>)">
                                                            <i class="fas fa-eye"></i>
                                                        </button>

                                                        <!-- Toggle Leído -->
                                                        <form method="post" action="index.php?tab=mensajes" style="margin: 0;">
                                                            <input type="hidden" name="form_section" value="mensajes">
                                                            <input type="hidden" name="action" value="toggle_read">
                                                            <input type="hidden" name="id" value="<?= (int) $msg['id'] ?>">
                                                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                            <button type="submit" class="action-btn download" title="<?= $isUnread ? 'Marcar como leído' : 'Marcar como no leído' ?>">
                                                                <i class="fas <?= $isUnread ? 'fa-envelope-open' : 'fa-envelope' ?>"></i>
                                                            </button>
                                                        </form>

                                                        <!-- Responder por Gmail y Email -->
                                                        <?php 
                                                            $mailSubjectPlain = "Respuesta a Solicitud Radicado #" . $radicadoCode . " - I.E. Gilberto Alzate Avendaño";
                                                            $mailBodyPlain = "Estimado(a) " . $msg['nombre'] . ",\n\nEn atención a su solicitud radicada a través del portal web institucional con el radicado #" . $radicadoCode . " referente a \"" . $msg['asunto'] . "\":\n\n[Escriba su respuesta aquí]\n\nAtentamente,\nEquipo Directivo y Administrativo\nI.E. Gilberto Alzate Avendaño";
                                                            $gmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" . urlencode($msg['email']) . "&su=" . urlencode($mailSubjectPlain) . "&body=" . urlencode($mailBodyPlain);
                                                            $mailtoUrl = "mailto:" . htmlspecialchars($msg['email'], ENT_QUOTES, 'UTF-8') . "?subject=" . rawurlencode($mailSubjectPlain) . "&body=" . rawurlencode($mailBodyPlain);
                                                        ?>
                                                        <a href="<?= htmlspecialchars($gmailComposeUrl, ENT_QUOTES, 'UTF-8') ?>" target="_blank" class="action-btn" style="background:#fee2e2; color:#ea4335;" title="Responder directamente en Gmail">
                                                            <i class="fab fa-google"></i>
                                                        </a>
                                                        <a href="<?= $mailtoUrl ?>" class="action-btn edit" style="background:#dcfce7; color:#15803d;" title="Responder en aplicación de correo">
                                                            <i class="fas fa-envelope"></i>
                                                        </a>

                                                        <!-- Eliminar -->
                                                        <form method="post" action="index.php?tab=mensajes" style="margin: 0;" onsubmit="return confirm('¿Estás seguro de eliminar este mensaje del registro institucional?');">
                                                            <input type="hidden" name="form_section" value="mensajes">
                                                            <input type="hidden" name="action" value="delete">
                                                            <input type="hidden" name="id" value="<?= (int) $msg['id'] ?>">
                                                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                            <button type="submit" class="action-btn delete" title="Eliminar Mensaje">
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Configuración de Correo Receptor -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-cog"></i> Configuración del Buzón Receptor de Mensajes</h2>
                        </div>

                        <form class="dash-form" method="post" action="index.php?tab=mensajes">
                            <input type="hidden" name="form_section" value="mensajes">
                            <input type="hidden" name="action" value="save_mail_config">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="destEmail">Correo Destinatario Oficial *</label>
                                    <input type="email" id="destEmail" name="destinatario_email" value="<?= htmlspecialchars((string)$currentDestEmail, ENT_QUOTES, 'UTF-8') ?>" placeholder="ie.gilbertoalzate@medellin.gov.co" required>
                                    <small style="color: var(--dash-text-muted);">A este correo electrónico llegarán todas las notificaciones de los mensajes enviados desde la página de contacto.</small>
                                </div>

                                <div class="form-group">
                                    <label for="destNombre">Nombre Institucional de Recepción</label>
                                    <input type="text" id="destNombre" name="destinatario_nombre" value="<?= htmlspecialchars((string)$currentDestNombre, ENT_QUOTES, 'UTF-8') ?>" placeholder="I.E. Gilberto Alzate Avendaño">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="remitEmail">Correo Remitente del Sistema (No-Reply)</label>
                                    <input type="email" id="remitEmail" name="remitente_email" value="<?= htmlspecialchars((string)$currentRemitEmail, ENT_QUOTES, 'UTF-8') ?>" placeholder="no-reply@alzate.edu.co">
                                </div>
                            </div>

                            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; margin-bottom: 18px; display: flex; gap: 12px; align-items: flex-start;">
                                <i class="fas fa-info-circle" style="color: #2563eb; font-size: 1.25rem; margin-top: 2px;"></i>
                                <div style="font-size: 0.85rem; color: #1e3a8a; line-height: 1.5;">
                                    <strong>Información sobre el envío de correos:</strong>
                                    <p style="margin: 4px 0 0 0;">
                                        En servidores locales de desarrollo (como XAMPP en Windows), todos los mensajes se guardan de forma 100% segura en esta base de datos y se registran en los logs. En un servidor de producción en internet (hosting o VPS con Apache/cPanel), los correos se entregan en tiempo real a la bandeja de entrada configurada arriba.
                                    </p>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="dash-btn primary">
                                    <i class="fas fa-save"></i> Guardar Configuración de Correo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        <?php endif; ?>

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

        <!-- SECCIÓN: AVISOS URGENTES Y COMUNICADOS (MÚLTIPLES AVISOS) -->
        <?php if ($activeTab === 'aviso'): ?>
            <section class="dash-section active">
                <div class="dash-grid-layout">
                    <!-- Formulario de Creación / Edición del Aviso -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas <?= $editingAviso ? 'fa-edit' : 'fa-plus-circle' ?>"></i> <?= $editingAviso ? 'Editar Comunicado' : 'Publicar Nuevo Aviso / Comunicado' ?></h2>
                            <?php if ($editingAviso): ?>
                                <a href="index.php?tab=aviso" class="dash-btn-small secondary">Cancelar Edición</a>
                            <?php endif; ?>
                        </div>

                        <form class="dash-form" method="post" action="index.php?tab=aviso" autocomplete="off">
                            <input type="hidden" name="form_section" value="aviso">
                            <input type="hidden" name="action" value="save">
                            <input type="hidden" name="id" value="<?= htmlspecialchars((string)($editingAviso['id'] ?? '0'), ENT_QUOTES, 'UTF-8') ?>">
                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                            <!-- Interruptor de Activación -->
                            <div class="form-group" style="background: rgba(30, 60, 114, 0.04); padding: 16px; border-radius: 12px; border: 1.5px solid rgba(30, 60, 114, 0.12);">
                                <label style="display:flex; align-items:center; gap: 12px; cursor: pointer; font-weight:700; font-size:0.95rem;">
                                    <input type="checkbox" name="activo" value="1" <?= (!empty($editingAviso) ? (!empty($editingAviso['activo']) ? 'checked' : '') : 'checked') ?> style="width:20px; height:20px; accent-color: var(--dash-primary); cursor:pointer;">
                                    <span>Activar y mostrar este aviso inmediatamente en el portal</span>
                                </label>
                                <small class="form-helper-text" style="display:block; margin: 6px 0 0 32px; color: var(--dash-text-muted);">
                                    Los avisos activos se mostrarán en la marquesina institucional y en la página principal.
                                </small>
                            </div>

                            <div class="form-group">
                                <label for="avisoTitulo">Título del Aviso / Encabezado *</label>
                                <input type="text" id="avisoTitulo" name="titulo" value="<?= htmlspecialchars((string) ($editingAviso['titulo'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" placeholder="Ej: Jornada Pedagógica / Suspensión de Clases" required>
                            </div>

                            <div class="form-group">
                                <label for="avisoMensaje">Texto Detallado del Comunicado *</label>
                                <textarea id="avisoMensaje" name="mensaje" rows="3" placeholder="Redacta el mensaje que se mostrará a la comunidad escolar..." required><?= htmlspecialchars((string) ($editingAviso['mensaje'] ?? ''), ENT_QUOTES, 'UTF-8') ?></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="avisoTipo">Nivel / Tipo de Alerta *</label>
                                    <select id="avisoTipo" name="tipo">
                                        <option value="warning" <?= (($editingAviso['tipo'] ?? 'warning') === 'warning') ? 'selected' : '' ?>>⚠️ Importante / Alerta (Naranja)</option>
                                        <option value="danger" <?= (($editingAviso['tipo'] ?? '') === 'danger') ? 'selected' : '' ?>>🚨 Urgente / Crítico (Rojo)</option>
                                        <option value="info" <?= (($editingAviso['tipo'] ?? '') === 'info') ? 'selected' : '' ?>>ℹ️ Informativo / Comunicado (Azul)</option>
                                        <option value="success" <?= (($editingAviso['tipo'] ?? '') === 'success') ? 'selected' : '' ?>>✅ Institucional / Felicitación (Verde)</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="avisoDuracion">Vigencia / Duración *</label>
                                    <select id="avisoDuracion" name="duracion_dias">
                                        <option value="1" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 1) ? 'selected' : '' ?>>1 Día (24 Horas)</option>
                                        <option value="3" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 3) ? 'selected' : '' ?>>3 Días</option>
                                        <option value="7" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 7) ? 'selected' : '' ?>>1 Semana (7 Días)</option>
                                        <option value="15" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 15) ? 'selected' : '' ?>>15 Días</option>
                                        <option value="30" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 30) ? 'selected' : '' ?>>1 Mes (30 Días)</option>
                                        <option value="0" <?= ((int)($editingAviso['duracion_dias'] ?? 1) === 0) ? 'selected' : '' ?>>Permanente (Hasta desactivarlo)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="avisoEnlace">Enlace de Acción Opcional</label>
                                    <input type="text" id="avisoEnlace" name="enlace" value="<?= htmlspecialchars((string) ($editingAviso['enlace'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" placeholder="Ej: ../public/documentos.php o enlace externo">
                                </div>

                                <div class="form-group">
                                    <label for="avisoTextoEnlace">Texto del Botón</label>
                                    <input type="text" id="avisoTextoEnlace" name="texto_enlace" value="<?= htmlspecialchars((string) ($editingAviso['texto_enlace'] ?? 'Ver más'), ENT_QUOTES, 'UTF-8') ?>" placeholder="Ej: Ver circular oficial">
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="dash-btn primary">
                                    <i class="fas fa-save"></i> <?= $editingAviso ? 'Guardar Cambios' : 'Publicar Comunicado' ?>
                                </button>
                                <?php if ($editingAviso): ?>
                                    <a href="index.php?tab=aviso" class="dash-btn secondary">Cancelar</a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>

                    <!-- Listado de Avisos Creados -->
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <h2><i class="fas fa-list-ul"></i> Todos los Avisos Registrados</h2>
                            <span class="badge-count"><?= $activeAvisosCount ?> activo(s) de <?= count($avisosList) ?></span>
                        </div>

                        <?php if (empty($avisosList)): ?>
                            <div class="dash-empty-state">
                                <i class="fas fa-bullhorn empty-icon"></i>
                                <p>No hay avisos registrados actualmente. ¡Crea el primero desde el formulario!</p>
                            </div>
                        <?php else: ?>
                            <div class="dash-items-list">
                                <?php foreach ($avisosList as $av): 
                                    $isAvActive = (!empty($av['activo']) && (empty($av['expires_at']) || strtotime($av['expires_at']) > time()));
                                    $isExpired = (!empty($av['expires_at']) && strtotime($av['expires_at']) <= time());
                                    $tipoClassBadge = ($av['tipo'] === 'danger') ? 'status-badge unread' :
                                                      (($av['tipo'] === 'success') ? 'status-badge' : 'status-badge');
                                    $tipoColor = ($av['tipo'] === 'danger') ? '#dc2626' :
                                                 (($av['tipo'] === 'success') ? '#16a34a' :
                                                 (($av['tipo'] === 'info') ? '#2563eb' : '#d97706'));
                                ?>
                                    <article class="dash-item-card" style="border-left: 4px solid <?= $tipoColor ?>; <?= !$isAvActive ? 'opacity: 0.75;' : '' ?>">
                                        <div class="item-content" style="flex: 1;">
                                            <div style="display:flex; gap:8px; align-items:center; margin-bottom: 6px; flex-wrap: wrap;">
                                                <?php if ($isAvActive): ?>
                                                    <span class="status-badge" style="background:#dcfce7; color:#15803d;"><i class="fas fa-check-circle"></i> Activo</span>
                                                <?php elseif ($isExpired): ?>
                                                    <span class="status-badge" style="background:#fee2e2; color:#b91c1c;"><i class="fas fa-clock"></i> Expirado</span>
                                                <?php else: ?>
                                                    <span class="status-badge" style="background:#e2e8f0; color:#64748b;"><i class="fas fa-eye-slash"></i> Inactivo</span>
                                                <?php endif; ?>

                                                <span class="asunto-pill" style="font-size:0.75rem; text-transform:uppercase;">
                                                    <?= htmlspecialchars($av['tipo'] ?? 'warning', ENT_QUOTES, 'UTF-8') ?>
                                                </span>
                                            </div>

                                            <h3 class="item-title" style="margin-bottom: 4px;"><?= htmlspecialchars($av['titulo'], ENT_QUOTES, 'UTF-8') ?></h3>
                                            <p style="font-size: 0.85rem; color: #475569; line-height: 1.4; margin-bottom: 8px;">
                                                <?= htmlspecialchars(mb_substr($av['mensaje'], 0, 140), ENT_QUOTES, 'UTF-8') ?><?= mb_strlen($av['mensaje']) > 140 ? '...' : '' ?>
                                            </p>

                                            <div class="item-meta" style="font-size: 0.78rem;">
                                                <?php if (!empty($av['expires_at'])): ?>
                                                    <span><i class="far fa-calendar-alt"></i> Vence: <?= date('d/m/Y H:i', strtotime($av['expires_at'])) ?></span>
                                                <?php else: ?>
                                                    <span><i class="fas fa-infinity"></i> Permanente</span>
                                                <?php endif; ?>
                                            </div>
                                        </div>

                                        <div class="item-actions">
                                            <!-- Toggle Activar / Desactivar -->
                                            <form method="post" action="index.php?tab=aviso" style="margin: 0;">
                                                <input type="hidden" name="form_section" value="aviso">
                                                <input type="hidden" name="action" value="toggle">
                                                <input type="hidden" name="id" value="<?= (int) $av['id'] ?>">
                                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                <button type="submit" class="action-btn <?= $isAvActive ? 'download' : 'edit' ?>" title="<?= $isAvActive ? 'Desactivar Aviso' : 'Activar Aviso' ?>">
                                                    <i class="fas <?= $isAvActive ? 'fa-toggle-on' : 'fa-toggle-off' ?>" style="font-size:1.1rem; color: <?= $isAvActive ? '#16a34a' : '#94a3b8' ?>;"></i>
                                                </button>
                                            </form>

                                            <!-- Editar -->
                                            <a class="action-btn edit" href="index.php?tab=aviso&edit_aviso=<?= (int) $av['id'] ?>" title="Editar Aviso">
                                                <i class="fas fa-edit"></i>
                                            </a>

                                            <!-- Eliminar -->
                                            <form method="post" action="index.php?tab=aviso" style="margin: 0;" onsubmit="return confirm('¿Estás seguro de eliminar este aviso permanentemente?');">
                                                <input type="hidden" name="form_section" value="aviso">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= (int) $av['id'] ?>">
                                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">
                                                <button type="submit" class="action-btn delete" title="Eliminar Aviso">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>

                        <!-- Vista Previa de la Marquesina Ticker en Vivo -->
                        <?php if ($activeAvisosCount > 0): ?>
                            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--dash-border);">
                                <h3 style="font-size: 0.84rem; text-transform: uppercase; color: var(--dash-text-muted); font-weight: 700; margin-bottom: 10px;">
                                    <i class="fas fa-tv"></i> Vista previa de la marquesina en el sitio:
                                </h3>
                                <div style="background: #0f172a; border-radius: 12px; padding: 14px 18px; color: #fff; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                                    <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 8px;">
                                        <span style="background: #e74c3c; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 12px; text-transform: uppercase;">
                                            <i class="fas fa-bell"></i> En Vivo (<?= $activeAvisosCount ?> activo<?= $activeAvisosCount > 1 ? 's' : '' ?>)
                                        </span>
                                    </div>
                                    <div style="font-size: 0.88rem; line-height: 1.5; color: #cbd5e1;">
                                        <?php foreach ($activeAvisosList as $idx => $act): ?>
                                            <span><strong><?= htmlspecialchars($act['titulo'], ENT_QUOTES, 'UTF-8') ?>:</strong> <?= htmlspecialchars($act['mensaje'], ENT_QUOTES, 'UTF-8') ?></span>
                                            <?php if ($idx < count($activeAvisosList) - 1): ?>
                                                <span style="color: #38bdf8; margin: 0 8px;">✦</span>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
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

    <!-- MODAL DE DETALLE DE MENSAJE -->
    <div class="dash-modal-overlay" id="msgModalOverlay" style="display: none;" onclick="closeMsgModal(event)">
        <div class="dash-modal-card" onclick="event.stopPropagation()">
            <div class="dash-modal-header">
                <h2><i class="fas fa-envelope-open-text"></i> Solicitud <span id="modalRadicado" class="radicado-badge" style="margin-left: 8px;"></span></h2>
                <button type="button" class="dash-modal-close" onclick="closeMsgModal()" title="Cerrar">&times;</button>
            </div>
            
            <div class="dash-modal-body">
                <div class="msg-detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Nombre del Solicitante:</span>
                        <span class="detail-value" id="modalNombre"></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Correo Electrónico:</span>
                        <span class="detail-value" id="modalEmail"></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Teléfono / WhatsApp:</span>
                        <span class="detail-value" id="modalTelefono"></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Sede de Interés:</span>
                        <span class="detail-value" id="modalSede"></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Asunto / Motivo:</span>
                        <span class="detail-value" id="modalAsunto"></span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Fecha de Envío:</span>
                        <span class="detail-value" id="modalFecha"></span>
                    </div>
                </div>

                <div class="detail-item" style="margin-bottom: 8px;">
                    <span class="detail-label">Mensaje Recibido:</span>
                </div>
                <div class="msg-body-box" id="modalMensaje"></div>
            </div>

            <div class="dash-modal-footer">
                <a id="modalGmailBtn" href="#" target="_blank" class="dash-btn" style="background:#ea4335; color:#fff; font-size: 0.86rem; padding: 8px 16px;">
                    <i class="fab fa-google"></i> Responder por Gmail
                </a>
                <a id="modalReplyBtn" href="#" class="dash-btn secondary" style="font-size: 0.86rem; padding: 8px 16px;">
                    <i class="fas fa-envelope"></i> Otra App
                </a>
                <a id="modalWaBtn" href="#" target="_blank" class="dash-btn" style="background:#16a34a; color:#fff; font-size: 0.86rem; padding: 8px 16px; display:none;">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <button type="button" class="dash-btn secondary" onclick="closeMsgModal()" style="font-size: 0.86rem; padding: 8px 16px;">
                    Cerrar
                </button>
            </div>
        </div>
    </div>

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

        // === GESTIÓN DE MENSAJES DE CONTACTO ===
        let currentStatusFilter = 'all';

        function showMsgDetail(data) {
            document.getElementById('modalRadicado').textContent = '#' + data.radicado;
            document.getElementById('modalNombre').textContent = data.nombre;
            document.getElementById('modalEmail').textContent = data.email;
            document.getElementById('modalTelefono').textContent = data.telefono ? data.telefono : 'No registrado';
            document.getElementById('modalSede').textContent = data.sede;
            document.getElementById('modalAsunto').textContent = data.asunto;
            document.getElementById('modalFecha').textContent = data.fecha;
            document.getElementById('modalMensaje').textContent = data.mensaje;

            // Construir asunto y cuerpo institucional
            const mailSubject = 'Respuesta a Solicitud Radicado #' + data.radicado + ' - I.E. Gilberto Alzate Avendaño';
            const mailBody = 'Estimado(a) ' + data.nombre + ',\n\nEn atención a su solicitud enviada a través del portal web institucional con radicado #' + data.radicado + ' referente a "' + data.asunto + '":\n\n[Escriba su respuesta aquí]\n\nAtentamente,\nEquipo Directivo y Administrativo\nI.E. Gilberto Alzate Avendaño\nhttps://ie.alzate.edu.co';

            // URL directa para Gmail Web Compose
            const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(data.email) + '&su=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(mailBody);
            document.getElementById('modalGmailBtn').href = gmailUrl;

            // URL estándar mailto
            const mailtoUrl = 'mailto:' + encodeURIComponent(data.email) + '?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(mailBody);
            document.getElementById('modalReplyBtn').href = mailtoUrl;

            // Link de WhatsApp si tiene teléfono
            const waBtn = document.getElementById('modalWaBtn');
            if (data.telefono) {
                const cleanPhone = data.telefono.replace(/\D/g, '');
                if (cleanPhone.length >= 7) {
                    const waPhone = cleanPhone.length === 10 ? ('57' + cleanPhone) : cleanPhone;
                    const waText = encodeURIComponent('Hola ' + data.nombre + ', le escribimos desde la I.E. Gilberto Alzate Avendaño respecto a su solicitud con radicado #' + data.radicado + '.');
                    waBtn.href = 'https://wa.me/' + waPhone + '?text=' + waText;
                    waBtn.style.display = 'inline-flex';
                } else {
                    waBtn.style.display = 'none';
                }
            } else {
                waBtn.style.display = 'none';
            }

            const overlay = document.getElementById('msgModalOverlay');
            overlay.style.display = 'flex';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMsgModal(e) {
            if (!e || e.target === document.getElementById('msgModalOverlay') || e.target.classList.contains('dash-modal-close') || e.target.tagName === 'BUTTON') {
                const overlay = document.getElementById('msgModalOverlay');
                overlay.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMsgModal();
            }
        });

        function setMsgFilter(status, btn) {
            currentStatusFilter = status;
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            if (btn) btn.classList.add('active');
            filterMessagesTable();
        }

        function filterMessagesTable() {
            const query = (document.getElementById('msgSearchInput')?.value || '').toLowerCase().trim();
            const rows = document.querySelectorAll('#messagesTable tbody tr.msg-row');

            rows.forEach(row => {
                const status = row.getAttribute('data-status');
                const searchContent = row.getAttribute('data-search') || '';

                const matchesStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);
                const matchesQuery = !query || searchContent.includes(query);

                if (matchesStatus && matchesQuery) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
    </script>
</body>
</html>
