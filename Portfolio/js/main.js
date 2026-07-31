/* =========================================================
   main.js – rendert die öffentliche Portfolio-Startseite
   ========================================================= */

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  applyEnvVisibility(); // Admin-Elemente nur lokal zeigen
  applyI18n();          // feste UI-Texte übersetzen
  setupLangToggle();
  renderAll();
  setupFilters();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Lokal vs. Online ---------- */
/* true, wenn die Seite lokal geöffnet ist (Doppelklick = file://, oder localhost). */
function isLocalEnv() {
  const h = location.hostname;
  return location.protocol === 'file:' ||
         h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '';
}

/* Blendet alle .admin-only Elemente aus, sobald die Seite online läuft. */
function applyEnvVisibility() {
  if (isLocalEnv()) return;
  document.querySelectorAll('.admin-only').forEach(el => { el.style.display = 'none'; });
}

/* Alles neu aufbauen (bei Sprachwechsel) */
function renderAll() {
  applyProfile();
  applyAbout();
  renderProjects(currentFilter);
}

/* ---------- Sprachumschalter ---------- */
function setupLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  updateLangLabel(btn);
  btn.addEventListener('click', () => {
    i18n.toggle();
    applyI18n();
    updateLangLabel(btn);
    renderAll();
  });
}
function updateLangLabel(btn) {
  // Button zeigt die Sprache, zu der gewechselt wird
  btn.textContent = i18n.get() === 'de' ? '🌐 EN' : '🌐 DE';
}

/* ---------- Profil / Kopfzeile ---------- */
function applyProfile() {
  const p = Store.getProfile();
  const firstName = (p.name || 'Portfolio').split(' ')[0];

  setText('navName', p.name || 'Portfolio');
  setText('footerName', p.name || 'Portfolio');
  setText('navLogo', (p.initials || firstName[0] || 'P').slice(0, 2).toUpperCase());
  setText('heroName', firstName);
  setText('heroInitials', (p.initials || 'MB').toUpperCase());
  setText('heroTagline', langField(p, 'tagline'));

  // Foto (oder übersetzter Platzhalter)
  const box = document.getElementById('aboutPhoto');
  if (p.photoUrl) {
    box.innerHTML = `<img src="${escapeHtml(p.photoUrl)}" alt="${escapeHtml(p.name)}" />`;
  } else {
    box.innerHTML = `<span>${i18n.t('about.photoHtml')}</span>`;
  }

  // Kontakt-Buttons
  const social = document.getElementById('socialLinks');
  const btns = [];
  if (p.email)    btns.push(link(`mailto:${p.email}`, i18n.t('social.email'), 'btn-primary'));
  if (p.itch)     btns.push(link(p.itch, '🕹️ itch.io', ''));
  if (p.linkedin) btns.push(link(p.linkedin, '💼 LinkedIn', ''));
  social.innerHTML = btns.join('') ||
    `<span style="color:var(--text-faint)">${i18n.t('contact.none')}</span>`;

  function link(href, label, cls) {
    const ext = href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"';
    return `<a class="btn ${cls}" href="${escapeHtml(href)}"${ext}>${escapeHtml(label)}</a>`;
  }
}

/* ---------- Über mich ---------- */
function applyAbout() {
  const text = Store.getAbout(i18n.get());
  const html = text.split(/\n\s*\n/).map(par =>
    `<p>${escapeHtml(par).replace(/\n/g, '<br>')}</p>`
  ).join('');
  document.getElementById('aboutText').innerHTML = html;
}

/* ---------- Projekte ---------- */
function renderProjects(filter) {
  const grid = document.getElementById('projectGrid');
  const all = Store.getProjects();
  const list = filter === 'all' ? all : all.filter(p => p.kind === filter);

  if (!list.length) {
    const adminLink = isLocalEnv() ? ` <a href="admin.html">${i18n.t('footer.adminLink')}</a>` : '';
    grid.innerHTML = `<div class="empty">${i18n.t('projects.empty')}${adminLink}</div>`;
    return;
  }
  grid.innerHTML = list.map(cardHtml).join('');
}

function cardHtml(p) {
  const tagLabel = i18n.t('card.' + p.kind) || i18n.t('card.project');
  const parts = [];

  // Medien: Video oben
  if (p.kind === 'video' || p.videoUrl) {
    parts.push(`<div class="card-media">${videoHtml(p.videoUrl)}</div>`);
  }
  // Audio-Player
  if (p.audioUrl) {
    parts.push(`<div class="card-audio"><audio controls preload="none" src="${escapeHtml(p.audioUrl)}"></audio></div>`);
  } else if (p.kind === 'audio' && !p.videoUrl) {
    parts.push(`<div class="card-audio"><div class="card-media"><div class="placeholder"><span class="ico">🎧</span><small>${i18n.t('card.audioPlaceholder')}</small></div></div></div>`);
  }

  // Body
  const links = (p.links || [])
    .filter(l => l && l.label)
    .map(l => {
      const url = l.url && l.url.trim();
      if (url) return `<a class="btn btn-sm btn-primary" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(l.label)} ↗</a>`;
      return `<span class="btn btn-sm" style="opacity:.5;cursor:default" title="${i18n.t('card.linkTodo')}">${escapeHtml(l.label)}</span>`;
    }).join('');

  parts.push(`
    <div class="card-body">
      <span class="card-tag ${p.kind}">${escapeHtml(tagLabel)}</span>
      <h3>${escapeHtml(langField(p, 'title'))}</h3>
      <p>${escapeHtml(langField(p, 'description'))}</p>
      ${links ? `<div class="card-links">${links}</div>` : ''}
    </div>`);

  return `<article class="card">${parts.join('')}</article>`;
}

function videoHtml(url) {
  const embed = toEmbedUrl(url);
  if (embed) {
    return `<div class="ratio"><iframe src="${escapeHtml(embed)}" title="Video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  }
  if (isDirectVideo(url)) {
    return `<div class="ratio"><video controls preload="none" src="${escapeHtml(url)}"></video></div>`;
  }
  return `<div class="placeholder"><span class="ico">🎬</span><small>${i18n.t('card.videoPlaceholder')}</small></div>`;
}

/* ---------- Filter ---------- */
function setupFilters() {
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProjects(currentFilter);
    });
  });
}

/* ---------- Helpers ---------- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
