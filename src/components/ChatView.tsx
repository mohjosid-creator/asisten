import {
  Download,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  Search,
  Send,
  Square,
  Trash2,
  Volume2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { NEURO_DOMAINS } from "../data/neuroReposData";
import { CHAT_SKILLS } from "../data/seedData";
import type {
  ChatConversation,
  ChatMessage,
  ConnectionMode,
  LocalDocument,
  PageId,
  SavedMemory,
  TaskItem,
} from "../types/jarvis";
import { runOfflineChat } from "../utils/offlineOrchestrator";
import { formatProfessionalNumberedText } from "../utils/textFormatter";
import {
  isGoogleSpeechRecognitionSupported,
  speakIndonesianText,
  startGoogleIndonesianVoiceCommand,
  stopSpeaking,
} from "../utils/voiceEngine";

interface ChatViewProps {
  conversations: ChatConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversation: (conv: ChatConversation) => void;
  documents: LocalDocument[];
  memories: SavedMemory[];
  tasks: TaskItem[];
  attachedDocIds: string[];
  onToggleAttachDoc: (docId: string) => void;
  userName: string;
  connectionMode: ConnectionMode;
  onChangeConnectionMode: (mode: ConnectionMode) => void;
  activeNeuroDomainIds: string[];
  autoSpeakOffline: boolean;
  ttsVoiceName: string;
  ttsRate: number;
  onNavigate: (page: PageId) => void;
  onToggleFocusMode: () => void;
}

export default function ChatView({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onUpdateConversation,
  documents,
  memories,
  tasks,
  attachedDocIds,
  onToggleAttachDoc,
  userName,
  connectionMode,
  onChangeConnectionMode,
  activeNeuroDomainIds,
  autoSpeakOffline,
  ttsVoiceName,
  ttsRate,
  onNavigate,
  onToggleFocusMode,
}: ChatViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [includeMemories, setIncludeMemories] = useState(true);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const stopRecRef = useRef<(() => void) | null>(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null,
    [conversations, activeConversationId]
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const activeSkill = useMemo(
    () => CHAT_SKILLS.find((s) => s.id === activeConv?.skillId) ?? CHAT_SKILLS[0],
    [activeConv]
  );

  const attachedDocs = useMemo(
    () => documents.filter((d) => attachedDocIds.includes(d.id)),
    [documents, attachedDocIds]
  );

  const activeDomains = useMemo(
    () => NEURO_DOMAINS.filter((d) => activeNeuroDomainIds.includes(d.id)),
    [activeNeuroDomainIds]
  );

  const handleSkillChange = (skillId: string) => {
    if (!activeConv) return;
    onUpdateConversation({
      ...activeConv,
      skillId,
    });
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }
    setVoiceNotice(null);
    speakIndonesianText(text, {
      preferredVoiceName: ttsVoiceName,
      rate: ttsRate,
      preferLocalOnly: connectionMode === "offline",
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onFallbackNotice: (notice) => setVoiceNotice(notice),
    });
  };

  const tryHandleVoiceDirective = (spoken: string): boolean => {
    const lower = spoken.toLowerCase();
    if (lower.includes("mode offline")) {
      onChangeConnectionMode("offline");
      setVoiceNotice("Perintah suara dijalankan: beralih ke Mode Offline Penuh.");
      return true;
    }
    if (lower.includes("mode online")) {
      onChangeConnectionMode("online");
      setVoiceNotice("Perintah suara dijalankan: beralih ke Mode Online.");
      return true;
    }
    if (lower.includes("buka panduan") || lower.includes("panduan instalasi")) {
      onNavigate("install");
      return true;
    }
    if (lower.includes("buka neuro") || lower.includes("buka orkestrator")) {
      onNavigate("neuro");
      return true;
    }
    if (lower.includes("buka tugas") || lower.includes("buka rencana")) {
      onNavigate("tasks");
      return true;
    }
    if (lower.includes("mode fokus")) {
      onToggleFocusMode();
      setVoiceNotice("Perintah suara dijalankan: Mode Fokus diperbarui.");
      return true;
    }
    return false;
  };

  const handleToggleVoiceCommand = () => {
    if (connectionMode === "offline") {
      setVoiceNotice(
        "Perintah Suara Google ID hanya aktif pada Mode Online. Di Mode Offline, gunakan TTS Bahasa Indonesia untuk mendengarkan jawaban atau gunakan tombol perintah cepat."
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
        "Browser belum mendukung Google Web Speech Recognition (id-ID). Gunakan Chrome atau Edge saat online."
      );
      return;
    }

    setVoiceNotice("Mendengarkan perintah suara Bahasa Indonesia (Google ID)...");
    setIsListening(true);
    stopRecRef.current = startGoogleIndonesianVoiceCommand({
      onInterim: (interim) => setInputText(interim),
      onFinal: (finalText) => {
        const handled = tryHandleVoiceDirective(finalText);
        if (!handled) {
          setInputText(finalText);
          setVoiceNotice(`Perintah suara diterima: "${finalText}"`);
        }
      },
      onError: (msg) => setVoiceNotice(msg),
      onEnd: () => setIsListening(false),
    });
  };

  const sendMessageContent = async (rawText: string) => {
    if (!activeConv || !rawText.trim() || isSending) return;

    const trimmed = rawText.trim();
    const nowTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: nowTime,
      attachedDocTitles: attachedDocs.map((d) => d.title),
    };

    const nextMessages = [...activeConv.messages, userMessage];
    const nextTitle =
      activeConv.messages.length <= 1 && activeConv.title === "Percakapan Baru"
        ? trimmed.slice(0, 48) + (trimmed.length > 48 ? "..." : "")
        : activeConv.title;

    const updatedWithUser: ChatConversation = {
      ...activeConv,
      title: nextTitle,
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      messages: nextMessages,
    };

    onUpdateConversation(updatedWithUser);
    setInputText("");
    setErrorMsg(null);
    setVoiceNotice(null);

    if (connectionMode === "offline") {
      const offlineReply = runOfflineChat({
        query: trimmed,
        documents: attachedDocs.length > 0 ? attachedDocs : documents,
        memories: includeMemories ? memories : [],
        tasks,
        activeDomainIds: activeNeuroDomainIds,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: offlineReply,
        createdAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      onUpdateConversation({
        ...updatedWithUser,
        updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        messages: [...nextMessages, assistantMessage],
      });

      if (autoSpeakOffline) {
        handleSpeakMessage(assistantMessage.id, offlineReply);
      }
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          skillPrompt: activeSkill.prompt,
          memories: includeMemories
            ? memories.map((m) => ({ title: m.title, content: m.content, source: m.source }))
            : [],
          attachedDocs: attachedDocs.map((d) => ({
            title: d.title,
            content: d.content,
            hash: d.hash,
          })),
          activeDomains: activeDomains.map((d) => ({
            name: d.name,
            orchestrationFocus: d.orchestrationFocus,
            repos: d.repos.slice(0, 3).map((r) => r.repo),
          })),
          userName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungi layanan AI.");
      }

      const cleanReply = formatProfessionalNumberedText(data.reply);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: cleanReply,
        createdAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      onUpdateConversation({
        ...updatedWithUser,
        updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        messages: [...nextMessages, assistantMessage],
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi gangguan saat mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageContent(inputText);
  };

  const handleExportMarkdown = () => {
    if (!activeConv) return;
    const lines = [
      `Judul: ${activeConv.title}`,
      `Diperbarui: ${activeConv.updatedAt}`,
      `Skill: ${activeSkill.name}`,
      "",
      ...activeConv.messages.map(
        (m) => `${m.role === "assistant" ? "Jarvis" : userName} (${m.createdAt}):\n${m.content}\n`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeConv.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-5 items-start">
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Riwayat Percakapan
          </h2>
          <button
            type="button"
            onClick={onCreateConversation}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Baru</span>
          </button>
        </div>

        <div className="relative">
          <Search
            className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan..."
            aria-label="Cari percakapan"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-1 max-h-[440px] overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
              Tidak ada percakapan yang cocok.
            </p>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`group flex items-start justify-between gap-2 p-2.5 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectConversation(conv.id)}
                    className="flex-1 text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  >
                    <span className="block text-xs font-medium truncate">{conv.title}</span>
                    <span className="block mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {conv.messages.length} pesan · {conv.updatedAt}
                    </span>
                  </button>
                  {conversations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteConversation(conv.id)}
                      aria-label={`Hapus ${conv.title}`}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl flex flex-col min-h-[620px]">
        {activeConv ? (
          <>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {activeConv.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {connectionMode === "offline"
                    ? "Mode Offline Penuh (Mesin Lokal + TTS ID)"
                    : "Mode Online (AI + Voice Google ID)"}{" "}
                  · Skill: {activeSkill.name} ·{" "}
                  <span className="tabular-nums">{activeDomains.length}</span> bidang neuro aktif
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onChangeConnectionMode("online")}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      connectionMode === "online"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Wifi className="w-3 h-3" aria-hidden="true" />
                    <span>Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeConnectionMode("offline")}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      connectionMode === "offline"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <WifiOff className="w-3 h-3" aria-hidden="true" />
                    <span>Offline</span>
                  </button>
                </div>

                <select
                  aria-label="Pilih skill asisten"
                  value={activeConv.skillId}
                  onChange={(e) => handleSkillChange(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {CHAT_SKILLS.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowContextPanel((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    showContextPanel || attachedDocs.length > 0
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Konteks ({attachedDocs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ekspor</span>
                </button>
              </div>
            </div>

            {showContextPanel && (
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Konteks Tambahan untuk Pesan Berikutnya
                  </span>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMemories}
                      onChange={(e) => setIncludeMemories(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span>Sertakan Memori Tersimpan ({memories.length})</span>
                  </label>
                </div>

                {documents.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Belum ada dokumen. Tambahkan catatan di menu Dokumen &amp; Memori.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents.map((doc) => {
                      const checked = attachedDocIds.includes(doc.id);
                      return (
                        <label
                          key={doc.id}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggleAttachDoc(doc.id)}
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                          />
                          <span className="min-w-0">
                            <span className="block font-medium text-slate-900 dark:text-slate-100 truncate">
                              {doc.title}
                            </span>
                            <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              Hash: {doc.hash}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[460px]">
              {activeConv.messages.map((msg) => {
                const isUser = msg.role === "user";
                const cleanBody = isUser
                  ? msg.content
                  : formatProfessionalNumberedText(msg.content);
                const isSpeakingThis = speakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {cleanBody}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>{isUser ? userName : "Jarvis"}</span>
                      <span aria-hidden="true">·</span>
                      <span>{msg.createdAt}</span>
                      {!isUser && (
                        <>
                          <span aria-hidden="true">·</span>
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.id, cleanBody)}
                            className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {isSpeakingThis ? (
                              <>
                                <Square className="w-3 h-3" aria-hidden="true" />
                                <span>Hentikan TTS</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" aria-hidden="true" />
                                <span>
                                  {connectionMode === "offline"
                                    ? "Bacakan TTS Offline (ID)"
                                    : "Bacakan (ID)"}
                                </span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                      {msg.attachedDocTitles && msg.attachedDocTitles.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Lampiran: {msg.attachedDocTitles.join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-start">
                  <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    Jarvis sedang menyusun jawaban bernomor...
                  </div>
                </div>
              )}
            </div>

            {voiceNotice && (
              <div className="mx-5 mb-2 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-800 dark:text-amber-200">
                {voiceNotice}
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mx-5 mb-3 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 text-xs text-red-700 dark:text-red-300"
              >
                {errorMsg}
              </div>
            )}

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              {connectionMode === "offline" && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 mr-1">
                    Perintah Cepat Offline:
                  </span>
                  {[
                    "Susun rencana orkestrasi keamanan & CVE",
                    "Cek ringkasan arsitektur Jarvis Local",
                    "Siapkan langkah otomasi Windows & MySQL",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => sendMessageContent(cmd)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2.5">
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={
                    connectionMode === "offline"
                      ? "Tulis pertanyaan offline (diproses mesin lokal + dibacakan TTS Indonesia)..."
                      : "Tulis atau ucapkan perintah dengan Voice Google ID... (Enter untuk kirim)"
                  }
                  className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleVoiceCommand}
                    title={
                      connectionMode === "online"
                        ? "Perintah Suara Google Bahasa Indonesia"
                        : "Voice Command Google ID membutuhkan Mode Online"
                    }
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      isListening
                        ? "border-red-600 bg-red-600 text-white"
                        : connectionMode === "offline"
                          ? "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                          : "border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Berhenti</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Suara ID</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>{isSending ? "Mengirim..." : "Kirim"}</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            Pilih atau buat percakapan baru untuk memulai.
          </div>
        )}
      </section>
    </div>
  );
}
