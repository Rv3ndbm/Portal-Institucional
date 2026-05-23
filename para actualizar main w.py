import os
import re

base_dir = r'c:\Users\RUBEN\OneDrive\Desktop\Pagina GAA v22'

nav_content_template = '''<nav class="main-nav" id="mainNav">
                <div class="nav-container">
                    <ul class="nav-menu nav-menu-left">
                        <li class="nav-item" data-bg="inicio">
                            <a href="{prefix}index.html" class="nav-link">INICIO</a>
                            <ul class="dropdown-menu">
                                <li><a href="{prefix}historia.html">Historia</a></li>
                                <li><a href="{prefix}calendario.html">Eventos</a></li>
                                <li><a href="{prefix}deportes.html">Deportes</a></li>
                                <li><a href="{prefix}documentos.html">Documentos</a></li>
                                <li><a href="{prefix}noticias.html">Noticias</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="sedes">
                            <a href="{prefix}sedes.html" class="nav-link">SEDES</a>
                            <ul class="dropdown-menu">
                                <li><a href="{prefix}sede-san-isidro.html">Sede san isidro</a></li>
                                <li><a href="{prefix}sede-seguros-bolivar.html">Sede seguros bolívar</a></li>
                                <li><a href="{prefix}sede-tomas-carrasquilla.html">Sede tomás carrasquilla</a></li>
                                <li><a href="{prefix}sede-carlos-villa.html">Sede carlos villa</a></li>
                                <li><a href="{prefix}sede-central.html">Sede central</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul class="nav-menu nav-menu-right">
                        <li class="nav-item" data-bg="departamentos">
                            <a href="{prefix}departamentos.html" class="nav-link">DEPARTAMENTOS</a>
                            <ul class="dropdown-menu">
                                <li><a href="{prefix}departamentos.html#coordinacion">Coordinación</a></li>
                                <li><a href="{prefix}departamentos.html#rectoria">Rectoría</a></li>
                                <li><a href="{prefix}departamentos.html#psicologia">Psicología</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="medias">
                            <a href="{prefix}tecnicas.html" class="nav-link">MEDIAS TÉCNICAS</a>
                            <ul class="dropdown-menu">
                                <li><a href="{prefix}tecnicas/pascual.html">Programación de software - pascual bravo</a></li>
                                <li><a href="{prefix}tecnicas/musica.html">Música</a></li>
                                <li><a href="{prefix}tecnicas/ambiental.html">Gestión ambiental</a></li>
                                <li><a href="{prefix}tecnicas/contenidos.html">Contenidos digitales</a></li>
                                <li><a href="{prefix}tecnicas/sena.html">SENA</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="academico">
                            <a href="{prefix}academico.html" class="nav-link">ACADÉMICO</a>
                            <ul class="dropdown-menu">
                                <li><a href="https://docente.alzate.edu.co/">Sistema docente</a></li>
                                <li><a href="https://estudiante.alzate.edu.co/">Sistema estudiante</a></li>
                            </ul>
                        </li>

                        <li class="nav-item" data-bg="servicios">
                            <a href="{prefix}otros-servicios.html" class="nav-link">OTROS SERVICIOS</a>
                            <ul class="dropdown-menu">
                                <li><a href="https://luisarango64.wixsite.com/bibliositio">Biblioteca</a></li>
                                <li><a href="https://alzate.edu.co/wp-content/uploads/2024/07/MANUAL-DE-CONVIVENCIA-2024.pdf">Manual de convivencia</a></li>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc77n4ssSfexwvQLwVhmn6KC9BJXzeCzlwcXKdimw7SXpgTBQ/viewform">Formulario PQRSF</a></li>
                                <li><a href="https://www.youtube.com/@alzatevirtual8374/videos">Alzate virtual</a></li>
                                <li><a href="{prefix}pre.html">Preinscripción</a></li>
                                <li><a href="https://www.whatsapp.com/channel/0029VaLVU0m5Ejy0YiRme508">Canal institucional</a></li>
                                <li><a href="{prefix}contacto.html">Contáctanos</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>'''

pattern = re.compile(r'<nav class="main-nav" id="mainNav">.*?</nav>', re.DOTALL)

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(root, base_dir)
            if rel_path == 'html':
                prefix = ''
            elif rel_path.startswith('html\\') or rel_path.startswith('html/'):
                parts = rel_path.replace('\\', '/').split('/')
                depth = len(parts) - 1
                prefix = '../' * depth
            else:
                prefix = '../html/'
                
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f'Error reading {filepath}: {e}')
                continue
                
            if pattern.search(content):
                new_nav = nav_content_template.format(prefix=prefix)
                new_content = pattern.sub(new_nav, content)
                
                try:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Updated {filepath} with prefix "{prefix}"')
                except Exception as e:
                    print(f'Error writing {filepath}: {e}')