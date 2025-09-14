# Security Policy

This document describes how to report security issues for **Dr. Gulko – Language Labs & Site** (Next.js + Vercel + Supabase + Stripe + AI routes).

---

## 🔒 Reporting a Vulnerability

- **Email (preferred):** security@drgulko.org  
  **Fallback:** sergey.guko99@gmail.com
- **PGP:** _optional_ — add your key block and fingerprint here  
  Fingerprint: `TODO-FINGERPRINT`
- **Accepted languages:** EN / DE / RU / UK

When reporting, please include:
1. **Summary:** short description + impact.
2. **Scope/Asset:** URL, endpoint, repo path, or component.
3. **Steps to Reproduce:** minimal PoC, requests/responses, timestamps (UTC), affected user role.
4. **Impact & Likelihood:** data read/write, account takeover, financial risk, etc.
5. **Environment:** browser/OS, device, extensions, network constraints.
6. **Any logs/screenshots:** scrub personal data.

We will acknowledge your report within **72 hours**, provide a triage result within **7 days**, and aim to fix high/critical issues within **30 days**.

---

## 🔁 Coordinated Disclosure

- Please allow us reasonable time to remediate before public disclosure.  
- We follow **90-day** coordinated disclosure by default (or earlier if fixed).  
- If we cannot reproduce or assess risk, we may ask for clarifications or a live session.

---

## 🎯 Scope

**In scope (owned/controlled):**
- `https://drgulko.org/` and subdomains
- Next.js App Router pages and **Edge/Node** API routes under `/api/*`
- Client code (React), serverless functions (Vercel), static assets
- Supabase (auth/storage/functions) used by the project
- Stripe webhooks and server-side payment integrations
- AI endpoints (Vercel AI SDK / route handlers) and prompt/response handling
- GitHub repository for this project (source, CI/CD)

**Out of scope (unless proven to affect in-scope assets):**
- 3rd-party services not controlled by us (e.g., Stripe, Supabase core, Vercel platform)
- Social media accounts
- Denial of Service (DoS), spam, resource exhaustion
- Physical attacks, social engineering, phishing of maintainers/users
- Rate-limit brute forcing, credential stuffing with real user data
- Clickjacking on pages lacking sensitive actions, missing best-practice headers without exploit
- Vulnerabilities requiring a compromised device, rooted OS, or non-default browser flags

---

## ✅ Rules of Engagement (Safe Harbor)

- Make **good-faith** efforts to avoid privacy violations, data destruction, or service disruption.
- **No exfiltration**: demonstrate impact with the **minimum** data necessary.
- **No access** to other users’ personal data unless essential to prove the issue (mask/redact whenever possible).
- Do not persist shells/backdoors, and promptly delete any test accounts you created.
- If you inadvertently access personal data, **stop** and report immediately.
- We will not pursue legal action for research performed in accordance with this policy.

---

## 🧭 Severity & Triage

We prioritize using **CVSS v3.1** (or later) and practical exploitability:
- **Critical/High**: auth bypass, RCE, SQLi, IDOR with sensitive data, payment tampering
- **Medium**: stored XSS, SSRF with limited impact, CSRF on non-sensitive actions
- **Low/Info**: missing security headers with no exploit, verbose errors, best-practice gaps

Duplicates: credit goes to the **first** verifiable report. Non-exploitable or out-of-scope issues may be closed as informative.

---

## 🧱 Supply Chain & Secrets

- We use lockfiles and automated dependency updates (e.g., Dependabot).  
- Please report:
  - Dependency CVEs that are exploitable in our context
  - Leaked credentials/tokens (provide location + rotation advice)
  - Build/CI misconfigurations enabling code injection or artifact tampering

If you find exposed secrets, **do not attempt to use them**. Report immediately so we can rotate.

---

## 🔐 Hardening Expectations

- TLS everywhere; HSTS on main domain (where applicable)
- CSRF protection on state-changing requests
- Output encoding and strict Content Security Policy where feasible
- Least-privilege service keys (Supabase/Stripe)
- Webhook signature verification
- Rate limiting and abuse controls for public endpoints
- Logging/alerting for auth and payment actions

---

## 🏅 Recognition / Bounty

- We currently **do not run a paid bug bounty**.  
- Qualifying researchers may be added to a public **Hall of Fame** (opt-in, with your handle).  
- If you’d like your name/URL listed, say so in your report.

**Hall of Fame**
- _Your name could be here_

---

## 🧾 Supported Versions

We patch the **main** branch and the **current production deployment**. Security fixes may be backported at our discretion if the change is low risk and high impact.

---

## 📄 Changelog

- 2025-09-14: Initial publication of SECURITY.md
