document.addEventListener("DOMContentLoaded", () => {
        
    // --- 0. SMOOTH SCROLL (LENIS API) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // --- 1. PRELOADER, CAPTCHA & SESSION STORAGE LOGIC ---
    const preloader = document.getElementById('preloader');
    const robotCheck = document.getElementById('robot-check');
    const waveText = document.querySelector('.wave-text');

    // Check if the user has already passed the captcha this session
    if (sessionStorage.getItem('kakaPreloaderSeen') === 'true') {
        // User already verified: Hide preloader instantly, allow scroll
        if (preloader) preloader.style.display = 'none';
        document.body.style.overflowY = 'auto'; // Just in case CSS locked it
        if (waveText) waveText.classList.add('wave-active');
        // We do NOT stop lenis here because they skip the preloader
    } else {
        // First time visit: Lock scroll and wait for verification
        lenis.stop();

        if (robotCheck) {
            robotCheck.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Save to session storage so it doesn't show again
                    sessionStorage.setItem('kakaPreloaderSeen', 'true');
                    
                    setTimeout(() => {
                        preloader.classList.add('fade-out');
                        setTimeout(() => {
                            preloader.style.display = 'none'; // Remove from DOM flow
                            document.body.style.overflowY = 'auto'; // Unlock native CSS scroll
                            lenis.start(); // Unlock smooth scroll
                            if (waveText) waveText.classList.add('wave-active'); 
                        }, 600); 
                    }, 400);
                }
            });
        }
    }

    // --- 2. HERO TEXT DISTORTION ---
    const filter = document.querySelector('#distortionFilter feTurbulence');
    if (filter) {
        let primitiveValues = { turbulence: 0 };
        let targetTurbulence = 0;

        document.addEventListener('mousemove', (e) => {
            const speed = Math.sqrt(e.movementX**2 + e.movementY**2);
            targetTurbulence = Math.min(speed * 0.005, 0.08); 
        });

        function animateDistortion() {
            primitiveValues.turbulence += (targetTurbulence - primitiveValues.turbulence) * 0.1;
            filter.setAttribute('baseFrequency', `0 ${primitiveValues.turbulence}`);
            targetTurbulence *= 0.95; 
            requestAnimationFrame(animateDistortion);
        }
        animateDistortion();
    }

    // --- 3. HAMBURGER MENU LOGIC ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }

    // --- 4. GSAP HORIZONTAL SCROLL ---
    if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
        
        const section = document.querySelector(".gallery-wrap");
        const track = document.querySelector(".gallery-track");
        
        if (section && track) {
            let tween = gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: "none"
            });

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: () => "+=" + (track.scrollWidth - window.innerWidth), 
                pin: true,
                animation: tween,
                scrub: 1, // Let Lenis handle the smoothing, keep GSAP scrub tight
                invalidateOnRefresh: true 
            });
        }
    }
});