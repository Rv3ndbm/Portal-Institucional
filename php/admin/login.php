<?php
// ============================================================
// INICIO DE SESIÓN ADMINISTRATIVO SEGURO
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../config/database.php';

// Si ya tiene sesión activa, redirigir al Dashboard
if (!empty($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

$errorMessage = '';
$csrfToken = generateCsrfToken();

// Control de intentos fallidos (Protección contra fuerza bruta)
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['login_last_attempt'] = time();
}

// Resetear intentos tras 15 minutos de inactividad
if (time() - $_SESSION['login_last_attempt'] > 900) {
    $_SESSION['login_attempts'] = 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Verificar bloqueo por fuerza bruta
    if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['login_last_attempt']) < 900) {
        $minutesLeft = ceil((900 - (time() - $_SESSION['login_last_attempt'])) / 60);
        $errorMessage = "Demasiados intentos fallidos. Por seguridad, espera {$minutesLeft} minuto(s) para reintentar.";
    } else {
        // 2. Validar token CSRF
        $postedToken = (string) ($_POST['csrf_token'] ?? '');
        if (!validateCsrfToken($postedToken)) {
            $errorMessage = 'La sesión del formulario expiró. Por favor recarga e intenta de nuevo.';
        } else {
            $username = trim((string) ($_POST['username'] ?? ''));
            $password = (string) ($_POST['password'] ?? '');

            if ($username === '' || $password === '') {
                $errorMessage = 'Por favor ingresa tu usuario y contraseña.';
            } else {
                $stmt = $pdo->prepare('SELECT id, username, password_hash, full_name FROM admins WHERE username = :username LIMIT 1');
                $stmt->execute([':username' => $username]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password_hash'])) {
                    // Login exitoso: Resetear contador y regenerar ID de sesión
                    $_SESSION['login_attempts'] = 0;
                    session_regenerate_id(true);

                    $_SESSION['admin_id'] = (int) $user['id'];
                    $_SESSION['admin_username'] = $user['username'];
                    $_SESSION['admin_name'] = $user['full_name'];
                    $_SESSION['last_activity'] = time();

                    header('Location: index.php');
                    exit;
                } else {
                    $_SESSION['login_attempts']++;
                    $_SESSION['login_last_attempt'] = time();
                    $remaining = max(0, 5 - $_SESSION['login_attempts']);
                    if ($remaining > 0) {
                        $errorMessage = "Credenciales incorrectas. Te quedan {$remaining} intento(s).";
                    } else {
                        $errorMessage = "Acceso bloqueado por 15 minutos debido a múltiples intentos fallidos.";
                    }
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Administrativo - I.E. Gilberto Alzate Avendaño</title>
    <link rel="icon" type="image/png" href="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>
<body>
    <main class="admin-page">
        <section class="admin-card">
            <div class="admin-card__header">
                <div class="admin-header-brand">
                    <img src="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png" alt="Escudo I.E. GAA" class="admin-logo-badge">
                    <div>
                        <h1>Panel de Gestión</h1>
                        <p class="admin-subtitle">I.E. Gilberto Alzate Avendaño</p>
                    </div>
                </div>
            </div>

            <div class="admin-card__body">
                <form class="admin-form" method="post" action="login.php" autocomplete="off">
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                    <label for="adminUsername">
                        <i class="fas fa-user"></i> Usuario
                        <input type="text" id="adminUsername" name="username" placeholder="Ingresa tu usuario" required autofocus>
                    </label>

                    <label for="adminPassword">
                        <i class="fas fa-lock"></i> Contraseña
                        <input type="password" id="adminPassword" name="password" placeholder="Ingresa tu contraseña" required>
                    </label>

                    <button type="submit" class="admin-button primary">
                        <i class="fas fa-sign-in-alt"></i> Ingresar al Panel
                    </button>

                    <?php if ($errorMessage !== ''): ?>
                        <div class="admin-message error show">
                            <i class="fas fa-exclamation-triangle"></i> <?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?>
                        </div>
                    <?php endif; ?>
                </form>

                <div class="admin-card-footer">
                    <a href="../../index.html" class="admin-back-link">
                        <i class="fas fa-arrow-left"></i> Volver al Portal Web
                    </a>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
