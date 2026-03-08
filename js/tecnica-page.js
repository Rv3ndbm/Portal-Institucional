(function(){
  // Utilidades
  const rootPrefix = '../../'; // desde html/tecnicas/* hacia raíz
  const jsonPath = rootPrefix + 'data/tecnicas.json';
  const body = document.body;
  const techId = body.dataset.tech || inferTechIdFromPath();

  function inferTechIdFromPath(){
    const name = location.pathname.split('/').pop().replace('.html','');
    return name;
  }

  const titleEl = document.getElementById('tech-title');
  const subtitleEl = document.getElementById('tech-subtitle');
  const descEl = document.getElementById('tech-description');
  const metricsEl = document.getElementById('tech-metrics');
  const perfEl = document.getElementById('perf-report');
  const heroVideo = document.getElementById('heroVideo');

  let t0Fetch = performance.now();
  fetch(jsonPath, { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      const tech = data[techId];
      if(!tech){
        titleEl.textContent = 'Técnica no encontrada';
        descEl.textContent = 'Verifique el identificador de la técnica.';
        return;
      }
      // Asignar contenido
      titleEl.textContent = tech.title;
      subtitleEl.textContent = tech.subtitle;
      descEl.textContent = tech.description;
      metricsEl.innerHTML = '';
      (tech.metrics || []).forEach(m => {
        const item = document.createElement('div');
        item.className = 'metric-item';
        item.innerHTML = `<span class="metric-value">${m.value}</span><span class="metric-label">${m.label}</span>`;
        metricsEl.appendChild(item);
      });

      // Inicializar video (lazy)
      setupHeroVideo(tech.media);
    })
    .catch(err => {
      console.error('Error cargando datos de técnica:', err);
      titleEl.textContent = 'Error cargando datos';
    })
    .finally(() => {
      const dt = (performance.now() - t0Fetch).toFixed(0);
      logPerf(`Datos cargados en ${dt} ms`);
    });

  function setupHeroVideo(media){
    if(!heroVideo || !media) return;
    heroVideo.setAttribute('poster', rootPrefix + (media.poster || 'img/vision.jpg'));
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.loop = true;
    heroVideo.preload = 'metadata';

    const source = document.createElement('source');
    source.type = 'video/mp4';

    const loadVideo = async () => {
      if (source.src) return; // ya cargado
      const videoUrl = rootPrefix + media.video;
      try {
        const resp = await fetch(videoUrl, { method: 'HEAD' });
        if (!resp.ok) {
          logPerf('Video no disponible, usando póster.');
          return;
        }
        source.src = videoUrl;
        heroVideo.appendChild(source);
        const t0Video = performance.now();
        heroVideo.load();
        const canplayHandler = () => {
          const dt = (performance.now() - t0Video).toFixed(0);
          logPerf(`Video listo para reproducción en ${dt} ms`);
          heroVideo.play().catch(()=>{});
          heroVideo.removeEventListener('canplaythrough', canplayHandler);
        };
        heroVideo.addEventListener('canplaythrough', canplayHandler);
      } catch (e) {
        logPerf('Error verificando video, se mantiene el póster.');
      }
    };

    // Lazy con IntersectionObserver
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting){
          loadVideo().catch(()=>{});
          io.disconnect();
        }
      })
    }, { threshold: 0.2 });
    io.observe(heroVideo);
  }

  // Transiciones suaves entre secciones
  const animatedSections = document.querySelectorAll('.section');
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });
  animatedSections.forEach(s => secIO.observe(s));

  // Reporte de rendimiento
  function logPerf(msg){
    if(!perfEl) return;
    const item = document.createElement('div');
    item.className = 'perf-item';
    const conn = navigator.connection && navigator.connection.effectiveType ? ` (${navigator.connection.effectiveType})` : '';
    item.textContent = `• ${msg}${conn}`;
    perfEl.appendChild(item);
  }

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target){ target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    })
  });
  heroVideo.addEventListener('error', ()=> logPerf('Fallo al cargar video; se usa póster.'));
})();