// ============================================================
// SEARCH-DATA.JS — Índice de búsqueda enriquecido y optimizado
// I.E. Gilberto Alzate Avendaño
// Copywriting Premium: Incluye descripciones dinámicas y un vocabulario extendido
// ============================================================

const SEARCH_INDEX = [

    // ── INICIO ──────────────────────────────────────────────
    {
        titulo: "Inicio / Página Principal",
        descripcion: "Portal oficial de la Institución Educativa Gilberto Alzate Avendaño. Banners principales, accesos rápidos y novedades de nuestra comunidad educativa.",
        url: "index.html",
        keywords: [
            "inicio", "home", "pagina principal", "principal", "bienvenidos", "portal", "web",
            "gilberto alzate avendaño", "alzate", "institucion educativa", "colegio", "ie", "gaa",
            "institucional", "noticias destacadas", "secciones principales", "aranjuez", "medellin"
        ]
    },

    // ── HISTORIA ─────────────────────────────────────────────
    {
        titulo: "Nuestra Historia e Identidad",
        descripcion: "Conoce el origen, fundación, misión y visión del Gilberto Alzate Avendaño. Explora nuestro escudo, bandera, himno y los valores institucionales que nos guían.",
        url: "historia.html",
        keywords: [
            "historia", "fundacion", "anos", "decadas", "origen", "resena", "biografia",
            "quienes somos", "mision", "vision", "valores", "identidad", "filosofia",
            "fundadores", "trayectoria", "institucional", "pasado", "logros", "himno",
            "escudo", "bandera", "simbolos", "orgullo alzateño", "principios", "respeto"
        ]
    },

    // ── NOTICIAS ─────────────────────────────────────────────
    {
        titulo: "Noticias y Novedades",
        descripcion: "Actualidad escolar, circulares de interés, comunicados oficiales de rectoría y crónicas sobre eventos y logros de nuestros estudiantes.",
        url: "noticias.html",
        keywords: [
            "noticias", "novedades", "actualidad", "eventos recientes", "blog", "actividades",
            "anuncios", "comunicados", "informacion", "articulos", "prensa", "circulares",
            "avisos", "comunidad", "eventos", "fechas", "ultimo momento", "boletines"
        ]
    },

    // ── DOCUMENTOS Y CIRCULARES ──────────────────────────────
    {
        titulo: "Circulares y Documentos Oficiales",
        descripcion: "Repositorio institucional para consultar y descargar circulares de rectoría, formatos de matrícula, resoluciones y documentos curriculares en PDF.",
        url: "documentos.html",
        keywords: [
            "documentos", "circulares", "formatos", "matriculas", "resoluciones", "pdf",
            "descargas", "rectoria", "secretaria", "constancias", "autorizaciones", "planes",
            "archivos", "papeles", "descargar circular", "comunicado oficial", "institucionales"
        ]
    },

    // ── SEDES ────────────────────────────────────────────────
    {
        titulo: "Nuestras Sedes Educativas",
        descripcion: "Explora la infraestructura de las 5 sedes que componen nuestra institución educativa, ofreciendo cobertura desde preescolar y primaria hasta bachillerato y media técnica.",
        url: "sedes.html",
        keywords: [
            "sedes", "campus", "ubicaciones", "instalaciones", "puntos", "aulas", "salones",
            "cobertura", "donde estamos", "mapa", "colegios", "escuelas", "direccion sedes",
            "sede san isidro", "sede seguros bolivar", "sede tomas carrasquilla", "sede carlos villa", "sede central"
        ]
    },
    {
        titulo: "Sede San Isidro (Primaria)",
        descripcion: "Sede enfocada en la educación básica primaria, preescolar y los primeros años de formación bajo metodologías lúdicas y formativas.",
        url: "sede-san-isidro.html",
        keywords: [
            "san isidro", "sede san isidro", "primaria", "basica primaria", "preescolar",
            "ninos", "pequenos", "primeros grados", "transicion", "jardin", "sede infantil",
            "aranjuez san isidro", "recreo", "docentes primaria"
        ]
    },
    {
        titulo: "Sede Seguros Bolívar (Primaria)",
        descripcion: "Sede escolar de básica primaria destacada por su fuerte enfoque en la convivencia, valores humanos y actividades artísticas básicas.",
        url: "sede-seguros-bolivar.html",
        keywords: [
            "seguros bolivar", "sede seguros bolivar", "bolivar", "seguros", "convivencia",
            "primaria", "valores", "formacion ciudadana", "recreacion", "escuela bolivar",
            "clases primaria", "patio de juegos"
        ]
    },
    {
        titulo: "Sede Tomás Carrasquilla (Primaria)",
        descripcion: "Fomentando el amor por la literatura, lectura y escritura creativa desde la básica primaria en un ambiente acogedor y dinámico.",
        url: "sede-tomas-carrasquilla.html",
        keywords: [
            "tomas carrasquilla", "carrasquilla", "sede carrasquilla", "sede tomas",
            "primaria", "lectura", "escritura", "literatura", "biblioteca infantil",
            "comprension lectora", "cuentos", "ortografia", "primaria tomas carrasquilla"
        ]
    },
    {
        titulo: "Sede Carlos Villa (Inclusión y Primaria)",
        descripcion: "Modelo de educación inclusiva y equitativa para básica primaria, adaptando procesos para estudiantes con diversas necesidades de aprendizaje.",
        url: "sede-carlos-villa.html",
        keywords: [
            "carlos villa", "sede carlos villa", "villa", "inclusion", "diversidad",
            "equidad", "primaria", "necesidades educativas especiales", "nee", "apoyo pedagogo",
            "psicopedagogia", "aula inclusiva", "respeto a la diferencia"
        ]
    },
    {
        titulo: "Sede Central (Bachillerato y Media Técnica)",
        descripcion: "Campus principal que alberga el bachillerato (secundaria), la media académica y las especialidades de media técnica. Núcleo administrativo de la institución.",
        url: "sede-central.html",
        keywords: [
            "sede central", "central", "bachillerato", "secundaria", "media academica",
            "campus principal", "medias tecnicas", "lideres", "laboratorios", "rectoria central",
            "secretaria", "grados superiores", "decimo", "once", "noveno", "bachilleres"
        ]
    },

    // ── DEPENDENCIAS ────────────────────────────────────────
    {
        titulo: "Dependencias y Gestión Directiva",
        descripcion: "Organigrama de la institución. Conoce el equipo administrativo, directivos docentes, rectoría, secretaría y los coordinadores de convivencia y académicos.",
        url: "dependencias.html",
        keywords: [
            "dependencias", "departamentos", "areas", "equipo directivo", "administrativo", "organigrama",
            "coordinacion", "rectoria", "personal", "docentes", "secretaria", "tesoreria",
            "auxiliares", "atencion al publico", "directivos", "gobierno escolar"
        ]
    },
    {
        titulo: "Coordinación Convivencial y Académica",
        descripcion: "Normas de convivencia escolar, acompañamiento pedagógico, reglamento interno (Manual) y procesos de mediación de conflictos.",
        url: "dependencias.html#coordinacion",
        keywords: [
            "coordinacion", "coordinador", "disciplina", "convivencia escolar", "normas",
            "reglamento interno", "faltas", "comportamiento", "sanciones", "conducto regular",
            "mediacion de conflictos", "citacion de acudientes", "permisos", "asistencia"
        ]
    },
    {
        titulo: "Rectoría y Liderazgo Institucional",
        descripcion: "Gestión directiva, presupuestal e institucional liderada por la rectoría. Proyectos de desarrollo y alianzas de la I.E. Gilberto Alzate Avendaño.",
        url: "dependencias.html#rectoria",
        keywords: [
            "rectoria", "rector", "directivos", "direccion", "liderazgo", "administracion",
            "gestion directiva", "jefe", "presupuestos", "resoluciones", "decretos",
            "alianzas estrategicas", "firma convenios", "representante legal"
        ]
    },

    // ── MEDIAS TÉCNICAS ──────────────────────────────────────
    {
        titulo: "Programas de Media Técnica",
        descripcion: "Formación especializada para el empleo en grados 10° y 11°. Convenios con SENA e Institución Universitaria Pascual Bravo en tecnología, música y ambiente.",
        url: "tecnicas.html",
        keywords: [
            "medias tecnicas", "tecnicas", "formacion tecnica", "articulacion sena", "pascual bravo",
            "habilidades", "competencias laborales", "especializaciones", "media vocacional",
            "grado 10", "grado 11", "practicas profesionales", "proyecto de grado", "empleabilidad",
            "desarrollo software", "programacion", "musica", "monitoreo ambiental", "contenidos digitales"
        ]
    },
    {
        titulo: "Media Técnica: Desarrollo de Software (Pascual Bravo)",
        descripcion: "Especialidad en programación, creación de aplicaciones web, bases de datos y lógica de sistemas en articulación con el Pascual Bravo.",
        url: "tecnicas/pascual.html",
        keywords: [
            "programacion", "software", "pascual bravo", "sistemas", "desarrollo",
            "programas", "codigo", "tecnologia", "informatica", "computacion", "javascript", "html",
            "app", "aplicaciones", "desarrollo de software", "programador", "bases de datos", "sql"
        ]
    },
    {
        titulo: "Media Técnica: Ejecución Musical y Sonido",
        descripcion: "Desarrollo artístico en interpretación instrumental, técnica vocal, producción de audio, composición y ensamble musical.",
        url: "tecnicas/musica.html",
        keywords: [
            "musica", "arte", "canto", "instrumentos", "musicos", "banda", "instrumentacion",
            "coro", "guitarra", "piano", "armonia", "teoria musical", "conservatorio", "sonido",
            "produccion musical", "ensamble", "percusion", "vientos", "audicion"
        ]
    },
    {
        titulo: "Media Técnica: Monitoreo y Gestión Ambiental (SENA)",
        descripcion: "Formación en conservación ecológica, manejo de residuos, muestreo de agua y suelos, y desarrollo sostenible avalado por el SENA.",
        url: "tecnicas/ambiental.html",
        keywords: [
            "ambiental", "gestion ambiental", "medio ambiente", "ecologia", "monitoreo ambiental",
            "sostenibilidad", "reciclaje", "naturaleza", "recurso natural", "sena ambiental",
            "educacion ambiental", "verde", "planeta", "residuos", "muestreo de agua", "suelos"
        ]
    },
    {
        titulo: "Media Técnica: Creación de Contenidos Digitales",
        descripcion: "Diseño gráfico, producción audiovisual, animación, fotografía y estrategias de marketing y comunicación digital para medios modernos.",
        url: "tecnicas/contenidos.html",
        keywords: [
            "contenidos digitales", "diseno", "multimedia", "comunicacion digital", "estrategia",
            "redes sociales", "produccion audiovisual", "video", "fotografia", "camaras", "audio",
            "marketing digital", "creacion de contenido", "medios", "edicion de video", "photoshop"
        ]
    },
    {
        titulo: "Articulación SENA (Doble Titulación)",
        descripcion: "Convenio nacional que permite a nuestros estudiantes egresar como Bachilleres Técnicos certificados formalmente por el SENA.",
        url: "tecnicas/sena.html",
        keywords: [
            "sena", "servicio nacional de aprendizaje", "certificado sena", "sofia plus",
            "tecnico sena", "articulacion sena", "formacion para el trabajo", "etapa practica",
            "competencias laborales", "certificacion", "doble titulacion sena"
        ]
    },

    // ── ACADÉMICO ────────────────────────────────────────────
    {
        titulo: "Plataforma y Gestión Académica",
        descripcion: "Acceso al sistema de notas, boletines escolares, reportes de evaluación del aprendizaje y consultas administrativas para padres y estudiantes.",
        url: "academico.html",
        keywords: [
            "academico", "sistema academico", "akros", "notas", "calificaciones", "docente",
            "boletin", "plataforma", "rendimiento", "evaluacion", "logros academicos", "fallas",
            "inasistencias", "recuperaciones", "periodo academico", "tareas", "aula virtual"
        ]
    },
    {
        titulo: "Planes de Área y Mallas Curriculares",
        descripcion: "Estructura pedagógica y planes de estudio detallados de cada asignatura. Descarga los documentos de planificación curricular actualizados.",
        url: "planes-area.html",
        keywords: [
            "planes de area", "mallas curriculares", "planificacion", "curriculo", "mallas",
            "materias", "asignaturas", "objetivos de aprendizaje", "recursos pedagogicos",
            "matematicas", "ciencias naturales", "ciencias sociales", "tecnologia e informatica",
            "artistica", "etica y valores", "religion", "educacion fisica", "humanidades",
            "lengua castellana", "ingles", "filosofia", "brujula", "aceleracion aprendizaje"
        ]
    },
    {
        titulo: "Plan de Área: Matemáticas",
        descripcion: "Consulte la malla curricular de Pensamiento Matemático. Resolución de problemas y razonamiento lógico-matemático.",
        url: "planes-area.html#matematicas",
        keywords: ["matematicas", "plan de area matematicas", "pensamiento matematico", "malla matematicas", "algebra", "geometria", "trigonometria", "calculo", "aritmetica"]
    },
    {
        titulo: "Plan de Área: Lengua Castellana (Humanidades)",
        descripcion: "Estructura académica de Humanidades y Lengua Castellana. Fomento de competencias lecto-escritoras y análisis literario.",
        url: "planes-area.html#humanidades",
        keywords: ["lengua castellana", "humanidades", "plan de area humanidades", "malla humanidades", "español", "castellano", "literatura", "lectura", "ortografia", "redaccion"]
    },
    {
        titulo: "Plan de Área: Ciencias Naturales",
        descripcion: "Consulte el plan de estudios de Ciencias Naturales, Biología, Química y Física. Investigación científica escolar.",
        url: "planes-area.html#ciencias-naturales",
        keywords: ["ciencias naturales", "biologia", "quimica", "fisica", "plan de area ciencias", "malla ciencias naturales", "laboratorio", "experimentos", "ecologia"]
    },
    {
        titulo: "Plan de Área: Ciencias Sociales",
        descripcion: "Malla curricular de Ciencias Sociales, Historia, Geografía y Democracia. Formación ciudadana.",
        url: "planes-area.html#ciencias-sociales",
        keywords: ["ciencias sociales", "sociales", "historia", "geografia", "democracia", "plan de area sociales", "malla sociales", "constitucion", "civica"]
    },
    {
        titulo: "Plan de Área: Tecnología e Informática",
        descripcion: "Plan de estudios en competencias digitales, sistemas informáticos y pensamiento computacional.",
        url: "planes-area.html#tecnologia",
        keywords: ["tecnologia", "computacion", "informatica", "sistemas", "plan de area tecnologia", "malla tecnologia", "computacion", "paquete office", "internet", "computador"]
    },
    {
        titulo: "Plan de Área: Educación Física",
        descripcion: "Malla curricular enfocada en la salud corporal, recreación, deportes y desarrollo motor.",
        url: "planes-area.html#educacion-fisica",
        keywords: ["educacion fisica", "gimnasia", "deportes", "plan de area educacion fisica", "malla educacion fisica", "recreacion", "ejercicio", "salud corporal"]
    },
    {
        titulo: "Plan de Área: Educación Artística",
        descripcion: "Malla de estudio enfocada en el desarrollo de la creatividad, artes plásticas, dibujo y expresión estética.",
        url: "planes-area.html#artistica",
        keywords: ["artistica", "educacion artistica", "dibujo", "pintura", "artes plasticas", "plan de area artistica", "malla artistica", "creatividad", "expresion"]
    },
    {
        titulo: "Plan de Área: Ética y Valores",
        descripcion: "Formación en valores éticos, morales, autoestima y sana convivencia ciudadana.",
        url: "planes-area.html#etica",
        keywords: ["etica", "valores", "etica y valores", "plan de area etica", "malla etica", "moral", "respeto", "autoestima", "derechos humanos"]
    },
    {
        titulo: "Plan de Área: Filosofía",
        descripcion: "Desarrollo del pensamiento crítico, análisis de textos filosóficos e historia de las ideas.",
        url: "planes-area.html#filosofia",
        keywords: ["filosofia", "plan de area filosofia", "malla filosofia", "pensamiento critico", "reflexion", "epistemologia", "argumentacion"]
    },
    {
        titulo: "Plan de Área: Educación Religiosa (ERE)",
        descripcion: "Estudio de las manifestaciones espirituales, respeto a la libertad de cultos y valores religiosos.",
        url: "planes-area.html#religion",
        keywords: ["religion", "educacion religiosa", "ere", "plan de area religion", "malla religion", "espiritualidad", "culto", "fe", "valores morales"]
    },
    {
        titulo: "Plan de Área: Brújula",
        descripcion: "Plan de aceleración del aprendizaje escolar para estudiantes en extraedad.",
        url: "planes-area.html#brujula",
        keywords: ["brujula", "plan de area brujula", "malla brujula", "aceleracion del aprendizaje", "extraedad", "nivelacion escolar", "pedagogia"]
    },
    {
        titulo: "Sistema Estudiante (Portal Akros)",
        descripcion: "Acceso directo para estudiantes al portal Akros. Consulta tus notas por período, inasistencias y descarga de boletines de calificaciones.",
        url: "https://estudiante.alzate.edu.co/",
        keywords: [
            "sistema estudiante", "akros estudiante", "notas", "calificaciones", "plataforma akros",
            "boletin virtual", "ingresar estudiante", "portal estudiante", "login", "boletines"
        ]
    },
    {
        titulo: "Sistema Docente (Portal Akros)",
        descripcion: "Acceso exclusivo para profesores. Subida de notas, reportes de asistencia, planeador de clases y seguimiento del rendimiento escolar.",
        url: "https://docente.alzate.edu.co/",
        keywords: [
            "sistema docente", "akros docente", "portal docente", "ingresar docente", "evaluar",
            "registro notas", "plataforma docente", "login docente", "asistencia docente"
        ]
    },

    // ── CALENDARIO ───────────────────────────────────────────
    {
        titulo: "Calendario Escolar y Agenda de Eventos",
        descripcion: "Entérate de las próximas actividades, izadas de bandera, reuniones de padres de familia, semanas de receso y vacaciones escolares del año en curso.",
        url: "calendario.html",
        keywords: [
            "calendario", "eventos", "agenda", "fechas", "actividades", "cronograma",
            "anuario", "jornadas", "fechas importantes", "izar bandera", "civicos",
            "izadas", "dia del logro", "vacaciones", "semanas", "recesos", "dia e"
        ]
    },

    // ── DEPORTES ─────────────────────────────────────────────
    {
        titulo: "Deportes, Recreación y Bienestar",
        descripcion: "Actividades recreativas, torneos intercolegiados, selecciones deportivas de fútbol, baloncesto y voleibol, y hábitos de vida saludable.",
        url: "deportes.html",
        keywords: [
            "deportes", "deporte", "futbol", "microfutbol", "atletismo", "baloncesto", "salud",
            "voleibol", "voleyball", "basquet", "natacion", "bienestar", "estilo de vida",
            "entrenamiento", "campeonatos", "torneos", "equipo", "seleccion", "educacion fisica"
        ]
    },

    // ── ORIENTACIÓN TÉCNICA Y PSICOORIENTACIÓN ────────────────
    {
        titulo: "Orientación Escolar y Vocacional",
        descripcion: "Apoyo psicológico y pedagógico para estudiantes. Orientación profesional, talleres de proyecto de vida y pautas de salud mental.",
        url: "orientacion_tecnica.html",
        keywords: [
            "orientacion tecnica", "orientacion", "vocacional", "proyecto de vida", "psicologia",
            "apoyo psicologico", "talleres de vida", "consejo", "salud mental", "bienestar",
            "orientadora", "orientador escolar", "futuro laboral", "eleccion de carrera"
        ]
    },

    // ── OTROS SERVICIOS ──────────────────────────────────────
    {
        titulo: "Otros Servicios a la Comunidad",
        descripcion: "Servicio social estudiantil, restaurante escolar (PAE), transporte escolar, enfermería, programas de acompañamiento a familias (Escuela de Padres) y centro de descargas de documentos institucionales.",
        url: "otros-servicios.html",
        keywords: [
            "servicios", "otros servicios", "comunidad", "educativa", "escuela de padres",
            "padres", "servicio social", "bienestar estudiantil", "pae", "restaurante escolar",
            "alimentacion escolar", "transporte", "ruta escolar", "enfermeria", "apoyo social",
            "documentos", "guias", "instructivos", "formatos", "formularios", "pdf",
            "descargas", "archivos", "informes", "circulares", "actas", "manuales",
            "peticiones", "carta de solicitud", "constancia de estudio"
        ]
    },
    {
        titulo: "Servicio de Biblioteca Escolar",
        descripcion: "Acceso al catálogo de libros físicos y recursos literarios del portal Wix de la biblioteca de nuestra I.E.",
        url: "otros-servicios.html#biblioteca",
        keywords: ["biblioteca", "libros", "prestamo de libros", "wix biblioteca", "bibliositio", "lectura", "club de lectura", "consulta de textos"]
    },
    {
        titulo: "Descarga: Manual de Convivencia Escolar",
        descripcion: "Acceso directo a la descarga y visualización en PDF del Manual de Convivencia vigente de la institución.",
        url: "otros-servicios.html#manual-convivencia",
        keywords: ["manual de convivencia", "convivencia", "reglamento", "normas", "deberes", "derechos", "compromiso", "descargar manual", "pdf manual"]
    },
    {
        titulo: "Documento: Proyecto Educativo Institucional (PEI)",
        descripcion: "Visualice o descargue el PEI de la institución que contiene nuestra ruta pedagógica y organizativa.",
        url: "otros-servicios.html#pei",
        keywords: ["pei", "proyecto educativo institucional", "mision", "vision", "modelo pedagogico", "descargar pei", "pdf pei", "filosofia institucional"]
    },
    {
        titulo: "Formulario de PQRSF Directo",
        descripcion: "Presente de forma oficial solicitudes, quejas, reclamos, sugerencias o felicitaciones a los directivos.",
        url: "otros-servicios.html#pqrsf",
        keywords: ["pqrsf", "quejas", "reclamos", "solicitudes", "peticiones", "felicitaciones", "formulario pqrsf", "buzon virtual"]
    },
    {
        titulo: "Plataforma Alzate Virtual (Multimedia)",
        descripcion: "Canal interactivo de videos educativos y crónicas audiovisuales institucionales en YouTube.",
        url: "otros-servicios.html#alzate-virtual",
        keywords: ["alzate virtual", "videos", "youtube", "tutoriales", "clases online", "multimedia", "canal del colegio"]
    },
    {
        titulo: "Inscripciones y Preinscripción de Estudiantes",
        descripcion: "Formulario para postularse a cupos nuevos en la institución para el año lectivo actual.",
        url: "otros-servicios.html#preinscripcion",
        keywords: ["preinscripcion", "inscripciones", "cupos nuevos", "admisiones", "matricularse", "formulario inscripcion"]
    },
    {
        titulo: "Canal Institucional de WhatsApp (Notificaciones)",
        descripcion: "Siga nuestro canal oficial para enterarse al instante de reuniones, suspensiones y avisos directos en su móvil.",
        url: "otros-servicios.html#canal-whatsapp",
        keywords: ["whatsapp", "canal whatsapp", "noticias whatsapp", "difusion", "celular", "unirse whatsapp", "avisos rapidos"]
    },
    {
        titulo: "Pre-Inscripción, Admisiones y Matrículas",
        descripcion: "Consulta de cupos disponibles, requisitos para nuevos estudiantes y acceso al formulario de preinscripción escolar en línea para el ciclo 2026.",
        url: "pre.html",
        keywords: [
            "preinscripcion", "inscripcion", "matricula", "ingresar", "nuevo estudiante", "cupos",
            "admisiones", "cupo", "formulario matricula", "enrolamiento", "candidatos", "papeleria",
            "requisitos matricula", "costo matricula", "fechas admision"
        ]
    },
    {
        titulo: "Canales de Contacto y Atención",
        descripcion: "Horarios de atención, líneas telefónicas de secretaría, correos de contacto directo y mapa interactivo para llegar a nuestras instalaciones.",
        url: "contacto.html",
        keywords: [
            "contacto", "contactanos", "escribirnos", "telefono", "correo", "atencion directiva",
            "email", "donde encontrarnos", "ubicacion", "atencion", "soporte", "pqrsf", "secretaria",
            "atencion a padres", "horarios de oficina", "como llegar"
        ]
    },
    {
        titulo: "Biblioteca Virtual e Institucional",
        descripcion: "Plataforma de recursos bibliográficos digitales, catálogo de libros para préstamo escolar y clubes de lectura del Gilberto Alzate.",
        url: "https://luisarango64.wixsite.com/bibliositio",
        keywords: [
            "biblioteca", "libros", "lectura", "prestamo de libros", "recursos bibliograficos",
            "sala de lectura", "catalogo", "bibliositio", "leer online", "obras literarias", "enciclopedias"
        ]
    },
    {
        titulo: "Manual de Convivencia Escolar 2026",
        descripcion: "Documento regulador con los derechos, deberes, compromisos, tipificaciones de faltas y conductos regulares para toda la comunidad educativa.",
        url: "https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf",
        keywords: [
            "manual", "convivencia", "normas", "reglamento", "conducto regular", "deberes",
            "manual de convivencia", "reglas", "derechos", "compromiso", "disciplina", "acuerdo escolar"
        ]
    },
    {
        titulo: "Formulario Oficial de PQRSF",
        descripcion: "Registra tus Peticiones, Quejas, Reclamos, Sugerencias o Felicitaciones de forma electrónica ante el equipo directivo de la institución.",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform",
        keywords: [
            "pqrsf", "peticion", "queja", "reclamo", "solicitud", "felicitacion", "buzon",
            "pqr", "denuncia", "sugerencia", "atencion al ciudadano", "escribir al colegio", "quejas"
        ]
    },
    {
        titulo: "Alzate Virtual — Canal Educativo (YouTube)",
        descripcion: "Material audiovisual pedagógico, registros de izadas de bandera virtuales y tutoriales interactivos producidos por nuestros docentes.",
        url: "https://www.youtube.com/@alzatevirtual8374/videos",
        keywords: [
            "alzate virtual", "youtube", "videos", "clases virtuales", "canal", "explicaciones",
            "canal youtube", "online", "virtual", "contenidos en linea", "conferencias", "retransmision"
        ]
    },
    {
        titulo: "Canal Oficial de WhatsApp Institucional",
        descripcion: "Únete a nuestro canal unidireccional de WhatsApp para recibir circulares, noticias urgentes e informativos semanales en tiempo real en tu teléfono.",
        url: "https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508",
        keywords: [
            "whatsapp", "canal whatsapp", "canal institucional", "comunicados", "alertas",
            "mensajes", "novedades whatsapp", "difusion", "celular", "grupo whatsapp", "notificaciones"
        ]
    }

];
