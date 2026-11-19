export interface PrereqItem {
  id: string;
  name: string;
  requirement: string;
  purpose: string;
  downloadUrl: string;
  installHint?: string;
}

export interface InstallStep {
  stepNumber: string;
  title: string;
  summary: string;
  commands: {
    label: string;
    code: string;
  }[];
  note?: string;
}

export interface EnvFieldDoc {
  key: string;
  defaultValue: string;
  description: string;
}

export interface TroubleshootItem {
  problem: string;
  cause: string;
  solution: string;
  command?: string;
}

export const PREREQUISITES: PrereqItem[] = [
  {
    id: "win11",
    name: "Windows 11",
    requirement: "Windows 11 (64-bit) & 3–5 GB ruang kosong",
    purpose: "Sistem operasi target resmi dan ruang simpan model AI lokal.",
    downloadUrl: "https://www.microsoft.com/software-download/windows11",
  },
  {
    id: "git-gh",
    name: "Git & GitHub CLI (gh)",
    requirement: "Git untuk Windows / GitHub CLI terbaru",
    purpose: "Untuk mengunduh kode sumber dengan perintah gh repo clone atau git clone.",
    downloadUrl: "https://cli.github.com/",
    installHint: "winget install --id Git.Git -e && winget install --id GitHub.cli -e",
  },
  {
    id: "python",
    name: "Python 3.13+",
    requirement: "Minimal versi 3.13 (centang 'Add Python to PATH')",
    purpose: "Menjalankan server backend FastAPI, LangGraph, dan skrip pengelolaan.",
    downloadUrl: "https://www.python.org/downloads/windows/",
    installHint: "winget install --id Python.Python.3.13 -e",
  },
  {
    id: "uv",
    name: "uv (Manajer Paket Python)",
    requirement: "Versi terbaru (CLI atau modul Python)",
    purpose: "Menginstal dependensi backend Python secara cepat dan terkunci (uv.lock).",
    downloadUrl: "https://docs.astral.sh/uv/getting-started/installation/",
    installHint: 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
  },
  {
    id: "node",
    name: "Node.js 24+ & pnpm 11+",
    requirement: "Node.js >= 24.0 dan pnpm >= 11.0",
    purpose: "Membangun dan menjalankan antarmuka React + Vite pada port 5173.",
    downloadUrl: "https://nodejs.org/en/download",
    installHint: "winget install --id OpenJS.NodeJS -e && corepack enable",
  },
  {
    id: "ollama",
    name: "Ollama untuk Windows",
    requirement: "Aplikasi Ollama aktif di 127.0.0.1:11434",
    purpose: "Menjalankan model AI qwen3:4b-instruct secara lokal tanpa biaya API.",
    downloadUrl: "https://ollama.com/download/windows",
    installHint: "winget install --id Ollama.Ollama -e",
  },
];

export const INSTALL_STEPS: InstallStep[] = [
  {
    stepNumber: "Langkah 01",
    title: "Kloning Repositori dari GitHub",
    summary:
      "Buka Windows PowerShell, pilih folder kerja Anda (misalnya Documents), lalu unduh kode sumber Jarvis Local Assistant.",
    commands: [
      {
        label: "Menggunakan GitHub CLI (sesuai permintaan Anda)",
        code: "gh repo clone mschr703/jarvis-local-assistant\nSet-Location jarvis-local-assistant",
      },
      {
        label: "Alternatif jika hanya memakai Git biasa",
        code: "git clone https://github.com/mschr703/jarvis-local-assistant.git\nSet-Location jarvis-local-assistant",
      },
    ],
    note: "Jika gh meminta login pertama kali, jalankan 'gh auth login' dan ikuti petunjuk di layar.",
  },
  {
    stepNumber: "Langkah 02",
    title: "Jalankan Skrip Instalasi Otomatis (setup.ps1)",
    summary:
      "Skrip ini otomatis memeriksa versi Python/Node/pnpm/Ollama, membuat file .env, menginstal semua pustaka backend & frontend, dan mengunduh model AI lokal.",
    commands: [
      {
        label: "Instalasi standar (model chat qwen3:4b-instruct)",
        code: ".\\scripts\\setup.ps1",
      },
      {
        label: "Instalasi lengkap (+ model pencarian semantik embeddinggemma:300m)",
        code: ".\\scripts\\setup.ps1 -IncludeSearchModel",
      },
    ],
    note: "Jika muncul error kebijakan eksekusi PowerShell, jalankan dulu: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass",
  },
  {
    stepNumber: "Langkah 03",
    title: "Alternatif Instalasi Manual (Jika Diperlukan)",
    summary:
      "Jika Anda ingin menjalankan langkah instalasi satu per satu tanpa skrip otomatis, gunakan rangkaian perintah berikut.",
    commands: [
      {
        label: "Salin konfigurasi & instal dependensi secara manual",
        code: "Copy-Item .env.example .env\npython -m uv sync --project backend --frozen\npnpm --dir frontend install --frozen-lockfile\nollama pull qwen3:4b-instruct",
      },
    ],
  },
  {
    stepNumber: "Langkah 04",
    title: "Periksa Kesiapan Sistem dengan doctor.py",
    summary:
      "Pastikan aplikasi Ollama sedang berjalan di tray Windows, lalu jalankan skrip diagnosis bawaan untuk memverifikasi tidak ada komponen yang terlewat.",
    commands: [
      {
        label: "Jalankan pemeriksaan kesiapan (hanya-baca, aman)",
        code: "python scripts/doctor.py",
      },
    ],
    note: "Jika seluruh komponen utama sudah valid, perintah ini selesai dengan kode keluar 0 dan siap dijalankan.",
  },
  {
    stepNumber: "Langkah 05",
    title: "Jalankan dan Hentikan Jarvis di Komputer Lokal",
    summary:
      "Perintah dev.py menyalakan backend API (127.0.0.1:8765) dan antarmuka web (127.0.0.1:5173) secara bersamaan.",
    commands: [
      {
        label: "Menyalakan Jarvis Lokal",
        code: "python scripts/dev.py",
      },
      {
        label: "Menghentikan proses Jarvis yang masih berjalan di latar belakang",
        code: ".\\scripts\\stop.ps1",
      },
    ],
    note: "Setelah berjalan, buka browser dan kunjungi http://127.0.0.1:5173. Untuk berhenti normal, tekan Ctrl+C di terminal.",
  },
  {
    stepNumber: "Langkah 06",
    title: "Fitur Opsional: OCR PDF Scan & Asisten Suara",
    summary:
      "Tambahkan kemampuan membaca PDF hasil scan (Tesseract 5) atau transkripsi suara lokal (Whisper/LiveKit) hanya jika Anda membutuhkannya.",
    commands: [
      {
        label: "Pasang Tesseract 5 OCR & bahasa pengenal teks",
        code: "winget install --id tesseract-ocr.tesseract -e\n.\\scripts\\setup_ocr_languages.ps1\ntesseract --list-langs",
      },
      {
        label: "Pasang modul suara lokal (Whisper + LiveKit)",
        code: "python -m uv sync --project integrations/livekit --python 3.13",
      },
    ],
  },
];

