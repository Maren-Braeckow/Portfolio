/* =========================================================
   store.js – gemeinsame Datenschicht (localStorage)
   Wird von index (main.js) und admin (admin.js) genutzt.
   =========================================================

   Datenmodell eines Projekts:
   {
     id:          "eindeutige-id",
     title:       "Projekttitel",
     description: "Beschreibungstext",
     kind:        "video" | "audio" | "link",   // primärer Typ (für Filter/Badge)
     videoUrl:    "https://...",   // YouTube / Vimeo / .mp4 (optional)
     audioUrl:    "https://... | data:audio/...",  // Datei-URL oder Upload (optional)
     links: [ { label: "Auf itch.io spielen", url: "https://..." }, ... ]
   }
*/

const STORE_KEY    = 'portfolio.projects.v1';
const ABOUT_KEY    = 'portfolio.about.v1';
const ABOUT_EN_KEY = 'portfolio.about_en.v1';
const PROFILE_KEY  = 'portfolio.profile.v1';

/* ---------- Standard-Inhalte (Platzhalter) ---------- */

const DEFAULT_PROFILE = {
  name: 'Maren Bräckow',
  role: 'Game Engineering · 8. Semester',
  tagline: 'Mein Schwerpunkt liegt auf Sound und Musik, ich programmiere und gestalte aber genauso gern. Hier sammle ich meine persönlichen Projekte, von kleinen Experimenten bis zu größeren Produktionen.',
  tagline_en: 'My focus is on sound and music, but I also love programming and design. Here I collect my personal projects, from small experiments to bigger productions.',
  initials: 'MB',
  photoUrl: '',              // leer = Platzhalter
  email: 'maren.braeckow@web.de',
  itch: '',                  // z.B. https://deinname.itch.io
  linkedin: ''
};

const DEFAULT_ABOUT =
  'Hi! Ich bin Studentin im Studiengang Game Engineering im 8. Semester. ' +
  'Mein Schwerpunkt liegt auf Sound und Musik. Ich komponiere, mache Sounddesign ' +
  'und arbeite an der Audio-Umsetzung in Spielen. Genauso gern programmiere und ' +
  'gestalte ich, von Gameplay über Level bis zur Interaktion.\n\n' +
  'Auf dieser Seite sammle ich meine persönlichen Projekte. Dazu gehören Gameplay-Videos, ' +
  'Audio-Arbeiten und spielbare Prototypen auf itch.io. Manche entstehen im Studium, ' +
  'andere in meiner Freizeit. Ich arbeite an meiner Bachelorarbeit über ' +
  'barrierefreies Game Design.';

const DEFAULT_ABOUT_EN =
  'Hi! I\'m a Game Engineering student in my 8th semester. ' +
  'My focus is on sound and music. I compose, do sound design and work on ' +
  'the audio implementation in games. I also love programming and design, ' +
  'from gameplay to levels and interaction.\n\n' +
  'On this page I collect my personal projects. These include gameplay videos, ' +
  'audio work and playable prototypes on itch.io. Some are created during my studies, ' +
  'others in my free time. I\'m working on my bachelor\'s thesis about ' +
  'accessible game design.';

