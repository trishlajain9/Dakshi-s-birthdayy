/* =========================================================
   FOR DAKSHI — SCRIPT
   Sections:
     1. Step navigation (core engine — works for any # of cards)
     2. Step 1 — Cake / candles
     3. Step 4 — Envelope
     4. Background stars
     5. Init
   To add a new step later:
     - Add a new <section class="card" data-step="N"> in index.html
     - Bump any "goTo(N)" button targets as needed
     - The dot indicators and prev/next buttons update automatically
   ========================================================= */

  
(function () {
  'use strict';

  /* ---------- 0. Passcode gate ---------- */
  const CORRECT_CODE = '3109';
  let enteredDigits = '';

  function renderDigits() {
    const boxes = document.querySelectorAll('#digitBoxes .digit-box');
    boxes.forEach((b, i) => {
      b.classList.toggle('filled', i < enteredDigits.length);
    });
  }

  function pressKey(d) {
    if (enteredDigits.length >= 4) return;
    enteredDigits += d;
    renderDigits();
    if (enteredDigits.length === 4) {
      setTimeout(checkCode, 250);
    }
  }

  function pressBack() {
    enteredDigits = enteredDigits.slice(0, -1);
    renderDigits();
  }

  function checkCode() {
    if (enteredDigits === CORRECT_CODE) {
      unlockGate();
    } else {
      showWrong();
    }
  }

  function showWrong() {
    document.querySelectorAll('#digitBoxes .digit-box').forEach(b => b.classList.add('shake-error'));
    setTimeout(() => {
      document.getElementById('gateEntry').style.display = 'none';
      document.getElementById('gateWrong').style.display = 'block';
    }, 300);
  }

  function resetGate() {
    enteredDigits = '';
    renderDigits();
    document.querySelectorAll('#digitBoxes .digit-box').forEach(b => b.classList.remove('shake-error'));
    document.getElementById('gateWrong').style.display = 'none';
    document.getElementById('gateEntry').style.display = 'block';
  }

  function unlockGate() {
    const gate = document.getElementById('passGate');
    const stageEl = document.getElementById('stage');
    gate.classList.add('unlocked');
    stageEl.style.display = '';
    document.getElementById('prevBtn').style.display = '';
    document.getElementById('nextBtn').style.display = '';
    setTimeout(() => { gate.style.display = 'none'; }, 500);
  }

  /* ---------- 0b. Lock screen yes/no ---------- */
  function showNoView() {
    document.getElementById('askView').style.display = 'none';
    document.getElementById('noView').style.display = 'block';
  }
  function showAskView() {
    document.getElementById('noView').style.display = 'none';
    document.getElementById('askView').style.display = 'block';
  }

  /* ---------- 1. Step navigation ---------- */
  const steps = document.querySelectorAll('.card');
  const total = steps.length;
  let current = 0;

  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function buildDots() {
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' on' : '');
      dotsEl.appendChild(d);
    }
  }

  function goTo(i) {
    if (i < 0 || i >= total) return;
    steps[current].classList.remove('active');
    current = i;
    steps[current].classList.add('active');

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, idx) => d.classList.toggle('on', idx === current));

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function handleNextClick() {
    // Block skipping past the cake step until all candles are blown out.
    const cakeNext = document.getElementById('cakeNext');
    if (current === 2 && cakeNext && cakeNext.disabled) return;
    goTo(current + 1);
  }

  function bindNavEvents() {
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', handleNextClick);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft') goTo(current - 1);
    });
  }

  /* ---------- 2. Step 1 — Cake / candles ---------- */
  let blown = 0;

  function blow(i) {
    const flame = document.querySelector('.f' + i);
    if (!flame || flame.classList.contains('off')) return;

    flame.classList.add('off');
    blown++;

    const msg = document.getElementById('wishMsg');
    const cakeNext = document.getElementById('cakeNext');
    const midMessages = ['nice! keep going 🕯️', 'almost there ✨'];

    if (blown < 3) {
      msg.textContent = midMessages[blown - 1];
    } else {
      msg.textContent = 'make a wish, Dakshi ✨';
      if (cakeNext) cakeNext.disabled = false;
    }
  }

  /* ---------- 3. Step 4 — Envelope ---------- */
  function openEnvelopeN(n) {
    const env = document.getElementById('envMini' + n);
    const note = document.getElementById('miniNote' + n);
    if (!env || env.classList.contains('open')) return;
    env.classList.add('open');
    setTimeout(() => { note.classList.add('show'); }, 300);
  }

  /* ---------- 4. Background stars ---------- */
  function renderStars(count = 26) {
    const starsWrap = document.getElementById('stars');
    const glyphs = ['✦', '✧', '⭐'];

    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'star' + (Math.random() > 0.5 ? ' gold' : '');
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.top = Math.random() * 100 + 'vh';
      s.style.fontSize = (10 + Math.random() * 14) + 'px';
      s.style.animationDelay = (Math.random() * 3) + 's';
      starsWrap.appendChild(s);
    }
  }

  /* ---------- 5. Init ---------- */
  function init() {
    buildDots();
    bindNavEvents();
    renderStars();
    goTo(0);
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose functions used as inline onclick handlers in index.html
  window.goTo = goTo;
  window.blow = blow;
  window.openEnvelopeN = openEnvelopeN;
  window.pressKey = pressKey;
  window.pressBack = pressBack;
  window.resetGate = resetGate;
  window.showNoView = showNoView;
  window.showAskView = showAskView;
})();
