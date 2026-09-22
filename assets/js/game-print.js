// Print-friendly game material renderer.
// Produces a single-page handout for a (contrast, game) combination.

(function () {
  const params = new URLSearchParams(location.search);
  const contrast = CONTRASTS.find(c => c.id === params.get('contrast')) || CONTRASTS[0];
  const game = GAMES.find(g => g.id === params.get('game')) || GAMES[0];

  const page = document.getElementById('page');
  document.documentElement.style.setProperty('--card-color', contrast.color);
  page.style.setProperty('--card-color', contrast.color);

  document.title = `${game.title} — ${contrast.title}`;
  document.getElementById('gTitle').textContent = `${game.title} — ${contrast.title}`;
  document.getElementById('gSubtitle').textContent = `${game.focus} · printable game sheet`;
  document.getElementById('backBtn').href = `flashcards.html?contrast=${encodeURIComponent(contrast.id)}`;
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // ---- Helpers ---------------------------------------------------------------
  function sounds() {
    // Parse "P vs B", "K vs T (Fronting)", "Short A vs Short E" → ["P","B"] etc.
    const t = contrast.title.replace(/\(.*?\)/, '').trim();
    const parts = t.split(/\s+vs\s+/i).map(s => s.trim());
    return parts.length === 2 ? parts : [contrast.title, ''];
  }
  function exA() { return contrast.pairs[0].a; }
  function exB() { return contrast.pairs[0].b; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function header(howTo) {
    const [sA, sB] = sounds();
    return `
      <div class="sheet-head" style="--card-color:${contrast.color}">
        <div style="display:flex; gap:14px; align-items:flex-start;">
          <div class="game-icon-lg">${game.icon}</div>
          <div>
            <h1>${esc(game.title)}</h1>
            <div class="meta"><strong>${esc(contrast.title)}</strong> · ${esc(contrast.category)} · ${esc(game.focus)}</div>
          </div>
        </div>
        <div class="target-chip">${esc(sA)} ↔ ${esc(sB)}</div>
      </div>
      <div class="how-to" style="--card-color:${contrast.color}">
        <strong>How to play</strong>
        ${esc(howTo)}
      </div>
    `;
  }

  // ---- Renderers per game ----------------------------------------------------

  const renderers = {

    'listen-point': () => {
      const rows = contrast.pairs.map(p => `
        <tr>
          <td class="emoji">${Yapla.pic(p.a.emoji)}</td><td class="word">${esc(p.a.word)}</td>
          <td class="box"></td><td class="box"></td><td class="box"></td><td class="box"></td><td class="box"></td>
          <td class="box"></td>
        </tr>
        <tr>
          <td class="emoji">${Yapla.pic(p.b.emoji)}</td><td class="word">${esc(p.b.word)}</td>
          <td class="box"></td><td class="box"></td><td class="box"></td><td class="box"></td><td class="box"></td>
          <td class="box"></td>
        </tr>
      `).join('');
      return header('Lay out the cards. Say one of the target words clearly; the child points to the matching picture. Tick a box for each correct response across five trials.') + `
        <table class="tracker">
          <thead><tr><th colspan="2">Word</th><th>T1</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>Total /5</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:18px; font-size:13px; color:var(--ink-soft);">Notes: __________________________________________________________________</p>
        <p style="font-size:13px; color:var(--ink-soft);">________________________________________________________________________</p>
      `;
    },

    'sort-sounds': () => {
      const [sA, sB] = sounds();
      return header('Mix the cards together. The child places each card in the matching column, saying the word aloud. Use the example pictures as a sound anchor.') + `
        <div class="sort-mat">
          <div class="sort-col" style="--card-color:${contrast.color}">
            <h3>${esc(sA)}</h3>
            <div class="ex">${Yapla.pic(exA().emoji)}</div>
            <div class="ex-word">${esc(exA().word)}</div>
            <div class="place-here">place ${esc(sA)} cards here</div>
          </div>
          <div class="sort-col" style="--card-color:${contrast.color}">
            <h3>${esc(sB)}</h3>
            <div class="ex">${Yapla.pic(exB().emoji)}</div>
            <div class="ex-word">${esc(exB().word)}</div>
            <div class="place-here">place ${esc(sB)} cards here</div>
          </div>
        </div>
      `;
    },

    'memory-match': () => {
      return header('Print two copies of the flashcards. Place all cards face-down in a grid. Players take turns flipping two. On a match, say the word three times and keep the pair. Most pairs wins.') + `
        <div class="score-row">
          <div class="score-box">
            <div class="label">Player 1</div>
            <div class="name-line"></div>
            <div class="label">Pairs found</div>
            <div class="tally-grid">${'<span></span>'.repeat(10)}</div>
          </div>
          <div class="score-box">
            <div class="label">Player 2</div>
            <div class="name-line"></div>
            <div class="label">Pairs found</div>
            <div class="tally-grid">${'<span></span>'.repeat(10)}</div>
          </div>
        </div>
        <h3 style="font-size:14px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-soft); margin:18px 0 8px;">Word reference</h3>
        <div class="word-list">${wordList()}</div>
      `;
    },

    'go-fish': () => {
      return header('Print two copies of the flashcards. Deal 5 to each player; rest face-down. Take turns asking with the full sentence. Match in your hand? Make a pair. If not — "Go fish!"') + `
        <div class="request-strip" style="--card-color:${contrast.color}">
          <span class="em">🐟</span>
          <span>"Do you have a <strong style="border-bottom:2px solid var(--ink); padding:0 30px;">&nbsp;</strong>, please?"</span>
        </div>
        <div class="request-strip" style="--card-color:${contrast.color}">
          <span class="em">🎣</span>
          <span>"Yes, here you are." / "No — go fish!"</span>
        </div>
        <div class="score-row" style="margin-top:18px;">
          <div class="score-box"><div class="label">Player 1</div><div class="name-line"></div><div class="label">Pairs</div><div class="tally-grid">${'<span></span>'.repeat(10)}</div></div>
          <div class="score-box"><div class="label">Player 2</div><div class="name-line"></div><div class="label">Pairs</div><div class="tally-grid">${'<span></span>'.repeat(10)}</div></div>
        </div>
        <h3 style="font-size:14px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-soft); margin:18px 0 8px;">Words in the deck</h3>
        <div class="word-list">${wordList()}</div>
      `;
    },

    'roll-say': () => {
      // Pick six pairs, list both words; one die value per row.
      const pairs = contrast.pairs.slice(0, 6);
      while (pairs.length < 6) pairs.push(contrast.pairs[pairs.length % contrast.pairs.length]);
      const cells = pairs.map((p, i) => `
        <div class="roll-cell" style="--card-color:${contrast.color}">
          <span class="die">${i + 1}</span>
          <div style="display:flex; justify-content:space-around; align-items:center;">
            <div><div class="em">${Yapla.pic(p.a.emoji)}</div><div class="w">${esc(p.a.word)}</div></div>
            <div style="font-size:18px; color:var(--muted);">·</div>
            <div><div class="em">${Yapla.pic(p.b.emoji)}</div><div class="w">${esc(p.b.word)}</div></div>
          </div>
          <div class="reps">say each × 3</div>
        </div>
      `).join('');
      return header('Roll a die. Find the matching cell. Say BOTH words in the pair three times each. Optional: roll twice and put the words in a sentence.') + `
        <div class="roll-board">${cells}</div>
      `;
    },

    'silly-sentences': () => {
      const frames = [
        'The <span class="blank"></span> said hello to the <span class="blank"></span>.',
        'A big <span class="blank"></span> sat on a tiny <span class="blank"></span>.',
        'Yesterday the <span class="blank"></span> took the <span class="blank"></span> to <span class="blank"></span>.',
        'Why is the <span class="blank"></span> next to the <span class="blank"></span>?',
        'I saw a <span class="blank"></span> and a <span class="blank"></span> dancing together.',
        'My <span class="blank"></span> is faster than your <span class="blank"></span>.',
      ];
      const bank = contrast.pairs.slice(0, 10).flatMap(p => [p.a, p.b])
        .map(w => `<div><span class="em">${Yapla.pic(w.emoji)}</span><span>${esc(w.word)}</span></div>`).join('');
      return header('Pick one word from each side of the contrast and fill the blanks to make the silliest sentence you can. Read it aloud, then draw the scene!') + `
        ${frames.map(f => `<div class="sent-frame">${f}</div>`).join('')}
        <div class="word-bank">
          <h4>Word Bank</h4>
          <div class="bank-grid">${bank}</div>
        </div>
      `;
    },

    'tic-tac-toe': () => {
      // Two grids on the page, alternating A/B words to force productions.
      function makeGrid(offset) {
        let cells = '';
        for (let i = 0; i < 9; i++) {
          const idx = (offset + i) % contrast.pairs.length;
          const p = contrast.pairs[idx];
          const w = i % 2 === 0 ? p.a : p.b;
          cells += `<div class="ttt-cell"><div class="em">${Yapla.pic(w.emoji)}</div><div class="w">${esc(w.word)}</div></div>`;
        }
        return `<div class="ttt-grid">${cells}</div>`;
      }
      return header('Take turns. To place your X or O on a square, you must clearly say that square’s word. Three in a row wins. Two grids — best of three!') + `
        <div class="ttt-set">
          ${makeGrid(0)}
          ${makeGrid(3)}
        </div>
      `;
    },

    'treasure-hunt': () => {
      const spots = [
        { em: '🛋️', l: 'under the couch' },
        { em: '🪑', l: 'on the chair' },
        { em: '📚', l: 'in a book' },
        { em: '🪟', l: 'by the window' },
        { em: '🚪', l: 'behind the door' },
        { em: '🛏️', l: 'under the bed' },
        { em: '🧺', l: 'in the basket' },
        { em: '🧸', l: 'with a toy' },
      ];
      const map = spots.map(s => `<div class="hide-spot"><span class="em">${Yapla.pic(s.em)}</span>${esc(s.l)}</div>`).join('');
      const list = contrast.pairs.slice(0, 10).flatMap(p => [p.a, p.b]).map(w =>
        `<label><span class="check"></span><span class="em">${Yapla.pic(w.emoji)}</span><span>${esc(w.word)}</span></label>`
      ).join('');
      return header('Hide the flashcards in the marked spots (or your own). Each card found = name it three times. Tick the box when caught!') + `
        <div class="treasure-map">${map}</div>
        <h3 style="font-size:14px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-soft); margin:0 0 8px;">Treasure list</h3>
        <div class="hide-list">${list}</div>
      `;
    },

    'whats-missing': () => {
      const rounds = Array.from({ length: 6 }, (_, i) => `
        <div class="rcell">
          <div class="num">Round ${i + 1}</div>
          <div class="line"></div>
          <div style="font-size:10.5px; color:var(--muted); margin-top:4px;">word</div>
        </div>
      `).join('');
      return header('Lay 6 cards face-up in the grid. Child closes their eyes; remove one. Open eyes — they identify the missing word in a sentence. Track each round below.') + `
        <div class="missing-grid">
          ${Array.from({length:6}, () => `<div class="missing-cell">place card</div>`).join('')}
        </div>
        <h3 style="font-size:14px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-soft); margin:0 0 8px;">Rounds played</h3>
        <div class="round-log">${rounds}</div>
      `;
    },

    'minimal-pair-trade': () => {
      const strips = contrast.pairs.slice(0, 8).flatMap(p => [
        `<div class="request-strip" style="--card-color:${contrast.color}"><span class="em">${Yapla.pic(p.a.emoji)}</span><span>"Can I please have <strong>${esc(p.a.word)}</strong>?"</span></div>`,
        `<div class="request-strip" style="--card-color:${contrast.color}"><span class="em">${Yapla.pic(p.b.emoji)}</span><span>"Can I please have <strong>${esc(p.b.word)}</strong>?"</span></div>`,
      ]).join('');
      return header('Cut along the dashes. Hand the child a request strip; they read it aloud. You only pass the matching card if you clearly hear the target contrast. Trade and swap roles.') + strips;
    },

    'snap': () => {
      return header('Print two copies. Shuffle and split between players. Take turns flipping a card into the middle, naming the picture. When two same cards land — first to slap and shout "Snap! ___" wins the pile.') + `
        <div class="score-row">
          <div class="score-box">
            <div class="label">Player 1</div>
            <div class="name-line"></div>
            <div class="label">Snaps</div>
            <div class="tally-grid">${'<span></span>'.repeat(20)}</div>
          </div>
          <div class="score-box">
            <div class="label">Player 2</div>
            <div class="name-line"></div>
            <div class="label">Snaps</div>
            <div class="tally-grid">${'<span></span>'.repeat(20)}</div>
          </div>
        </div>
        <h3 style="font-size:14px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-soft); margin:18px 0 8px;">Cards in this deck</h3>
        <div class="word-list">${wordList()}</div>
      `;
    },

    'auditory-bombardment': () => {
      const [sA, sB] = sounds();
      const colA = contrast.pairs.map(p => `<li><span class="em">${Yapla.pic(p.a.emoji)}</span><span class="w">${esc(p.a.word)}</span></li>`).join('');
      const colB = contrast.pairs.map(p => `<li><span class="em">${Yapla.pic(p.b.emoji)}</span><span class="w">${esc(p.b.word)}</span></li>`).join('');
      return header('Read every word slowly and clearly to the child. They just listen — no productions yet. 1–2 minutes of focused input primes the ear before practice.') + `
        <div class="bombard">
          <div class="bombard-col" style="--card-color:${contrast.color}">
            <h3>${esc(sA)}</h3>
            <ul>${colA}</ul>
          </div>
          <div class="bombard-col" style="--card-color:${contrast.color}">
            <h3>${esc(sB)}</h3>
            <ul>${colB}</ul>
          </div>
        </div>
        <p style="margin-top:18px; font-size:13px; color:var(--ink-soft); text-align:center;">🎧 Listen only — no need to say anything yet.</p>
      `;
    },
  };

  function wordList() {
    return contrast.pairs.map(p =>
      `<div class="pair-row"><span class="em">${Yapla.pic(p.a.emoji)}</span><span class="w">${esc(p.a.word)}</span>
       <span style="color:var(--muted); margin:0 4px;">·</span>
       <span class="em">${Yapla.pic(p.b.emoji)}</span><span class="w">${esc(p.b.word)}</span></div>`
    ).join('');
  }

  const renderer = renderers[game.id];
  page.innerHTML = renderer
    ? renderer()
    : header(game.body) + `<p style="color:var(--ink-soft);">No printable defined for this game.</p>`;
})();
