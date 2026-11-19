import type {
  AppSettings,
  ChatConversation,
  ChatSkill,
  DraftItem,
  LocalDocument,
  SavedMemory,
  TaskItem,
  WritingSample,
} from "../types/jarvis";

export const DEFAULT_SETTINGS: AppSettings = {
  userName: "Pengguna",
  timezone: "Asia/Jakarta",
  personalStyleLabel: "Gaya Saya",
  focusMode: false,
  theme: "light",
  connectionMode: "online",
  autoSpeakOffline: true,
  ttsVoiceName: "",
  ttsRate: 1.0,
  activeNeuroDomainIds: [
    "orkestrasi-agen",
    "rekayasa-kode",
    "keamanan-privasi",
    "neuro-infrastruktur",
    "otomasi-windows-data",
    "persona-kreatif",
    "riset-berita-publik",
    "otomasi-telegram",
  ],
};

export const CHAT_SKILLS: ChatSkill[] = [
  {
    id: "umum",
    name: "Asisten Pribadi Umum",
    description: "Jawaban lugas, terstruktur dengan penomoran rapi, dan siap membantu tugas harian.",
    prompt: "Berikan jawaban praktis, ringkas, dan terstruktur dengan penomoran yang jelas.",
  },
  {
    id: "ringkas",
    name: "Ringkas & Inti Sari",
    description: "Merangkum catatan panjang menjadi poin tindakan utama.",
    prompt:
      "Fokus merangkum inti pembicaraan dalam maksimal 5 poin bernomor beserta langkah tindak lanjut.",
  },
  {
    id: "dokumen",
    name: "Analisis Berbasis Dokumen",
    description: "Mengutamakan ketepatan fakta dari dokumen dan memori terlampir.",
    prompt:
      "Jawab hanya berdasarkan dokumen dan memori yang dilampirkan. Sebutkan judul dokumen sumber di akhir setiap poin penting.",
  },
  {
    id: "coding",
    name: "Pendamping Kode & Windows",
    description: "Membantu skrip PowerShell, Python, Node.js, dan pemecahan masalah teknis.",
    prompt:
      "Berikan penjelasan teknis yang tepat beserta contoh perintah PowerShell atau potongan kode yang aman dijalankan.",
  },
];

export const INITIAL_DOCUMENTS: LocalDocument[] = [
  {
    id: "doc-1",
    title: "Ringkasan Arsitektur Jarvis Local.md",
    kind: "md",
    folder: "C:\\Users\\Dokumen\\Jarvis",
    content: `Jarvis Local Assistant (mschr703/jarvis-local-assistant) adalah asisten pribadi berbasis Windows 11 yang berjalan secara lokal.
Komponen utama:
1. Backend API: Python 3.13 + FastAPI pada port 127.0.0.1:8765 dengan database SQLite di %LOCALAPPDATA%\\JarvisLocal.
2. Antarmuka Web: React + Vite pada port 127.0.0.1:5173.
3. Model AI Lokal: Ollama dengan model qwen3:4b-instruct (~3 GB ruang penyimpanan).
4. Pencarian Semantik Opsional: model embeddinggemma:300m untuk pencarian berbasis makna di seluruh dokumen, memori, dan kronik.
5. OCR & Suara Opsional: Tesseract 5 untuk PDF hasil scan serta integrasi LiveKit + Whisper untuk input suara lokal.`,
    hash: "a94f2c8e",
    updatedAt: "2026-11-18 09:15",
  },
  {
    id: "doc-2",
    title: "Catatan Rapat Peluncuran Produk.txt",
    kind: "txt",
    folder: "C:\\Users\\Dokumen\\Proyek",
    content: `Tanggal Rapat: 18 November 2026
Peserta: Tim Produk, Tim Engineering, dan Operasional.
Keputusan:
1. Fokus utama kuartal ini adalah menyederhanakan proses instalasi untuk pengguna Windows di Indonesia.
2. Panduan instalasi harus menjelaskan langkah kloning via GitHub CLI (gh repo clone), instalasi dependensi dengan setup.ps1, dan pengaturan zona waktu Asia/Jakarta.
3. Target rilis dokumentasi Bahasa Indonesia: minggu ini.
4. Anggaran uji coba server lokal: Rp 0 (berjalan penuh di komputer pengguna via Ollama).`,
    hash: "7d31b04a",
    updatedAt: "2026-11-18 10:40",
  },
];

