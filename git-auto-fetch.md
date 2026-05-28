OPTIONAL, IF I WILL MOVE TO YANDEX IT IS NO LONGER NEEDED.

* ALSO SET RULES AND ACCESS ON ONE FOLDER WITH PHOTOS AND MANIFEST FILE - SO IT DOES NOT TOUCH THEM


You do **not** need local auto-pull for Vercel deployment if your UI already commits photos/manifest to GitHub. Vercel should deploy from GitHub directly. Local auto-pull is only for keeping your computer repo synced.

Best plans:

**Plan A: Best Architecture**
Use GitHub as source of truth, Vercel Deploy Hook after photo publish.

Flow:

```text
Photos Dashboard UI
  -> /api/photos/upload-draft
  -> /api/photos/publish
  -> one GitHub commit with photos + manifest
  -> call Vercel Deploy Hook once
  -> Vercel deploys production
```

Add env:

```env
SECRET_VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...
```

Then in `src/routes/api/photos/publish/+server.ts`, after successful GitHub commit:

```ts
await fetch(env.SECRET_VERCEL_DEPLOY_HOOK, { method: 'POST' });
```

This is the cleanest. No local machine needed. No deploy storm if we call it only once after batch publish.

**Plan B: GitHub Actions Worker**
Create `.github/workflows/photos-deploy.yml`.

Trigger only when photos/manifest change:

```yaml
on:
  push:
    paths:
      - 'static/photos/**'
```

Then either:

- let Vercel GitHub integration deploy automatically, or
- call Vercel deploy hook from GitHub Actions.

Good if you want deployment logic outside app code.

**Plan C: Local Auto-Pull Worker**
Use only for syncing your local repo after UI changes.

Safe behavior:

```text
every 1-5 minutes:
  git fetch origin main
  if local worktree is clean:
    git pull --ff-only
  else:
    skip and log "dirty worktree"
```

Do **not** auto-push from local. Your UI already pushed to GitHub. Auto-push from local can overwrite or conflict with your code work.

Windows PowerShell worker idea:

```powershell
git fetch origin main
$dirty = git status --porcelain
if ($dirty) { exit 0 }

$behind = git rev-list --count HEAD..origin/main
if ([int]$behind -gt 0) {
  git pull --ff-only
}
```

Run it with Windows Task Scheduler every few minutes.

**Plan D: Local Webhook**
GitHub webhook -> local endpoint -> local `git pull`.

I do **not** recommend this unless you really need instant sync. Your local PC needs a public tunnel like Cloudflare Tunnel/ngrok, webhook signature validation, and careful command security.

My recommendation: **Plan A + optional Plan C**.

Use Vercel Deploy Hook from `/api/photos/publish` for production, and a small local polling worker only to keep your repo updated.