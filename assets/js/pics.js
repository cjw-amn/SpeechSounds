// Yapla pictures
// ---------------------------------------------------------------------------
// Every picture on a card is stored in the data as an emoji character, but we
// never let the browser draw it with the device's own emoji font (which looks
// different on every machine and is not ours to redistribute). Instead each
// emoji maps to an SVG in assets/img/emoji/ taken from Microsoft's Fluent Emoji
// (Flat) set, MIT licensed — see assets/img/emoji/LICENSE.txt.
//
//   Yapla.picSrc('🐷')          -> 'assets/img/emoji/1f437.svg'
//   Yapla.pic('🐷', 'big')      -> '<img class="pic big" src="…" alt="">'
//   Yapla.swapPics(rootElement) -> replaces emoji text inside root with <img>s
//
// swapPics runs automatically once the page has loaded, so static pages only
// need to include this script. Renderers that build HTML should call pic().
// If an SVG is ever missing the <img> falls back to the original character.

window.Yapla = window.Yapla || {};

(function (Y) {
  'use strict';

  var BASE = 'assets/img/emoji/';

  // One emoji: a pictographic base (or keycap), optional variation selector,
  // optional skin tone, then any number of ZWJ-joined parts.
  var RX = /(?:[#*0-9]️?⃣|\p{Extended_Pictographic}️?[\u{1F3FB}-\u{1F3FF}]?(?:‍\p{Extended_Pictographic}️?)*)/gu;

  // Unicode counts these ordinary text symbols (©, ®, ™, arrows, ▶ …) as
  // pictographs. Leave them as text unless the author added the emoji
  // variation selector (U+FE0F) to ask for a picture.
  var TEXT_SYMBOLS = /^[©®™ℹ‼⁉↔-↙↩↪Ⓜ▪▫▶◀◻-◾⤴⤵〰〽㊗㊙]$/;

  function isEmoji(match) {
    return !TEXT_SYMBOLS.test(match);
  }

  function fileKey(emoji) {
    var parts = [];
    for (var i = 0; i < emoji.length; i++) {
      var cp = emoji.codePointAt(i);
      if (cp > 0xffff) i++;
      if (cp !== 0xfe0f) parts.push(cp.toString(16));
    }
    return parts.join('-');
  }

  function picSrc(emoji) {
    return BASE + fileKey(emoji) + '.svg';
  }

  function attr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  // HTML string for use inside template literals.
  function pic(emoji, cls) {
    return '<img class="pic' + (cls ? ' ' + cls : '') + '" src="' + picSrc(emoji) +
      '" alt="" draggable="false" data-emoji="' + attr(emoji) +
      '" onerror="this.replaceWith(this.dataset.emoji)">';
  }

  // DOM element version.
  function picEl(emoji) {
    var img = document.createElement('img');
    img.className = 'pic';
    img.src = picSrc(emoji);
    img.alt = '';
    img.draggable = false;
    img.dataset.emoji = emoji;
    img.addEventListener('error', function () { img.replaceWith(emoji); });
    return img;
  }

  // Replace every emoji character in the text nodes under root with a picture.
  function swapPics(root) {
    root = root || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || /^(SCRIPT|STYLE|TEXTAREA|TITLE)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
        var hit = n.nodeValue.match(RX);
        return hit && hit.some(isEmoji) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      RX.lastIndex = 0;
      while ((m = RX.exec(text)) !== null) {
        if (!isEmoji(m[0])) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        frag.appendChild(picEl(m[0]));
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  Y.picSrc = picSrc;
  Y.pic = pic;
  Y.picEl = picEl;
  Y.swapPics = swapPics;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { swapPics(document.body); });
  } else {
    swapPics(document.body);
  }
})(window.Yapla);