export const INITIAL_MEMORIES: SavedMemory[] = [
  {
    id: "mem-1",
    title: "Preferensi Bahasa & Format",
    content:
      "Selalu gunakan Bahasa Indonesia yang sopan namun tidak kaku, dengan format tanggal DD MMMM YYYY dan zona waktu WIB (Asia/Jakarta).",
    source: "Preferensi Pribadi",
    updatedAt: "2026-11-18 08:30",
  },
  {
    id: "mem-2",
    title: "Lokasi Data Jarvis di Windows",
    content:
      "Pada versi desktop Windows asli, seluruh data privat, database SQLite, dan profil browser Edge disimpan di %LOCALAPPDATA%\\JarvisLocal di luar folder repositori.",
    source: "Dokumentasi Resmi Repositori",
    updatedAt: "2026-11-18 09:20",
  },
  {
    id: "mem-3",
    title: "Model Default Ollama",
    content:
      "Model percakapan default adalah qwen3:4b-instruct dan model pencarian makna opsional adalah embeddinggemma:300m.",
    source: "scripts/setup.ps1",
    updatedAt: "2026-11-18 09:25",
  },
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    title: "Pengenalan Jarvis Edisi Bahasa Indonesia",
    skillId: "umum",
    updatedAt: "2026-11-18 11:00",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: `1. Selamat datang di Jarvis Asisten Lokal edisi Bahasa Indonesia yang diadaptasi dari mschr703/jarvis-local-assistant.
2. Berikut kemampuan yang langsung dapat Anda gunakan:
   2.1 Chat dengan penomoran profesional (bebas tanda pagar dan bintang) beserta Perintah Suara Google Indonesia saat mode online.
   2.2 Mode Offline Penuh dengan Mesin Neuro-Orkestrator Lokal dan Voice TTS Offline berbahasa Indonesia.
   2.3 Modul 41 repositori Neuro-Orkestrator yang dipisahkan menjadi 8 bidang keahlian untuk merancang rencana dan perintah tugas.
   2.4 Pengelolaan Dokumen, Memori, Draf Tulisan, Tugas Harian, dan Panduan Instalasi Windows lengkap.`,
        createdAt: "11:00",
      },
    ],
  },
];

export const INITIAL_STYLE_PROFILE =
  "Gunakan Bahasa Indonesia yang jelas, hangat, profesional, dan langsung pada inti persoalan. Hindari kalimat pembuka yang bertele-tele.";

export const INITIAL_WRITING_SAMPLES: WritingSample[] = [
  {
    id: "sample-1",
    name: "Catatan Tim Ringkas",
    text: "Halo tim, berikut ringkasan tindak lanjut rapat hari ini. Mohon cek bagian prioritas sebelum pukul 17.00 WIB agar jadwal rilis tetap sesuai target.",
  },
];

export const INITIAL_DRAFTS: DraftItem[] = [
  {
    id: "draft-1",
    kind: "email",
    title: "Subjek: Pembaruan Dokumentasi Instalasi Bahasa Indonesia",
    brief: "Kirim ringkasan kesiapan panduan instalasi Jarvis Local untuk tim.",
    content: `Subjek: Pembaruan Dokumentasi Instalasi Jarvis Local (Bahasa Indonesia)

Halo Tim,

Panduan instalasi Bahasa Indonesia untuk repositori mschr703/jarvis-local-assistant telah selesai disusun. Dokumen ini mencakup langkah kloning melalui GitHub CLI, konfigurasi skrip setup.ps1 di Windows 11, penyesuaian zona waktu Asia/Jakarta, serta verifikasi kesehatan sistem melalui doctor.py.

Silakan tinjau bagian prasyarat dan uji coba langsung pada perangkat lokal masing-masing.

Salam,
Tim Operasional`,
    sources: ["Catatan Rapat Peluncuran Produk.txt"],
    updatedAt: "2026-11-18 10:50",
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Kloning repositori mschr703/jarvis-local-assistant di Windows",
    priority: "tinggi",
    dueDate: "Hari ini",
    completed: false,
    reminderActive: true,
  },
  {
    id: "task-2",
    title: "Jalankan setup.ps1 dan unduh model qwen3:4b-instruct di Ollama",
    priority: "tinggi",
    dueDate: "Hari ini",
    completed: false,
    reminderActive: true,
  },
  {
    id: "task-3",
    title: "Sesuaikan JARVIS_TIMEZONE=Asia/Jakarta pada file .env",
    priority: "sedang",
    dueDate: "Besok",
    completed: false,
    reminderActive: false,
  },
  {
    id: "task-4",
    title: "Uji coba fitur OCR Tesseract (opsional untuk PDF scan)",
    priority: "rendah",
    dueDate: "Akhir pekan",
    completed: false,
    reminderActive: true,
  },
];
