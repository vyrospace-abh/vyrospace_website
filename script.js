/* ===== VYROSPACE — Interactions ===== */

// Preserve manual scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const navEntries = (window.performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation') : [];
const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') || (window.performance && performance.navigation && performance.navigation.type === 1);

let initialHash = window.location.hash;

// If reloading, clear hash so refresh always opens homepage
if (isReload) {
    if (window.location.hash) {
        try { history.replaceState(null, null, window.location.pathname); } catch (e) {}
    }
    initialHash = '';
    window.scrollTo(0, 0);
}

// Helper: scroll to target with viewport positioning
function scrollToTarget(hash, smooth = true) {
    if (!hash || hash === '#') return false;
    const cleanHash = hash.includes('#') ? ('#' + hash.split('#')[1]) : hash;
    const target = document.querySelector(cleanHash);
    if (!target) return false;

    let targetTop;
    if (cleanHash === '#hero') {
        targetTop = 0;
    } else if (cleanHash === '#work' || cleanHash === '#contact') {
        const sectionTop = target.getBoundingClientRect().top + window.pageYOffset;
        const container = target.querySelector('.container') || target;
        const containerHeight = container.offsetHeight;
        const availableHeight = window.innerHeight;

        // If the section is full-screen 100vh and the container fits, align sectionTop exactly
        if (target.offsetHeight >= availableHeight && containerHeight <= availableHeight) {
            targetTop = sectionTop;
        } else if (containerHeight < availableHeight) {
            // Viewport is taller than container: center container vertically
            const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
            targetTop = containerTop - (availableHeight - containerHeight) / 2;
        } else {
            // Viewport is shorter than container: align top of container with slight 20px padding
            const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
            targetTop = containerTop - 20;
        }
    } else {
        targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    }

    window.scrollTo({
        top: Math.max(0, Math.round(targetTop)),
        behavior: smooth ? 'smooth' : 'auto'
    });
    return true;
}

// Strip hash on beforeunload so refresh always starts at top homepage
window.addEventListener('beforeunload', () => {
    try { history.replaceState(null, null, window.location.pathname); } catch (e) {}
});

function handleHashScroll() {
    if (initialHash && !isReload) {
        setTimeout(() => {
            scrollToTarget(initialHash, true);
        }, 80);
        setTimeout(() => {
            scrollToTarget(initialHash, true);
        }, 300);
    }
}

window.addEventListener('load', handleHashScroll);

