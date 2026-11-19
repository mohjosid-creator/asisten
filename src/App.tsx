import { Moon, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import ChatView from "./components/ChatView";
import DocumentsView from "./components/DocumentsView";
import DraftsView from "./components/DraftsView";
import InstallGuideView from "./components/InstallGuideView";
import NeuroOrchestratorView from "./components/NeuroOrchestratorView";
import OverviewView from "./components/OverviewView";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import TasksView from "./components/TasksView";
import { NEURO_DOMAINS } from "./data/neuroReposData";
import {
  DEFAULT_SETTINGS,
  INITIAL_CONVERSATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_DRAFTS,
  INITIAL_MEMORIES,
  INITIAL_STYLE_PROFILE,
  INITIAL_TASKS,
  INITIAL_WRITING_SAMPLES,
} from "./data/seedData";
import type {
  AppSettings,
  ChatConversation,
  ConnectionMode,
  DraftItem,
  LocalDocument,
  PageId,
  SavedMemory,
  TaskItem,
  WritingSample,
} from "./types/jarvis";

const STORAGE_KEY = "jarvis_indonesia_workspace_v1";

interface WorkspaceState {
  settings: AppSettings;
  conversations: ChatConversation[];
  documents: LocalDocument[];
  memories: SavedMemory[];
  drafts: DraftItem[];
  styleProfile: string;
  samples: WritingSample[];
  tasks: TaskItem[];
}

function loadInitialState(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
        conversations: parsed.conversations?.length
          ? parsed.conversations
          : INITIAL_CONVERSATIONS,
        documents: parsed.documents ?? INITIAL_DOCUMENTS,
        memories: parsed.memories ?? INITIAL_MEMORIES,
        drafts: parsed.drafts ?? INITIAL_DRAFTS,
        styleProfile: parsed.styleProfile ?? INITIAL_STYLE_PROFILE,
        samples: parsed.samples ?? INITIAL_WRITING_SAMPLES,
        tasks: parsed.tasks ?? INITIAL_TASKS,
      };
    }
  } catch {
    // Gunakan data awal jika storage belum ada atau rusak
  }
  return {
    settings: DEFAULT_SETTINGS,
    conversations: INITIAL_CONVERSATIONS,
    documents: INITIAL_DOCUMENTS,
    memories: INITIAL_MEMORIES,
    drafts: INITIAL_DRAFTS,
    styleProfile: INITIAL_STYLE_PROFILE,
    samples: INITIAL_WRITING_SAMPLES,
    tasks: INITIAL_TASKS,
  };
}

