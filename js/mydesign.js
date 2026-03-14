document.addEventListener("DOMContentLoaded", () => {

    // --- 1. AUDIO SYSTEM ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    // Initialize audio only when the user actually interacts
    function initAudio() {
        if (!audioCtx && AudioContext) {
            audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playClickSound() {
        initAudio();
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        // Clean, deep thump for the coffee/system aesthetic
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    // --- 2. SELECTORS ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const designCards = document.querySelectorAll('.design-card');

    // --- 3. LIGHTBOX LOGIC ---

    // Function to handle closing
    const closeLightbox = () => {
        playClickSound();
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume background scroll
            
            // Delay clearing src to allow the CSS fade-out animation to finish smoothly
            setTimeout(() => { 
                if (lightboxImg) lightboxImg.src = ""; 
            }, 300);
        }
    };

    // Open Lightbox on card click
    if (designCards.length > 0) {
        designCards.forEach(card => {
            card.style.cursor = "pointer"; // Force pointer cursor just in case
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                playClickSound();
                
                const fullImgPath = card.getAttribute('data-full');
                
                if (fullImgPath && lightbox && lightboxImg) {
                    lightboxImg.src = fullImgPath;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Stop background from scrolling
                }
            });
        });
    }

    // Event Listeners for closing
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Only close if clicking the dark background overlay, not the image itself
            if (e.target === lightbox) closeLightbox();
        });
    }

    // ESC key listener for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- 4. GLOBAL UI SOUNDS ---
    // Apply to navigation and other click targets
    document.querySelectorAll('.click-target, .nav-logo, .nav-btn').forEach(el => {
        el.addEventListener('click', playClickSound);
    });

});