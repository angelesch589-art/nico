/* ==========================================================================
   PERSONALIZA AQUÍ TU CARTA ROMÁNTICA
   (Solo cambia el texto dentro de las comillas invertidas `...`)
   ========================================================================== */
const CARTA_ROMANTICA = `Mi amor,

Desde que llegaste a mi vida, todo tiene un brillo distinto. Hoy quise prepararte este pequeño detalle digital para recordarte lo muchísimo que significas para mí. Gracias por cada momento compartido, por cada sonrisa, por tu paciencia y por todo el cariño que me demuestras todos los días.

Sé que no soy una persona fácil de tratar y que hay veces en que digo o hago cosas que te lastiman, por lo que te pido una disculpa de corazón. A veces digo cosas que no reflejan lo que realmente siento; por ejemplo, cuando llego a decir "quedemos como amigos", la verdad es que no podría ser amiga de alguien que me hace sentir tantas cosas hermosas. No puedo ser amiga de la persona que hace que espere con tantas ansias un mensaje suyo o que llegue la noche para poder hablar. Como mencioné al principio, sé que no es sencillo lidiar conmigo, pero te prometo esforzarme en mejorar mis defectos y cambiar aquellas actitudes o palabras que no están bien.

Amo pasar tiempo contigo. En cada llamada que hacemos nunca faltan las risas, ni tampoco las personas que de la nada quieren entrar a tu casa (JSJSJSJJSJSJSJSJ). Esos momentos hacen que mis noches sean las mejores. Quizá no soy la mejor persona expresando mi cariño con palabras, pero quiero que sepas que siempre me divierto muchísimo contigo y deseo seguir haciéndolo por mucho tiempo más.

En fin, te amo un montón y en muy poco tiempo te has convertido en mi persona favorita. 

Te amo, mi póster de luz.`;


/* ==========================================================================
   MOTOR DE AUDIO SINTETIZADO (Web Audio API - Funciona en PC y Celulares)
   ========================================================================== */
class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.musicTimer = null;
    this.noteIndex = 0;
    // Melodía romántica suave en arpegio (Frecuencias en Hz)
    this.melody = [
      261.63, 329.63, 392.00, 493.88, // Cmaj7
      220.00, 261.63, 329.63, 392.00, // Am7
      174.61, 220.00, 261.63, 349.23, // Fmaj7
      196.00, 246.94, 293.66, 392.00  // G6
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMusic() {
    this.init();
    this.isMuted = !this.isMuted;
    const icon = document.getElementById('audio-icon');
    const label = document.getElementById('audio-label');

    if (!this.isMuted) {
      icon.textContent = '🔊';
      label.textContent = 'Música Activa';
      this.startBackgroundMusic();
      this.playTone(523.25, 'sine', 0.25, 0.08);
    } else {
      icon.textContent = '🔇';
      label.textContent = 'Activar Música';
      this.stopBackgroundMusic();
    }
  }

  ensureStartedOnInteraction() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startBackgroundMusic() {
    if (this.musicTimer) return;
    this.musicTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = this.melody[this.noteIndex % this.melody.length];
      this.playTone(freq, 'sine', 1.4, 0.045);
      this.noteIndex++;
    }, 650);
  }

  stopBackgroundMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playTone(freq, type = 'sine', duration = 0.3, volume = 0.1) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sonidos distintos para cada botón y transición
  playYesSound() {
    this.ensureStartedOnInteraction();
    if (this.isMuted) return;
    this.playTone(523.25, 'triangle', 0.25, 0.12); // Do
    setTimeout(() => this.playTone(659.25, 'triangle', 0.25, 0.12), 90); // Mi
    setTimeout(() => this.playTone(783.99, 'triangle', 0.45, 0.14), 180); // Sol
  }

  playNoSound() {
    this.ensureStartedOnInteraction();
    if (this.isMuted) return;
    this.playTone(311.13, 'sawtooth', 0.22, 0.07);
    setTimeout(() => this.playTone(261.63, 'sawtooth', 0.35, 0.07), 120);
  }

  playBackSound() {
    this.ensureStartedOnInteraction();
    if (this.isMuted) return;
    this.playTone(392.00, 'sine', 0.18, 0.1);
    setTimeout(() => this.playTone(523.25, 'sine', 0.25, 0.1), 100);
  }

  playTransitionWhoosh() {
    if (this.isMuted || !this.ctx) return;
    this.playTone(440, 'sine', 0.8, 0.05);
  }
}

