# Ashleigh Pay — portfolio

A single-page portfolio site (HTML, CSS and JavaScript, no build step).

- `index.html` — page content: hero with interactive map, case studies, about, contact
- `styles.css` — brand tokens (colours, fonts) and layout
- `script.js` — the interactive map of projects, research methods and skills

To add a case study, duplicate an `<article class="case">` in `index.html`, then add a matching `project` node in `script.js`.

Preview locally with any static server, e.g. `python3 -m http.server`, or publish with GitHub Pages from the `main` branch.
