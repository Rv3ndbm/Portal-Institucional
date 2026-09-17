<?php
// ============================================================
// MODELO: AVISOS URGENTES Y COMUNICADOS
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/database.php';

/**
 * Obtiene todos los avisos ordenados por ID descendente.
 */
function obtenerAvisos(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT * FROM avisos ORDER BY id DESC');
    return $stmt->fetchAll() ?: [];
}

/**
 * Obtiene todos los avisos urgentes activos y no expirados.
 */
function obtenerAvisosActivos(PDO $pdo): array
{
    try {
        $stmt = $pdo->prepare('
            SELECT * FROM avisos 
            WHERE activo = 1 
              AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY id DESC
        ');
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Obtiene un aviso por su ID.
 */
function obtenerAvisoPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM avisos WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $aviso = $stmt->fetch();
    return $aviso ?: null;
}

/**
 * Inserta un nuevo aviso urgente.
 */
function crearAviso(PDO $pdo, array $datos): bool
{
    $stmt = $pdo->prepare('
        INSERT INTO avisos (titulo, mensaje, tipo, enlace, texto_enlace, duracion_dias, activo, expires_at) 
        VALUES (:titulo, :mensaje, :tipo, :enlace, :texto_enlace, :duracion_dias, :activo, :expires_at)
    ');
    return $stmt->execute([
        ':titulo'        => $datos['titulo'],
        ':mensaje'       => $datos['mensaje'],
        ':tipo'          => $datos['tipo'] ?? 'warning',
        ':enlace'        => $datos['enlace'] ?? '',
        ':texto_enlace'  => $datos['texto_enlace'] ?? 'Ver más',
        ':duracion_dias' => (int) ($datos['duracion_dias'] ?? 1),
        ':activo'        => (int) ($datos['activo'] ?? 0),
        ':expires_at'    => $datos['expires_at'] ?? null,
    ]);
}

/**
 * Actualiza un aviso urgente existente.
 */
function actualizarAviso(PDO $pdo, int $id, array $datos): bool
{
    $stmt = $pdo->prepare('
        UPDATE avisos 
        SET titulo = :titulo, mensaje = :mensaje, tipo = :tipo, enlace = :enlace, 
            texto_enlace = :texto_enlace, duracion_dias = :duracion_dias, 
            activo = :activo, expires_at = :expires_at 
        WHERE id = :id
    ');
    return $stmt->execute([
        ':id'            => $id,
        ':titulo'        => $datos['titulo'],
        ':mensaje'       => $datos['mensaje'],
        ':tipo'          => $datos['tipo'] ?? 'warning',
        ':enlace'        => $datos['enlace'] ?? '',
        ':texto_enlace'  => $datos['texto_enlace'] ?? 'Ver más',
        ':duracion_dias' => (int) ($datos['duracion_dias'] ?? 1),
        ':activo'        => (int) ($datos['activo'] ?? 0),
        ':expires_at'    => $datos['expires_at'] ?? null,
    ]);
}

/**
 * Alterna el estado activo/inactivo de un aviso.
 */
function alternarEstadoAviso(PDO $pdo, int $id): bool
{
    $stmt = $pdo->prepare('UPDATE avisos SET activo = IF(activo = 1, 0, 1) WHERE id = :id');
    return $stmt->execute([':id' => $id]);
}

/**
 * Elimina un aviso por su ID.
 */
function eliminarAviso(PDO $pdo, int $id): bool
{
    $stmt = $pdo->prepare('DELETE FROM avisos WHERE id = :id');
    return $stmt->execute([':id' => $id]);
}
