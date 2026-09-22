// Flashcard page

(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('contrast');
  const contrast = CONTRASTS.find(c => c.id === id) || CONTRASTS[0];

  const sheet = document.getElementById('sheet');
  const titleEl = document.getElementById('fcTitle');
  const subEl = document.getElementById('fcSubtitle');
  const sizeToggle = document.querySelector('.size-toggle');
  const printBtn = document.getElementById('printBtn');
  const gamesGrid = document.getElementById('gamesGrid');

  titleEl.textContent = contrast.title;
  subEl.textContent = `${contrast.category} · ${contrast.description}`;
  document.title = `${contrast.title} — Flashcards`;

  function renderCards() {
    sheet.style.setProperty('--card-color', contrast.color);
    sheet.innerHTML = contrast.pairs.map(p => `
      <div class="pair">
        <div class="card a" style="--card-color:${contrast.color}">
          <span class="tag">A</span>
          <div class="emoji">${Yapla.pic(p.a.emoji)}</div>
          <div class="word">${p.a.word}</div>
        </div>
        <div class="card b" style="--card-color:${contrast.color}">
          <span class="tag">B</span>
          <div class="emoji">${Yapla.pic(p.b.emoji)}</div>
          <div class="word">${p.b.word}</div>
        </div>
      </div>
    `).join('');
  }

  function renderGames() {
    const exA = contrast.pairs[0]?.a.word ?? 'word A';
    const exB = contrast.pairs[0]?.b.word ?? 'word B';
    gamesGrid.innerHTML = GAMES.map(g => `
      <article class="game-card" style="--card-color:${contrast.color}">
        <div class="game-top">
          <div class="game-icon">${g.icon}</div>
          <div>
            <h3>${g.title}</h3>
            <div class="game-focus">${g.focus}</div>
          </div>
        </div>
        <p class="game-body">${g.body}</p>
        <div class="game-example">Try with <strong>${exA}</strong> &amp; <strong>${exB}</strong></div>
        <a class="game-print-btn" href="game.html?contrast=${encodeURIComponent(contrast.id)}&game=${encodeURIComponent(g.id)}">🖨️ Print game sheet →</a>
      </article>
    `).join('');
  }

  sizeToggle.addEventListener('click', e => {
    const btn = e.target.closest('button[data-size]');
    if (!btn) return;
    sizeToggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    sheet.classList.remove('size-large', 'size-medium', 'size-small');
    sheet.classList.add('size-' + btn.dataset.size);
  });

  printBtn.addEventListener('click', () => window.print());

  renderCards();
  renderGames();
})();