const audioEngine = new RomanticAudioEngine();


/* ==========================================================================
   GESTIÓN DE NAVEGACIÓN ENTRE PANTALLAS
   ========================================================================== */
const screens = {
  hacker: document.getElementById('screen-hacker'),
  universe: document.getElementById('screen-universe'),
  gift: document.getElementById('screen-gift'),
  sad: document.getElementById('screen-sad'),
  letter: document.getElementById('screen-letter')
};

let activeAnimationId = null;
let typewriterInterval = null;

function showScreen(targetKey) {
  Object.values(screens).forEach(sec => sec.classList.remove('active'));
  screens[targetKey].classList.add('active');
  audioEngine.playTransitionWhoosh();
}


/* ==========================================================================
   ETAPA 1: LLUVIA HACKER DE CORAZONES Y CÓDIGOS ROSA/ROJO
   ========================================================================== */
function startHackerStage() {
  showScreen('hacker');
  const canvas = document.getElementById('hacker-canvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('terminal-status');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const symbols = ['♥', '❤', '♡', '0', '1', 'A', 'M', 'O', 'R', '♥', '✦', '7', '9'];
  const colors = ['#ff1e56', '#ff4d8d', '#ff75b5', '#b5179e', '#ff0a54'];
  const fontSize = 18;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1).map(() => Math.random() * -40);

  const messages = [
    '> INICIANDO SISTEMA CORAZÓN_OS v2.0...',
    '> DESCIFRANDO SENTIMIENTOS OCULTOS...',
    '> ACCESO CONCEDIDO: MI PERSONA FAVORITA ♥'
  ];
  let msgIdx = 0;
  const msgTimer = setInterval(() => {
    msgIdx++;
    if (messages[msgIdx]) statusEl.textContent = messages[msgIdx];
  }, 1500);

  let lastTime = 0;
  const fpsInterval = 42;

  function drawMatrix(timestamp) {
    activeAnimationId = requestAnimationFrame(drawMatrix);
    if (timestamp - lastTime < fpsInterval) return;
    lastTime = timestamp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.965) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    ctx.shadowBlur = 0;
  }

  activeAnimationId = requestAnimationFrame(drawMatrix);

  // Después de 4.6 segundos pasa fluidamente al Universo
  setTimeout(() => {
    clearInterval(msgTimer);
    cancelAnimationFrame(activeAnimationId);
    window.removeEventListener('resize', resize);
    startUniverseStage();
  }, 4600);
}


/* ==========================================================================
   ETAPA 2: UNIVERSO, CORAZÓN DE PARTÍCULAS Y EXPLOSIÓN
   ========================================================================== */
