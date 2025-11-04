# GitHub Actions Setup Guide

## Overview

This project includes comprehensive GitHub Actions workflows for automated maintenance, security, and keep-alive pinging.

## Workflows Included

### 1. **Dependency Updates** (`dependency-updates.yml`)
- **Schedule**: Every Monday at 9:00 AM UTC
- **Purpose**: Automatically update npm dependencies
- **Actions**:
  - Updates all dependencies
  - Runs `npm audit fix`
  - Creates PR with changes
  - Tests build before PR

### 2. **Security Scan** (`security-scan.yml`)
- **Schedule**: Daily at 2:00 AM UTC
- **Purpose**: Scan for security vulnerabilities
- **Actions**:
  - Runs `npm audit`
  - Reviews dependencies
  - Uploads audit results
  - Fails on moderate+ vulnerabilities

### 3. **CodeQL Analysis** (`codeql-analysis.yml`)
- **Schedule**: Every Wednesday at 3:00 AM UTC
- **Purpose**: Advanced code security analysis
- **Actions**:
  - Analyzes JavaScript/TypeScript code
  - Scans for security issues
  - Reports vulnerabilities
  - Uses security-extended queries

### 4. **CI (Continuous Integration)** (`ci.yml`)
- **Trigger**: On push/PR to main
- **Purpose**: Build and test code
- **Actions**:
  - Runs TypeScript type checking
  - Builds project
  - Runs Lighthouse performance tests
  - Uploads build artifacts

### 5. **Supabase Keep-Alive** (`supabase-keepalive.yml`)
- **Schedule**: Every 6 hours
- **Purpose**: Prevent Supabase free tier from sleeping
- **Actions**:
  - Pings Supabase instance
  - Logs ping results
  - Keeps database active

### 6. **Dependabot** (`dependabot.yml`)
- **Schedule**: Weekly on Mondays
- **Purpose**: Automated dependency updates
- **Features**:
  - Groups related updates
  - Creates PRs automatically
  - Updates GitHub Actions too

---

## Setup Instructions

### Step 1: Enable GitHub Actions

1. Go to your repository: https://github.com/antonio59/izzy-reads
2. Click **Settings** → **Actions** → **General**
3. Under "Actions permissions", select:
   - ✅ **Allow all actions and reusable workflows**
4. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Step 2: Add Repository Secrets

**Required for Supabase Keep-Alive:**

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (from your `.env` file)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key (from your `.env` file)

### Step 3: Enable Dependabot

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Dependency graph**
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
   - ✅ **Dependabot version updates**

### Step 4: Enable CodeQL (Optional but Recommended)

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Code scanning**
3. Click **Set up** → **Advanced**
4. CodeQL workflow is already configured!

### Step 5: Configure Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - Status checks required: `test`, `security-audit`
5. Click **Create**

---

## Manual Commands

### Run Supabase Ping Locally

```bash
# Using npm script
npm run ping-supabase

# Or directly
node scripts/ping-supabase.js
```

### Run Security Audit

```bash
# Check for vulnerabilities
npm run security-audit

# Fix vulnerabilities
npm audit fix
```

### Update Dependencies

```bash
# Update all dependencies
npm run update-deps

# Or manually
npm update
npm audit fix
```

---

## Workflow Schedules

| Workflow | Frequency | Time (UTC) |
|----------|-----------|------------|
| Dependency Updates | Weekly | Monday 9:00 AM |
| Security Scan | Daily | 2:00 AM |
| CodeQL Analysis | Weekly | Wednesday 3:00 AM |
| Supabase Keep-Alive | Every 6 hours | 24/7 |
| Dependabot | Weekly | Monday 9:00 AM |

---

## Monitoring

### Check Workflow Status

1. Go to **Actions** tab in your repository
2. View recent workflow runs
3. Click on any run to see details

### Notifications

You'll receive GitHub notifications for:
- ❌ Failed workflows
- 🔒 Security vulnerabilities
- 📦 New Dependabot PRs
- ✅ Successful deployments

### Configure Notifications

1. Go to **Settings** → **Notifications**
2. Under "Actions":
   - ✅ **Send notifications for failed workflows only**
3. Choose email or web notifications

---

## Troubleshooting

### Supabase Keep-Alive Not Working

**Check:**
1. Are secrets configured correctly?
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist

2. Is workflow enabled?
   - Go to **Actions** → **Supabase Keep-Alive**
   - If disabled, click **Enable workflow**

3. Test manually:
   - Go to **Actions** → **Supabase Keep-Alive**
   - Click **Run workflow** → **Run workflow**

### Dependency Updates Creating Too Many PRs

**Solution:**
1. Edit `.github/dependabot.yml`
2. Adjust `open-pull-requests-limit`:
   ```yaml
   open-pull-requests-limit: 5  # Reduce from 10
   ```

### Security Scans Failing

**Solution:**
1. Review the failure in Actions tab
2. Run locally: `npm audit`
3. Fix vulnerabilities: `npm audit fix`
4. If critical issues can't be fixed:
   - Update dependencies manually
   - Or add exceptions (not recommended)

### CodeQL Taking Too Long

**Solution:**
1. CodeQL can take 5-10 minutes
2. This is normal for first run
3. Subsequent runs are faster
4. If consistently slow, consider running less frequently

---

## Customization

### Change Schedule Times

Edit workflow files in `.github/workflows/`:

```yaml
on:
  schedule:
    # Change this cron expression
    - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

**Cron Format:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Daily at midnight
- `0 9 * * 1` - Every Monday at 9 AM
- `0 0 1 * *` - First day of every month

### Disable Specific Workflows

1. Go to **Actions** tab
2. Click on workflow name
3. Click **⋯** (three dots)
4. Click **Disable workflow**

---

## Security Best Practices

### Secrets Management

- ✅ **Never** commit secrets to git
- ✅ **Always** use GitHub Secrets for sensitive data
- ✅ **Rotate** secrets regularly (every 90 days)
- ✅ **Use** least privilege principle

### Workflow Security

- ✅ **Pin** action versions (use `@v4` not `@main`)
- ✅ **Review** Dependabot PRs before merging
- ✅ **Monitor** workflow logs for suspicious activity
- ✅ **Limit** workflow permissions to minimum required

### Dependency Security

- ✅ **Update** dependencies weekly
- ✅ **Review** security advisories
- ✅ **Test** before deploying updates
- ✅ **Document** any security exceptions

---

## Resources

### GitHub Documentation
- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [CodeQL](https://codeql.github.com/)
- [Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### Workflow Files
- `.github/workflows/dependency-updates.yml`
- `.github/workflows/security-scan.yml`
- `.github/workflows/codeql-analysis.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/supabase-keepalive.yml`
- `.github/dependabot.yml`

### Support
- GitHub Actions: https://github.community/
- Project Issues: https://github.com/antonio59/izzy-reads/issues

---

**Last Updated**: 2025-01-04  
**Next Review**: 2025-04-04
