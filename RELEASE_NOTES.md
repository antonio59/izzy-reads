# Release Notes - v1.2.0

**Release Date:** December 24, 2025

## 🎉 What's New

### Simplified Deployment with Netlify

We've migrated from Coolify (self-hosted Docker) to Netlify for a more reliable and simpler deployment experience.

**Benefits:**

- ⚡ Faster deployments
- 🔒 Automatic SSL certificates
- 🌍 Global CDN for better performance
- 🔄 Automatic branch deploys
- 👀 Preview deployments for PRs

### How It Works

| What you do          | What happens                     |
| -------------------- | -------------------------------- |
| Push to `main`       | Staging deploys automatically    |
| Push to `production` | Production deploys automatically |
| Open a PR            | Preview deployment created       |

---

## 🌐 Live Sites

- **Production:** [izzysbookshelf.com](https://izzysbookshelf.com)
- **Staging:** [izzysbookshelf.antoniosmith.xyz](https://izzysbookshelf.antoniosmith.xyz)

---

## 🗑️ Removed

The following files were removed as they're no longer needed:

- `Dockerfile` and `Dockerfile.staging`
- `nginx.conf`
- `deploy-staging.sh` and `deploy-production.sh`
- `.dockerignore`
- GitHub Actions workflows for Coolify

---

## 📋 Previous Release (v1.1.0)

### Rebranding

- Renamed from "Izzy Reads" to "Izzy's Bookshelf"
- New domains: izzysbookshelf.com and izzysbookshelf.antoniosmith.xyz

### Security Fixes

- Fixed insecure randomness vulnerability (Math.random → crypto.randomUUID)
- Updated all dependencies to latest secure versions

---

## 🚀 Getting Started

No changes needed for local development. Just run:

```bash
bun install
bun run dev
```

For deployment, just push to the appropriate branch - Netlify handles everything else!

---

## 📝 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.
