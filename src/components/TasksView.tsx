import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Circle,
  Plus,
  Square,
  Trash2,
  Volume2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ConnectionMode, TaskItem, TaskPriority } from "../types/jarvis";
import { runOfflineDailyPlan } from "../utils/offlineOrchestrator";
import { formatProfessionalNumberedText } from "../utils/textFormatter";
import { speakIndonesianText, stopSpeaking } from "../utils/voiceEngine";

interface TasksViewProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, "id" | "completed">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  connectionMode: ConnectionMode;
  ttsVoiceName: string;
  ttsRate: number;
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  tinggi: "Tinggi",
  sedang: "Sedang",
  rendah: "Rendah",
};

export default function TasksView({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  focusMode,
  onToggleFocusMode,
  connectionMode,
  ttsVoiceName,
  ttsRate,
}: TasksViewProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("sedang");
  const [dueDate, setDueDate] = useState("Hari ini");
  const [reminderActive, setReminderActive] = useState(true);

  const [focusMinutes, setFocusMinutes] = useState("90");
  const [planNote, setPlanNote] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const visibleTasks = useMemo(() => {
    if (!focusMode) return tasks;
    return tasks.filter((t) => t.completed || t.priority !== "rendah");
  }, [tasks, focusMode]);

  const deferredCount = useMemo(
    () => tasks.filter((t) => !t.completed && t.priority === "rendah").length,
    [tasks]
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      priority,
      dueDate: dueDate.trim() || "Fleksibel",
      reminderActive,
    });
    setTitle("");
  };

  const handleGeneratePlan = async () => {
    if (tasks.length === 0 || isPlanning) return;
    setPlanError(null);
    setVoiceNotice(null);

    if (connectionMode === "offline") {
      const localPlan = runOfflineDailyPlan({
        tasks,
        focusMinutes: Number(focusMinutes) || 90,
        note: planNote.trim(),
      });
      setGeneratedPlan(localPlan);
      return;
    }

    setIsPlanning(true);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          focusMinutes: Number(focusMinutes) || 90,
          note: planNote.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menyusun rencana.");
      }
      setGeneratedPlan(formatProfessionalNumberedText(data.planText));
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsPlanning(false);
    }
  };

  const handleSpeakPlan = () => {
    if (!generatedPlan) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setVoiceNotice(null);
    speakIndonesianText(generatedPlan, {
      preferredVoiceName: ttsVoiceName,
      rate: ttsRate,
      preferLocalOnly: connectionMode === "offline",
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onFallbackNotice: (msg) => setVoiceNotice(msg),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] gap-6 items-start">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Daftar Tugas &amp; Pengingat
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {focusMode && deferredCount > 0
                ? `Mode Fokus aktif: ${deferredCount} tugas prioritas rendah ditunda sementara.`
                : "Kelola tugas prioritas dan pengingat kerja harian Anda."}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              focusMode
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {focusMode ? "Nonaktifkan Mode Fokus" : "Aktifkan Mode Fokus"}
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-[1fr_115px_120px_auto] gap-2.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tambah tugas baru..."
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            aria-label="Prioritas"
            className="px-2.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          >
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Tenggat"
            aria-label="Tenggat"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah</span>
          </button>
          <label className="sm:col-span-4 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={reminderActive}
              onChange={(e) => setReminderActive(e.target.checked)}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Sertakan pengingat aktif untuk tugas ini</span>
          </label>
        </form>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Belum ada tugas yang ditampilkan.
            </p>
          ) : (
            visibleTasks.map((task) => (
              <div key={task.id} className="py-3 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-start gap-3 text-left min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  {task.completed ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-medium ${
                        task.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span
                        className={
                          task.priority === "tinggi"
                            ? "font-medium text-amber-700 dark:text-amber-400"
                            : ""
                        }
                      >
                        Prioritas {PRIORITY_LABEL[task.priority]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Tenggat: {task.dueDate}</span>
                      {task.reminderActive && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Bell className="w-3 h-3" aria-hidden="true" />
                            <span>Pengingat aktif</span>
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label={`Hapus ${task.title}`}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded shrink-0"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Rencana Harian Otomatis
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {connectionMode === "offline" ? "Mode Offline" : "Mode Online"}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Menyusun blok waktu kerja secara rapi berdasarkan prioritas tugas Anda, baik
          di Mode Online maupun Mode Offline Penuh.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Blok Fokus (Menit)
            </span>
            <input
              type="number"
              min={30}
              max={480}
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 tabular-nums"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Catatan Kondisi Hari Ini
            </span>
            <input
              type="text"
              value={planNote}
              onChange={(e) => setPlanNote(e.target.value)}
              placeholder="Misal: Ada rapat pukul 14.00 WIB"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isPlanning || tasks.length === 0}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap"
          >
            {isPlanning
              ? "Menyusun Rencana Harian..."
              : connectionMode === "offline"
                ? "Susun Rencana Lokal (Offline)"
                : "Susun Rencana Harian"}
          </button>

          {generatedPlan && (
            <button
              type="button"
              onClick={handleSpeakPlan}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Hentikan</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Bacakan TTS</span>
                </>
              )}
            </button>
          )}
        </div>

        {voiceNotice && (
          <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
            {voiceNotice}
          </p>
        )}

        {planError && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {planError}
          </p>
        )}

        {generatedPlan ? (
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {generatedPlan}
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
            Klik tombol di atas agar SISTER mengatur prioritas tugas Anda ke dalam blok waktu kerja.
          </div>
        )}
      </section>
    </div>
  );
}
