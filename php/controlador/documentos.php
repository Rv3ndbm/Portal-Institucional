<?php
// ============================================================
// CONTROLADOR: VISTA PÚBLICA DE DOCUMENTOS Y CIRCULARES
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/../modelo/database.php';
require_once __DIR__ . '/../modelo/documentos.php';

$docs = obtenerDocumentos($pdo);

function resolveDocAsset(?string $path): string {
    $p = trim((string) $path);
    if ($p === '') return '#';
    if (str_starts_with($p, 'http://') || str_starts_with($p, 'https://')) {
        return $p;
    }
    return '../../' . ltrim($p, '/');
}

// Cargar la vista pública de documentos
require_once __DIR__ . '/../vistas/documentos.php';
