import {
  BookOpen,
  CheckSquare,
  Cpu,
  FileText,
  FolderSearch,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { ConnectionMode, PageId } from "../types/jarvis";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  connectionMode: ConnectionMode;
  onChangeConnectionMode: (mode: ConnectionMode) => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "chat", label: "Chat Asisten", icon: MessageSquare },
  { id: "neuro", label: "Neuro-Orkestrator", icon: Cpu },
  { id: "documents", label: "Dokumen & Memori", icon: FolderSearch },
  { id: "drafts", label: "Draf & Gaya Tulis", icon: FileText },
  { id: "tasks", label: "Tugas & Rencana", icon: CheckSquare },
  { id: "install", label: "Panduan Instalasi", icon: BookOpen },
];

export default function Sidebar({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenSettings,
  focusMode,
  onToggleFocusMode,
  connectionMode,
  onChangeConnectionMode,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
      <div>
        <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate("overview")}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
          >
            <span className="block text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Jarvis Lokal
            </span>
          </button>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Edisi Bahasa Indonesia · Windows &amp; Web
          </p>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:flex flex-col gap-2.5 p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Mode Operasi
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onChangeConnectionMode("online")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                connectionMode === "online"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Online</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeConnectionMode("offline")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                connectionMode === "offline"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Offline</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleFocusMode}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
            focusMode
              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <span>Mode Fokus</span>
          <span>{focusMode ? "Aktif" : "Nonaktif"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Gelap</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
