<?php
// ============================================================
// CONTROLADOR: DASHBOARD ADMINISTRATIVO MULTISECCIÓN
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../modelo/database.php';
require_once __DIR__ . '/../modelo/admin.php';
require_once __DIR__ . '/../modelo/noticias.php';
require_once __DIR__ . '/../modelo/documentos.php';
require_once __DIR__ . '/../modelo/avisos.php';
require_once __DIR__ . '/../modelo/contacto.php';

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
                    if (eliminarNoticia($pdo, $id)) {
                        $message = 'Noticia eliminada correctamente.';
                    } else {
                        $message = 'No se pudo eliminar la noticia.';
                        $messageType = 'error';
                    }
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
                        $datosNoticia = [
                            'title'      => $title,
                            'category'   => $category,
                            'date_label' => $dateLabel,
                            'image_url'  => $imageUrl,
                            'excerpt'    => $excerpt,
                            'content'    => $content,
                        ];

                        if ($id > 0) {
                            actualizarNoticia($pdo, $id, $datosNoticia);
                            $message = 'Noticia actualizada correctamente.';
                        } else {
                            crearNoticia($pdo, $datosNoticia);
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
                    if (eliminarDocumento($pdo, $id)) {
                        $message = 'Documento eliminado correctamente.';
                    } else {
                        $message = 'No se pudo eliminar el documento.';
                        $messageType = 'error';
                    }
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
                        crearDocumento($pdo, [
                            'title'       => $docTitle,
                            'category'    => $docCategory,
                            'file_path'   => $uploadResult['path'],
                            'file_size'   => $uploadResult['size_formatted'],
                            'description' => $docDescription,
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

            $adminData = buscarAdminPorId($pdo, $adminId);
            $currentHash = $adminData['password_hash'] ?? '';

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
                            actualizarPerfilAdmin($pdo, $adminId, $fullName, $newUsername, $newHash);
                            $_SESSION['admin_username'] = $newUsername;
                            $_SESSION['admin_name'] = $fullName;
                            $message = 'Datos de acceso y contraseña actualizados correctamente.';
                        }
                    } else {
                        actualizarPerfilAdmin($pdo, $adminId, $fullName, $newUsername);
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
                    eliminarAviso($pdo, $avisoId);
                    $message = 'Aviso eliminado correctamente del sistema.';
                }
            } elseif ($action === 'toggle') {
                if ($avisoId > 0) {
                    alternarEstadoAviso($pdo, $avisoId);
                    $message = 'Estado de publicación del aviso actualizado.';
                }
            } else {
                $activo = isset($_POST['activo']) && $_POST['activo'] === '1' ? 1 : 0;
                $titulo = trim((string) ($_POST['titulo'] ?? ''));
                $mensajeAviso = trim((string) ($_POST['mensaje'] ?? ''));
                $tipo = trim((string) ($_POST['tipo'] ?? 'warning'));
                $enlace = trim((string) ($_POST['enlace'] ?? ''));
                $textoEnlace = trim((string) ($_POST['texto_enlace'] ?? 'Ver más'));
                $duracionDias = (int) ($_POST['duracion_dias'] ?? 1);

                if ($titulo === '') {
                    $message = 'El título del aviso o comunicado es obligatorio.';
                    $messageType = 'error';
                } elseif ($mensajeAviso === '') {
                    $message = 'El mensaje del aviso es obligatorio.';
                    $messageType = 'error';
                } else {
                    $expiresAt = ($duracionDias > 0) ? date('Y-m-d H:i:s', strtotime("+{$duracionDias} days")) : null;

                    $datosAviso = [
                        'titulo'        => $titulo,
                        'mensaje'       => $mensajeAviso,
                        'tipo'          => $tipo,
                        'enlace'        => $enlace,
                        'texto_enlace'  => $textoEnlace,
                        'duracion_dias' => $duracionDias,
                        'activo'        => $activo,
                        'expires_at'    => $expiresAt,
                    ];

                    if ($avisoId > 0) {
                        actualizarAviso($pdo, $avisoId, $datosAviso);
                        $message = 'Aviso actualizado correctamente.';
                    } else {
                        crearAviso($pdo, $datosAviso);
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
                    alternarMensajeLeido($pdo, $msgId);
                    $message = 'Estado de lectura del mensaje actualizado correctamente.';
                }
            } elseif ($action === 'mark_all_read') {
                marcarTodosMensajesLeidos($pdo);
                $message = 'Todos los mensajes han sido marcados como leídos.';
            } elseif ($action === 'delete') {
                $msgId = (int) ($_POST['id'] ?? 0);
                if ($msgId > 0) {
                    eliminarMensajeContacto($pdo, $msgId);
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
                    $configFile = __DIR__ . '/../modelo/mail_config.php';
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
// OBTENCIÓN DE DATOS MEDIANTE MODELOS PARA LA VISTA
// ------------------------------------------------------------

// Edición de noticia
$editingNews = null;
if (!empty($_GET['edit_news'])) {
    $editingNews = obtenerNoticiaPorId($pdo, (int) $_GET['edit_news']);
    $activeTab = 'noticias';
}

// Listados
$newsList = obtenerNoticias($pdo);
$docsList = obtenerDocumentos($pdo);
$mensajesList = obtenerMensajesContacto($pdo);
$unreadMessagesCount = contarMensajesNoLeidos($pdo);

// Configuración de correo
$mailConfigFile = __DIR__ . '/../modelo/mail_config.php';
$mailConfig = file_exists($mailConfigFile) ? (include $mailConfigFile) : [];
$currentDestEmail = $mailConfig['destinatario_email'] ?? 'ie.gilbertoalzate@medellin.gov.co';
$currentDestNombre = $mailConfig['destinatario_nombre'] ?? 'I.E. Gilberto Alzate Avendaño';
$currentRemitEmail = $mailConfig['remitente_email'] ?? 'no-reply@alzate.edu.co';

// Edición de aviso
$editingAviso = null;
if (!empty($_GET['edit_aviso'])) {
    $editingAviso = obtenerAvisoPorId($pdo, (int) $_GET['edit_aviso']);
    $activeTab = 'aviso';
}

// Listados de avisos
$avisosList = obtenerAvisos($pdo);
$activeAvisosList = obtenerAvisosActivos($pdo);
$activeAvisosCount = count($activeAvisosList);

// Datos del admin actual
$currentAdmin = buscarAdminPorId($pdo, (int) $_SESSION['admin_id']);

// Cargar la vista administrativa
require_once __DIR__ . '/../vistas/admin.php';
