import { Download, FileText, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { DraftItem, DraftKind, LocalDocument, WritingSample } from "../types/jarvis";

interface DraftsViewProps {
  drafts: DraftItem[];
  onAddDraft: (draft: DraftItem) => void;
  onUpdateDraft: (draft: DraftItem) => void;
  onDeleteDraft: (id: string) => void;
  documents: LocalDocument[];
  attachedDocIds: string[];
  onToggleAttachDoc: (id: string) => void;
  styleProfile: string;
  onSaveStyleProfile: (text: string) => void;
  personalStyleLabel: string;
  samples: WritingSample[];
  onAddSample: (name: string, text: string) => void;
  onDeleteSample: (id: string) => void;
}

const DRAFT_KINDS: { value: DraftKind; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "teks", label: "Teks Singkat" },
  { value: "jawaban", label: "Jawaban Berbasis Sumber" },
  { value: "esai", label: "Esai Terstruktur" },
];

export default function DraftsView({
  drafts,
  onAddDraft,
  onUpdateDraft,
  onDeleteDraft,
  documents,
  attachedDocIds,
  onToggleAttachDoc,
  styleProfile,
  onSaveStyleProfile,
  personalStyleLabel,
  samples,
  onAddSample,
  onDeleteSample,
}: DraftsViewProps) {
  const [kind, setKind] = useState<DraftKind>("email");
  const [brief, setBrief] = useState("");
  const [inputText, setInputText] = useState("");
  const [wordTarget, setWordTarget] = useState("400");
  const [outline, setOutline] = useState("Pendahuluan\nPembahasan Utama\nPenutup");
  const [selectedSampleIds, setSelectedSampleIds] = useState<string[]>([]);
  const [usePersonalStyle, setUsePersonalStyle] = useState(true);

  const [styleText, setStyleText] = useState(styleProfile);
  const [styleSavedNotice, setStyleSavedNotice] = useState(false);

  const [newSampleName, setNewSampleName] = useState("");
  const [newSampleText, setNewSampleText] = useState("");

  const [activeDraftId, setActiveDraftId] = useState<string>(drafts[0]?.id ?? "");
  const activeDraft = useMemo(
    () => drafts.find((d) => d.id === activeDraftId) ?? drafts[0] ?? null,
    [drafts, activeDraftId]
  );

  const [editorText, setEditorText] = useState(activeDraft?.content ?? "");
  const [lastSyncedDraftId, setLastSyncedDraftId] = useState(activeDraft?.id ?? "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState("");

  if (activeDraft && activeDraft.id !== lastSyncedDraftId) {
    setLastSyncedDraftId(activeDraft.id);
    setEditorText(activeDraft.content);
  }

  const attachedDocs = useMemo(
    () => documents.filter((d) => attachedDocIds.includes(d.id)),
    [documents, attachedDocIds]
  );

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const chosenSamples = samples.filter((s) => selectedSampleIds.includes(s.id));
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          brief: brief.trim(),
          inputText: inputText.trim(),
          styleProfile: usePersonalStyle ? styleText.trim() : "",
          samples: chosenSamples.map((s) => ({ name: s.name, text: s.text })),
          attachedDocs: attachedDocs.map((d) => ({ title: d.title, content: d.content })),
          wordTarget,
          outline,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat draf.");
      }

      const firstLine = data.content.split("\n")[0]?.trim() || brief.trim().slice(0, 50);
      const newDraft: DraftItem = {
        id: `draft-${Date.now()}`,
        kind,
        title: firstLine.slice(0, 72),
        brief: brief.trim(),
        content: data.content,
        sources: attachedDocs.map((d) => d.title),
        updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      };

      onAddDraft(newDraft);
      setActiveDraftId(newDraft.id);
      setLastSyncedDraftId(newDraft.id);
      setEditorText(newDraft.content);
      setSaveNotice("Draf baru berhasil dibuat.");
      setTimeout(() => setSaveNotice(""), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal membuat draf.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEditor = () => {
    if (!activeDraft) return;
    const firstLine = editorText.split("\n")[0]?.trim() || activeDraft.title;
    onUpdateDraft({
      ...activeDraft,
      title: firstLine.slice(0, 72),
      content: editorText,
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    });
    setSaveNotice("Perubahan draf disimpan.");
    setTimeout(() => setSaveNotice(""), 2500);
  };

  const handleExport = (ext: "txt" | "md" | "eml") => {
    if (!activeDraft) return;
    const mime =
      ext === "eml"
        ? "message/rfc822;charset=utf-8"
        : ext === "md"
          ? "text/markdown;charset=utf-8"
          : "text/plain;charset=utf-8";
    const blob = new Blob([editorText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `draf-jarvis-${activeDraft.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveStyle = () => {
    onSaveStyleProfile(styleText);
    setStyleSavedNotice(true);
    setTimeout(() => setStyleSavedNotice(false), 2000);
  };

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSampleName.trim() || !newSampleText.trim()) return;
    onAddSample(newSampleName.trim(), newSampleText.trim());
    setNewSampleName("");
    setNewSampleText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] gap-6 items-start">
      <div className="space-y-6">
        <form
          onSubmit={handleGenerateDraft}
          className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Buat Draf Baru
            </h2>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {DRAFT_KINDS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setKind(item.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    kind === item.value
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Instruksi Penulisan (Brief)
            </span>
            <textarea
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Contoh: Tulis email balasan kepada tim bahwa panduan instalasi Bahasa Indonesia sudah siap diuji hari ini."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Pesan / Konteks Masuk (Opsional)
            </span>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tempel email atau pesan yang ingin dibalas..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          {kind === "esai" && (
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Target Kata
                </span>
                <input
                  type="number"
                  min={100}
                  max={2500}
                  value={wordTarget}
                  onChange={(e) => setWordTarget(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 tabular-nums"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Kerangka Esai
                </span>
                <input
                  type="text"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </label>
            </div>
          )}

          <div className="space-y-2">
            <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Dokumen Sumber Terlampir ({attachedDocs.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={attachedDocIds.includes(doc.id)}
                    onChange={() => onToggleAttachDoc(doc.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="truncate">{doc.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={usePersonalStyle}
                onChange={(e) => setUsePersonalStyle(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Gunakan Profil Gaya "{personalStyleLabel}"</span>
            </label>

            <button
              type="submit"
              disabled={isGenerating || !brief.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isGenerating ? "Menyusun Draf..." : "Buat Draf dengan AI"}
            </button>
          </div>

          {errorMsg && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errorMsg}
            </p>
          )}
        </form>

        <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Profil Gaya Penulisan ({personalStyleLabel})
            </h3>
            <button
              type="button"
              onClick={handleSaveStyle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{styleSavedNotice ? "Tersimpan" : "Simpan Gaya"}</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={styleText}
            onChange={(e) => setStyleText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Contoh Tulisan Pribadi ({samples.length})
            </p>

            {samples.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <label className="flex items-start gap-2 min-w-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSampleIds.includes(s.id)}
                    onChange={() =>
                      setSelectedSampleIds((prev) =>
                        prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                      )
                    }
                    className="mt-0.5 rounded border-slate-300 text-blue-600"
                  />
                  <span className="min-w-0">
                    <span className="block font-medium text-slate-900 dark:text-slate-100">
                      {s.name}
                    </span>
                    <span className="block text-slate-600 dark:text-slate-400 mt-0.5">
                      {s.text}
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onDeleteSample(s.id)}
                  aria-label={`Hapus contoh ${s.name}`}
                  className="p-1 text-slate-400 hover:text-red-600 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}

            <form onSubmit={handleCreateSample} className="grid grid-cols-1 gap-2">
              <input
                type="text"
                value={newSampleName}
                onChange={(e) => setNewSampleName(e.target.value)}
                placeholder="Nama contoh (misal: Gaya Email Resmi)"
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSampleText}
                  onChange={(e) => setNewSampleText(e.target.value)}
                  placeholder="Tulis 1–2 kalimat contoh gaya bahasa Anda..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!newSampleName.trim() || !newSampleText.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 dark:bg-slate-700 text-white disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tambah</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Editor &amp; Daftar Draf ({drafts.length})
            </h2>
          </div>

          {saveNotice && (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {saveNotice}
            </span>
          )}
        </div>

        {drafts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {drafts.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveDraftId(d.id);
                  setLastSyncedDraftId(d.id);
                  setEditorText(d.content);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors max-w-[220px] truncate ${
                  activeDraft?.id === d.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>
        )}

        {activeDraft ? (
          <>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span>Jenis: {activeDraft.kind}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Diperbarui: {activeDraft.updatedAt}</span>
              {activeDraft.sources.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Sumber: {activeDraft.sources.join(", ")}</span>
                </>
              )}
            </div>

            <textarea
              rows={15}
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              aria-label="Isi draf"
              className="w-full px-4 py-3 text-sm leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEditor}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap shrink-0"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Simpan Perubahan</span>
                </button>
                {drafts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteDraft(activeDraft.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(["txt", "md", "eml"] as const).map((ext) => (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => handleExport(ext)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>.{ext}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500 py-10 text-center">
            Belum ada draf. Isi formulir di sebelah kiri untuk membuat draf pertama Anda.
          </p>
        )}
      </section>
    </div>
  );
}
