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

$avisos = getActiveAvisos($pdo);

if (empty($avisos)) {
    echo json_encode(['active' => false, 'avisos' => []], JSON_UNESCAPED_UNICODE);
    exit;
}

$first = $avisos[0];

echo json_encode([
    'active'       => true,
    'id'           => (int) $first['id'],
    'titulo'       => (string) $first['titulo'],
    'mensaje'      => (string) $first['mensaje'],
    'tipo'         => (string) ($first['tipo'] ?? 'warning'),
    'enlace'       => (string) ($first['enlace'] ?? ''),
    'texto_enlace' => (string) ($first['texto_enlace'] ?? 'Ver más'),
    'expires_at'   => (string) ($first['expires_at'] ?? ''),
    'count'        => count($avisos),
    'avisos'       => array_map(function($a) {
        return [
            'id'           => (int) $a['id'],
            'titulo'       => (string) $a['titulo'],
            'mensaje'      => (string) $a['mensaje'],
            'tipo'         => (string) ($a['tipo'] ?? 'warning'),
            'enlace'       => (string) ($a['enlace'] ?? ''),
            'texto_enlace' => (string) ($a['texto_enlace'] ?? 'Ver más'),
            'expires_at'   => (string) ($a['expires_at'] ?? ''),
        ];
    }, $avisos),
], JSON_UNESCAPED_UNICODE);
