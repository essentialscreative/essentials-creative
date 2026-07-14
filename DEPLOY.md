# Deploying & editing the site (free, no Netlify Pro)

The site auto-deploys to Netlify when you push to **`main`** on GitHub
(`essentialscreative/essentials-creative`). Hosting is **free** — but there's **one rule**
you must follow on the free plan with a **private** repo.

## ⭐ The one rule
**Netlify free + private repo = only ONE verified Git contributor may deploy.**
Every commit must be authored by the connected GitHub account, whose address is:

```
53064867+essentialscreative@users.noreply.github.com
```

This repo is already configured to use it (`git config --local user.email`), so you don't
have to think about it on this computer. **Don't change the repo's git email**, or builds
will fail with *"unrecognized Git contributor."*

## Normal editing workflow
```bash
# 1. edit files (or have Claude Code edit them)
# 2. preview locally if you want:
python3 -m http.server 8765 --bind 127.0.0.1   # then open http://127.0.0.1:8765
# 3. ship it:
git add -A
git commit -m "describe the change"
git push origin main      # Netlify auto-builds and publishes (~1 min)
```
That's it — no Pro needed, as long as commits stay authored by the address above.

## Setting up on a NEW computer (or a new tool)
Run these once inside the repo so commits are recognized:
```bash
git config --local user.name  "Essentials Creative"
git config --local user.email "53064867+essentialscreative@users.noreply.github.com"
git config --local core.hooksPath .githooks   # enable the safety hook below
```
Also make sure the **essentialscreative** GitHub account stays connected in
Netlify → Project → **Git Contributors**.

## Safety net (pre-push hook)
This repo includes `.githooks/pre-push`, enabled via `core.hooksPath` above. It **blocks
any `git push`** that contains a commit not authored by the verified account — so a
wrong-author commit can never reach Netlify and fail the build. If you ever need to bypass
it: `git push --no-verify` (rarely needed).

## If a deploy fails: "unrecognized Git contributor"
1. **Netlify → Git Contributors** → confirm the **essentialscreative** GitHub account is connected/verified.
2. Confirm the commit author email is `53064867+essentialscreative@users.noreply.github.com`
   (`git log -1 --format='%ae'`).
3. Free fallbacks that remove the restriction entirely:
   - **Make the repo public** (GitHub → Settings → Change visibility). Netlify has no
     contributor limit on public repos. The repo has **no secrets** (Square keys are
     sandbox; real keys live in Netlify env vars; `admin/` is gitignored).
   - **Move to Cloudflare Pages** — free, deploys **private** GitHub repos with no
     contributor limit; reads similar redirects/headers.

## Shop status
`shop.html` / `tapestries.html` are **in development** and intentionally not linked. They're
redirected offline via `_redirects`. Re-enable them only when ready.