const DEFAULT_PROJECTS = [
  {
    id: 'p-video-1',
    title: 'Projekt-Video 1 (Platzhalter)',
    title_en: 'Project video 1 (placeholder)',
    description: 'Kurze Beschreibung deines ersten Spielprojekts oder Trailers. Ersetze das Video im Admin-Bereich durch deinen eigenen Link (YouTube, Vimeo oder .mp4).',
    description_en: 'Short description of your first game project or trailer. Replace the video in the admin area with your own link (YouTube, Vimeo or .mp4).',
    kind: 'video',
    videoUrl: '',
    audioUrl: '',
    links: [{ label: 'Auf itch.io spielen', url: '' }]
  },
  {
    id: 'p-video-2',
    title: 'Projekt-Video 2 (Platzhalter)',
    title_en: 'Project video 2 (placeholder)',
    description: 'Zweites Video mit Beschreibung. Ideal für Gameplay-Ausschnitte oder Making-of-Material.',
    description_en: 'Second video with description. Ideal for gameplay clips or making-of material.',
    kind: 'video',
    videoUrl: '',
    audioUrl: '',
    links: []
  },
  {
    id: 'p-video-3',
    title: 'Projekt-Video 3 (Platzhalter)',
    title_en: 'Project video 3 (placeholder)',
    description: 'Drittes Video. Hier kannst du unter dem Video einen itch.io-Link platzieren.',
    description_en: 'Third video. You can place an itch.io link below the video.',
    kind: 'video',
    videoUrl: '',
    audioUrl: '',
    links: [{ label: 'Zum Projekt', url: '' }]
  },
  {
    id: 'p-video-4',
    title: 'Projekt-Video 4 (Platzhalter)',
    title_en: 'Project video 4 (placeholder)',
    description: 'Viertes Video, zum Beispiel eine Prototyp-Demo oder ein Devlog.',
    description_en: 'Fourth video, for example a prototype demo or a devlog.',
    kind: 'video',
    videoUrl: '',
    audioUrl: '',
    links: []
  },
  {
    id: 'p-audio-1',
    title: 'Audio-Clip 1 (Platzhalter)',
    title_en: 'Audio clip 1 (placeholder)',
    description: 'Ein Sound-Design- oder Musik-Beispiel. Lade im Admin-Bereich eine Audiodatei hoch oder verlinke eine URL.',
    description_en: 'A sound design or music example. Upload an audio file in the admin area or link a URL.',
    kind: 'audio',
    videoUrl: '',
    audioUrl: '',
    links: []
  },
  {
    id: 'p-audio-2',
    title: 'Audio-Clip 2 (Platzhalter)',
    title_en: 'Audio clip 2 (placeholder)',
    description: 'Zweites Audio-Beispiel, z. B. Voice-Over oder ein Ambient-Loop aus einem deiner Spiele.',
    description_en: 'Second audio example, e.g. a voice-over or an ambient loop from one of your games.',
    kind: 'audio',
    videoUrl: '',
    audioUrl: '',
    links: []
  },
  {
    id: 'p-link-1',
    title: 'itch.io Spiel 1 (Platzhalter)',
    title_en: 'itch.io game 1 (placeholder)',
    description: 'Ein spielbares Projekt auf itch.io. Trage im Admin-Bereich den Link ein.',
    description_en: 'A playable project on itch.io. Add the link in the admin area.',
    kind: 'link',
    videoUrl: '',
    audioUrl: '',
    links: [{ label: 'Jetzt spielen', url: '' }]
  },
  {
    id: 'p-link-2',
    title: 'itch.io Spiel 2 (Platzhalter)',
    title_en: 'itch.io game 2 (placeholder)',
    description: 'Zweites spielbares Projekt. Mehrere Links pro Projekt sind möglich.',
    description_en: 'Second playable project. Multiple links per project are possible.',
    kind: 'link',
    videoUrl: '',
    audioUrl: '',
    links: [{ label: 'Jetzt spielen', url: '' }]
  }
];

/* ---------- Zugriffsfunktionen ---------- */

const Store = {
  getProjects() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('Projekte konnten nicht geladen werden', e); }
    return structuredClone(DEFAULT_PROJECTS);
  },
  saveProjects(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  },
  getAbout(lang = 'de') {
    if (lang === 'en') return localStorage.getItem(ABOUT_EN_KEY) ?? DEFAULT_ABOUT_EN;
    return localStorage.getItem(ABOUT_KEY) ?? DEFAULT_ABOUT;
  },
  saveAbout(text, lang = 'de') {
    localStorage.setItem(lang === 'en' ? ABOUT_EN_KEY : ABOUT_KEY, text);
  },
  getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return structuredClone(DEFAULT_PROFILE);
  },
  saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  resetAll() {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(ABOUT_KEY);
    localStorage.removeItem(ABOUT_EN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },
  /* Vollständiges Backup als ein Objekt */
  exportAll() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile:  this.getProfile(),
      about:    this.getAbout('de'),
      about_en: this.getAbout('en'),
      projects: this.getProjects()
    };
  },
  importAll(data) {
    if (data.projects) this.saveProjects(data.projects);
    if (typeof data.about === 'string')    this.saveAbout(data.about, 'de');
    if (typeof data.about_en === 'string') this.saveAbout(data.about_en, 'en');
    if (data.profile) this.saveProfile(data.profile);
  }
};

/* ---------- Hilfsfunktionen für Medien ---------- */

/** Wandelt eine Video-URL in eine Embed-URL um (YouTube / Vimeo), sonst null. */
function toEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** true, wenn die URL direkt auf eine Videodatei zeigt. */
function isDirectVideo(url) {
  return /\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(url || '');
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}
