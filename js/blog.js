   // --- SCROLL PROGRESS ---
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolledPercentage = (scrolled / height) * 100;
            document.querySelector('.reading-progress').style.width = scrolledPercentage + '%';
        });

        // --- LIKE BUTTON LOGIC ---
        function toggleLike(element) {
            const icon = element.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                element.style.color = 'var(--accent-bright)';
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                element.style.color = 'var(--text-muted)';
            }
        }

        // --- CLICK SOUND ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playClickSound() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        }

        document.querySelectorAll('.click-target').forEach(el => {
            el.addEventListener('click', playClickSound);
        });
    