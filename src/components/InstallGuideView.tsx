import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ENV_FIELD_DOCS,
  INSTALL_STEPS,
  PREREQUISITES,
  TROUBLESHOOT_ITEMS,
} from "../data/installGuideData";

const CHECKLIST_STORAGE_KEY = "jarvis_id_install_checklist";

export default function InstallGuideView() {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openTroubleshootIdx, setOpenTroubleshootIdx] = useState<number | null>(0);

  const [envTimezone, setEnvTimezone] = useState("Asia/Jakarta");
  const [envProvider, setEnvProvider] = useState<"ollama" | "openrouter">("ollama");
  const [envOllamaModel, setEnvOllamaModel] = useState("qwen3:4b-instruct");
  const [envHotkey, setEnvHotkey] = useState("CTRL+ALT+J");
  const [envStyleLabel, setEnvStyleLabel] = useState("Gaya Saya");

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Abaikan jika storage penuh
    }
  }, [checkedIds]);

  const togglePrereq = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      // Fallback jika clipboard diblokir
    }
  };

  const generatedEnvText = `# Konfigurasi Lokal Jarvis Local Assistant (Bahasa Indonesia)
# Simpan file ini sebagai .env di folder utama jarvis-local-assistant

JARVIS_TIMEZONE=${envTimezone}
JARVIS_PROVIDER=${envProvider}
JARVIS_PERSONAL_STYLE_LABEL=${envStyleLabel}
JARVIS_OLLAMA_URL=http://127.0.0.1:11434
JARVIS_OLLAMA_MODEL=${envOllamaModel}
JARVIS_HOTKEY=${envHotkey}
JARVIS_DAILY_BUDGET_USD=1.00
JARVIS_MAX_OUTPUT_TOKENS=1024
JARVIS_MAX_CONTEXT_CHARS=24000
JARVIS_OLLAMA_CONTEXT_TOKENS=8192
JARVIS_MAX_STEPS=8`;

  const handleDownloadEnv = () => {
    const blob = new Blob([generatedEnvText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdownGuide = () => {
    const sections = [
      "# Panduan Instalasi Jarvis Local Assistant (Bahasa Indonesia)",
      "",
      "Repositori: https://github.com/mschr703/jarvis-local-assistant",
      "",
      "## 1. Prasyarat",
      ...PREREQUISITES.map(
        (p) => `- **${p.name}**: ${p.requirement} (${p.downloadUrl})`
      ),
      "",
      "## 2. Langkah Instalasi",
      ...INSTALL_STEPS.flatMap((step) => [
        `### ${step.stepNumber}: ${step.title}`,
        step.summary,
        "",
        ...step.commands.flatMap((c) => [`**${c.label}**`, "```powershell", c.code, "```", ""]),
        ...(step.note ? [`> Catatan: ${step.note}`, ""] : []),
      ]),
      "## 3. Contoh File .env",
      "```env",
      generatedEnvText,
      "```",
      "",
      "## 4. Pemecahan Masalah Umum",
      ...TROUBLESHOOT_ITEMS.flatMap((t) => [
        `### ${t.problem}`,
        `- Penyebab: ${t.cause}`,
        `- Solusi: ${t.solution}`,
        ...(t.command ? ["```powershell", t.command, "```"] : []),
        "",
      ]),
    ].join("\n");

    const blob = new Blob([sections], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PANDUAN_INSTALASI_JARVIS_ID.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Panduan Instalasi Lokal Jarvis (mschr703/jarvis-local-assistant)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ikuti panduan langkah demi langkah berbahasa Indonesia ini untuk mengunduh dan
              menjalankan Jarvis secara penuh di Windows 11 menggunakan model lokal Ollama tanpa biaya API.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadMarkdownGuide}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Unduh Panduan (.md)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <span>
            Progres Prasyarat:{" "}
            <strong className="text-slate-900 dark:text-slate-100 tabular-nums">
              {checkedIds.length} / {PREREQUISITES.length} siap
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Port Lokal: Frontend 5173 · API 8765 · Ollama 11434</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">Data: %LOCALAPPDATA%\JarvisLocal</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            1. Daftar Periksa Prasyarat Windows
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Centang setiap komponen di bawah ini setelah terpasang di komputer Windows Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PREREQUISITES.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePrereq(item.id)}
                      className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.requirement}
                      </span>
                    </span>
                  </label>

                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>Unduh</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.purpose}
                </p>

                {item.installHint && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono">
                    <code className="truncate">{item.installHint}</code>
                    <button
                      type="button"
                      onClick={() => handleCopy(`prereq-${item.id}`, item.installHint!)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white shrink-0"
                    >
                      {copiedId === `prereq-${item.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            2. Langkah Instalasi &amp; Menjalankan Aplikasi
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Salin dan jalankan perintah PowerShell berikut secara berurutan.
          </p>
        </div>

        <div className="space-y-4">
          {INSTALL_STEPS.map((step, stepIdx) => (
            <article
              key={step.stepNumber}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {step.stepNumber}
                </p>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.summary}
                </p>
              </div>

              <div className="space-y-3">
                {step.commands.map((cmd, cmdIdx) => {
                  const cmdKey = `step-${stepIdx}-cmd-${cmdIdx}`;
                  const isCopied = copiedId === cmdKey;
                  return (
                    <div key={cmdKey} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>{cmd.label}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(cmdKey, cmd.code)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Salin Perintah</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{cmd.code}</code>
                      </pre>
                    </div>
                  );
                })}
              </div>

              {step.note && (
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <strong>Catatan:</strong> {step.note}
                </p>
              )}
            </article>
          ))}

          <article className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Langkah 07 · Suara Offline &amp; Modul Neuro
              </p>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Aktifkan Voice TTS Offline Bahasa Indonesia di Windows 11
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Agar suara pembacaan jawaban TTS bekerja penuh tanpa koneksi internet di Windows 11,
                pasang paket suara Bahasa Indonesia pada sistem Windows Anda:
              </p>
            </div>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>Buka Settings di Windows 11 lalu pilih menu Time &amp; language.</li>
              <li>Pilih Speech lalu klik Add voices di bagian Manage voices.</li>
              <li>Cari Indonesian (Indonesia) kemudian klik Add dan tunggu hingga selesai terpasang.</li>
              <li>Setelah terpasang, Jarvis Mode Offline Penuh otomatis memakai suara lokal tersebut.</li>
              <li>Untuk kloning modul tambahan per bidang keahlian (41 repositori), buka menu Neuro-Orkestrator dan klik Salin Clone Bidang.</li>
            </ol>
          </article>
        </div>
      </section>

      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              3. Generator Konfigurasi <code className="font-mono text-base">.env</code> Indonesia
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Sesuaikan zona waktu dan preferensi lokal Anda, lalu salin atau unduh sebagai file{" "}
              <code className="font-mono">.env</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy("env-generated", generatedEnvText)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              {copiedId === "env-generated" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Salin .env</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadEnv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Unduh .env</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Zona Waktu (JARVIS_TIMEZONE)
              </span>
              <select
                value={envTimezone}
                onChange={(e) => setEnvTimezone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Penyedia AI (JARVIS_PROVIDER)
              </span>
              <select
                value={envProvider}
                onChange={(e) => setEnvProvider(e.target.value as "ollama" | "openrouter")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="ollama">ollama (Lokal &amp; Gratis)</option>
                <option value="openrouter">openrouter (Cloud Opsional)</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Model Ollama
              </span>
              <input
                type="text"
                value={envOllamaModel}
                onChange={(e) => setEnvOllamaModel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Pintasan Keyboard Windows
              </span>
              <input
                type="text"
                value={envHotkey}
                onChange={(e) => setEnvHotkey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono"
              />
            </label>

            <label className="block space-y-1 sm:col-span-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Label Profil Gaya Pribadi
              </span>
              <input
                type="text"
                value={envStyleLabel}
                onChange={(e) => setEnvStyleLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{generatedEnvText}</code>
          </pre>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4 font-semibold">Variabel</th>
                <th className="py-2 pr-4 font-semibold">Nilai Bawaan</th>
                <th className="py-2 font-semibold">Penjelasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ENV_FIELD_DOCS.map((row) => (
                <tr key={row.key}>
                  <td className="py-2.5 pr-4 font-mono text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {row.key}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {row.defaultValue}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          4. Pemecahan Masalah Umum (Troubleshooting)
        </h2>

        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl divide-y divide-slate-200 dark:divide-slate-800">
          {TROUBLESHOOT_ITEMS.map((item, idx) => {
            const isOpen = openTroubleshootIdx === idx;
            return (
              <div key={item.problem} className="p-4">
                <button
                  type="button"
                  onClick={() => setOpenTroubleshootIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  <span>{item.problem}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">Penyebab:</strong>{" "}
                      {item.cause}
                    </p>
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">Solusi:</strong>{" "}
                      {item.solution}
                    </p>
                    {item.command && (
                      <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-950 text-slate-100 font-mono">
                        <code className="whitespace-pre-wrap">{item.command}</code>
                        <button
                          type="button"
                          onClick={() => handleCopy(`ts-${idx}`, item.command!)}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white shrink-0"
                        >
                          {copiedId === `ts-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
