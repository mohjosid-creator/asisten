import { RotateCcw, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AppSettings } from "../types/jarvis";
import { getIndonesianSpeechVoices, speakIndonesianText, type VoiceOption } from "../utils/voiceEngine";

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (next: AppSettings) => void;
  onResetAllData: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  settings,
  onSave,
  onResetAllData,
  onClose,
}: SettingsModalProps) {
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => setVoices(getIndonesianSpeechVoices());
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleTestTts = () => {
    setTestNotice(null);
    speakIndonesianText(
      "Halo, ini adalah uji coba suara SISTER berbahasa Indonesia untuk mode offline dan online.",
      {
        preferredVoiceName: draft.ttsVoiceName,
        rate: draft.ttsRate,
        preferLocalOnly: draft.connectionMode === "offline",
        onFallbackNotice: (msg) => setTestNotice(msg),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="settings-modal-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            Pengaturan Ruang Kerja &amp; Suara
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Nama Pengguna
              </span>
              <input
                type="text"
                value={draft.userName}
                onChange={(e) => setDraft({ ...draft, userName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Zona Waktu
              </span>
              <select
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Mode Koneksi &amp; Orkestrasi
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, connectionMode: "online" })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  draft.connectionMode === "online"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Mode Online
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  AI Server + Voice Command Google ID
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDraft({ ...draft, connectionMode: "offline" })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  draft.connectionMode === "offline"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Mode Offline Penuh
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Orkestrator Lokal + Voice TTS Indonesia
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Pengaturan Voice TTS Bahasa Indonesia
              </span>
              <button
                type="button"
                onClick={handleTestTts}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Uji Suara TTS</span>
              </button>
            </div>

            <label className="block space-y-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Suara Sistem Tersedia ({voices.length} terdeteksi)
              </span>
              <select
                value={draft.ttsVoiceName}
                onChange={(e) => setDraft({ ...draft, ttsVoiceName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="">Otomatis (Prioritaskan suara lokal id-ID)</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang}) {v.localService ? "· Offline Lokal" : "· Online"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Kecepatan Bicara:{" "}
                <strong className="tabular-nums">{draft.ttsRate.toFixed(1)}x</strong>
              </span>
              <input
                type="range"
                min={0.7}
                max={1.4}
                step={0.1}
                value={draft.ttsRate}
                onChange={(e) => setDraft({ ...draft, ttsRate: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.autoSpeakOffline}
                onChange={(e) => setDraft({ ...draft, autoSpeakOffline: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Otomatis bacakan jawaban TTS Indonesia saat Mode Offline aktif</span>
            </label>

            {testNotice && (
              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
                {testNotice}
              </p>
            )}
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Nama Profil Gaya Penulisan
            </span>
            <input
              type="text"
              value={draft.personalStyleLabel}
              onChange={(e) => setDraft({ ...draft, personalStyleLabel: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onResetAllData();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pulihkan Data Awal</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
