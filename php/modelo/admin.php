<?php
// ============================================================
// MODELO: ADMINISTRADORES Y SEGURIDAD DE ACCESO
// I.E. Gilberto Alzate Avendaño
// ============================================================

require_once __DIR__ . '/database.php';

/**
 * Busca un administrador por su nombre de usuario.
 */
function buscarAdminPorUsuario(PDO $pdo, string $usuario): ?array
{
    $stmt = $pdo->prepare('SELECT id, username, password_hash, full_name FROM admins WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $usuario]);
    $admin = $stmt->fetch();
    return $admin ?: null;
}

/**
 * Busca un administrador por su ID.
 */
function buscarAdminPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT id, username, password_hash, full_name FROM admins WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $admin = $stmt->fetch();
    return $admin ?: null;
}

/**
 * Actualiza el perfil o las credenciales del administrador.
 */
function actualizarPerfilAdmin(PDO $pdo, int $id, string $nombre, string $usuario, ?string $nuevoHash = null): bool
{
    if ($nuevoHash !== null) {
        $stmt = $pdo->prepare('UPDATE admins SET full_name = :full_name, username = :username, password_hash = :hash WHERE id = :id');
        return $stmt->execute([
            ':full_name' => $nombre,
            ':username'  => $usuario,
            ':hash'      => $nuevoHash,
            ':id'        => $id
        ]);
    } else {
        $stmt = $pdo->prepare('UPDATE admins SET full_name = :full_name, username = :username WHERE id = :id');
        return $stmt->execute([
            ':full_name' => $nombre,
            ':username'  => $usuario,
            ':id'        => $id
        ]);
    }
}
