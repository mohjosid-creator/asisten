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
    name: "Orkestrasi Agen & Perencanaan Tugas",
    shortName: "Orkestrasi Agen",
    description:
      "Mengurai tujuan besar menjadi langkah terstruktur, memilih agen spesialis, meninjau rencana sebelum eksekusi, dan memantau tim agen.",
    orchestrationFocus:
      "Pemecahan tugas multi-langkah, koordinasi tim agen, anotasi rencana, dan modularisasi skill.",
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
    name: "Persona AI, Pembentukan Skill & Presentasi",
    shortName: "Persona & Presentasi",
    description:
      "Membentuk karakter/persona agen yang konsisten di Ollama maupun LangGraph, membuat presentasi PowerPoint otomatis, dan mengolah media lokal.",
    orchestrationFocus:
      "Kalibrasi persona asisten, distilasi gaya komunikasi, pembuatan slide .pptx, dan pipeline media lokal.",
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
];

export const TOTAL_NEURO_REPOS = NEURO_DOMAINS.reduce(
  (sum, domain) => sum + domain.repos.length,
  0
);
