/* =========================================================
   i18n.js – Sprachumschaltung (Deutsch / Englisch)
   Wird VOR main.js eingebunden.
   ========================================================= */

const LANG_KEY = 'portfolio.lang';

const I18N = {
  de: {
    'nav.about':    'Über mich',
    'nav.projects': 'Projekte',
    'nav.contact':  'Kontakt',
    'nav.admin':    '⚙️ Admin',

    'hero.eyebrow': '🎮 Game Engineering · 8. Semester',
    'hero.im':      'Hi, ich bin ',
    'hero.role1':   'Spieleentwicklerin aus ',
    'hero.role2':   'Leidenschaft',
    'hero.cta1':    'Projekte ansehen',
    'hero.cta2':    'Kontakt aufnehmen',

    'about.kicker':    'Über mich',
    'about.title':     'Wer steckt dahinter?',
    'about.photoHtml': '📷<br>Foto folgt<br><small>(im Admin einstellbar)</small>',

    'projects.kicker': 'Portfolio',
    'projects.title':  'Meine Projekte',
    'projects.sub':    'Eine Auswahl meiner Arbeiten mit Videos, Audio-Clips und spielbaren Prototypen auf itch.io.',
    'projects.empty':  'Keine Projekte in dieser Kategorie.',

    'filter.all':   'Alle',
    'filter.video': '🎬 Videos',
    'filter.audio': '🎧 Audio',
    'filter.link':  '🕹️ Spiele',

    'contact.kicker': 'Kontakt',
    'contact.title':  'Lass uns in Kontakt bleiben',
    'contact.sub':    'Du hast Fragen zu einem Projekt oder möchtest zusammenarbeiten? Ich freue mich über deine Nachricht.',
    'contact.none':   'Kontaktdaten im Admin-Bereich hinterlegen.',

    'footer.made':      'Erstellt mit ♥',
    'footer.adminLink': 'Admin-Bereich',

    'card.video':    'Video',
    'card.audio':    'Audio',
    'card.link':     'Spiel',
    'card.project':  'Projekt',
    'card.videoPlaceholder': 'Video-Platzhalter',
    'card.audioPlaceholder': 'Audio-Platzhalter',
    'card.linkTodo': 'Link im Admin-Bereich eintragen',

    'social.email': '✉️ E-Mail'
  },

  en: {
    'nav.about':    'About',
    'nav.projects': 'Projects',
    'nav.contact':  'Contact',
    'nav.admin':    '⚙️ Admin',

    'hero.eyebrow': '🎮 Game Engineering · 8th Semester',
    'hero.im':      "Hi, I'm ",
    'hero.role1':   'Game developer at ',
    'hero.role2':   'heart',
    'hero.cta1':    'View projects',
    'hero.cta2':    'Get in touch',

    'about.kicker':    'About me',
    'about.title':     "Who's behind this?",
    'about.photoHtml': '📷<br>Photo coming soon<br><small>(set in the admin area)</small>',

    'projects.kicker': 'Portfolio',
    'projects.title':  'My Projects',
    'projects.sub':    'A selection of my work with videos, audio clips and playable prototypes on itch.io.',
    'projects.empty':  'No projects in this category.',

    'filter.all':   'All',
    'filter.video': '🎬 Videos',
    'filter.audio': '🎧 Audio',
    'filter.link':  '🕹️ Games',

    'contact.kicker': 'Contact',
    'contact.title':  "Let's stay in touch",
    'contact.sub':    "Have questions about a project or want to collaborate? I'd love to hear from you.",
    'contact.none':   'Add contact details in the admin area.',

    'footer.made':      'Made with ♥',
    'footer.adminLink': 'Admin area',

    'card.video':    'Video',
    'card.audio':    'Audio',
    'card.link':     'Game',
    'card.project':  'Project',
    'card.videoPlaceholder': 'Video placeholder',
    'card.audioPlaceholder': 'Audio placeholder',
    'card.linkTodo': 'Add link in the admin area',

    'social.email': '✉️ Email'
  }
};

const i18n = {
  get()  { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'de'; },
  set(l) { localStorage.setItem(LANG_KEY, l === 'en' ? 'en' : 'de'); },
  toggle() { this.set(this.get() === 'de' ? 'en' : 'de'); return this.get(); },
  t(key) {
    const l = this.get();
    return (I18N[l] && I18N[l][key]) ?? I18N.de[key] ?? key;
  }
};

/** Setzt alle Texte mit [data-i18n] / [data-i18n-html] Attribut. */
function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18n.t(el.getAttribute('data-i18n'));
  });
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = i18n.t(el.getAttribute('data-i18n-html'));
  });
  document.documentElement.lang = i18n.get();
}

/** Liefert das sprachabhängige Feld eines Inhalts-Objekts (mit Rückfall auf Deutsch). */
function langField(obj, field) {
  if (i18n.get() === 'en') {
    const v = obj[field + '_en'];
    if (v != null && String(v).trim() !== '') return v;
  }
  return obj[field] ?? '';
}
