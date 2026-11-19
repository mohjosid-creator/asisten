export interface NeuroRepoItem {
  repo: string;
  name: string;
  roleInJarvis: string;
  keywords: string[];
}

export interface NeuroDomain {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  orchestrationFocus: string;
  keywords: string[];
  repos: NeuroRepoItem[];
}

export const NEURO_DOMAINS: NeuroDomain[] = [
  {
    id: "orkestrasi-agen",
    number: "01",
    name: "Orkestrasi Agen, Gateway Model & Perencanaan Tugas",
    shortName: "Orkestrasi & Gateway",
    description:
      "Mengurai tujuan besar menjadi langkah terstruktur, menyatukan rute akses multi-model AI, meninjau rencana sebelum eksekusi, dan memantau tim agen.",
    orchestrationFocus:
      "Pemecahan tugas multi-langkah, routing gateway API multi-model, anotasi rencana, dan modularisasi skill.",
    keywords: [
      "rencana",
      "orkestrasi",
      "tugas",
      "agen",
      "multi-agent",
      "skill",
      "workflow",
      "tim",
      "prioritas",
      "jadwal",
      "sub2api",
      "gateway",
      "api",
      "routing",
    ],
    repos: [
      {
        repo: "mukul975/awesome-ai-agents",
        name: "Awesome AI Agents",
        roleInJarvis: "Referensi pola arsitektur agen otonom dan pemilihan strategi tugas.",
        keywords: ["agen", "otonom", "pola", "referensi"],
      },
      {
        repo: "openai/openai-agents-js",
        name: "OpenAI Agents JS",
        roleInJarvis: "Pola handoff antar-agen dan orkestrasi alur kerja suara/teks di Node.js.",
        keywords: ["handoff", "multi-agen", "js", "voice"],
      },
      {
        repo: "irfan420x/orion-agent",
        name: "Orion Agent",
        roleInJarvis: "Pola agen OS local-first yang agnostik terhadap model melalui CLI dan pesan.",
        keywords: ["lokal", "os", "cli", "orion"],
      },
      {
        repo: "backnotprop/plannotator",
        name: "Plannotator",
        roleInJarvis: "Validasi rencana kerja, peninjauan langkah, dan persetujuan manusia sebelum eksekusi.",
        keywords: ["plan", "tinjau", "anotasi", "persetujuan"],
      },
      {
        repo: "mukul975/claude-team-dashboard",
        name: "Claude Team Dashboard",
        roleInJarvis: "Pemantauan status eksekusi tim agen secara waktu nyata.",
        keywords: ["monitoring", "dasbor", "tim"],
      },
      {
        repo: "anthropics/skills",
        name: "Anthropic Agent Skills",
        roleInJarvis: "Standar definisi skill modular yang dapat dipanggil ulang saat berpikir.",
        keywords: ["skill", "standar", "modular"],
      },
      {
        repo: "anthropics/knowledge-work-plugins",
        name: "Knowledge Work Plugins",
        roleInJarvis: "Plugin produktivitas untuk menyusun riset, dokumen, dan alur kerja pengetahuan.",
        keywords: ["pengetahuan", "plugin", "dokumen", "riset"],
      },
      {
        repo: "Hinln/sub2api",
        name: "Sub2API Multi-Model Relay",
        roleInJarvis: "Layanan gateway terpadu untuk menyatukan dan merutekan akses model Claude, OpenAI, Gemini, dan Grok.",
        keywords: ["sub2api", "relay", "gateway", "routing", "subscription"],
      },
    ],
  },
  {
    id: "rekayasa-kode",
    number: "02",
    name: "Rekayasa Perangkat Lunak & Otomasi Kode",
    shortName: "Rekayasa Kode",
    description:
      "Membangun aplikasi full-stack, meninjau kualitas kode, mengelola worktree paralel, dan menganalisis perilaku aplikasi hingga level biner.",
    orchestrationFocus:
      "Pembuatan aplikasi, peninjauan kode otomatis, manajemen Git worktree paralel, dan rekayasa balik.",
    keywords: [
      "kode",
      "coding",
      "aplikasi",
      "web",
      "review",
      "git",
      "worktree",
      "bug",
      "reverse",
      "build",
      "deploy",
    ],
    repos: [
      {
        repo: "stackblitz/bolt.new",
        name: "Bolt.new",
        roleInJarvis: "Perencanaan pembangunan aplikasi web full-stack langsung dari instruksi.",
        keywords: ["web", "fullstack", "prompt", "deploy"],
      },
      {
        repo: "pervaziv/pervaziv-ai-code-review",
        name: "Pervaziv AI Code Review",
        roleInJarvis: "Audit kualitas kode, deteksi bug dini, dan saran perbaikan terstruktur.",
        keywords: ["review", "audit", "kode", "bug"],
      },
      {
        repo: "Jakeschincariol/replica-skill",
        name: "Replica Skill",
        roleInJarvis: "Alur kloning struktur fitur, pengujian bug, dan perbaikan UX aplikasi.",
        keywords: ["replika", "uji", "ux", "perbaikan"],
      },
      {
        repo: "morluto/rea",
        name: "REA Reverse Engineering",
        roleInJarvis: "Analisis alur perilaku aplikasi hingga level biner secara sistematis.",
        keywords: ["reverse", "biner", "analisis"],
      },
      {
        repo: "max-sixty/worktrunk",
        name: "Worktrunk",
        roleInJarvis: "Orkestrasi Git worktree paralel agar beberapa tugas kode berjalan tanpa bentrok.",
        keywords: ["git", "worktree", "paralel", "branch"],
      },
      {
        repo: "Austin1serb/Anthropic-Leaked-Source-Code",
        name: "Studi Arsitektur Tool-Calling",
        roleInJarvis: "Referensi pola perancangan loop agen dan manajemen konteks lokal.",
        keywords: ["arsitektur", "konteks", "loop"],
      },
    ],
  },
  {
    id: "keamanan-privasi",
    number: "03",
    name: "Keamanan Siber, Privasi & OSINT",
    shortName: "Keamanan & Privasi",
    description:
      "Menjalankan audit keamanan berstandar MITRE/NIST, kepatuhan privasi data (UU PDP/GDPR), pelacakan CVE, pemindaian OSS, dan investigasi OSINT.",
    orchestrationFocus:
      "Penilaian risiko keamanan, kepatuhan privasi data, verifikasi CVE, dan intelijen sumber terbuka.",
    keywords: [
      "keamanan",
      "cyber",
      "privasi",
      "cve",
      "kerentanan",
      "audit",
      "osint",
      "pentest",
      "dork",
      "sherlock",
      "gdpr",
      "pdp",
      "scanner",
    ],
    repos: [
      {
        repo: "mukul975/Anthropic-Cybersecurity-Skills",
        name: "Cybersecurity Skills (817+)",
        roleInJarvis: "Pemetaan kontrol keamanan ke MITRE ATT&CK, NIST CSF 2.0, ATLAS, dan D3FEND.",
        keywords: ["mitre", "nist", "keamanan", "pertahanan"],
      },
      {
        repo: "mukul975/Privacy-Data-Protection-Skills",
        name: "Privacy & Data Protection Skills",
        roleInJarvis: "Kepatuhan privasi dan tata kelola data (GDPR, CCPA, EU AI Act, UU PDP).",
        keywords: ["privasi", "gdpr", "pdp", "kepatuhan"],
      },
      {
        repo: "mukul975/cve-mcp-server",
        name: "CVE MCP Server",
        roleInJarvis: "Pencarian CVE, skor EPSS, daftar CISA KEV, dan intelijen ancaman.",
        keywords: ["cve", "epss", "cisa", "mcp"],
      },
      {
        repo: "mukul975/cve-evidence-explorer",
        name: "CVE Evidence Explorer",
        roleInJarvis: "Penelusuran bukti kerentanan untuk memastikan temuan dapat diverifikasi.",
        keywords: ["bukti", "cve", "verifikasi"],
      },
      {
        repo: "anthropics/oss-scanner",
        name: "OSS Scanner",
        roleInJarvis: "Pemindaian keamanan paket dan dependensi sumber terbuka.",
        keywords: ["scanner", "oss", "dependensi"],
      },
      {
        repo: "yee-yore/DorkAgent",
        name: "DorkAgent",
        roleInJarvis: "Otomatisasi kueri pencarian terstruktur untuk audit eksposur publik.",
        keywords: ["dork", "bug", "pentest", "audit"],
      },
      {
        repo: "sherlock-project/sherlock",
        name: "Sherlock OSINT",
        roleInJarvis: "Penelusuran jejak akun lintas jejaring sosial dalam investigasi OSINT legal.",
        keywords: ["osint", "username", "investigasi"],
      },
    ],
  },
  {
    id: "neuro-infrastruktur",
    number: "04",
    name: "Simulasi Neuro, Jaringan Terdistribusi & Observabilitas",
    shortName: "Neuro & Infrastruktur",
    description:
      "Menggabungkan pemodelan jaringan saraf komputasional, konektivitas protokol industri/MQTT, RPC berlatensi rendah, kompresi cepat, dan pemantauan metrik.",
    orchestrationFocus:
      "Simulasi neuro-komputasional, komunikasi antar-layanan berkecepatan tinggi, pemantauan sistem, dan efisiensi memori.",
    keywords: [
      "neuro",
      "neuron",
      "simulasi",
      "jaringan",
      "mqtt",
      "rpc",
      "prometheus",
      "metrik",
      "monitoring",
      "lz4",
      "kompresi",
      "iot",
    ],
    repos: [
      {
        repo: "neuronsimulator/nrn",
        name: "NEURON Simulator",
        roleInJarvis: "Simulasi model jaringan saraf komputasional dan pemrosesan sinyal biologis.",
        keywords: ["neuron", "simulasi", "saraf"],
      },
      {
        repo: "neuronsimulator/ringtest",
        name: "CoreNEURON Ringtest",
        roleInJarvis: "Tolok ukur uji performa jaringan saraf cincin berskala cepat.",
        keywords: ["ringtest", "benchmark", "coreneuron"],
      },
      {
        repo: "emqx/neuron",
        name: "EMQX Neuron",
        roleInJarvis: "Konektivitas data perangkat industri ke jalur pemrosesan agen lokal.",
        keywords: ["industri", "konektivitas", "gateway"],
      },
      {
        repo: "emqx/NanoSDK",
        name: "EMQX NanoSDK",
        roleInJarvis: "Transport pesan MQTT 5.0 dan QUIC ringan untuk sinkronisasi node lokal.",
        keywords: ["mqtt", "quic", "pesan"],
      },
      {
        repo: "emqx/gen_rpc",
        name: "EMQX gen_rpc",
        roleInJarvis: "Pola panggilan prosedur jarak jauh (RPC) terukur antar-layanan terdistribusi.",
        keywords: ["rpc", "terdistribusi", "latensi"],
      },
      {
        repo: "prometheus/prometheus",
        name: "Prometheus Monitoring",
        roleInJarvis: "Pengumpulan metrik deret waktu untuk memantau kesehatan layanan dan beban kerja.",
        keywords: ["prometheus", "metrik", "observabilitas"],
      },
      {
        repo: "lz4/lz4",
        name: "LZ4 Compression",
        roleInJarvis: "Kompresi cepat untuk cache konteks, arsip log, dan memori lokal.",
        keywords: ["kompresi", "cepat", "memori"],
      },
    ],
  },
  {
    id: "otomasi-windows-data",
    number: "05",
    name: "Otomasi Desktop Windows, Suara & Basis Data",
    shortName: "Windows & Data",
    description:
      "Mengendalikan aplikasi Windows melalui MCP, mengelola basis data MySQL secara aman, dan mengaktifkan input suara lokal di desktop.",
    orchestrationFocus:
      "Perintah kontrol Windows, diagnostik kueri SQL/MySQL, dan transkripsi suara desktop.",
    keywords: [
      "windows",
      "desktop",
      "mysql",
      "database",
      "sql",
      "suara",
      "voice",
      "stt",
      "otomasi",
      "mcp",
    ],
    repos: [
      {
        repo: "mukul975/mcp-windows-automation",
        name: "MCP Windows Automation (80+ Tools)",
        roleInJarvis: "Kontrol jendela, berkas, proses, dan tugas Windows via bahasa alami.",
        keywords: ["windows", "kontrol", "aplikasi", "mcp"],
      },
      {
        repo: "mukul975/mysql-mcp-server",
        name: "MySQL MCP Server (200+ Tools)",
        roleInJarvis: "Diagnostik, optimasi kueri, dan audit keamanan basis data MySQL.",
        keywords: ["mysql", "sql", "database", "diagnostik"],
      },
      {
        repo: "dev-infinity101/VocalFlow-windows",
        name: "VocalFlow Windows",
        roleInJarvis: "Input suara ke teks (speech-to-text) lokal yang responsif di Windows.",
        keywords: ["suara", "stt", "mikrofon", "windows"],
      },
    ],
  },
  {
    id: "persona-kreatif",
    number: "06",
    name: "Persona AI, Kebiasaan Produktif & Presentasi",
    shortName: "Persona & Produktivitas",
    description:
      "Membentuk karakter agen yang konsisten, melacak kebiasaan dan wawasan hidup harian (Constant), membuat presentasi PowerPoint, dan mengolah media lokal.",
    orchestrationFocus:
      "Kalibrasi persona asisten, pelacakan kebiasaan & konsistensi harian, pembuatan slide .pptx, dan pipeline media lokal.",
    keywords: [
      "persona",
      "gaya",
      "karakter",
      "presentasi",
      "ppt",
      "powerpoint",
      "slide",
      "video",
      "media",
      "forge",
      "kebiasaan",
      "habit",
      "constant",
      "konsistensi",
    ],
    repos: [
      {
        repo: "gede-cahya/personaforge",
        name: "PersonaForge (UPS v2)",
        roleInJarvis: "Mesin persona universal untuk Ollama, LangGraph, dan orkestrasi multi-agen.",
        keywords: ["persona", "ollama", "langgraph", "gaya"],
      },
      {
        repo: "YIKUAIBANZI/forge-skill",
        name: "Forge Skill",
        roleInJarvis: "Distilasi karakter dan konsistensi nada bicara asisten agar lebih manusiawi.",
        keywords: ["distilasi", "gaya", "nada"],
      },
      {
        repo: "himanshu-jadhav108/PersonaForge-AI",
        name: "PersonaForge AI (Local ONNX)",
        roleInJarvis: "Pipeline transformasi media lokal berbasis FastAPI dan ONNX Runtime secara offline.",
        keywords: ["onnx", "lokal", "offline", "media"],
      },
      {
        repo: "hugohe3/ppt-master",
        name: "PPT Master",
        roleInJarvis: "Mengubah dokumen dan garis besar rencana menjadi slide PowerPoint (.pptx) utuh.",
        keywords: ["ppt", "powerpoint", "slide", "presentasi"],
      },
      {
        repo: "yihui-dev/awesome-gemini4-argon-videos",
        name: "Awesome Gemini 4 Argon Videos",
        roleInJarvis: "Referensi rekayasa prompt generasi video dan alur kreatif multimodal.",
        keywords: ["video", "prompt", "gemini"],
      },
      {
        repo: "projecthellhound/Constant",
        name: "Constant (Habit & Insights)",
        roleInJarvis: "Asisten pengelola kebiasaan, konsistensi harian, dan wawasan produktivitas berbasis TypeScript.",
        keywords: ["constant", "habit", "kebiasaan", "konsistensi", "produktivitas"],
      },
    ],
  },
  {
    id: "riset-berita-publik",
    number: "07",
    name: "Riset Berita, Radar AI & Layanan Publik",
    shortName: "Riset & Berita",
    description:
      "Memantau perkembangan berita teknologi/AI secara real-time dan menyusun panduan layanan publik berbasis RAG.",
    orchestrationFocus:
      "Pemantauan sumber informasi terkini, kurasi berita AI, dan panduan layanan berbasis RAG.",
    keywords: [
      "berita",
      "news",
      "radar",
      "riset",
      "rag",
      "layanan",
      "informasi",
      "tren",
    ],
    repos: [
      {
        repo: "newsnext/newsnow",
        name: "NewsNow",
        roleInJarvis: "Kurasi berita aktual secara ringkas sebagai bahan ringkasan harian.",
        keywords: ["berita", "aktual", "ringkasan"],
      },
      {
        repo: "LearnPrompt/ai-news-radar",
        name: "AI News Radar",
        roleInJarvis: "Pemantauan radar berita AI 24 jam dan pelacakan sumber riset terbaru.",
        keywords: ["radar", "ai", "berita", "riset"],
      },
      {
        repo: "dev-infinity101/MAYA-AI",
        name: "MAYA-AI (RAG Multi-Agent)",
        roleInJarvis: "Pola panduan terpersonalisasi berbasis RAG untuk navigasi program dan prosedur.",
        keywords: ["rag", "panduan", "prosedur"],
      },
    ],
  },
  {
    id: "otomasi-telegram",
    number: "08",
    name: "Otomasi Bot & Ekosistem Telegram",
    shortName: "Otomasi Telegram",
    description:
      "Mengelola pengelompokan grup/channel Telegram secara otomatis dan alur bot transaksi/layanan pelanggan.",
    orchestrationFocus:
      "Otomasi pengelolaan pesan Telegram, kategorisasi channel, dan alur kerja bot layanan.",
    keywords: ["telegram", "bot", "channel", "grup", "toko", "reseller"],
    repos: [
      {
        repo: "Super1Windcloud/telegram-automatic",
        name: "Telegram Automatic",
        roleInJarvis: "Kategorisasi folder, grup, dan channel Telegram secara terstruktur.",
        keywords: ["telegram", "folder", "kategorisasi"],
      },
      {
        repo: "indmdevbots/Free-Telegram-Store-Bot",
        name: "Telegram Store Bot",
        roleInJarvis: "Alur pengelolaan katalog produk, pesanan, dan respons pelanggan di Telegram.",
        keywords: ["toko", "pesanan", "telegram"],
      },
      {
        repo: "indmdevbots/Telegram-Premium-Reseller-Bot",
        name: "Telegram Reseller Bot",
        roleInJarvis: "Otomatisasi proses transaksi dan verifikasi layanan bot Telegram.",
        keywords: ["reseller", "otomatis", "telegram"],
      },
    ],
  },
  {
    id: "pengujian-web-bounty",
    number: "09",
    name: "Pengujian Keamanan Web & Bug Bounty Otonom",
    shortName: "Bug Bounty & WebSec",
    description:
      "Perangkat pengujian keamanan aplikasi web dan direktori secara otonom untuk XSS, command injection, SSRF, LDAP, pembangun skill bug bounty, serta lab pelatihan legal.",
    orchestrationFocus:
      "Pemetaan permukaan serangan web, verifikasi kerentanan bertingkat (XSS, CMDi, SSRF, LDAP), dan pembuatan skill bug bounty dari laporan publik.",
    keywords: [
      "xss",
      "ssrf",
      "command injection",
      "cmdmap",
      "ldap",
      "bug bounty",
      "bounty",
      "x5sentry",
      "gateforge",
      "agent389",
      "hellcorp",
      "hackerone",
      "hunter",
    ],
    repos: [
      {
        repo: "projecthellhound/X5Sentry",
        name: "X5Sentry (Autonomous XSS)",
        roleInJarvis: "Pemetaan permukaan serangan XSS, analisis karakter yang bertahan, dan validasi via browser headless.",
        keywords: ["xss", "browser", "sentry", "validasi"],
      },
      {
        repo: "projecthellhound/cmdmap",
        name: "CMDmap (Command Injection)",
        roleInJarvis: "Deteksi command injection bertingkat untuk meminimalkan false positive dan menguji bypass filter web.",
        keywords: ["cmdmap", "command", "injection", "bypass"],
      },
      {
        repo: "projecthellhound/GateForge",
        name: "GateForge (SSRF Agent)",
        roleInJarvis: "Agen semi-otonom untuk menemukan dan memverifikasi celah Server-Side Request Forgery (SSRF).",
        keywords: ["ssrf", "gateforge", "jaringan"],
      },
      {
        repo: "projecthellhound/Agent389",
        name: "Agent389 (LDAP Toolkit)",
        roleInJarvis: "Toolkit otonom untuk pengujian dan audit keamanan layanan direktori LDAP.",
        keywords: ["ldap", "direktori", "agent389"],
      },
      {
        repo: "projecthellhound/HellCorp",
        name: "HellCorp Enterprise Lab",
        roleInJarvis: "Target lab web perusahaan yang sengaja rentan untuk simulasi pengujian dan pelatihan keamanan lokal.",
        keywords: ["hellcorp", "lab", "latihan", "simulasi"],
      },
      {
        repo: "awarexone/Agentic-Bug-Hunter",
        name: "Agentic Bug Hunter",
        roleInJarvis: "Toolkit berburu bug berbasis AI yang dapat dijalankan secara fleksibel dengan atau tanpa langganan.",
        keywords: ["bug", "hunter", "agentic", "bounty"],
      },
      {
        repo: "awarexone/public-skills-builder",
        name: "Public Skills Builder (18 Vuln)",
        roleInJarvis: "Menghasilkan skill bug bounty dari laporan publik HackerOne dan writeup GitHub untuk 18 kelas kerentanan.",
        keywords: ["hackerone", "writeup", "skills", "18"],
      },
    ],
  },
  {
    id: "audit-kode-web3",
    number: "10",
    name: "Audit Kode AI, Keamanan Web3 & Smart Contract",
    shortName: "Audit Kode & Web3",
    description:
      "Pemindaian dan perbaikan kerentanan proyek kode sebelum rilis, ditambah analisis statis bytecode Ethereum dan skill audit smart contract DeFi.",
    orchestrationFocus:
      "Pemindaian kerentanan kode pra-rilis (pre-ship), analisis statis bytecode EVM, dan audit keamanan Web3/DeFi.",
    keywords: [
      "axguard",
      "web3",
      "smart contract",
      "solidity",
      "ethereum",
      "evm",
      "defi",
      "vandal",
      "bytecode",
      "immunefi",
      "pre-ship",
    ],
    repos: [
      {
        repo: "awarexone/AXguard",
        name: "AXguard",
        roleInJarvis: "Pemindaian dan perbaikan otomatis kerentanan keamanan pada proyek kode sebelum rilis produksi.",
        keywords: ["axguard", "scan", "fix", "kode"],
      },
      {
        repo: "awarexone/web3-bug-bounty-hunting-ai-skills",
        name: "Web3 Bug Bounty AI Skills",
        roleInJarvis: "18 skill audit smart contract berbasis 2.749 laporan Immunefi dan 681 reproduksi DeFiHack.",
        keywords: ["web3", "immunefi", "defi", "smart contract"],
      },
      {
        repo: "usyd-blockchain/vandal",
        name: "Vandal (EVM Bytecode Analyzer)",
        roleInJarvis: "Framework analisis program statis untuk membongkar dan memeriksa bytecode smart contract Ethereum.",
        keywords: ["vandal", "ethereum", "bytecode", "statis"],
      },
    ],
  },
  {
    id: "operasi-keamanan-jaringan",
    number: "11",
    name: "Operasi Keamanan Terotorisasi & Deteksi Ancaman Jaringan",
    shortName: "Ops Keamanan & DNS",
    description:
      "Deteksi ancaman DNS (tunneling/eksfiltrasi/C2), platform pengujian penetrasi otonom ARTEX terikat lokal, serta pengujian vCenter terotorisasi.",
    orchestrationFocus:
      "Pemantauan anomali DNS, orkestrasi pengujian penetrasi terotorisasi berbasis ARTEX, dan validasi CVE infrastruktur virtualisasi.",
    keywords: [
      "artex",
      "spectre",
      "dns",
      "tunneling",
      "eksfiltrasi",
      "c2",
      "vcenter",
      "vmware",
      "vc-strike",
      "red team",
      "penetrasi",
    ],
    repos: [
      {
        repo: "projecthellhound/Spectre",
        name: "Spectre (DNS Threat Detection)",
        roleInJarvis: "Deteksi cerdas anomali DNS untuk mengungkap tunneling, eksfiltrasi data, dan komunikasi C2 terselubung.",
        keywords: ["spectre", "dns", "tunneling", "c2", "anomali"],
      },
      {
        repo: "Hinln/ARTEX",
        name: "ARTEX (v0.3.15 Core)",
        roleInJarvis: "Sumber referensi platform pengujian penetrasi otonom ARTEX v0.3.15 (AGPL-3.0).",
        keywords: ["artex", "penetrasi", "otonom"],
      },
      {
        repo: "failsafe-security/artex",
        name: "ARTEX FailSafe Local",
        roleInJarvis: "Distribusi ARTEX terikat lokal (locally bound) untuk lingkungan pengujian terisolasi yang terkendali.",
        keywords: ["artex", "failsafe", "lokal"],
      },
      {
        repo: "panda0x123/artex-ymh",
        name: "ARTEX-YMH Pipeline",
        roleInJarvis: "Varian alur pengujian keamanan menyeluruh dari perimeter luar ke jaringan internal terotorisasi.",
        keywords: ["artex", "internal", "perimeter"],
      },
      {
        repo: "panda0x123/vc-strike",
        name: "VC-Strike (Authorized vCenter Suite)",
        roleInJarvis: "Suite pengujian terotorisasi untuk audit CVE VMware vCenter (CVE-2026-59310 & CVE-2026-59309) via GUI dan CLI.",
        keywords: ["vcenter", "vmware", "cve", "strike"],
      },
    ],
  },
];

export const TOTAL_NEURO_REPOS = NEURO_DOMAINS.reduce(
  (sum, domain) => sum + domain.repos.length,
  0
);
