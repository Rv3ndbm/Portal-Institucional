<?php
// ============================================================
// ARCHIVO DE PROPIEDADES Y CONFIGURACIÓN GLOBAL (PROPERTIES)
// I.E. Gilberto Alzate Avendaño
// ============================================================

// 1. ENTORNO DE EJECUCIÓN ('local' para XAMPP | 'production' para Servidor/Hosting)
define('APP_ENV', 'local');

// 2. CONFIGURACIÓN DE BASE DE DATOS MYSQL
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'gaa_colegio');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// 3. PARÁMETROS GENERALES DE LA APLICACIÓN
define('APP_NAME', 'Portal Institucional I.E. Gilberto Alzate Avendaño');
define('APP_TIMEZONE', 'America/Bogota');

// 4. AJUSTE DE ZONA HORARIA OFICIAL
date_default_timezone_set(APP_TIMEZONE);

// 5. CONTROL DE ERRORES SEGÚN EL ENTORNO (Buenas prácticas OWASP)
if (APP_ENV === 'local') {
    // Entorno local de desarrollo: Muestra errores para depuración
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    // Entorno de producción: Oculta errores a los usuarios y los guarda en logs privados
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/../logs/php_error.log');
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
}

// 6. DETECCIÓN AUTOMÁTICA DE URL BASE (BASE_URL)
if (!defined('BASE_URL')) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    define('BASE_URL', $protocol . $host . '/portalweb/');
}
