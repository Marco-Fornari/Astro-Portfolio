# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters hiring for SOC/security roles and technical hiring managers evaluating a junior candidate. They arrive from a CV, LinkedIn or an application, with limited time, and need to judge quickly who Marco is, what he has actually built and whether he fits a security-operations team.

## Product Purpose

A bilingual (IT/EN) single-page personal portfolio for Marco Fornari, Junior SOC Analyst and developer. It exists so a visitor understands who he is: profile, experience, education, skills. The CV download and contact details are present but secondary. Success is the visitor leaving with a clear, credible picture of his profile.

## Positioning

He is both a security analyst and a builder: he does not only use detection tooling, he engineers it (Overguard, an anti-phishing/BEC platform with IoC extraction, correlation across 5 threat-intel feeds and risk scoring). Add an unusual background in performing arts and audiovisual production, which supports clear technical communication.

## Operating Context

Single static page with numbered chapters (01 About, 02 Experience, 03 Contact) after a pinned hero. Deployed on Netlify at https://mfornaridev.netlify.app. CV PDF served from `public/Marco_Fornari_CV.pdf`.

## Capabilities and Constraints

- Italian and English are both mandatory; runtime dictionary in `src/i18n/dictionary.js`, choice persisted in `localStorage`.
- Astro 4 static output, no runtime framework, vanilla ES modules, system font stacks, minimal JS. README documents this as a deliberate engineering choice.
- Content must stay aligned with the CV (recent commit: "Allinea Chi Sono, Esperienza e Competenze al CV").
- Credentials are in progress/real: CEH in preparation; do not overstate certifications.

## Brand Commitments

Existing "system / terminal" identity: numbered chapters, monospaced technical typography, interactions that read as a machine processing information. Hero words: DIFENDI / ANALIZZA / PROTEGGI. Tagline: "La sicurezza è un processo, non un prodotto." (Recorded from the incumbent; not re-opened here.)

## Evidence on Hand

- Real experience: Overguard (Feb–Jul 2026), earlier Junior Developer role (Apr 2025–Jan 2026).
- ITS Industrial Software Development 110/110 cum laude; Google Cybersecurity Certificate; UNIVPM cyber training; CEH in preparation.
- CV PDF in `public/`.
- No testimonials, public case studies, or metrics beyond those in the CV copy; do not fabricate any.

## Product Principles

1. Credibility over spectacle: every claim traceable to the CV.
2. Show the builder and the analyst together; the pairing is the story.
3. Equal quality in Italian and English; neither is a translation afterthought.
4. Quick to scan for a time-pressed recruiter, rewarding for a technical reader.
5. Keep the site lean and dependency-free, as proof of engineering taste.

## Accessibility & Inclusion

No product-specific standard established; respect reduced-motion preferences (already handled via `reduceMotion` state) and keep text legible for recruiters reading on any device.
