<?php
// ============================================================
// MODELO: NOTICIAS INSTITUCIONALES
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/database.php';

/**
 * Obtiene todas las noticias ordenadas por fecha de creación descendente.
 */
function obtenerNoticias(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT * FROM noticias ORDER BY created_at DESC');
    return $stmt->fetchAll() ?: [];
}

/**
 * Obtiene un número limitado de noticias recientes.
 */
function obtenerNoticiasRecientes(PDO $pdo, int $limite = 6): array
{
    $limite = max(1, min(50, $limite));
    $stmt = $pdo->prepare('SELECT id, title, category, date_label, image_url, excerpt, content, created_at FROM noticias ORDER BY created_at DESC LIMIT :lim');
    $stmt->bindValue(':lim', $limite, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll() ?: [];
}

/**
 * Obtiene una noticia por su ID.
 */
function obtenerNoticiaPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM noticias WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $noticia = $stmt->fetch();
    return $noticia ?: null;
}

/**
 * Inserta una nueva noticia en la base de datos.
 */
function crearNoticia(PDO $pdo, array $datos): bool
{
    $stmt = $pdo->prepare('
        INSERT INTO noticias (title, category, date_label, image_url, excerpt, content) 
        VALUES (:title, :category, :date_label, :image_url, :excerpt, :content)
    ');
    return $stmt->execute([
        ':title'      => $datos['title'],
        ':category'   => $datos['category'] ?? 'sedes',
        ':date_label' => $datos['date_label'],
        ':image_url'  => $datos['image_url'] ?? '',
        ':excerpt'    => $datos['excerpt'],
        ':content'    => $datos['content'],
    ]);
}

/**
 * Actualiza una noticia existente por su ID.
 */
function actualizarNoticia(PDO $pdo, int $id, array $datos): bool
{
    $stmt = $pdo->prepare('
        UPDATE noticias 
        SET title = :title, category = :category, date_label = :date_label, 
            image_url = :image_url, excerpt = :excerpt, content = :content 
        WHERE id = :id
    ');
    return $stmt->execute([
        ':id'         => $id,
        ':title'      => $datos['title'],
        ':category'   => $datos['category'] ?? 'sedes',
        ':date_label' => $datos['date_label'],
        ':image_url'  => $datos['image_url'] ?? '',
        ':excerpt'    => $datos['excerpt'],
        ':content'    => $datos['content'],
    ]);
}

/**
 * Elimina una noticia y su imagen asociada si existe en el servidor.
 */
function eliminarNoticia(PDO $pdo, int $id): bool
{
    $noticia = obtenerNoticiaPorId($pdo, $id);
    if (!$noticia) {
        return false;
    }

    $oldImg = $noticia['image_url'] ?? '';
    $stmt = $pdo->prepare('DELETE FROM noticias WHERE id = :id');
    $res = $stmt->execute([':id' => $id]);

    if ($res && $oldImg && (str_starts_with($oldImg, 'uploads/noticias/') || str_starts_with($oldImg, '/uploads/noticias/'))) {
        $fullOldPath = __DIR__ . '/../../' . ltrim($oldImg, '/');
        if (file_exists($fullOldPath)) {
            @unlink($fullOldPath);
        }
    }

    return $res;
}
