/* =========================================================
   admin.js – Logik für den Admin-Bereich
   ========================================================= */

let projects = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Store.loadPublished(); // veröffentlichte Inhalte als Ausgangsbasis laden
  projects = Store.getProjects();
  loadProfileForm();
  renderList();
  addLinkRow(); // eine leere Link-Zeile zum Start

  // Profil
  byId('saveProfileBtn').addEventListener('click', saveProfile);
  byId('pfPhotoFile').addEventListener('change', e => fileToDataUrl(e.target, url => byId('pfPhoto').value = url, 1.5));

  // Projekt-Formular
  byId('addLinkBtn').addEventListener('click', () => addLinkRow());
  byId('saveProjectBtn').addEventListener('click', saveProject);
  byId('cancelEditBtn').addEventListener('click', resetForm);
  byId('fAudioFile').addEventListener('change', e => fileToDataUrl(e.target, url => byId('fAudio').value = url, 3));

  // Import / Export / Reset
  byId('exportBtn').addEventListener('click', exportData);
  byId('importBtn').addEventListener('click', () => byId('importFile').click());
  byId('importFile').addEventListener('change', importData);
  byId('resetBtn').addEventListener('click', resetAll);
});

/* ---------- Profil ---------- */
function loadProfileForm() {
  const p = Store.getProfile();
  byId('pfName').value     = p.name || '';
  byId('pfInitials').value = p.initials || '';
  byId('pfTagline').value  = p.tagline || '';
  byId('pfPhoto').value    = p.photoUrl || '';
  byId('pfEmail').value    = p.email || '';
  byId('pfItch').value      = p.itch || '';
  byId('pfLinkedin').value  = p.linkedin || '';
  byId('pfTaglineEn').value = p.tagline_en || '';
  byId('pfAbout').value     = Store.getAbout('de');
  byId('pfAboutEn').value   = Store.getAbout('en');
}

function saveProfile() {
  Store.saveProfile({
    name:       byId('pfName').value.trim(),
    initials:   byId('pfInitials').value.trim(),
    tagline:    byId('pfTagline').value.trim(),
    tagline_en: byId('pfTaglineEn').value.trim(),
    photoUrl:   byId('pfPhoto').value.trim(),
    email:      byId('pfEmail').value.trim(),
    itch:       byId('pfItch').value.trim(),
    linkedin:   byId('pfLinkedin').value.trim()
  });
  Store.saveAbout(byId('pfAbout').value, 'de');
  Store.saveAbout(byId('pfAboutEn').value, 'en');
  toast('Profil gespeichert ✓');
}

/* ---------- Link-Zeilen ---------- */
function addLinkRow(label = '', url = '') {
  const row = document.createElement('div');
  row.className = 'file-row';
  row.style.marginBottom = '8px';
  row.innerHTML = `
    <input type="text" class="link-label" placeholder="Beschriftung (z. B. Jetzt spielen)" value="${escapeAttr(label)}" />
    <input type="url" class="link-url" placeholder="https://..." value="${escapeAttr(url)}" />
    <button type="button" class="icon-btn danger" title="Entfernen">✕</button>`;
  row.querySelector('.icon-btn').addEventListener('click', () => row.remove());
  byId('linkRows').appendChild(row);
}

function collectLinks() {
  return [...document.querySelectorAll('#linkRows .file-row')].map(r => ({
    label: r.querySelector('.link-label').value.trim(),
    url:   r.querySelector('.link-url').value.trim()
  })).filter(l => l.label); // Links ohne Beschriftung verwerfen
}

/* ---------- Projekt speichern ---------- */
function saveProject() {
  const title = byId('fTitle').value.trim();
  if (!title) { toast('Bitte einen Titel eingeben.', true); return; }

  const data = {
    title,
    title_en:       byId('fTitleEn').value.trim(),
    kind:           byId('fKind').value,
    description:    byId('fDesc').value.trim(),
    description_en: byId('fDescEn').value.trim(),
    videoUrl:       byId('fVideo').value.trim(),
    audioUrl:       byId('fAudio').value.trim(),
    links:          collectLinks()
  };

  const editId = byId('editId').value;
  if (editId) {
    const i = projects.findIndex(p => p.id === editId);
    if (i > -1) projects[i] = { ...projects[i], ...data };
    toast('Projekt aktualisiert ✓');
  } else {
    data.id = 'p-' + Date.now().toString(36);
    projects.push(data);
    toast('Projekt hinzugefügt ✓');
  }

  persist();
  resetForm();
  renderList();
}

function editProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  byId('editId').value   = id;
  byId('fTitle').value   = p.title || '';
  byId('fTitleEn').value = p.title_en || '';
  byId('fKind').value    = p.kind || 'video';
  byId('fDesc').value    = p.description || '';
  byId('fDescEn').value  = p.description_en || '';
  byId('fVideo').value   = p.videoUrl || '';
  byId('fAudio').value   = p.audioUrl || '';

  byId('linkRows').innerHTML = '';
  (p.links && p.links.length ? p.links : [{ label: '', url: '' }])
    .forEach(l => addLinkRow(l.label, l.url));

  byId('formTitle').textContent = '✏️ Projekt bearbeiten';
  byId('cancelEditBtn').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  byId('editId').value   = '';
  byId('fTitle').value   = '';
  byId('fTitleEn').value = '';
  byId('fKind').value    = 'video';
  byId('fDesc').value    = '';
  byId('fDescEn').value  = '';
  byId('fVideo').value   = '';
  byId('fAudio').value   = '';
  byId('fAudioFile').value = '';
  byId('linkRows').innerHTML = '';
  addLinkRow();
  byId('formTitle').textContent = '➕ Neues Projekt';
  byId('cancelEditBtn').hidden = true;
}

function deleteProject(id) {
  const p = projects.find(x => x.id === id);
  if (!confirm(`Projekt „${p ? p.title : ''}" wirklich löschen?`)) return;
  projects = projects.filter(x => x.id !== id);
  persist();
  renderList();
  toast('Projekt gelöscht');
}

function move(id, dir) {
  const i = projects.findIndex(p => p.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= projects.length) return;
  [projects[i], projects[j]] = [projects[j], projects[i]];
  persist();
  renderList();
}

/* ---------- Liste rendern ---------- */
function renderList() {
  const list = byId('adminList');
  byId('count').textContent = projects.length;
  if (!projects.length) {
    list.innerHTML = `<div class="empty" style="padding:30px">Noch keine Projekte.</div>`;
    return;
  }
  const ico = { video: '🎬', audio: '🎧', link: '🕹️' };
  list.innerHTML = projects.map((p, i) => `
    <div class="admin-item">
      <div class="thumb">${ico[p.kind] || '📦'}</div>
      <div class="meta">
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.description || '—')}</p>
      </div>
      <div class="ops">
        <button class="icon-btn" data-act="up"   data-id="${p.id}" title="Nach oben"  ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="icon-btn" data-act="down" data-id="${p.id}" title="Nach unten" ${i === projects.length - 1 ? 'disabled' : ''}>▼</button>
        <button class="icon-btn" data-act="edit" data-id="${p.id}" title="Bearbeiten">✏️</button>
        <button class="icon-btn danger" data-act="del" data-id="${p.id}" title="Löschen">🗑️</button>
      </div>
    </div>`).join('');

  list.querySelectorAll('.icon-btn[data-act]').forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener('click', () => {
      switch (btn.dataset.act) {
        case 'up':   move(id, -1); break;
        case 'down': move(id, 1);  break;
        case 'edit': editProject(id); break;
        case 'del':  deleteProject(id); break;
      }
    });
  });
}

/* ---------- Import / Export / Reset ---------- */
function exportData() {
  const data = Store.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-data.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Export heruntergeladen ✓');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Store.importAll(data);
      projects = Store.getProjects();
      loadProfileForm();
      renderList();
      toast('Daten importiert ✓');
    } catch (err) {
      toast('Import fehlgeschlagen. Ungültige Datei.', true);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function resetAll() {
  if (!confirm('Wirklich alles auf die Standard-Platzhalter zurücksetzen? Deine Änderungen in diesem Browser gehen verloren.')) return;
  Store.resetAll();
  projects = Store.getProjects();
  loadProfileForm();
  resetForm();
  renderList();
  toast('Auf Standard zurückgesetzt');
}

/* ---------- Persistenz mit Speicher-Schutz ---------- */
function persist() {
  try {
    Store.saveProjects(projects);
  } catch (err) {
    toast('Speicher voll! Große Uploads (Audio/Bilder) vermeiden und URLs verwenden.', true);
  }
}

/* ---------- Datei → Data-URL ---------- */
function fileToDataUrl(input, cb, maxMb) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > maxMb * 1024 * 1024) {
    toast(`Datei ist größer als ${maxMb} MB. Bitte kleinere Datei oder eine URL nutzen.`, true);
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

/* ---------- Helpers ---------- */
function byId(id) { return document.getElementById(id); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

let toastTimer;
function toast(msg, isError = false) {
  const t = byId('toast');
  t.textContent = msg;
  t.classList.toggle('err', isError);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