function quickHash(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const PAGE_TITLES: Record<PageId, string> = {
  overview: "Ringkasan",
  chat: "Chat Asisten",
  neuro: "Neuro-Orkestrator",
  documents: "Dokumen & Memori",
  drafts: "Draf & Gaya Tulis",
  tasks: "Tugas & Rencana",
  install: "Panduan Instalasi Lokal",
};

export default function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadInitialState);
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [activeConversationId, setActiveConversationId] = useState<string>(
    () => workspace.conversations[0]?.id ?? ""
  );
  const [attachedDocIds, setAttachedDocIds] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // Abaikan jika penyimpanan browser dibatasi
    }
  }, [workspace]);

  useEffect(() => {
    const root = document.documentElement;
    if (workspace.settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [workspace.settings.theme]);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setAiConfigured(Boolean(data.configured)))
      .catch(() => setAiConfigured(false));
  }, []);

  const toggleTheme = () => {
    setWorkspace((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === "dark" ? "light" : "dark",
      },
    }));
  };

  const toggleFocusMode = () => {
    setWorkspace((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        focusMode: !prev.settings.focusMode,
      },
    }));
  };

  const handleChangeConnectionMode = (mode: ConnectionMode) => {
    setWorkspace((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        connectionMode: mode,
      },
    }));
  };

  const handleToggleNeuroDomain = (domainId: string) => {
    setWorkspace((prev) => {
      const current = prev.settings.activeNeuroDomainIds;
      const next = current.includes(domainId)
        ? current.filter((id) => id !== domainId)
        : [...current, domainId];
      return {
        ...prev,
        settings: {
          ...prev.settings,
          activeNeuroDomainIds: next,
        },
      };
    });
  };

  const handleEnableAllNeuroDomains = () => {
    setWorkspace((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        activeNeuroDomainIds: NEURO_DOMAINS.map((d) => d.id),
      },
    }));
  };

  const toggleAttachDoc = (docId: string) => {
    setAttachedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleCreateConversation = () => {
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: "Percakapan Baru",
      skillId: "umum",
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content:
            "1. Halo! Saya siap membantu Anda dalam Bahasa Indonesia.\n2. Silakan ketik pertanyaan atau gunakan tombol Suara ID saat Mode Online.",
          createdAt: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };
    setWorkspace((prev) => ({
      ...prev,
      conversations: [newConv, ...prev.conversations],
    }));
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    setWorkspace((prev) => {
      const remaining = prev.conversations.filter((c) => c.id !== id);
      if (activeConversationId === id && remaining[0]) {
        setActiveConversationId(remaining[0].id);
      }
      return { ...prev, conversations: remaining };
    });
  };

  const handleUpdateConversation = (updated: ChatConversation) => {
    setWorkspace((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleAddDocument = (doc: Omit<LocalDocument, "id" | "hash" | "updatedAt">) => {
    const created: LocalDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      hash: quickHash(doc.content),
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setWorkspace((prev) => ({
      ...prev,
      documents: [created, ...prev.documents],
    }));
  };

  const handleDeleteDocument = (id: string) => {
    setAttachedDocIds((prev) => prev.filter((x) => x !== id));
    setWorkspace((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  };

  const handleAddMemory = (mem: Omit<SavedMemory, "id" | "updatedAt">) => {
    const created: SavedMemory = {
      ...mem,
      id: `mem-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setWorkspace((prev) => ({
      ...prev,
      memories: [created, ...prev.memories],
    }));
  };

  const handleDeleteMemory = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const handleUseDocInChat = (docId: string) => {
    setAttachedDocIds((prev) => (prev.includes(docId) ? prev : [...prev, docId]));
    setActivePage("chat");
  };

  const handleUseDocInDraft = (docId: string) => {
    setAttachedDocIds((prev) => (prev.includes(docId) ? prev : [...prev, docId]));
    setActivePage("drafts");
  };

  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh: WorkspaceState = {
      settings: DEFAULT_SETTINGS,
      conversations: INITIAL_CONVERSATIONS,
      documents: INITIAL_DOCUMENTS,
      memories: INITIAL_MEMORIES,
      drafts: INITIAL_DRAFTS,
      styleProfile: INITIAL_STYLE_PROFILE,
      samples: INITIAL_WRITING_SAMPLES,
      tasks: INITIAL_TASKS,
    };
    setWorkspace(fresh);
    setActiveConversationId(fresh.conversations[0].id);
    setAttachedDocIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        theme={workspace.settings.theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setShowSettings(true)}
        focusMode={workspace.settings.focusMode}
        onToggleFocusMode={toggleFocusMode}
        connectionMode={workspace.settings.connectionMode}
        onChangeConnectionMode={handleChangeConnectionMode}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 min-w-0">
            <span className="truncate">Jarvis Lokal</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {PAGE_TITLES[activePage]}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ubah tema"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {workspace.settings.theme === "dark" ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Buka pengaturan"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActivePage(activePage === "install" ? "chat" : "install")}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {activePage === "install" ? "Buka Chat Asisten" : "Panduan Instalasi"}
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto">
          {activePage === "overview" && (
            <OverviewView
              userName={workspace.settings.userName}
              aiConfigured={aiConfigured}
              connectionMode={workspace.settings.connectionMode}
              onChangeConnectionMode={handleChangeConnectionMode}
              activeNeuroCount={workspace.settings.activeNeuroDomainIds.length}
              stats={{
                conversations: workspace.conversations.length,
                documents: workspace.documents.length,
                memories: workspace.memories.length,
                drafts: workspace.drafts.length,
                pendingTasks: workspace.tasks.filter((t) => !t.completed).length,
              }}
              onNavigate={setActivePage}
            />
          )}

          {activePage === "chat" && (
            <ChatView
              conversations={workspace.conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onCreateConversation={handleCreateConversation}
              onDeleteConversation={handleDeleteConversation}
              onUpdateConversation={handleUpdateConversation}
              documents={workspace.documents}
              memories={workspace.memories}
              tasks={workspace.tasks}
              attachedDocIds={attachedDocIds}
              onToggleAttachDoc={toggleAttachDoc}
              userName={workspace.settings.userName}
              connectionMode={workspace.settings.connectionMode}
              onChangeConnectionMode={handleChangeConnectionMode}
              activeNeuroDomainIds={workspace.settings.activeNeuroDomainIds}
              autoSpeakOffline={workspace.settings.autoSpeakOffline}
              ttsVoiceName={workspace.settings.ttsVoiceName}
              ttsRate={workspace.settings.ttsRate}
              onNavigate={setActivePage}
              onToggleFocusMode={toggleFocusMode}
            />
          )}

          {activePage === "neuro" && (
            <NeuroOrchestratorView
              connectionMode={workspace.settings.connectionMode}
              onChangeConnectionMode={handleChangeConnectionMode}
              activeDomainIds={workspace.settings.activeNeuroDomainIds}
              onToggleDomain={handleToggleNeuroDomain}
              onEnableAllDomains={handleEnableAllNeuroDomains}
              tasks={workspace.tasks}
              ttsVoiceName={workspace.settings.ttsVoiceName}
              ttsRate={workspace.settings.ttsRate}
            />
          )}

          {activePage === "documents" && (
            <DocumentsView
              documents={workspace.documents}
              memories={workspace.memories}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
              onUseDocInChat={handleUseDocInChat}
              onUseDocInDraft={handleUseDocInDraft}
            />
          )}

          {activePage === "drafts" && (
            <DraftsView
              drafts={workspace.drafts}
              onAddDraft={(d) =>
                setWorkspace((prev) => ({ ...prev, drafts: [d, ...prev.drafts] }))
              }
              onUpdateDraft={(updated) =>
                setWorkspace((prev) => ({
                  ...prev,
                  drafts: prev.drafts.map((d) => (d.id === updated.id ? updated : d)),
                }))
              }
              onDeleteDraft={(id) =>
                setWorkspace((prev) => ({
                  ...prev,
                  drafts: prev.drafts.filter((d) => d.id !== id),
                }))
              }
              documents={workspace.documents}
              attachedDocIds={attachedDocIds}
              onToggleAttachDoc={toggleAttachDoc}
              styleProfile={workspace.styleProfile}
              onSaveStyleProfile={(text) =>
                setWorkspace((prev) => ({ ...prev, styleProfile: text }))
              }
              personalStyleLabel={workspace.settings.personalStyleLabel}
              samples={workspace.samples}
              onAddSample={(name, text) =>
                setWorkspace((prev) => ({
                  ...prev,
                  samples: [...prev.samples, { id: `sample-${Date.now()}`, name, text }],
                }))
              }
              onDeleteSample={(id) =>
                setWorkspace((prev) => ({
                  ...prev,
                  samples: prev.samples.filter((s) => s.id !== id),
                }))
              }
            />
          )}

          {activePage === "tasks" && (
            <TasksView
              tasks={workspace.tasks}
              onAddTask={(t) =>
                setWorkspace((prev) => ({
                  ...prev,
                  tasks: [{ ...t, id: `task-${Date.now()}`, completed: false }, ...prev.tasks],
                }))
              }
              onToggleTask={(id) =>
                setWorkspace((prev) => ({
                  ...prev,
                  tasks: prev.tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                  ),
                }))
              }
              onDeleteTask={(id) =>
                setWorkspace((prev) => ({
                  ...prev,
                  tasks: prev.tasks.filter((t) => t.id !== id),
                }))
              }
              focusMode={workspace.settings.focusMode}
              onToggleFocusMode={toggleFocusMode}
              connectionMode={workspace.settings.connectionMode}
              ttsVoiceName={workspace.settings.ttsVoiceName}
              ttsRate={workspace.settings.ttsRate}
            />
          )}

          {activePage === "install" && <InstallGuideView />}
        </main>
      </div>

      {showSettings && (
        <SettingsModal
          settings={workspace.settings}
          onSave={(next) => setWorkspace((prev) => ({ ...prev, settings: next }))}
          onResetAllData={handleResetAll}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
