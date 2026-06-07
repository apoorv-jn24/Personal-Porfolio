/* ═══════════════════════════════════════════════════════════════
   cinematic-hero.js — Apoorv Jain Portfolio
   Cinematic Three.js bokeh layer + GSAP animations + video controls
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Reduced Motion Guard ───────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. VIDEO HERO SETUP ────────────────────────────────────── */
  const heroSection   = document.getElementById('home');
  const mainVideo     = document.getElementById('heroVideo');
  const ambientVideo  = document.getElementById('heroAmbientVideo');
  const playPauseBtn  = document.getElementById('heroPlayPause');
  const muteBtn       = document.getElementById('heroMuteBtn');
  const soundHint     = document.getElementById('heroSoundHint');
  const scrollIndicator = document.getElementById('heroScrollIndicator');

  if (!mainVideo) return;

  /* Autoplay muted, then manage state */
  mainVideo.muted = true;
  if (ambientVideo) ambientVideo.muted = true;

  let isPlaying = true;
  let isMuted = true;

  /* Play both videos */
  function playVideos() {
    const p1 = mainVideo.play();
    if (p1) p1.catch(() => {});
    if (ambientVideo) {
      const p2 = ambientVideo.play();
      if (p2) p2.catch(() => {});
    }
  }

  function pauseVideos() {
    mainVideo.pause();
    if (ambientVideo) ambientVideo.pause();
  }

  /* Sync ambient with main */
  mainVideo.addEventListener('timeupdate', () => {
    if (ambientVideo && Math.abs(ambientVideo.currentTime - mainVideo.currentTime) > 0.3) {
      ambientVideo.currentTime = mainVideo.currentTime;
    }
  });

  /* Play/Pause toggle */
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playVideos();
        playPauseBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>`;
        playPauseBtn.setAttribute('aria-label', 'Pause video');
      } else {
        pauseVideos();
        playPauseBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M8 5v14l11-7z"/>
          </svg>`;
        playPauseBtn.setAttribute('aria-label', 'Play video');
      }
    });
  }

  /* Mute/Unmute toggle */
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      mainVideo.muted = isMuted;
      if (ambientVideo) ambientVideo.muted = isMuted;

      if (isMuted) {
        muteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>`;
        muteBtn.setAttribute('aria-label', 'Unmute video');
      } else {
        muteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>`;
        muteBtn.setAttribute('aria-label', 'Mute video');
        /* Hide sound hint when user unmutes */
        if (soundHint) {
          soundHint.style.opacity = '0';
          soundHint.style.pointerEvents = 'none';
        }
      }
    });
  }

  /* Auto-hide sound hint after 4s */
  if (soundHint) {
    setTimeout(() => {
      soundHint.style.opacity = '0';
      soundHint.style.pointerEvents = 'none';
    }, 4000);
  }

  /* Scroll indicator click */
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = heroSection?.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* Start playback */
  document.addEventListener('DOMContentLoaded', () => {
    playVideos();
  });
  /* Fallback if DOMContentLoaded already fired */
  if (document.readyState !== 'loading') playVideos();


  /* ─── 2. THREE.JS CINEMATIC BOKEH LAYER ─────────────────────── */
  const canvas = document.getElementById('cinematicCanvas');
  if (!canvas) return;

  /* Load Three.js from CDN */
  function loadThreeJS() {
    return new Promise((resolve, reject) => {
      if (window.THREE) { resolve(window.THREE); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      script.onload = () => resolve(window.THREE);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadThreeJS().then((THREE) => {
    /* Scene */
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    /* ── Particle geometry ── */
    const PARTICLE_COUNT = 180;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);
    const sizes     = new Float32Array(PARTICLE_COUNT);
    const phases    = new Float32Array(PARTICLE_COUNT); /* sine phase offset */
    const speeds    = new Float32Array(PARTICLE_COUNT);

    /* Warm orange / gold / soft white palette */
    const palette = [
      [1.0, 0.55, 0.15],  /* warm orange    */
      [1.0, 0.75, 0.35],  /* amber gold     */
      [1.0, 0.95, 0.75],  /* soft warm white */
      [0.95, 0.45, 0.12], /* deep orange    */
      [0.5, 0.65, 1.0],   /* cool monitor blue (accent) */
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 8 - 2;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col[0];
      colors[i3 + 1] = col[1];
      colors[i3 + 2] = col[2];

      sizes[i]  = Math.random() * 18 + 4;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.004 + 0.001;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geometry.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    /* Soft bokeh sprite texture */
    function createBokehTexture() {
      const size = 128;
      const c    = document.createElement('canvas');
      c.width = c.height = size;
      const ctx  = c.getContext('2d');
      const half = size / 2;

      const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0,    'rgba(255,220,160,1)');
      grad.addColorStop(0.25, 'rgba(255,180,100,0.8)');
      grad.addColorStop(0.55, 'rgba(255,140,60,0.3)');
      grad.addColorStop(1,    'rgba(255,100,30,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }

    const bokehTex = createBokehTexture();

    const material = new THREE.PointsMaterial({
      size:            0.25,
      map:             bokehTex,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.72,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* Mouse parallax */
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 1.2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    }, { passive: true });

    /* Resize handler */
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    /* Animation loop */
    let rafId = null;
    let clock  = 0;
    const posAttr = geometry.getAttribute('position');
    const initialPos = positions.slice();

    function animate() {
      rafId = requestAnimationFrame(animate);

      /* Pause if section not visible */
      if (heroSection && !heroSection.classList.contains('visible') &&
          window.scrollY > window.innerHeight * 0.8) {
        return;
      }

      clock += 0.008;

      /* Float particles with sine oscillations */
      if (!prefersReduced) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const t  = clock + phases[i];
          posAttr.array[i3 + 1] = initialPos[i3 + 1] + Math.sin(t * speeds[i] * 200) * 0.6;
          posAttr.array[i3]     = initialPos[i3]     + Math.cos(t * speeds[i] * 150) * 0.25;
        }
        posAttr.needsUpdate = true;
      }

      /* Smooth mouse parallax on camera */
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      camera.position.x = currentX * 0.5;
      camera.position.y = -currentY * 0.3;
      camera.lookAt(scene.position);

      /* Slow rotation */
      particles.rotation.y = clock * 0.025;
      particles.rotation.x = clock * 0.01;

      renderer.render(scene, camera);
    }

    if (!prefersReduced) animate();

    /* Cleanup on page hide */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        if (!prefersReduced) animate();
      }
    });

  }).catch((err) => {
    /* Three.js failed to load — silently skip the particle layer */
    if (canvas) canvas.style.display = 'none';
  });


  /* ─── 3. GSAP ENTRANCE ANIMATIONS ───────────────────────────── */
  function loadGSAP() {
    return new Promise((resolve, reject) => {
      if (window.gsap) { resolve(window.gsap); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
      script.onload = () => resolve(window.gsap);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadGSAP().then((gsap) => {
    if (prefersReduced) {
      /* Reveal immediately for reduced-motion */
      document.querySelectorAll(
        '.hero-tagline, .hero-name-first, .hero-name-last, .hero-role, .hero-actions, .hero-social, .hero-controls, #heroScrollIndicator'
      ).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    /* Use fromTo so GSAP explicitly sets start AND end opacity,
       overriding the CSS opacity:0 safety state */
    const tl = gsap.timeline({ delay: 0.4 });

    tl.fromTo('.hero-tagline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-name-first',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo('.hero-name-last',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.95'
    )
    .fromTo('.hero-role',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
      '-=0.7'
    )
    .fromTo('.hero-actions',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.hero-social',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.hero-controls',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('#heroScrollIndicator',
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    );

  }).catch(() => {
    /* GSAP failed — reveal elements immediately */
    document.querySelectorAll('.hero-tagline, .hero-name-first, .hero-name-last, .hero-role, .hero-actions, .hero-social, .hero-controls, #heroScrollIndicator').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  });

})();
