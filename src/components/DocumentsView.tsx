import { BookmarkPlus, FilePlus2, FileText, MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { LocalDocument, SavedMemory } from "../types/jarvis";

interface DocumentsViewProps {
  documents: LocalDocument[];
  memories: SavedMemory[];
  onAddDocument: (doc: Omit<LocalDocument, "id" | "hash" | "updatedAt">) => void;
  onDeleteDocument: (id: string) => void;
  onAddMemory: (mem: Omit<SavedMemory, "id" | "updatedAt">) => void;
  onDeleteMemory: (id: string) => void;
  onUseDocInChat: (docId: string) => void;
  onUseDocInDraft: (docId: string) => void;
}

export default function DocumentsView({
  documents,
  memories,
  onAddDocument,
  onDeleteDocument,
  onAddMemory,
  onDeleteMemory,
  onUseDocInChat,
  onUseDocInDraft,
}: DocumentsViewProps) {
  const [query, setQuery] = useState("");
  const [filterKind, setFilterKind] = useState<"semua" | "dokumen" | "memori">("semua");

  const [docTitle, setDocTitle] = useState("");
  const [docKind, setDocKind] = useState<"md" | "txt" | "catatan">("md");
  const [docContent, setDocContent] = useState("");

  const [memTitle, setMemTitle] = useState("");
  const [memSource, setMemSource] = useState("Catatan Pribadi");
  const [memContent, setMemContent] = useState("");

  const filteredDocs = useMemo(() => {
    if (filterKind === "memori") return [];
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
    );
  }, [documents, query, filterKind]);

  const filteredMemories = useMemo(() => {
    if (filterKind === "dokumen") return [];
    const q = query.trim().toLowerCase();
    if (!q) return memories;
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q)
    );
  }, [memories, query, filterKind]);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;
    onAddDocument({
      title: docTitle.trim(),
      kind: docKind,
      folder: "C:\\Users\\Dokumen\\SISTER",
      content: docContent.trim(),
    });
    setDocTitle("");
    setDocContent("");
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim() || !memContent.trim()) return;
    onAddMemory({
      title: memTitle.trim(),
      source: memSource.trim() || "Catatan Pribadi",
      content: memContent.trim(),
    });
    setMemTitle("");
    setMemContent("");
  };

  return (
    <div className="space-y-6">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Pencarian Terpadu Dokumen &amp; Memori
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cari kata kunci di seluruh berkas terindeks dan pengetahuan tersimpan Anda.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {(
              [
                ["semua", "Semua"],
                ["dokumen", "Dokumen"],
                ["memori", "Memori"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setFilterKind(val)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  filterKind === val
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci pencarian (misal: Ollama, setup.ps1, rapat, Asia/Jakarta)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Dokumen Terindeks (<span className="tabular-nums">{filteredDocs.length}</span>)
            </h3>
          </div>

          <form
            onSubmit={handleCreateDocument}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <FilePlus2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Tambah Dokumen / Catatan Baru</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_110px] gap-2.5">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Judul berkas (misal: Catatan Proyek.md)"
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={docKind}
                onChange={(e) => setDocKind(e.target.value as "md" | "txt" | "catatan")}
                aria-label="Jenis dokumen"
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="md">.md</option>
                <option value="txt">.txt</option>
                <option value="catatan">Catatan</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Tempel isi teks atau catatan dokumen di sini..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
            />
            <button
              type="submit"
              disabled={!docTitle.trim() || !docContent.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0"
            >
              Simpan ke Indeks Dokumen
            </button>
          </form>

          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Tidak ada dokumen yang cocok dengan pencarian Anda.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <article
                  key={doc.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        {doc.folder} · SHA {doc.hash} · {doc.updatedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteDocument(doc.id)}
                      aria-label={`Hapus ${doc.title}`}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-4">
                    {doc.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUseDocInChat(doc.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Gunakan di Chat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUseDocInDraft(doc.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Gunakan di Draf</span>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Memori Tersimpan (<span className="tabular-nums">{filteredMemories.length}</span>)
            </h3>
          </div>

          <form
            onSubmit={handleCreateMemory}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <BookmarkPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Simpan Pengetahuan / Memori Baru</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={memTitle}
                onChange={(e) => setMemTitle(e.target.value)}
                placeholder="Judul memori (misal: Jadwal Rapat Rutin)"
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                value={memSource}
                onChange={(e) => setMemSource(e.target.value)}
                placeholder="Sumber informasi"
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <textarea
              rows={3}
              value={memContent}
              onChange={(e) => setMemContent(e.target.value)}
              placeholder="Fakta atau preferensi yang ingin selalu diingat oleh SISTER saat Anda bertanya..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
            />
            <button
              type="submit"
              disabled={!memTitle.trim() || !memContent.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0"
            >
              Simpan Memori
            </button>
          </form>

          <div className="space-y-3">
            {filteredMemories.length === 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Belum ada memori tersimpan yang sesuai pencarian.
              </div>
            ) : (
              filteredMemories.map((mem) => (
                <article
                  key={mem.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {mem.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Sumber: {mem.source} · {mem.updatedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteMemory(mem.id)}
                      aria-label={`Hapus memori ${mem.title}`}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {mem.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
