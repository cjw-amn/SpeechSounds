// Library / overview page

(function () {
  const grid = document.getElementById('grid');
  const filtersEl = document.getElementById('filters');
  const searchEl = document.getElementById('search');
  const heroStats = document.getElementById('heroStats');

  let activeCat = 'all';
  let query = '';

  // Build category chips
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.cat = cat;
    btn.textContent = cat;
    filtersEl.insertBefore(btn, filtersEl.querySelector('.search'));
  });

  // Hero stats
  const totalPairs = CONTRASTS.reduce((n, c) => n + c.pairs.length, 0);
  heroStats.innerHTML = `
    <span class="stat">${CONTRASTS.length} contrasts</span>
    <span class="stat">${CATEGORIES.length} categories</span>
    <span class="stat">${totalPairs} pairs</span>
  `;

  function render() {
    const q = query.trim().toLowerCase();
    const list = CONTRASTS.filter(c => {
      if (activeCat !== 'all' && c.category !== activeCat) return false;
      if (!q) return true;
      if (c.title.toLowerCase().includes(q)) return true;
      if (c.category.toLowerCase().includes(q)) return true;
      if (c.description.toLowerCase().includes(q)) return true;
      return c.pairs.some(p =>
        p.a.word.toLowerCase().includes(q) || p.b.word.toLowerCase().includes(q)
      );
    });

    if (!list.length) {
      grid.innerHTML = `<div class="empty">No contrasts match your search.</div>`;
      return;
    }

    grid.innerHTML = list.map(c => {
      const examples = c.pairs.slice(0, 3).map(p =>
        `<span class="ex">${p.a.word} · ${p.b.word}</span>`
      ).join('');
      return `
        <a class="contrast-card" style="--card-color:${c.color}" href="flashcards.html?contrast=${encodeURIComponent(c.id)}">
          <div class="row">
            <span class="cat">${c.category}</span>
            <span class="count">${c.pairs.length} pairs</span>
          </div>
          <h3>${c.title}</h3>
          <div class="desc">${c.description}</div>
          <div class="examples">${examples}</div>
        </a>
      `;
    }).join('');
  }

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    filtersEl.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b === btn));
    render();
  });

  searchEl.addEventListener('input', e => {
    query = e.target.value;
    render();
  });

  render();
})();
