document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTS ---
    const landingPage = document.getElementById('landing-page');
    const momentsPage = document.getElementById('moments-page');
    const continueBtn = document.getElementById('continue-btn');
    const polaroids = document.querySelectorAll('.polaroid-card');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    let currentIndex = 0;
    const totalSlides = polaroids.length;

    // --- GSAP ANIMATIONS: ENTRY ---
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Initial Flash Prevention
    gsap.set('.glass-card', { opacity: 0, scale: 0.9 });
    gsap.set('.line', { opacity: 0, y: 20 });
    gsap.set('.msg-line', { opacity: 0, y: 20 });
    gsap.set('#continue-btn', { opacity: 0, y: 20 });

    tl.to('.glass-card', { duration: 1.5, opacity: 1, scale: 1, ease: "slow(0.7, 0.7, false)" })
        .to('.line', { duration: 1, opacity: 1, y: 0, stagger: 0.2 }, "-=0.5")
        .to('.msg-line', { duration: 1, opacity: 1, y: 0, stagger: 0.15 }, "-=0.5")
        .to('#continue-btn', { duration: 0.8, opacity: 1, y: 0 }, "-=0.3");


    // --- TRANSITION TO MOMENTS ---
    continueBtn.addEventListener('click', () => {
        // Fade out landing
        gsap.to(landingPage, {
            duration: 1,
            opacity: 0,
            y: -50,
            ease: "power2.inOut",
            onComplete: () => {
                landingPage.style.display = 'none';
                momentsPage.classList.remove('hidden');

                // Init Moments
                initMoments();
            }
        });
    });

    // --- MOMENTS PAGE LOGIC ---
    function initMoments() {
        // Make visible
        gsap.to(momentsPage, { duration: 1, opacity: 1, ease: "power2.out" });

        // Animate Header
        gsap.to('.gallery-header', { duration: 1, opacity: 1, y: 0, delay: 0.3 });

        // Animate Controls
        gsap.to('.slider-controls', { duration: 1, opacity: 1, delay: 0.8 });

        // Update Slider State
        updateSlider();

        // Start Auto Play
        startAutoSlide();
    }

    // --- AUTOMATIC SLIDESHOW ---
    function startAutoSlide() {
        setInterval(() => {
            nextSlide();
        }, 3000); // Change slide every 3 seconds
    }

    function updateSlider() {
        polaroids.forEach((card, index) => {
            // Reset state
            card.classList.remove('active', 'prev', 'next');

            // Calculate relative position for circular buffer
            let diff = (index - currentIndex + totalSlides) % totalSlides;

            if (diff === 0) {
                // ACTIVE
                card.classList.add('active');
                gsap.to(card, {
                    duration: 0.8,
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    rotation: -2 + Math.random() * 4, // Subtle random rotation
                    zIndex: 10,
                    filter: "blur(0px) drop-shadow(0 20px 30px rgba(0,0,0,0.6))",
                    ease: "power3.out"
                });
            } else if (diff === totalSlides - 1) {
                // PREVIOUS (Left)
                card.classList.add('prev');
                gsap.to(card, {
                    duration: 0.8,
                    opacity: 0.4,
                    scale: 0.8,
                    x: -250, // Move left
                    rotation: -10,
                    zIndex: 5,
                    filter: "blur(2px)",
                    ease: "power3.out"
                });
            } else if (diff === 1) {
                // NEXT (Right)
                card.classList.add('next');
                gsap.to(card, {
                    duration: 0.8,
                    opacity: 0.4,
                    scale: 0.8,
                    x: 250, // Move right
                    rotation: 10,
                    zIndex: 5,
                    filter: "blur(2px)",
                    ease: "power3.out"
                });
            } else {
                // HIDDEN (Behind)
                gsap.to(card, {
                    duration: 0.8,
                    opacity: 0,
                    scale: 0.5,
                    x: 0,
                    zIndex: 1,
                    ease: "power3.out"
                });
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }


});
