/**
 * VYROSPACE — STEELFORM LUXURY REAL ESTATE EDITION
 * Interactive behaviors: Carousel, Accordion, Video Modal, Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Section 02: 3D Spatial Coverflow Carousel (Continuous Loop)
    // -------------------------------------------------------------
    function initWork3DCarousel() {
        const viewport = document.getElementById('workCarouselViewport');
        const stage = document.getElementById('workCarouselStage');
        const cards = Array.from(document.querySelectorAll('.work-card-3d'));
        const prevBtn = document.getElementById('workCarouselPrev');
        const nextBtn = document.getElementById('workCarouselNext');
        const ctrlThumb = document.getElementById('workCtrlThumb');
        const ctrlTitle = document.getElementById('workCtrlTitle');
        const ctrlCat = document.getElementById('workCtrlCat');

        if (!viewport || !stage || cards.length === 0) return;

        let activeIndex = 0;
        const total = cards.length;
        let loopTimer = null;
        let isPaused = false;
        let startX = 0;
        let isSwiping = false;

        function getCardOffset(idx, current) {
            let diff = (idx - current) % total;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;
            return diff;
        }

        function updateCarousel() {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1100;

            const spacing1 = isMobile ? 150 : (isTablet ? 250 : 310);
            const spacing2 = isMobile ? 280 : (isTablet ? 450 : 560);
            const angle1 = isMobile ? 26 : 28;
            const angle2 = isMobile ? 40 : 44;
            const scale1 = isMobile ? 0.85 : 0.88;
            const scale2 = isMobile ? 0.72 : 0.76;

            cards.forEach((card, idx) => {
                const offset = getCardOffset(idx, activeIndex);

                if (offset === 0) {
                    // Center Active Card
                    card.style.transform = `translateX(0px) translateZ(0px) rotateY(0deg) scale(1)`;
                    card.style.opacity = '1';
                    card.style.zIndex = '12';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'none';
                    card.classList.add('is-active');
                } else if (offset === -1) {
                    // Immediate Left Card
                    card.style.transform = `translateX(-${spacing1}px) translateZ(-130px) rotateY(${angle1}deg) scale(${scale1})`;
                    card.style.opacity = isMobile ? '0.7' : '0.84';
                    card.style.zIndex = '9';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'brightness(0.88)';
                    card.classList.remove('is-active');
                } else if (offset === 1) {
                    // Immediate Right Card
                    card.style.transform = `translateX(${spacing1}px) translateZ(-130px) rotateY(-${angle1}deg) scale(${scale1})`;
                    card.style.opacity = isMobile ? '0.7' : '0.84';
                    card.style.zIndex = '9';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'brightness(0.88)';
                    card.classList.remove('is-active');
                } else if (offset === -2) {
                    // Far Left Card
                    card.style.transform = `translateX(-${spacing2}px) translateZ(-250px) rotateY(${angle2}deg) scale(${scale2})`;
                    card.style.opacity = isMobile ? '0.35' : '0.52';
                    card.style.zIndex = '6';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'brightness(0.72)';
                    card.classList.remove('is-active');
                } else if (offset === 2) {
                    // Far Right Card
                    card.style.transform = `translateX(${spacing2}px) translateZ(-250px) rotateY(-${angle2}deg) scale(${scale2})`;
                    card.style.opacity = isMobile ? '0.35' : '0.52';
                    card.style.zIndex = '6';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'brightness(0.72)';
                    card.classList.remove('is-active');
                } else {
                    // Culled back cards
                    const side = offset > 0 ? 1 : -1;
                    const farDist = spacing2 + 180;
                    card.style.transform = `translateX(${side * farDist}px) translateZ(-380px) rotateY(${-side * 55}deg) scale(0.6)`;
                    card.style.opacity = '0';
                    card.style.zIndex = '1';
                    card.style.pointerEvents = 'none';
                    card.classList.remove('is-active');
                }
            });

            // Update Floating Controller Pill
            const activeCard = cards[activeIndex];
            if (activeCard) {
                const title = activeCard.getAttribute('data-title') || '';
                const cat = activeCard.getAttribute('data-cat') || '';
                const thumb = activeCard.getAttribute('data-thumb') || '';

                if (ctrlThumb && thumb) {
                    ctrlThumb.style.backgroundImage = `url("${thumb}")`;
                }
                if (ctrlTitle) {
                    ctrlTitle.textContent = title;
                }
                if (ctrlCat) {
                    ctrlCat.textContent = `${cat} • ${activeIndex + 1} / ${total}`;
                }
            }
        }

        function goTo(index) {
            activeIndex = (index + total) % total;
            updateCarousel();
        }

        function startLoop() {
            stopLoop();
            loopTimer = setInterval(() => {
                if (!isPaused) {
                    goTo(activeIndex + 1);
                }
            }, 3200);
        }

        function stopLoop() {
            if (loopTimer) {
                clearInterval(loopTimer);
                loopTimer = null;
            }
        }

        // 1. Direct Card Clicks & Taps (clicking any flanking card rotates it to center)
        cards.forEach((card, idx) => {
            const selectCard = (e) => {
                const offset = getCardOffset(idx, activeIndex);
                if (offset !== 0) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    goTo(idx);
                    startLoop();
                }
            };
            card.addEventListener('click', selectCard);
            card.addEventListener('touchend', (e) => {
                if (!isSwipingMajor) {
                    selectCard(e);
                }
            });
        });

        // 2. Stage Left & Right Click/Tap Zones (matches user's annotated mouse/touch areas)
        stage.addEventListener('click', (e) => {
            if (e.target.closest('.work-card-3d.is-active') || e.target.closest('.work-carousel-controls') || e.target.closest('.work-card-3d')) return;
            const rect = stage.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width * 0.45) {
                goTo(activeIndex - 1);
                startLoop();
            } else if (clickX > rect.width * 0.55) {
                goTo(activeIndex + 1);
                startLoop();
            }
        });

        // 3. Controller Buttons (Prev & Next with immediate click & touch response)
        if (prevBtn) {
            const triggerPrev = (e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(activeIndex - 1);
                startLoop();
            };
            prevBtn.addEventListener('click', triggerPrev);
            prevBtn.addEventListener('touchend', triggerPrev);
            prevBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }
        if (nextBtn) {
            const triggerNext = (e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(activeIndex + 1);
                startLoop();
            };
            nextBtn.addEventListener('click', triggerNext);
            nextBtn.addEventListener('touchend', triggerNext);
            nextBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }

        // 4. Hover pause on viewport
        viewport.addEventListener('mouseenter', () => { isPaused = true; });
        viewport.addEventListener('mouseleave', () => { isPaused = false; });

        // 5. Touch & Swipe Gestures on Mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isSwipingMajor = false;

        viewport.addEventListener('touchstart', (e) => {
            isPaused = true;
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                isSwipingMajor = false;
            }
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                const dx = Math.abs(e.touches[0].clientX - touchStartX);
                if (dx > 12) {
                    isSwipingMajor = true;
                }
            }
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            isPaused = false;
            if (e.changedTouches && e.changedTouches.length > 0) {
                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;
                // Detect horizontal swipe (flick of 22px or more)
                if (Math.abs(deltaX) > 22 && Math.abs(deltaX) > Math.abs(deltaY) * 0.75) {
                    if (deltaX < 0) {
                        goTo(activeIndex + 1); // swipe left -> next
                    } else {
                        goTo(activeIndex - 1); // swipe right -> prev
                    }
                    startLoop();
                }
            }
            setTimeout(() => { isSwipingMajor = false; }, 80);
        });

        // 6. Desktop Mouse Drag Gesture with click safety
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseMoved = false;

        stage.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            if (e.target.closest('.work-card-3d.is-active') && e.target.closest('a')) return;
            isMouseDown = true;
            mouseStartX = e.clientX;
            mouseMoved = false;
            isPaused = true;
        });

        window.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                if (Math.abs(e.clientX - mouseStartX) > 8) {
                    mouseMoved = true;
                }
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - mouseStartX;
                if (mouseMoved && Math.abs(deltaX) > 40) {
                    if (deltaX < 0) {
                        goTo(activeIndex + 1);
                    } else {
                        goTo(activeIndex - 1);
                    }
                }
                isMouseDown = false;
                isPaused = false;
                startLoop();
            }
        });

        // 7. Keyboard Arrow Navigation
        window.addEventListener('keydown', (e) => {
            const rect = viewport.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            if (e.key === 'ArrowLeft') {
                goTo(activeIndex - 1);
                startLoop();
            } else if (e.key === 'ArrowRight') {
                goTo(activeIndex + 1);
                startLoop();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        }, { passive: true });

        // Initialize positions and kick off continuous auto-loop
        updateCarousel();
        startLoop();
    }

    initWork3DCarousel();

    // -------------------------------------------------------------
    // 2. The Perks of Owning / Partnering Accordion
    // -------------------------------------------------------------
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accordionItems.forEach(other => other.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 3. Cinematic Video Showreel Lightbox
    // -------------------------------------------------------------
    const playBtn = document.getElementById('playShowreelBtn');
    const videoModal = document.getElementById('videoModal');
    const modalClose = document.getElementById('videoModalClose');
    const modalVideo = document.getElementById('showreelVideo');

    if (playBtn && videoModal && modalVideo) {
        playBtn.addEventListener('click', () => {
            videoModal.classList.add('open');
            modalVideo.play().catch(() => {});
        });

        const closeModal = () => {
            videoModal.classList.remove('open');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('open')) closeModal();
        });
    }

    // -------------------------------------------------------------
    // 4. Mobile Navigation Drawer Toggle
    // -------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navPillMenu = document.getElementById('navPillMenu');

    if (mobileToggle && navPillMenu) {
        mobileToggle.addEventListener('click', () => {
            navPillMenu.classList.toggle('mobile-open');
            mobileToggle.textContent = navPillMenu.classList.contains('mobile-open') ? '✕' : '☰';
        });

        // Close on link click
        navPillMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navPillMenu.classList.remove('mobile-open');
                mobileToggle.textContent = '☰';
            });
        });
    }

    // -------------------------------------------------------------
    // 5. Scroll To Top Trigger
    // -------------------------------------------------------------
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------
    // 6. Lead Form Feedback
    // -------------------------------------------------------------
    const leadForm = document.getElementById('steelformLeadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const origText = submitBtn.textContent;
            submitBtn.textContent = 'Invitation Transmitted ✓';
            submitBtn.style.backgroundColor = '#844F23';
            submitBtn.style.color = '#FFFFFF';
            setTimeout(() => {
                leadForm.reset();
                submitBtn.textContent = origText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                alert('Thank you for your interest. A senior architectural director from Vyrospace will be in touch shortly.');
            }, 1200);
        });
    }

    // -------------------------------------------------------------
    // 7. Ultra-Fast Autoplay Reliability for Mobile & Desktop
    // -------------------------------------------------------------
    const bgVideos = document.querySelectorAll('.hero-video-bg');
    bgVideos.forEach(v => {
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.setAttribute('muted', '');

        const attemptPlay = () => {
            const p = v.play();
            if (p !== undefined) {
                p.catch(() => {
                    const unlock = () => {
                        v.play().catch(() => {});
                        window.removeEventListener('touchstart', unlock);
                        window.removeEventListener('scroll', unlock);
                        window.removeEventListener('click', unlock);
                    };
                    window.addEventListener('touchstart', unlock, { passive: true, once: true });
                    window.addEventListener('scroll', unlock, { passive: true, once: true });
                    window.addEventListener('click', unlock, { passive: true, once: true });
                });
            }
        };

        attemptPlay();
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                attemptPlay();
            }
        });
    });
});

