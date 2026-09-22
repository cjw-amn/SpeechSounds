# Yapla — Speech &amp; Language Resources (standalone site)

A self-contained, static build of the Yapla library: printable speech-sound
flashcards, single-sound picture-card sets, and print-and-play games.

## How to use it

This folder is the whole website. No build step, no server required.

- **Open locally:** double-click `index.html` (opens in your browser via `file://`).
- **Host it:** upload the entire folder to any static host (GitHub Pages,
  Netlify, S3, a school intranet, etc.) and point it at `index.html`.

All links and asset paths are relative, so the folder works wherever you put it
as long as the structure below is kept intact.

## What's inside

```
index.html                     Library home page
flashcards.html                Minimal-pair flashcard sheets (data-driven)
game.html                      Printable game-sheet generator
initial-k-cards.html …         6 single-sound picture-card sheets
four-in-a-row-*.html           Printable Connect-4 style games
rocket-race-*.html             Printable roll-and-move board games
assets/css/                    brand-tokens.css (the Yapla brand), plus page styles
assets/js/                     data.js (the word database) + page renderers
```

## Printing

Every printable page hides its on-screen toolbar when printed and adds a small
**Yapla** mark at the foot of each sheet. Use your browser's Print dialog
(Ctrl/Cmd-P), letter or A4 paper, and enable *background graphics* for best
results. The repeating print footer is most reliable in Chrome/Edge.

## Note on fonts

Branding uses the Fredoka and Plus Jakarta Sans webfonts, loaded from Google
Fonts. With an internet connection they load automatically; fully offline, the
pages fall back to your system sans-serif and everything still works.

## Credits and licences

Card pictures are Microsoft's [Fluent Emoji](https://github.com/microsoft/fluentui-emoji)
(Flat style), redistributed under the MIT licence. The licence text ships with
the files in `assets/img/emoji/LICENSE.txt`; keep that file with the site. The
pictures are served as SVG so every card looks the same on every device and
printer, and no system emoji font is used.
