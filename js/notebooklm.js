// --- SCROLL PROGRESS ---
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    document.querySelector('.reading-progress').style.width =
        (scrolled / height) * 100 + '%';
});

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

