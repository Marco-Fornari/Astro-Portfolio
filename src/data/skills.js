/* =========================================================
   SKILLS — lo stack, diviso in tre macro aree
   ---------------------------------------------------------
   Ogni voce: name (sempre uguale in IT/EN), icon (file in
   src/icons/skills/<icon>.svg) oppure mono (sigla per le voci
   senza logo), ctx = dove/come l'ho usata, mostrato nello zoom.
   Per aggiungere una tecnologia basta una riga qui.
   ========================================================= */

const t = (it, en = it) => ({ it, en });

export const AREAS = [
  {
    id: "dev",
    items: [
      { name: "C#", icon: "csharp", ctx: t("Overguard · backend .NET 10") },
      { name: ".NET / ASP.NET Core", icon: "dotnet", ctx: t("API REST · Clean Architecture", "REST APIs · Clean Architecture") },
      { name: "Entity Framework Core", icon: "efcore", ctx: t("ORM su PostgreSQL", "ORM on PostgreSQL") },
      { name: "JavaScript", icon: "javascript", ctx: t("Frontend ed estensioni browser", "Frontend and browser extensions") },
      { name: "PHP", icon: "php", ctx: t("Levante Yachts · portale aziendale", "Levante Yachts · company portal") },
      { name: "Python", icon: "python", ctx: t("Scripting e automazione", "Scripting and automation") },
      { name: "Flutter", icon: "flutter", ctx: t("App mobile multipiattaforma", "Cross-platform mobile apps") },
      { name: "HTML5", icon: "html5", ctx: t("Markup semantico e accessibile", "Semantic, accessible markup") },
      { name: "CSS3", icon: "css3", ctx: t("Layout responsive, nessun framework", "Responsive layout, no framework") },
      { name: "SQL", mono: "SQL", ctx: t("Query, verifica e bonifica dei dati", "Querying, checking and cleaning data") },
      { name: "PostgreSQL", icon: "postgresql", ctx: t("Overguard · database") },
      { name: "MySQL", icon: "mysql", ctx: t("Levante Yachts · database") },
      { name: "Bash", icon: "bash", ctx: t("Scripting su Linux", "Linux scripting") },
      { name: "Astro", icon: "astro", ctx: t("Questo portfolio · sito statico", "This portfolio · static site") },
      { name: "WordPress", icon: "wordpress", ctx: t("Pubblicazione automatizzata via API REST", "Automated publishing via REST API") },
      { name: "Git", icon: "git", ctx: t("Versionamento del codice", "Version control") },
      { name: "GitHub", icon: "github", ctx: t("Repository e collaborazione", "Repositories and collaboration") },
      { name: "GitHub Actions", icon: "githubactions", ctx: t("CI e controlli automatici", "CI and automated checks") },
      { name: "Docker", icon: "docker", ctx: t("Overguard · deploy su Linux", "Overguard · deployment on Linux") },
      { name: "Linux", icon: "linux", ctx: t("Processi, networking, log", "Processes, networking, logs") },
      { name: "Netlify", icon: "netlify", ctx: t("Deploy di questo sito con header di sicurezza", "Deploys this site with security headers") },
      { name: "npm", icon: "npm", ctx: t("Gestione dipendenze · npm audit", "Dependency management · npm audit") },
      { name: "Postman", icon: "postman", ctx: t("Test e debug di API REST", "Testing and debugging REST APIs") },
      { name: "Chrome Extensions", icon: "chrome", ctx: t("Overguard · estensione Manifest V3", "Overguard · Manifest V3 extension") },
      { name: "Thunderbird", icon: "thunderbird", ctx: t("Overguard · estensione per la posta", "Overguard · mail client add-on") },
      { name: "VS Code", icon: "vscode", ctx: t("Editor") },
      { name: "JetBrains Rider", icon: "rider", ctx: t("IDE per .NET", "IDE for .NET") },
    ],
  },
  {
    id: "ai",
    items: [
      { name: "Claude", icon: "claude", ctx: t("Sviluppo assistito · Claude Code", "AI-assisted development · Claude Code") },
      { name: "ChatGPT", icon: "openai", ctx: t("Ricerca, studio e documentazione", "Research, study and documentation") },
      { name: "GitHub Copilot", icon: "copilot", ctx: t("Completamento del codice nell'IDE", "In-IDE code completion") },
      { name: "Ollama", icon: "ollama", ctx: t("Modelli LLM in locale", "Running LLMs locally") },
      { name: "Model Context Protocol", icon: "mcp", ctx: t("Collegare strumenti e dati agli agenti AI", "Connecting tools and data to AI agents") },
    ],
  },
  {
    id: "cyber",
    items: [
      { name: "Kali Linux", icon: "kali", ctx: t("Laboratorio di preparazione CEH", "CEH preparation lab") },
      { name: "Burp Suite", icon: "burpsuite", ctx: t("Test di applicazioni web", "Web application testing") },
      { name: "Wireshark", icon: "wireshark", ctx: t("Analisi del traffico di rete", "Network traffic analysis") },
      { name: "Nmap", mono: "NMAP", ctx: t("Scansione e ricognizione di rete", "Network scanning and recon") },
      { name: "Metasploit", icon: "metasploit", ctx: t("Exploitation in laboratorio · CEH", "Lab exploitation · CEH") },
      { name: "OWASP", icon: "owasp", ctx: t("Top 10 · sicurezza applicativa", "Top 10 · application security") },
      { name: "Semgrep", mono: "SG", ctx: t("SAST con regole personalizzate", "SAST with custom rules") },
      { name: "VirusTotal", icon: "virustotal", ctx: t("Overguard · threat intelligence") },
      { name: "Splunk", icon: "splunk", ctx: t("SIEM · Google Cybersecurity Certificate") },
    ],
  },
];
