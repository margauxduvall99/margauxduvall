# Margaux Duvall — Portfolio

A static site (plain HTML/CSS/JS, no build step) — ready to push to GitHub and deploy on Vercel.

## File structure

```
index.html              → homepage
work/
  channel-community.html
  event-promotion.html
  strategy-integration.html
  team-promotion.html
  branch-launch.html
css/style.css            → all styling
js/main.js                → mobile nav + scoreboard count-up animation
```

## 1. Put it on GitHub

1. Unzip this folder somewhere on your computer.
2. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `portfolio`). Leave it empty — no README, no .gitignore.
3. In a terminal, `cd` into the unzipped folder and run:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```

   (Replace `YOUR-USERNAME` with your GitHub username. If you don't have Git installed, GitHub Desktop is an easier point-and-click option — create the repo there and drag the folder in.)

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **Add New → Project**.
3. Select your `portfolio` repository and click **Import**.
4. Vercel will detect it as a static site automatically — no framework, no build command needed. Just click **Deploy**.
5. In a minute or so you'll get a live URL like `portfolio-yourname.vercel.app`.

From then on, any time you push a change to the `main` branch on GitHub, Vercel redeploys automatically.

## 3. A few things worth doing next

- **Custom domain** — if you buy a domain (e.g. `margauxduvall.com`), add it under your Vercel project's **Settings → Domains**.
- **Adding project photos later** — the case-study pages currently have no photos. When you're ready, drop images into `assets/` and add `<img src="../assets/your-image.jpg" alt="…">` where you want them (the `.cs-gallery` class gives a tidy two-up layout).
- **Updating your résumé** — replace `assets/Margaux_Duvall_Resume.pdf` with a new PDF of the same name and every download link updates automatically.
- **Editing content** — everything is plain HTML, so you can open any `.html` file in a text editor and change the wording, links, or stats directly. Look for `data-count="..."` attributes on the bold numbers — that's what drives the count-up animation on scroll.

## Design notes

- Palette: deep navy (`--ink`), warm paper (`--paper`), electric indigo (`--signal`), gold (`--gold`) for the scoreboard stats.
- Type: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (stats/labels/nav).
- Signature element: the "scoreboard" — bold mono stat call-outs used in the hero and throughout each case study, echoing both your analytics-heavy work and your competitive athletics background.