document.addEventListener('DOMContentLoaded', () => {
    if (initialHash && !isReload) {
        scrollToTarget(initialHash, false);
    } else if (isReload) {
        window.scrollTo(0, 0);
    }

    /* --- Scroll-Triggered Reveal Animations --- */
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(i * 40, 200));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 60px 0px'
    });

    revealItems.forEach(el => revealObserver.observe(el));


    /* --- Scroll-Up Reveal Floating Navbar (Auto-Hide on scroll down, Reveal on scroll up) --- */
    const floatingNav = document.getElementById('floatingNav');
    let lastScrollY = window.scrollY;
    const heroSection = document.getElementById('hero');
    let cachedHeroThreshold = 380;
    let navRaf = null;

    function recalculateNavThreshold() {
        const heroHeight = heroSection ? heroSection.offsetHeight : 600;
        cachedHeroThreshold = Math.min(heroHeight * 0.45, 380);
    }
    recalculateNavThreshold();
    window.addEventListener('resize', recalculateNavThreshold, { passive: true });

    function updateFloatingNav() {
        if (!floatingNav) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY <= cachedHeroThreshold) {
            floatingNav.classList.remove('is-active');
        } else {
            const diff = currentScrollY - lastScrollY;

            // Scrolling UP: reveal floating bar
            if (diff < -6) {
                floatingNav.classList.add('is-active');
            }
            // Scrolling DOWN: hide floating bar
            else if (diff > 6) {
                floatingNav.classList.remove('is-active');
            }
        }

        lastScrollY = currentScrollY;
        navRaf = null;
    }

    window.addEventListener('scroll', () => {
        if (!navRaf) {
            navRaf = requestAnimationFrame(updateFloatingNav);
        }
    }, { passive: true });

    // Logo click in floating nav: return smoothly to main homepage hero
    if (floatingNav) {
        const brandLink = floatingNav.querySelector('.floating-nav-brand');
        if (brandLink) {
            brandLink.addEventListener('click', (e) => {
                const href = brandLink.getAttribute('href');
                if (href === '#hero' || href === '#' || href === 'index.html#hero') {
                    e.preventDefault();
                    floatingNav.classList.remove('is-active');
                    scrollToTarget('#hero', true);
                    if (window.location.hash) {
                        history.pushState(null, null, window.location.pathname);
                    }
                }
            });
        }
    }


    /* --- Hamburger Menu --- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    /* --- FAQ Accordion --- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });


    /* --- Smooth Scroll & Hash Navigation --- */
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            // Determine if the target is on the current page
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            const linkFile = href.split('#')[0];
            const isSamePage = !linkFile || linkFile === currentFile ||
                (currentFile === '' && linkFile === 'index.html') ||
                (currentFile === 'index.html' && linkFile === 'index.html');

            if (isSamePage) {
                const hash = '#' + href.split('#')[1];
                if (scrollToTarget(hash, true)) {
                    e.preventDefault();
                    // Do not push #contact into address bar to prevent refresh opening on contact
                }
            }
            // If cross-page (e.g. from subpage to index.html#work), allow normal browser navigation
        });
    });


    /* --- Contact Form Submit --- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-submit');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = `
                <span>Request Sent! ✓</span>
            `;
            btn.style.background = '#22c55e';
            btn.style.color = '#fff';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.pointerEvents = '';
                contactForm.reset();
            }, 3000);
        });
    }


    /* --- Active Nav Highlight --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-pill-menu a, .floating-pill-list a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && (href === `#${targetId}` || href.endsWith(`#${targetId}`))) {
                        link.classList.add('active');
                    } else if (href && href.includes('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));


    /* --- Parallax Hero Image --- */
    const heroBgImg = document.querySelector('.hero-bg-img');

    if (heroBgImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBgImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        });
    }


    /* --- Stat Counter Animation --- */
    const statNums = document.querySelectorAll('.stat-num[data-target]');

    if (statNums.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    const duration = 2000;
                    const start = performance.now();

                    const animate = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(target * eased);
                        if (progress < 1) requestAnimationFrame(animate);
                    };

                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => counterObserver.observe(el));
    }


    /* --- Add reveal-item class to major section elements for animation --- */
    const animateSections = document.querySelectorAll(
        '.about-layout, .gallery-header, .process-intro, .services-list-grid, .contact-layout, .faq-list'
    );

    const sectionRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    animateSections.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionRevealObserver.observe(el);
    });

});

document.addEventListener('DOMContentLoaded', () => {

    /* --- Gallery Filter Functionality --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }


    /* --- Showreel Play Button --- */
    const showreelPlay = document.querySelector('.showreel-play');
    const showreelPreview = document.querySelector('.showreel-preview');

    if (showreelPlay && showreelPreview) {
        showreelPlay.addEventListener('click', () => {
            // Replace thumbnail with video player
            showreelPreview.innerHTML = `
                <video autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;">
                    <source src="hf_20260218_150059_e7d3cd63-dfe4-425d-a7bb-986e0fa27bad.mp4" type="video/mp4">
                </video>
            `;
        });
    }


    /* --- File Upload Display --- */
    const fileInput = document.getElementById('files');
    const fileDisplay = document.querySelector('.file-upload-text');

    if (fileInput && fileDisplay) {
        fileInput.addEventListener('change', () => {
            const fileCount = fileInput.files.length;
            if (fileCount > 0) {
                fileDisplay.textContent = `${fileCount} file${fileCount > 1 ? 's' : ''} selected`;
                fileDisplay.style.color = 'var(--accent)';
            } else {
                fileDisplay.textContent = 'CAD / PDF / SketchUp / References';
                fileDisplay.style.color = '';
            }
        });
    }

});
