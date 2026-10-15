/* =========================================================
   I18N DICTIONARY — Italian / English
   ========================================================= */

export const I18N = {
  it: {
    "hero.title":
      "<span>DIFENDI</span><span>ANALIZZA</span><span>PROTEGGI</span>",
    "hero.role": "Developer · Cybersecurity",

    /* ABOUT */
    "about.kicker": "01 / CHI SONO",
    "about.lede": "Sviluppo software<br>e studio come difendere reti e sistemi.",
    "about.profile": "Profilo",
    "about.p1":
      "Ciao, sono Marco: <strong>developer junior</strong> con una passione per reti, sistemi e sicurezza informatica.",
    "about.p2":
      "Mi sono diplomato all'ITS in Industrial Software Development con 110 e lode. Nel 2026 ho sviluppato Overguard, una piattaforma anti-phishing per PMI: il primo progetto in cui ho unito sviluppo e sicurezza.",
    "about.goal": "Cosa cerco",
    "about.goalRoles":
      "<span>Sistemista di rete</span><span class=\"seek-or\">oppure</span><span>Cybersecurity analyst</span>",
    "about.goalText":
      "Oggi sono sviluppatore e voglio crescere in questa direzione, in un team dove le mie basi da developer siano utili e dove possa imparare sul campo. Nel frattempo preparo la certificazione CEH.",
    "about.goalCta": "Parliamone",

    /* EXPERIENCE */
    "xp.kicker": "02 / ESPERIENZA — STORIA DI SISTEMA",
    "xp.did": "Cosa ho fatto",
    "xp.learned": "Cosa ho imparato",
    "xp.stack": "Stack",

    "xp.j1.when": "FEB 2026 — LUG 2026",
    "xp.j1.role": "Junior Developer · Security Engineering",
    "xp.j1.desc":
      "Ho sviluppato Overguard, una piattaforma che aiuta le PMI a riconoscere email di phishing e tentativi di frode (Business Email Compromise). È stato anche il mio progetto di tesi ITS.",
    "xp.j1.points":
      "<li>Analisi automatica di header, mittente, dominio e link delle email, con estrazione degli indicatori di compromissione (IoC).</li>" +
      "<li>Punteggio di rischio basato su 5 fonti di threat intelligence (VirusTotal, AlienVault OTX, URLScan.io, Hybrid Analysis, Google Safe Browsing), con cache e fallback quando una fonte non risponde.</li>" +
      "<li>Modulo DLP che controlla i contenuti sensibili nelle email in uscita.</li>" +
      "<li>Backend .NET 10 con API REST protette da JWT, PostgreSQL e deploy Docker su Linux; estensioni per Chrome e Thunderbird collegate al backend.</li>",
    "xp.j1.learn":
      "A progettare un sistema completo, dal database alle estensioni del browser, e a chiedermi da subito cosa può andare storto: una fonte che smette di rispondere, un limite di chiamate API superato, un dato che esce quando non dovrebbe.",

    "xp.j2.when": "APR 2025 — GEN 2026",
    "xp.j2.role": "Junior Developer",
    "xp.j2.desc": "Ho lavorato sul portale aziendale, sia lato frontend che backend.",
    "xp.j2.points":
      "<li>Pubblicazione dei contenuti automatizzata collegando WordPress e Google Sheets tramite API REST.</li>" +
      "<li>Gestione del database MySQL, con query SQL per verificare e ripulire i dati.</li>" +
      "<li>Sviluppo di pagine e funzionalità in HTML, CSS, JavaScript e PHP.</li>",
    "xp.j2.learn":
      "A lavorare su un sistema già in uso, dove ogni modifica tocca dati e contenuti reali.",

    /* PROJECTS */
    "proj.title": "Progetti",
    "proj.p1.title": "Questo portfolio",
    "proj.p1.desc":
      "Il sito che stai leggendo: l'ho costruito partendo dalla sicurezza, non aggiungendola alla fine.",
    "proj.p1.points":
      "<li>Sito statico, per ridurre al minimo la superficie d'attacco.</li>" +
      "<li>Header di sicurezza HTTP (CSP, HSTS, Permissions-Policy) con valutazione A+ su securityheaders.com.</li>" +
      "<li>Analisi del codice con Semgrep e regole personalizzate, controllo delle dipendenze con npm audit.</li>",
    "proj.p1.learn":
      "A mettere in pratica su un progetto mio quello che avevo studiato: hardening, analisi statica e triage dei risultati.",

    /* EDUCATION */
    "edu.title": "Formazione &amp; Certificazioni",
    "edu.e4.when": "IN CORSO — 2026",
    "edu.e4.desc":
      "Preparazione in corso: ethical hacking, vulnerabilità, sicurezza di reti e sistemi.",
    "edu.e1.sub":
      "INDUSTRIAL SOFTWARE DEVELOPER<br>EQF LIVELLO 5 · 110/110 E LODE",
    "edu.e1.desc":
      "Percorso tecnico superiore biennale in sviluppo software industriale.",
    "edu.e2.desc":
      "Corso di perfezionamento (25 CFU): GDPR, gestione del rischio, sicurezza di reti e software.",
    "edu.e3.desc":
      "Python, Linux, SQL, SIEM, IDS, risk assessment, identificazione delle minacce, controlli di sicurezza.",

    /* SKILLS */
    "skills.kicker": "03 / COMPETENZE — STACK",
    "skills.headline": "Lo stack con cui<br><em>costruisco e difendo.</em>",
    "skills.count": "strumenti",
    "skills.dev": "Software Developer",
    "skills.dev.kw":
      "Clean Architecture · API REST · JWT · Estensioni browser · Automazione via API",
    "skills.ai": "Intelligenza artificiale",
    "skills.ai.kw":
      "Sviluppo assistito da AI · Prompt engineering · LLM in locale · Revisione critica del codice generato",
    "skills.cyber": "Cybersecurity",
    "skills.cyber.kw":
      "Rilevamento phishing &amp; BEC · Threat intelligence · Correlazione IoC · Risk scoring · DLP · Hardening HTTP · SAST / SCA · Analisi dei log · SIEM · IDS · Risk assessment · GDPR",

    /* CONTACT */
    "contact.kicker": "04 / CONTATTI",
    "contact.headline":
      "La sicurezza è un processo<br><em> non un prodotto.</em>",
    "contact.cv": "Scarica il CV",
  },
  en: {
    "hero.title": "<span>DEFEND</span><span>ANALYZE</span><span>PROTECT</span>",
    "hero.role": "Developer · Cybersecurity",

    /* ABOUT */
    "about.kicker": "01 / ABOUT",
    "about.lede": "I build software<br>and study how to defend networks and systems.",
    "about.profile": "Profile",
    "about.p1":
      "Hi, I'm Marco: a <strong>junior developer</strong> with a passion for networks, systems and cybersecurity.",
    "about.p2":
      "I graduated from ITS in Industrial Software Development with 110/110 cum laude. In 2026 I built Overguard, an anti-phishing platform for small businesses: the first project where I brought development and security together.",
    "about.goal": "Looking for",
    "about.goalRoles":
      "<span>Network &amp; systems administrator</span><span class=\"seek-or\">or</span><span>Cybersecurity analyst</span>",
    "about.goalText":
      "Today I'm a developer and I want to grow in this direction, in a team where my development background helps and I can learn on the job. Meanwhile, I'm preparing for the CEH certification.",
    "about.goalCta": "Let's talk",

    /* EXPERIENCE */
    "xp.kicker": "02 / EXPERIENCE — SYSTEM HISTORY",
    "xp.did": "What I did",
    "xp.learned": "What I learned",
    "xp.stack": "Stack",

    "xp.j1.when": "FEB 2026 — JUL 2026",
    "xp.j1.role": "Junior Developer · Security Engineering",
    "xp.j1.desc":
      "I built Overguard, a platform that helps small businesses spot phishing emails and Business Email Compromise fraud. It was also my ITS thesis project.",
    "xp.j1.points":
      "<li>Automated analysis of email headers, sender, domain and links, with extraction of indicators of compromise (IoCs).</li>" +
      "<li>Risk scoring across 5 threat intelligence sources (VirusTotal, AlienVault OTX, URLScan.io, Hybrid Analysis, Google Safe Browsing), with caching and fallback when a source doesn't respond.</li>" +
      "<li>DLP module that checks outgoing emails for sensitive content.</li>" +
      "<li>.NET 10 backend with JWT-secured REST APIs, PostgreSQL and Docker deployment on Linux; Chrome and Thunderbird extensions connected to the backend.</li>",
    "xp.j1.learn":
      "How to design a complete system, from the database to the browser extensions, and to ask early on what can go wrong: a source that stops responding, an API rate limit, data leaving when it shouldn't.",

    "xp.j2.when": "APR 2025 — JAN 2026",
    "xp.j2.role": "Junior Developer",
    "xp.j2.desc": "I worked on the company portal, on both frontend and backend.",
    "xp.j2.points":
      "<li>Automated content publishing by connecting WordPress and Google Sheets through REST APIs.</li>" +
      "<li>Managed the MySQL database, writing SQL queries to verify and clean data.</li>" +
      "<li>Built pages and features in HTML, CSS, JavaScript and PHP.</li>",
    "xp.j2.learn":
      "How to work on a live system, where every change touches real data and content.",

    /* PROJECTS */
    "proj.title": "Projects",
    "proj.p1.title": "This portfolio",
    "proj.p1.desc":
      "The site you're reading: I built it with security as the starting point, not an add-on.",
    "proj.p1.points":
      "<li>Static site, to keep the attack surface as small as possible.</li>" +
      "<li>HTTP security headers (CSP, HSTS, Permissions-Policy), rated A+ on securityheaders.com.</li>" +
      "<li>Code scanning with Semgrep and custom rules, dependency checks with npm audit.</li>",
    "proj.p1.learn":
      "To apply what I'd studied to a project of my own: hardening, static analysis and triaging the findings.",

    /* EDUCATION */
    "edu.title": "Education &amp; Certifications",
    "edu.e4.when": "IN PROGRESS — 2026",
    "edu.e4.desc":
      "Currently preparing: ethical hacking, vulnerabilities, network and system security.",
    "edu.e1.sub":
      "INDUSTRIAL SOFTWARE DEVELOPER<br>EQF LEVEL 5 · 110/110 CUM LAUDE",
    "edu.e1.desc":
      "Two-year higher technical program in industrial software development.",
    "edu.e2.desc":
      "Postgraduate course (25 ECTS): GDPR, risk management, network and software security.",
    "edu.e3.desc":
      "Python, Linux, SQL, SIEM, IDS, risk assessment, threat identification, security controls.",

    /* SKILLS */
    "skills.kicker": "03 / SKILLS — STACK",
    "skills.headline": "The stack I use<br><em>to build and defend.</em>",
    "skills.count": "tools",
    "skills.dev": "Software Developer",
    "skills.dev.kw":
      "Clean Architecture · REST API · JWT · Browser extensions · API automation",
    "skills.ai": "Artificial intelligence",
    "skills.ai.kw":
      "AI-assisted development · Prompt engineering · Local LLMs · Critical review of generated code",
    "skills.cyber": "Cybersecurity",
    "skills.cyber.kw":
      "Phishing &amp; BEC detection · Threat intelligence · IoC correlation · Risk scoring · DLP · HTTP hardening · SAST / SCA · Log analysis · SIEM · IDS · Risk assessment · GDPR",

    /* CONTACT */
    "contact.kicker": "04 / CONTACT",
    "contact.headline": "Security is a process<br><em> not a product.</em>",
    "contact.cv": "Download CV",
  },
};
export const NAV_I18N = {
  it: {
    home: "HOME",
    about: "CHI SONO",
    experience: "ESPERIENZA",
    skills: "COMPETENZE",
    contact: "CONTATTI",
  },
  en: {
    home: "HOME",
    about: "ABOUT",
    experience: "EXPERIENCE",
    skills: "SKILLS",
    contact: "CONTACT",
  },
};