function startUniverseStage() {
  showScreen('universe');
  const canvas = document.getElementById('universe-canvas');
  const ctx = canvas.getContext('2d');
  const titleEl = document.getElementById('universe-title');
  titleEl.classList.remove('visible');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + 25;

  // Estrellas de fondo y anillo galáctico
  const stars = Array.from({ length: 240 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  }));

  // Partículas que forman el corazón en el centro
  const heartParticles = [];
  const totalParticles = 520;
  const scale = Math.min(canvas.width, canvas.height) * 0.015;

  for (let i = 0; i < totalParticles; i++) {
    const t = (Math.PI * 2 * i) / totalParticles;
    // Ecuación paramétrica de corazón
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const targetX = cx + hx * scale + (Math.random() - 0.5) * 14;
    const targetY = cy + hy * scale + (Math.random() - 0.5) * 14;

    const palette = ['#ff1e56', '#ff6ec7', '#c77dff', '#72efdd', '#ffffff'];
    const color = palette[Math.floor(Math.random() * palette.length)];

    heartParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: targetX,
      ty: targetY,
      vx: 0,
      vy: 0,
      size: Math.random() * 2.8 + 1.2,
      color
    });
  }

  let phase = 'forming'; // 'forming' -> 'exploding'
  setTimeout(() => {
    titleEl.classList.add('visible');
  }, 1100);

  // Detonar explosión a los 3.3 segundos
  setTimeout(() => {
    phase = 'exploding';
    audioEngine.playYesSound();
    heartParticles.forEach(p => {
      const angle = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 0.5;
      const force = Math.random() * 14 + 4;
      p.vx = Math.cos(angle) * force;
      p.vy = Math.sin(angle) * force;
    });
  }, 3300);

  // Pasar a la pantalla del regalo kawaii a los 5.2 segundos
  setTimeout(() => {
    cancelAnimationFrame(activeAnimationId);
    showScreen('gift');
  }, 5200);

  function animateUniverse() {
    activeAnimationId = requestAnimationFrame(animateUniverse);
    ctx.fillStyle = 'rgba(6, 1, 12, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nebulosa galáctica central
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, canvas.width * 0.48);
    grad.addColorStop(0, 'rgba(255, 110, 199, 0.16)');
    grad.addColorStop(0.5, 'rgba(114, 9, 183, 0.09)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas
    stars.forEach(s => {
      s.alpha += s.speed;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(s.alpha) * 0.5})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dibujar partículas del corazón
    heartParticles.forEach(p => {
      if (phase === 'forming') {
        p.x += (p.tx - p.x) * 0.065;
        p.y += (p.ty - p.y) * 0.065;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
      }

      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  activeAnimationId = requestAnimationFrame(animateUniverse);
}


/* ==========================================================================
   ETAPAS 3 Y 4: INTERACCIONES DE LOS BOTONES KAWAII
   ========================================================================== */
document.getElementById('btn-no').addEventListener('click', () => {
  audioEngine.playNoSound();
  showScreen('sad');
});

document.getElementById('btn-back').addEventListener('click', () => {
  audioEngine.playBackSound();
  showScreen('gift');
});

document.getElementById('btn-yes').addEventListener('click', () => {
  audioEngine.playYesSound();
  // Si el usuario aún no activó la música, la activamos suavemente al abrir el regalo
  if (audioEngine.isMuted) {
    audioEngine.toggleMusic();
  }
  startLetterStage();
});


/* ==========================================================================
   ETAPA 5: CARTA ROMÁNTICA CON CORAZONES FLOTANTES Y EFECTO ESCRITURA
   ========================================================================== */
function startLetterStage() {
  showScreen('letter');
  startFloatingHearts();
  runTypewriter(CARTA_ROMANTICA);
}

function runTypewriter(text) {
  const target = document.getElementById('typewriter-target');
  const cursor = document.getElementById('typing-cursor');
  target.textContent = '';
  cursor.style.display = 'inline-block';

  if (typewriterInterval) clearInterval(typewriterInterval);
  let i = 0;

  typewriterInterval = setInterval(() => {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typewriterInterval);
      cursor.style.display = 'none';
    }
  }, 34); // Velocidad natural de escritura
}

function startFloatingHearts() {
  const canvas = document.getElementById('letter-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const items = Array.from({ length: 48 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 14 + 8,
    speedY: Math.random() * 0.8 + 0.3,
    sway: Math.random() * 1.5,
    angle: Math.random() * Math.PI * 2,
    isHeart: Math.random() > 0.35,
    color: Math.random() > 0.5 ? 'rgba(255, 30, 86, 0.55)' : 'rgba(255, 110, 199, 0.55)'
  }));

  function animateHearts() {
    if (!screens.letter.classList.contains('active')) return;
    requestAnimationFrame(animateHearts);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach(item => {
      item.y -= item.speedY;
      item.angle += 0.02;
      item.x += Math.sin(item.angle) * 0.45;

      if (item.y < -30) {
        item.y = canvas.height + 20;
        item.x = Math.random() * canvas.width;
      }

      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 10;

      if (item.isHeart) {
        ctx.font = `${item.size}px serif`;
        ctx.fillText('♥', item.x, item.y);
      } else {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(animateHearts);
}

// Botón INICIO para volver a vivir toda la experiencia desde cero
document.getElementById('btn-restart').addEventListener('click', () => {
  audioEngine.playBackSound();
  if (typewriterInterval) clearInterval(typewriterInterval);
  startHackerStage();
});

// Control global de audio
document.getElementById('audio-toggle').addEventListener('click', () => {
  audioEngine.toggleMusic();
});

// Iniciar la experiencia automáticamente al cargar
window.addEventListener('DOMContentLoaded', () => {
  startHackerStage();
});
