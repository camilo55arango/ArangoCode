(function () {
  'use strict';


  const $ = (sel) => document.querySelector(sel);

  const content       = $('#content');
  const viewHead       = $('#viewHead');
  const viewTitle      = $('#viewTitle');
  const viewDesc       = $('#viewDesc');
  const viewMeta       = $('#viewMeta');
  const chipsBox       = $('#chips');
  const quickFilters   = $('#quickFilters');
  const searchInput    = $('#searchInput');
  const suggestLink    = $('#suggestLink');
  const modal          = $('#modal');
  const modalTag       = $('#modalTag');
  const modalTitle     = $('#modalTitle');
  const modalDesc      = $('#modalDesc');
  const modalVars      = $('#modalVars');
  const modalCode      = $('#modalCode');
  const copyBtn        = $('#copyBtn');
  const copyLabel      = $('#copyLabel');
  const shareBtn       = $('#shareBtn');
  const toast          = $('#toast');
  const avatar         = $('.avatar');
  const avatarImg      = $('#avatarImg');
  const backToTop      = $('#backToTop');
  const favoritesToggle = $('#favoritesToggle');
  const favoritesCount = $('#favoritesCount');
  const shortcutsToggle = $('#shortcutsToggle');
  const shortcutsModal = $('#shortcutsModal');
  const cmdPaletteToggle = $('#cmdPaletteToggle');
  const cmdPalette      = $('#cmdPalette');
  const cmdkInput       = $('#cmdkInput');
  const cmdkResults     = $('#cmdkResults');


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

  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  function faviconUrl(url) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; }
    catch (e) { return ''; }
  }

  const KIND_LABEL = { dev: 'Dev', ia: 'IA', prompts: 'Prompt' };
  function dataFor(kind) {
    if (kind === 'dev') return DEV_TOOLS;
    if (kind === 'ia') return AI_TOOLS;
    return PROMPTS;
  }
  const favKey = (kind, name) => `${kind}:${name}`;


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

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  }

  function saveFavorites() {
    try { localStorage.setItem(favoriteKey, JSON.stringify([...favorites])); } catch (e) { /* storage no disponible */ }
    updateFavoritesCount();
  }
  function updateFavoritesCount() {
    favoritesCount.textContent = favorites.size;
    favoritesCount.hidden = favorites.size === 0;
    favoritesToggle.classList.toggle('has-items', favorites.size > 0);
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
    viewMeta.textContent = `Catálogo revisado: ${LAST_UPDATED} · Verifica precios y condiciones antes de elegir.`;
    searchInput.placeholder = state.view === 'prompts' ? 'Buscar prompt...' : 'Buscar herramienta...';

    suggestLink.hidden = false;
    suggestLink.textContent = state.view === 'prompts' ? '+ Sugerir prompt' : '+ Sugerir herramienta';
    suggestLink.href = `${ISSUES_URL}?title=${encodeURIComponent('Sugerencia para ' + section.title)}&body=${encodeURIComponent(`Nombre:\nURL (si aplica):\nDescripción:\nCategoría sugerida:\n`)}&labels=sugerencia`;

    renderChips(items);
    renderQuickFilters();
    renderCards(items);
  }

  function renderFavoritesView() {
    document.body.dataset.view = 'favoritos';
    viewHead.hidden = false;
    viewTitle.textContent = 'Mis guardados';
    viewDesc.textContent = 'Todo lo que marcaste con ★ en herramientas, IA y prompts, en un solo lugar.';
    viewMeta.textContent = '';
    searchInput.placeholder = 'Buscar en tus guardados...';
    chipsBox.innerHTML = '';
    quickFilters.innerHTML = '';
    suggestLink.hidden = true;
    renderFavoriteCards();
  }

  function allFavoriteEntries() {
    const entries = [];
    SECTIONS.forEach((s) => {
      dataFor(s.id).forEach((item) => {
        if (favorites.has(favKey(s.id, item.name))) entries.push({ item, kind: s.id });
      });
    });
    return entries;
  }

  function renderFavoriteCards() {
    const q = normalize(state.query.trim());
    const entries = allFavoriteEntries().filter(({ item }) => !q || normalize(item.name + ' ' + item.desc + ' ' + item.cat).includes(q));

    if (!entries.length) {
      content.innerHTML = '<div class="empty"><strong>Aún no guardas nada</strong>Toca la ★ en cualquier herramienta o prompt para agregarlo aquí.</div>';
      return;
    }

    content.innerHTML = '<div class="grid-items">' + entries.map(({ item, kind }, i) => cardMarkup(item, i, kind)).join('') + '</div>';
  }

  function refreshCards() {
    if (state.view === 'favoritos') renderFavoriteCards();
    else renderCards(dataFor(state.view));
  }

  function cardMarkup(it, i, kind) {
    const isPrompt = kind === 'prompts';
    const color = colorFor(it.cat);
    const delay = `animation-delay:${Math.min(i, 12) * 45}ms`;
    const style = `--accent-c:${color};${delay}`;

    const foot = isPrompt
      ? '<span class="card__foot">Ver y copiar <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></span>'
      : '<span class="card__foot">Abrir sitio <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></span>';

    const labels = labelsFor(it);
    const favorite = favorites.has(favKey(kind, it.name));
    const favBtn = `<button class="card__favorite" type="button" data-favorite="${esc(it.name)}" data-kind="${kind}" aria-pressed="${favorite}" aria-label="${favorite ? 'Quitar de guardados' : 'Guardar'} ${esc(it.name)}">★</button>`;

    const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
    const copyBtn = isPrompt
      ? `<button class="card__copylink" type="button" data-copyprompt="${esc(it.name)}" aria-label="Copiar prompt de ${esc(it.name)}">${copyIcon}</button>`
      : (it.url ? `<button class="card__copylink" type="button" data-copylink="${esc(it.url)}" aria-label="Copiar enlace de ${esc(it.name)}">${copyIcon}</button>` : '');

    const badgeImg = (!isPrompt && it.url)
      ? `<img class="card__badge-img" src="${esc(faviconUrl(it.url))}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()" />`
      : '';

    const kindTag = kind !== state.view ? `<span class="card__kind">${esc(KIND_LABEL[kind])}</span>` : '';

    const inner = `
      ${kindTag}
      <span class="card__head-actions">
      <span class="card__top">
        <span class="card__badge">${badgeImg}${esc(initials(it.name))}</span>
        <span>
          <span class="card__name">${esc(it.name)}</span>
          <span class="card__cat">${esc(it.cat)}</span>
        </span>
      </span>
      <span class="card__actions">${copyBtn}${favBtn}</span>
      </span>
      <span class="card__desc">${esc(it.desc)}</span>
      ${labels.length ? `<span class="card__badges">${labels.map((label) => `<span class="card__badge-label">${esc(label)}</span>`).join('')}</span>` : ''}
      ${foot}`;

    return isPrompt
      ? `<article class="card card--prompt" style="${style}" data-prompt="${esc(it.name)}" role="button" tabindex="0" aria-label="Abrir prompt: ${esc(it.name)}">${inner}</article>`
      : `<article class="card" style="${style}"><a class="card__link" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(it.name)}">${inner.replace(/<span class="card__actions">[\s\S]*?<\/span>/, '')}</a><span class="card__actions card__actions--overlay">${copyBtn}${favBtn}</span></article>`;
  }

  function renderCards(items) {
    const q = normalize(state.query.trim());
    const kind = state.view;

    const filtered = items.filter((it) => {
      if (state.cat !== 'Todas' && it.cat !== state.cat) return false;
      const labels = labelsFor(it).join(' ').toLowerCase();
      if (state.quick === 'favorites' && !favorites.has(favKey(kind, it.name))) return false;
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

    content.innerHTML = '<div class="grid-items">' + filtered.map((it, i) => cardMarkup(it, i, kind)).join('') + '</div>';
  }


  let lastFocused = null;
  let currentPromptTemplate = '';

  function extractVars(text) {
    const set = new Set();
    const re = /\[([^[\]\n]{1,60})\]/g;
    let m;
    while ((m = re.exec(text))) set.add(m[1]);
    return [...set];
  }

  function applyVars() {
    const inputs = modalVars.querySelectorAll('input[data-var]');
    let text = currentPromptTemplate;
    inputs.forEach((inp) => {
      if (!inp.value) return;
      text = text.split(`[${inp.dataset.var}]`).join(inp.value);
    });
    modalCode.textContent = text;
  }

  function openPrompt(name) {
    const p = PROMPTS.find((x) => x.name === name);
    if (!p) return;

    lastFocused = document.activeElement;
    modalTag.textContent = p.cat;
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;
    currentPromptTemplate = p.text;
    modalCode.textContent = p.text;

    const vars = extractVars(p.text);
    if (vars.length && vars.length <= 10) {
      modalVars.hidden = false;
      modalVars.innerHTML = vars.map((v) => `
        <div class="var-field">
          <label for="var-${slug(v)}">${esc(v)}</label>
          <input type="text" id="var-${slug(v)}" data-var="${esc(v)}" placeholder="Reemplaza [${esc(v)}]" autocomplete="off" />
        </div>`).join('');
      modalVars.querySelectorAll('input[data-var]').forEach((inp) => inp.addEventListener('input', applyVars));
    } else {
      modalVars.hidden = true;
      modalVars.innerHTML = '';
    }

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
      else if (await copyText(url)) showToast('Enlace copiado al portapapeles');
      else showToast('No se pudo compartir el enlace.');
    } catch (e) {
      if (e.name !== 'AbortError') showToast('No se pudo compartir el enlace.');
    }
  }

  async function copyPrompt() {
    const ok = await copyText(modalCode.textContent);
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

  async function copyPromptFromCard(el) {
    const p = PROMPTS.find((x) => x.name === el.dataset.copyprompt);
    if (!p) return;
    const ok = await copyText(p.text);
    if (ok) {
      el.classList.add('is-done');
      showToast('Prompt copiado al portapapeles');
      setTimeout(() => el.classList.remove('is-done'), 1500);
    } else {
      showToast('No se pudo copiar el prompt.');
    }
  }

  async function copyLink(el) {
    const href = el.dataset.copylink;
    if (!href) return;
    const ok = await copyText(href);
    if (ok) {
      el.classList.add('is-done');
      showToast('Enlace copiado al portapapeles');
      setTimeout(() => el.classList.remove('is-done'), 1500);
    } else {
      showToast('No se pudo copiar el enlace.');
    }
  }


  function syncURL() {
    if (state.view === 'home') return;
    const params = new URLSearchParams();
    if (state.cat && state.cat !== 'Todas') params.set('cat', state.cat);
    if (state.quick && state.quick !== 'all') params.set('quick', state.quick);
    if (state.query) params.set('q', state.query);
    const qs = params.toString();
    const newHash = `#/${state.view}${qs ? '?' + qs : ''}`;
    if (location.hash !== newHash) history.replaceState(null, '', newHash);
  }

  const profileCtas = document.querySelectorAll('.profile__cta[data-route]');
  function updateProfileActions() {
    profileCtas.forEach((el) => {
      const active = el.dataset.route === state.view;
      el.classList.toggle('profile__cta--primary', active);
      if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }

  function router() {
    const [hash, queryString] = (location.hash || '#/').replace('#/', '').split('?');
    const params = new URLSearchParams(queryString || '');
    const isSection = SECTIONS.some((s) => s.id === hash);
    const isFavorites = hash === 'favoritos';

    state.view = isSection || isFavorites ? hash : 'home';
    state.cat = params.get('cat') || 'Todas';
    state.quick = params.get('quick') || 'all';
    state.query = params.get('q') || '';
    searchInput.value = state.query;

    const render = () => {
      if (state.view === 'home') renderHome();
      else if (state.view === 'favoritos') renderFavoritesView();
      else {
        renderList();
        const promptName = params.get('prompt');
        if (state.view === 'prompts' && promptName) openPrompt(promptName);
      }
    };

    if (document.startViewTransition) document.startViewTransition(render);
    else render();

    updateProfileActions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  /* Command palette */
  const SEARCH_INDEX = [
    ...DEV_TOOLS.map((item) => ({ item, kind: 'dev' })),
    ...AI_TOOLS.map((item) => ({ item, kind: 'ia' })),
    ...PROMPTS.map((item) => ({ item, kind: 'prompts' }))
  ];
  let cmdkItems = [];
  let cmdkIndex = -1;

  function openCmdPalette() {
    cmdPalette.hidden = false;
    document.body.style.overflow = 'hidden';
    cmdkInput.value = '';
    renderCmdkResults('');
    setTimeout(() => cmdkInput.focus(), 10);
  }
  function closeCmdPalette() {
    cmdPalette.hidden = true;
    document.body.style.overflow = '';
  }

  function renderCmdkResults(query) {
    const q = normalize(query.trim());
    const matches = (q
      ? SEARCH_INDEX.filter(({ item }) => normalize(item.name + ' ' + item.desc + ' ' + item.cat).includes(q))
      : SEARCH_INDEX
    ).slice(0, 40);

    cmdkItems = matches;
    cmdkIndex = matches.length ? 0 : -1;

    if (!matches.length) {
      cmdkResults.innerHTML = '<div class="cmdk-empty">Sin resultados.</div>';
      return;
    }

    cmdkResults.innerHTML = matches.map(({ item, kind }, i) => `
      <button type="button" class="cmdk-item${i === 0 ? ' is-active' : ''}" data-idx="${i}">
        <span class="cmdk-item__badge">${esc(initials(item.name))}</span>
        <span class="cmdk-item__body">
          <span class="cmdk-item__name">${esc(item.name)}</span>
          <span class="cmdk-item__cat">${KIND_LABEL[kind]} · ${esc(item.cat)}</span>
        </span>
      </button>`).join('');
  }

  function setCmdkActive(i) {
    const els = cmdkResults.querySelectorAll('.cmdk-item');
    els.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    cmdkIndex = i;
    if (els[i]) els[i].scrollIntoView({ block: 'nearest' });
  }

  function chooseCmdkItem(i) {
    const match = cmdkItems[i];
    if (!match) return;
    closeCmdPalette();
    if (match.kind === 'prompts') location.hash = `#/prompts?prompt=${encodeURIComponent(match.item.name)}`;
    else window.open(match.item.url, '_blank', 'noopener,noreferrer');
  }

  cmdPaletteToggle.addEventListener('click', openCmdPalette);
  cmdPalette.addEventListener('click', (e) => { if (e.target.closest('[data-close-cmdk]')) closeCmdPalette(); });
  cmdkInput.addEventListener('input', (e) => renderCmdkResults(e.target.value));
  cmdkResults.addEventListener('click', (e) => {
    const btn = e.target.closest('.cmdk-item');
    if (btn) chooseCmdkItem(Number(btn.dataset.idx));
  });
  cmdkInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCmdkActive(Math.min(cmdkIndex + 1, cmdkItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCmdkActive(Math.max(cmdkIndex - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); chooseCmdkItem(cmdkIndex); }
    else if (e.key === 'Escape') { closeCmdPalette(); }
  });


  /* Volver arriba */
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* Atajos de teclado */
  shortcutsToggle.addEventListener('click', () => { shortcutsModal.hidden = false; });
  shortcutsModal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) shortcutsModal.hidden = true; });


  window.addEventListener('hashchange', router);

  chipsBox.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.cat = chip.dataset.cat;
    chipsBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    refreshCards();
    syncURL();
  });

  quickFilters.addEventListener('click', (e) => {
    const filter = e.target.closest('[data-quick]');
    if (!filter) return;
    state.quick = filter.dataset.quick;
    renderQuickFilters();
    refreshCards();
    syncURL();
  });

  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { refreshCards(); syncURL(); }, 130);
  });

  content.addEventListener('click', (e) => {
    const copyprompt = e.target.closest('[data-copyprompt]');
    if (copyprompt) {
      e.preventDefault();
      e.stopPropagation();
      copyPromptFromCard(copyprompt);
      return;
    }
    const copylink = e.target.closest('[data-copylink]');
    if (copylink) {
      e.preventDefault();
      e.stopPropagation();
      copyLink(copylink);
      return;
    }
    const favorite = e.target.closest('[data-favorite]');
    if (favorite) {
      e.preventDefault();
      e.stopPropagation();
      const key = favKey(favorite.dataset.kind, favorite.dataset.favorite);
      if (favorites.has(key)) favorites.delete(key); else favorites.add(key);
      saveFavorites();
      refreshCards();
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
    const typing = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette.hidden) openCmdPalette(); else closeCmdPalette();
      return;
    }
    if (e.key === 'Escape' && !cmdPalette.hidden) { closeCmdPalette(); return; }
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === 'Escape' && !shortcutsModal.hidden) shortcutsModal.hidden = true;
    if (e.key === 'Tab' && !modal.hidden) {
      const focusable = [...modal.querySelectorAll('button, [contenteditable="true"], [href], input')].filter((el) => !el.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === '/' && modal.hidden && cmdPalette.hidden && !typing && !viewHead.hidden) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === '?' && modal.hidden && cmdPalette.hidden && !typing) {
      e.preventDefault();
      shortcutsModal.hidden = !shortcutsModal.hidden;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-prompt]')) {
      e.preventDefault();
      openPrompt(e.target.dataset.prompt);
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* sin soporte o bloqueado */ });
    });
  }

  /* Arranque */
  $('#year').textContent = new Date().getFullYear();
  updateFavoritesCount();
  router();
})();
