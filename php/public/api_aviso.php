<?php
// ============================================================
// API PÚBLICA DE AVISOS URGENTES EN TIEMPO REAL
// I.E. Gilberto Alzate Avendaño
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

require_once __DIR__ . '/../config/database.php';

$aviso = getActiveAviso($pdo);

if (!$aviso) {
    echo json_encode(['active' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'active'       => true,
    'id'           => (int) $aviso['id'],
    'titulo'       => (string) $aviso['titulo'],
    'mensaje'      => (string) $aviso['mensaje'],
    'tipo'         => (string) ($aviso['tipo'] ?? 'warning'),
    'enlace'       => (string) ($aviso['enlace'] ?? ''),
    'texto_enlace' => (string) ($aviso['texto_enlace'] ?? 'Ver más'),
    'expires_at'   => (string) ($aviso['expires_at'] ?? ''),
], JSON_UNESCAPED_UNICODE);
