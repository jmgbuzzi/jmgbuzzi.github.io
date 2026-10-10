# CLAUDE.md — jmgbuzzi.github.io

Personal portfolio of Juan Martín González Buzzi (BBA student, ESADE Barcelona).
Live at https://jmgbuzzi.github.io — deployed by GitHub Pages from `main` / root.
Purpose: get a summer internship. Every change should make a recruiter understand
who I am and what I can do faster. Recruiters spend ~30 seconds here.

## The owner is learning
I'm a business student, not a developer. I maintain this site myself.
- Explain what you change in plain language, briefly.
- Prefer simple, readable code over clever code. Comment anything non-obvious.
- Never introduce a tool, library or concept I'd need to learn just to keep the site running.

## Stack — hard rules
- Plain HTML + CSS + vanilla JavaScript. **No frameworks, no npm, no build step, no Tailwind, no TypeScript.**
- Only external dependency allowed: Google Fonts.
- Must work by opening `index.html` directly or via `python -m http.server`.
- No backend, no analytics trackers, no cookies.

## File structure
```
index.html          # single page, semantic HTML
css/styles.css      # all styles; design tokens at the top
js/main.js          # theme toggle, formula bar, tabs, skill bars, project rendering
data/projects.json  # project content — the ONLY place projects live
assets/             # favicon.svg, og-image.png, project screenshots
README.md           # short: what this is, how to run locally
CLAUDE.md           # this file
```
Do not create other top-level files or folders without asking.

## Design system — Direction E "Spreadsheet"
The site imitates a modern spreadsheet app. Keep it tasteful: it's a portfolio first, a joke second.

**Fonts**: `Geist` (UI and headings, 400/500/700/800) and `Geist Mono` (formulas, cell refs, numbers).

**Colour tokens** — define on `:root`, override under `[data-theme="dark"]`. Never hard-code colours elsewhere.

| Token | Light | Dark |
|---|---|---|
| `--bg` | #FFFFFF | #111412 |
| `--fg` | #141A16 | #E7ECE8 |
| `--muted` | #56605A | #9BA59E |
| `--line` | #E0E4E1 | #2A302C |
| `--chrome` (toolbars, headers) | #F5F7F5 | #181C19 |
| `--tag` (chips, bar track) | #E9EEEA | #232A25 |
| `--accent` (Excel green) | #137A43 | #3FC37A |
| `--on-accent` | #FFFFFF | #0B1A11 |
| `--link` | #137A43 | #6FD99C |

**Theme**: default = visitor's `prefers-color-scheme`; toggle button in the header; choice saved in
`localStorage` (wrap in try/catch). Set `data-theme` on `<html>` before first paint (tiny inline script in `<head>`) so there's no flash.

**Signature elements** — keep these consistent if you edit:
- Formula bar (cell ref + `fx` + formula) that changes per section.
- Hero name inside a "selected cell" (2px accent outline + fill-handle square).
- Bottom sheet tabs: Projects | Skills | About | Contact.
- Projects as a table; skills as conditional-formatting data bars.
- Spreadsheet puns: max one per section. Don't overdo it.

**Motion**: subtle only (fades, bar fills, cursor blink). Everything respects
`prefers-reduced-motion: reduce` (disable animations).

## Content rules
- **Never invent facts**: no made-up projects, numbers, grades, clients, results or skills. Missing info → leave a visible `[TODO: ...]` and tell me.
- Don't show my age, phone number, email address, home address or date of birth.
- Contact is LinkedIn only (https://www.linkedin.com/in/jmgbuzzi/). No email links, no downloadable CV.
- Never commit secrets, API keys or passwords.
- Projects are rendered only from `data/projects.json`. Don't hard-code projects in HTML.
- Empty projects list must render the "Project pipeline loading" row — never a blank table.

## projects.json schema
```json
{
  "projects": [
    {
      "title": "Short project name",
      "question": "The business question it answers, one line",
      "summary": "Problem → what I did → result, 1–2 sentences",
      "tools": ["Python", "pandas"],
      "repo": "https://github.com/jmgbuzzi/repo-name or null",
      "demo": "https://... or null",
      "image": "assets/projects/repo-name.png or null",
      "date": "YYYY-MM",
      "featured": true
    }
  ]
}
```
Sort: featured first, then newest `date`.

## Workflow: "add project <repo-url>"
1. Read the repo's README (`gh repo view <repo> ` or `https://raw.githubusercontent.com/jmgbuzzi/<repo>/main/README.md`).
2. Extract title, business question, problem/approach/result, tools, demo link, first screenshot.
3. If the README lacks problem, approach or result, **stop and tell me what to add to the README** — fix the README, not the website.
4. Add the entry to `data/projects.json`. Copy the screenshot to `assets/projects/` if there is one.
5. Show me the diff, then give me the git commands.

A good project README has: one-line summary, the business question, data used, approach, key result (with a chart/screenshot), tools, how to run it.

## Accessibility & quality
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1`.
- Real `<button>` and `<a href>`; visible `:focus-visible` styles; `aria-label` on icon-only buttons.
- Text contrast WCAG AA (4.5:1) in BOTH themes. Touch targets ≥ 44px.
- Images: `alt` text, `loading="lazy"`, width/height set.
- Responsive: test at 375px, 768px, 1280px. No horizontal page scroll (tables scroll inside their own box).
- `<head>`: title, meta description, Open Graph tags (og:title, og:description, og:image, og:url), favicon.

## Definition of done (check before saying a change is finished)
- [ ] Works in both themes, toggle persists after reload
- [ ] No console errors
- [ ] Looks right at 375px and 1280px
- [ ] Empty and non-empty projects.json both render correctly
- [ ] No `[TODO]` left unless I've been told about it
- [ ] Links work (LinkedIn, GitHub)

## Git
- Small commits with clear messages in English, e.g. `Add project: churn analysis`, `Fix dark mode contrast on skills`.
- Never force-push. Never commit to a branch other than `main` unless I ask.
- Give me the commands; I run them myself.
