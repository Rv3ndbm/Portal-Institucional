# Manual del Programador - Portal I.E. Gilberto Alzate Avendaño

## 1. Información General y Arquitectura

### 1.1 Introducción
Este portal es la página web institucional de la **I.E. Gilberto Alzate Avendaño**, un colegio ubicado en Colombia. Su propósito es centralizar la información académica, administrativa y comunitaria para estudiantes, padres de familia, docentes y la comunidad en general. Es un sitio web **estático y responsive**, diseñado para ser rápido, accesible y fácil de navegar.

### 1.2 Tecnologías Utilizadas
| Categoría | Tecnología/Versión |
|-----------|---------------------|
| Lenguajes | HTML5, CSS3, JavaScript (ES6+) |
| Librerías | Font Awesome 6.4.0 (iconos) |
| Archivos | Markdown (este manual) |
| Herramientas | VS Code, Git (implícito) |
| Servicios Externos | Sistema Akros (notas), Wix (biblioteca), Google Forms (PQRSF), Canal de WhatsApp, YouTube (Alzate Virtual) |

### 1.3 Arquitectura del Sistema
Este es un **sitio web estático monolítico** (no tiene backend propio). La arquitectura se compone de:

1.  **Frontend (Interfaz de Usuario)**: Todo el código ejecutado en el navegador (HTML, CSS, JS).
2.  **Recursos Estáticos**: Imágenes, PDFs, audio (hino del colegio).
3.  **Enlaces a Servicios Externos**: Integración con plataformas de terceros para funcionalidades dinámicas (notas, biblioteca, PQRSF).

---

## 2. Configuración del Entorno de Desarrollo

### 2.1 Requisitos Previos
No hay herramientas de compilación ni gestores de paquetes complejos. Necesitas:
- Un **editor de código** (VS Code recomendado).
- Un **servidor web local** para probar la página (ej. extensión "Live Server" de VS Code, o `http-server` de Node.js).
- Un **navegador web moderno** (Chrome, Firefox, Edge, Safari).

### 2.2 Pasos de Instalación
1.  **Clonar/Copiar el Proyecto**: Descarga o copia la carpeta `Pagina GAA v22` en tu máquina local.
2.  **Abrir en Editor**: Abre la carpeta en VS Code.
3.  **Levantar Servidor Local**:
    - Usando **Live Server** (VS Code): Haz clic derecho en `index.html` y selecciona "Open with Live Server".
    - Usando **Python**: Ejecuta en la terminal:
      ```bash
      python -m http.server 8000
      ```
      Luego visita `http://localhost:8000`.

### 2.3 Ejecución
No hay comandos complejos. El sitio se ejecuta directamente en el navegador desde cualquier servidor HTTP local.

---

## 3. Estructura de Datos y del Proyecto

### 3.1 Estructura de Carpetas
```
Pagina GAA v22/
├── .vscode/                # Configuración de VS Code
├── Documentación/          # Archivos de guía (este manual, lazy loading)
├── css/                    # Hojas de estilo
│   ├── styles.css          # Estilos globales y del header
│   ├── variables.css       # Variables de color y diseño
│   ├── accessibility.css   # Estilos de accesibilidad
│   ├── index.css           # Estilos de la página de inicio
│   ├── manuales.css        # Estilos de la sección de manuales
│   ├── search.css          # Estilos del buscador
│   └── [otros].css         # Estilos específicos por página (sedes, deportes, etc.)
├── html/                   # Páginas internas
│   ├── tecnicas/           # Páginas de medias técnicas
│   │   ├── pascual.html
│   │   ├── musica.html
│   │   └── ...
│   ├── academico.html
│   ├── sedes.html
│   └── [otros].html
├── img/                    # Imágenes y recursos multimedia
├── js/                     # Lógica de JavaScript
│   ├── script.js           # Lógica principal (header, scroll, etc.)
│   ├── accessibility.js    # Lógica del widget de accesibilidad
│   ├── search-data.js      # Datos para el buscador
│   ├── search.js           # Lógica del buscador
│   └── [otros].js
├── manuales/               # Manuales de usuario
├── media/                  # Archivos de plan de área, manual de convivencia, etc.
│   └── 2026-PLANES DE AREA/
├── scratch/                # Scripts de Python para mantenimiento
├── templates/              # Plantillas (footer, etc.)
└── index.html              # Página de inicio
```

