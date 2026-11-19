import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  Cpu,
  FileText,
  FolderSearch,
  MessageSquare,
  Wifi,
  WifiOff,
} from "lucide-react";
import { NEURO_DOMAINS, TOTAL_NEURO_REPOS } from "../data/neuroReposData";
import type { ConnectionMode, PageId } from "../types/jarvis";

interface OverviewViewProps {
  userName: string;
  aiConfigured: boolean | null;
  connectionMode: ConnectionMode;
  onChangeConnectionMode: (mode: ConnectionMode) => void;
  activeNeuroCount: number;
  stats: {
    conversations: number;
    documents: number;
    memories: number;
    drafts: number;
    pendingTasks: number;
  };
  onNavigate: (page: PageId) => void;
}

export default function OverviewView({
  userName,
  aiConfigured,
  connectionMode,
  onChangeConnectionMode,
  activeNeuroCount,
  stats,
  onNavigate,
}: OverviewViewProps) {
  const workflows: {
    page: PageId;
    title: string;
    description: string;
    actionLabel: string;
    icon: typeof MessageSquare;
  }[] = [
    {
      page: "neuro",
      title: `Neuro-Orkestrator (${TOTAL_NEURO_REPOS} Repositori · ${NEURO_DOMAINS.length} Bidang)`,
      description:
        "Tingkatkan daya pikir Jarvis untuk mengorkestrasi tugas, rencana, dan perintah lintas bidang seperti Orkestrasi Agen, Rekayasa Kode, Keamanan Siber/CVE, Otomasi Windows/MySQL, hingga Telegram.",
      actionLabel: "Buka Neuro-Orkestrator",
      icon: Cpu,
    },
    {
      page: "chat",
      title: "Chat Bernomor + Voice Google ID & TTS Offline",
      description:
        "Jawaban chat selalu tersusun dengan penomoran profesional tanpa simbol pagar atau bintang. Gunakan Voice Command Google ID saat online dan Voice TTS Bahasa Indonesia saat offline.",
      actionLabel: "Mulai Percakapan",
      icon: MessageSquare,
    },
    {
      page: "install",
      title: "Panduan Instalasi Windows (Bahasa Indonesia)",
      description:
        "Langkah lengkap kloning mschr703/jarvis-local-assistant, menjalankan setup.ps1, mengaktifkan suara TTS Indonesia offline di Windows 11, dan kloning modul Neuro.",
      actionLabel: "Buka Panduan Instalasi",
      icon: BookOpen,
    },
    {
      page: "documents",
      title: "Dokumen Lokal & Memori Tersimpan",
      description:
        "Simpan catatan penting, cari di seluruh indeks teks dan memori dalam satu kolom, lalu kirim langsung ke Chat atau Draf.",
      actionLabel: "Kelola Dokumen",
      icon: FolderSearch,
    },
    {
      page: "drafts",
      title: "Draf Tulisan & Profil Gaya Pribadi",
      description:
        "Susun email, pesan singkat, jawaban berbasis sumber, atau esai dengan gaya bahasa Anda sendiri dan ekspor ke .txt, .md, atau .eml.",
      actionLabel: "Buat Draf Baru",
      icon: FileText,
    },
    {
      page: "tasks",
      title: "Tugas, Mode Fokus & Rencana Harian",
      description:
        "Kelola prioritas tugas harian, aktifkan Mode Fokus untuk menunda pengingat prioritas rendah, dan susun jadwal kerja otomatis secara online maupun offline.",
      actionLabel: "Atur Tugas",
      icon: CheckSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Adaptasi Bahasa Indonesia · Jarvis Local + {TOTAL_NEURO_REPOS} Modul Neuro
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
              Selamat datang, {userName}. Jalankan asisten Anda dalam Mode Online maupun Offline Penuh.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Dilengkapi format jawaban bernomor profesional, Perintah Suara Google Indonesia saat
              online, Voice TTS Bahasa Indonesia saat offline, serta orkestrator {NEURO_DOMAINS.length} bidang keahlian.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeConnectionMode("online")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  connectionMode === "online"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mode Online</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeConnectionMode("offline")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  connectionMode === "offline"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mode Offline Penuh</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate("neuro")}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0"
              >
                Buka Neuro-Orkestrator
              </button>
              <button
                type="button"
                onClick={() => onNavigate("chat")}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                Buka Chat Asisten
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <span>
            Mode Aktif:{" "}
            <strong className="font-semibold text-slate-900 dark:text-slate-100">
              {connectionMode === "offline"
                ? "Offline Penuh (Mesin Lokal + TTS ID)"
                : aiConfigured
                  ? "Online (AI Server + Voice Google ID)"
                  : aiConfigured === null
                    ? "Memeriksa layanan..."
                    : "Online (Kunci API belum diatur)"}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Bidang Neuro Aktif:{" "}
            <strong className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeNeuroCount} / {NEURO_DOMAINS.length}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Format Output: Penomoran Profesional (Tanpa # &amp; *)</span>
        </div>
      </section>

      <section aria-label="Ringkasan ruang kerja">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Percakapan Chat</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.conversations}
            </p>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Dokumen &amp; Memori
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.documents + stats.memories}
            </p>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Modul Neuro Siap
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {TOTAL_NEURO_REPOS}
            </p>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Aktif</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {stats.pendingTasks}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Alur Kerja Utama Jarvis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.page}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <h3 className="text-base font-semibold">{wf.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {wf.description}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onNavigate(wf.page)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  >
                    <span>{wf.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
