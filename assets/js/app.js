(function () {
  'use strict';


  const $ = (sel) => document.querySelector(sel);

  const content     = $('#content');
  const viewHead    = $('#viewHead');
  const viewTitle   = $('#viewTitle');
  const viewDesc    = $('#viewDesc');
  const viewMeta    = $('#viewMeta');
  const chipsBox    = $('#chips');
  const quickFilters = $('#quickFilters');
  const searchInput = $('#searchInput');
  const modal       = $('#modal');
  const modalTag    = $('#modalTag');
  const modalTitle  = $('#modalTitle');
  const modalDesc   = $('#modalDesc');
  const modalCode   = $('#modalCode');
  const copyBtn     = $('#copyBtn');
  const copyLabel   = $('#copyLabel');
  const shareBtn    = $('#shareBtn');
  const toast       = $('#toast');
  const avatar      = $('.avatar');
  const avatarImg   = $('#avatarImg');


  const state = { view: 'home', cat: 'Todas', quick: 'all', query: '' };
  const favoriteKey = 'ac-favorites';
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem(favoriteKey) || '[]')); } catch (e) { /* storage no disponible */ }


  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const normalize = (s) => String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');

  const initials = (name) => name.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, '').trim().charAt(0).toUpperCase();


  const catColors = new Map();
  function colorFor(cat) {
    if (!catColors.has(cat)) catColors.set(cat, PALETTE[catColors.size % PALETTE.length]);
    return catColors.get(cat);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function itemKey(item) { return `${state.view}:${item.name}`; }
  function saveFavorites() {
    try { localStorage.setItem(favoriteKey, JSON.stringify([...favorites])); } catch (e) { /* storage no disponible */ }
  }
  function labelsFor(item) {
    const text = `${item.name} ${item.desc}`.toLowerCase();
    const labels = [];
    if (/open source|código abierto|open weight|auto-hosped/.test(text)) labels.push('Open source');
    if (/gratis|gratuita|gratuito|free/.test(text)) labels.push('Gratis');
    if (/navegador|web|nube/.test(text)) labels.push('Web');
    return labels.slice(0, 2);
  }

  /* Redes sociales */
  $('#linkGithub').href    = SOCIALS.github;
  $('#linkX').href         = SOCIALS.x;
  $('#linkInstagram').href = SOCIALS.instagram;


  avatarImg.addEventListener('error', () => avatar.classList.add('is-fallback'));
  if (avatarImg.complete && avatarImg.naturalWidth === 0) avatar.classList.add('is-fallback');

  const themeBtn = $('#themeToggle');
  const savedTheme = localStorage.getItem('ac-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ac-theme', next); } catch (e) { /* modo privado */ }
  });


  const COUNTS = { dev: DEV_TOOLS.length, ia: AI_TOOLS.length, prompts: PROMPTS.length };
  const LABELS = { dev: 'herramientas', ia: 'herramientas', prompts: 'prompts' };

  function renderHome() {
    viewHead.hidden = true;
    quickFilters.innerHTML = '';
    document.body.dataset.view = 'home';

    content.innerHTML = '<div class="grid-home">' + SECTIONS.map((s, i) => `
      <a class="hero-card" href="#/${s.id}" style="--grad:${s.grad};--glow:${s.glow};animation-delay:${i * 90}ms">
        <span class="hero-card__icon">${s.icon}</span>
        <span class="hero-card__title">${esc(s.title)}</span>
        <span class="hero-card__desc">${esc(s.desc)}</span>
        <span class="hero-card__foot">
          <span class="hero-card__count">${COUNTS[s.id]} ${LABELS[s.id]}</span>
          <svg class="hero-card__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </span>
      </a>`).join('') + '</div>';
  }


  function dataFor(view) {
    if (view === 'dev') return DEV_TOOLS;
    if (view === 'ia') return AI_TOOLS;
    return PROMPTS;
  }

  function renderChips(items) {
    const cats = ['Todas', ...new Set(items.map((i) => i.cat))];
    chipsBox.innerHTML = cats.map((c) => `
      <button type="button" class="chip${c === state.cat ? ' is-active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>
    `).join('');
  }

  function renderQuickFilters() {
    const filters = state.view === 'prompts'
      ? [['all', 'Todos'], ['favorites', 'Guardados']]
      : [['all', 'Todos'], ['favorites', 'Guardados'], ['free', 'Gratis'], ['open', 'Open source'], ['web', 'Web']];
    quickFilters.innerHTML = filters.map(([id, label]) => `<button class="quick-filter${state.quick === id ? ' is-active' : ''}" type="button" data-quick="${id}">${label}</button>`).join('');
  }

  function renderList() {
    const section = SECTIONS.find((s) => s.id === state.view);
    const items = dataFor(state.view);

    document.body.dataset.view = state.view;
    viewHead.hidden = false;
    viewTitle.textContent = section.title;
    viewDesc.textContent = section.pageDesc;
    viewMeta.textContent = 'Catálogo revisado: septiembre de 2026 · Verifica precios y condiciones antes de elegir.';
    searchInput.placeholder = state.view === 'prompts' ? 'Buscar prompt...' : 'Buscar herramienta...';

    renderChips(items);
    renderQuickFilters();
    renderCards(items);
  }

  function renderCards(items) {
    const q = normalize(state.query.trim());

    const filtered = items.filter((it) => {
      if (state.cat !== 'Todas' && it.cat !== state.cat) return false;
      const labels = labelsFor(it).join(' ').toLowerCase();
      if (state.quick === 'favorites' && !favorites.has(itemKey(it))) return false;
      if (state.quick === 'free' && !labels.includes('gratis')) return false;
      if (state.quick === 'open' && !labels.includes('open source')) return false;
      if (state.quick === 'web' && !labels.includes('web')) return false;
      if (!q) return true;
      return normalize(it.name + ' ' + it.desc + ' ' + it.cat).includes(q);
    });

    if (!filtered.length) {
      content.innerHTML = '<div class="empty"><strong>Sin resultados</strong>Prueba con otra palabra o cambia de categoría.</div>';
      return;
    }

    const isPrompt = state.view === 'prompts';

    content.innerHTML = '<div class="grid-items">' + filtered.map((it, i) => {
      const color = colorFor(it.cat);
      const delay = `animation-delay:${Math.min(i, 12) * 45}ms`;
      const style = `--accent-c:${color};${delay}`;

      const foot = isPrompt
        ? '<span class="card__foot">Ver y copiar <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></span>'
        : '<span class="card__foot">Abrir sitio <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></span>';

      const labels = labelsFor(it);
      const favorite = favorites.has(itemKey(it));
      const inner = `
        <span class="card__head-actions">
        <span class="card__top">
          <span class="card__badge">${esc(initials(it.name))}</span>
          <span>
            <span class="card__name">${esc(it.name)}</span>
            <span class="card__cat">${esc(it.cat)}</span>
          </span>
        </span>
        <button class="card__favorite" type="button" data-favorite="${esc(it.name)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Quitar de guardados' : 'Guardar'} ${esc(it.name)}">★</button>
        </span>
        <span class="card__desc">${esc(it.desc)}</span>
        ${labels.length ? `<span class="card__badges">${labels.map((label) => `<span class="card__badge-label">${esc(label)}</span>`).join('')}</span>` : ''}
        ${foot}`;

      return isPrompt
        ? `<article class="card card--prompt" style="${style}" data-prompt="${esc(it.name)}" role="button" tabindex="0" aria-label="Abrir prompt: ${esc(it.name)}">${inner}</article>`
        : `<article class="card" style="${style}"><a class="card__link" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(it.name)}">${inner.replace(/<button class="card__favorite"[\s\S]*?<\/button>/, '')}</a><button class="card__favorite card__favorite--overlay" type="button" data-favorite="${esc(it.name)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Quitar de guardados' : 'Guardar'} ${esc(it.name)}">★</button></article>`;
    }).join('') + '</div>';
  }


  let lastFocused = null;

  function openPrompt(name) {
    const p = PROMPTS.find((x) => x.name === name);
    if (!p) return;

    lastFocused = document.activeElement;
    modalTag.textContent = p.cat;
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;
    modalCode.textContent = p.text;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    copyBtn.classList.remove('is-done');
    copyLabel.textContent = 'Copiar prompt';
    modal.querySelector('.modal__codewrap').scrollTop = 0;
    modal.querySelector('.modal__box').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  async function sharePrompt() {
    const url = `${location.origin}${location.pathname}#/prompts?prompt=${encodeURIComponent(modalTitle.textContent)}`;
    try {
      if (navigator.share) await navigator.share({ title: modalTitle.textContent, text: modalDesc.textContent, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast('Enlace copiado al portapapeles');
      }
    } catch (e) {
      if (e.name !== 'AbortError') showToast('No se pudo compartir el enlace.');
    }
  }

  async function copyPrompt() {
    const text = modalCode.textContent;
    let ok = false;

    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) {
      // Respaldo para navegadores sin permiso de portapapeles o sin HTTPS
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      document.body.removeChild(ta);
    }

    if (ok) {
      copyBtn.classList.add('is-done');
      copyLabel.textContent = '¡Copiado!';
      showToast('Prompt copiado al portapapeles');
      setTimeout(() => {
        copyBtn.classList.remove('is-done');
        copyLabel.textContent = 'Copiar prompt';
      }, 2200);
    } else {
      showToast('No se pudo copiar. Selecciona el texto manualmente.');
    }
  }


  function router() {
    const [hash, queryString] = (location.hash || '#/').replace('#/', '').split('?');
    const valid = SECTIONS.some((s) => s.id === hash);

    state.view = valid ? hash : 'home';
    state.cat = 'Todas';
    state.quick = 'all';
    state.query = '';
    searchInput.value = '';

    if (state.view === 'home') renderHome();
    else {
      renderList();
      const promptName = new URLSearchParams(queryString || '').get('prompt');
      if (state.view === 'prompts' && promptName) openPrompt(promptName);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  window.addEventListener('hashchange', router);

  chipsBox.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.cat = chip.dataset.cat;
    chipsBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    renderCards(dataFor(state.view));
  });

  quickFilters.addEventListener('click', (e) => {
    const filter = e.target.closest('[data-quick]');
    if (!filter) return;
    state.quick = filter.dataset.quick;
    renderQuickFilters();
    renderCards(dataFor(state.view));
  });

  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderCards(dataFor(state.view)), 130);
  });

  content.addEventListener('click', (e) => {
    const favorite = e.target.closest('[data-favorite]');
    if (favorite) {
      e.preventDefault();
      e.stopPropagation();
      const item = dataFor(state.view).find((entry) => entry.name === favorite.dataset.favorite);
      if (!item) return;
      const key = itemKey(item);
      if (favorites.has(key)) favorites.delete(key); else favorites.add(key);
      saveFavorites();
      renderCards(dataFor(state.view));
      return;
    }
    const card = e.target.closest('[data-prompt]');
    if (card) openPrompt(card.dataset.prompt);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });

  copyBtn.addEventListener('click', copyPrompt);
  shareBtn.addEventListener('click', sharePrompt);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === 'Tab' && !modal.hidden) {
      const focusable = [...modal.querySelectorAll('button, [contenteditable="true"], [href], input')].filter((el) => !el.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === '/' && modal.hidden && document.activeElement !== searchInput && !viewHead.hidden) {
      e.preventDefault();
      searchInput.focus();
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-prompt]')) {
      e.preventDefault();
      openPrompt(e.target.dataset.prompt);
    }
  });

  /* Arranque */
  $('#year').textContent = new Date().getFullYear();
  router();
})();
