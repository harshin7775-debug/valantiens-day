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

    // --- LANDING → MOMENTS ---
    continueBtn.addEventListener('click', () => {
        gsap.to(landingPage, {
            duration: 1,
            opacity: 0,
            y: -50,
            onComplete: () => {
                landingPage.style.display = 'none';
                momentsPage.classList.remove('hidden');
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

    // --- MOMENTS → GAME ---
    const gamePage = document.getElementById('game-page');
    // toReasonBtn is now effectively "To Game Btn"

    toReasonBtn.addEventListener('click', () => {
        gsap.to(momentsPage, {
            duration: 1,
            opacity: 0,
            y: -50,
            onComplete: () => {
                momentsPage.style.display = 'none';
                gamePage.style.display = 'flex';
                gsap.to(gamePage, { opacity: 1, duration: 1 });
                initGame();
            }
        });
    });

    // --- GAME LOGIC ---
    function initGame() {
        let score = 0;
        const targetScore = 5; // Reduced from 10
        const gameArea = document.getElementById('game-area');
        const scoreDisplay = document.getElementById('score');
        const continueBtn = document.getElementById('game-continue-btn');
        let gameActive = true;
        let spawnInterval;

        // Update instruction text dynamically if needed, or just rely on HTML update
        document.querySelector('.message-text').innerHTML = 'Catch <span style="color:var(--accent-solid); font-weight:bold;">5 Hearts</span> to unlock the key to my heart! ❤️';
        document.querySelector('.score-board').innerHTML = 'Score: <span id="score">0</span> / 5';

        const funnyMessages = ["Gotcha!", "Mine!", "Love u!", "Cutie!", "Ouch!", "Yay!"];

        function spawnHeart() {
            if (!gameActive) return;

            const heart = document.createElement('div');
            heart.classList.add('heart-target');
            heart.textContent = ['❤️', '💖', '💝', '💕', '😻'][Math.floor(Math.random() * 5)];

            // Random Position
            const x = Math.random() * (gameArea.clientWidth - 80); // Adjusted for bigger size
            heart.style.left = `${x}px`;
            heart.style.bottom = '-80px';

            // Slower speed (larger duration)
            const duration = 4 + Math.random() * 3; // 4-7 seconds
            heart.style.animationDuration = `${duration}s`;

            // Bigger size via style if not in CSS
            heart.style.fontSize = `${3 + Math.random()}rem`; // Random big sizes

            gameArea.appendChild(heart);

            // Interaction
            heart.addEventListener('click', () => {
                if (!gameActive) return;

                // Pop effect
                const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
                createPop(heart.offsetLeft, heart.offsetTop, msg);
                heart.remove();

                score++;
                // Update score display if element exists
                const scoreSpan = document.getElementById('score');
                if (scoreSpan) scoreSpan.textContent = score;

                if (score >= targetScore) {
                    endGame();
                }
            });

            // Cleanup if missed
            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, duration * 1000);
        }

        function createPop(x, y, text) {
            const pop = document.createElement('div');
            pop.classList.add('heart-pop');
            pop.textContent = text;
            pop.style.left = `${x}px`;
            pop.style.top = `${y}px`;
            pop.style.fontSize = '1.2rem';
            pop.style.fontWeight = 'bold';
            pop.style.color = '#fff';
            gameArea.appendChild(pop);
            setTimeout(() => pop.remove(), 800);
        }

        function endGame() {
            gameActive = false;
            clearInterval(spawnInterval);
            document.querySelectorAll('.heart-target').forEach(h => h.remove());

            gsap.to('.message-text', {
                innerHTML: "YAY! You caught my heart! 🗝️",
                color: "#fff",
                scale: 1.1,
                duration: 0.5
            });

            continueBtn.style.display = 'block';
            gsap.from(continueBtn, { opacity: 0, y: 20, duration: 1, ease: "back.out" });
        }

        spawnInterval = setInterval(spawnHeart, 800); // Slower spawn rate

        // --- GAME → REASONS ---
        continueBtn.addEventListener('click', () => {
            gsap.to(gamePage, {
                duration: 1,
                opacity: 0,
                y: -50,
                onComplete: () => {
                    gamePage.style.display = 'none';
                    reasonPage.style.display = 'flex';
                    gsap.to(reasonPage, { opacity: 1, duration: 1 });
                    initReasons();
                }
            });
        });
    }

    function initReasons() {
        // --- DATA FOR REASONS ---
        const reasonsData = [
            { img: 'assets/moment1.png', text: "Because you light up every room you walk into." },
            { img: 'assets/moment2.png', text: "Because your laugh is my favorite sound." },
            { img: 'assets/moment3.png', text: "Because you make ordinary moments feel magical." },
            { img: 'assets/moment4.png', text: "Because you are my best friend." },
            { img: 'assets/moment5.png', text: "Because I can't imagine my life without you." },
            { img: 'assets/moment6.png', text: "I love you. Happy Valentine's Day! ❤️" }
        ];

        let currentIndex = 0;
        const photoFrame = document.getElementById('photo-frame');
        const activePhoto = document.getElementById('active-photo');
        const activeText = document.getElementById('active-text');
        const hint = document.querySelector('.photo-frame .hint');
        const restartBtn = document.getElementById('restart-btn');

        // Initial Setup
        activePhoto.src = reasonsData[0].img;
        activeText.innerHTML = reasonsData[0].text;

        // Animate elements in
        gsap.from('.title', { opacity: 0, y: -20, duration: 1, delay: 0.2 });
        gsap.from('.interactive-container', { opacity: 0, scale: 0.9, duration: 1, delay: 0.5 });
        gsap.from('.bg-collage img', { opacity: 0, scale: 0, stagger: 0.1, duration: 1, ease: 'back.out' });

        // --- INTERACTION ---
        photoFrame.addEventListener('click', () => {
            if (currentIndex >= reasonsData.length - 1) {
                return; // Reached the end
            }

            // Animate OUT
            gsap.to(photoFrame, {
                x: 300,
                opacity: 0,
                rotation: 20,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    // Update Content
                    currentIndex++;
                    activePhoto.src = reasonsData[currentIndex].img;
                    activeText.innerHTML = reasonsData[currentIndex].text;

                    // If last item (Finale)
                    if (currentIndex === reasonsData.length - 1) {
                        if (hint) hint.style.display = 'none'; // Hide "Tap me"
                        gsap.to('#restart-btn', { display: 'block', opacity: 1, y: 0, delay: 1 });
                    }

                    // Animate IN
                    gsap.fromTo(photoFrame,
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

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }

});
