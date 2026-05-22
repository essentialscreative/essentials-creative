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
