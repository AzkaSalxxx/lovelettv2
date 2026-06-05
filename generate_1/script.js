let digits = [0, 0, 0, 0];
let currentPhoto = 0;
let idx = 0;
let timer;

const $ = (id) => document.getElementById(id);
const cfg = window.CONFIG || CONFIG1;

function setText(id, text) {
  const el = $(id);
  if (el && text !== undefined) el.textContent = text;
}

function initContent() {
  document.title = cfg.brandName?.replace(/[♡♥💕💗]/g, '').trim() || 'Love Lock';
  setText('brandName', cfg.brandName);
  setText('badgeText', cfg.badgeText);
  setText('mainTitle', cfg.mainTitle);
  setText('envelopeTitle', cfg.envelopeTitle);
  setText('letterGreeting', `Dear ${cfg.recipient || 'Kamu'},`);
  setText('signature', cfg.signature || '');
  setText('galleryTitle', cfg.galleryTitle);
  setText('galleryDesc', cfg.galleryDesc);
  setText('footerText', cfg.footerText);
  createFlyingHearts();
}

function renderDials() {
  $('dials').innerHTML = digits.map((d, i) => `
    <div class="dial">
      <button type="button" onclick="step(${i}, 1)">+</button>
      <span class="digit">${d}</span>
      <button type="button" onclick="step(${i}, -1)">-</button>
    </div>
  `).join('');
}

function step(i, n) {
  digits[i] = (digits[i] + n + 10) % 10;
  renderDials();
}

function unlockPadlock() {
  const val = digits.join('');
  if (val === String(cfg.pin)) {
    $('padlock').classList.add('unlocked');
    $('status').textContent = cfg.unlockedText || 'Unlocked!';
    burstHearts(18);
    setTimeout(() => {
      $('lockStage').classList.add('hidden');
      $('envelopeStage').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 950);
  } else {
    $('padlock').classList.add('shake');
    $('status').textContent = cfg.wrongPinText || 'PIN salah, coba lagi.';
    setTimeout(() => $('padlock').classList.remove('shake'), 300);
  }
}

function openEnvelope() {
  $('envelope').classList.add('open');
  setTimeout(openPaper, 850);
}

function openPaper() {
  $('paperModal').classList.remove('hidden');
  $('date').textContent = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  $('typed').textContent = '';
  idx = 0;
  $('skip').classList.remove('hidden');
  $('next').classList.add('hidden');
  typeLetter();
}

function typeLetter() {
  const text = cfg.message || '';
  if (idx <= text.length) {
    $('typed').textContent = text.slice(0, idx++);
    timer = setTimeout(typeLetter, Number(cfg.typeSpeed) || 32);
  } else {
    $('skip').classList.add('hidden');
    $('next').classList.remove('hidden');
  }
}

function skipTyping() {
  clearTimeout(timer);
  $('typed').textContent = cfg.message || '';
  $('skip').classList.add('hidden');
  $('next').classList.remove('hidden');
}

function goToGallery() {
  $('paperModal').classList.add('hidden');
  $('collage').classList.remove('hidden');
  renderPhotos();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function isImage(src) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(String(src));
}

function photoHTML(item) {
  const src = typeof item === 'string' ? item : item.src;
  const caption = typeof item === 'string' ? 'Foto' : (item.caption || 'Foto');
  return isImage(src) ? `<img src="${src}" alt="${caption}">` : src;
}

function renderPhotos() {
  const photos = cfg.photos || [];
  $('photoGrid').innerHTML = photos.map((p, i) => `
    <div class="polaroid" style="--r:${[-4, 3, -2, 5, -5, 2][i % 6]}deg" onclick="showPhoto(${i})">
      <div class="photo">${photoHTML(p)}</div>
      <p class="caption">${typeof p === 'string' ? 'Foto' : (p.caption || 'Foto')}</p>
    </div>
  `).join('');
}

function showPhoto(index) {
  const photos = cfg.photos || [];
  if (!photos.length) return;
  currentPhoto = (index + photos.length) % photos.length;
  const p = photos[currentPhoto];
  $('bigPhoto').innerHTML = photoHTML(p);
  $('bigCap').textContent = typeof p === 'string' ? 'Foto' : (p.caption || 'Foto');
  $('counter').textContent = `${currentPhoto + 1} / ${photos.length}`;
  $('lightbox').classList.remove('hidden');
}

function createFlyingHearts() {
  const heartsCfg = cfg.hearts || {};
  if (heartsCfg.enabled === false) return;
  const wrap = $('flyingHearts');
  const symbols = heartsCfg.symbols || ['♡', '♥', '💕', '💗'];
  const amount = Number(heartsCfg.amount) || 24;
  wrap.innerHTML = '';
  for (let i = 0; i < amount; i++) {
    const h = document.createElement('span');
    h.className = 'fly-heart';
    h.textContent = symbols[i % symbols.length];
    h.style.left = `${Math.random() * 100}%`;
    h.style.setProperty('--s', `${14 + Math.random() * 22}px`);
    h.style.setProperty('--d', `${7 + Math.random() * 9}s`);
    h.style.setProperty('--delay', `${Math.random() * 8}s`);
    h.style.setProperty('--x', `${-80 + Math.random() * 160}px`);
    wrap.appendChild(h);
  }
}

function burstHearts(amount = 12) {
  const wrap = $('flyingHearts');
  for (let i = 0; i < amount; i++) {
    const h = document.createElement('span');
    h.className = 'fly-heart';
    h.textContent = '💖';
    h.style.left = `${42 + Math.random() * 16}%`;
    h.style.setProperty('--s', `${22 + Math.random() * 22}px`);
    h.style.setProperty('--d', `${2 + Math.random() * 2}s`);
    h.style.setProperty('--delay', '0s');
    h.style.setProperty('--x', `${-130 + Math.random() * 260}px`);
    wrap.appendChild(h);
    setTimeout(() => h.remove(), 4500);
  }
}

$('unlock').addEventListener('click', unlockPadlock);
$('envelope').addEventListener('click', openEnvelope);
$('envelope').addEventListener('keydown', (e) => { if (e.key === 'Enter') openEnvelope(); });
$('skip').addEventListener('click', skipTyping);
$('next').addEventListener('click', goToGallery);
$('prevPhoto').addEventListener('click', () => showPhoto(currentPhoto - 1));
$('nextPhoto').addEventListener('click', () => showPhoto(currentPhoto + 1));
$('closeLightbox').addEventListener('click', () => $('lightbox').classList.add('hidden'));

document.addEventListener('keydown', (e) => {
  if (!$('lightbox').classList.contains('hidden')) {
    if (e.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (e.key === 'ArrowRight') showPhoto(currentPhoto + 1);
    if (e.key === 'Escape') $('lightbox').classList.add('hidden');
  }
});

initContent();
renderDials();
