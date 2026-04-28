# Apoorv Jain — Portfolio

A responsive personal portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just clean, hand-written front-end code.

**Live:** [apoorvjain.vercel.app](https://apoorvjain.vercel.app) &nbsp;|&nbsp; **GitHub Pages:** [apoorv-jn24.github.io](https://apoorv-jn24.github.io)

---

## Features

- **Dark / Light mode** — persisted via `localStorage`
- **Scroll animations** — `IntersectionObserver`-based reveal (respects `prefers-reduced-motion`)
- **Live GitHub activity** — pulls public events and stats from the GitHub API with 30-min session cache
- **Working contact form** — AJAX submission via Formspree with client-side validation
- **Typed.js hero subtitle** — cycling role descriptions
- **Scroll progress bar** — top-of-page reading indicator
- **Fully responsive** — mobile menu, fluid layouts, no horizontal overflow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic, accessible) |
| Styling | CSS3 — custom properties, Grid, Flexbox |
| Scripting | Vanilla JavaScript (ES2020+) |
| Icons | Boxicons 2.1.4 |
| Typing effect | Typed.js 2.1.0 |
| Form handling | Formspree |
| Hosting | Vercel / GitHub Pages |

---
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

## Project Structure

```
portfolio/
├── index.html          # Single-page app — all sections
├── css/
│   └── style.css       # All styles, custom properties, dark mode
├── js/
│   └── script.js       # All interactivity — 16 documented modules
└── images/
    └── portfolio-photo.jpg
```

---

## Running Locally

No build step required.

```bash
git clone https://github.com/apoorv-jn24/apoorv-jn24.github.io.git
cd apoorv-jn24.github.io

# Option 1 — VS Code Live Server (recommended)
# Install the Live Server extension, right-click index.html → Open with Live Server

# Option 2 — Python
python -m http.server 8000
# Open http://localhost:8000
```

> Opening `index.html` directly as a `file://` URL works for most features, but the GitHub API calls may be blocked by CORS in some browsers. Use a local server to avoid this.

---

## Sections

| Section | What it shows |
|---|---|
| Hero | Name, role, availability status, key stats |
| About | Bio, location, email, current focus |
| Skills | Frontend, Backend, Tools — with proficiency indicators |
| Activity | Live GitHub stats + recent public event feed |
| Experience | Internship timeline (2× Python Developer) |
| Education | B.Tech Computer Science, COER University |
| Projects | 7 projects with stack badges, problem/solution/impact format |
| Contact | Formspree form + WhatsApp + copy-email |

---

## Contact

- **Email:** apoorvjainji@gmail.com
- **LinkedIn:** [apoorv-jain-0b7b14253](https://www.linkedin.com/in/apoorv-jain-0b7b14253/)
- **GitHub:** [@apoorv-jn24](https://github.com/apoorv-jn24)

---

*Open to full-time Software Engineering roles starting June 2026.*
