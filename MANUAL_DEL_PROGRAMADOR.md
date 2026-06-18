# MANUAL DEL PROGRAMADOR - PORTAL INSTITUCIONAL
## I.E. Gilberto Alzate Avendaño

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Autor:** Equipo de Desarrollo  
**Última Actualización:** 2026-06-16

---

## TABLA DE CONTENIDOS

1. [Información General y Arquitectura](#1-información-general-y-arquitectura)
2. [Configuración del Entorno de Desarrollo](#2-configuración-del-entorno-de-desarrollo)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Componentes y Funcionalidades](#4-componentes-y-funcionalidades)
5. [Guías de Estilo y Estándares](#5-guías-de-estilo-y-estándares)
6. [APIs y Endpoints](#6-apis-y-endpoints)
7. [Despliegue](#7-despliegue)
8. [Mantenimiento y Solución de Problemas](#8-mantenimiento-y-solución-de-problemas)
9. [Contacto y Soporte](#9-contacto-y-soporte)

---

## 1. INFORMACIÓN GENERAL Y ARQUITECTURA

### 1.1 Introducción

El Portal Institucional del I.E. Gilberto Alzate Avendaño es una aplicación web responsiva diseñada para proporcionar información sobre la institución educativa a estudiantes, padres de familia y personal administrativo. La aplicación incluye:

- Información sobre sedes, departamentos y servicios
- Sistema de navegación intuitivo
- Información de medias técnicas (SENA, Pascual Bravo, Música, etc.)
- Secciones de deportes, noticias y eventos
- Widget de accesibilidad para usuarios con discapacidades
- Sistema de pre-inscripción
- Formulario de contacto y PQRSF
- Integración con sistemas externos (Akros, YouTube, etc.)

**Propósito:** Crear una presencia web moderna, accesible e informativa para la comunidad educativa.

**Alcance:** Aplicación web pública enfocada en dispositivos móviles con soporte responsivo para desktop.

### 1.2 Tecnologías Utilizadas

#### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos con Variables CSS, Flexbox y Grid
- **JavaScript (ES6+)** - Funcionalidad dinámica
- **Font Awesome 6.4.0** - Librería de iconos (CDN)

#### Backend
- **Python** (1.4% del código) - Funcionalidades específicas (Flask/Django si se requiere)

#### Herramientas y Servicios Externos
- **Git/GitHub** - Control de versiones
- **GitHub Pages** - Hosting estático
- **Google Forms** - Formulario PQRSF
- **YouTube** - Canal institucional (Alzate Virtual)
- **Akros** - Sistema académico de estudiantes y docentes
- **Wix** - Plataforma de biblioteca

#### Dependencias CDN
- Font Awesome Icons (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)

### 1.3 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO / NAVEGADOR                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │   HTML5 + CSS3 + JS    │
                │   (Frontend Estático)   │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐          ┌────▼────┐        ┌────▼────┐
   │ Páginas │          │ Estilos │        │ Scripts │
   │  HTML   │          │   CSS   │        │   JS    │
   └─────────┘          └─────────┘        └─────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼──────┐      ┌──────▼─────┐     ┌──────▼──────┐
   │  Akros    │      │  Google    │     │   Servicios │
   │  (Sistema │      │   Forms    │     │   Externos  │
   │ Académico)│      │  (PQRSF)   │     │ (YouTube...)│
   └───────────┘      └────────────┘     └─────────────┘
```

**Descripción de Componentes:**

1. **Frontend (HTML/CSS/JavaScript)**
   - Interfaz responsiva para móviles y desktop
   - Sistema de componentes reutilizables
   - Animaciones y efectos visuales
   - Widget de accesibilidad

2. **Backend (Python - Opcional)**
   - Posible servidor para procesar formularios
   - Envío de emails (PQRSF)
   - Manejo de pre-inscripciones

3. **Servicios Externos**
   - **Akros**: Sistema de calificaciones y académico
   - **Google Forms**: Recopilación de PQRSF
   - **YouTube**: Canal Alzate Virtual
   - **Wix**: Biblioteca institucional

---

## 2. CONFIGURACIÓN DEL ENTORNO DE DESARROLLO

### 2.1 Requisitos Previos

Instala las siguientes herramientas globalmente:

#### Windows/macOS/Linux

```bash
# 1. Git - Control de versiones
# Descarga desde: https://git-scm.com/download

# 2. Node.js (opcional, si se usa npm para herramientas)
# Descarga desde: https://nodejs.org/ (LTS)

# 3. Visual Studio Code (recomendado)
# Descarga desde: https://code.visualstudio.com/

# 4. Python 3.8+ (si se desarrolla backend)
# Descarga desde: https://www.python.org/downloads/
```

### 2.2 Pasos de Instalación

#### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Rv3ndbm/Portal-Institucional.git
cd Portal-Institucional
```

#### Paso 2: Estructura Base

Verifica que el repositorio contenga las siguientes carpetas:

```
Portal-Institucional/
├── index.html           # Página principal
├── html/                # Páginas secundarias
├── css/                 # Archivos de estilo
├── js/                  # Scripts JavaScript
├── img/                 # Imágenes y multimedia
├── media/               # Archivos multimedia
├── templates/           # Plantillas (si se usa backend)
├── Documentación/       # Documentación adicional
└── .vscode/             # Configuración del editor
```

#### Paso 3: Configurar Variables de Entorno (Opcional para Backend)

Si se implementa un servidor backend en Python:

```bash
# En Linux/macOS
echo "SECRET_KEY=tu_clave_secreta" > .env
echo "DEBUG=True" >> .env
echo "ALLOWED_HOSTS=localhost,127.0.0.1" >> .env

# En Windows
# Crear archivo .env y añadir lo anterior
```

#### Paso 4: Instalar Dependencias (Backend - Python)

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2.3 Ejecución Local

#### Opción A: Solo Frontend (Recomendado para desarrollo inicial)

```bash
# Usa un servidor local simple
# Con Python 3:
python -m http.server 8000

# Luego abre en el navegador:
# http://localhost:8000
```

#### Opción B: Con Live Server (Visual Studio Code)

1. Instala la extensión "Live Server" en VSCode
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

#### Opción C: Backend con Django (Si está configurado)

```bash
python manage.py runserver
# Accede a: http://localhost:8000
```

---

## 3. ESTRUCTURA DEL PROYECTO

### 3.1 Árbol de Carpetas

```
Portal-Institucional/
│
├── index.html                      # Página principal del portal
├── manual-usuario.html             # Manual para usuarios
├── MANUALES.html                   # Página de manuales
├── guia-rapida.html                # Guía rápida
├── inicio-rapido.html              # Inicio rápido
├── referencia-rapida.html          # Referencia rápida
│
├── html/                           # Páginas secundarias
│   ├── historia.html               # Historia de la institución
│   ├── calendario.html             # Calendario de eventos
│   ├── deportes.html               # Información de deportes
│   ├── noticias.html               # Noticias institucionales
│   ├── sedes.html                  # Información de sedes
│   ├── sede-san-isidro.html
│   ├── sede-seguros-bolivar.html
│   ├── sede-tomas-carrasquilla.html
│   ├── sede-carlos-villa.html
│   ├── sede-central.html
│   │
│   ├── departamentos.html          # Departamentos administrativos
│   ├── tecnicas.html               # Medias técnicas
│   ├── tecnicas/                   # Submódulo de técnicas
│   │   ├── pascual.html            # Programa Pascual Bravo
│   │   ├── musica.html             # Programa de Música
│   │   ├── ambiental.html          # Gestión Ambiental
│   │   ├── contenidos.html         # Contenidos Digitales
│   │   └── sena.html               # Programa SENA
│   │
│   ├── academico.html              # Modalidad académica
│   ├── planes-area.html            # Planes de área académicos
│   ├── otros-servicios.html        # Servicios adicionales
│   ├── pre.html                    # Pre-inscripción
│   └── contacto.html               # Formulario de contacto
│
├── css/                            # Estilos CSS
│   ├── styles.css                  # Estilos generales
│   ├── variables.css               # Variables CSS (colores, fuentes)
│   ├── index.css                   # Estilos página principal
│   ├── index_new.css               # Estilos nuevos página principal
│   ├── accessibility.css           # Estilos accesibilidad
│   └── search.css                  # Estilos búsqueda
│
├── js/                             # Scripts JavaScript
│   ├── script.js                   # Script principal
│   ├── accessibility.js            # Funcionalidad accesibilidad
│   └── search-data.js              # Datos y lógica búsqueda
│
├── img/                            # Imágenes
│   ├── logo_del_colegio-removebg-preview__1_-removebg-preview.png
│   ├── hovver historia.jpeg
│   ├── eventos cultulares sb.jpg
│   ├── clases interactivas ce.jpg
│   ├── deporte ce.webp
│   ├── admiinistrativo.jpeg
│   ├── facebook.png
│   ├── ig.png
│   ├── yt.png
│   ├── whatsap.png
│   ├── men.jpg
│   ├── simat.jpg
│   ├── icfes.jpg
│   ├── akros.jpg
│   └── Gobierno-en-linea.jpg
│
├── media/                          # Multimedia
│   └── (videos, audios, documentos)
│
├── templates/                      # Plantillas (backend)
│   └── (si se usa framework como Django)
│
├── scratch/                        # Archivos temporales/prueba
│
├── Documentación/                  # Documentación adicional
│   └── (manuales, guías)
│
├── .vscode/                        # Configuración Visual Studio Code
│   └── settings.json
│
└── README.md                       # Documentación del proyecto
```

### 3.2 Modelos de Datos

Este es un portal web sin base de datos centralizada. Los datos se manejan así:

**1. Datos Estáticos (HTML)**
- Información de sedes, departamentos, medias técnicas
- Información de historia, deportes, eventos

**2. Datos Dinámicos (JavaScript)**
- Búsqueda de contenidos (search-data.js)
- Estado de accesibilidad del usuario
- Preferencias del navegador (localStorage)

**3. Datos Externos**
- **Akros**: Sistema académico (estudiante.alzate.edu.co, docente.alzate.edu.co)
- **Google Forms**: Formulario PQRSF
- **YouTube**: Canal Alzate Virtual

**Diagrama Conceptual:**

```
┌─────────────────┐
│   Usuario Web   │
└────────┬────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
┌───▼────────┐          ┌──────────▼──────┐
│   HTML     │          │ JavaScript      │
│  Estático  │◄────────►│ (Dinámico)      │
│            │          │ localStorage    │
└────────────┘          └──────────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
            ┌───────▼──┐   ┌──────▼────┐  ┌────▼──────┐
            │   Akros  │   │ Google    │  │ YouTube   │
            │  System  │   │ Forms     │  │  Channel  │
            └──────────┘   └───────────┘  └───────────┘
```

---

## 4. COMPONENTES Y FUNCIONALIDADES

### 4.1 Módulos Principales

#### 4.1.1 Módulo: Navegación Principal
**Archivo:** `index.html`, `html/index.html`  
**Archivo de Estilos:** `css/index.css`, `css/index_new.css`

**Funcionalidades:**
- Menú responsive con navegación lateral
- Dropdown menus para categorías
- Logo y título de institución
- Animaciones de transición

**Estructura HTML:**
```html
<header class="main-header" id="mainHeader">
  <nav class="main-nav" id="mainNav">
    <ul class="nav-menu nav-menu-left">
      <li class="nav-item">INICIO
        <ul class="dropdown-menu">
          <li><a href="#">Historia</a></li>
          <li><a href="#">Eventos</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</header>
```

#### 4.1.2 Módulo: Galería 3D Cilíndrica
**Archivo:** `js/script.js`  
**Características:**
- Carrusel 3D con efecto cilindro
- Navegación con botones y arrastre
- Animaciones suave
- Links clickeables a secciones

**Selectores CSS Clave:**
```css
.cylinder-gallery-wrapper
.cylinder-container
.cylinder-card
.scene-3d
```

#### 4.1.3 Módulo: Accesibilidad
**Archivo:** `js/accessibility.js`  
**Archivo de Estilos:** `css/accessibility.css`

**Funcionalidades:**
- Aumentar/Disminuir tamaño de texto
- Alto contraste
- Contraste negativo
- Escala de grises
- Fuente legible (dyslexia-friendly)
- Subrayar enlaces
- Botón flotante de accesibilidad

**Variables de Control (localStorage):**
```javascript
localStorage.setItem('textSize', 'large');
localStorage.setItem('highContrast', 'true');
localStorage.setItem('dyslexiaFriendly', 'true');
```

#### 4.1.4 Módulo: Búsqueda
**Archivo:** `js/search-data.js`

**Funcionalidades:**
- Búsqueda en tiempo real
- Indexación de contenido
- Resultados dinámicos

#### 4.1.5 Módulo: Secciones de Contenido
**Archivos:** `html/*.html`

**Secciones Principales:**
1. **Historia** (`html/historia.html`) - Información histórica de la institución
2. **Sedes** (`html/sedes.html`, `html/sede-*.html`) - Información de 5 sedes
3. **Medias Técnicas** (`html/tecnicas.html`, `html/tecnicas/*.html`)
   - Desarrollo de Software (Pascual Bravo)
   - Música
   - Gestión Ambiental
   - Contenidos Digitales
   - Programación (SENA)
4. **Académico** (`html/academico.html`) - Modalidad académica, ICFES
5. **Deportes** (`html/deportes.html`) - Programas deportivos
6. **Noticias** (`html/noticias.html`) - Blog de noticias
7. **Calendario** (`html/calendario.html`) - Eventos y fechas
8. **Pre-inscripción** (`html/pre.html`) - Formulario de admisión
9. **Contacto** (`html/contacto.html`) - Información de contacto

#### 4.1.6 Módulo: Footer
**Estructura:**
- Links a redes sociales (Facebook, Instagram, YouTube, WhatsApp)
- Enlaces rápidos por categoría
- Información de contacto
- Links institucionales (Ministerio, SIMAT, ICFES, Akros)

### 4.2 Componentes Reutilizables

#### Bento Grid (Servicios)
```html
<div class="bento-services-section">
  <div class="bento-cell bento-dark">
    <i class="fas fa-icon"></i>
    <strong>Título</strong>
    <p>Descripción</p>
    <a href="#" class="bento-link">Ver →</a>
  </div>
</div>
```

#### Feature Section (Con imagen y texto)
```html
<section class="feature-section">
  <div class="feature-grid">
    <div class="feature-text">
      <span class="feature-badge">Badge</span>
      <h2>Título</h2>
      <p>Descripción</p>
    </div>
    <div class="feature-image circle-shape">
      <img src="#" alt="">
    </div>
  </div>
</section>
```

#### Card Oscura
```html
<div class="dark-card dark-card-blue">
  <i class="fas fa-icon dark-card-icon"></i>
  <h3>Título</h3>
  <a href="#" class="dark-card-btn">Botón</a>
</div>
```

---

## 5. GUÍAS DE ESTILO Y ESTÁNDARES

### 5.1 Convenciones de Nombres

#### HTML
```html
<!-- Clases con hyphen (kebab-case) -->
<div class="main-header">
<div class="nav-item">
<div class="dropdown-menu">

<!-- IDs con hyphen cuando es necesario -->
<div id="mainHeader">
<div id="loadingScreen">
```

#### CSS
```css
/* BEM (Block Element Modifier) */
.block {}
.block__element {}
.block--modifier {}

/* Ejemplo: -->
.nav-menu {}
.nav-menu__item {}
.nav-menu--horizontal {}

/* CamelCase para variables CSS */
--primary-color
--secondary-color
--spacing-unit
--font-size-base
```

#### JavaScript
```javascript
// camelCase para funciones y variables
function handleAccesibilityChange() {}
const toggleAccessibilityPanel = () => {}
let currentUserPreferences = {}

// PascalCase para clases
class AccessibilityManager {}

// UPPER_CASE para constantes
const API_ENDPOINT = 'https://api.example.com';
```

### 5.2 Estructura de Archivos CSS

```css
/* 1. Variables */
:root {
  --primary-color: #...;
  --text-color: #...;
}

/* 2. Reset y Base */
* { margin: 0; padding: 0; }
body { font-family: ...; }

/* 3. Layouts */
.container {}
.header {}
.main {}
.footer {}

/* 4. Componentes */
.button {}
.card {}
.modal {}

/* 5. Utilidades */
.text-center {}
.margin-top {}
```

### 5.3 Estructura de Archivos JavaScript

```javascript
// 1. Declaración de variables y constantes
const API_KEY = '...';
let currentState = {};

// 2. Funciones auxiliares
function debounce(func, delay) {}

// 3. Inicialización de elementos del DOM
const header = document.getElementById('mainHeader');
const nav = document.querySelector('.main-nav');

// 4. Event listeners
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// 5. Función principal de inicialización
function init() {
  setupAccessibility();
  setupNavigation();
  setupSearch();
}
```

### 5.4 Estándares de Código

#### HTML
- Usar HTML semántico (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Atributos `alt` en todas las imágenes
- Usar `lazy loading` en imágenes
- Atributos `aria-label` en elementos interactivos

#### CSS
- Mobile-first approach
- Media queries para responsive
- Variables CSS para colores y tamaños
- Evitar `!important`

#### JavaScript
- Usar `const` por defecto, `let` si es necesario
- Evitar variables globales
- Comentar código complejo
- Usar async/await en lugar de callbacks
- Validar entrada de usuarios

### 5.5 Linters Utilizados

**Recomendado:**
```json
{
  "eslintConfig": {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": "eslint:recommended",
    "rules": {
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
}
```

---

## 6. APIs Y ENDPOINTS

### 6.1 APIs Externas Utilizadas

#### 6.1.1 Akros (Sistema Académico)

**Endpoints:**
- Estudiante: `https://estudiante.alzate.edu.co/`
- Docente: `https://docente.alzate.edu.co/`

**Uso en Portal:**
```html
<a href="https://estudiante.alzate.edu.co/" target="_blank">
  Sistema Estudiante
</a>
<a href="https://docente.alzate.edu.co/" target="_blank">
  Sistema Docente
</a>
```

#### 6.1.2 Google Forms (PQRSF)

**Endpoint:**
```
https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform
```

**Método:** GET (formulario embebido)

#### 6.1.3 YouTube API (Alzate Virtual)

**Endpoint:**
```
https://www.youtube.com/@alzatevirtual8374/videos
```

**Uso:**
- Canal de videos institucional
- Clases virtuales
- Eventos grabados

#### 6.1.4 APIs de Instituciones del Gobierno (Referencias)

- **Ministerio de Educación:** `https://www.mineducacion.gov.co/portal/`
- **SIMAT:** `https://www.sistemamatriculas.gov.co/simat/app`
- **ICFES:** `https://www.icfes.gov.co/`
- **Gobierno en Línea:** `https://estrategia.gobiernoenlinea.gov.co/623/w3-channel.html`

### 6.2 Rutas Locales de Contenido

**Estructura de Navegación (GET requests):**

```
/                              # Página principal
/html/historia.html            # Historia
/html/sedes.html               # Sedes general
/html/sede-san-isidro.html     # Sede específica
/html/tecnicas.html            # Medias técnicas
/html/tecnicas/pascual.html    # Técnica específica
/html/academico.html           # Modalidad académica
/html/deportes.html            # Deportes
/html/noticias.html            # Noticias
/html/calendario.html          # Calendario
/html/departamentos.html       # Departamentos
/html/planes-area.html         # Planes de área
/html/otros-servicios.html     # Servicios
/html/pre.html                 # Pre-inscripción
/html/contacto.html            # Contacto
```

### 6.3 Manejo de Formularios (POST)

**Pre-inscripción (`html/pre.html`):**
```javascript
// Formulario HTML
<form id="preInscripcionForm" method="POST" action="/api/preinscription">
  <input type="text" name="nombre" required>
  <input type="email" name="email" required>
  <select name="sede" required>
    <option>San Isidro</option>
    <option>Seguros Bolívar</option>
  </select>
  <button type="submit">Enviar</button>
</form>

// JavaScript para captura y validación
const form = document.getElementById('preInscripcionForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Validar datos
  // Enviar a servidor
});
```

**Formulario de Contacto (`html/contacto.html`):**
```javascript
<form id="contactoForm" method="POST" action="/api/contact">
  <input type="text" name="nombre" required>
  <input type="email" name="email" required>
  <textarea name="mensaje" required></textarea>
  <button type="submit">Enviar</button>
</form>
```

---

## 7. DESPLIEGUE

### 7.1 Despliegue en GitHub Pages

**Pasos:**

1. **Asegurar que el repositorio sea público**
   ```bash
   # En la página del repositorio, ir a Settings
   # Verificar que sea público
   ```

2. **Configurar GitHub Pages**
   ```bash
   # Settings > Pages
   # Source: Deploy from a branch
   # Branch: main
   # Folder: / (root)
   # Save
   ```

3. **Publicar cambios**
   ```bash
   git add .
   git commit -m "Deploy: update portal"
   git push origin main
   ```

4. **Acceder al sitio**
   ```
   https://rv3ndbm.github.io/Portal-Institucional/
   ```

### 7.2 Despliegue en Servidor Personalizado

Si se desea usar un servidor propio (Apache, Nginx, etc.):

```bash
# 1. Copiar archivos al servidor
scp -r . usuario@servidor:/var/www/portal/

# 2. Configurar Apache (httpd.conf o .htaccess)
<Directory /var/www/portal>
  Options Indexes FollowSymLinks
  AllowOverride All
  Require all granted
</Directory>

# 3. Reiniciar servicio
sudo systemctl restart apache2
```

### 7.3 CI/CD con GitHub Actions (Opcional)

**Archivo: `.github/workflows/deploy.yml`**

```yaml
name: Deploy Portal

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Validate HTML
        run: |
          for file in $(find . -name "*.html"); do
            echo "Validating $file"
          done
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 8. MANTENIMIENTO Y SOLUCIÓN DE PROBLEMAS

### 8.1 Problemas Comunes

#### **Problema 1: Las imágenes no cargan**

**Síntomas:**
- Imágenes con cruz roja
- Console muestra 404

**Soluciones:**
```javascript
// Verificar rutas relativas
// Incorrecto:
<img src="img/logo.png"> <!-- desde html/page.html -->

// Correcto:
<img src="../img/logo.png"> <!-- desde html/page.html -->

// O usar rutas absolutas desde el dominio
<img src="/img/logo.png">
```

#### **Problema 2: Estilos CSS no aplican**

**Síntomas:**
- Página sin estilos
- Layout roto

**Soluciones:**
```html
<!-- Verificar que los links de CSS estén correctos -->
<link rel="stylesheet" href="../css/styles.css">

<!-- Verificar orden de carga (especificidad) -->
<!-- 1. Variables CSS -->
<link rel="stylesheet" href="css/variables.css">
<!-- 2. Estilos generales -->
<link rel="stylesheet" href="css/styles.css">
<!-- 3. Estilos específicos -->
<link rel="stylesheet" href="css/index.css">
<!-- 4. Overrides -->
<link rel="stylesheet" href="css/custom.css">
```

#### **Problema 3: JavaScript no funciona**

**Síntomas:**
- Eventos no responden
- Errores en consola

**Soluciones:**
```javascript
// Verificar que el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
  // Código aquí
});

// Verificar selectores CSS
const element = document.getElementById('mainHeader');
if (!element) {
  console.error('Elemento no encontrado');
}

// Ver consola del navegador (F12)
console.log('Debug:', elemento);
```

#### **Problema 4: Accesibilidad no funciona**

**Síntomas:**
- Widget no aparece
- Botones no responden

**Soluciones:**
```bash
# Verificar que accessibility.js está cargado
# En DevTools, ir a Sources y buscar accessibility.js

# Limpiar localStorage
localStorage.clear();

# Recargar página
location.reload();
```

#### **Problema 5: Formulario no envía datos**

**Síntomas:**
- Datos no se guardan
- Mensaje de error confuso

**Soluciones:**
```javascript
// Validar formulario antes de enviar
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validar campos
  const inputs = form.querySelectorAll('input[required]');
  let valid = true;
  
  inputs.forEach(input => {
    if (!input.value) {
      input.classList.add('error');
      valid = false;
    }
  });
  
  if (valid) {
    // Enviar datos
    sendFormData(new FormData(form));
  }
});
```

#### **Problema 6: Sitio no responsive en móvil**

**Síntomas:**
- Layout roto en teléfono
- Elementos superpuestos

**Soluciones:**
```html
<!-- Verificar viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- CSS mobile-first -->
/* Por defecto para móvil */
.element { width: 100%; }

/* Media queries para pantallas grandes */
@media (min-width: 768px) {
  .element { width: 50%; }
}
```

#### **Problema 7: El sitio carga lento**

**Síntomas:**
- Tarda mucho en cargar
- Animaciones lentas

**Soluciones:**
```html
<!-- Optimizar imágenes -->
<img src="image.webp" loading="lazy" alt="...">

<!-- Minificar CSS y JavaScript -->
<!-- Usar CDN para librerías externas -->
<link rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/...">

<!-- Aplazar carga de scripts no críticos -->
<script src="script.js" defer></script>
```

### 8.2 Auditoría de Rendimiento

```bash
# Usar Chrome DevTools (F12)
# 1. Lighthouse - Genera reporte de rendimiento
# 2. Network - Analiza tiempo de carga
# 3. Performance - Identifica cuellos de botella

# Herramientas online
# - https://pagespeed.web.dev/
# - https://gtmetrix.com/
# - https://www.webpagetest.org/
```

### 8.3 Monitoreo

**Logs a revisar:**
- Browser Console (F12 > Console)
- Network tab (peticiones HTTP)
- Storage > localStorage (datos de usuario)

---

## 9. CONTACTO Y SOPORTE

### 9.1 Información de Contacto

**Institución:** I.E. Gilberto Alzate Avendaño

**Teléfono:** +57 1 (555) 1234

**Email:** ie.gilbertoalzate@medellin.gov.co

**Ubicación:** Medellín, Colombia

### 9.2 Redes Sociales

- **Facebook:** https://www.facebook.com/gilbertoalzate.tarde
- **Instagram:** https://www.instagram.com/elalzateviveporvos/
- **YouTube:** https://www.youtube.com/@alzatevirtual8374
- **WhatsApp:** https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508

### 9.3 Equipo de Desarrollo

**Repositorio:** https://github.com/Rv3ndbm/Portal-Institucional

**Reportar Problemas:**
1. Crear un issue en GitHub
2. Incluir descripción del problema
3. Pasos para reproducir
4. Capturas de pantalla si es necesario

### 9.4 Documentación Adicional

- **Manual de Usuario:** `manual-usuario.html`
- **Guía Rápida:** `guia-rapida.html`
- **Referencia Rápida:** `referencia-rapida.html`
- **Manuales:** `MANUALES.html`

### 9.5 Próximos Pasos y Mejoras

**Funcionalidades Futuras:**
- [ ] Backend con base de datos (Django/Flask)
- [ ] Sistema de autenticación
- [ ] Panel administrativo
- [ ] Blog dinámico
- [ ] Chat en vivo
- [ ] App móvil (React Native)
- [ ] Integración con Akros API
- [ ] Sistema de notificaciones

---

## APÉNDICES

### Apéndice A: Comandos Útiles de Git

```bash
# Clonar repositorio
git clone https://github.com/Rv3ndbm/Portal-Institucional.git

# Ver estado actual
git status

# Agregar cambios
git add .
git add archivo.html

# Hacer commit
git commit -m "Descripción del cambio"

# Enviar a GitHub
git push origin main

# Traer cambios
git pull origin main

# Ver historial
git log

# Ver diferencias
git diff

# Crear rama nueva
git branch nombre-rama
git checkout nombre-rama

# Fusionar ramas
git checkout main
git merge nombre-rama
```

### Apéndice B: Recursos de Aprendizaje

- **MDN Web Docs:** https://developer.mozilla.org/
- **W3Schools:** https://www.w3schools.com/
- **CSS Tricks:** https://css-tricks.com/
- **JavaScript.info:** https://javascript.info/
- **WCAG Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/

### Apéndice C: Herramientas Recomendadas

| Herramienta | Propósito | Enlace |
|---|---|---|
| Visual Studio Code | Editor | https://code.visualstudio.com/ |
| Git | Control versión | https://git-scm.com/ |
| Chrome DevTools | Debug | F12 en Chrome |
| Lighthouse | Auditoría | Integrado en Chrome |
| Figma | Diseño | https://figma.com/ |
| Color Picker | Colores | https://htmlcolorcodes.com/ |
| Font Awesome | Iconos | https://fontawesome.com/ |

---

**Fin del Manual del Programador**

*Documento versión 1.0 - Junio 2026*
*Última revisión: 2026-06-16*
