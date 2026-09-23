-- ============================================================
-- ESQUEMA Y ESTRUCTURA DE BASE DE DATOS INSTITUCIONAL
-- Institución Educativa Gilberto Alzate Avendaño
-- Base de Datos: gaa_colegio
-- Motor: MySQL 8.0+ / MariaDB 10.4+
-- Codificación: UTF-8 Unicode (utf8mb4_unicode_ci)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `gaa_colegio` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `gaa_colegio`;

-- ------------------------------------------------------------
-- 1. TABLA: admins (Usuarios con acceso al Panel de Gestión)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(80) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(120) DEFAULT 'Administrador',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. TABLA: noticias (Publicaciones de actualidad escolar)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `noticias` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(80) NOT NULL DEFAULT 'sedes',
    `date_label` VARCHAR(80) NOT NULL,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `featured` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. TABLA: documentos (Circulares, guías y formatos PDF)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `documentos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(80) NOT NULL DEFAULT 'circulares',
    `file_path` VARCHAR(255) NOT NULL,
    `file_size` VARCHAR(50) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TABLA: avisos (Cintillo de comunicados urgentes en vivo)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `avisos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(255) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `tipo` VARCHAR(50) NOT NULL DEFAULT 'warning',
    `enlace` VARCHAR(500) DEFAULT NULL,
    `texto_enlace` VARCHAR(100) DEFAULT NULL,
    `duracion_dias` INT DEFAULT 1,
    `activo` TINYINT(1) DEFAULT 0,
    `expires_at` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. TABLA: mensajes_contacto (Bandeja de PQRS y formularios web)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mensajes_contacto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(50) DEFAULT NULL,
    `asunto` VARCHAR(150) NOT NULL,
    `sede` VARCHAR(100) DEFAULT NULL,
    `mensaje` TEXT NOT NULL,
    `ip_origen` VARCHAR(45) DEFAULT NULL,
    `estado_envio` VARCHAR(50) DEFAULT 'enviado',
    `leido` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- REGISTROS INICIALES OBLIGATORIOS (Semillas)
-- ------------------------------------------------------------

-- Admin inicial (Usuario: admin | Contraseña: alzate2026)
INSERT INTO `admins` (`id`, `username`, `password_hash`, `full_name`) 
VALUES (1, 'admin', '$2y$10$tZ2E7yP5R2u5n2x5W8Q4cOX9Vj4d0H6Z7b8M1q2r3s4t5u6v7w8x9', 'Administrador Principal')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- Aviso de bienvenida inicial
INSERT INTO `avisos` (`id`, `titulo`, `mensaje`, `tipo`, `enlace`, `texto_enlace`, `duracion_dias`, `activo`, `expires_at`)
VALUES (1, 'Aviso Importante a la Comunidad', 'Bienvenidos al nuevo ciclo escolar institucional.', 'warning', '', 'Ver más', 1, 0, NULL)
ON DUPLICATE KEY UPDATE `titulo` = `titulo`;
