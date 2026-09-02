# MANUAL DEL PROGRAMADOR Y ARQUITECTURA TÉCNICA
## Portal Web Institucional - I.E. Gilberto Alzate Avendaño

---

**Versión del Sistema:** 2.0 (Full-Stack Dinámico & Autogestionable)  
**Fecha de Edición:** Septiembre 2026  
**Entorno de Desarrollo:** XAMPP (Apache 2.4+ / PHP 8.2+ / MySQL 8.0+ / MariaDB)  
**Repositorio:** `Rv3ndbm/Portal-Institucional`  
**Licencia y Titularidad:** I.E. Gilberto Alzate Avendaño (Medellín, Colombia)

---

## TABLA DE CONTENIDOS

1. [Información General y Arquitectura del Sistema](#1-información-general-y-arquitectura-del-sistema)
2. [Pila Tecnológica Completa](#2-pila-tecnológica-completa)
3. [Estructura del Proyecto y Directorios](#3-estructura-del-proyecto-y-directorios)
4. [Instalación y Puesta en Marcha (XAMPP / Producción)](#4-instalación-y-puesta-en-marcha-xampp--producción)
5. [Modelo de Datos y Base de Datos MySQL](#5-modelo-de-datos-y-base-de-datos-mysql)
6. [Módulo CRUD y Panel de Gestión Administrativo](#6-módulo-crud-y-panel-de-gestión-administrativo)
7. [Capa de Ciberseguridad y Protección OWASP](#7-capa-de-ciberseguridad-y-protección-owasp)
8. [Componentes del Frontend, UI/UX y Accesibilidad](#8-componentes-del-frontend-uiux-y-accesibilidad)
9. [Buscador Inteligente con Algoritmo de Scoring](#9-buscador-inteligente-con-algoritmo-de-scoring)
10. [Guía de Estilos y Estándares de Programación](#10-guía-de-estilos-y-estándares-de-programación)
11. [Mantenimiento, Respaldos y Solución de Problemas](#11-mantenimiento-respaldos-y-solución-de-problemas)
12. [Guía de Despliegue en Producción (cPanel / VPS)](#12-guía-de-despliegue-en-producción-cpanel--vps)

---

## 1. INFORMACIÓN GENERAL Y ARQUITECTURA DEL SISTEMA

### 1.1 Introducción y Propósito

El **Portal Web Institucional de la I.E. Gilberto Alzate Avendaño** es una plataforma web moderna, accesible, responsiva y dinámica diseñada para centralizar toda la comunicación, historia, oferta académica, sedes, trámites y actualidad de la institución educativa.

A partir de la versión 2.0, el portal cuenta con un **backend dinámico en PHP y base de datos MySQL**, permitiendo a los directivos y administradores autogestionar noticias, comunicados oficiales, fotos de portada y documentos institucionales en tiempo real sin tocar código fuente.

### 1.2 Diagrama de Arquitectura Global

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (NAVEGADOR)                           │
│        Desktop (1024px+)  |  Tablets (768px-992px)  |  Móviles (320px+) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Peticiones HTTP / HTTPS
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SERVIDOR WEB (APACHE / NGINX)                      │
│   • Redirecciones Relativas               • Control de Acceso .htaccess │
│   • Servidor de Assets (CSS/JS/IMG)       • Bloqueo de RCE en /uploads/ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│        VISTAS PÚBLICAS DINÁMICAS     │    │      PANEL ADMINISTRATIVO (CRUD)     │
│  • /php/public/noticias.php          │    │  • /php/admin/login.php (Auth)       │
│  • /index.html & /html/*.html        │    │  • /php/admin/index.php (Dashboard)  │
│  • Buscador Predictivo (search.js)   │    │  • /php/admin/logout.php             │
│  • Widget Accesibilidad (WCAG 2.1)   │    │  • Subida de Archivos Segura         │
└──────────────────┬───────────────────┘    └──────────────────┬───────────────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   NÚCLEO BACKEND Y SEGURIDAD (PHP 8.2+)                 │
│  • /php/config/database.php: Conexión PDO, Auto-aprovisionamiento de BD │
│  • Tokens CSRF (random_bytes)        • Rate Limiting (Anti-Fuerza Bruta)│
│  • Sanitización XSS (htmlspecialchars) • Verificación MIME con finfo    │
│  • Sesiones Seguras (HttpOnly, SameSite, Inactividad 30 min)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│      MOTOR DE BASE DE DATOS          │    │       SISTEMA DE ARCHIVOS            │
│          MySQL / MariaDB             │    │        /uploads/                     │
│  • Base de Datos: gaa_colegio        │    │  • /noticias/ (JPG, PNG, WebP)       │
│  • Tablas: admins, noticias,         │    │  • /documentos/ (PDF, DOC, DOCX)     │
│    documentos                        │    │  • Hash UUID de 32 caracteres        │
└──────────────────────────────────────┘    └──────────────────────────────────────┘
```

---

## 2. PILA TECNOLÓGICA COMPLETA

### 2.1 Frontend
- **HTML5 Semántico:** Estructura limpia (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<dialog>`).
- **CSS3 Puro (Vanilla):**
  - Sistema de diseño con **Variables CSS** centralizadas en `variables.css`.
  - Diseños fluidos con **CSS Grid** y **Flexbox**.
  - Tipografías fluidas con funciones modernas `clamp(min, val, max)`.
  - Micro-animaciones, efectos Glassmorphism y temas modernos.
- **JavaScript (Vanilla ES6+):**
  - Sin dependencias de frameworks pesados (carga instantánea).
  - Galería 3D y carruseles táctiles con interactividad por inercia.
  - Buscador predictivo en tiempo real con sistema de scoring por relevancia.
  - Motor de accesibilidad conforme a la norma **WCAG 2.1 Nivel AA**.
- **Tipografía y Fuentes:** Google Fonts (*Poppins*, *Roboto*, *Segoe UI*).
- **Librería de Iconos:** Font Awesome 6.4.0 (CDN).

### 2.2 Backend
- **PHP 8.2+ (Compatible con PHP 8.0 - 8.3):**
  - Conexión mediante **PDO (PHP Data Objects)** con emulación de sentencias desactivada para máxima seguridad.
  - Cifrado de contraseñas mediante **Bcrypt (`PASSWORD_BCRYPT`)**.
  - Validador criptográfico de tokens CSRF con `hash_equals()`.
  - Validador de archivos mediante extensión `fileinfo` (`finfo_open(FILEINFO_MIME_TYPE)`).
  - Manejo de sesiones seguras (`HttpOnly`, `use_only_cookies`, `SameSite=Lax`).

### 2.3 Base de Datos
- **MySQL 8.0+ / MariaDB 10.4+:**
  - Codificación predeterminada: `utf8mb4_unicode_ci` (soporte completo para tildes, caracteres especiales y emojis).
  - Índices optimizados para ordenamiento por fecha y filtrado por categoría.

---

## 3. ESTRUCTURA DEL PROYECTO Y DIRECTORIOS

A continuación se detalla la estructura física del repositorio:

```
c:\xampp\htdocs\portalweb/
│
├── index.html                   # Página principal institucional (Landing page)
├── favicon.ico                  # Icono del sitio
│
├── css/                         # Hojas de estilo en cascada
│   ├── styles.css               # Estilos globales, header, navegación, footer
│   ├── variables.css            # Tokens de diseño (colores, sombras, espaciados)
│   ├── modern-theme.css         # Mejoras visuales modernas y glassmorphism
│   ├── admin.css                # Estilos del Dashboard CRUD y Login (Super Responsive)
│   ├── noticias.css             # Estilos de la sección y modal de noticias públicas
│   ├── search.css               # Interfaz del buscador flotante y resultados
│   ├── accessibility.css        # Estilos del panel y modos de accesibilidad
│   ├── calendar.css             # Estilos del calendario institucional
│   ├── sedes_landing.css        # Estilos específicos de la sección de sedes
│   └── responsive.css           # Reglas de adaptación para móviles y tablets
│
├── js/                          # Scripts del lado del cliente
│   ├── script.js                # Lógica principal, carrusel 3D, navegación móvil
│   ├── noticias.js              # Apertura de modales y filtros de categorías
│   ├── search-data.js           # Índice de búsqueda con pesos, títulos y URLs
│   ├── accessibility.js         # Lógica de contrastes, tamaños de fuente y dislexia
│   └── admin.js                 # Scripts complementarios de administración
│
├── html/                        # Vistas estáticas e informativas
│   ├── noticias.html            # Redirección relativa a ../php/public/noticias.php
│   ├── admin.html               # Redirección relativa a ../php/admin/login.php
│   ├── historia.html            # Historia y símbolos de la institución
│   ├── calendario.html          # Calendario escolar institucional
│   ├── deportes.html            # Área deportiva, torneos y reconocimientos
│   ├── sedes.html               # Resumen de todas las sedes institucionales
│   ├── sede-central.html        # Detalle de la Sede Central
│   ├── sede-san-isidro.html     # Detalle Sede San Isidro
│   ├── sede-seguros-bolivar.html# Detalle Sede Seguros Bolívar
│   ├── sede-tomas-carrasquilla.html # Detalle Sede Tomás Carrasquilla
│   ├── sede-carlos-villa.html   # Detalle Sede Carlos Villa
│   ├── dependencias.html        # Rectoría, Coordinación, Secretaría y Gestión
│   ├── departamentos.html       # Redirección de compatibilidad hacia dependencias.html
│   ├── tecnicas.html            # Resumen de Medias Técnicas
│   ├── academico.html           # Sistema docente, estudiantes y planes
│   ├── planes-area.html         # Documentos curriculares y planes de área
│   ├── otros-servicios.html     # Biblioteca, PAE, manuales y preinscripción
│   ├── pre.html                 # Formulario de preinscripción de cupos
│   ├── contacto.html            # Canales de atención y formulario PQRSF
│   └── tecnicas/                # Páginas individuales de medias técnicas
│       ├── pascual.html         # Desarrollo de Software (Pascual Bravo)
│       ├── sena.html            # Programación de Software (SENA)
│       ├── musica.html          # Media Técnica en Música
│       ├── ambiental.html       # Gestión Ambiental
│       └── contenidos.html      # Contenidos Digitales
│
├── php/                         # Lógica dinámica del backend
│   ├── config/
│   │   └── database.php         # Conexión PDO, auto-aprovisionamiento, CSRF, auth y uploads
│   ├── admin/
│   │   ├── login.php            # Inicio de sesión con rate-limiting y Bcrypt
│   │   ├── index.php            # Dashboard multisección (Noticias, Documentos, Perfil)
│   │   └── logout.php           # Cierre de sesión seguro y destrucción de cookies
│   └── public/
│       └── noticias.php         # Vista pública de noticias renderizada desde MySQL
│
├── uploads/                     # Directorio de almacenamiento de archivos subidos
│   ├── .htaccess                # Protección: Bloquea ejecución de scripts PHP/binarios
│   ├── noticias/                # Fotos de portada subidas para noticias
│   └── documentos/              # Archivos PDF, DOC y DOCX institucionales
│
├── img/                         # Recursos gráficos, logos, escudos y banners
├── manuales/                    # Manuales de usuario en HTML para la comunidad
└── Documentación/               # Manuales técnicos y documentación para desarrolladores
    ├── MANUAL_DEL_PROGRAMADOR.md# Este documento
    └── MANUAL_TECNICO.md        # Especificaciones complementarias
```

---

## 4. INSTALACIÓN Y PUESTA EN MARCHA (XAMPP / PRODUCCIÓN)

### 4.1 Requisitos del Sistema
- **Servidor Web:** Apache 2.4 o superior (con `mod_rewrite` habilitado).
- **PHP:** Versión 8.1 o superior (Extensiones requeridas: `pdo_mysql`, `fileinfo`, `session`, `mbstring`).
- **MySQL:** Versión 8.0+ o MariaDB 10.4+.

### 4.2 Instalación Paso a Paso en XAMPP

1. **Ubicación del Proyecto:**
   Coloca la carpeta del proyecto en el directorio `htdocs` de tu instalación de XAMPP:
   `C:\xampp\htdocs\portalweb\`

2. **Iniciar Servicios:**
   Abre el **XAMPP Control Panel** y haz clic en **Start** para **Apache** y **MySQL**.

3. **Auto-Aprovisionamiento Automático:**
   **No necesitas crear manualmente la base de datos ni importar archivos `.sql`**.  
   Al abrir cualquier página PHP (como `http://localhost/portalweb/php/admin/login.php`), el script `php/config/database.php` detectará si la base de datos `gaa_colegio` existe. Si no existe, la creará automáticamente junto con todas las tablas necesarias y registrará al usuario administrador principal.

4. **Credenciales Iniciales de Acceso:**
   - **URL de Acceso:** `http://localhost/portalweb/php/admin/login.php`
   - **Usuario:** `admin`
   - **Contraseña:** `alzate2026`
   *(Una vez dentro, ve a la pestaña "Seguridad y Contraseña" para cambiarla).*

---

## 5. MODELO DE DATOS Y BASE DE DATOS MYSQL

### 5.1 Diagrama Entidad-Relación

```
┌─────────────────────────────────────────────────────────┐
│                         admins                          │
├──────────────────┬──────────────────┬───────────────────┤
│ id               │ INT(11)          │ PK, AUTO_INCREMENT│
│ username         │ VARCHAR(50)      │ NOT NULL, UNIQUE  │
│ password_hash    │ VARCHAR(255)     │ NOT NULL (Bcrypt) │
│ full_name        │ VARCHAR(100)     │ NOT NULL          │
│ created_at       │ DATETIME         │ DEFAULT CURRENT_TS│
└──────────────────┴──────────────────┴───────────────────┘

┌─────────────────────────────────────────────────────────┐
│                        noticias                         │
├──────────────────┬──────────────────┬───────────────────┤
│ id               │ INT(11)          │ PK, AUTO_INCREMENT│
│ title            │ VARCHAR(255)     │ NOT NULL          │
│ category         │ VARCHAR(50)      │ NOT NULL, INDEX   │
│ date_label       │ VARCHAR(50)      │ NOT NULL          │
│ image_url        │ VARCHAR(500)     │ DEFAULT NULL      │
│ excerpt          │ TEXT             │ NOT NULL          │
│ content          │ LONGTEXT         │ NOT NULL          │
│ created_at       │ DATETIME         │ DEFAULT CURRENT_TS│
└──────────────────┴──────────────────┴───────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       documentos                        │
├──────────────────┬──────────────────┬───────────────────┤
│ id               │ INT(11)          │ PK, AUTO_INCREMENT│
│ title            │ VARCHAR(255)     │ NOT NULL          │
│ category         │ VARCHAR(50)      │ NOT NULL, INDEX   │
│ file_path        │ VARCHAR(500)     │ NOT NULL          │
│ file_size        │ VARCHAR(50)      │ DEFAULT 'PDF'     │
│ description      │ TEXT             │ DEFAULT NULL      │
│ created_at       │ DATETIME         │ DEFAULT CURRENT_TS│
└──────────────────┴──────────────────┴───────────────────┘
```

### 5.2 Script SQL de Respaldo y Estructura

En caso de requerir una restauración manual mediante phpMyAdmin o consola MySQL:

```sql
-- 1. Crear Base de Datos
CREATE DATABASE IF NOT EXISTS `gaa_colegio` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `gaa_colegio`;

-- 2. Tabla de Administradores
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Noticias Institucionales
CREATE TABLE IF NOT EXISTS `noticias` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'sedes',
    `date_label` VARCHAR(50) NOT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_noticias_cat` (`category`),
    INDEX `idx_noticias_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Documentos y Circulares
CREATE TABLE IF NOT EXISTS `documentos` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'circulares',
    `file_path` VARCHAR(500) NOT NULL,
    `file_size` VARCHAR(50) DEFAULT 'PDF',
    `description` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_doc_cat` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. MÓDULO CRUD Y PANEL DE GESTIÓN ADMINISTRATIVO

El panel de administración (`php/admin/index.php`) es un entorno unificado y multisección con soporte para:

### 6.1 Módulo de Noticias y Novedades
- **Creación:** Formulario para registrar título, categoría (*Sedes, Culturales, Deportivas, Parroquiales*), fecha, resumen corto y cuerpo completo de la noticia.
- **Subida de Portada Física:** Carga directa de imágenes (JPG, PNG, WebP de hasta 5 MB) con vista previa instantánea mediante JavaScript (`FileReader API`).
- **Edición en Vivo:** Carga los datos existentes en el formulario manteniendo la imagen previa si no se selecciona un nuevo archivo.
- **Eliminación Segura:** Al eliminar una noticia, el backend elimina el registro en MySQL y ejecuta `@unlink()` para borrar físicamente el archivo de la carpeta `uploads/noticias/`, evitando acumulación de archivos huérfanos en el disco.

### 6.2 Módulo de Documentos y Circulares
- **Subida de Archivos:** Soporte para documentos PDF, DOC y DOCX de hasta 10 MB.
- **Cálculo Automático de Tamaño:** La función `handleSecureUpload()` calcula el tamaño exacto del archivo y lo almacena formateado (ej. `345 KB` o `2.4 MB`).
- **Clasificación:** Circulares Informativas, PAE / Alimentación, Manual de Convivencia, Planes Académicos y Resoluciones de Rectoría.

### 6.3 Módulo de Seguridad y Perfil
- Permite al usuario en sesión actualizar su nombre visible y su nombre de usuario.
- Cambio de contraseña con verificación obligatoria de la contraseña actual antes de aplicar el nuevo hash Bcrypt.

---

## 7. CAPA DE CIBERSEGURIDAD Y PROTECCIÓN OWASP

El sistema implementa controles rigurosos para mitigar las principales vulnerabilidades del **OWASP Top 10**:

### 7.1 Autenticación y Cifrado de Contraseñas
- Las contraseñas se almacenan mediante el algoritmo **Bcrypt** con costo adaptativo (`PASSWORD_BCRYPT`). Nunca se almacenan ni transmiten en texto plano.
- La validación se realiza exclusivamente en el backend con `password_verify()`.

### 7.2 Protección Anti-Fuerza Bruta (Rate Limiting)
- En `php/admin/login.php`, se controla el número de intentos fallidos en la sesión.
- Si un atacante falla 5 veces consecutivas, el sistema bloquea los intentos de inicio de sesión durante **15 minutos**.

### 7.3 Protección contra Cross-Site Request Forgery (CSRF)
- En cada sesión se genera un token pseudoaleatorio criptográfico de 64 caracteres:
  ```php
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
  ```
- Todos los formularios envían este token en un campo oculto `<input type="hidden" name="csrf_token">` y el servidor lo valida de forma segura contra ataques de temporización mediante `hash_equals()`.

### 7.4 Prevención de Inyección SQL (SQLi)
- El 100% de las consultas que reciben parámetros del usuario utilizan **sentencias preparadas de PDO**:
  ```php
  $stmt = $pdo->prepare('SELECT * FROM noticias WHERE id = :id');
  $stmt->execute([':id' => $id]);
  ```
- Está prohibida la concatenación directa de variables dentro de cadenas SQL.

### 7.5 Subida Segura de Archivos y Prevención de Ejecución Remota (RCE)
La función `handleSecureUpload()` ejecuta 4 filtros consecutivos:
1. **Validación de Extensión:** Whitelist estricta (`jpg`, `jpeg`, `png`, `webp`, `pdf`, `doc`, `docx`).
2. **Validación de Tipo MIME Real:** Inspección binaria del encabezado del archivo con `finfo` (impide camuflar archivos `.php` como `.jpg`).
3. **Renombrado Criptográfico:** Cada archivo se renombra a un UUID aleatorio de 32 caracteres hexadecimales (`bin2hex(random_bytes(16)) . '.' . $ext`). Esto previene ataques de *Path Traversal* y sobreescritura.
4. **Protección Apache (.htaccess):** En `uploads/.htaccess` se desactiva la ejecución de cualquier script ejecutable:
   ```apache
   # uploads/.htaccess
   <FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi|exe)$">
       Order Allow,Deny
       Deny from all
   </FilesMatch>
   php_flag engine off
   ```

### 7.6 Seguridad de Sesiones y Protección contra XSS
- **Cookies de Sesión:** Configuradas con `HttpOnly=true` (inaccesibles para JavaScript), `SameSite=Lax` y `use_only_cookies=1`.
- **Regeneración de ID:** Tras un login exitoso se ejecuta `session_regenerate_id(true)` para destruir la sesión previa y prevenir *Session Fixation*.
- **Expiración:** Cierre automático tras 30 minutos de inactividad.
- **Sanitización XSS:** Toda salida enviada al navegador pasa por `htmlspecialchars($str, ENT_QUOTES, 'UTF-8')`.

---

## 8. COMPONENTES DEL FRONTEND, UI/UX Y ACCESIBILIDAD

### 8.1 Sistema de Variables y Tokens CSS (`css/variables.css`)

```css
:root {
    /* Paleta Institucional */
    --color-primary: #183c74;
    --color-primary-dark: #102952;
    --color-primary-light: #2558a3;
    --color-secondary: #dc2626;
    --color-accent: #ffd700;
    
    /* Neutros y Superficies */
    --color-white: #ffffff;
    --color-gray-100: #f8fafc;
    --color-gray-200: #e2e8f0;
    --color-gray-600: #475569;
    --color-gray-850: #1e293b;

    /* Sombras y Elevaciones */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 6px 18px rgba(15, 34, 64, 0.08);
    --shadow-xl: 0 20px 40px -10px rgba(15, 34, 64, 0.18);

    /* Transiciones */
    --transition-fast: 0.15s ease;
    --transition-base: 0.25s ease;
    --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 8.2 Menú Institucional Multinivel
- Soporta menú desplegable (`.dropdown-menu`) en escritorio con activación por hover suave.
- En dispositivos móviles (`<= 1024px`), se convierte en un menú lateral tipo *Drawer* con animación de hamburguesa a cruz (X) y overlay oscuro de desenfoque.

### 8.3 Galería 3D Interactiva (`js/script.js`)
- Implementada con transformaciones CSS 3D (`perspective`, `rotateY`, `translateZ`).
- Soporta navegación mediante botones anterior/siguiente, teclado (flechas) y gestos táctiles *swipe* en dispositivos móviles.

### 8.4 Motor de Accesibilidad Universal (`js/accessibility.js`)
El widget flotante de accesibilidad cumple con las pautas **WCAG 2.1**:
- **Tamaño de Texto:** Incremento y reducción dinámico del `font-size` base.
- **Alto Contraste:** Invierte paletas a fondos negros puros con texto amarillo/blanco de alto contraste.
- **Contraste Negativo:** Modo oscuro alternativo.
- **Escala de Grises:** Filtro CSS `grayscale(100%)` para usuarios con daltonismo.
- **Fuente para Dislexia:** Aplica la tipografía `OpenDyslexic` o fuentes de alta legibilidad con espaciado entre caracteres (`letter-spacing`).
- **Subrayado de Enlaces:** Resalta todos los hipervínculos navegables con línea continua.

---

## 9. BUSCADOR INTELIGENTE CON ALGORITMO DE SCORING

El buscador integrado (`js/search-data.js` y `js/script.js`) implementa un motor de búsqueda del lado del cliente optimizado:

1. **Índice Centralizado (`SEARCH_INDEX`):** Contiene título, descripción, categoría, palabras clave (*keywords*) y URL relativa.
2. **Normalización de Texto:** Remueve tildes, signos de puntuación y convierte a minúsculas para comparaciones insensibles.
3. **Algoritmo de Ponderación:**
   - **Coincidencia Exacta en Título:** +100 puntos.
   - **Título Inicia con el Término:** +60 puntos.
   - **Palabra Clave Exacta:** +40 puntos.
   - **Coincidencia en Descripción:** +20 puntos.
4. **Adaptación de Rutas:** Detecta automáticamente si el usuario navega desde la raíz, `/html/`, `/html/tecnicas/` o `/php/public/`, generando URLs relativas precisas.

---

## 10. GUÍA DE ESTILOS Y ESTÁNDARES DE PROGRAMACIÓN

Para mantener la coherencia del proyecto:

### 10.1 Estándares PHP (PSR-12)
- Usar declaración estricta de tipos donde sea posible (`declare(strict_types=1);`).
- Nombres de funciones y métodos en `camelCase()`.
- Nombres de variables en `$camelCase`.
- Tablas y columnas de base de datos en `snake_case`.
- Indentación estándar de 4 espacios (no tabulaciones).

### 10.2 Estándares JavaScript
- Usar sintaxis moderna ES6+ (`const`, `let`, *Arrow Functions*, *Template Literals*).
- Manejo seguro de eventos con `addEventListener`.
- No usar variables globales en el objeto `window` salvo constantes explícitas (`SEARCH_INDEX`).

### 10.3 Estándares HTML / CSS
- Nomenclatura de clases basada en metodología inspirada en BEM (`.block-name__element--modifier`).
- Prohibido el uso de estilos en línea (`style="..."`) para maquetación estructural.
- Todo elemento interactivo (`<button>`, `<a>`, `<input>`) debe contar con atributos `aria-label` o etiquetas `<label>` para lectores de pantalla.

---

## 11. MANTENIMIENTO, RESPALDOS Y SOLUCIÓN DE PROBLEMAS

### 11.1 Respaldo de la Base de Datos
Para generar una copia de seguridad rápida de la base de datos desde la terminal de XAMPP:

```bash
# Exportar respaldo SQL
c:\xampp\mysql\bin\mysqldump.exe -u root gaa_colegio > C:\respaldo_gaa_colegio.sql

# Importar respaldo
c:\xampp\mysql\bin\mysql.exe -u root gaa_colegio < C:\respaldo_gaa_colegio.sql
```

### 11.2 Respaldo de Archivos Multimedia
Copia periódicamente el contenido de la carpeta:
`c:\xampp\htdocs\portalweb\uploads\`

### 11.3 Solución de Problemas Comunes

| Problema / Error | Causa Probable | Solución |
| :--- | :--- | :--- |
| **Error 404 Not Found** | Se omitió la subcarpeta `/portalweb/` en la URL. | Usar `http://localhost/portalweb/...` o configurar un VirtualHost en Apache. |
| **Credenciales Incorrectas** | Se olvidó la contraseña de administrador. | Ejecutar script en PHP con `password_hash('nueva_clave', PASSWORD_BCRYPT)` o actualizar el campo `password_hash` en la tabla `admins`. |
| **Error al Subir Fotos/PDF** | Permisos insuficientes en la carpeta `uploads/`. | Verificar que Apache tenga permisos de escritura (`chmod 755` o `775` en Linux). |
| **Error "Call to undefined function finfo_open"** | La extensión `fileinfo` de PHP está deshabilitada. | Abrir `php.ini`, descomentar la línea `extension=fileinfo` y reiniciar Apache. |

---

## 12. GUÍA DE DESPLIEGUE EN PRODUCCIÓN (cPanel / VPS)

Al migrar este proyecto de XAMPP local a un hosting o servidor en producción:

1. **Subida de Archivos:**
   Sube todo el contenido a la carpeta `public_html/` (o la raíz del dominio).
2. **Creación de Base de Datos en cPanel / Servidor:**
   - Crea una base de datos MySQL y un usuario con contraseña segura.
   - Otorga privilegios totales al usuario sobre la base de datos.
3. **Actualización de Credenciales en `php/config/database.php`:**
   Configura las credenciales de conexión en la constante o array de configuración:
   ```php
   $host = 'localhost';
   $db   = 'nombre_bd_cpanel';
   $user = 'usuario_cpanel';
   $pass = 'contraseña_segura';
   ```
4. **Instalación de Certificado SSL (HTTPS):**
   Activa Let's Encrypt o el certificado SSL provisto por el hosting para cifrar todo el tráfico web y proteger las credenciales administrativas.
5. **Verificación de Permisos:**
   Asegúrate de que la carpeta `uploads/` tenga permisos `0755` y que el archivo `uploads/.htaccess` esté activo.

---

**I.E. Gilberto Alzate Avendaño** — *Medellín, Colombia*  
*Documento mantenido y actualizado por el Equipo de Desarrollo de Software.*
