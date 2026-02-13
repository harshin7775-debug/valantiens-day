document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTS ---
    const landingPage = document.getElementById('landing-page');
    const momentsPage = document.getElementById('moments-page');
    const reasonPage = document.getElementById('reason-page');
    const continueBtn = document.getElementById('continue-btn');
    const toReasonBtn = document.getElementById('to-reason-btn');
    const polaroids = document.querySelectorAll('.polaroid-card');

    let currentIndex = 0;
    const totalSlides = polaroids.length;

    // --- GSAP ENTRY ---
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    gsap.set('.glass-card', { opacity: 0, scale: 0.9 });
    gsap.set('.line', { opacity: 0, y: 20 });
    gsap.set('.msg-line', { opacity: 0, y: 20 });
    gsap.set('#continue-btn', { opacity: 0, y: 20 });

    tl.to('.glass-card', { duration: 1.5, opacity: 1, scale: 1 })
        .to('.line', { duration: 1, opacity: 1, y: 0, stagger: 0.2 }, "-=0.5")
        .to('.msg-line', { duration: 1, opacity: 1, y: 0, stagger: 0.15 }, "-=0.5")
        .to('#continue-btn', { duration: 0.8, opacity: 1, y: 0 }, "-=0.3");

    // Start background animation
    initBackgroundAnimation();

    function initBackgroundAnimation() {
        const colors = ['rgba(255, 100, 120, 0.3)', 'rgba(255, 182, 193, 0.3)', 'rgba(255, 218, 185, 0.3)'];

        for (let i = 0; i < 15; i++) {
            createParticle();
        }

        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('bg-particle');

            // Random size
            const size = Math.random() * 20 + 10;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random color
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            // Random position
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';

            document.body.appendChild(particle);

            // Animate
            const duration = Math.random() * 10 + 10;

            gsap.to(particle, {
                y: -100 - Math.random() * 200,
                x: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 360,
                duration: duration,
                ease: "none",
                repeat: -1,
                yoyo: true, // Float back and forth a bit? No, let's reset
                onRepeat: () => {
                    gsap.set(particle, {
                        y: window.innerHeight + 50,
                        x: Math.random() * window.innerWidth
                    });
                }
            });

            // Separate tween for soft floating movement
            gsap.to(particle, {
                y: `-=${window.innerHeight + 100}`,
                duration: duration,
                ease: "none",
                repeat: -1
            });
        }
    }

    // --- LANDING → MOMENTS ---
    continueBtn.addEventListener('click', () => {
        gsap.to(landingPage, {
            duration: 1,
            opacity: 0,
            y: -50,
            onComplete: () => {
                landingPage.style.display = 'none';
                momentsPage.style.display = 'flex';
                initMoments();
            }
        });
    });

    // --- MOMENTS LOGIC ---
    function initMoments() {
        gsap.to(momentsPage, { opacity: 1, duration: 1 });
        gsap.to('.gallery-header', { opacity: 1, y: 0, delay: 0.3 });
        gsap.to('#to-reason-btn', { opacity: 1, y: 0, delay: 0.5, duration: 1 });

        updateSlider();

        const slider = document.querySelector('.polaroid-slider');
        slider.addEventListener('click', e => {
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            x < rect.width / 2 ? prevSlide() : nextSlide();
        });
    }

    function updateSlider() {
        polaroids.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            let diff = (index - currentIndex + totalSlides) % totalSlides;

            if (diff === 0) {
                card.classList.add('active');
                gsap.to(card, { opacity: 1, scale: 1, x: 0, zIndex: 10 });
            } else if (diff === 1) {
                card.classList.add('next');
                gsap.to(card, { opacity: 0.4, scale: 0.8, x: 250, zIndex: 5 });
            } else if (diff === totalSlides - 1) {
                card.classList.add('prev');
                gsap.to(card, { opacity: 0.4, scale: 0.8, x: -250, zIndex: 5 });
            } else {
                gsap.to(card, { opacity: 0, scale: 0.5, zIndex: 1 });
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // --- MOMENTS → REASONS ---
    toReasonBtn.addEventListener('click', () => {
        gsap.to(momentsPage, {
            opacity: 0, scale: 0.9, duration: 0.8, onComplete: () => {
                momentsPage.style.display = 'none';
                reasonPage.style.display = 'flex';

                // Animate Reason Page
                gsap.to(reasonPage, { opacity: 1, duration: 1 });
                initReasons();
                createHeartExplosion();
            }
        });
    });

    function createHeartExplosion() {
        // simple burst of floating hearts
        const hearts = ['❤️', '💖', '💘', '💝', '💕'];

        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

            // Start from center of screen roughly
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            document.body.appendChild(heart);

            // Random destination
            const destX = (Math.random() - 0.5) * window.innerWidth * 1.5;
            const destY = (Math.random() - 0.5) * window.innerHeight * 1.5;
            const rotation = Math.random() * 720;

            // Animate
            gsap.fromTo(heart,
                { scale: 0, opacity: 1 },
                {
                    x: destX,
                    y: destY,
                    rotation: rotation,
                    scale: Math.random() * 2 + 1,
                    opacity: 0,
                    duration: 1.5 + Math.random(),
                    ease: "power2.out",
                    onComplete: () => heart.remove()
                }
            );
        }
    }

    function initReasons() {
        // --- DATA FOR REASONS ---
        const reasonsData = [
            { img: 'assets/1.jpeg', text: "Because you light up every room you walk into." },
            { img: 'assets/2.jpeg', text: "Because your laugh is my favorite sound." },
            { img: 'assets/3.jpeg', text: "Because you make ordinary moments feel magical." },
            { img: 'assets/4.jpeg', text: "Because you are my best friend." },
            { img: 'assets/5.jpeg', text: "Because I can't imagine my life without you." },
            { img: 'assets/6.jpeg', text: "I love you. Happy Valentine's Day! ❤️" }
        ];

        let currentIndex = 0;
        const photoFrame = document.getElementById('photo-frame');
        const activePhoto = document.getElementById('active-photo');
        const activeText = document.getElementById('active-text');
        const hint = document.querySelector('.photo-frame .hint');
        const restartBtn = document.getElementById('restart-btn');

        // Initial Setup
        if (!activePhoto || !activeText) return;

        activePhoto.src = reasonsData[0].img;
        activeText.innerHTML = reasonsData[0].text;

        // Animate elements in
        gsap.from('.title', { opacity: 0, y: -20, duration: 1, delay: 0.2 });
        gsap.from('.interactive-container', { opacity: 0, scale: 0.9, duration: 1, delay: 0.5 });
        gsap.from('.bg-collage img', { opacity: 0, scale: 0, stagger: 0.1, duration: 1, ease: 'back.out' });

        // --- INTERACTION ---
        if (photoFrame) {
            // Clone to remove old listeners
            const newPhotoFrame = photoFrame.cloneNode(true);
            photoFrame.parentNode.replaceChild(newPhotoFrame, photoFrame);

            const newActivePhoto = newPhotoFrame.querySelector('#active-photo');

            newPhotoFrame.addEventListener('click', () => {
                if (currentIndex >= reasonsData.length - 1) {
                    return; // Reached the end
                }

                // Animate OUT
                gsap.to(newPhotoFrame, {
                    x: 300,
                    opacity: 0,
                    rotation: 20,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        // Update Content
                        currentIndex++;
                        if (newActivePhoto) newActivePhoto.src = reasonsData[currentIndex].img;
                        if (activeText) activeText.innerHTML = reasonsData[currentIndex].text;

                        // If last item (Finale)
                        if (currentIndex === reasonsData.length - 1) {
                            const newHint = newPhotoFrame.querySelector('.hint');
                            if (newHint) newHint.style.display = 'none'; // Hide "Tap me"
                            gsap.to('#restart-btn', { display: 'block', opacity: 1, y: 0, delay: 1 });
                        }

                        // Animate IN
                        gsap.fromTo(newPhotoFrame,
                            { x: -300, opacity: 0, rotation: -20 },
                            { x: 0, opacity: 1, rotation: -2, duration: 0.6, ease: "power2.out" }
                        );

                        // Animate Text
                        gsap.fromTo(activeText,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
                        );
                    }
                });
            });
        }

        if (restartBtn) {
            const newRestartBtn = restartBtn.cloneNode(true);
            restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
            newRestartBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }

});