### 3.2 Modelos de Datos
No hay base de datos propia. El único "modelo" es el **índice de búsqueda** en `js/search-data.js`, que contiene información sobre páginas, sedes y documentos.

---

## 4. Componentes y Funcionalidades

### 4.1 Módulos Principales

#### 4.1.1 Header y Navegación (`js/script.js`)
- **Funcionalidad**: Menú responsive (hamburguesa en móviles), menús desplegables (dropdowns), efecto de scroll del header, fondo del header.
- **Clases Importantes**: `.main-header`, `.main-nav`, `.nav-menu`, `.dropdown-menu`.
- **Rutas Relativas**: Las páginas en subcarpetas (como `html/` o `manuales/`) usan rutas relativas (`../` para acceder a la carpeta raíz).

#### 4.1.2 Buscador (`js/search.js` y `js/search-data.js`)
- **Funcionalidad**: Búsqueda en tiempo real de palabras clave en páginas, sedes y documentos.
- **Datos**: `js/search-data.js` contiene un array `searchIndex` con objetos `{ title, description, url, type }`.

#### 4.1.3 Widget de Accesibilidad (`js/accessibility.js` y `css/accessibility.css`)
- **Funcionalidad**: Botón flotante con opciones para:
  - Aumentar/disminuir texto
  - Cambiar contraste (negro/blanco)
  - Activar fuente para dislexia
  - Cambiar a escala de grises

#### 4.1.4 Pantalla de Carga (`index.html` y CSS)
- **Funcionalidad**: Muestra un loader animado mientras se carga la página. Se oculta automáticamente cuando el DOM está listo.

### 4.2 Guía de Estilo y Estándares
- **Nomenclatura de Clases**: Uso de `kebab-case` (ej. `.main-header`, `.nav-link`).
- **Variables CSS**: Todas las variables globales están en `css/variables.css` (colores, fuentes, radio de bordes).
- **Indentación**: 4 espacios en HTML, CSS y JS.
- **HTML Semántico**: Uso de `<header>`, `<nav>`, `<main>`, `<footer>`.

---

## 5. Pruebas y Despliegue

### 5.1 Pruebas (Testing)
- **Pruebas Manuales**:
  1. Probar la **responsividad** en diferentes tamaños de pantalla (móvil, tablet, desktop).
  2. Verificar que todos los **enlaces** funcionen (incluyendo a servicios externos).
  3. Probar el **buscador** con diferentes términos.
  4. Verificar que el **widget de accesibilidad** funcione correctamente.

### 5.2 Despliegue (Deployment)
Este es un sitio estático, por lo que se puede alojar en cualquier servicio de hosting web:
1.  **Alojamiento Local/Servidor**: Copia toda la carpeta a tu servidor web (Apache, Nginx, etc.).
2.  **Alojamiento Gratuito**:
    - **GitHub Pages**: Sube el repositorio a GitHub y habilita GitHub Pages.
    - **Netlify/Vercel**: Arrastra y suelta la carpeta.
3.  **Archivos Importantes**: Asegúrate de subir **todos** los archivos (css, js, img, media, etc.).

---

## 6. Mantenimiento y Solución de Problemas

### 6.1 Errores Comunes (Troubleshooting)

| Problema | Causa | Solución |
|----------|-------|----------|
| Las imágenes no cargan | Ruta incorrecta (falta `../` en subcarpetas) | Verifica las rutas relativas en `<img src="...">` y `<link href="...">`. |
| El menú no aparece en manuales | Header no está sincronizado | Asegúrate de que todas las páginas de `/manuales/` tengan el mismo header que `index.html`. |
| El buscador no encuentra resultados | `searchIndex` no está actualizado | Añade nuevas páginas/documentos a `js/search-data.js`. |
| El botón "Volver" en manuales se oculta | `padding-top` del body es insuficiente | Ajusta el valor de `padding-top` en `css/manuales.css` para `body.manual-page`. |

### 6.2 Scripts de Mantenimiento (Carpeta `scratch/`)
Hay scripts de Python en la carpeta `scratch/` para automatizar tareas:
- `fix_html.py`: Ajusta headers/footers.
- `compare_headers.py`: Compara headers entre archivos.
- `check_all_headers.py`: Verifica consistencia de headers.

### 6.3 Contacto de Mantenimiento
Para soporte o consultas, contacta al equipo de desarrollo de la institución.

---

## Changelog
- **2026-06-16**: Creación del manual del programador.
