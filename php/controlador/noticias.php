<?php
// ============================================================
// CONTROLADOR: VISTA PÚBLICA DE NOTICIAS
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../modelo/database.php';
require_once __DIR__ . '/../modelo/noticias.php';

$news = obtenerNoticias($pdo);

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

// Cargar la vista pública de noticias
require_once __DIR__ . '/../vistas/noticias.php';
