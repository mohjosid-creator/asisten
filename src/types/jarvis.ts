export type PageId =
  | "overview"
  | "chat"
  | "neuro"
  | "documents"
  | "drafts"
  | "tasks"
  | "install";

export interface ChatSkill {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  attachedDocTitles?: string[];
}

export interface ChatConversation {
  id: string;
  title: string;
  skillId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface LocalDocument {
  id: string;
  title: string;
  kind: "md" | "txt" | "catatan";
  folder: string;
  content: string;
  hash: string;
  updatedAt: string;
}

export interface SavedMemory {
  id: string;
  title: string;
  content: string;
  source: string;
  updatedAt: string;
}

export type DraftKind = "email" | "teks" | "jawaban" | "esai";

export interface WritingSample {
  id: string;
  name: string;
  text: string;
}

export interface DraftItem {
  id: string;
  kind: DraftKind;
  title: string;
  brief: string;
  content: string;
  sources: string[];
  updatedAt: string;
}

export type TaskPriority = "tinggi" | "sedang" | "rendah";

export interface TaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  reminderActive: boolean;
}

export type ConnectionMode = "online" | "offline";

export interface AppSettings {
  userName: string;
  timezone: string;
  personalStyleLabel: string;
  focusMode: boolean;
  theme: "light" | "dark";
  connectionMode: ConnectionMode;
  autoSpeakOffline: boolean;
  ttsVoiceName: string;
  ttsRate: number;
  activeNeuroDomainIds: string[];
}
