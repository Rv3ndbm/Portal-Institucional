<?php
// ============================================================
// MODELO: MENSAJES DE CONTACTO Y ATENCIÓN CIUDADANA (PQRS)
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/database.php';

/**
 * Obtiene todos los mensajes de contacto ordenados por fecha descendente.
 */
function obtenerMensajesContacto(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT * FROM mensajes_contacto ORDER BY created_at DESC');
    return $stmt->fetchAll() ?: [];
}

/**
 * Obtiene un mensaje de contacto por su ID.
 */
function obtenerMensajeContactoPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM mensajes_contacto WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $msg = $stmt->fetch();
    return $msg ?: null;
}

/**
 * Inserta un nuevo mensaje de contacto y retorna el ID insertado.
 */
function guardarMensajeContacto(PDO $pdo, array $datos): int
{
    $stmt = $pdo->prepare('
        INSERT INTO mensajes_contacto 
            (nombre, email, telefono, asunto, sede, mensaje, ip_origen, estado_envio, leido) 
        VALUES 
            (:nombre, :email, :telefono, :asunto, :sede, :mensaje, :ip, :estado, 0)
    ');
    $stmt->execute([
        ':nombre'   => $datos['nombre'],
        ':email'    => $datos['email'],
        ':telefono' => $datos['telefono'] ?? null,
        ':asunto'   => $datos['asunto'],
        ':sede'     => $datos['sede'] ?? null,
        ':mensaje'  => $datos['mensaje'],
        ':ip'       => $datos['ip_origen'] ?? 'Desconocida',
        ':estado'   => $datos['estado_envio'] ?? 'pendiente',
    ]);
    return (int) $pdo->lastInsertId();
}

/**
 * Actualiza el estado de envío del correo.
 */
function actualizarEstadoEnvio(PDO $pdo, int $id, string $estado): bool
{
    $stmt = $pdo->prepare('UPDATE mensajes_contacto SET estado_envio = :estado WHERE id = :id');
    return $stmt->execute([':estado' => $estado, ':id' => $id]);
}

/**
 * Alterna el estado de lectura (leído / no leído).
 */
function alternarMensajeLeido(PDO $pdo, int $id): bool
{
    $stmt = $pdo->prepare('UPDATE mensajes_contacto SET leido = IF(leido = 1, 0, 1) WHERE id = :id');
    return $stmt->execute([':id' => $id]);
}

/**
 * Marca todos los mensajes como leídos.
 */
function marcarTodosMensajesLeidos(PDO $pdo): bool
{
    return (bool) $pdo->exec('UPDATE mensajes_contacto SET leido = 1');
}

/**
 * Elimina un mensaje por su ID.
 */
function eliminarMensajeContacto(PDO $pdo, int $id): bool
{
    $stmt = $pdo->prepare('DELETE FROM mensajes_contacto WHERE id = :id');
    return $stmt->execute([':id' => $id]);
}

/**
 * Retorna la cantidad de mensajes no leídos.
 */
function contarMensajesNoLeidos(PDO $pdo): int
{
    $stmt = $pdo->query('SELECT COUNT(*) FROM mensajes_contacto WHERE leido = 0');
    return (int) $stmt->fetchColumn();
}
