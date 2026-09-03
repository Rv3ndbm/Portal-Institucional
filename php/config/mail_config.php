<?php
// ============================================================
// CONFIGURACIÓN DE CORREO - PORTAL WEB INSTITUCIONAL
// I.E. Gilberto Alzate Avendaño
// ============================================================
// Para cambiar el correo al que llegan los mensajes del formulario
// de contacto, simplemente modifica el valor de 'destinatario_email' abajo.
// ============================================================

return [
    // ------------------------------------------------------------
    // 1. CORREO DESTINATARIO (Aquí se reciben los mensajes)
    // ------------------------------------------------------------
    'destinatario_email'  => 'ie.gilbertoalzate@medellin.gov.co',
    'destinatario_nombre' => 'I.E. Gilberto Alzate Avendaño - Atención al Ciudadano',

    // ------------------------------------------------------------
    // 2. REMITENTE DEL SISTEMA (De parte de quién envía el servidor)
    // ------------------------------------------------------------
    'remitente_email'     => 'no-reply@alzate.edu.co',
    'remitente_nombre'    => 'Portal Web Institucional GAA',

    // ------------------------------------------------------------
    // 3. MÉTODO DE TRANSPORTE
    // Opciones: 'mail' (función nativa mail() de PHP) | 'smtp' (servidor SMTP externo)
    // ------------------------------------------------------------
    'metodo'              => 'mail',

    // ------------------------------------------------------------
    // 4. PARÁMETROS SMTP (Opcional - Si en el futuro usas Gmail, Outlook o hosting)
    // ------------------------------------------------------------
    'smtp' => [
        'host'       => 'smtp.gmail.com',
        'puerto'     => 587,
        'seguridad'  => 'tls', // 'tls', 'ssl' o null
        'autenticar' => true,
        'usuario'    => '',
        'password'   => '',
    ],

    // ------------------------------------------------------------
    // 5. RESGUARDOS DE SEGURIDAD Y REGISTRO
    // ------------------------------------------------------------
    'guardar_en_bd'       => true,  // Guarda copia de cada mensaje en la tabla 'mensajes_contacto'
    'guardar_en_log'      => true,  // Registra eventos en php/logs/contacto.log
    'honeypot_field'      => 'website_hp', // Campo señuelo anti-spam para bots
    'min_segundos_envio'  => 3,     // Tiempo mínimo en segundos para evitar spam automático
];
