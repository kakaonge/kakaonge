
// --- 1. HERO TEXT DISTORTION (COFFEE THEME LOGIC) ---
const filter = document.querySelector('#distortionFilter feTurbulence');
let primitiveValues = { turbulence: 0 };
let targetTurbulence = 0;

document.addEventListener('mousemove', (e) => {
    const speed = Math.sqrt(e.movementX**2 + e.movementY**2);
    targetTurbulence = Math.min(speed * 0.005, 0.08); 
});

function animateDistortion() {
    primitiveValues.turbulence += (targetTurbulence - primitiveValues.turbulence) * 0.1;
    filter.setAttribute('baseFrequency', `0 ${primitiveValues.turbulence}`);
    targetTurbulence = 0; 
    requestAnimationFrame(animateDistortion);
}
animateDistortion();

// --- 2. CLICK SOUND EFFECT (COFFEE THEME PITCH) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    // Adjusted pitch to match the deep coffee vibe (300Hz -> 50Hz)
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

document.querySelectorAll('.click-target').forEach(el => {
    el.addEventListener('click', () => {
        playClickSound();
    });
});