// neuralNetwork.js — coloca este archivo en /public/scripts/neuralNetwork.js

(function () {
  class Particle {
    constructor(w, h) {
      this.canvasWidth = w;
      this.canvasHeight = h;
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
      if (this.x > this.canvasWidth || this.x < 0) this.speedX = -this.speedX;
      if (this.y > this.canvasHeight || this.y < 0) this.speedY = -this.speedY;
      this.x += this.speedX;
      this.y += this.speedY;
    }

    draw(ctx, colorFill = '#818cf8') {
      ctx.fillStyle = colorFill;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Crea y controla una instancia plexus por canvas
  function createPlexus(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Ajusta cantidad de partículas según área para mejor rendimiento móvil
    function particlesForArea(area) {
      const base = 70; // referencia para ~100 en tamaños grandes
      const refArea = 1200 * 600; // referencia arbitraria
      return Math.max(25, Math.round((area / refArea) * base));
    }

    let particles = [];
    let animationId = null;
    let numberOfParticles = 100;
    const connectDistance = 120;
    const fillColor = '#818cf8'; // color de los puntos
    const strokeColorRGB = '79,70,229'; // indigo-600 rgb (se usa con opacity)

    function setSize() {
      // usar devicePixelRatio para evitar borrosidad en pantallas HiDPI
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); // normalizamos el contexto
      numberOfParticles = particlesForArea(w * h);
      initParticles();
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1)));
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectDistance) {
            const opacity = 1 - distance / connectDistance;
            ctx.strokeStyle = `rgba(${strokeColorRGB}, ${opacity * 0.9})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update();
        p.draw(ctx, fillColor);
      }
      connect();
      animationId = requestAnimationFrame(animate);
    }

    function start() {
      stop();
      setSize();
      animate();
    }

    function stop() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    // Observe size changes
    const ro = new ResizeObserver(() => {
      setSize();
    });
    ro.observe(canvas);

    // start automatically
    start();

    // Return controller so we can stop/destroy if needed
    return {
      stop,
      start,
      destroy() {
        stop();
        ro.disconnect();
      },
    };
  }

  // Inicializa todos los canvases con data-plexus
  function initAll() {
    const canvases = Array.from(document.querySelectorAll('canvas[data-plexus]'));
    const instances = [];
    canvases.forEach((c) => {
      // evita inicializar dos veces (por ejemplo si ya tiene data-plexus-initialized)
      if (c.dataset.plexusInitialized) return;
      c.dataset.plexusInitialized = '1';
      c.style.pointerEvents = 'none';
      // asegurar que el canvas tiene posición absoluta dentro de un relative container
      instances.push(createPlexus(c));
    });
    return instances;
  }

  // Ejecutar en carga y también si Astro navega parcial (spa)
  function boot() {
    initAll();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    window.addEventListener('DOMContentLoaded', boot);
  }

  // también responde a eventos SPA/astro si los usas
  document.addEventListener('astro:page-load', boot);
})();
