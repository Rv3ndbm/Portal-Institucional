<?php
// ============================================================
// CONFIGURACIÓN DE CORREO - PORTAL WEB INSTITUCIONAL
// I.E. Gilberto Alzate Avendaño
// ============================================================

return [
    // 1. CORREO DESTINATARIO
    'destinatario_email'  => 'ie.gilbertoalzate@medellin.gov.co',
    'destinatario_nombre' => 'I.E. Gilberto Alzate Avendaño - Atención al Ciudadano',

    // 2. REMITENTE DEL SISTEMA
    'remitente_email'     => 'no-reply@alzate.edu.co',
    'remitente_nombre'    => 'Portal Web Institucional GAA',

    // 3. MÉTODO DE TRANSPORTE
    'metodo'              => 'mail',

    // 4. PARÁMETROS SMTP
    'smtp' => [
        'host'       => 'smtp.gmail.com',
        'puerto'     => 587,
        'seguridad'  => 'tls',
        'autenticar' => true,
        'usuario'    => '',
        'password'   => '',
    ],

    // 5. RESGUARDOS DE SEGURIDAD Y REGISTRO
    'guardar_en_bd'       => true,
    'guardar_en_log'      => true,
    'honeypot_field'      => 'website_hp',
    'min_segundos_envio'  => 3,
];
