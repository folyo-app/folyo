# Security Policy

## Our Commitment

Security is a top priority at Folyo. We take the protection of user data and platform integrity seriously. This document outlines our security practices and how to report vulnerabilities.

## Supported Versions

Only the latest version of Folyo running at [folyo.tech](https://folyo.tech) receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

**Note**: This codebase is for transparency and educational purposes. Self-hosting is not permitted under the license terms, and security support is only provided for the official platform at folyo.tech.

## Security Features

### Authentication & Authorization
- bcrypt password hashing (cost factor 12)
- Secure session management
- HttpOnly and Secure cookie flags
- CSRF protection on all state-changing operations
- Session timeout after inactivity
- Account lockout after failed login attempts

### Data Protection
- Prepared statements for all database queries (SQL injection prevention)
- Input validation and sanitization
- Output encoding to prevent XSS
- Rate limiting on API endpoints
- Secure password reset with time-limited tokens

### Infrastructure
- HTTPS-only connections (TLS 1.2+)
- Redis caching with secure configuration
- Environment variables for sensitive configuration
- Regular security updates and patches
- Database access restricted to application layer

### API Security
- API key rotation support
- Request validation and sanitization
- Error messages that don't leak sensitive information
- Proper CORS configuration
- Rate limiting to prevent abuse

## Reporting a Vulnerability

**DO NOT** create public GitHub issues for security vulnerabilities.

### How to Report

Email security vulnerabilities to: **security@folyo.tech**

### What to Include

Please provide:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact and severity assessment
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Proof of Concept**: Code or screenshots demonstrating the vulnerability
5. **Suggested Fix**: If you have ideas on how to fix it (optional)
6. **Your Contact**: How we can reach you for follow-up

### Example Report

```
Subject: [SECURITY] SQL Injection in Portfolio API

Description:
The portfolio.php endpoint is vulnerable to SQL injection via the
'portfolio_id' parameter.

Impact:
An attacker could potentially access or modify database contents.

Steps to Reproduce:
1. Navigate to portfolio.php
2. Intercept the request
3. Modify portfolio_id parameter to: 1' OR '1'='1
4. Observe unauthorized data access

Proof of Concept:
[Screenshot or code sample]

Contact: researcher@example.com
```

## Response Process

### Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 3 business days
- **Regular Updates**: Every 7 days until resolved
- **Fix Deployment**: Depends on severity (critical issues within 48 hours)

### Severity Levels

**Critical** (Fix: 24-48 hours)
- Remote code execution
- Authentication bypass
- Data breach potential
- Mass data exposure

**High** (Fix: 3-7 days)
- Privilege escalation
- Unauthorized data access
- Cross-site scripting (stored)
- SQL injection

**Medium** (Fix: 14-30 days)
- Information disclosure
- Cross-site scripting (reflected)
- CSRF vulnerabilities
- Business logic flaws

**Low** (Fix: 30-60 days)
- Minor information leaks
- Best practice improvements
- Configuration issues

### What Happens Next

1. **We acknowledge** your report
2. **We investigate** and assess severity
3. **We develop** a fix
4. **We test** the fix thoroughly
5. **We deploy** the fix to production
6. **We notify** you when fixed
7. **We credit** you (if desired) after public disclosure

## Responsible Disclosure

We follow responsible disclosure practices:

- We ask for 90 days to fix issues before public disclosure
- Critical issues may need less time
- We'll coordinate disclosure timing with you
- We'll credit researchers (unless they prefer anonymity)

### Hall of Fame

We recognize security researchers who help make Folyo safer:

- *No vulnerabilities reported yet*

(Your name could be here! Report responsibly and we'll credit you.)

## Bug Bounty Program

We currently do not have a paid bug bounty program. However, we deeply appreciate security research and will:

- Acknowledge your contribution publicly (if desired)
- Provide detailed feedback on your report
- Keep you updated throughout the resolution process
- Credit you in our security hall of fame

## Scope

### In Scope

- Main Folyo platform (folyo.tech)
- API endpoints
- Authentication mechanisms
- Data handling and storage
- Client-side security issues

### Out of Scope

- Distributed Denial of Service (DDoS) attacks
- Social engineering attacks
- Physical attacks
- Issues requiring user interaction (except XSS)
- Automated scanning results without verification
- Issues in third-party services (report to them directly)
- Self-hosted instances (not supported under license)

## Security Best Practices for Contributors

If you're contributing code:

1. **Never commit secrets** (API keys, passwords, tokens)
2. **Use prepared statements** for all database queries
3. **Validate all input** from users and APIs
4. **Encode all output** to prevent XSS
5. **Use CSRF tokens** for state-changing operations
6. **Follow principle of least privilege** in code
7. **Keep dependencies updated** and avoid vulnerable packages
8. **Write secure code** following OWASP guidelines

## Questions?

For security-related questions:
- Email: security@folyo.tech

For general questions:
- Email: contact@folyo.tech

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [PHP Security Guide](https://www.php.net/manual/en/security.php)

---

**Thank you for helping keep Folyo and our users safe!**

Last Updated: January 2025
