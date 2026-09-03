<?php
// ============================================================
// CONFIGURACIÓN DE BASE DE DATOS Y SEGURIDAD GLOBAL
// I.E. Gilberto Alzate Avendaño
// ============================================================

// 1. Configuración segura de sesiones PHP
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

/**
 * Establece conexión con MySQL y auto-crea la base de datos si no existe.
 */
function connectDatabase(): PDO
{
    $host = '127.0.0.1';
    $db   = 'gaa_colegio';
    $user = 'root';
    $pass = '';

    try {
        // Paso A: Conexión al servidor MySQL general para asegurar existencia de la BD
        $pdoInit = new PDO("mysql:host={$host};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `{$db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        // Paso B: Conexión directa a la base de datos de la institución
        $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $pdo;
    } catch (PDOException $exception) {
        die('<div style="font-family:sans-serif;padding:30px;max-width:600px;margin:50px auto;border:1px solid #f5c6cb;background:#f8d7da;color:#721c24;border-radius:8px;">' .
            '<h2>Error de conexión con la base de datos MySQL</h2>' .
            '<p>Por favor asegúrate de que <strong>Apache y MySQL</strong> estén iniciados en el panel de control de <strong>XAMPP</strong>.</p>' .
            '<p><small>Detalle técnico: ' . htmlspecialchars($exception->getMessage(), ENT_QUOTES, 'UTF-8') . '</small></p>' .
            '</div>');
    }
}

$pdo = connectDatabase();

/**
 * Auto-creación de tablas del sistema y usuario administrador inicial.
 */
function ensureDatabaseStructure(PDO $pdo): void
{
    // Tabla 1: Administradores
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(80) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(120) DEFAULT 'Administrador',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Tabla 2: Noticias institucionales
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS noticias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(80) NOT NULL DEFAULT 'sedes',
            date_label VARCHAR(80) NOT NULL,
            image_url VARCHAR(255) DEFAULT NULL,
            excerpt TEXT NOT NULL,
            content LONGTEXT NOT NULL,
            featured TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Tabla 3: Documentos y Circulares
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS documentos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(80) NOT NULL DEFAULT 'circulares',
            file_path VARCHAR(255) NOT NULL,
            file_size VARCHAR(50) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Tabla 4: Avisos Urgentes y Comunicados de Última Hora
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS avisos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            mensaje TEXT NOT NULL,
            tipo VARCHAR(50) NOT NULL DEFAULT 'warning',
            enlace VARCHAR(500) DEFAULT NULL,
            texto_enlace VARCHAR(100) DEFAULT NULL,
            duracion_dias INT DEFAULT 1,
            activo TINYINT(1) DEFAULT 0,
            expires_at DATETIME DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Tabla 5: Mensajes recibidos del formulario de contacto
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS mensajes_contacto (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            telefono VARCHAR(50) DEFAULT NULL,
            asunto VARCHAR(150) NOT NULL,
            sede VARCHAR(100) DEFAULT NULL,
            mensaje TEXT NOT NULL,
            ip_origen VARCHAR(45) DEFAULT NULL,
            estado_envio VARCHAR(50) DEFAULT 'enviado',
            leido TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Crear registro inicial de aviso si no existe
    $avisoCount = (int) $pdo->query("SELECT COUNT(*) FROM avisos")->fetchColumn();
    if ($avisoCount === 0) {
        $stmtAviso = $pdo->prepare("INSERT INTO avisos (titulo, mensaje, tipo, enlace, texto_enlace, duracion_dias, activo, expires_at) VALUES (:titulo, :mensaje, :tipo, :enlace, :texto_enlace, :duracion_dias, 0, NULL)");
        $stmtAviso->execute([
            ':titulo'        => 'Aviso Importante a la Comunidad',
            ':mensaje'       => 'Bienvenidos al nuevo ciclo escolar institucional.',
            ':tipo'          => 'warning',
            ':enlace'        => '',
            ':texto_enlace'  => 'Ver más información',
            ':duracion_dias' => 1
        ]);
    }

    // Crear admin por defecto si no existe ningún registro (admin / alzate2026)
    $adminCount = (int) $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    if ($adminCount === 0) {
        $hash = password_hash('alzate2026', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO admins (username, password_hash, full_name) VALUES (:username, :password_hash, :full_name)");
        $stmt->execute([
            ':username' => 'admin',
            ':password_hash' => $hash,
            ':full_name' => 'Administrador Principal'
        ]);
    }

    // Crear carpetas físicas de uploads y logs si no existen
    $dirs = [
        __DIR__ . '/../../uploads',
        __DIR__ . '/../../uploads/noticias',
        __DIR__ . '/../../uploads/documentos',
        __DIR__ . '/../logs'
    ];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
    }
}

ensureDatabaseStructure($pdo);

/**
 * Obtiene todos los avisos urgentes activos y no expirados.
 */
function getActiveAvisos(PDO $pdo): array
{
    try {
        $stmt = $pdo->prepare('
            SELECT * FROM avisos 
            WHERE activo = 1 
              AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY id DESC
        ');
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Obtiene el aviso urgente más reciente activo (compatibilidad).
 */
function getActiveAviso(PDO $pdo): ?array
{
    $all = getActiveAvisos($pdo);
    return !empty($all) ? $all[0] : null;
}

// ============================================================
// FUNCIONES DE SEGURIDAD Y AUXILIARES
// ============================================================

/**
 * Genera un token CSRF seguro y lo almacena en la sesión.
 */
function generateCsrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Valida un token CSRF enviado por formulario POST.
 */
function validateCsrfToken(?string $token): bool
{
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Protege vistas administrativas requiriendo sesión iniciada.
 */
function requireAdmin(): void
{
    if (empty($_SESSION['admin_id'])) {
        header('Location: login.php');
        exit;
    }
}

/**
 * Procesa la subida segura de archivos al servidor.
 * Valida extensión, tipo MIME real, tamaño máximo y renombra con hash aleatorio.
 *
 * @param array $file Archivo proveniente de $_FILES['nombre']
 * @param string $subDir 'noticias' o 'documentos'
 * @param array $allowedExtensions Extensiones válidas
 * @param int $maxSizeBytes Tamaño máximo (5MB por defecto)
 * @return array ['success' => bool, 'path' => string, 'error' => string, 'size_formatted' => string]
 */
function handleSecureUpload(
    array $file,
    string $subDir,
    array $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'],
    int $maxSizeBytes = 5242880
): array {
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['success' => false, 'error' => 'Parámetros de subida inválidos.'];
    }

    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        return ['success' => false, 'error' => 'No se seleccionó ningún archivo.'];
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'Error al subir el archivo (Código ' . $file['error'] . ').'];
    }

    if ($file['size'] > $maxSizeBytes) {
        $maxMB = round($maxSizeBytes / 1048576, 1);
        return ['success' => false, 'error' => "El archivo supera el tamaño máximo permitido ({$maxMB} MB)."];
    }

    $filename = $file['name'];
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedExtensions, true)) {
        return ['success' => false, 'error' => 'Tipo de archivo no permitido. Extensiones válidas: ' . implode(', ', $allowedExtensions)];
    }

    // Verificar tipo MIME real con finfo
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowedMimes = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'webp' => 'image/webp',
        'pdf'  => 'application/pdf',
        'doc'  => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!in_array($mime, $allowedMimes, true)) {
        return ['success' => false, 'error' => 'El contenido del archivo no coincide con su extensión.'];
    }

    $targetDirectory = __DIR__ . '/../../uploads/' . trim($subDir, '/');
    if (!is_dir($targetDirectory)) {
        @mkdir($targetDirectory, 0755, true);
    }

    // Generar nombre aleatorio seguro
    $newFileName = bin2hex(random_bytes(16)) . '.' . $ext;
    $targetPath = $targetDirectory . '/' . $newFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['success' => false, 'error' => 'No se pudo guardar el archivo en el servidor.'];
    }

    // Formatear tamaño
    $sizeFormatted = round($file['size'] / 1024, 1) . ' KB';
    if ($file['size'] >= 1048576) {
        $sizeFormatted = round($file['size'] / 1048576, 2) . ' MB';
    }

    $publicUrl = 'uploads/' . trim($subDir, '/') . '/' . $newFileName;

    return [
        'success'        => true,
        'path'           => $publicUrl,
        'size_formatted' => $sizeFormatted,
        'error'          => ''
    ];
}
