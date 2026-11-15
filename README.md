# Yobin Omkar Bangera | Portfolio

A static portfolio website: plain HTML, CSS and JavaScript. There is no build step and nothing to install, so what is in this folder is exactly what gets published.

## Folder structure

```
portfolio/
├── index.html              Home page: all portfolio content
├── 404.html                "Page not found" page
├── favicon.svg             Browser tab icon
├── robots.txt              Tells search engines the site can be indexed
├── vercel.json             Hosting settings and security headers
├── assets/
│   ├── css/
│   │   ├── tokens.css      Colours, fonts, sizes (edit here to restyle the site)
│   │   ├── base.css        Reset, typography, layout helpers, scroll reveal
│   │   ├── components.css  Header, buttons, cards, chips, timeline, footer
│   │   └── sections.css    Hero, about, projects, contact
│   ├── js/
│   │   ├── theme-init.js   Applies the saved light/dark theme before the page shows
│   │   └── main.js         Theme toggle, mobile menu, scroll animations
│   ├── images/             Photos and screenshots (WebP)
│   └── resume/             The résumé PDF behind the "Download résumé" buttons
└── tools/
    └── serve.py            Local preview server (not published)
```

## Preview it on your computer

```bash
python tools/serve.py
```

Then open http://localhost:4173. The preview server applies the same security headers as the live site, so if something is blocked there it will be blocked on Vercel too.

## Common edits

| I want to...                     | Where                                                                 |
| -------------------------------- | --------------------------------------------------------------------- |
| Change any text                  | `index.html`, in the matching section (each has a comment banner)     |
| Add a featured project           | `index.html`: copy an `<article class="project">` block and edit it   |
| Add a smaller project            | `index.html`: copy an `<article class="card mini-project">` block     |
| Update the résumé                | Replace `assets/resume/Yobin_Bangera_Resume.pdf` (keep the file name) |
| Add a job or a degree            | `index.html`: copy a `<li class="timeline-item">` block               |
| Add an achievement or skill card | `index.html`: copy an `<article class="card">` block                  |
| Change colours or fonts          | `assets/css/tokens.css`                                               |
| Replace the profile photo        | Save the new photo as `assets/images/profile.webp` (800 x 1000 px)    |
| Add a project screenshot         | Save it in `assets/images/` as WebP, about 1280 px wide               |

### Adding images

Keep images small: export as WebP, no wider than about 1280 px. Photos taken on a phone contain hidden data (device, sometimes location), so export or resize them before adding them here instead of copying the original file.

Always set `width`, `height` and a descriptive `alt` on `<img>` tags.

## Security

The site has no backend, forms, cookies or database, which removes most ways a website can be attacked. On top of that, `vercel.json` sends these headers with every page:

| Header                      | What it does                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | Only scripts and styles from this site can run. Blocks injected scripts (XSS).               |
| `Strict-Transport-Security` | Browsers always use HTTPS.                                                                   |
| `X-Frame-Options`           | Other sites cannot embed this one in a frame (clickjacking).                                 |
| `X-Content-Type-Options`    | Browsers cannot guess file types.                                                            |
| `Referrer-Policy`           | Limits what other sites learn when someone clicks a link here.                               |
| `Permissions-Policy`        | Camera, microphone, location and similar features are switched off.                          |

Rules to keep it that way:

- **No inline code.** Do not add `<script>...</script>` blocks, `onclick="..."` or `style="..."` to the HTML. Put JavaScript in `assets/js/` and styles in `assets/css/`. Inline code is blocked by the Content-Security-Policy.
- **New external services need allowing.** If you add something loaded from another website (a font, a script, an embed), add its address to the `Content-Security-Policy` line in `vercel.json`, or it will be blocked.
- **External links** opened in a new tab use `rel="noopener noreferrer"`.
- **The résumé is public.** Anyone can download the PDF, so keep your phone number and home address out of it unless you want them online.
- **Never commit secrets** (passwords, API keys, `.env` files). Everything in this repository is public.

## Deploying on Vercel

The GitHub repository is connected to Vercel, so publishing is just pushing to `main`:

```bash
git add .
```

```bash
git commit -m "Describe what changed"
```

```bash
git push
```

Vercel redeploys automatically within about a minute.

To set it up from scratch: sign in at vercel.com with GitHub, choose **Add New > Project**, import this repository, leave the framework preset as **Other** with no build command, and deploy.
