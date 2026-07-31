# Portfolio-Website

Eine statische Portfolio-Seite für persönliche Spielprojekte (Videos, Audio-Clips, itch.io-Links)
mit einem eingebauten Admin-Bereich zum Verwalten der Inhalte.

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Öffentliche Startseite (Vorstellung, Projekte, Kontakt) |
| `admin.html` | Admin-Bereich zum Hinzufügen/Bearbeiten/Löschen von Projekten |
| `css/styles.css` | Design (dunkles Gaming-Theme) |
| `js/store.js` | Datenschicht + Standard-Platzhalter |
| `js/main.js` | Rendert die Startseite |
| `js/admin.js` | Logik des Admin-Bereichs |

## Bedienung

1. `index.html` im Browser öffnen → deine Portfolio-Seite.
2. Oben rechts auf **⚙️ Admin** klicken → Projekte und dein Profil bearbeiten.
3. Änderungen werden **im Browser** gespeichert (localStorage).

### Ein Projekt anlegen
Im Admin-Bereich Titel, Kategorie (🎬 Video / 🎧 Audio / 🕹️ Spiel) und Beschreibung eingeben.
Optional dazu:
- **Video-URL**: YouTube-/Vimeo-Link (wird automatisch eingebettet) oder ein direkter `.mp4`-Link.
- **Audio**: eine Datei hochladen *oder* eine URL eintragen.
- **Links** (z. B. itch.io): erscheinen als Buttons **unter** dem Video/der Beschreibung. Mehrere möglich.

## Veröffentlichen (wichtig!)

Deine Änderungen im Admin-Bereich liegen zunächst **nur in dem Browser**, in dem du sie gemacht hast. So bringst du sie online zu allen Besuchern:

1. Admin → **⬇️ Exportieren** lädt `portfolio-data.json` herunter.
2. Diese Datei in den `Portfolio`-Ordner legen (neben `index.html`) und committen und pushen.
3. Die Live-Seite liest `portfolio-data.json` beim Laden automatisch ein und zeigt deine Inhalte.

Ohne diesen Schritt sehen Besucher weiter die Standard-Platzhalter aus `js/store.js`. Zum Zurückholen auf einem anderen Gerät gibt es zusätzlich Admin → **⬆️ Importieren**.

### Online stellen
Lade den kompletten `Portfolio`-Ordner zu einem statischen Hoster hoch, z. B.:
- **GitHub Pages** (kostenlos)
- **Netlify** / **Vercel** (Ordner per Drag & Drop)
- **itch.io** als HTML-Projekt (Ordner als ZIP hochladen, `index.html` als Startdatei)

> Hinweis: Große Audio- und Bild-Uploads lieber als URL verlinken statt als Datei einzubetten,
> der Browser-Speicher ist begrenzt.

## Alternative: Inhalte fest im Code
Statt über `portfolio-data.json` kannst du deine echten Projekte auch direkt in
`js/store.js` (`DEFAULT_PROJECTS`, `DEFAULT_PROFILE`, `DEFAULT_ABOUT`) eintragen. Rangfolge beim
Anzeigen ist localStorage vor `portfolio-data.json` vor den `DEFAULT_*`-Platzhaltern.
