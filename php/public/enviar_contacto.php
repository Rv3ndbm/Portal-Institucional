<?php
// ============================================================
// ENDPOINT: PROCESAMIENTO DE FORMULARIO DE CONTACTO
// I.E. Gilberto Alzate Avendaño
// ============================================================

header('Content-Type: application/json; charset=utf-8');

// Desactivar salida de errores HTML para mantener respuesta JSON limpia
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Cargar configuraciones
$configMail = require __DIR__ . '/../config/mail_config.php';
require_once __DIR__ . '/../config/database.php';

// Solo aceptar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Utiliza POST para enviar el formulario.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ------------------------------------------------------------
// 1. OBTENCIÓN Y DECODIFICACIÓN DE DATOS (JSON o Form POST)
// ------------------------------------------------------------
$inputData = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true) ?: [];
} else {
    $inputData = $_POST;
}

// ------------------------------------------------------------
// 2. PROTECCIÓN ANTI-SPAM (Honeypot y Tiempo)
// ------------------------------------------------------------
$honeypotKey = $configMail['honeypot_field'] ?? 'website_hp';
if (!empty($inputData[$honeypotKey])) {
    // Si un bot llenó el campo trampa, simulamos éxito sin procesar
    echo json_encode([
        'success' => true,
        'message' => 'Tu mensaje ha sido recibido con éxito.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Verificación de tiempo de llenado (mínimo de segundos)
$formStartTime = (int) ($inputData['form_time'] ?? 0);
if ($formStartTime > 0) {
    $elapsed = time() - $formStartTime;
    $minTime = (int) ($configMail['min_segundos_envio'] ?? 3);
    if ($elapsed < $minTime) {
        // Envíos sobrehumanos inmediatos suelen ser bots
        echo json_encode([
            'success' => true,
            'message' => 'Tu mensaje ha sido recibido con éxito.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// ------------------------------------------------------------
// 3. SANITIZACIÓN Y VALIDACIÓN DE CAMPOS
// ------------------------------------------------------------
$errors = [];

$nombre   = trim((string) ($inputData['nombre'] ?? ''));
$email    = trim((string) ($inputData['email'] ?? ''));
$telefono = trim((string) ($inputData['telefono'] ?? ''));
$sede     = trim((string) ($inputData['sede'] ?? ''));
$asunto   = trim((string) ($inputData['asunto'] ?? ''));
$mensaje  = trim((string) ($inputData['mensaje'] ?? ''));
$habeas   = !empty($inputData['habeas_data']);

// Validar Nombre
if ($nombre === '') {
    $errors['nombre'] = 'Por favor ingresa tu nombre completo.';
} elseif (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 120) {
    $errors['nombre'] = 'El nombre debe tener entre 3 y 120 caracteres.';
}

// Validar Email
if ($email === '') {
    $errors['email'] = 'El correo electrónico es obligatorio.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Ingresa una dirección de correo electrónico válida.';
}

// Validar Teléfono (opcional pero si se envía debe tener formato coherente)
if ($telefono !== '' && !preg_match('/^[0-9+\s().-]{7,25}$/', $telefono)) {
    $errors['telefono'] = 'Ingresa un número de teléfono válido (mínimo 7 dígitos).';
}

// Validar Asunto
if ($asunto === '') {
    $errors['asunto'] = 'Por favor selecciona el motivo o asunto de tu mensaje.';
}

// Validar Mensaje
if ($mensaje === '') {
    $errors['mensaje'] = 'Por favor escribe el detalle de tu mensaje.';
} elseif (mb_strlen($mensaje) < 10) {
    $errors['mensaje'] = 'El mensaje debe contener al menos 10 caracteres.';
} elseif (mb_strlen($mensaje) > 4000) {
    $errors['mensaje'] = 'El mensaje no debe superar los 4000 caracteres.';
}

// Validar Tratamiento de Datos
if (!$habeas) {
    $errors['habeas_data'] = 'Debes aceptar la política de tratamiento de datos personales para continuar.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor corrige los errores indicados en el formulario.',
        'errors'  => $errors
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Etiquetas legibles para asuntos
$asuntosLabels = [
    'academico'    => 'Información Académica',
    'matriculas'   => 'Matrículas e Inscripciones',
    'certificados' => 'Certificados y Constancias',
    'padres'       => 'Atención a Familias y Padres',
    'sedes'        => 'Información sobre Sedes',
    'pqrs'         => 'Petición, Queja o Reclamo (PQRSF)',
    'otro'         => 'Otro Motivo / General',
];
$asuntoTexto = $asuntosLabels[$asunto] ?? htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8');
$sedeTexto = !empty($sede) ? htmlspecialchars($sede, ENT_QUOTES, 'UTF-8') : 'No especificada';

$ipOrigen = $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';
$fechaEnvio = date('d/m/Y h:i A');

// ------------------------------------------------------------
// 4. GUARDADO DE RESPALDO EN BASE DE DATOS (MYSQL)
// ------------------------------------------------------------
$registroId = null;
$estadoEnvio = 'pendiente';

if (!empty($configMail['guardar_en_bd']) && isset($pdo)) {
    try {
        $stmtInsert = $pdo->prepare('
            INSERT INTO mensajes_contacto (nombre, email, telefono, asunto, sede, mensaje, ip_origen, estado_envio, created_at)
            VALUES (:nombre, :email, :telefono, :asunto, :sede, :mensaje, :ip_origen, :estado_envio, NOW())
        ');
        $stmtInsert->execute([
            ':nombre'       => $nombre,
            ':email'        => $email,
            ':telefono'     => $telefono ?: null,
            ':asunto'       => $asuntoTexto,
            ':sede'         => $sedeTexto,
            ':mensaje'      => $mensaje,
            ':ip_origen'    => $ipOrigen,
            ':estado_envio' => $estadoEnvio
        ]);
        $registroId = $pdo->lastInsertId();
    } catch (Exception $e) {
        error_log('Error guardando mensaje de contacto en BD: ' . $e->getMessage());
    }
}

// ------------------------------------------------------------
// 5. CONSTRUCCIÓN DE CORREO ELECTRÓNICO INSTITUCIONAL
// ------------------------------------------------------------
$destinatarioEmail = $configMail['destinatario_email'] ?? 'ie.gilbertoalzate@medellin.gov.co';
$destinatarioNombre = $configMail['destinatario_nombre'] ?? 'I.E. Gilberto Alzate Avendaño';

$remitenteEmail = $configMail['remitente_email'] ?? 'no-reply@alzate.edu.co';
$remitenteNombre = $configMail['remitente_nombre'] ?? 'Portal Web Institucional GAA';

$subjectMail = "=?UTF-8?B?" . base64_encode("[Contacto Web] {$asuntoTexto} - {$nombre}") . "?=";

$nombreEscaped   = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
$emailEscaped    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$telefonoEscaped = htmlspecialchars($telefono ?: 'No suministrado', ENT_QUOTES, 'UTF-8');
$sedeEscaped     = htmlspecialchars($sedeTexto, ENT_QUOTES, 'UTF-8');
$asuntoEscaped   = htmlspecialchars($asuntoTexto, ENT_QUOTES, 'UTF-8');
$mensajeEscaped  = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'));
$mailtoReply     = "mailto:{$email}?subject=" . rawurlencode("Re: {$asuntoTexto} - I.E. Gilberto Alzate Avendaño");

// Plantilla HTML Responsive Institucional
$cuerpoHtml = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        <!-- Encabezado Institucional -->
        <tr>
            <td style="background: linear-gradient(135deg, #1e3c72 0%, #152a52 100%); padding: 30px 28px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">I.E. GILBERTO ALZATE AVENDAÑO</h1>
                <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1.5px;">Atención al Ciudadano · Formulario Web</p>
            </td>
        </tr>

        <!-- Notificación de Solicitud -->
        <tr>
            <td style="padding: 28px 28px 12px;">
                <div style="background: #eff6ff; border-left: 4px solid #1e3c72; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 14px; color: #1e3c72; font-weight: 600;">
                        Has recibido una nueva consulta ciudadana a través del portal web oficial.
                    </p>
                </div>

                <!-- Tabla de Información -->
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px; font-weight: 600;">Remitente:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">{$nombreEscaped}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Correo Electrónico:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e3c72; font-weight: 600;">
                            <a href="mailto:{$emailEscaped}" style="color: #1e3c72; text-decoration: none;">{$emailEscaped}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Teléfono / Celular:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">{$telefonoEscaped}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Sede de Interés:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">{$sedeEscaped}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Asunto o Motivo:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">{$asuntoEscaped}</td>
                    </tr>
                </table>

                <!-- Contenido del Mensaje -->
                <div style="margin-top: 10px; margin-bottom: 28px;">
                    <p style="margin: 0 0 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Mensaje del Usuario:</p>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.7; color: #1e293b;">
                        {$mensajeEscaped}
                    </div>
                </div>

                <!-- Botón de Respuesta Rápida -->
                <div style="text-align: center; margin: 32px 0 16px;">
                    <a href="{$mailtoReply}" style="background: #1e3c72; color: #ffffff; padding: 13px 28px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(30, 60, 114, 0.25);">
                        Responder a {$nombreEscaped}
                    </a>
                </div>
            </td>
        </tr>

        <!-- Pie de página técnico -->
        <tr>
            <td style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; font-size: 12px; color: #94a3b8; text-align: center;">
                <p style="margin: 0 0 4px;">Recibido el {$fechaEnvio} · IP de origen: {$ipOrigen}</p>
                <p style="margin: 0;">Portal Institucional I.E. Gilberto Alzate Avendaño · Medellín, Colombia</p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

// ------------------------------------------------------------
// 6. DISPATCH / ENVÍO DE CORREO (mail() nativo con cabeceras MIME)
// ------------------------------------------------------------
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    "From: =?UTF-8?B?" . base64_encode($remitenteNombre) . "?= <{$remitenteEmail}>",
    "Reply-To: {$nombre} <{$email}>",
    "X-Mailer: PHP/" . phpversion(),
    "X-Originating-IP: {$ipOrigen}"
];

$mailSent = false;
try {
    $mailSent = @mail(
        $destinatarioEmail,
        $subjectMail,
        $cuerpoHtml,
        implode("\r\n", $headers)
    );
} catch (Exception $mailEx) {
    $mailSent = false;
    error_log('Excepción en mail(): ' . $mailEx->getMessage());
}

// ------------------------------------------------------------
// 7. ACTUALIZACIÓN DE ESTADO EN BD Y LOG LOCAL
// ------------------------------------------------------------
$estadoEnvio = $mailSent ? 'enviado' : 'guardado_local';

if ($registroId && isset($pdo)) {
    try {
        $stmtUpdate = $pdo->prepare('UPDATE mensajes_contacto SET estado_envio = :estado WHERE id = :id');
        $stmtUpdate->execute([
            ':estado' => $estadoEnvio,
            ':id'     => $registroId
        ]);
    } catch (Exception $e) {
        // Ignorar error de actualización secundaria
    }
}

// Registro en archivo log local si está configurado
if (!empty($configMail['guardar_en_log'])) {
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $logFile = $logDir . '/contacto.log';
    $logEntry = sprintf(
        "[%s] IP: %s | Remitente: %s <%s> | Tel: %s | Sede: %s | Asunto: %s | Estado: %s | ID: %s\n",
        date('Y-m-d H:i:s'),
        $ipOrigen,
        $nombre,
        $email,
        $telefono ?: 'N/A',
        $sedeTexto,
        $asuntoTexto,
        $estadoEnvio,
        $registroId ?: 'N/A'
    );
    @file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ------------------------------------------------------------
// 8. RESPUESTA EXITOSA AL CLIENTE
// ------------------------------------------------------------
echo json_encode([
    'success' => true,
    'message' => '¡Tu mensaje ha sido recibido con éxito! Nuestro equipo institucional te contactará en la mayor brevedad posible.',
    'data'    => [
        'nombre'   => $nombre,
        'email'    => $email,
        'asunto'   => $asuntoTexto,
        'radicado' => $registroId ? sprintf('GAA-%05d', $registroId) : date('YmdHi')
    ]
], JSON_UNESCAPED_UNICODE);
