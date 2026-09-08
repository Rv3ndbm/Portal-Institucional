<?php
// ============================================================
// API PÚBLICA DE NOTICIAS EN TIEMPO REAL
// I.E. Gilberto Alzate Avendaño
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

require_once __DIR__ . '/../config/database.php';

try {
    $limit = isset($_GET['limit']) ? max(1, min(20, (int)$_GET['limit'])) : 6;
    $stmt = $pdo->prepare('SELECT id, title, category, date_label, image_url, excerpt, content, created_at FROM noticias ORDER BY created_at DESC LIMIT :lim');
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function($item) {
        $rawImg = trim((string)($item['image_url'] ?? ''));
        $img = '';
        if ($rawImg !== '') {
            if (str_starts_with($rawImg, 'http://') || str_starts_with($rawImg, 'https://')) {
                $img = $rawImg;
            } else {
                $img = ltrim($rawImg, '/');
            }
        }
        
        return [
            'id'         => (int) $item['id'],
            'title'      => (string) $item['title'],
            'category'   => (string) ($item['category'] ?? 'sedes'),
            'date_label' => (string) ($item['date_label'] ?? ''),
            'image_url'  => $img,
            'excerpt'    => (string) ($item['excerpt'] ?? ''),
            'content'    => (string) ($item['content'] ?? ''),
            'created_at' => (string) ($item['created_at'] ?? ''),
            'url'        => 'php/public/noticias.php#noticia-' . (int) $item['id']
        ];
    }, $news);

    echo json_encode([
        'status'   => 'success',
        'count'    => count($formatted),
        'noticias' => $formatted
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Error al cargar noticias: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
