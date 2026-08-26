(function () {
  'use strict';


  const $ = (sel) => document.querySelector(sel);

  const content     = $('#content');
  const viewHead    = $('#viewHead');
  const viewTitle   = $('#viewTitle');
  const viewDesc    = $('#viewDesc');
  const chipsBox    = $('#chips');
  const searchInput = $('#searchInput');
  const modal       = $('#modal');
  const modalTag    = $('#modalTag');
  const modalTitle  = $('#modalTitle');
  const modalDesc   = $('#modalDesc');
  const modalCode   = $('#modalCode');
  const copyBtn     = $('#copyBtn');
  const copyLabel   = $('#copyLabel');
  const toast       = $('#toast');
  const avatar      = $('.avatar');
  const avatarImg   = $('#avatarImg');


  const state = { view: 'home', cat: 'Todas', query: '' };


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

  function renderList() {
    const section = SECTIONS.find((s) => s.id === state.view);
    const items = dataFor(state.view);

    document.body.dataset.view = state.view;
    viewHead.hidden = false;
    viewTitle.textContent = section.title;
    viewDesc.textContent = section.pageDesc;
    searchInput.placeholder = state.view === 'prompts' ? 'Buscar prompt...' : 'Buscar herramienta...';

    renderChips(items);
    renderCards(items);
  }

  function renderCards(items) {
    const q = normalize(state.query.trim());

    const filtered = items.filter((it) => {
      if (state.cat !== 'Todas' && it.cat !== state.cat) return false;
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

      const inner = `
        <span class="card__top">
          <span class="card__badge">${esc(initials(it.name))}</span>
          <span>
            <span class="card__name">${esc(it.name)}</span>
            <span class="card__cat">${esc(it.cat)}</span>
          </span>
        </span>
        <span class="card__desc">${esc(it.desc)}</span>
        ${foot}`;

      return isPrompt
        ? `<button type="button" class="card card--prompt" style="${style}" data-prompt="${esc(it.name)}">${inner}</button>`
        : `<a class="card" style="${style}" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
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
    copyBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
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
    const hash = (location.hash || '#/').replace('#/', '');
    const valid = SECTIONS.some((s) => s.id === hash);

    state.view = valid ? hash : 'home';
    state.cat = 'Todas';
    state.query = '';
    searchInput.value = '';

    if (state.view === 'home') renderHome();
    else renderList();

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

  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderCards(dataFor(state.view)), 130);
  });

  content.addEventListener('click', (e) => {
    const card = e.target.closest('[data-prompt]');
    if (card) openPrompt(card.dataset.prompt);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });

  copyBtn.addEventListener('click', copyPrompt);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === '/' && modal.hidden && document.activeElement !== searchInput && !viewHead.hidden) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  /* Arranque */
  $('#year').textContent = new Date().getFullYear();
  router();
})();
