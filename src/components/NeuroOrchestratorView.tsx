import {
  Check,
  Copy,
  Cpu,
  Mic,
  MicOff,
  Play,
  Search,
  Square,
  Volume2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { NEURO_DOMAINS, TOTAL_NEURO_REPOS } from "../data/neuroReposData";
import type { ConnectionMode, TaskItem } from "../types/jarvis";
import { runOfflineOrchestration } from "../utils/offlineOrchestrator";
import { formatProfessionalNumberedText } from "../utils/textFormatter";
import {
  isGoogleSpeechRecognitionSupported,
  speakIndonesianText,
  startGoogleIndonesianVoiceCommand,
  stopSpeaking,
} from "../utils/voiceEngine";

interface NeuroOrchestratorViewProps {
  connectionMode: ConnectionMode;
  onChangeConnectionMode: (mode: ConnectionMode) => void;
  activeDomainIds: string[];
  onToggleDomain: (domainId: string) => void;
  onEnableAllDomains: () => void;
  tasks: TaskItem[];
  ttsVoiceName: string;
  ttsRate: number;
}

export default function NeuroOrchestratorView({
  connectionMode,
  onChangeConnectionMode,
  activeDomainIds,
  onToggleDomain,
  onEnableAllDomains,
  tasks,
  ttsVoiceName,
  ttsRate,
}: NeuroOrchestratorViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [orchestrationOutput, setOrchestrationOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const stopRecRef = useRef<(() => void) | null>(null);

  const filteredDomains = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return NEURO_DOMAINS.filter((domain) => {
      if (selectedFilter !== "semua" && domain.id !== selectedFilter) return false;
      if (!q) return true;
      return (
        domain.name.toLowerCase().includes(q) ||
        domain.description.toLowerCase().includes(q) ||
        domain.repos.some(
          (r) =>
            r.repo.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.roleInJarvis.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedFilter, searchTerm]);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 2000);
    } catch {
      // Abaikan jika clipboard ditolak
    }
  };

  const handleVoiceCommand = () => {
    if (connectionMode === "offline") {
      setVoiceNotice(
        "Perintah Suara Google ID memerlukan Mode Online. Beralih ke Mode Online atau ketik tujuan Anda secara langsung."
      );
      return;
    }

    if (isListening) {
      stopRecRef.current?.();
      setIsListening(false);
      return;
    }

    if (!isGoogleSpeechRecognitionSupported()) {
      setVoiceNotice(
        "Browser belum mendukung Google Speech Recognition. Gunakan Chrome atau Edge saat mode online."
      );
      return;
    }

    setVoiceNotice(null);
    setIsListening(true);
    stopRecRef.current = startGoogleIndonesianVoiceCommand({
      onInterim: (interim) => setGoalInput(interim),
      onFinal: (finalText) => setGoalInput(finalText),
      onError: (msg) => setVoiceNotice(msg),
      onEnd: () => setIsListening(false),
    });
  };

  const handleOrchestrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() || isRunning) return;

    setErrorMsg(null);
    setVoiceNotice(null);
    setIsRunning(true);

    const enabledDomains = NEURO_DOMAINS.filter((d) => activeDomainIds.includes(d.id));
    const targetDomains = enabledDomains.length > 0 ? enabledDomains : NEURO_DOMAINS;

    if (connectionMode === "offline") {
      const localPlan = runOfflineOrchestration({
        goal: goalInput.trim(),
        selectedDomainIds: targetDomains.map((d) => d.id),
        tasks,
      });
      setOrchestrationOutput(localPlan);
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch("/api/neuro-orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goalInput.trim(),
          domains: targetDomains.map((d) => ({
            name: d.name,
            orchestrationFocus: d.orchestrationFocus,
            repos: d.repos.map((r) => ({ repo: r.repo, roleInJarvis: r.roleInJarvis })),
          })),
          tasks,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengorkestrasi rencana.");
      }
      setOrchestrationOutput(formatProfessionalNumberedText(data.result));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menjalankan orkestrasi.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSpeakResult = () => {
    if (!orchestrationOutput) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setVoiceNotice(null);
    speakIndonesianText(orchestrationOutput, {
      preferredVoiceName: ttsVoiceName,
      rate: ttsRate,
      preferLocalOnly: connectionMode === "offline",
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onFallbackNotice: (msg) => setVoiceNotice(msg),
    });
  };

  const handleCopyDomainClones = (domainId: string) => {
    const domain = NEURO_DOMAINS.find((d) => d.id === domainId);
    if (!domain) return;
    const cmds = domain.repos.map((r) => `gh repo clone ${r.repo}`).join("\n");
    handleCopy(`clone-domain-${domainId}`, cmds);
  };

  return (
    <div className="space-y-6">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Orkestrator Neuro &amp; Katalog Keahlian ({TOTAL_NEURO_REPOS} Repositori)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Seluruh repositori dipisahkan ke dalam {NEURO_DOMAINS.length} bidang keahlian agar SISTER dapat
              berpikir lebih terarah saat menyusun rencana tugas, memilih alat, dan menyiapkan perintah eksekusi.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => onChangeConnectionMode("online")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                connectionMode === "online"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Mode Online
            </button>
            <button
              type="button"
              onClick={() => onChangeConnectionMode("offline")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                connectionMode === "offline"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Mode Offline Penuh
            </button>
          </div>
        </div>

        <form onSubmit={handleOrchestrate} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tujuan Tugas atau Rencana yang Ingin Diorkestrasi
            </span>
            <textarea
              rows={2}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Contoh: Susun rencana audit keamanan aplikasi web, periksa CVE dependensi, lalu siapkan slide presentasi laporan dan otomasi notifikasi Telegram."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceCommand}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  isListening
                    ? "border-red-600 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Perintah Suara Google ID</span>
                  </>
                )}
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {activeDomainIds.length} / {NEURO_DOMAINS.length} bidang aktif
              </span>
            </div>

            <button
              type="submit"
              disabled={isRunning || !goalInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {isRunning
                  ? "Mengorkestrasi..."
                  : connectionMode === "offline"
                    ? "Orkestrasi Lokal (Offline)"
                    : "Orkestrasi Rencana & Perintah"}
              </span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errorMsg}
          </p>
        )}

        {voiceNotice && (
          <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
            {voiceNotice}
          </p>
        )}

        {orchestrationOutput && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Hasil Orkestrasi ({connectionMode === "offline" ? "Mode Offline Penuh" : "Mode Online"})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakResult}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Bacakan TTS Indonesia</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy("orchestration-out", orchestrationOutput)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  {copiedKey === "orchestration-out" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Salin Rencana</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {orchestrationOutput}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari bidang, nama repo, atau kemampuan (misal: CVE, Windows, MCP, MQTT)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter bidang keahlian"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="semua">Semua Bidang ({NEURO_DOMAINS.length})</option>
              {NEURO_DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.number}. {d.shortName} ({d.repos.length})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onEnableAllDomains}
              className="px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              Aktifkan Semua Bidang
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDomains.map((domain) => {
            const isActive = activeDomainIds.includes(domain.id);
            return (
              <article
                key={domain.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 max-w-3xl">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Bidang {domain.number} · <span className="tabular-nums">{domain.repos.length}</span> Repositori
                    </p>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {domain.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {domain.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyDomainClones(domain.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                    >
                      {copiedKey === `clone-domain-${domain.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Perintah Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Salin Clone Bidang</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleDomain(domain.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {isActive ? "Aktif di Otak SISTER" : "Nonaktif"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-4 font-semibold">No</th>
                        <th className="py-2 pr-4 font-semibold">Repositori</th>
                        <th className="py-2 pr-4 font-semibold">Peran dalam Orkestrasi</th>
                        <th className="py-2 font-semibold text-right">Perintah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {domain.repos.map((repo, rIdx) => {
                        const cloneCmd = `gh repo clone ${repo.repo}`;
                        const copyId = `repo-${repo.repo}`;
                        return (
                          <tr key={repo.repo}>
                            <td className="py-2.5 pr-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                              {domain.number}.{rIdx + 1}
                            </td>
                            <td className="py-2.5 pr-4 whitespace-nowrap">
                              <span className="block font-semibold text-slate-900 dark:text-slate-100">
                                {repo.name}
                              </span>
                              <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                {repo.repo}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">
                              {repo.roleInJarvis}
                            </td>
                            <td className="py-2.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleCopy(copyId, cloneCmd)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                {copiedKey === copyId ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                                    <span>Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" aria-hidden="true" />
                                    <span>Salin clone</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
