<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Administrativo - I.E. Gilberto Alzate Avendaño</title>
    <link rel="icon" type="image/png" href="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>
<body>
    <main class="admin-page">
        <section class="admin-card">
            <div class="admin-card__header">
                <div class="admin-header-brand">
                    <img src="../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png" alt="Escudo I.E. GAA" class="admin-logo-badge">
                    <div>
                        <h1>Panel de Gestión</h1>
                        <p class="admin-subtitle">I.E. Gilberto Alzate Avendaño</p>
                    </div>
                </div>
            </div>

            <div class="admin-card__body">
                <form class="admin-form" method="post" action="login.php" autocomplete="off">
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') ?>">

                    <label for="adminUsername">
                        <i class="fas fa-user"></i> Usuario
                        <input type="text" id="adminUsername" name="username" placeholder="Ingresa tu usuario" required autofocus>
                    </label>

                    <label for="adminPassword">
                        <i class="fas fa-lock"></i> Contraseña
                        <input type="password" id="adminPassword" name="password" placeholder="Ingresa tu contraseña" required>
                    </label>

                    <button type="submit" class="admin-button primary">
                        <i class="fas fa-sign-in-alt"></i> Ingresar al Panel
                    </button>

                    <?php if (!empty($errorMessage)): ?>
                        <div class="admin-message error show">
                            <i class="fas fa-exclamation-triangle"></i> <?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_GET['logged_out'])): ?>
                        <div class="admin-message success show" style="background: #e8f5e9; color: #2e7d32; border-color: #c8e6c9;">
                            <i class="fas fa-check-circle"></i> Sesión cerrada correctamente.
                        </div>
                    <?php endif; ?>
                </form>

                <div class="admin-card-footer">
                    <a href="../../index.html" class="admin-back-link">
                        <i class="fas fa-arrow-left"></i> Volver al Portal Web
                    </a>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
