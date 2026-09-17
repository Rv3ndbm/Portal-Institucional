<?php
// ============================================================
// MODELO: DOCUMENTOS Y CIRCULARES OFICIALES
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/database.php';

/**
 * Obtiene todos los documentos ordenados por fecha de creación descendente.
 */
function obtenerDocumentos(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT * FROM documentos ORDER BY created_at DESC');
    return $stmt->fetchAll() ?: [];
}

/**
 * Obtiene un documento por su ID.
 */
function obtenerDocumentoPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM documentos WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $doc = $stmt->fetch();
    return $doc ?: null;
}

/**
 * Inserta un nuevo documento en la base de datos.
 */
function crearDocumento(PDO $pdo, array $datos): bool
{
    $stmt = $pdo->prepare('
        INSERT INTO documentos (title, category, file_path, file_size, description) 
        VALUES (:title, :category, :file_path, :file_size, :description)
    ');
    return $stmt->execute([
        ':title'       => $datos['title'],
        ':category'    => $datos['category'] ?? 'circulares',
        ':file_path'   => $datos['file_path'],
        ':file_size'   => $datos['file_size'] ?? null,
        ':description' => $datos['description'] ?? '',
    ]);
}

/**
 * Elimina un documento y su archivo físico asociado.
 */
function eliminarDocumento(PDO $pdo, int $id): bool
{
    $doc = obtenerDocumentoPorId($pdo, $id);
    if (!$doc) {
        return false;
    }

    $filePath = $doc['file_path'] ?? '';
    $stmt = $pdo->prepare('DELETE FROM documentos WHERE id = :id');
    $res = $stmt->execute([':id' => $id]);

    if ($res && $filePath && (str_starts_with($filePath, 'uploads/documentos/') || str_starts_with($filePath, '/uploads/documentos/'))) {
        $fullOldPath = __DIR__ . '/../../' . ltrim($filePath, '/');
        if (file_exists($fullOldPath)) {
            @unlink($fullOldPath);
        }
    }

    return $res;
}
