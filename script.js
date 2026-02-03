let noClickCount = 0;
const noBtn = document.getElementById('noButton');
const yesBtn = document.getElementById('yesButton');
const questionText = document.getElementById('questionText');
const PASSCODE = "PLACEHOLDER_PASSCODE";
const PHONE_NUMBER = "PLACEHOLDER_PHONE_NUMBER";

async function validatePasscode() {
    const input = document.getElementById('passcode').value;
    const errorMsg = document.getElementById('errorMessage');

    if (input === PASSCODE) {
        startExperience();
    } else {
        errorMsg.classList.remove('hidden');
        document.getElementById('passcode').value = "";
    }
}

function startExperience() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('proposalCard').classList.remove('hidden');
    document.getElementById('floatingCountdown').classList.remove('hidden');
    
    const song = document.getElementById('loveSong');
    song.loop = false;
    song.currentTime = 160;
    song.play().catch(() => console.log("Music file raindance.mp3 missing or blocked."));
    
    song.addEventListener('ended', function() {
        this.currentTime = 160;
        this.play();
    }, false)

    // Safety check for library before firing
    if (window.confetti) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    
    initPetals();
    startCountdown();
}

// NO BUTTON LOGIC
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    noClickCount++;
    noBtn.classList.add('moving');
    
    if (noClickCount >= 2) {
        questionText.innerText = "Are you serious? Click  on that Yes! You're already my GF! 😂🙄";
        yesBtn.classList.add('scale-125');
    }
    moveNoButton();
});

function moveNoButton() {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// YES BUTTON CELEBRATION
yesBtn.addEventListener('click', () => {
    document.getElementById('proposalCard').classList.add('hidden');
    document.getElementById('floatingCountdown').classList.add('hidden');
    document.getElementById('successScreen').classList.remove('hidden');
    if (window.confetti) {
        confetti({ particleCount: 200, spread: 100 });
    }
    
    // Send notification via SMS
    const timestamp = new Date().toLocaleString();
    window.location.href = `sms:${PHONE_NUMBER}?&body=I said YES! ❤️ (${timestamp})`;
});

// COUNTDOWN TIMER FIX
function startCountdown() {
    // Feb 14, 2026
    const target = new Date(2026, 1, 14, 0, 0, 0).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('floatingCountdown').innerText = "HAPPY VALENTINE'S ❤️";
            return;
        }

        document.getElementById('days').innerText = Math.floor(diff / 86400000).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById('mins').innerText = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById('secs').innerText = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

// PETALS ANIMATION
function initPetals() {
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const petals = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        s: Math.random() * 7 + 3, v: Math.random() * 1 + 0.5, a: Math.random() * 360
    }));
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffb7c5';
        petals.forEach(p => {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a * Math.PI/180);
            ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s/2, 0, 0, Math.PI*2); ctx.fill();
            ctx.restore();
            p.y += p.v; p.x += Math.sin(p.y/50); p.a += 0.5;
            if (p.y > canvas.height) p.y = -20;
        });
        requestAnimationFrame(animate);
    }
    animate();
}
