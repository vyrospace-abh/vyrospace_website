/* ===== VYROSPACE 2.0 — Motion =====
   Cinematic, restrained, client-focused.
   Hero text reveal, scroll-driven pipeline, sticky CTA,
   gallery hover swaps, magnetic buttons, parallax.
   =================================================== */

(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Hero text split-reveal on load --- */
    function triggerHeroSplit() {
        if (prefersReduced) {
            document.querySelectorAll('.split-title .word > span, .split-line, .hero-eyebrow').forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            document.querySelectorAll('.split-title .word, .split-line, .hero-eyebrow').forEach((w) => w.classList.add('is-revealed'));
            return;
        }
        // Sequence: eyebrow -> words (staggered) -> tagline -> ctas
        setTimeout(() => {
            document.querySelectorAll('.hero-eyebrow').forEach((el) => el.classList.add('is-revealed'));
        }, 200);
        setTimeout(() => {
            document.querySelectorAll('.split-title .word').forEach((w) => w.classList.add('is-revealed'));
        }, 350);
    }

    /* --- Reveal-on-scroll observer (fade up) --- */
    function setupRevealObserver() {
        const autoTargets = document.querySelectorAll(
            '.section-heading, .areas-intro, ' +
            '.pipeline-wrapper, .contact-layout, ' +
            '.footer-inner'
        );
        autoTargets.forEach((el) => el.classList.add('reveal-target'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
        );
        document.querySelectorAll('.reveal-target').forEach((el) => observer.observe(el));
    }

    /* --- Hero scroll progress bar --- */
    function setupHeroProgress() {
        const bar = document.getElementById('heroProgressBar');
        if (!bar) return;
        let raf = null;
        function update() {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
            bar.style.width = pct + '%';
            raf = null;
        }
        window.addEventListener('scroll', () => {
            if (raf === null) raf = requestAnimationFrame(update);
        }, { passive: true });
        update();
    }

    /* --- Sticky "Start a Project" CTA (visible after hero) --- */
    function setupStickyCta() {
        const cta = document.getElementById('stickyCta');
        const hero = document.getElementById('hero');
        if (!cta || !hero) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        cta.classList.remove('is-visible');
                    } else {
                        cta.classList.add('is-visible');
                    }
                });
            },
            { threshold: [0, 0.3, 0.5] }
        );
        observer.observe(hero);
    }

    /* --- Magnetic button (subtle pull toward cursor) --- */
    function setupMagneticButtons() {
        if (prefersReduced) return;
        document.querySelectorAll('.magnetic-btn').forEach((btn) => {
            const strength = 20;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* --- Area-card background image swap (data-bg -> inline style) --- */
    function setupAreaCardBgs() {
        document.querySelectorAll('[data-bg]').forEach((el) => {
            const bg = el.getAttribute('data-bg');
            if (bg) el.style.backgroundImage = `url("${bg}")`;
        });
    }

    /* --- Production pipeline scroll-scrubber --- */
    function setupPipelineScrubber() {
        const section = document.getElementById('process');
        const progress = document.getElementById('pipelineProgress');
        const steps = document.querySelectorAll('.pipeline-step');
        if (!section || !progress || steps.length === 0) return;

        let ticking = false;
        function update() {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const start = rect.top - vh * 0.6;
            const end = rect.top + rect.height - vh * 0.4;
            const total = end - start;
            const scrolled = Math.max(0, Math.min(total, -start));
            const pct = total > 0 ? scrolled / total : 0;
            progress.style.transform = `scaleX(${pct})`;

            steps.forEach((step) => {
                const stepRect = step.getBoundingClientRect();
                const stepCenter = stepRect.top + stepRect.height / 2;
                if (stepCenter < vh * 0.7) {
                    step.classList.add('is-active');
                }
            });
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    /* --- Hero video parallax (very subtle, 0.15x) --- */
    function setupHeroParallax() {
        if (prefersReduced) return;
        const video = document.querySelector('.hero-bg-img');
        if (!video) return;
        let ticking = false;
        function update() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                video.style.transform = `translateY(${scrolled * 0.15}px) scale(1.05)`;
            }
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    /* --- Work tile: subtle zoom-out on scroll-in-view --- */
    function setupTileZoom() {
        if (prefersReduced) return;
        const tiles = document.querySelectorAll('.work-tile-img');
        if (tiles.length === 0) return;

        tiles.forEach((img) => {
            img.style.transform = 'scale(1.08)';
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.transform = 'scale(1)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        tiles.forEach((t) => observer.observe(t));
    }

    /* --- Init on DOM ready --- */
    document.addEventListener('DOMContentLoaded', () => {
        triggerHeroSplit();
        setupRevealObserver();
        setupHeroProgress();
        setupStickyCta();
        setupMagneticButtons();
        setupAreaCardBgs();
        setupPipelineScrubber();
        setupHeroParallax();
        setupTileZoom();
    });
})();

