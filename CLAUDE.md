# Essentials Creative — Working Rules

Static website for the Essentials Creative collective. Deployed to Netlify.
**Keep this work clean, secure, and backed up. Follow these rules:**

## 1. One home
The project lives at `~/Sites/essentials-creative`. Never work out of `~/Downloads` or `~/Desktop`.

## 2. Back up often
Commit and push to the private GitHub repo (`essentialscreative/essentials-creative`) regularly — **always before big or risky changes.** Uncommitted work is unprotected.

## 3. Branch flow
- Edit on **`dev`** → preview locally → commit & push `dev`.
- Merge `dev` → **`main`** only when ready to publish.
- `main` is the published branch.

## 4. Publishing
Deploy via the **Netlify ↔ GitHub** connection: pushing `main` makes it live.
**Never drag the raw project folder into Netlify** — it would publish `.git/`, the `admin/` page, and internal docs. Git-based deploy only ships committed files (publish dir = `.`).

**Free-plan deploy rule (private repo):** Netlify's free plan only deploys commits from the **one verified Git contributor**. Every commit must be authored by the connected GitHub account — email `53064867+essentialscreative@users.noreply.github.com` (already set as this repo's `git config --local user.email`; do not change it). If a build fails with *"unrecognized Git contributor,"* see **[DEPLOY.md](DEPLOY.md)** (reconnect the account in Netlify → Git Contributors, or fall back to a public repo / Cloudflare Pages).

**A push landing on GitHub does not mean the site published.** Netlify can reject a deploy
before it builds. Check with:
```bash
npx netlify api listSiteDeploys --data '{"site_id":"23ee8761-7f24-4e91-ba4e-de97ca0de990"}'
```
Two failure modes seen so far: *"Unrecognized Git contributor"* (the rule above), and
*"Skipped due to account credit usage exceeded"* — free-tier credits are gone, which blocks
`netlify deploy --prod` too (returns `Forbidden`), not just Git-triggered builds. Credits
reset on the billing cycle; there is no way around it that doesn't cost money or change host.

## 5. Secrets
Anything in a static site is public. **Never hardcode API keys or tokens** in site files — use Netlify environment variables. Keep `admin/` in `.gitignore`.

## 6. Be careful with files
Before deleting or overwriting, check what a file is and preserve originals. Keep large original images (10 MB+) out of git long-term; commit web-optimized/WebP versions and store masters separately.

## 7. Verify before "done"
Preview changes in the running local site before considering them finished.

## Local preview
Static site — serve the folder root and open in a browser:
```
python3 -m http.server 8765 --bind 127.0.0.1
```
