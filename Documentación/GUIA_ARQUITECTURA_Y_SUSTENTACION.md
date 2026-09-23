# GUÍA TÉCNICA DE ARQUITECTURA MVC, CIBERSEGURIDAD Y SUSTENTACIÓN
**Institución Educativa Gilberto Alzate Avendaño — Media Técnica en Programación de Software (Grado Once)**

Esta guía complementa el [MANUAL_DEL_PROGRAMADOR.md](file:///c:/xampp/htdocs/portalweb/Documentaci%C3%B3n/MANUAL_DEL_PROGRAMADOR.md) y responde detalladamente a cómo funciona la arquitectura interna, por qué existen los archivos de seguridad `.htaccess` y cómo defender el proyecto con solvencia técnica en la sustentación de grado.

---

## 1. ESTADO GENERAL DEL PROYECTO

El proyecto se encuentra en un estado **estable, modular y seguro**, cumpliendo con los estándares de ingeniería de software requeridos para la educación técnica:

* **Arquitectura Backend:** Patrón **Modelo-Vista-Controlador (MVC)** 100% en español, eliminando scripts monolíticos y separando responsabilidades.
* **Capa de Datos:** Conexión centralizada con **PDO**, consultas preparadas contra inyección SQL, auto-aprovisionamiento de tablas y archivo maestro [`database.sql`](file:///c:/xampp/htdocs/portalweb/Documentaci%C3%B3n/database.sql).
* **Configuración Global:** Implementación de [`properties.php`](file:///c:/xampp/htdocs/portalweb/php/modelo/properties.php) para centralizar credenciales, zona horaria y switches de entorno (`local` vs `production`).
* **Frontend y Accesibilidad:** Compatibilidad multiplataforma, PWA offline ([`sw.js`](file:///c:/xampp/htdocs/portalweb/sw.js)), carrusel dinámico 3D y panel de accesibilidad conforme a WCAG 2.1.
* **Integridad del Código:** Cero errores de sintaxis (`php -l`), rutas relativas calculadas a profundidad uniforme (`../../`) y enlaces del cliente actualizados.

---

## 2. ¿POR QUÉ TANTOS ARCHIVOS `.htaccess`? ¿EMPEORAN EL PROYECTO?

### ¿Empeoran el proyecto o lo hacen lento?
**No. En lo absoluto.**
1. **Impacto en Rendimiento = 0:** Apache interpreta los archivos `.htaccess` a nivel de servidor en **microsegundos**. No añaden retraso perceptible a las peticiones HTTP.
2. **Impacto en Seguridad = Máximo:** Son el mecanismo nativo de Apache para aplicar el principio de **Defensa en Profundidad** (*Defense in Depth*). Sin ellos, un servidor web expone por defecto cualquier archivo que resida en el disco si el usuario adivina su ruta en la URL.

### La Analogía de las Puertas y Cerraduras
Imagina la institución educativa: no dejas la puerta del colegio abierta con acceso libre a la rectoría, a la sala de profesores y a los archivos de calificaciones. Cada área tiene su propia cerradura:

```
                  ┌──────────────────────────────────────────────┐
                  │                 INTERNET                     │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                     ┌────────────────────────────────────────┐
                     │     /.htaccess (Portería Principal)    │
                     │  - Prohíbe ver listados de carpetas    │
                     │  - Bloquea descargas de .sql, .log, md │
                     └───────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
    ┌─────────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐
    │  php/modelo/.htaccess   │ │php/logs/.htaccess│ │    uploads/.htaccess    │
    │  (Archivos y Claves)    │ │(Libro de Actas)  │ │   (Almacén de Archivos) │
    │ Bloquea lectura web de  │ │Bloquea lectura de│ │ Prohíbe ejecutar scripts│
    │  properties y queries   │ │   contacto.log   │ │ PHP que suban usuarios  │
    └─────────────────────────┘ └──────────────────┘ └─────────────────────────┘
```

### Tabla de los 5 Archivos `.htaccess` del Proyecto

| Ubicación | ¿Qué protege? | Regla Principal | Vulnerabilidad que previene |
| :--- | :--- | :--- | :--- |
| **`/.htaccess`** (Raíz) | Todo el servidor web | `Options -Indexes`<br>`<FilesMatch "\.(sql\|log\|env\|ini)"> Deny` | Fuga de información sensible y listado de directorios (*Directory Listing*). |
| **`php/modelo/.htaccess`** | Credenciales y consultas | `Require all denied` | Exposición de contraseñas de BD en `properties.php` y consultas SQL. |
| **`php/logs/.htaccess`** | Registros de auditoría | `Require all denied` | Lectura no autorizada de mensajes ciudadanos en `contacto.log`. |
| **`php/vistas/.htaccess`** | Plantillas HTML puras | `Require all denied` | Carga de vistas vacías fuera del contexto de su controlador. |
| **`uploads/.htaccess`** | Carpeta de fotos y PDFs | `php_flag engine off`<br>`Deny from all para scripts` | **Ejecución Remota de Código (RCE)**: si un atacante sube un archivo `.php` malicioso disfrazado de foto, el servidor se niega a ejecutarlo. |

---

## 3. EL PATRÓN MVC EN ACCIÓN: EJEMPLO PRÁCTICO

¿Qué ocurre exactamente cuando el Administrador publica una noticia?

```
[1] Administrador llena el formulario en pantalla
    │ (HTML en php/vistas/admin.php)
    ▼
[2] Envío POST al Controlador
    │ (php/controlador/admin.php)
    │  • Valida el Token CSRF (Anti-falsificación)
    │  • Sanitiza textos y sube la foto (handleSecureUpload)
    ▼
[3] Controlador llama al Modelo
    │ (php/modelo/noticias.php -> crearNoticia())
    ▼
[4] Modelo ejecuta sentencia preparada con PDO
    │ INSERT INTO noticias (title, category, date_label, image_url, excerpt, content)
    │ VALUES (:title, :category, :date_label, :image_url, :excerpt, :content)
    ▼
[5] MySQL almacena el registro en disco
    ▼
[6] Controlador redirige con mensaje de éxito: "Noticia creada exitosamente"
```

**Beneficio Técnico:** La vista nunca toca la base de datos, y el modelo nunca genera código HTML. Cada pieza tiene una única responsabilidad (*Single Responsibility Principle*).

---

## 4. LA ARQUITECTURA HÍBRIDA: GITHUB PAGES VS XAMPP

Es común que surja la duda: *¿Por qué no pasar absolutamente todo a `index.php` y eliminar `index.html`?*

* **Entorno de Demostración Estática (GitHub Pages):**
  GitHub Pages es una plataforma gratuita de hosting estático que **no ejecuta servidores PHP ni bases de datos relacionales**. Requiere obligatoriamente un `index.html` en la raíz. Mantener `index.html` y `/html/` permite que el jurado o cualquier persona en internet pueda evaluar el diseño, accesibilidad WCAG y responsividad del portal desde cualquier celular sin necesidad de configurar un servidor local.
* **Entorno Dinámico Completo (XAMPP / Hosting Definitivo):**
  Al ejecutarse bajo Apache con MySQL, el backend dinámico de `/php` entra en acción con autenticación criptográfica, persistencia de datos y panel administrativo.

> **Defensa para el Jurado:** *"Implementamos una arquitectura desacoplada: una capa estática compatible con previsualización en la nube (GitHub Pages) y una capa de servicios dinámica bajo arquitectura MVC en PHP 8.2 para la gestión de contenidos (CMS)."*

---

## 5. BANCO DE PREGUNTAS TÍPICAS PARA LA SUSTENTACIÓN DE GRADO

### Pregunta 1: ¿Por qué implementaron el patrón Modelo-Vista-Controlador (MVC)?
> **Respuesta:** *"Para evitar el código espagueti y separar la lógica de negocio de la interfaz visual. Antes, un solo archivo PHP hacía la conexión a la base de datos, procesaba formularios y dibujaba etiquetas HTML. Con MVC, si el colegio decide rediseñar la interfaz visual, solo se modifican los archivos en `vistas/`, sin tocar las consultas SQL en `modelo/` ni las validaciones de seguridad en `controlador/`."*

### Pregunta 2: ¿Cómo previenen ataques de Inyección SQL en las consultas?
> **Respuesta:** *"Utilizamos la extensión **PDO (PHP Data Objects)** configurada con sentencias preparadas y parámetros vinculados (`prepare()` y `execute()`). Los valores ingresados por el usuario se envían separados de la instrucción SQL, impidiendo que comandos maliciosos alteren la consulta."*

### Pregunta 3: ¿Para qué sirve el archivo `properties.php`?
> **Respuesta:** *"Aplica las mejores prácticas de configuración externa (12-Factor App). Centraliza las credenciales del servidor (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`), la zona horaria institucional y el interruptor de entorno `APP_ENV`. Si migramos el sistema de XAMPP a un hosting en producción, solo modificamos `properties.php` en un solo lugar y todo el backend se adapta inmediatamente sin reescribir código."*

### Pregunta 4: ¿Por qué utilizan archivos `.htaccess` en lugar de dejar las carpetas abiertas?
> **Respuesta:** *"Aplicamos el principio de mínima exposición y defensa en profundidad. Los archivos `.htaccess` bloquean la lectura directa de credenciales en `modelo/`, impiden que usuarios externos lean los mensajes privados de los ciudadanos en `contacto.log`, y en la carpeta `uploads/` desactivan el motor PHP para neutralizar cualquier intento de Ejecución Remota de Código (RCE)."*

### Pregunta 5: ¿Cómo manejan la seguridad de las contraseñas de los administradores?
> **Respuesta:** *"Las contraseñas nunca se almacenan en texto plano. Se procesan con la función nativa `password_hash()` utilizando el algoritmo criptográfico **Bcrypt** con costo adaptable, y se verifican al iniciar sesión mediante `password_verify()`. Además, implementamos protección contra ataques de fuerza bruta que bloquea el acceso temporalmente tras 5 intentos fallidos."*
