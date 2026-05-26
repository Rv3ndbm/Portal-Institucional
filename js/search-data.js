// ============================================================
// SEARCH-DATA.JS — Índice de búsqueda del sitio
// I.E. Gilberto Alzate Avendaño
// Agregar nuevas páginas aquí para que aparezcan en el buscador
// ============================================================

const SEARCH_INDEX = [

    // ── INICIO ──────────────────────────────────────────────
    {
        titulo: "Inicio",
        url: "index.html",
        keywords: [
            "inicio", "home", "pagina principal", "principal", "bienvenidos",
            "gilberto alzate", "alzate", "institucion", "colegio", "ie", "gaa"
        ]
    },

    // ── HISTORIA ─────────────────────────────────────────────
    {
        titulo: "Nuestra Historia",
        url: "historia.html",
        keywords: [
            "historia", "fundacion", "anos", "decadas", "origen", "resena",
            "quienes somos", "mision", "vision", "valores", "identidad",
            "fundadores", "trayectoria", "institucional", "pasado", "logros"
        ]
    },

    // ── NOTICIAS ─────────────────────────────────────────────
    {
        titulo: "Noticias",
        url: "noticias.html",
        keywords: [
            "noticias", "novedades", "actualidad", "eventos recientes", "blog",
            "anuncios", "comunicados", "informacion", "articulos", "prensa"
        ]
    },

    // ── SEDES ────────────────────────────────────────────────
    {
        titulo: "Nuestras Sedes",
        url: "sedes.html",
        keywords: [
            "sedes", "campus", "ubicaciones", "instalaciones", "puntos",
            "cobertura", "donde estamos", "mapa"
        ]
    },
    {
        titulo: "Sede San Isidro",
        url: "sede-san-isidro.html",
        keywords: [
            "san isidro", "sede san isidro", "primaria", "basica primaria",
            "ninos", "pequenos", "san isidro sede"
        ]
    },
    {
        titulo: "Sede Seguros Bolívar",
        url: "sede-seguros-bolivar.html",
        keywords: [
            "seguros bolivar", "sede seguros bolivar", "bolivar", "seguros",
            "primaria", "valores", "convivencia"
        ]
    },
    {
        titulo: "Sede Tomás Carrasquilla",
        url: "sede-tomas-carrasquilla.html",
        keywords: [
            "tomas carrasquilla", "carrasquilla", "sede carrasquilla",
            "primaria", "lectura", "escritura", "literatura"
        ]
    },
    {
        titulo: "Sede Carlos Villa",
        url: "sede-carlos-villa.html",
        keywords: [
            "carlos villa", "sede carlos villa", "villa", "inclusion",
            "diversidad", "equidad", "primaria"
        ]
    },
    {
        titulo: "Sede Central",
        url: "sede-central.html",
        keywords: [
            "sede central", "central", "bachillerato", "secundaria",
            "campus principal", "medias tecnicas", "lideres"
        ]
    },

    // ── DEPARTAMENTOS ────────────────────────────────────────
    {
        titulo: "Departamentos",
        url: "departamentos.html",
        keywords: [
            "departamentos", "areas", "equipo directivo", "administrativo",
            "coordinacion", "rectoria", "psicologia", "personal", "docentes"
        ]
    },
    {
        titulo: "Coordinación",
        url: "departamentos.html#coordinacion",
        keywords: [
            "coordinacion", "coordinador", "disciplina", "convivencia escolar",
            "normas", "reglamento interno", "faltas", "comportamiento"
        ]
    },
    {
        titulo: "Rectoría",
        url: "departamentos.html#rectoria",
        keywords: [
            "rectoria", "rector", "directivos", "direccion", "liderazgo",
            "administracion", "gestion directiva", "jefe"
        ]
    },
    {
        titulo: "Psicología",
        url: "departamentos.html#psicologia",
        keywords: [
            "psicologia", "psicologo", "orientacion escolar", "bienestar",
            "apoyo emocional", "salud mental", "consejeria", "orientador"
        ]
    },

    // ── MEDIAS TÉCNICAS ──────────────────────────────────────
    {
        titulo: "Medias Técnicas",
        url: "tecnicas.html",
        keywords: [
            "medias tecnicas", "tecnicas", "formacion tecnica", "articulacion",
            "sena", "pascual bravo", "habilidades", "competencias laborales",
            "especializaciones", "media vocacional", "grado 10", "grado 11"
        ]
    },
    {
        titulo: "Programación de Software — Pascual Bravo",
        url: "tecnicas/pascual.html",
        keywords: [
            "programacion", "software", "pascual bravo", "sistemas", "desarrollo",
            "programas", "codigo", "tecnologia", "informatica", "computacion",
            "app", "aplicaciones", "desarrollo de software", "programador"
        ]
    },
    {
        titulo: "Música",
        url: "tecnicas/musica.html",
        keywords: [
            "musica", "arte", "canto", "instrumentos", "musicos", "banda",
            "coro", "guitarra", "piano", "armonia", "teoria musical", "conservatorio"
        ]
    },
    {
        titulo: "Gestión Ambiental",
        url: "tecnicas/ambiental.html",
        keywords: [
            "ambiental", "gestion ambiental", "medio ambiente", "ecologia",
            "sostenibilidad", "reciclaje", "naturaleza", "recurso natural",
            "educacion ambiental", "verde", "planeta"
        ]
    },
    {
        titulo: "Contenidos Digitales",
        url: "tecnicas/contenidos.html",
        keywords: [
            "contenidos digitales", "diseno", "multimedia", "comunicacion digital",
            "redes sociales", "produccion audiovisual", "video", "fotografia",
            "marketing digital", "creacion de contenido", "medios"
        ]
    },
    {
        titulo: "SENA",
        url: "tecnicas/sena.html",
        keywords: [
            "sena", "servicio nacional de aprendizaje", "certificado sena",
            "tecnico sena", "articulacion sena", "formacion para el trabajo",
            "competencias laborales", "certificacion"
        ]
    },

    // ── ACADÉMICO ────────────────────────────────────────────
    {
        titulo: "Académico",
        url: "academico.html",
        keywords: [
            "academico", "sistema academico", "akros", "notas", "calificaciones",
            "boletin", "plataforma", "rendimiento", "evaluacion", "logros academicos"
        ]
    },
    {
        titulo: "Planes de Área",
        url: "planes-area.html",
        keywords: [
            "planes de area", "mallas curriculares", "planificacion", "curriculo",
            "materias", "asignaturas", "objetivos de aprendizaje", "recursos pedagogicos",
            "matematicas", "ciencias", "sociales", "tecnologia", "artistica", "etica",
            "religion", "educacion fisica", "humanidades", "filosofia", "brujula"
        ]
    },
    {
        titulo: "Sistema Estudiante (Akros)",
        url: "https://estudiante.alzate.edu.co/",
        keywords: [
            "sistema estudiante", "akros estudiante", "notas", "calificaciones",
            "boletin virtual", "ingresar estudiante", "portal estudiante", "login"
        ]
    },
    {
        titulo: "Sistema Docente (Akros)",
        url: "https://docente.alzate.edu.co/",
        keywords: [
            "sistema docente", "akros docente", "portal docente", "ingresar docente",
            "registro notas", "plataforma docente", "login docente"
        ]
    },

    // ── CALENDARIO ───────────────────────────────────────────
    {
        titulo: "Calendario y Eventos",
        url: "calendario.html",
        keywords: [
            "calendario", "eventos", "agenda", "fechas", "actividades",
            "anuario", "jornadas", "fechas importantes", "izar bandera",
            "izadas", "dia del logro", "vacaciones", "semanas"
        ]
    },

    // ── DEPORTES ─────────────────────────────────────────────
    {
        titulo: "Deportes y Bienestar",
        url: "deportes.html",
        keywords: [
            "deportes", "deporte", "futbol", "athletics", "atletismo", "baloncesto",
            "voleibol", "voleyball", "basquet", "natacion", "bienestar", "salud",
            "entrenamiento", "campeonatos", "torneos", "equipo", "seleccion"
        ]
    },

    // ── DOCUMENTOS ───────────────────────────────────────────
    {
        titulo: "Documentos",
        url: "documentos.html",
        keywords: [
            "documentos", "guias", "instructivos", "formatos", "formularios",
            "descargas", "archivos", "informes", "circulares", "actas", "manuales"
        ]
    },

    // ── ORIENTACIÓN TÉCNICA ──────────────────────────────────
    {
        titulo: "Orientación Técnica",
        url: "orientacion_tecnica.html",
        keywords: [
            "orientacion tecnica", "orientacion", "vocacional", "proyecto de vida",
            "career", "guia vocacional", "carrera", "futuro", "eleccion"
        ]
    },

    // ── OTROS SERVICIOS ──────────────────────────────────────
    {
        titulo: "Otros Servicios",
        url: "otros-servicios.html",
        keywords: [
            "servicios", "otros servicios", "comunidad", "educativa", "escuela de padres",
            "padres", "servicio social", "bienestar estudiantil"
        ]
    },
    {
        titulo: "Pre-Inscripción / Matrícula",
        url: "pre.html",
        keywords: [
            "preinscripcion", "inscripcion", "matricula", "ingresar", "nuevo estudiante",
            "admisiones", "cupo", "formulario matricula", "enrolamiento", "candidatos"
        ]
    },
    {
        titulo: "Contacto",
        url: "contacto.html",
        keywords: [
            "contacto", "contactanos", "escribirnos", "telefono", "correo",
            "email", "donde encontrarnos", "ubicacion", "atencion", "soporte", "pqrsf"
        ]
    },
    {
        titulo: "Biblioteca",
        url: "https://luisarango64.wixsite.com/bibliositio",
        keywords: [
            "biblioteca", "libros", "lectura", "prestamo de libros", "recursos bibliograficos",
            "sala de lectura", "catalogo", "bibliositio"
        ]
    },
    {
        titulo: "Manual de Convivencia",
        url: "https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf",
        keywords: [
            "manual", "convivencia", "normas", "reglamento", "conducto regular",
            "manual de convivencia", "reglas", "derechos", "deberes", "disciplina"
        ]
    },
    {
        titulo: "Formulario PQRSF",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform",
        keywords: [
            "pqrsf", "peticion", "queja", "reclamo", "solicitud", "felicitacion",
            "pqr", "denuncia", "sugerencia", "atencion al ciudadano"
        ]
    },
    {
        titulo: "Alzate Virtual (YouTube)",
        url: "https://www.youtube.com/@alzatevirtual8374/videos",
        keywords: [
            "alzate virtual", "youtube", "videos", "clases virtuales", "canal",
            "canal youtube", "online", "virtual", "contenidos en linea"
        ]
    },
    {
        titulo: "Canal Institucional (WhatsApp)",
        url: "https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508",
        keywords: [
            "whatsapp", "canal whatsapp", "canal institucional", "comunicados",
            "mensajes", "novedades whatsapp", "difusion"
        ]
    }

];
