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

Da die Seite rein statisch ist, gilt:

- Änderungen im Admin-Bereich liegen **nur in dem Browser**, in dem du sie gemacht hast.
- Zum Sichern/Übertragen: Admin → **⬇️ Exportieren** lädt `portfolio-data.json` herunter.
- Auf einem anderen Gerät oder nach dem Zurücksetzen: Admin → **⬆️ Importieren** und die Datei wählen.

### Online stellen
Lade den kompletten `Portfolio`-Ordner zu einem statischen Hoster hoch, z. B.:
- **GitHub Pages** (kostenlos)
- **Netlify** / **Vercel** (Ordner per Drag & Drop)
- **itch.io** als HTML-Projekt (Ordner als ZIP hochladen, `index.html` als Startdatei)

> Hinweis: Besucher sehen die **Standard-Platzhalter**, bis du deine eigenen Inhalte
> eingibst und die exportierte `portfolio-data.json` mit hochlädst. Große Audio-/Bild-Uploads
> lieber als URL verlinken statt als Datei einzubetten – der Browser-Speicher ist begrenzt.

## Tipp: eigene Inhalte fest hinterlegen
Wenn du deine echten Projekte dauerhaft als Standard willst (statt Platzhalter), kannst du die
Listen in `js/store.js` (`DEFAULT_PROJECTS`, `DEFAULT_PROFILE`, `DEFAULT_ABOUT`) direkt anpassen.