export const ENV_FIELD_DOCS: EnvFieldDoc[] = [
  {
    key: "JARVIS_TIMEZONE",
    defaultValue: "Asia/Jakarta",
    description: "Zona waktu untuk pengingat dan rencana harian (WIB: Asia/Jakarta, WITA: Asia/Makassar, WIT: Asia/Jayapura).",
  },
  {
    key: "JARVIS_PROVIDER",
    defaultValue: "ollama",
    description: "Pilih 'ollama' untuk 100% lokal & gratis, atau 'openrouter' jika ingin memakai API cloud berbayar.",
  },
  {
    key: "JARVIS_OLLAMA_URL",
    defaultValue: "http://127.0.0.1:11434",
    description: "Alamat layanan Ollama lokal di Windows Anda.",
  },
  {
    key: "JARVIS_OLLAMA_MODEL",
    defaultValue: "qwen3:4b-instruct",
    description: "Model LLM utama untuk chat, ringkasan, dan pembuatan draf.",
  },
  {
    key: "JARVIS_HOTKEY",
    defaultValue: "CTRL+ALT+J",
    description: "Pintasan keyboard cepat di Windows untuk memanggil tangkap cepat (Quick Capture).",
  },
  {
    key: "JARVIS_PERSONAL_STYLE_LABEL",
    defaultValue: "Gaya Saya",
    description: "Nama tampilan profil gaya penulisan pribadi Anda di menu Draf.",
  },
];

export const TROUBLESHOOT_ITEMS: TroubleshootItem[] = [
  {
    problem: "Skrip setup.ps1 ditolak karena kebijakan eksekusi PowerShell (ExecutionPolicy)",
    cause: "Windows PowerShell secara bawaan membatasi skrip .ps1 yang diunduh dari internet atau repositori lokal.",
    solution: "Izinkan eksekusi skrip hanya untuk jendela PowerShell yang sedang terbuka, lalu jalankan ulang setup.ps1.",
    command: "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\n.\\scripts\\setup.ps1",
  },
  {
    problem: "Perintah 'ollama' tidak dikenali setelah instalasi",
    cause: "Variabel lingkungan PATH pada terminal lama belum diperbarui setelah menginstal Ollama.",
    solution: "Tutup lalu buka ulang PowerShell, atau panggil file ollama.exe memakai jalur lengkapnya.",
    command: '& "$env:LOCALAPPDATA\\Programs\\Ollama\\ollama.exe" pull qwen3:4b-instruct',
  },
  {
    problem: "Error 'No module named uv' saat menjalankan python -m uv",
    cause: "Anda memasang uv menggunakan installer mandiri (standalone), bukan melalui pip Python.",
    solution: "Ganti 'python -m uv' dengan perintah 'uv' langsung pada semua langkah instalasi.",
    command: "uv sync --project backend --frozen",
  },
  {
    problem: "Port 8765 atau 5173 sudah dipakai saat menyalakan dev.py",
    cause: "Sesi Jarvis sebelumnya belum tertutup sempurna di latar belakang.",
    solution: "Jalankan skrip stop.ps1 yang aman memverifikasi dan menghentikan proses Jarvis lama.",
    command: ".\\scripts\\stop.ps1",
  },
];
