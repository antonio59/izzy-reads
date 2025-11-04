# Security Policy

## Supported Versions

We actively maintain and support the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

We take the security of Izzy-Reads seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report via Email

Send details to: **[Your Email Address]**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next release cycle

### 4. Responsible Disclosure

We request that you:
- Give us reasonable time to fix the issue before public disclosure
- Do not exploit the vulnerability
- Do not access or modify user data

## Security Measures

### Automated Security

This project uses:
- **Dependabot**: Automated dependency updates
- **CodeQL**: Code security analysis
- **npm audit**: Regular vulnerability scanning
- **GitHub Actions**: Security workflows

### Manual Reviews

- Code reviews required for all PRs
- Security-focused code review checklist
- Regular dependency updates

## Scope

### In Scope

- Authentication bypass
- Data exposure
- XSS vulnerabilities
- CSRF vulnerabilities
- SQL injection
- Dependency vulnerabilities
- API security issues

### Out of Scope

- Social engineering
- Physical security
- DDoS attacks
- Issues in third-party services (Supabase, etc.)
- Rate limiting

## Best Practices

### For Contributors

1. **Never commit secrets**
   - Use `.env` for sensitive data
   - Check `.gitignore` includes `.env`
   - Use environment variables

2. **Sanitize user input**
   - Validate all inputs
   - Use parameterized queries
   - Escape output

3. **Keep dependencies updated**
   - Review Dependabot PRs
   - Run `npm audit` regularly
   - Update critical vulnerabilities immediately

4. **Review security workflows**
   - Check GitHub Actions results
   - Address CodeQL warnings
   - Fix security audit issues

### For Users

1. **Keep your instance secure**
   - Use strong passwords
   - Enable 2FA on Supabase
   - Rotate API keys regularly

2. **Monitor access**
   - Review Supabase logs
   - Check for unusual activity
   - Limit access permissions

3. **Update regularly**
   - Pull latest changes
   - Run security updates
   - Monitor security advisories

## Security Workflow

### Weekly

- Dependabot checks dependencies
- Security scans run automatically
- Review and merge security PRs

### Monthly

- Manual security review
- Update all dependencies
- Review access logs

### Quarterly

- Full security audit
- Update security documentation
- Review and update policies

## Contact

For security concerns: **[Your Email Address]**

For general issues: Use GitHub Issues

## Recognition

We appreciate security researchers who responsibly disclose vulnerabilities. With your permission, we'll acknowledge your contribution in:
- CHANGELOG.md
- GitHub release notes
- Security Hall of Fame (coming soon)

---

**Last Updated**: 2025-01-04
**Next Review**: 2025-04-04
