<?php
// ============================================================
// CONTROLADOR: INICIO DE SESIÓN ADMINISTRATIVO
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../modelo/database.php';
require_once __DIR__ . '/../modelo/admin.php';

// Si ya tiene sesión activa, redirigir al Dashboard
if (!empty($_SESSION['admin_id'])) {
    header('Location: admin.php');
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
                $user = buscarAdminPorUsuario($pdo, $username);

                if ($user && password_verify($password, $user['password_hash'])) {
                    // Login exitoso
                    $_SESSION['login_attempts'] = 0;
                    session_regenerate_id(true);

                    $_SESSION['admin_id'] = (int) $user['id'];
                    $_SESSION['admin_username'] = $user['username'];
                    $_SESSION['admin_name'] = $user['full_name'];
                    $_SESSION['last_activity'] = time();

                    header('Location: admin.php');
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

// Cargar la vista de inicio de sesión
require_once __DIR__ . '/../vistas/login.php';
