# jmgbuzzi.github.io

Personal portfolio of Juan Martín González Buzzi — designed like a spreadsheet.
Live at https://jmgbuzzi.github.io

Plain HTML, CSS and JavaScript. No build step.

## Preview locally

The projects table is loaded from `data/projects.json`, which browsers block when you
double-click `index.html`. Run a tiny local server from this folder instead:

```
python -m http.server 8000
```

Then open http://localhost:8000

## Edit content

- Projects: `data/projects.json` (see the schema in `CLAUDE.md`)
- Everything else: `index.html`
- Colours and layout: `css/styles.css` (colour tokens at the top)
